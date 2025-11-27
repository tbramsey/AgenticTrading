import time
import json


def create_risk_judge(llm):
    def risk_manager_node(state) -> dict:

        company_name = state["ticker"]

        history = state["risk_state"]["history"]
        risk_state = state["risk_state"]

        trader_plan = state["investment_plan"]

        prompt = f"""As the Risk Management Judge and Debate Facilitator, your goal is to evaluate the debate between three risk analysts—Risky, Neutral, and Safe/Conservative—and determine the best course of action for the trader. Your decision must result in a clear recommendation: Buy, Sell, or Hold. Choose Hold only if strongly justified by specific arguments, not as a fallback when all sides seem valid. Strive for clarity and decisiveness.

        Guidelines for Decision-Making:
        1. **Summarize Key Arguments**: Extract the strongest points from each analyst, focusing on relevance to the context.
        2. **Provide Rationale**: Support your recommendation with direct quotes and counterarguments from the debate.
        3. **Refine the Trader's Plan**: Start with the trader's original plan, **{trader_plan}**, and adjust it based on the analysts' insights.

        Deliverables:
        - A clear and actionable recommendation: Buy, Sell, or Hold.
        - Detailed reasoning anchored in the debate and past reflections.

        ---

        **Analysts Debate History:**  
        {history}

        ---

        Focus on actionable insights and continuous improvement. Build on past lessons, critically evaluate all perspectives, and ensure each decision advances better outcomes."""

        response = llm.invoke(prompt)

        new_risk_state = {
            "judge_decision": response.content,
            "history": risk_state["history"],
            "risky_history": risk_state["risky_history"],
            "safe_history": risk_state["safe_history"],
            "neutral_history": risk_state["neutral_history"],
            "latest_speaker": "Judge",
            "current_risky_response": risk_state["current_risky_response"],
            "current_safe_response": risk_state["current_safe_response"],
            "current_neutral_response": risk_state["current_neutral_response"],
            "count": risk_state["count"],
        }

        return {
            "risk_state": new_risk_state,
            "final_trade_decision": response.content,
        }

    return risk_manager_node