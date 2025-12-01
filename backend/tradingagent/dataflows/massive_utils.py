import os, requests
from typing import Optional, List, Dict
from dotenv import load_dotenv

load_dotenv()

mass_api_key = os.getenv("MASSIVE_API_KEY")

if not mass_api_key:
    raise ValueError("MASSIVE_API_KEY not found in environment variables")

url_v2 = "https://api.massive.com/v2"
url_v3 = "https://api.massive.com/v3"

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
        response = requests.get(f"{url_v2}/reference/news", params=params)
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
        response = requests.get(f"{url_v2}/aggs/grouped/locale/us/market/stocks/{date}", params=params)
        response.raise_for_status()
        data = response.json()
        
        if "results" in data:
            indicators = data.get("results", [])
            return structure_data(indicators)
        else:
            print(f"Unexpected response format: {data}")
    
    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching news for date {date}: {e}")


def get_top_movers(direction: str = "gainers") -> Optional[List[Dict]]:
    """
    Fetch top stock movers (gainers or losers) for US market.

    Args:
        direction (str): Either "gainers" or "losers"

    Returns:
        Optional[List[Dict]]: List of top movers with ticker and change data
    """
    if direction.lower() not in ["gainers", "losers"]:
        raise ValueError("Direction must be 'gainers' or 'losers'")

    params = {
        "apiKey": mass_api_key
    }

    try:
        response = requests.get(f"{url_v2}/snapshot/locale/us/markets/stocks/{direction.lower()}", params=params)
        response.raise_for_status()
        data = response.json()
        
        if "results" in data:
            movers = data.get("results", [])
            return movers
        else:
            print(f"Unexpected response format: {data}")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching top {direction}: {e}")
        return None


def get_ticker_details(ticker: str) -> Optional[Dict]:
    """
    Fetch detailed reference data for a single ticker from the Massive v3 API.

    Args:
        ticker (str): Stock ticker symbol (e.g., 'AAPL').

    Returns:
        Optional[Dict]: Reference details for the ticker or None on failure.
    """

    params = {"apiKey": mass_api_key}

    try:
        response = requests.get(f"{url_v3}/reference/tickers/{ticker.upper()}", params=params)
        response.raise_for_status()
        data = response.json()

        # v3 responses generally nest data under "results"
        if isinstance(data, dict) and "results" in data:
            return data.get("results")
        return data

    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching reference data for {ticker}: {e}")
        return None


if __name__ == "__main__":
    print("Testing get_stock_news...")
    news = get_stock_news("AAPL", "2024-01-15")
    print(f"News results: {news}\n")
    
    print("Testing get_market_trends...")
    trends = get_market_trends("2024-01-15")
    print(f"Market trends: {trends}\n")
    
    print("Testing get_top_movers...")
    gainers = get_top_movers("gainers")
    print(f"Top gainers: {gainers}")

    print("Testing get_ticker_details...")
    ticker_details = get_ticker_details("AAPL")
    print(f"Ticker details: {ticker_details}")
