from .agent_states import AgentState

class GraphConditions:

    def __init__(self, max_debate_rounds=2):
        """Initialize with configuration parameters."""
        self.max_debate_rounds = max_debate_rounds

    def continue_debate(self, state: AgentState):
        """Determine if debate should continue."""

        if (
            state["debate_state"]["rounds_completed"] >= 2 * self.max_debate_rounds
        ):  # 3 rounds of back-and-forth between 2 agents
            print("------DEBATE ENDING: Max rounds reached------")
            return "judge"
        if state["debate_state"]["last_msg"].startswith("Bull"):
            return "bear_debator"
        return "bull_debator"
    