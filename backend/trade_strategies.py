"""Trade strategies data.

This module provides a dictionary of trade strategy categories and brief
descriptions.
"""

from typing import Dict

TRADE_STRATEGIES: Dict[str, Dict[str, str]] = {
    "time-based": {
        "Day Trading": (
            "Entering and exiting positions within the same day to profit from "
            "short-term price fluctuations."
        ),
        "Swing Trading": (
            "Holding positions for a period of a few days to a few weeks to "
            "profit from an intermediate trend."
        ),
        "Position Trading": (
            "Holding positions for an extended period, from weeks to months "
            "or even years, to capitalize on long-term market trends."
        ),
    },

    "trend-based": {
        "Trend Trading": (
            "Identifying and following the direction of the market trend, "
            "either by buying during an uptrend or selling short during a "
            "downtrend."
        ),
        "Momentum Trading": (
            "Trading based on the assumption that assets that have been "
            "moving strongly will continue to do so."
        ),
        "Breakout Trading": (
            "Identifying and entering a trade when the price moves beyond "
            "a defined range, such as a support or resistance level."
        ),
        "Range Trading": (
            "Buying at support levels and selling at resistance levels "
            "within a defined price channel."
        ),
        "Mean Reversion": (
            "Betting that prices will return to their historical average "
            "after a significant deviation."
        ),
        "Reversal Trading": (
            "Identifying potential turning points in a trend to trade the "
            "new direction."
        ),
    },

    "event-based": {
        "News Trading": (
            "Trading based on fundamental news events that are expected to "
            "impact a market."
        ),
        "Gap Trading": (
            "Trading based on price gaps that occur when a security's "
            "opening price is significantly different from its previous "
            "closing price."
        ),
        "Arbitrage": (
            "Simultaneously buying and selling an asset in two different "
            "markets to profit from a price difference between them."
        ),
        "Algorithmic Trading": (
            "Using computer programs to automatically execute trades based "
            "on a set of pre-programmed instructions."
        ),
    },
}


def get_trade_strategies() -> Dict[str, Dict[str, str]]:

    # Shallow copy of outer dict and each inner dict
    return {k: v.copy() for k, v in TRADE_STRATEGIES.items()}


__all__ = ["TRADE_STRATEGIES", "get_trade_strategies"]