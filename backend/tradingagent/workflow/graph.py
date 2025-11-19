from langgraph.graph import MessagesState, StateGraph, START, END
from .agent_states import AgentState
from .tool_router import execute_tools
from .GraphConditions import GraphConditions
import pprint

from tradingagent.agents import *


def DispayResults(state):
    # pprint.pprint(state["messages"])
    # print("\nNews Report: \n")
    # print(state["news_report"])
    # print("\nMarket Report: \n")
    # print(state["market_report"])
    # print("\nFundamentals Report: \n")
    # print(state["fundamentals_report"])
    print("\nFinal Messages: \n")
    print(state["debate_state"]["history"])
    print(state["investment_plan"])

class CompiledGraph:
    def __init__(self, agents: dict, q_llm, d_llm):
        pprint.pprint(AgentState)
        self.workflow = StateGraph(AgentState)

        self.quick_thinking_llm = q_llm
        self.deep_thinking_llm = d_llm

        self.agents = agents
        self.selected_analysts = list(agents.keys())

        self.conditions = GraphConditions()


    def get_compiled_workflow(self):


        for name, agent in self.agents.items():
            self.workflow.add_node(name, agent)

        self.workflow.add_node("tools", execute_tools)
        self.workflow.add_node("display_results", DispayResults)

        self.workflow.add_node("bull_debator", create_bull_debator(self.quick_thinking_llm))
        self.workflow.add_node("bear_debator", create_bear_debator(self.quick_thinking_llm))

        self.workflow.add_node("judge", create_judge(self.quick_thinking_llm))

        def route_node(state, next_node):
            if state.get("messages") and len(state["messages"]) > 0:
                last_msg = state["messages"][-1]
                if hasattr(last_msg, "tool_calls") and len(last_msg.tool_calls) > 0:
                    return "tools"
            return next_node
        
        def make_router(curr_node):
            return lambda s, curr_node=curr_node: route_node(s, self.selected_analysts[curr_node+1] if curr_node + 1 < len(self.selected_analysts) else "bull_debator")
        
        for i in range(len(self.selected_analysts)):

            self.workflow.add_conditional_edges(
                self.selected_analysts[i],
                make_router(i)
            )
            print("Added conditional edge from ", self.selected_analysts[i], " to ", self.selected_analysts[i+1] if i + 1 < len(self.selected_analysts) else "bull_debator")

        def return_to_sender(state):
            sender = state.get("sender")
            if sender:
                print("Routing back to sender:", sender)
                return sender
            print("No sender found in state, returning to END")
            return END

        self.workflow.add_conditional_edges(
            "tools",
            return_to_sender
        )

        self.workflow.add_edge(START, self.selected_analysts[0])
        self.workflow.add_edge("display_results", END)

        self.workflow.add_conditional_edges(
            "bull_debator",
            self.conditions.continue_debate
        )
        self.workflow.add_conditional_edges(
            "bear_debator",
            self.conditions.continue_debate
        )

        self.workflow.add_edge("judge", "display_results")

        return self.workflow.compile()

