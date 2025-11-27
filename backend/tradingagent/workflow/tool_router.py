from tradingagent.utils.data_tools import get_stock_news, get_market_trends, get_company_fundamentals

def execute_tools(state):
    """Execute tool calls from the last message."""
    messages = state.get("messages", [])
    if not messages:
        return state
    
    last_msg = messages[-1]
    if not hasattr(last_msg, "tool_calls") or len(last_msg.tool_calls) == 0:
        return state
    
    # Execute each tool call
    new_messages = list(messages)
    for tool_call in last_msg.tool_calls:
        tool_name = tool_call.get("name")
        tool_args = tool_call.get("args", {})
        
        if tool_name == "get_stock_news":
            # Call the tool's invoke method (StructuredTool) or func attribute
            if hasattr(get_stock_news, "invoke"):
                result = get_stock_news.invoke(tool_args)
            elif hasattr(get_stock_news, "func"):
                result = get_stock_news.func(**tool_args)
            else:
                # Fallback: try calling directly
                result = get_stock_news(**tool_args)
        elif tool_name == "get_market_trends":
            # Call the tool's invoke method (StructuredTool) or func attribute
            if hasattr(get_market_trends, "invoke"):
                result = get_market_trends.invoke(tool_args)
            elif hasattr(get_market_trends, "func"):
                result = get_market_trends.func(**tool_args)
            else:
                # Fallback: try calling directly
                result = get_market_trends(**tool_args)
        elif tool_name == "get_company_fundamentals":
            if hasattr(get_company_fundamentals, "invoke"):
                result = get_company_fundamentals.invoke(tool_args)
            elif hasattr(get_company_fundamentals, "func"):
                result = get_company_fundamentals.func(**tool_args)
            else:
                result = get_company_fundamentals(**tool_args)
            
        # Create a simple dict message for tool result
        tool_message = {
            "role": "tool",
            "content": str(result),
            "tool_call_id": tool_call.get("id"),
            "name": tool_name
        }
        new_messages.append(tool_message)
    
    state["messages"] = new_messages
    return state