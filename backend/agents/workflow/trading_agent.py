from langchain_ollama import ChatOllama
import os, json
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI
from .propagation import Propagater
from agents.analysts import (
    create_market_analyst,
    create_media_analyst,
    create_news_analyst,
    create_fundamentals_analyst
)

analyst_types = {
    "market": create_market_analyst,
    "media": create_media_analyst,
    "news": create_news_analyst,
    "fundamentals": create_fundamentals_analyst
    }

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

    def analyze_stock(self, ticker: str, trade_date: str):
        self.ticker = ticker
        self.trade_date = trade_date

        init_state = self.propagater.initialize(ticker, trade_date)

        for analyst in self.selected_analysts:
            analyst_creator = analyst_types.get(analyst)
            if analyst_creator:
                print(f"Running {analyst} analyst...")
                agent = analyst_creator(self.deep_thinking_llm)
                report = agent(init_state)
                init_state[f"{analyst}_report"] = report

        for analyst in self.selected_analysts:
            print(f"{analyst.capitalize()} Report:")
            print(init_state[f"{analyst}_report"]["report"])
            print("\n" + "="*50 + "\n")
