import time
import json
from langchain_core.messages import HumanMessage

def create_media_analyst(llm):
    def media_analyst_node(state) -> dict:
        
        last_msg = state["messages"][-1] if state["messages"] else None
        if not hasattr(last_msg, "tool_calls") or len(last_msg.tool_calls) == 0:
            state["messages"] += [HumanMessage(f"Analyze the media stance for the trade date {state['trade_date']}.")]
        
        print("Running Media Analyst...")
        prompt = f"""
        You are a news analyst. Based on the ticker {state['ticker']} and trade date {state['trade_date']}, 
        provide a detailed news analysis report including recent news events, sentiment analysis, and potential impacts on the stock.
        """
        


        response = llm.invoke(prompt)
        report = response.content

        print("Media Report Generated.")

        return {
            "sentiment_report": report,
            "sender": "media"
        }
    
    return media_analyst_node