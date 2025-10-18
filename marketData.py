from calendar import c
from dotenv import load_dotenv
import os

load_dotenv()

from datetime import datetime
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
import yfinance as yf
import time
import traceback

API_KEY = os.getenv("ALPACA_API_KEY")
API_SECRET = os.getenv("ALPACA_API_SECRET")

client = StockHistoricalDataClient(API_KEY, API_SECRET)

FMP_KEY = os.getenv("FMP_API_KEY")

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


def fetch_with_alpaca(symbol, start=None, end=None, timeframe=TimeFrame.Day):
    if client is None:
        raise RuntimeError("Alpaca client not configured (missing ALPACA_API_KEY/SECRET).")
    start = start or datetime(2022, 9, 1)
    end = end or datetime(2022, 9, 7)
    req = StockBarsRequest(
        symbol_or_symbols=[symbol],
        timeframe=timeframe,
        start=start,
        end=end,
    )
    bars = client.get_stock_bars(req)
    # client returns an object with .df in many versions
    try:
        return ("alpaca", bars.df)
    except Exception:
        # fallback: try to convert iterable bars to DataFrame-like print
        rows = []
        for b in bars:
            rows.append((b.t, b.o, b.h, b.l, b.c, getattr(b, "v", None)))
        return ("alpaca-iter", rows)


def fetch_with_yfinance(symbol, retries=3, base_wait=2):
    import requests
    from requests.adapters import HTTPAdapter
    from urllib3.util.retry import Retry

    # build a session with retry for HTTP 429/5xx
    sess = requests.Session()
    retry_strategy = Retry(
        total=retries,
        status_forcelist=[429, 500, 502, 503, 504],
        backoff_factor=base_wait,
        allowed_methods=["GET", "POST"]
    )
    sess.mount("https://", HTTPAdapter(max_retries=retry_strategy))

    attempt = 0
    while attempt < retries:
        try:
            # use yf.download which is often more robust than Ticker().history()
            df = yf.download(
                tickers=symbol,
                period="1mo",
                interval="1d",
                progress=False,
                threads=False,
                session=sess
            )
            if df is None or df.empty:
                raise RuntimeError("No data returned from yfinance.download()")
            return ("yfinance", df)
        except Exception as e:
            msg = str(e)
            # handle rate-limit and retryable parse errors
            if "Too Many Requests" in msg or "429" in msg or isinstance(e, ValueError):
                wait = base_wait * (2 ** attempt)
                print(f"yfinance retryable error: {msg}. retrying in {wait}s (attempt {attempt+1}/{retries})")
                time.sleep(wait)
                attempt += 1
                continue
            # final failure
            raise

def fetch_with_FMP(symbol, api_key=None):
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

    key = api_key or os.getenv("FMP_API_KEY")
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
    symbol = os.getenv("SYMBOL", "NVDA")
    # First try yfinance (less setup). If it fails due to rate limit, fallback to Alpaca if configured.
    try:
        source, data = fetch_with_FMP(symbol, api_key=FMP_KEY)
        print(data)
    except Exception as e:
        print("FMP failed:", str(e))
        # if client:
        #     try:
        #         src, df = fetch_with_alpaca(symbol)
        #         print(f"Fetched from {src}.")
        #         # df may be DataFrame or list of rows
        #         if hasattr(df, "tail"):
        #             print(df.tail(10).to_string())
        #         else:
        #             for r in df[:10]:
        #                 print(r)
        #     except Exception as ae:
        #         print("Alpaca fallback failed:", str(ae))
        #         traceback.print_exc()
        # else:
        #     print("No Alpaca credentials configured. Set ALPACA_API_KEY and ALPACA_API_SECRET to use Alpaca as a fallback.")