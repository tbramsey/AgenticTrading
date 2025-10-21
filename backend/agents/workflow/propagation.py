class Propagater:
    def __init__(self):
        pass

    def initialize(self, ticker: str, trade_date: str):
        """Create the initial state."""
        return {
            "messages": [("human", ticker)],
            "company_of_interest": ticker,
            "trade_date": str(trade_date),


            "market_report": "",
            "fundamentals_report": "",
            "sentiment_report": "",
            "news_report": "",
        }
