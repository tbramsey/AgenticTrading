from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.generatePortfolio import make_portfolio, fetch_stockprices
import json, os

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
    

if __name__ == "__main__":
    app.run(port=5000)