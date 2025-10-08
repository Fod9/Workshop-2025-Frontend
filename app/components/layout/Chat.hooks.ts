import { useState, useCallback } from "react";
import { useChat as useChatContext } from "~/context/chat";

export { type ChatMessage } from "~/context/chat";

export function useChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage: sendChatMessage, isConnected } = useChatContext();

  const sendMessage = useCallback(() => {
    if (!input.trim() || !isConnected) return;
    
    sendChatMessage(input);
    setInput("");
  }, [input, isConnected, sendChatMessage]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    canSend: isConnected
  };
}