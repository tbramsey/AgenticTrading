import time
import json
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from agents.utils.data_tools import get_market_trends

def create_market_analyst(llm):
    def market_analyst_node(state) -> dict:
        
        last_msg = state["messages"][-1] if state["messages"] else None
        if not hasattr(last_msg, "tool_calls") or len(last_msg.tool_calls) == 0:
            state["messages"] += [HumanMessage(f"Analyze the market conditions for the trade date {state['trade_date']}.")]

        print("Running Market Analyst...")
        sys_msg = f"""
        You are a trading assistant tasked with analyzing financial markets. You are tasked with analyzing general market conditions centered around the trade date {state['trade_date']}.
        Provide a detailed market analysis report including recent price trends, volume analysis, and technical indicators.
        You are analyzing general market conditions, not specifically related to any single stock.
        """

        tools = [get_market_trends]  # Add any market analysis tools if available

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful AI assistant, collaborating with other assistants."
                    " Use the provided tools to progress towards answering the question."
                    " If you are unable to fully answer, that's OK; another assistant with different tools"
                    " will help where you left off. Execute what you can to make progress."
                    " If you or any other assistant has the FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** or deliverable,"
                    " prefix your response with FINAL TRANSACTION PROPOSAL: **BUY/HOLD/SELL** so the team knows to stop."
                    " You have access to the following tools: {tool_names}.\n{sys_msg}"
                    "For your reference, the current date is {current_date}. The company we want to look at is {ticker}",
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        prompt = prompt.partial(sys_msg=sys_msg)
        prompt = prompt.partial(tool_names=", ".join([tool.name for tool in tools]))
        prompt = prompt.partial(current_date=state["trade_date"])
        prompt = prompt.partial(ticker=state["ticker"])

        chain = prompt | llm.bind_tools(tools)
        response = chain.invoke(state["messages"])

        report = ""

        if len(response.tool_calls) == 0:
            report = response.content

        print("Market Report Generated.")

        print(response)

        return {
            "messages": [response],
            "market_report": report,
            "sender": "market"
        }
    
    return market_analyst_node