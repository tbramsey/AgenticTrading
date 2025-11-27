from langchain_ollama import ChatOllama
import os, json
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI
from .propagation import Propagater
from tradingagent.agents.analysts import (
    create_market_analyst,
    create_media_analyst,
    create_news_analyst,
    create_fundamentals_analyst
)

from .agent_states import DebateState

# NOTE: we will build analyst node callables (functions that accept state)
# from the factory functions below inside the TradingAgent instance so
# they can be bound to the agent LLMs. The factories (create_..._analyst)
# return a callable that accepts the graph state and returns a dict.

from .graph import CompiledGraph
from .agent_states import AgentState

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

class TradingAgent:
    def __init__(
        self,
        selected_analysts=["market", "media", "news", "fundamentals"]
    ):
        

        self.deep_thinking_llm = ChatGoogleGenerativeAI(
            model="models/gemini-2.5-flash-lite",
            temperature=0.2,
            google_api_key=os.getenv("GEMINI_API_KEY")
        )

        self.quick_thinking_llm = ChatGoogleGenerativeAI(
            model="models/gemini-2.5-flash-lite",
            temperature=0.7,
            google_api_key=os.getenv("GEMINI_API_KEY")
        )

        self.propagater = Propagater()

        self.ticker = None
        self.trade_date = None

        self.selected_analysts = selected_analysts
        # Build analyst node callables bound to this agent's LLM(s).
        # Each factory returns a function that accepts `state` and
        # returns a dict; the StateGraph expects those callables.
        self.analyst_types = {
            "market": create_market_analyst(self.quick_thinking_llm),
            "media": create_media_analyst(self.quick_thinking_llm),
            "news": create_news_analyst(self.quick_thinking_llm),
            "fundamentals": create_fundamentals_analyst(self.quick_thinking_llm),
        }

    def analyze_stock(self, ticker: str, trade_date: str):
        self.ticker = ticker
        self.trade_date = trade_date

        init_state = AgentState()
        # init_state['ticker'] = ticker
        # init_state['trade_date'] = trade_date

        Graph = CompiledGraph(self.analyst_types, self.quick_thinking_llm, self.deep_thinking_llm)
        workflow = Graph.get_compiled_workflow()
        workflow.invoke({'ticker': ticker, 'trade_date': trade_date, 'debate_state': DebateState()})#, 'messages': [HumanMessage(f"Analyze the stock with ticker {ticker} for the trade date {trade_date}.")]})
