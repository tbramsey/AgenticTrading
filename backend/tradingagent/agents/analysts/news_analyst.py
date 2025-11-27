import time
import json
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from tradingagent.utils.data_tools import get_stock_news


def create_news_analyst(llm):
    def news_analyst_node(state) -> dict:

        print("Running News Analyst...")
        tools = [get_stock_news]

        last_msg = state["messages"][-1] if state["messages"] else None
        if not hasattr(last_msg, "tool_calls") or len(last_msg.tool_calls) == 0:
            state["messages"] += [HumanMessage(f"Analyze the news related to the stock with ticker {state['ticker']} for the trade date {state['trade_date']}.")]

        sys_msg = f"""
        You are a news analyst. Based on the ticker {state['ticker']} and trade date {state['trade_date']}, 
        provide a detailed news analysis report including recent news events, sentiment analysis, and potential impacts on the stock\n.
        """

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
            print("News Report Generated.")
        
        return {
            "messages": [response],
            "news_report": report,
            "sender": "news"
        }
    
    return news_analyst_node