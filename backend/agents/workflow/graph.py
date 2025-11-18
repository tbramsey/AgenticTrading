from langgraph.graph import MessagesState, StateGraph, START, END
from .agent_states import AgentState
from .tool_router import execute_tools
import pprint

def DispayResults(state):
    # pprint.pprint(state["messages"])
    print("\nNews Report: \n")
    pprint.pprint(state["news_report"])
    print("\nMarket Report: \n")
    pprint.pprint(state["market_report"])
    print("\nMessages: \n")
    pprint.pprint(state["messages"])

class CompiledGraph:
    def __init__(self, agents: dict):
        pprint.pprint(AgentState)
        self.workflow = StateGraph(AgentState)

        selected_analysts = list(agents.keys())

        for name, agent in agents.items():
            self.workflow.add_node(name, agent)

        self.workflow.add_node("tools", execute_tools)
        self.workflow.add_node("display_results", DispayResults)

        def route_node(state, next_node):
            if state.get("messages") and len(state["messages"]) > 0:
                last_msg = state["messages"][-1]
                if hasattr(last_msg, "tool_calls") and len(last_msg.tool_calls) > 0:
                    return "tools"
            return next_node
        
        def make_router(curr_node):
            return lambda s, curr_node=curr_node: route_node(s, selected_analysts[curr_node+1] if curr_node + 1 < len(selected_analysts) else "display_results")
        
        for i in range(len(selected_analysts)):

            self.workflow.add_conditional_edges(
                selected_analysts[i],
                make_router(i)
            )
            print("Added conditional edge from ", selected_analysts[i], " to ", selected_analysts[i+1] if i + 1 < len(selected_analysts) else "display_results")

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

        self.workflow.add_edge(START, selected_analysts[0])
        self.workflow.add_edge("display_results", END)

        # # self.workflow.add_node("market", agents["market"])
        # # self.workflow.add_node("media", agents["media"])
        # # self.workflow.add_node("news", agents["news"])
        # # self.workflow.add_node("fundamentals", agents["fundamentals"])

        # # Add tool execution node for news analyst to run tool calls
        # self.workflow.add_node("tools", execute_tools)

        # self.workflow.add_node("display_results", DispayResults)

        # self.workflow.add_edge(START, "market")
        # self.workflow.add_edge(START, "media")
        # self.workflow.add_edge(START, "news")
        # self.workflow.add_edge(START, "fundamentals")

        # # Route news analyst output: if it has tool_calls, go to tools node; otherwise display_results
        
        # def return_tool(state):
        #     return state["sender"]

        # self.workflow.add_conditional_edges("news", route_news)
        # self.workflow.add_conditional_edges("market", route_news)
        # self.workflow.add_conditional_edges("tools", return_tool)

        # self.workflow.add_edge("media", "display_results")
        # self.workflow.add_edge("fundamentals", "display_results")


    def get_compiled_workflow(self):
        return self.workflow.compile()

