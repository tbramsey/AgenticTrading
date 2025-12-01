from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.generatePortfolio import make_portfolio, fetch_stockprices
from utils.alpaca_utils import create_portfolio
from main import classify_ticker
from tradingagent.workflow.trading_agent import TradingAgent
from tradingagent.dataflows.marketaux_utils import get_general_news
from tradingagent.dataflows import fetch_massive_ticker_details as get_stock_details
from utils.alpaca_utils import get_account_info
import json, os
from datetime import datetime
from typing import Iterable, List, Tuple, Any


app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=False,
    allow_headers=["Content-Type"],
    methods=["GET", "POST", "OPTIONS"],
)



# Endpoint for chatBot to analyze a stock
@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze_stock():
    """Endpoint for chatBot to analyze a stock"""
    print("Received /analyze request")
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Extract ticker from user message
        ticker = classify_ticker(user_message)
        
        if ticker == "UNKNOWN":
            return jsonify({
                "response": "I couldn't identify a ticker symbol from your message. Could you please specify a stock ticker (e.g., AAPL, TSLA)?",
                "ticker": None
            })

        print(f"Analyzing {ticker}...")
        agent = TradingAgent()
        report = agent.analyze_stock(ticker, datetime.now().strftime("%Y-%m-%d"))
        
        report_payload = {
            "ticker": report.ticker,
            "trade_date": report.trade_date,
            "final_trade_decision": report.get_trade_decision(),
            "risk_report": report.get_risk_report(),
            "debate_report": report.get_debate_report(),
            "analytics": report.get_analytics(),
            "formatted_data": report.get_formatted_data(),
        }

        return jsonify({
            "response": f"Analysis complete for {ticker}.",
            "ticker": ticker,
            "analysis": report_payload.get("final_trade_decision"),
            # Provide multiple keys for compatibility with the chat UI.
            "report": report_payload,
            "stock_report": report_payload,
        })
        
    
    except Exception as e:
        print(f"Error in /analyze: {str(e)}")
        return jsonify({"error": str(e)}), 500

def save_portfolio(p):
    print("Saving portfolio to current_portfolio.json")
    with open("current_portfolio.json", "w") as f:
        json.dump(p, f)


def load_portfolio():
    if os.path.exists("current_portfolio.json"):
        with open("current_portfolio.json", "r") as f:
            return json.load(f)
    return None


def normalize_portfolio(portfolio: Iterable[Any]) -> List[Tuple[str, float, str]]:
    """Ensure portfolio items are tuples (symbol, weight, desc) regardless of source shape."""
    normalized: List[Tuple[str, float, str]] = []
    for item in portfolio:
        if isinstance(item, dict):
            symbol = item.get("symbol") or item.get("ticker") or ""
            weight = float(item.get("weight", 0))
            desc = item.get("description") or item.get("desc") or ""
        elif isinstance(item, (list, tuple)) and len(item) >= 2:
            symbol = item[0]
            weight = float(item[1])
            desc = item[2] if len(item) > 2 else ""
        else:
            continue
        if symbol:
            normalized.append((symbol, weight, desc))
    return normalized

current_portfolio = None

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
    
@app.route("/sectors")
def get_sectors():
    # Ensure jsonify is available even if not imported globally
    
    try:
        # Verify load_portfolio exists before calling it to avoid hard crashes
        if 'load_portfolio' not in globals():
            return jsonify({"error": "load_portfolio function is missing on server"}), 500

        current_portfolio = load_portfolio() or []
        
        # Data structure: List of tuples
        # (symbol, weight, description, sector)
        
        sector_totals = {}

        for row in current_portfolio:
            try:
                print(f"Processing row: {row}")

                weight = 0.0
                sector = None

                if isinstance(row, dict):
                    weight = float(row.get("weight", 0.0))
                    sector = row.get("sector") or row.get("industry")
                elif isinstance(row, (list, tuple)):
                    if len(row) >= 2:
                        weight = float(row[1])
                    if len(row) >= 4:
                        sector = row[3]
                else:
                    continue

                if weight == 0:
                    continue

                sector = sector or "Unclassified"
                sector_totals[sector] = sector_totals.get(sector, 0.0) + weight

            except (IndexError, ValueError) as e:
                print(f"Skipping row due to error: {e}")
                continue

        response_data = []
        for sector, total_weight in sector_totals.items():
            response_data.append({
                "name": sector,
                "value": round(total_weight, 2)
            })
        
        return jsonify(response_data)

    except Exception as e:
        # Log the actual error to the server console
        print(f"CRITICAL ERROR in /sectors: {e}")
        # Return a simple JSON error that won't crash the frontend
        return jsonify({"error": str(e)}), 500



@app.route("/news/trending")
def trending_news():
    """Provide a generic trending news feed (no ticker filter)."""
    limit = request.args.get("limit", default=5, type=int)
    articles = get_general_news(limit=limit)

    # Normalize/simplify fields for the frontend
    normalized = []
    for a in articles:
        normalized.append(
            {
                "title": a.get("title") or a.get("headline"),
                "source": a.get("source") or a.get("entities", [{}])[0].get("name") if a.get("entities") else "MarketAux",
                "published_at": a.get("published_at") or a.get("published_on"),
                "url": a.get("url"),
            }
        )

    # Fallback stub if API is unavailable or empty
    if not normalized:
        normalized = [
            {
                "title": "Markets rally as CPI cools",
                "source": "Mock Feed",
                "published_at": "Just now",
                "url": "",
            },
            {
                "title": "AI chip demand outpaces forecasts",
                "source": "Mock Feed",
                "published_at": "Today",
                "url": "",
            },
        ]

    return jsonify(normalized)


@app.route("/brokerage/account")
def brokerage_account():
    """Expose Alpaca account snapshot for the dashboard."""
    info = get_account_info()
    return jsonify(info)


@app.route("/search/<ticker>", methods=["GET", "OPTIONS"])
def search_ticker(ticker: str):
    """Proxy Massive reference lookup for a given ticker."""
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    normalized = (ticker or "").strip().upper()
    if not normalized:
        return jsonify({"error": "Ticker is required"}), 400

    try:
        details = get_stock_details(normalized)
        if not details:
            return jsonify({"error": f"No reference data found for {normalized}"}), 404

        return jsonify(
            {
                "ticker": normalized,
                "data": details,
            }
        )
    except Exception as e:
        print(f"Error in /search/{normalized}: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)
