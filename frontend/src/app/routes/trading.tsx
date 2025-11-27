import ChatBot from "../../components/ChatBot";
import PortfolioHoldings from "../../components/PortfolioHoldings";

export function ChatPage() {
  return (
    <div className="flex justify-center p-6 h-[calc(100vh-80px)] overflow-hidden">
      <PortfolioHoldings />
      <ChatBot />
    </div>
  );
}

export default ChatPage;
