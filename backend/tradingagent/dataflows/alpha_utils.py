import os
from typing import Dict, List, Any

import requests
from dotenv import load_dotenv

load_dotenv()

ALPHA_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
ALPHA_BASE_URL = "https://www.alphavantage.co/query"


def _has_key() -> bool:
    if not ALPHA_API_KEY:
        print("ALPHA_VANTAGE_API_KEY not set; cannot fetch Alpha Vantage data.")
        return False
    return True


def get_top_gainers_losers() -> Dict[str, Any]:
    """
    Fetch the top 20 gainers, losers, and most actively traded stocks from Alpha Vantage.

    Returns a dict with keys: top_gainers, top_losers, most_actively_traded, metadata, last_updated.
    Each list item mirrors the Alpha Vantage response shape (ticker, price, change_amount, change_percentage).
    """
    if not _has_key():
        return {
            "top_gainers": [],
            "top_losers": [],
            "most_actively_traded": [],
            "metadata": {},
            "last_updated": None,
        }

    params = {
        "function": "TOP_GAINERS_LOSERS",
        "apikey": ALPHA_API_KEY,
    }

    try:
        resp = requests.get(ALPHA_BASE_URL, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        def ensure_list(value: Any) -> List[dict]:
            return value if isinstance(value, list) else []

        return {
            "top_gainers": ensure_list(data.get("top_gainers")),
            "top_losers": ensure_list(data.get("top_losers")),
            "most_actively_traded": ensure_list(data.get("most_actively_traded")),
            "metadata": data.get("metadata", {}),
            "last_updated": data.get("last_updated"),
        }
    except requests.exceptions.RequestException as exc:
        print(f"(AlphaVantage) Error fetching top movers: {exc}")
        return {
            "top_gainers": [],
            "top_losers": [],
            "most_actively_traded": [],
            "metadata": {},
            "last_updated": None,
        }

if __name__ == "__main__":
    result = get_top_gainers_losers()
    print("Top Gainers:", result.get("top_gainers")[:5])
    print("Top Losers:", result.get("top_losers")[:5])
    print("Most Actively Traded:", result.get("most_actively_traded")[:5])
    print("Last Updated:", result.get("last_updated"))

