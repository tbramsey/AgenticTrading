import os
from dotenv import load_dotenv
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce, QueryOrderStatus, OrderType, OrderClass
from alpaca.trading.requests import GetOrdersRequest
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockLatestQuoteRequest

# Load environment variables
load_dotenv()

# Initialize Alpaca client
API_KEY = os.getenv('ALPACA_API_KEY')
API_SECRET = os.getenv('ALPACA_API_SECRET')
PAPER = True  # Keep it paper trading for now

if not API_KEY or not API_SECRET:
    raise ValueError("❌ Missing Alpaca API credentials in .env")

trading_client = TradingClient(API_KEY, API_SECRET, paper=PAPER)


def _to_float(value):
    try:
        return float(value)
    except Exception:
        return None

# ---------- Core Functions ---------- #

def get_account_info():
    """Fetch basic account information."""
    try:
        account = trading_client.get_account()
        equity = _to_float(account.equity)
        last_equity = _to_float(getattr(account, "last_equity", None))
        portfolio_value = _to_float(getattr(account, "portfolio_value", None)) or equity
        day_pnl = None
        if equity is not None and last_equity is not None:
            day_pnl = equity - last_equity

        return {
            "id": account.id,
            "status": account.status,
            "equity": equity,
            "last_equity": last_equity,
            "portfolio_value": portfolio_value,
            "buying_power": _to_float(account.buying_power),
            "cash": _to_float(getattr(account, "cash", None)),
            "day_pnl": day_pnl,
        }
    except Exception as e:
        return {"error": str(e)}


def get_positions():
    """Get all open positions."""
    try:
        positions = trading_client.get_all_positions()
        return [
            {"symbol": p.symbol, "qty": p.qty, "avg_entry_price": p.avg_entry_price}
            for p in positions
        ]
    except Exception as e:
        return {"error": str(e)}


def get_open_orders():
    """Retrieve all open orders."""
    try:
        orders = trading_client.get_orders(
            GetOrdersRequest(status=QueryOrderStatus.OPEN)
        )
        return [
            {
                "symbol": o.symbol,
                "qty": o.qty,
                "side": o.side,
                "type": o.type,
                "limit_price": getattr(o, "limit_price", None),
                "status": o.status,
            }
            for o in orders
        ]
    except Exception as e:
        return {"error": str(e)}


def place_market_order(symbol: str, amount: int, side: str):
    """Place a market buy/sell order."""
    try:
        order_data = MarketOrderRequest(
            symbol=symbol,
            qty=amount, #qty #notional
            side=OrderSide.BUY if side.lower() == "buy" else OrderSide.SELL,
            time_in_force=TimeInForce.GTC
        )
        order = trading_client.submit_order(order_data)
        return {"id": order.id, "symbol": order.symbol, "status": order.status}
    except Exception as e:
        return {"error": str(e)}
    
def create_portfolio(portfolio, initial_investment):
    data_client = StockHistoricalDataClient(API_KEY, API_SECRET)

    for symbol, weight, _ in portfolio:
        req = StockLatestQuoteRequest(symbol_or_symbols=[symbol])
        quote = data_client.get_stock_latest_quote(req)

        ask = quote[symbol].ask_price or 0
        bid = quote[symbol].bid_price or 0
        current_price = (ask + bid) / 2 if (ask and bid) else ask or bid

        if not current_price:
            print(f"Skipping {symbol} — invalid quote data.")
            continue

        amount = (float(weight) / 100) * initial_investment
        qty = int(amount // current_price)

        if qty <= 0:
            print(f"Skipping {symbol} — not enough for one share at ${current_price:.2f}")
            continue

        print(f"Buying {qty} shares of {symbol} at ${current_price:.2f} (~${amount:.2f})")
        place_market_order(symbol, qty, "buy")


def cancel_all_orders():
    """Cancel all open orders."""
    try:
        trading_client.cancel_orders()
        return {"message": "All open orders canceled."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    portfolio = [
        ("AAPL", 25.0, "Tech"),
        ("MSFT", 30.0, "Tech"),
        ("GOOG", 45.0, "Tech"),
    ]
    #create_portfolio(portfolio, 10000)
    print(cancel_all_orders())
    #print(place_market_order("AAPL", 1, "buy"))
    #print(get_account_info())
