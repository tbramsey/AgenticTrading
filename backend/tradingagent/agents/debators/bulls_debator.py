import time
import json
from langchain_core.messages import HumanMessage


def create_bull_debator(llm):
    def bull_debator_node(state) -> dict:

        debate_state = state["debate_state"]

        curr_response = debate_state.get("last_msg", "N/A")
        history = debate_state.get("history", "N/A")
        bull_history = debate_state.get("bulls_msg", "N/A")

        market_research_report = state["market_report"]
        sentiment_report = state["sentiment_report"]
        news_report = state["news_report"]
        fundamentals_report = state["fundamentals_report"]

        print("Running Bull Agent...")

        prompt = f"""
        You are a bullish debater. Based on the ticker {state['ticker']} and trade date {state['trade_date']}, 
        provide arguments in favor of investing in the stock, highlighting potential growth opportunities, positive news, and market conditions that could lead to an increase in stock value.

        Key points to focus on:
        - Growth Potential: Highlight the company's market opportunities, revenue projections, and scalability.
        - Competitive Advantages: Emphasize factors like unique products, strong branding, or dominant market positioning.
        - Positive Indicators: Use financial health, industry trends, and recent positive news as evidence.
        - Bear Counterpoints: Critically analyze the bear argument with specific data and sound reasoning, addressing concerns thoroughly and showing why the bull perspective holds stronger merit.
        - Engagement: Present your argument in a conversational style, engaging directly with the bear analyst's points and debating effectively rather than just listing data.

        Resources available:

        Market research report: {market_research_report}
        Social media sentiment report: {sentiment_report}
        Latest world affairs news: {news_report}
        Company fundamentals report: {fundamentals_report}
        Conversation history of the debate: {history}
        Last bear argument: {curr_response}
        """

        response = llm.invoke(prompt)

        argument = f"Bull Analyst: {response.content}"


        new_debate_state = {
            "history": history + "\n" + argument,
            "bears_msg": debate_state.get("bears_msg", ""),
            "bulls_msg": bull_history + "\n" + argument,
            "last_msg": argument,
            "rounds_completed": debate_state.get("rounds_completed", 0) + 1,
        }

        return {"debate_state": new_debate_state, "sender": "bull"}
    
    return bull_debator_node