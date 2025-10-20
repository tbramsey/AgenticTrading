import pandas as pd

def score_stock(info):
    # Normalize key metrics safely
    pe = info.get("pe_ratio", 0)
    peg = info.get("peg_ratio", 0)
    roe = info.get("return_on_equity_ttm", 0)
    pm = info.get("profit_margin", 0)
    growth = info.get("quarterly_earnings_growth_yoy", 0)
    beta = info.get("beta", 1)
    dy = info.get("dividend_yield", 0)
    debt_ratio = info.get("price_to_book_ratio", 0)
    
    # Sub-scores (0–100 each)
    value_score = max(0, min(100, 100 - (pe if pe > 0 else 50)))               # lower PE = better
    growth_score = max(0, min(100, growth * 300))                              # higher growth = better
    profitability_score = max(0, min(100, (roe * 400) + (pm * 200)))           # ROE + profit margin
    dividend_score = max(0, min(100, dy * 8000))                               # 2% yield → 16 pts, 5% → 40 pts
    risk_score = max(0, min(100, 100 - abs(beta - 1) * 100))                   # beta ~1 = stable
    stability_score = max(0, min(100, 100 - (debt_ratio - 1) * 50))            # lower P/B = safer

    # Weighted average
    total = (
        0.25 * value_score +
        0.25 * profitability_score +
        .2 * growth_score +
        0.1 * dividend_score +
        0.1 * stability_score +
        0.1 * risk_score
    )

    return round(total, 1)

if __name__ == "__main__":
    stock_df = pd.read_csv("stock_data.csv")

    stock_df["score"] = stock_df.apply(score_stock, axis=1)
    stock_df = stock_df.sort_values("score", ascending=False)
    for row in stock_df.itertuples():
        print(f"{row.symbol}: {row.score}")


      