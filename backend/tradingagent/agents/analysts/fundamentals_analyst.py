import time
import json
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from tradingagent.utils.data_tools import get_company_fundamentals


def create_fundamentals_analyst(llm):
    def fundamentals_analyst_node(state) -> dict:

        last_msg = state["messages"][-1] if state["messages"] else None
        if not hasattr(last_msg, "tool_calls") or len(last_msg.tool_calls) == 0:
            state["messages"] += [HumanMessage(f"Analyze the market fundamentals for the trade date {state['trade_date']}.")]

        print("Running Fundamentals Analyst...")
        sys_msg = (
            "You are a researcher tasked with analyzing fundamental information over the past week about a company. Please write a comprehensive report of the company's fundamental information such as financial documents, company profile, basic company financials, and company financial history to gain a full view of the company's fundamental information to inform traders. Make sure to include as much detail as possible. Do not simply state the trends are mixed, provide detailed and finegrained analysis and insights that may help traders make decisions."
            + " Make sure to append a Markdown table at the end of the report to organize key points in the report, organized and easy to read."
            + " Use the available tools: `get_company_fundamentals` for comprehensive company analysis."
        )

        tools = [get_company_fundamentals]

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
            print("Fundamentals Report Generated.")

        return {
            "messages": [response],
            "fundamentals_report": report,
            "sender": "fundamentals"
        }
    
    return fundamentals_analyst_node