from dotenv import load_dotenv
import os

load_dotenv()

# Common .env names: ALPACA_API_KEY and ALPACA_API_SECRET (also accept alpaca_key / alpaca_secret)
API_KEY = os.getenv("ALPACA_API_KEY")
API_SECRET = os.getenv("ALPACA_API_SECRET")

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest, LimitOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce


def get_trading_client(api_key: str, api_secret: str) -> TradingClient:
  """Create and return an Alpaca TradingClient. Raises ValueError if credentials missing."""
  if not api_key or not api_secret:
    raise ValueError("Alpaca API credentials not set. Set ALPACA_API_KEY and ALPACA_API_SECRET in your environment or .env file.")
  return TradingClient(api_key, api_secret, paper=True)


trading_client = get_trading_client(API_KEY, API_SECRET)

# preparing market order
market_order_data = MarketOrderRequest(
  symbol="SPY",
  qty=0.023,
  side=OrderSide.BUY,
  time_in_force=TimeInForce.DAY,
)

# Market order (wrapped with error handling)
try:
  market_order = trading_client.submit_order(order_data=market_order_data)
  print("Market order submitted:", market_order)
except Exception as e:
  # Alpaca client will raise APIError on HTTP issues; show a helpful message
  print("Failed to submit market order:", e)

# preparing limit order
# Note: Alpaca expects crypto symbols without a slash (e.g. 'BTCUSD') when trading crypto on the API.
limit_order_data = LimitOrderRequest(
  symbol="BTCUSD",
  limit_price=17000,
  notional=4000,
  side=OrderSide.SELL,
  time_in_force=TimeInForce.GTC,
)

try:
  limit_order = trading_client.submit_order(order_data=limit_order_data)
  print("Limit order submitted:", limit_order)
except Exception as e:
  print("Failed to submit limit order:", e)