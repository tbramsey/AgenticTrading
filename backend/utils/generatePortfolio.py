import pandas as pd
from sympy import div, im, sec
from dotenv import load_dotenv
import requests
import os
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

load_dotenv()

def fetch_change(portfolio):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(BASE_DIR, "../data/stock_data.csv")

    df = pd.read_csv(file_path)

    result = []

    for symbol, *_ in portfolio:
        row = df[df["symbol"] == symbol]

        if not row.empty:
            price = float(row.iloc[0]["price"])
            change = float(row.iloc[0]["change"])

            result.append([symbol, price, change])

    return result


def learn_roi_weights(market_data, price_data):
    rows = []

    for _, info in market_data.iterrows():
        symbol = info["symbol"]

        if symbol not in price_data:
            continue

        # Get the price series for THIS symbol
        symbol_prices = price_data[symbol].dropna()

        if len(symbol_prices) == 0:
            continue

        # Convert index to datetime
        symbol_prices.index = pd.to_datetime(symbol_prices.index, format="%m/%d/%Y")

        # Sort ascending
        symbol_prices = symbol_prices.sort_index()

        # Target date
        target_date = "1/31/2025"

        future_index_price = symbol_prices.iloc[-1]

        # Price ON that date
        try:
            current_index_price = symbol_prices.loc[target_date]
        except KeyError:
            # Or nearest previous
            current_index_price = future_index_price

        # Future price = most recent
        

        # Compute return
        future_return = (future_index_price / current_index_price) - 1

        

        current_price = info.get("price", 0)
        pe = info.get("pe_ratio", 0)
        peg = info.get("peg_ratio", 0)
        roe = info.get("return_on_equity_ttm", 0)
        pm = info.get("profit_margin", 0)
        growth = info.get("quarterly_earnings_growth_yoy", 0)
        beta = info.get("beta", 1)
        dy = info.get("dividend_yield", 0)
        debt_ratio = info.get("price_to_book_ratio", 0)

        target_price = info.get("analyst_target_price") or 0
        rating_strong_buy = info.get("analyst_rating_strong_buy") or 0
        rating_buy = info.get("analyst_rating_buy") or 0
        rating_hold = info.get("analyst_rating_hold") or 0
        rating_sell = info.get("analyst_rating_sell") or 0
        rating_strong_sell = info.get("analyst_rating_strong_sell") or 0

        fifty_two_week_high = info.get("fifty_two_week_high") or 0
        fifty_two_week_low = info.get("fifty_two_week_low") or 0
        fifty_day_ma = info.get("fifty_day_moving_average") or 0
        two_hundred_day_ma = info.get("two_hundred_day_moving_average") or 0

        value_score = max(0, min(100, 100 - (pe if pe > 0 else 50)))               # lower PE = better
        growth_score = max(0, min(100, growth * 300))                              # higher growth = better
        profitability_score = max(0, min(100, (roe * 400) + (pm * 200)))           # ROE + profit margin
        dividend_score = max(0, min(100, dy * 8000))                               # 2% yield → 16 pts, 5% → 40 pts
        risk_score = max(0, min(100, 100 - abs(beta - 1) * 100))                   # beta ~1 = stable
        stability_score = max(0, min(100, 100 - (debt_ratio - 1) * 50))            # lower P/B = safer

        target_score = max(0, min(100, target_price/current_price)) 

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

        #print("sentiment_score: ", sentiment_score)

        # --- Range Score ---
        if fifty_two_week_high > 0 and fifty_two_week_low > 0:
            rpos = (current_price - fifty_two_week_low) / (fifty_two_week_high - fifty_two_week_low)
            range_score = max(0, min(100, rpos * 100))
        else:
            range_score = 50

        #print("range_score:", range_score)

        # --- Trend Score ---
        if fifty_day_ma > 0 and two_hundred_day_ma > 0:
            ratio = fifty_day_ma / two_hundred_day_ma
            trend_score = max(0, min(100, (ratio - 0.9) * 500))
        else:
            trend_score = 50

        #print("trend_score:", trend_score)


        rows.append({
            "value_score": value_score,
            "profitability_score": profitability_score,
            "growth_score": growth_score,
            "dividend_score": dividend_score,
            "trend_score": trend_score,
            "future_return": future_return,
            "risk_score": risk_score,
            "stability_score": stability_score,
            "sentiment_score": sentiment_score,
            "target_score": target_score,
            "range_score": range_score
        })


    df = pd.DataFrame(rows)
    if len(df) < 10:
        print("⚠️ Not enough data to train — using default weights.")
        return {"value_score": 0.3, "profitability_score": 0.3,
                "growth_score": 0.2, "dividend_score": 0.1, "trend_score": 0.1}

    X = df[["value_score", "profitability_score", "growth_score", "dividend_score", "trend_score", "risk_score", "sentiment_score", "target_score", "range_score"]].copy()
    y = df["future_return"].copy()

    valid_mask = (
        y.notna() &
        np.isfinite(y) &
        X.notna().all(axis=1) &
        np.isfinite(X).all(axis=1)
    )
    X = X[valid_mask]
    y = y[valid_mask]

    model = LinearRegression()
    model.fit(X, y)

    weights = model.coef_
    weight_dict = dict(zip(X.columns, weights / np.sum(np.abs(weights))))
    return weight_dict

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

    target_price = info.get("analyst_target_price") or 0
    rating_strong_buy = info.get("analyst_rating_strong_buy") or 0
    rating_buy = info.get("analyst_rating_buy") or 0
    rating_hold = info.get("analyst_rating_hold") or 0
    rating_sell = info.get("analyst_rating_sell") or 0
    rating_strong_sell = info.get("analyst_rating_strong_sell") or 0

    fifty_two_week_high = info.get("fifty_two_week_high") or 0
    fifty_two_week_low = info.get("fifty_two_week_low") or 0
    fifty_day_ma = info.get("fifty_day_moving_average") or 0
    two_hundred_day_ma = info.get("two_hundred_day_moving_average") or 0

    # Sub-scores (0–100 each)
    value_score = max(0, min(100, 100 - (pe if pe > 0 else 50)))               # lower PE = better
    growth_score = max(0, min(100, growth * 300))                              # higher growth = better
    profitability_score = max(0, min(100, (roe * 400) + (pm * 200)))           # ROE + profit margin
    dividend_score = max(0, min(100, dy * 8000))                               # 2% yield → 16 pts, 5% → 40 pts
    risk_score = max(0, min(100, 100 - abs(beta - 1) * 100))                   # beta ~1 = stable
    stability_score = max(0, min(100, 100 - (debt_ratio - 1) * 50))            # lower P/B = safer

    target_score = max(0, min(100, target_price/price)) 

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

    print("sentiment_score: ", sentiment_score)

    # --- Range Score ---
    if fifty_two_week_high > 0 and fifty_two_week_low > 0:
        rpos = (price - fifty_two_week_low) / (fifty_two_week_high - fifty_two_week_low)
        range_score = max(0, min(100, rpos * 100))
    else:
        range_score = 50

    print("range_score:", range_score)

    # --- Trend Score ---
    if fifty_day_ma > 0 and two_hundred_day_ma > 0:
        ratio = fifty_day_ma / two_hundred_day_ma
        trend_score = max(0, min(100, (ratio - 0.9) * 500))
    else:
        trend_score = 50

    print("trend_score:", trend_score)


    # Weighted average
    total_roi = (
        value_score * 0.3 +
        profitability_score * 0.3 +
        growth_score * 0.2 +
        dividend_score * 0.1 +
        trend_score *0.1
    )


    total_risk = (
        0.35 * risk_score +
        0.30 * stability_score +
        0.15 * sentiment_score +
        0.20 * range_score
    )


    return pd.Series([round(total_roi, 2), round(total_risk, 2)])

def make_portfolio(diversification, max_risk, sectors):
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

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(BASE_DIR, "../data/stock_data.csv")
    stock_df = pd.read_csv(file_path)
    #stock_df = pd.read_csv("backend/data/stock_data.csv")

    stock_df[["roiScore", "riskScore"]] = stock_df.apply(score_stock, axis=1)

    if max_risk < 35:
        max_risk = 35

    stock_df = stock_df[stock_df["riskScore"] < max_risk]
    stock_df = stock_df[stock_df["sector"].isin(sectors)]
    stock_df = stock_df.sort_values("roiScore", ascending=False)

    weights = np.logspace(0, -0.5, num_stocks)  # log scale from 10^0 to 10^-1
    weights = weights / np.sum(weights) * 100  # normalize to sum to 100%

    for (row, weight) in zip(stock_df.head(num_stocks).itertuples(), weights):
        weight = int(weight)
        print(f"{row.symbol}: {row.roiScore}, Weight: {weight}%")
        portfolio.append((row.symbol, weight, row.description, row.sector))
    
    #print(stock_df["sector"].unique())

    return portfolio

def fetch_stockprices(portfolio, startdate):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(BASE_DIR, "../data/stockprices.csv")

    df = pd.read_csv(file_path)

    df['date'] = pd.to_datetime(df['date'])
    df = df.set_index('date')

    df = df[df.index >= pd.Timestamp(startdate)]

    df["portfolio_value"] = 0.0

    for symbol, weight, *_ in portfolio:
        if symbol not in df.columns:
            print(f"Missing: {symbol}")
            continue

        prices = df[symbol].dropna()
        if prices.empty:
            continue

        first_price = prices.iloc[0]
        current_price = prices.iloc[-1]

        df["portfolio_value"] += (((df[symbol] - first_price) / first_price) * weight)

    return df.reset_index()


# if __name__ == "__main__":
#     INPUT_CSV = "../data/stock_data.csv"
#     market_data = pd.read_csv(INPUT_CSV)
#     STOCK_CSV = "../data/stockprices.csv"
#     stockprices = pd.read_csv(STOCK_CSV)
#     stockprices["date"] = pd.to_datetime(stockprices["date"], format="%m/%d/%Y")
#     stockprices = stockprices.set_index("date")

#     print(learn_roi_weights(market_data, stockprices))





      