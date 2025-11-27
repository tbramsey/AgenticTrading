import ChatBot from "../../components/ChatBot";

export function ChatPage() {
  return (
    <div className="flex justify-center p-6 h-[calc(100vh-80px)] overflow-hidden">
      <ChatBot />
    </div>
  );
}

export default ChatPage;
