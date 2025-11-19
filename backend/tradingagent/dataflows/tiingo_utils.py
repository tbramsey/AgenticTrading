import os, requests
from dotenv import load_dotenv
import pprint

load_dotenv()

ting_api_key = os.getenv("TIINGO_API_KEY")

if not ting_api_key:
    raise ValueError("TIINGO_API_KEY not found in environment variables")

url="https://api.tiingo.com/tiingo"

def structure_fundamentals(raw):
    """
    Takes raw Tiingo fundamentals (the giant dump) and extracts:
      - Income Statement (cleaned & normalized)
      - Balance Sheet
      - Cash Flow
      - Ratios (overview)
    
    Returns a compact, LLM-friendly JSON structure.
    """

    def extract(mapping_list, wanted_fields):
        """Convert array of {'dataCode': 'x', 'value': y} into dict with renamed readable keys."""
        out = {}
        lookup = {item["dataCode"]: item["value"] for item in mapping_list}

        for key, code in wanted_fields.items():
            out[key] = lookup.get(code, None)

        return out

    # --------------------------
    # Income Statement
    # --------------------------
    income_fields = {
        "revenue": "revenue",
        "gross_profit": "grossProfit",
        "operating_income": "opinc",
        "ebitda": "ebitda",
        "net_income": "netinc",
        "eps": "epsDil",
        "rnd_expense": "rnd",
        "cost_of_revenue": "costRev"
    }

    income = extract(raw.get("incomeStatement", []), income_fields)

    # --------------------------
    # Balance Sheet
    # --------------------------
    balance_fields = {
        "cash": "cashAndEq",
        "total_assets": "totalAssets",
        "total_liabilities": "totalLiabilities",
        "equity": "equity",
        "current_assets": "assetsCurrent",
        "current_liabilities": "liabilitiesCurrent",
        "debt": "debt",
        "debt_current": "debtCurrent",
        "debt_noncurrent": "debtNonCurrent",
        "inventory": "inventory",
        "accounts_receivable": "acctRec",
        "accounts_payable": "acctPay",
    }

    balance = extract(raw.get("balanceSheet", []), balance_fields)

    # --------------------------
    # Cash Flow
    # --------------------------
    cash_flow_fields = {
        "operating_cf": "ncfo",
        "free_cf": "freeCashFlow",
        "capex": "capex",
        "dividends_paid": "payDiv",
        "debt_issued_or_repaid": "issrepayDebt"
    }

    cashflow = extract(raw.get("cashFlow", []), cash_flow_fields)

    # --------------------------
    # Ratios / Overview
    # --------------------------
    ratio_fields = {
        "current_ratio": "currentRatio",
        "gross_margin": "grossMargin",
        "profit_margin": "profitMargin",
        "roe": "roe",
        "roa": "roa",
        "debt_to_equity": "debtEquity",
        "long_term_debt_to_equity": "longTermDebtEquity",
        "piotroski_score": "piotroskiFScore",
        "revenue_qoq": "revenueQoQ",
        "eps_qoq": "epsQoQ",
        "book_value": "bookVal"
    }

    overview = extract(raw.get("overview", []), ratio_fields)

    # --------------------------
    # FINAL STRUCTURED OUTPUT
    # --------------------------
    structured = {
        "income_statement": income,
        "balance_sheet": balance,
        "cash_flow": cashflow,
        "ratios": overview
    }

    return structured


def get_fundamental_data(ticker: str, trade_date: str):
    """
    Retrieve news articles for a specific stock using the MarketAux API.
    
    Args:
        ticker: Stock ticker symbol (e.g., 'AAPL')
        trade_date: Day to retrieve news for (format: 'YYYY-MM-DD')
    """

    params = {
        "symbols": ticker.upper(),
        "token": ting_api_key
    }

    #MarketAux API Call
    try:
        response = requests.get(f"{url}/fundamentals/{ticker}/statements", params=params)
        response.raise_for_status()
        data = response.json()
        
        # MarketAux returns data directly, not a status field
        if "statementData" in data[0]:
            data = data[0].get("statementData", [])
            return structure_fundamentals(data)
        else:
            print(f"Unexpected response format: {data}")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"(Tiingo) Error fetching news for {ticker}: {e}")


if __name__ == "__main__":
    test_ticker = "AAPL"
    print(f"Fetching fundamentals for {test_ticker}...")
    
    try:
        fundamentals = get_fundamental_data(test_ticker, "2024-06-01")
        
        if fundamentals:
            print(f"\nFound fundamental data:\n")
            pprint.pprint(fundamentals)
        else:
            print("No articles found or API request failed.")
    
    except Exception as e:
        print(f"Error: {e}")
