from flask import Flask, jsonify
from flask_cors import CORS
from utils.generatePortfolio import make_portfolio

app = Flask(__name__)
CORS(app)

@app.route("/portfolio")
def get_portfolio():
    portfolio = make_portfolio(diversification=100, max_risk=50)
    return jsonify(portfolio)

if __name__ == "__main__":
    app.run(port=5000)