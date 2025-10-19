from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from utils.alpaca_utils import get_account_info, get_positions, place_market_order
from langchain_ollama.llms import OllamaLLM
from langchain_ollama import ChatOllama
import json
from dotenv import load_dotenv

load_dotenv()
# Define tools with the @tool decorator (new standard)
@tool
def get_account_info_tool(_: str) -> str:
    """Fetches Alpaca account info such as equity and buying power."""
    return str(get_account_info())

@tool
def get_positions_tool(_: str) -> str:
    """Fetches all open positions in the trading account."""
    return str(get_positions())


# @tool
# def place_market_order_tool(order: dict) -> str:
#     """Places a market order. Input should be a dict like {'symbol': 'AAPL', 'qty': 1, 'side': 'buy'}."""
#     return str(place_market_order(**order))

# Combine tools
tools = [get_account_info_tool, get_positions_tool]#, place_market_order_tool

# Initialize model
model = ChatOllama(model="llama3.1", temperature=0.2)

def classify_intent(message: str) -> str:
    """
    Ask the model to classify the user's message into one of:
    - get_account_info
    - get_positions
    - place_market_order
    """
    prompt = f"""
    You are a trading assistant classifier. 
    Classify the following message into one of these categories only:
    1) get_account_info
    2) get_positions
    3) place_market_order

    Return only the category name.
    """

    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": message}
    ]
    # Create agent
    response = model.invoke(messages)
    # Grab just the generated text
    return response.content

def summarize_message(message: str, data: str) -> str:
    """
    Summarize the user's message to extract key details for order placement.
    """
    prompt = f"""
    You are a informative trading assistant. 
    Answer the following message by using the provided data.

    Data: {data}

    Provide a concise summary focusing on key details.
    """

    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": message}
    ]
    # Create agent
    response = model.invoke(messages)
    # Grab just the generated text
    return response.content

# Example interaction
if __name__ == "__main__":
    print("🤖 Alpaca Agent ready! Type 'exit' to quit.\n")
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            break
        intent = classify_intent(query)

        print("-------------------")
        if intent == "get_account_info":
            info = get_account_info()
            print("💰 Account Info: ")
            print(summarize_message(query, json.dumps(info, default=str)))

        elif intent == "get_positions":
            info = get_positions()
            print("📊 Positions Info: ")
            print(summarize_message(query, json.dumps(info, default=str)))

        elif intent == "place_market_order":
            symbol = input("Enter symbol (e.g. AAPL): ").upper()
            qty = int(input("Enter quantity: "))
            side = input("Buy or sell? ").lower()
            #print("🛒", place_market_order(symbol, qty, side))

        else:
            print("🤔 Sorry, I didn’t understand that request.")
        print("-------------------")
