import os, requests
from datetime import datetime
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

mark_api_key = os.getenv("MARKETAUX_API_KEY")
url = "https://api.marketaux.com/v1/news/all"


def _has_key() -> bool:
    if not mark_api_key:
        print("MARKETAUX_API_KEY not set; returning empty news results.")
        return False
    return True


def get_stock_news(
    ticker: Optional[str] = None,
    trade_date: Optional[str] = None,
    limit: int = 5,
) -> List[dict]:
    """
    Retrieve news articles (optionally filtered to a ticker) using the MarketAux API.

    Args:
        ticker: Optional stock ticker symbol (e.g., 'AAPL'). If omitted, returns general news.
        trade_date: Optional day to retrieve news for (format: 'YYYY-MM-DD').
        limit: Maximum number of articles to return.
    """
    if not _has_key():
        return []

    params = {
        "filter_entities": "true",
        "must_have_entities": "true",
        "limit": limit,
        "api_token": mark_api_key,
    }
    if ticker:
        params["symbols"] = ticker.upper()
    if trade_date:
        params["published_on"] = trade_date

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if "data" in data:
            articles = data.get("data", [])
            warnings = data.get("warnings", [])
            if warnings:
                print(f"API Warnings: {warnings}")
            return articles
        print(f"Unexpected MarketAux response format: {data}")
        return []

    except requests.exceptions.RequestException as e:
        print(f"(Marketaux) Error fetching news for {ticker or 'general'}: {e}")
        return []


def get_general_news(limit: int = 5) -> List[dict]:
    """Convenience wrapper to fetch general market news (no ticker required)."""
    today = datetime.utcnow().strftime("%Y-%m-%d")
    return get_stock_news(ticker=None, trade_date=today, limit=limit)
