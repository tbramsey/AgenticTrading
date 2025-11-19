
from .debators.bears_debator import create_bear_debator
from .debators.bulls_debator import create_bull_debator
from .managers.judge import create_judge

__all__ = [
    "create_bear_debator",
    "create_bull_debator",
    "create_judge",
]