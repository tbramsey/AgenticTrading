import os
from alpaca.trading.client import TradingClient
from dotenv import load_dotenv

load_dotenv()

def test_alpaca_api():
    api_key = os.getenv('APCA_API_KEY_ID')
    api_secret = os.getenv('APCA_API_SECRET_KEY')

    if not api_key or not api_secret:
        print('❌ Missing Alpaca API credentials in environment variables.')
        return
    
    # paper=True means we’re connecting to the paper trading environment
    trading_client = TradingClient(api_key, api_secret, paper=True)

    try:
        account = trading_client.get_account()
        print('\n✅ Connected successfully!')
        print('Account Information:')
        print(f'ID: {account.id}')
        print(f'Status: {account.status}')
        print(f'Equity: {account.equity}')
        print(f'Buying Power: {account.buying_power}')
    except Exception as e:
        print(f'❌ Error connecting to Alpaca API: {e}')

if __name__ == '__main__':
    test_alpaca_api()
