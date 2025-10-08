import { useState } from "react";
import "../../styles/components/chat.css"
import { useChat } from "./Chat.hooks";
import { useGame } from "~/context/game";

export default function Chat() {
    const { messages, input, setInput, sendMessage, canSend } = useChat();
    const [isMinimized, setIsMinimized] = useState(false);
    const { gameId } = useGame();

    if (!gameId) {
        return null;
    }

    return (
        <div className={`chat-container ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header">
                <span>Chat</span>
                <button 
                    className="chat-toggle"
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    {isMinimized ? '▲' : '▼'}
                </button>
            </div>
            
            {!isMinimized && (
                <>
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div key={message.id} className="chat-message">
                                <span className="chat-player-name">{message.playerName}:</span>
                                <span className="chat-message-text">{message.message}</span>
                                <span className="chat-timestamp">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={canSend ? "Type a message..." : "Connecting..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                        disabled={!canSend}
                    />
                </>
            )}
        </div>
    )
}