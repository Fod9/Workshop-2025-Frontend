import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useGameSocket } from "./game_socket";
import { usePlayer } from "./player";
import { useGame } from "./game";

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  system?: boolean; // true for system/notice messages
}

interface ChatContextValue {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { send, status } = useGameSocket();
  const { player } = usePlayer();
  const { gameId } = useGame();

  const isConnected = status === "connected" && !!player;

  useEffect(() => {
    setMessages([]);
  }, [gameId]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback((messageText: string) => {
    if (!messageText.trim() || !isConnected) return;

    const chatData = {
      type: "chat_message",
      data: {
        message: messageText.trim(),
        playerId: player!.id,
        playerName: player!.name,
        timestamp: new Date().toISOString()
      }
    };

    send(chatData);
  }, [player, isConnected, send]);

  // Listen for chat messages from WebSocket
  useEffect(() => {
    const handleChatMessage = (event: CustomEvent<ChatMessage>) => {
      addMessage(event.detail);
    };

    window.addEventListener('chat_message', handleChatMessage as EventListener);
    return () => {
      window.removeEventListener('chat_message', handleChatMessage as EventListener);
    };
  }, [addMessage]);

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isConnected }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
