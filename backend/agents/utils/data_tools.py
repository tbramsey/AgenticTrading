import os
import requests
from typing import Optional, List, Dict
from dotenv import load_dotenv
from langchain.tools import tool

load_dotenv()

mark_api_key = os.getenv("MARKETAUX_API_KEY")
mass_api_key = os.getenv("MASSIVE_API_KEY")

@tool
def get_stock_news(ticker: str, trade_date: str) -> Optional[List[Dict]]:
    """
    Retrieve news articles for a specific stock using the MarketAux API.
    
    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL')
        trade_date: Day to retrieve news for (format: 'YYYY-MM-DD')
    
    Returns:
        List of news articles with a summary and sentiment score or None if the request fails
    """

    print("GET_STOCK_NEWS called")

    if not mark_api_key:
        raise ValueError("News API_KEY not found in environment variables")
    
    url_mark = "https://api.marketaux.com/v1/news/all"
    url_mass = "https://api.massive.com/v2/reference/news"

    structured_data = []

    def structure_data(article: Dict) -> list:
        for i, article in enumerate(articles, 1):
            structured_data.append({
                "title": article.get("title", "N/A"),
                "source": article.get("source", "N/A"),
                "description": article.get("description", "N/A"),
                "snippet": article.get("snippet", "N/A"),
                "sentiment": article.get("sentiment", "N/A"),
                "published_at": article.get("published_at", "N/A"),
                "url": article.get("url", "N/A")
            })
        
        # print("-------------\nStructured Data:\n ", structured_data)
        # print("--------------\nTicker:", ticker, "Trade Date:", trade_date)
        return structured_data

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
        response = requests.get(url_mark, params=params)
        response.raise_for_status()
        data = response.json()
        
        # MarketAux returns data directly, not a status field
        if "data" in data:
            articles = data.get("data", [])
            warnings = data.get("warnings", [])
            if warnings:
                print(f"API Warnings: {warnings}")
            structure_data(articles)
        else:
            print(f"Unexpected response format: {data}")
    
    except requests.exceptions.RequestException as e:
        print(f"(Marketaux) Error fetching news for {ticker}: {e}")

    params = {
        "ticker": ticker.upper(),
        "published_utc": trade_date,
        "apiKey": mass_api_key
    }

    # Massive News API Call
    try:
        response = requests.get(url_mass, params=params)
        response.raise_for_status()
        data = response.json()
        
        if "results" in data:
            articles = data.get("results", [])
            structure_data(articles)
        else:
            print(f"Unexpected response format: {data}")
    
    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching news for {ticker}: {e}")
    
    if structured_data:
        return structured_data
    return None


@tool
def get_market_trends(date: str) -> Optional[List[Dict]]:
    """
    Fetch grouped market aggregate data for all US stocks on a specific date.

    Args:
        date (str): Date in format YYYY-MM-DD (e.g., "2024-06-01")

    Returns:
        dict: Parsed grouped market data including volume, price changes, etc.
    """

    print("GET_MARKET_NEWS called")

    if not mass_api_key:
        raise ValueError("News API_KEY not found in environment variables")
    
    url_mark = "https://api.marketaux.com/v1/news/all"
    url_mass = f"https://api.massive.com//v2/aggs/grouped/locale/us/market/stocks/{date}"

    structured_data = []

    def structure_data(results: Dict) -> list:
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
        
        print("-------------\nStructured Data:\n ")
        return structured_data

    def summarize_market_data(structured_data: List[Dict]) -> Dict:
        """
        Compress massive grouped market data into a small summary suitable for LLM input.
        Computes:
        - Average market move
        - Top gainers
        - Top losers
        - Highest volume stocks
        - Highest intraday volatility
        
        Returns a JSON-ready dict.
        """

        if not structured_data:
            return {"error": "No market data provided."}

        # Compute avg market movement
        total_change = sum(s.get("change", 0) for s in structured_data)
        avg_change = total_change / len(structured_data)

        # Add intraday volatility
        for s in structured_data:
            high = s.get("high", 0)
            low = s.get("low", 0)
            s["intraday_volatility"] = high - low

        # Sort groups
        top_gainers = sorted(structured_data, key=lambda x: x["change"], reverse=True)[:10]
        top_losers = sorted(structured_data, key=lambda x: x["change"])[:10]
        highest_volume = sorted(structured_data, key=lambda x: x.get("volume", 0), reverse=True)[:10]
        highest_volatility = sorted(structured_data, key=lambda x: x["intraday_volatility"], reverse=True)[:10]

        summary = {
            "avg_market_change": avg_change,
            "top_gainers": top_gainers,
            "top_losers": top_losers,
            "highest_volume": highest_volume,
            "highest_volatility": highest_volatility
        }

        return summary


    params = {
        "adjusted": "true",
        "apiKey": mass_api_key
    }

    # Massive News API Call
    try:
        response = requests.get(url_mass, params=params)
        response.raise_for_status()
        data = response.json()
        
        if "results" in data:
            indicators = data.get("results", [])
            structure_data(indicators)
        else:
            print(f"Unexpected response format: {data}")
    
    except requests.exceptions.RequestException as e:
        print(f"(Massive) Error fetching news for date {date}: {e}")
    
    if structured_data:
        return summarize_market_data(structured_data)
    return None


if __name__ == "__main__":
    # Test the function
    test_ticker = "AAPL"
    print(f"Fetching news for {test_ticker}...")
    
    try:
        articles = get_stock_news.func(test_ticker, "2024-06-01")
        
        if articles:
            print(f"\nFound {len(articles)} articles:\n")
            print(articles)
        else:
            print("No articles found or API request failed.")
    
    except Exception as e:
        print(f"Error: {e}")

    # test_date = "2025-08-05"
    # print(f"Fetching market data for date {test_date}...")
    # try:
    #     market_data = get_market_trends.func(test_date)
        
    #     if market_data:
    #         print(f"\nFound {len(market_data)} market data entries:\n")
    #         print(market_data)
    #     else:
    #         print("No market data found or API request failed.")
    
    # except Exception as e:
    #     print(f"Error: {e}")