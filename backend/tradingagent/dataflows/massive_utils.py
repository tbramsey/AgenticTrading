import os, requests
from typing import Optional, List, Dict
from dotenv import load_dotenv

load_dotenv()

mass_api_key = os.getenv("MASSIVE_API_KEY")

if not mass_api_key:
    raise ValueError("MASSIVE_API_KEY not found in environment variables")

url = "https://api.massive.com/v2"

def get_stock_news(ticker: str, trade_date: str):
    """
    Retrieve news articles for a specific stock using the MarketAux and Massive News APIs.
    
    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL')
        trade_date: Day to retrieve news for (format: 'YYYY-MM-DD')
    """

    params = {
        "ticker": ticker.upper(),
        "published_utc": trade_date,
        "apiKey": mass_api_key
    }

    # Massive News API Call
    try:
        response = requests.get(f"{url}/reference/news", params=params)
        response.raise_for_status()
        data = response.json()
        
        if "results" in data:
            articles = data.get("results", [])
            return articles
        else:
            print(f"(Massive) Unexpected response format: {data}")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching news for {ticker}: {e}")

import pandas as pd
import pandas_market_calendars as mcal

def last_open_market_day(date_str):
    # Convert input
    date = pd.to_datetime(date_str)

    # Start looking from the previous calendar day
    target = date - pd.Timedelta(days=1)

    nyse = mcal.get_calendar('NYSE')

    # Look back a bit to catch long weekends/holidays
    start = target - pd.Timedelta(days=10)
    end = target

    schedule = nyse.schedule(start_date=start, end_date=end)
    open_days = schedule.index

    # Filter for open days <= the shifted day
    past_open = open_days[open_days <= target]

    if past_open.empty:
        raise ValueError("No open market days found before this date. Kinda cursed.")

    return past_open.max().strftime("%Y-%m-%d")


def get_market_trends(date: str) -> Optional[List[Dict]]:
    """
    Fetch grouped market aggregate data for all US stocks on a specific date.

    Args:
        date (str): Date in format YYYY-MM-DD (e.g., "2024-06-01")

    Returns:
        dict: Parsed grouped market data including volume, price changes, etc.
    """

    def structure_data(results: Dict) -> list:
        structured_data = []

        for stock in results:
            structured_data.append({
                "ticker": stock.get("T", "N/A"),
                "volume": stock.get("v", "N/A"),
                "open": stock.get("o", "N/A"),
                "close": stock.get("c", "N/A"),
                "high": stock.get("h", "N/A"),
                "low": stock.get("l", "N/A"),
                "change": (stock.get("c", 0) - stock.get("o", 0))
            })

        return structured_data
    
    date = last_open_market_day(date)

    params = {
        "adjusted": "true",
        "apiKey": mass_api_key
    }

    # Massive News API Call
    try:
        response = requests.get(f"{url}/aggs/grouped/locale/us/market/stocks/{date}", params=params)
        response.raise_for_status()
        data = response.json()
        
        if "results" in data:
            indicators = data.get("results", [])
            return structure_data(indicators)
        else:
            print(f"Unexpected response format: {data}")
    
    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching news for date {date}: {e}")