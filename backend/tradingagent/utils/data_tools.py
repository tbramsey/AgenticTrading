import os
import requests
from typing import Optional, List, Dict
from dotenv import load_dotenv
from langchain.tools import tool
import pprint

# from agents.dataflows.marketaux_utils import get_stock_news as fetch_marketaux_news
# from agents.dataflows.massive_utils import (
#     get_stock_news as fetch_massive_news,
#     get_market_trends as fetch_massive_trends
# )
# from agents.dataflows.tiingo_utils import get_fundamental_data as fetch_tiingo_fundamentals

from tradingagent.dataflows import (
    fetch_marketaux_news,
    fetch_massive_news,

    fetch_massive_trends,
    
    fetch_tiingo_fundamentals
)

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

    structured_data = []

    def structure_data(articles: Dict) -> list:
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
    
    MarkData = fetch_marketaux_news(ticker, trade_date)
    if MarkData: structure_data(MarkData)
    MassData = fetch_massive_news(ticker, trade_date)
    if MassData: structure_data(MassData)

    
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
    
    structured_data = fetch_massive_trends(date)
    
    if structured_data:
        return summarize_market_data(structured_data)
    return None

@tool
def get_company_fundamentals(ticker: str, date: str) -> Optional[List[Dict]]:
    """
    Retrieve structured fundamental data for a stock.

    Args:
        ticker (str): Stock ticker symbol (e.g., 'AAPL').
        date (str): Date in format YYYY-MM-DD (e.g., "2024-06-01")

    Returns:
        A structured dictionary containing:
            - income_statement: Revenue, EBITDA, net income, EPS, etc.
            - balance_sheet: Assets, liabilities, equity, debt, cash, inventory, etc.
            - cash_flow: Operating cash flow, free cash flow, capex, dividends, etc.
            - ratios: Profitability, leverage, efficiency, valuation metrics, etc.

        Returns None if the API request fails or no data is available.
    """

    print("GET_COMPANY_FUNDAMENTALS called")

    structured_data = fetch_tiingo_fundamentals(ticker, date)
    
    if structured_data:
        return structured_data
    return None

#######

############ FOR TESTING THE TOOLS FUNCTIONALLITTY #############

##########

if __name__ == "__main__":
    # Test the function
    test_ticker = "AAPL"
    # print(f"Fetching news for {test_ticker}...")
    
    # try:
    #     articles = get_stock_news.func(test_ticker, "2024-06-01")
        
    #     if articles:
    #         print(f"\nFound {len(articles)} articles:\n")
    #         print(articles)
    #     else:
    #         print("No articles found or API request failed.")
    
    # except Exception as e:
    #     print(f"Error: {e}")

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

    try:
        data = get_company_fundamentals.func(test_ticker, "2025-08-05")
        
        if data:
            print(f"\nFound company fundamentals:\n")
            pprint.pprint(data)
        else:
            print("No fundamentals found or API request failed.")
    
    except Exception as e:
        print(f"Error: {e}")