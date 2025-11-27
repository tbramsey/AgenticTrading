from .agent_states import AgentState

class GraphConditions:

    def __init__(self, max_debate_rounds=2, max_risk_discuss_rounds=1):
        """Initialize with configuration parameters."""
        self.max_debate_rounds = max_debate_rounds
        self.max_risk_discuss_rounds = max_risk_discuss_rounds

    def continue_debate(self, state: AgentState):
        """Determine if debate should continue."""

        if (
            state["debate_state"]["rounds_completed"] >= 2 * self.max_debate_rounds
        ):  # 3 rounds of back-and-forth between 2 agents
            print("------DEBATE ENDING: Max rounds reached------")
            return "debate_judge"
        if state["debate_state"]["last_msg"].startswith("Bull"):
            return "bear_debator"
        return "bull_debator"
    
    def should_continue_risk_analysis(self, state: AgentState) -> str:
        """Determine if risk analysis should continue."""
        if (
            state["risk_state"]["count"] >= 3 * self.max_risk_discuss_rounds
        ):  # 3 rounds of back-and-forth between 3 agents
            print("------RISK DEBATE ENDING: Max rounds reached------")
            return "risk_judge"
        if state["risk_state"]["latest_speaker"].startswith("Risky"):
            return "safe_analyst"
        if state["risk_state"]["latest_speaker"].startswith("Safe"):
            return "neutral_analyst"
        return "risky_analyst"
    