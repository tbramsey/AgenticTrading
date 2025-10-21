import time
import json


def create_media_analyst(llm):
    def media_analyst_node(state) -> dict:
        prompt = f"""
        You are a news analyst. Based on the ticker {state['company_of_interest']} and trade date {state['trade_date']}, 
        provide a detailed news analysis report including recent news events, sentiment analysis, and potential impacts on the stock.
        """
        


        response = llm.invoke(prompt)
        report = response.content

        return {
            "type": "media_analysis",
            "report": report
        }
    
    return media_analyst_node