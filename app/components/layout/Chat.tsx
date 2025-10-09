import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/components/chat.css"
import { useChat } from "./Chat.hooks";
import { useGame } from "~/context/game";
import { usePlayer } from "~/context/player";

export default function Chat() {
    const { messages, input, setInput, sendMessage, canSend } = useChat();
    const [isMinimized, setIsMinimized] = useState(false);
    const { gameId, players } = useGame();
    const { player } = usePlayer();

    // Draggable position state (pixels from viewport top/left)
    const [position, setPosition] = useState<{ top: number; left: number }>(() => {
        if (typeof window !== 'undefined') {
            try {
                const raw = window.localStorage.getItem("chat-position");
                if (raw) {
                    const parsed = JSON.parse(raw) as { top: number; left: number };
                    if (
                        typeof parsed?.top === "number" &&
                        typeof parsed?.left === "number"
                    ) {
                        return parsed;
                    }
                }
            } catch (_) { /* ignore */ }
        }
        return { top: 20, left: 20 };
    });

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dragStateRef = useRef<{
        dragging: boolean;
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
    }>({ dragging: false, offsetX: 0, offsetY: 0, width: 0, height: 0 });

    // Ensure position stays within viewport on resize
    useEffect(() => {
        const onResize = () => {
            const el = containerRef.current;
            if (!el) return;
            const maxLeft = Math.max(0, window.innerWidth - el.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - el.offsetHeight);
            setPosition((pos) => ({
                left: Math.min(Math.max(0, pos.left), maxLeft),
                top: Math.min(Math.max(0, pos.top), maxTop),
            }));
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const startDrag = useCallback((e: React.MouseEvent) => {
        // Avoid starting drag when clicking the toggle button
        if ((e.target as HTMLElement)?.closest?.('.chat-toggle')) return;

        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        dragStateRef.current.dragging = true;
        dragStateRef.current.offsetX = e.clientX - rect.left;
        dragStateRef.current.offsetY = e.clientY - rect.top;
        dragStateRef.current.width = rect.width;
        dragStateRef.current.height = rect.height;
        // Prevent text selection while dragging
        document.body.style.userSelect = 'none';
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            const st = dragStateRef.current;
            if (!st.dragging) return;
            const maxLeft = Math.max(0, window.innerWidth - st.width);
            const maxTop = Math.max(0, window.innerHeight - st.height);
            const newLeft = Math.min(Math.max(0, e.clientX - st.offsetX), maxLeft);
            const newTop = Math.min(Math.max(0, e.clientY - st.offsetY), maxTop);
            setPosition({ left: newLeft, top: newTop });
        };

        const onMouseUp = () => {
            if (!dragStateRef.current.dragging) return;
            dragStateRef.current.dragging = false;
            document.body.style.userSelect = '';
            try {
                window.localStorage.setItem("chat-position", JSON.stringify(position));
            } catch (_) { /* ignore */ }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [position]);

    const playersById = (() => {
        const map = new Map<string, { id: string; name: string; continent: string }>();
        for (const p of players) {
            map.set(p.id, { id: p.id, name: p.name, continent: p.continent });
        }
        return map;
    })();

    const normalizeContinent = (value?: string) => (value ?? "").toLowerCase();

    if (!gameId) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={`chat-container ${isMinimized ? 'minimized' : ''}`}
            style={{ top: position.top, left: position.left }}
        >
            <div className="chat-header" onMouseDown={startDrag}>
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
                        {messages.map((message) => {
                            if (message.system) {
                                return (
                                    <div key={message.id} className="chat-notice">
                                        {message.message}
                                    </div>
                                );
                            }
                            const isSelf = player?.id === message.playerId;
                            const sender = isSelf ? player : playersById.get(message.playerId);
                            const continentName = sender?.continent ?? "Unknown";
                            const key = normalizeContinent(continentName) || 'unknown';
                            const bubbleClass = `chat-bubble bubble-${key}`;
                            const avatarSrc = sender?.continent ? `/assets/continents/${sender.continent}.png` : undefined;
                            return (
                                <div key={message.id} className={`chat-message ${isSelf ? 'self' : 'other'}`}>
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt={continentName} className="chat-avatar" />
                                    ) : (
                                        <div className="chat-avatar placeholder" />
                                    )}
                                    <div className={bubbleClass}>
                                        <div className="chat-bubble-header">
                                            <span className="chat-player-name">{message.playerName}</span>
                                            <span className="chat-timestamp">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="chat-message-text">{message.message}</div>
                                    </div>
                                </div>
                            );
                        })}
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
