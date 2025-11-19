import time
import json
from langchain_core.messages import HumanMessage


def create_bear_debator(llm):
    def bear_debator_node(state) -> dict:

        debate_state = state["debate_state"]

        curr_response = debate_state.get("last_msg", "N/A")
        history = debate_state.get("history", "N/A")
        bear_history = debate_state.get("bears_msg", "N/A")

        market_research_report = state["market_report"]
        sentiment_report = state["sentiment_report"]
        news_report = state["news_report"]
        fundamentals_report = state["fundamentals_report"]

        print("Running Bear Agent...")

        prompt = f"""
        You are a bearish debater. Based on the ticker {state['ticker']} and trade date {state['trade_date']}, 
        provide arguments against investing in the stock, highlighting potential risks, negative news, and market conditions that could lead to a decline in stock value.
        
        Key points to focus on:

        - Risks and Challenges: Highlight factors like market saturation, financial instability, or macroeconomic threats that could hinder the stock's performance.
        - Competitive Weaknesses: Emphasize vulnerabilities such as weaker market positioning, declining innovation, or threats from competitors.
        - Negative Indicators: Use evidence from financial data, market trends, or recent adverse news to support your position.
        - Bull Counterpoints: Critically analyze the bull argument with specific data and sound reasoning, exposing weaknesses or over-optimistic assumptions.
        - Engagement: Present your argument in a conversational style, directly engaging with the bull analyst's points and debating effectively rather than simply listing facts.

        Resources available:

        Market research report: {market_research_report}
        Social media sentiment report: {sentiment_report}
        Latest world affairs news: {news_report}
        Company fundamentals report: {fundamentals_report}
        Conversation history of the debate: {history}
        Last bull argument: {curr_response}
        """

        response = llm.invoke(prompt)

        argument = f"Bear Analyst: {response.content}"


        new_debate_state = {
            "history": history + "\n" + argument,
            "bears_msg": bear_history + "\n" + argument,
            "bulls_msg": debate_state.get("bulls_msg", ""),
            "last_msg": argument,
            "rounds_completed": debate_state["rounds_completed"] + 1,
        }

        return {"debate_state": new_debate_state, "sender": "bear"}
    
    return bear_debator_node