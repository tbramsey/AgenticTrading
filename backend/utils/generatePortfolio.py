import pandas as pd
from sympy import div, im
from dotenv import load_dotenv
import requests
import os
import numpy as np

load_dotenv()


def score_stock(info):
    # Normalize key metrics safely
    symbol = info.get("symbol")
    price = info.get("price", 0)    
    sector = info.get("sector", "Unknown")
    pe = info.get("pe_ratio", 0)
    peg = info.get("peg_ratio", 0)
    roe = info.get("return_on_equity_ttm", 0)
    pm = info.get("profit_margin", 0)
    growth = info.get("quarterly_earnings_growth_yoy", 0)
    beta = info.get("beta", 1)
    dy = info.get("dividend_yield", 0)
    debt_ratio = info.get("price_to_book_ratio", 0)

    target_price = info.get("AnalystTargetPrice") or 0
    rating_strong_buy = info.get("AnalystRatingStrongBuy") or 0
    rating_buy = info.get("AnalystRatingBuy") or 0
    rating_hold = info.get("AnalystRatingHold") or 0
    rating_sell = info.get("AnalystRatingSell") or 0
    rating_strong_sell = info.get("AnalystRatingStrongSell") or 0

    fifty_two_week_high = info.get("52WeekHigh") or 0
    fifty_two_week_low = info.get("52WeekLow") or 0
    fifty_day_ma = info.get("50DayMovingAverage") or 0
    two_hundred_day_ma = info.get("200DayMovingAverage") or 0
    
    # Sub-scores (0–100 each)
    value_score = max(0, min(100, 100 - (pe if pe > 0 else 50)))               # lower PE = better
    growth_score = max(0, min(100, growth * 300))                              # higher growth = better
    profitability_score = max(0, min(100, (roe * 400) + (pm * 200)))           # ROE + profit margin
    dividend_score = max(0, min(100, dy * 8000))                               # 2% yield → 16 pts, 5% → 40 pts
    risk_score = max(0, min(100, 100 - abs(beta - 1) * 100))                   # beta ~1 = stable
    stability_score = max(0, min(100, 100 - (debt_ratio - 1) * 50))            # lower P/B = safer

    # Analyst sentiment: normalize across 0–100
    total_ratings = rating_strong_buy + rating_buy + rating_hold + rating_sell + rating_strong_sell
    if total_ratings > 0:
        sentiment_score = max(
            0,
            min(
                100,
                ((rating_strong_buy * 5 + rating_buy * 4 + rating_hold * 3 +
                  rating_sell * 2 + rating_strong_sell * 1) / (total_ratings * 5)) * 100,
            ),
        )
    else:
        sentiment_score = 50  # neutral if missing

    # Technicals: compare price to moving averages and 52-week range
    if fifty_two_week_high > 0 and fifty_two_week_low > 0:
        range_position = (price - fifty_two_week_low) / (fifty_two_week_high - fifty_two_week_low)
        range_score = max(0, min(100, (1 - abs(range_position - 0.5)) * 200))
    else:
        range_score = 50



    if fifty_day_ma > 0 and two_hundred_day_ma > 0:
        trend_score = max(0, min(100, (fifty_day_ma / two_hundred_day_ma) * 100))
    else:
        trend_score = 50

    # Weighted average
    total_roi = (
        0.3 * value_score +
        0.3 * profitability_score +
        0.2 * growth_score +
        0.1 * dividend_score +
        0.1 * trend_score
    )

    total_risk = (
        0.35 * risk_score +
        0.30 * stability_score +
        0.15 * sentiment_score +
        0.20 * range_score
    )


    return pd.Series([round(total_roi, 2), round(total_risk, 2)])

def make_portfolio(diversification, max_risk):
    if diversification > 90 and diversification <= 100:
        num_stocks = 35
    elif diversification > 80:
        num_stocks = 30
    elif diversification > 70:
        num_stocks = 25
    elif diversification > 60:
        num_stocks = 20
    elif diversification > 50:
        num_stocks = 15
    elif diversification > 40:
        num_stocks = 10
    elif diversification > 20:
        num_stocks = 8
    elif diversification >= 0:
        num_stocks = 5

    portfolio = []

    stock_df = pd.read_csv("backend/data/stock_data.csv")

    stock_df[["roiScore", "riskScore"]] = stock_df.apply(score_stock, axis=1)
    stock_df = stock_df[stock_df["riskScore"] < max_risk]
    stock_df = stock_df.sort_values("roiScore", ascending=False)

    weights = np.logspace(0, -0.5, num_stocks)  # log scale from 10^0 to 10^-1
    weights = weights / np.sum(weights) * 100  # normalize to sum to 100%

    for (row, weight) in zip(stock_df.head(num_stocks).itertuples(), weights):
        weight = int(weight)
        print(f"{row.symbol}: {row.roiScore}, Weight: {weight}%")
        portfolio.append((row.symbol, weight))
    
    return portfolio

if __name__ == "__main__":
    portfolio = make_portfolio(diversification=50, max_risk=50)
    print("\nGenerated Portfolio:")
    for symbol, weight in portfolio:
        print(f"{symbol}: {weight}%")


      