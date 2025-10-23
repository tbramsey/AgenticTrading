from sympy import Ge
from langchain_ollama import ChatOllama
from agents.workflow.trading_agent import TradingAgent
import os, json
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI

model = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash-lite",
    temperature=0.2,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def classify_ticker(user_message: str) -> str:
    """Call the LLM to extract a ticker symbol from a user message.

    Returns an uppercase ticker symbol (e.g. 'AAPL') or the literal 'UNKNOWN'.
    """
    prompt = (
        "You are a trading assistant.\n"
        "Extract the ticker symbol from the user's message.\n"
        "If a ticker is not present, try to infer it from the company name.\n"
        "If you cannot determine a ticker, reply with the single token: UNKNOWN\n"
        "Return ONLY the ticker or UNKNOWN, nothing else."
    )

    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_message}
    ]

    try:
        response = model.invoke(messages)
        # Some LLM clients return a string or an object with .content
        content = getattr(response, "content", None) or str(response)
        # Normalize: strip whitespace and punctuation, uppercase
        ticker = content.strip().upper()
        # Keep only alphanumerics and dot/dash (some tickers include '.')
        import re

        match = re.search(r"([A-Z0-9.\-]+)", ticker)
        if match:
            val = match.group(1)
            if val == "UNKNOWN":
                return "UNKNOWN"
            return val
        return "UNKNOWN"
    except Exception as e:
        # If the model call fails, return UNKNOWN and let caller decide
        return "UNKNOWN"

if __name__ == "__main__":
    print("🤖 Alpaca Agent ready! Type 'exit' to quit.\n")
    while True:
        query = input("What stock do you want to analyze?:\n ")
        if query.lower() in ["exit", "quit"]:
            break

        ticker = classify_ticker(query)
        if ticker == "UNKNOWN":
            print("Identified Ticker: UNKNOWN — could not extract a ticker from your message.")
            continue
        
        print(f"Identified Ticker: {ticker}")
        if input("Is this correct? (y/n): ") == 'n':
            print("Let's try again.")
            continue

        print(f"Great! Proceeding with analysis for ticker: {ticker}\n")
        agent = TradingAgent()
        agent.analyze_stock(ticker, "2025-10-20")

