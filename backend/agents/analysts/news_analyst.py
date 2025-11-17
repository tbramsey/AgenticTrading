import time
import json


def create_news_analyst(llm):
    def news_analyst_node(state) -> dict:
        prompt = f"""
        You are a news analyst. Based on the ticker {state['ticker']} and trade date {state['trade_date']}, 
        provide a detailed news analysis report including recent news events, sentiment analysis, and potential impacts on the stock.
        """


        response = llm.invoke(prompt)
        report = response.content

        return {
            "news_report": report
        }
    
    return news_analyst_node