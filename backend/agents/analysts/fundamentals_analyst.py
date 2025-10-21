import time
import json


def create_fundamentals_analyst(llm):
    def fundamentals_analyst_node(state) -> dict:
        prompt = f"""
        You are a fundamentals analyst. Based on the ticker {state['company_of_interest']} and trade date {state['trade_date']}, 
        provide a detailed fundamentals analysis report including financial statements review, key ratios, and growth prospects.
        """

        response = llm.invoke(prompt)
        report = response.content

        return {
            "type": "fundamentals_analysis",
            "report": report
        }
    
    return fundamentals_analyst_node