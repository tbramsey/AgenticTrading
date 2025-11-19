import os, requests
from dotenv import load_dotenv

load_dotenv()

mark_api_key = os.getenv("MARKETAUX_API_KEY")

if not mark_api_key:
    raise ValueError("MARKETAUX_API_KEY not found in environment variables")

url = "https://api.marketaux.com/v1/news/all"

def get_stock_news(ticker: str, trade_date: str):
    """
    Retrieve news articles for a specific stock using the MarketAux API.
    
    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL')
        trade_date: Day to retrieve news for (format: 'YYYY-MM-DD')
    """

    params = {
        "symbols": ticker.upper(),
        "filter_entities": "true",
        "must_have_entities": "true",
        "published_on": trade_date,
        "limit": 3,
        "api_token": mark_api_key
    }

    #MarketAux API Call
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # MarketAux returns data directly, not a status field
        if "data" in data:
            articles = data.get("data", [])
            warnings = data.get("warnings", [])
            if warnings:
                print(f"API Warnings: {warnings}")
            return articles
        else:
            print(f"Unexpected response format: {data}")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"(Marketaux) Error fetching news for {ticker}: {e}")

