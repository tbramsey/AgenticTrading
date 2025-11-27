from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.generatePortfolio import make_portfolio, fetch_stockprices
from utils.alpaca_utils import create_portfolio
import json, os
from dotenv import load_dotenv

load_dotenv()

def save_portfolio(p):
    with open("current_portfolio.json", "w") as f:
        json.dump(p, f)

def load_portfolio():
    if os.path.exists("current_portfolio.json"):
        with open("current_portfolio.json", "r") as f:
            return json.load(f)
    return None

app = Flask(__name__)
CORS(app)

current_portfolio = None

@app.route("/fetch-portfolio")
def fetch_portfolio():
    current_portfolio = load_portfolio()
    return jsonify(current_portfolio)

@app.route("/portfolio")
def get_portfolio():
    global current_portfolio
    diversification = request.args.get("diversification", default=1, type=int)
    max_risk = request.args.get("max_risk", default=1, type=int)
    sectors = request.args.getlist("sectors")
    if len(sectors) == 1 and "," in sectors[0]:
        sectors = [s.strip() for s in sectors[0].split(",") if s.strip()]
    current_portfolio = make_portfolio(diversification, max_risk, sectors)
    save_portfolio(current_portfolio)
    return jsonify(current_portfolio)

@app.route("/portfolio/current")
def get_current_portfolio():
    global current_portfolio
    if current_portfolio is None:
        current_portfolio = load_portfolio()
    if current_portfolio is None:
        return jsonify({"error": "No portfolio generated yet"}), 404

    # mock_data = [
    #     {"date": "2025-10-01", "portfolio_value": 100000},
    #     {"date": "2025-10-08", "portfolio_value": 101200},
    #     {"date": "2025-10-15", "portfolio_value": 99500},
    #     {"date": "2025-10-22", "portfolio_value": 102300},
    #     {"date": "2025-10-29", "portfolio_value": 103000},
    # ]
    # return jsonify(mock_data)
    startdate = request.args.get("startdate", "2015-11-01")
    try:
        df = fetch_stockprices(current_portfolio, startdate)
        df = df.dropna(subset=["portfolio_value"])
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")
        
        data = df[["date", "portfolio_value"]].to_dict(orient="records")
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/portfolio/launch")
def launch_portfolio():   
    global current_portfolio
    if current_portfolio is None:
        current_portfolio = load_portfolio()
    if current_portfolio is None:
        return jsonify({"error": "No portfolio generated yet"}), 404
    
    try:
        create_portfolio(current_portfolio, 10000)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


from langchain_google_genai import ChatGoogleGenerativeAI
from tradingagent.workflow.trading_agent import TradingAgent

model = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash-lite",
    temperature=0.2,
    google_api_key=os.getenv("GEMINI_API_KEY")
)


def classify_ticker(user_message: str) -> str:
    prompt = (
        "You are a trading assistant.\n"
        "Extract the ticker symbol from the user's message.\n"
        "If a ticker is not present, try to infer it from the company name.\n"
        "If you cannot determine a ticker, reply with: UNKNOWN\n"
        "Return ONLY the ticker or UNKNOWN."
    )

    messages = [
        {"role": "system", "content": prompt},
        {"role": "user", "content": user_message}
    ]

    try:
        response = model.invoke(messages)
        content = getattr(response, "content", None) or str(response)
        ticker = content.strip().upper()

        import re
        match = re.search(r"([A-Z0-9.\-]+)", ticker)
        if match:
            val = match.group(1)
            return val if val else "UNKNOWN"
        return "UNKNOWN"

    except:
        return "UNKNOWN"


@app.route("/classify", methods=["POST"])
def classify_endpoint():
    data = request.get_json()
    message = data.get("message", "")
    ticker = classify_ticker(message)
    return jsonify({"ticker": ticker})


@app.route("/analyze", methods=["POST"])
def analyze_endpoint():
    data = request.get_json()
    ticker = data.get("ticker")
    date = data.get("date", "2025-10-20")

    if not ticker:
        return jsonify({"error": "ticker required"}), 400

    agent = TradingAgent()
    result = agent.analyze_stock(ticker, date)

    return jsonify({"analysis": result})


@app.route("/")
def health():
    return {"status": "running"}


if __name__ == "__main__":
    app.run(port=5000)