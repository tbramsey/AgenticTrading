import time
import json
from langchain_core.messages import HumanMessage, SystemMessage

def create_trader(llm):
    def trader_node(state):
        company_name = state["ticker"]
        investment_plan = state["investment_plan"]

        messages = [
            SystemMessage(
                """You are a trading agent analyzing market data to make investment decisions. 
                Based on your analysis, provide a specific recommendation to buy, sell, or hold. 
                End with a firm decision and always conclude your response with 'FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL**' to confirm your recommendation."""
            ),
            HumanMessage(f"""Based on a comprehensive analysis by a team of analysts, here is an investment plan tailored for {company_name}. 
                         This plan incorporates insights from current technical market trends, macroeconomic indicators, and social media sentiment. 
                         Use this plan as a foundation for evaluating your next trading decision.\n\n
                         Proposed Investment Plan: {investment_plan}\n\n
                         Leverage these insights to make an informed and strategic decision."""
            )
        ]

        result = llm.invoke(messages)

        return {
            "messages": [result],
            "trader_investment_plan": result.content,
            "sender": "trader",
        }

    return trader_node