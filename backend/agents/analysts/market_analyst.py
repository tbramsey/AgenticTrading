import time
import json


def create_market_analyst(llm):
    def market_analyst_node(state) -> dict:
        prompt = f"""
        You are a market analyst. Based on the ticker {state['company_of_interest']} and trade date {state['trade_date']}, 
        provide a detailed market analysis report including recent price trends, volume analysis, and technical indicators.
        """


        response = llm.invoke(prompt)
        report = response.content

        return {
            "type": "market_analysis",
            "report": report
        }
    
    return market_analyst_node