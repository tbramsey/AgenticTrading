from calendar import c
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from datetime import datetime, timedelta, timezone
import pandas as pd
import yfinance as yf
import time
import traceback
import requests

API_KEY = os.getenv("ALPACA_API_KEY")
API_SECRET = os.getenv("ALPACA_API_SECRET")

client = StockHistoricalDataClient(API_KEY, API_SECRET)

FMP_KEY = os.getenv("FMP_API_KEY")
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")

def safe_float(value, default=0.0):
    try:
        if value in (None, "None", "-", ""):
            return default
        return float(value)
    except (ValueError, TypeError):
        return default


def safe_int(value, default=0):
    try:
        if value in (None, "None", "-", ""):
            return default
        return int(float(value))
    except (ValueError, TypeError):
        return default


def update_stock_data(symbol, stock_info, filename="stock_data.csv"):
    # Create DataFrame from the new info
    new_data = pd.DataFrame([{ "symbol": symbol, **stock_info }])

    # If the file doesn't exist, create it
    if not os.path.exists(filename):
        new_data.to_csv(filename, index=False)
        print(f"Created {filename} with {symbol}")
        return

    # Otherwise, read existing data
    df = pd.read_csv(filename)

    # Check if the symbol exists already
    if symbol in df["symbol"].values:
        df.loc[df["symbol"] == symbol, list(stock_info.keys())] = list(stock_info.values())
        print(f"Updated data for {symbol}")
    else:
        df = pd.concat([df, new_data], ignore_index=True)
        print(f"Added new data for {symbol}")

    df.to_csv(filename, index=False)

def score_stock(current_revenue_growth, past_revenue_growth, pe_ratio, dividend_yield, debt_to_equity=None):
    """
    Returns a dict with 1–100 scores for each metric and total score.
    All inputs should be numeric (e.g., 0.08 for 8%).
    """

    # --- Revenue Growth (higher = better)
    current_rev_score = min(max((100 * (100 * current_revenue_growth / 50) ** 0.7), 0), 100)
    past_rev_score = min(max((100 * (100 * past_revenue_growth / 50) ** 0.7), 0), 100)

    # --- PE Ratio (sweet spot near 20)
    pe_score = 100 - abs((pe_ratio - 20) / 20 * 100)
    pe_score = max(min(pe_score, 100), 0)

    # --- Dividend Yield (2–5% ideal)
    div_yield_score = min(dividend_yield * 2000, 100)

    # --- Debt-to-Equity (lower = better)
    if debt_to_equity is not None:
        if debt_to_equity < 0:
            debt_score = 0
        else:
            debt_score = min(max(100 - debt_to_equity * 50, 0), 100)
    else:
        debt_score = None

    # --- Compute total score (average of available metrics)
    scores = [s for s in [current_rev_score, past_rev_score, pe_score, div_yield_score, debt_score] if s is not None]
    total_score = round(sum(scores) / len(scores), 2)

    return {
        "Current Revenue Growth Score": round(current_rev_score, 2),
        "Past Revenue Growth Score": round(past_rev_score, 2),
        "P/E Score": round(pe_score, 2),
        "Dividend Yield Score": round(div_yield_score, 2),
        "Debt Score": round(debt_score, 2) if debt_score is not None else None,
        "Total Score": total_score
    }


def fetch_with_alpaca(symbol, timeframe=TimeFrame.Day):
    if client is None:
        raise RuntimeError("Alpaca client not configured (missing ALPACA_API_KEY/SECRET).")

    now = datetime.now(timezone.utc)
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = now + timedelta(minutes=1)

    req = StockBarsRequest(
        symbol_or_symbols=[symbol],
        timeframe=timeframe,
        start=start,
        end=end,
        feed="iex", 
        limit=1
    )

    bars = client.get_stock_bars(req)

    try:
        df = bars.df
        if not df.empty:
            latest_bar = df.iloc[-1]
            return {
                "symbol": symbol,
                "timestamp": latest_bar.name[1] if isinstance(latest_bar.name, tuple) else latest_bar.name,
                "open": latest_bar.open,
                "high": latest_bar.high,
                "low": latest_bar.low,
                "close": latest_bar.close,
                "volume": latest_bar.volume,
            }
        else:
            raise RuntimeError("No data returned for today.")
    except AttributeError:
        rows = list(bars)
        if not rows:
            raise RuntimeError("No data returned for today.")
        b = rows[-1]
        return {
            "symbol": symbol,
            "timestamp": b.t,
            "open": b.o,
            "high": b.h,
            "low": b.l,
            "close": b.c,
            "volume": getattr(b, "v", None),
        }



def fetch_with_alpha_vintage(symbol):
    # Primary and backup keys
    key_1 = os.getenv("ALPHA_VANTAGE_API_KEY")


    if not key_1:
        raise RuntimeError("No Alpha Vantage API key provided.")

    def try_fetch(key):
        url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={key}"
        resp = requests.get(url, timeout=10, verify=certifi.where())
        resp.raise_for_status()
        data = resp.json()
        if not data:
            raise RuntimeError("Alpha Vantage returned empty response")
        if "Note" in data or "Information" in data:
            # Alpha Vantage returns 'Note' when rate limit is exceeded
            raise RuntimeError(data.get("Note") or data.get("Information"))
        return data

    # Try primary key first, then backup
    try:
        data = try_fetch(key_1)
    except Exception as e1:
        raise RuntimeError(f"Alpha Vantage API keys failed: {e1}")

    stock_info = {
        "symbol": data.get("Symbol"),
        "asset_type": data.get("AssetType"),
        "name": data.get("Name"),
        "description": data.get("Description"),
        "cik": data.get("CIK"),
        "exchange": data.get("Exchange"),
        "currency": data.get("Currency"),
        "country": data.get("Country"),
        "sector": data.get("Sector"),
        "industry": data.get("Industry"),
        "address": data.get("Address"),
        "official_site": data.get("OfficialSite"),
        "fiscal_year_end": data.get("FiscalYearEnd"),
        "latest_quarter": data.get("LatestQuarter"),
        "market_capitalization": safe_float(data.get("MarketCapitalization")),
        "ebitda": safe_float(data.get("EBITDA")),
        "pe_ratio": safe_float(data.get("PERatio")),
        "peg_ratio": safe_float(data.get("PEGRatio")),
        "book_value": safe_float(data.get("BookValue")),
        "dividend_per_share": safe_float(data.get("DividendPerShare")),
        "dividend_yield": safe_float(data.get("DividendYield")),
        "eps": safe_float(data.get("EPS")),
        "revenue_per_share_ttm": safe_float(data.get("RevenuePerShareTTM")),
        "profit_margin": safe_float(data.get("ProfitMargin")),
        "operating_margin_ttm": safe_float(data.get("OperatingMarginTTM")),
        "return_on_assets_ttm": safe_float(data.get("ReturnOnAssetsTTM")),
        "return_on_equity_ttm": safe_float(data.get("ReturnOnEquityTTM")),
        "revenue_ttm": safe_float(data.get("RevenueTTM")),
        "gross_profit_ttm": safe_float(data.get("GrossProfitTTM")),
        "diluted_eps_ttm": safe_float(data.get("DilutedEPSTTM")),
        "quarterly_earnings_growth_yoy": safe_float(data.get("QuarterlyEarningsGrowthYOY")),
        "quarterly_revenue_growth_yoy": safe_float(data.get("QuarterlyRevenueGrowthYOY")),
        "analyst_target_price": safe_float(data.get("AnalystTargetPrice")),
        "analyst_rating_strong_buy": safe_int(data.get("AnalystRatingStrongBuy")),
        "analyst_rating_buy": safe_int(data.get("AnalystRatingBuy")),
        "analyst_rating_hold": safe_int(data.get("AnalystRatingHold")),
        "analyst_rating_sell": safe_int(data.get("AnalystRatingSell")),
        "analyst_rating_strong_sell": safe_int(data.get("AnalystRatingStrongSell")),
        "trailing_pe": safe_float(data.get("TrailingPE")),
        "forward_pe": safe_float(data.get("ForwardPE")),
        "price_to_sales_ratio_ttm": safe_float(data.get("PriceToSalesRatioTTM")),
        "price_to_book_ratio": safe_float(data.get("PriceToBookRatio")),
        "ev_to_revenue": safe_float(data.get("EVToRevenue")),
        "ev_to_ebitda": safe_float(data.get("EVToEBITDA")),
        "beta": safe_float(data.get("Beta")),
        "fifty_two_week_high": safe_float(data.get("52WeekHigh")),
        "fifty_two_week_low": safe_float(data.get("52WeekLow")),
        "fifty_day_moving_average": safe_float(data.get("50DayMovingAverage")),
        "two_hundred_day_moving_average": safe_float(data.get("200DayMovingAverage")),
        "shares_outstanding": safe_int(data.get("SharesOutstanding")),
        "shares_float": safe_int(data.get("SharesFloat")),
        "percent_insiders": safe_float(data.get("PercentInsiders")),
        "percent_institutions": safe_float(data.get("PercentInstitutions")),
        "dividend_date": data.get("DividendDate"),
        "ex_dividend_date": data.get("ExDividendDate")
    }

    return ("Stock Info", stock_info)


def fetch_with_FMP(symbol):
    def average_revenue_growth(data, years=5):
        """
        Compute the average revenue growth over the last `years` fiscal years.
        Expects `data` to be a list of dicts with a 'growthRevenue' key.
        """
        # Sort by fiscal year (descending) and take the latest N
        data_sorted = sorted(data, key=lambda x: int(x["fiscalYear"]), reverse=True)
        recent = data_sorted[1:years]

        # Extract valid growth values
        growth_values = [entry["growthRevenue"] for entry in recent if "growthRevenue" in entry]

        if not growth_values:
            return None  # or 0 if you prefer a default

        avg_growth = sum(growth_values) / len(growth_values)
        return avg_growth
    import requests
    import certifi

    key = os.getenv("FMP_API_KEY")
    if not key:
        raise RuntimeError("FMP API key not provided. Set FMP_API_KEY env var or pass api_key.")

    income_statement_growth = f"https://financialmodelingprep.com/stable/income-statement-growth?symbol={symbol}&apikey={key}"
    ratios = f"https://financialmodelingprep.com/stable/ratios-ttm?symbol={symbol}&apikey={key}"
    try:
        resp = requests.get(income_statement_growth, timeout=10, verify=certifi.where())
        resp.raise_for_status()
        data = resp.json()
        if not data:
            raise RuntimeError("FMP returned empty response")
        
        current_revenue_growth = data[0].get("growthRevenue")
        past_revenue_growth = average_revenue_growth(data, years=5)

        resp = requests.get(ratios, timeout=10, verify=certifi.where())
        resp.raise_for_status()
        data = resp.json()
        if not data:
            raise RuntimeError("FMP returned empty response")
        pe = data[0].get("priceToEarningsRatioTTM")
        dividend = data[0].get("dividendYieldTTM")
        debt_to_equity = data[0].get("debtToEquityRatioTTM")

        ROI = score_stock(current_revenue_growth, past_revenue_growth, pe, dividend, debt_to_equity)
        return ("fmp", ROI)

    except requests.HTTPError as e:
        status = getattr(e.response, "status_code", None)
        if status == 401:
            raise RuntimeError("FMP unauthorized (401): check your FMP_API_KEY") from e
        raise RuntimeError(f"FMP HTTP error ({status}): {e}") from e
    except requests.RequestException as e:
        raise RuntimeError(f"FMP request failed: {e}") from e
    except ValueError as e:
        raise RuntimeError(f"FMP JSON parse failed: {e}") from e
    
    




if __name__ == "__main__":
    sp500_df = pd.read_csv("S&P-500.csv")
    tickers = sp500_df["Symbol"].tolist()
    print(len(tickers), tickers[:5])

    stock_df = pd.read_csv("stock_data.csv")
    data = stock_df["symbol"].tolist()

    for stocks in tickers[len(data)+3:]:
        symbol = os.getenv("SYMBOL", stocks)

        try:
            source, data = fetch_with_alpha_vintage(symbol)
            update_stock_data(symbol, data)
            print(data)
        except Exception as e:
            print("Failed:", str(e))
            break

        time.sleep(1)
      