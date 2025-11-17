from langgraph.graph import MessagesState, StateGraph, START, END
from .agent_states import AgentState
import pprint

def DispayResults(state):
    pprint.pprint(state["messages"])

class CompiledGraph:
    def __init__(self, agents: dict):
        pprint.pprint(AgentState)
        self.workflow = StateGraph(AgentState)

        self.workflow.add_node("market", agents["market"])
        self.workflow.add_node("media", agents["media"])
        self.workflow.add_node("news", agents["news"])
        self.workflow.add_node("fundamentals", agents["fundamentals"])

        self.workflow.add_node("display_results", DispayResults)

        self.workflow.add_edge(START, "market")
        self.workflow.add_edge(START, "media")
        self.workflow.add_edge(START, "news")
        self.workflow.add_edge(START, "fundamentals")

        self.workflow.add_edge("market", "display_results")
        self.workflow.add_edge("media", "display_results")
        self.workflow.add_edge("news", "display_results")
        self.workflow.add_edge("fundamentals", "display_results")

        self.workflow.add_edge("display_results", END)

    def get_compiled_workflow(self):
        return self.workflow.compile()

