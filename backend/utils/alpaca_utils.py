import os
from dotenv import load_dotenv
from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce, QueryOrderStatus, OrderType, OrderClass
from alpaca.trading.requests import GetOrdersRequest

# Load environment variables
load_dotenv()

# Initialize Alpaca client
API_KEY = os.getenv('ALPACA_API_KEY')
API_SECRET = os.getenv('ALPACA_API_SECRET')
PAPER = True  # Keep it paper trading for now

if not API_KEY or not API_SECRET:
    raise ValueError("❌ Missing Alpaca API credentials in .env")

trading_client = TradingClient(API_KEY, API_SECRET, paper=PAPER)

# ---------- Core Functions ---------- #

def get_account_info():
    """Fetch basic account information."""
    try:
        account = trading_client.get_account()
        #print(account)
        return {
            "id": account.id,
            "status": account.status,
            "equity": account.equity,
            "buying_power": account.buying_power
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


def place_market_order(symbol: str, qty: int, side: str):
    """Place a market buy/sell order."""
    try:
        order_data = MarketOrderRequest(
            symbol=symbol,
            qty=qty,
            side=OrderSide.BUY if side.lower() == "buy" else OrderSide.SELL,
            time_in_force=TimeInForce.GTC
        )
        order = trading_client.submit_order(order_data)
        return {"id": order.id, "symbol": order.symbol, "status": order.status}
    except Exception as e:
        return {"error": str(e)}


def cancel_all_orders():
    """Cancel all open orders."""
    try:
        trading_client.cancel_orders()
        return {"message": "All open orders canceled."}
    except Exception as e:
        return {"error": str(e)}
