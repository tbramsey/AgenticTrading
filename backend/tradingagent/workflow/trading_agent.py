from langchain_ollama import ChatOllama
import os, json
import pprint
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

from .agent_states import DebateState, RiskDebateState

from .graph import CompiledGraph
from .agent_states import AgentState

model = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash-lite",
    temperature=0.2,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

class StockReport:
    def __init__(self, state: AgentState):
        self,
        self.state = state
        self.ticker = state.get("ticker", "N/A")
        self.trade_date = state.get("trade_date", "N/A")
        self.formatted_data = None

    def get_trade_decision(self) -> str:
        return self.state.get("final_trade_decision", "No decision made.")
    
    def get_risk_report(self) -> str:
        return self.state.get("risk_state", {}).get("judge_decision", "No risk decision made.")
    
    def get_debate_report(self) -> str:
        return self.state.get("debate_state", {}).get("judge_decision", "No debate decision made.")
    
    def get_analytics(self) -> dict:
        return {
            "ticker": self.ticker,
            "trade_date": self.trade_date,
            "news_report": self.state.get("news_report", "N/A"),
            "market_report": self.state.get("market_report", "N/A"),
            "fundamentals_report": self.state.get("fundamentals_report", "N/A"),
            "sentiment_report": self.state.get("sentiment_report", "N/A"),
        }
    
    def get_formatted_data(self) -> str:
        if self.formatted_data:
            return self.formatted_data
        return self.extract_formatted_data()
    
    def extract_formatted_data(self) -> dict:
        prompt = (
            "You are a trading assistant tasked with formmating information from another assistant.\n"
            "Read the following trade analysis and extract the key details into a JSON object with the following scheme:\n"
            "{\n"
            '  "decision": Trading decision (BUY | SELL | HOLD),\n'
            '  "rationale": Explanation for the decision,\n'
            '  "risk_assessment": Summary of risk analysis,\n'
            '  "investment_plan": Detailed investment plan if applicable\n'
            "}\n"
            "Ensure the JSON is properly formatted and return ONLY the JSON."
        )

        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Extract the details from the following analysis:\n" + self.get_trade_decision()}
        ]

        response = model.invoke(messages)
        content = getattr(response, "content", None) or str(response)

        def clean_json_fences(text: str) -> str:
            """Strip ```json ... ``` or ``` ... ``` wrappers."""
            if text.startswith("```"):
                # Remove starting fence
                text = text.split("```", 1)[1]
                # Remove language tag like ```json
                text = text.lstrip("json").strip()
                # Remove ending fence
                text = text.rsplit("```", 1)[0].strip()
            return text
        
        cleaned_content = clean_json_fences(content)

        try:
            data = json.loads(cleaned_content)
            self.formatted_data = data
            return data
        except json.JSONDecodeError:
            return {"error": "Failed to parse JSON from response.", "raw_response": cleaned_content}



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
            temperature=0.2,
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

        print("TRADE DATE: ", trade_date)
        init_state = AgentState()
        # init_state['ticker'] = ticker
        # init_state['trade_date'] = trade_date

        Graph = CompiledGraph(self.analyst_types, self.quick_thinking_llm, self.deep_thinking_llm)
        workflow = Graph.get_compiled_workflow()
        response = workflow.invoke({'ticker': ticker, 'trade_date': trade_date, 'debate_state': DebateState(), 'risk_state': RiskDebateState()})#, 'messages': [HumanMessage(f"Analyze the stock with ticker {ticker} for the trade date {trade_date}.")]})
        report = StockReport(response)
        print("JSONIFIERD DATA")
        pprint.pprint(report.get_formatted_data())
        return report
