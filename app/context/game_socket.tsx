import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { resolveWebSocketUrl } from "~/services/websocket";
import { useGame } from "~/context/game";
import type { PartyPlayer } from "~/types/player";
import { useNavigate } from "react-router";
import { usePlayer } from "./player";

type SocketStatus = "disconnected" | "connecting" | "connected" | "error";

type GameSocketContextValue = {
  status: SocketStatus;
  error: Error | null;
  send: (data: unknown) => void;
};

const GameSocketContext = createContext<GameSocketContextValue | undefined>(undefined);

type IncomingEvent = {
  type: string;
  data?: unknown;
};

export function GameSocketProvider({ children }: { children: React.ReactNode }) {
  const { gameId, addPlayer, removePlayerById, setPlayerCount, setPlayers, setStage, setChronometer, stage, setCode, setGameId } = useGame();
  const [status, setStatus] = useState<SocketStatus>("disconnected");
  const [lastError, setLastError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number>(0);
  const reconnectTimer = useRef<number | null>(null);
  const currentGameIdRef = useRef<string | null>(null);
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate();


  useEffect(() => {
    if (player) {
      navigate(`/${player.continent.toLowerCase()}/${stage}`);
    }
  }, [stage]);

  const connect = useCallback(() => {
    if (!gameId) return;
    const path = `/game/ws/${gameId}`;
    const url = resolveWebSocketUrl(path);

    try {
      setStatus("connecting");
      // Avoid duplicate connections for same gameId
      if (wsRef.current && currentGameIdRef.current === gameId) {
        const state = wsRef.current.readyState;
        if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
          return;
        }
        try { wsRef.current.close(); } catch {}
        wsRef.current = null;
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;
      currentGameIdRef.current = gameId;

      ws.onopen = () => {
        setStatus("connected");
        setLastError(null);
        retryRef.current = 0;
      };

      ws.onmessage = (evt) => {
        onMessage(evt.data);
      };

      ws.onerror = () => {
        setStatus("error");
      };

      ws.onclose = () => {
        setStatus("disconnected");
        // Only attempt reconnect if we still care about this gameId
        if (currentGameIdRef.current === gameId) {
          scheduleReconnect();
        }
      };
    } catch (e) {
      setStatus("error");
      setLastError(e instanceof Error ? e : new Error("WebSocket error"));
      scheduleReconnect();
    }
  }, [gameId]);

  const scheduleReconnect = useCallback(() => {
    if (!gameId) return;
    if (reconnectTimer.current) {
      window.clearTimeout(reconnectTimer.current);
    }
    const delay = Math.min(1000 * Math.pow(2, retryRef.current++), 10000);
    reconnectTimer.current = window.setTimeout(() => {
      connect();
    }, delay);
  }, [connect, gameId]);

  useEffect(() => {
    if (!gameId) {
      // Close if no game
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
        wsRef.current = null;
      }
      currentGameIdRef.current = null;
      setStatus("disconnected");
      return;
    }
    connect();
    return () => {
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
        wsRef.current = null;
      }
      currentGameIdRef.current = null;
      setStatus("disconnected");
    };
  }, [gameId, connect]);

  const onMessage = useCallback((raw: unknown) => {
    let event: IncomingEvent | null = null;
    try {
      if (typeof raw === "string") {
        event = JSON.parse(raw) as IncomingEvent;
      }
    } catch (e) {
      // ignore invalid JSON
      return;
    }
    if (!event || typeof event !== "object" || !("type" in event)) return;

    switch (event.type) {
      case "player_joined": {
        const p = toPartyPlayer(event.data);
        if (!p) break;
        addPlayer(p);
        break;
      }

      case "player_left": {
        const id = toId(event.data);
        console.log("player_left", id, stage);
        console.log("data:", event.data);
        if (id) removePlayerById(id);
        
        // If the game has started, force everyone to leave
        if (stage > 0) {
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem("workshop:game");
            window.sessionStorage.removeItem("workshop:player");
          }
          setCode(null);
          setGameId(null);
          setPlayers([]);
          setPlayerCount(0);
          setStage(0);
          setChronometer(null);
          clearPlayer();
          navigate("/");
        }
        break;
      }


      case "game_continued": {
        const obj = (event.data && typeof event.data === "object") ? (event.data as Record<string, unknown>) : {};
        const stageVal = obj.stage;
        if (typeof stageVal === "number") {
          setStage(stageVal);
        }
        const list = Array.isArray(obj.players) ? obj.players : [];
        const mapped: PartyPlayer[] = list
          .map(toPartyPlayer)
          .filter((v): v is PartyPlayer => v != null);
        if (mapped.length) {
          setPlayers(mapped);
          setPlayerCount(mapped.length);
        }
        break;
      }

      case "chronometer": {
        // Supports both { type, remaining } and { type, data: { remaining } }
        const remFromRoot = (event as unknown as Record<string, unknown>).remaining;
        const remFromData = (event.data && typeof event.data === "object") ? (event.data as Record<string, unknown>).remaining : undefined;
        const value = normalizeNumber(remFromData ?? remFromRoot);
        if (typeof value === "number") {
          setChronometer(value);
        }
        break;
      }
      
      case "chat_message": {
        const chatData = event.data as Record<string, unknown>;
        if (chatData && typeof chatData === "object") {
          const message = {
            id: `${Date.now()}-${Math.random()}`,
            playerId: String(chatData.playerId || ""),
            playerName: String(chatData.playerName || "Unknown"),
            message: String(chatData.message || ""),
            timestamp: new Date(String(chatData.timestamp || new Date().toISOString()))
          };
        
          // Dispatch custom event for chat context to listen to
          window.dispatchEvent(new CustomEvent('chat_message', { detail: message }));
        }
        break;
      }

      default:
        break;
    }
  }, [addPlayer, removePlayerById, setPlayerCount, setPlayers, setStage, setChronometer, stage, setCode, setGameId, clearPlayer, navigate]);

  const send = useCallback((data: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(typeof data === "string" ? data : JSON.stringify(data));
    } catch {}
  }, []);

  const value = useMemo(() => ({ status, error: lastError, send }), [status, lastError, send]);

  return <GameSocketContext.Provider value={value}>{children}</GameSocketContext.Provider>;
}

export function useGameSocket() {
  const ctx = useContext(GameSocketContext);
  if (!ctx) throw new Error("useGameSocket must be used within a GameSocketProvider");
  return ctx;
}

function toPartyPlayer(raw: unknown): PartyPlayer | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const idVal = r.id;
  const id = typeof idVal === "string" ? idVal : typeof idVal === "number" ? String(idVal) : null;
  const name = typeof r.name === "string" ? r.name : null;
  const continent = typeof r.continent === "string" ? r.continent.trim() : "Unknown";
  if (!id || !name) return null;
  return { id, name, continent, is_host: Boolean(r.is_host) };
}

function normalizeNumber(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
}

function toId(raw: unknown): string | null {
  if (typeof raw === "string") return raw;
  if (typeof raw === "number") return String(raw);
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    const v = r.id;
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

function toNumber(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
