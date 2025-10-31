from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.generatePortfolio import make_portfolio
from utils.marketData import fetch_historical_stockprices

app = Flask(__name__)
CORS(app)

current_portfolio = None

@app.route("/portfolio", strict_slashes=False)
def get_portfolio():
    global current_portfolio
    diversification = request.args.get("diversification", default=1, type=int)
    max_risk = request.args.get("max_risk", default=1, type=int)
    sectors = request.args.getlist("sectors")
    if len(sectors) == 1 and "," in sectors[0]:
        sectors = [s.strip() for s in sectors[0].split(",") if s.strip()]
    current_portfolio = make_portfolio(diversification, max_risk, sectors)

    return jsonify(current_portfolio)

@app.route("/portfolio/current", strict_slashes=False)
def get_current_portfolio():
    # global current_portfolio
    # print("DEBUG2 portfolio:", current_portfolio)

    # if current_portfolio is None:
    #    return jsonify({"error": "No portfolio generated yet"}), 404
    mock_data = [
        {"date": "2025-10-01", "portfolio_value": 100000},
        {"date": "2025-10-08", "portfolio_value": 101200},
        {"date": "2025-10-15", "portfolio_value": 99500},
        {"date": "2025-10-22", "portfolio_value": 102300},
        {"date": "2025-10-29", "portfolio_value": 103000},
    ]
    return jsonify(mock_data)
    # try:
    #     df = fetch_historical_stockprices(current_portfolio)
    #     df["date"] = df["date"].dt.strftime("%Y-%m-%d")
        
    #     data = df[["date", "portfolio_value"]].to_dict(orient="records")
    #     return jsonify(data)
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(port=5000)