class Propagater:
    def __init__(self):
        pass

    def initialize(self, ticker: str, trade_date: str):
        """Create the initial state."""
        return {
            "messages": [("human", ticker)],
            "ticker": ticker,
            "trade_date": str(trade_date),
            "sender": "",
            "market_report": "",
            "fundamentals_report": "",
            "sentiment_report": "",
            "news_report": "",
            "investment_plan": "",
            "trader_investment_plan": "",
            "final_trade_decision": "",
        }
