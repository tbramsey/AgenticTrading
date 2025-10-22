from flask import Flask, jsonify
from flask_cors import CORS
from utils.generatePortfolio import make_portfolio

app = Flask(__name__)
CORS(app)

@app.route("/portfolio")
def get_portfolio():
    portfolio = make_portfolio(diversification=50, max_risk=50)
    # portfolio = [
    #     {"symbol": "AAPL", "weight": 25},
    #     {"symbol": "MSFT", "weight": 18},
    #     {"symbol": "GOOG", "weight": 12},
    #     {"symbol": "AMZN", "weight": 9},
    #     {"symbol": "TSLA", "weight": 8},
    #     {"symbol": "NVDA", "weight": 6},
    #     {"symbol": "BRK.B", "weight": 5},
    #     {"symbol": "META", "weight": 4},
    #     {"symbol": "V", "weight": 7},
    #     {"symbol": "JNJ", "weight": 6}
    # ]
    return jsonify(portfolio)

if __name__ == "__main__":
    app.run(port=5000)