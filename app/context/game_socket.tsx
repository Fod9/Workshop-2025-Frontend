import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { resolveWebSocketUrl } from "~/services/websocket";
import { useGame } from "~/context/game";
import type { PartyPlayer } from "~/types/player";

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
  const { gameId, players, addPlayer, removePlayer, setPlayerCount, setPlayers, setStage } = useGame();
  const [status, setStatus] = useState<SocketStatus>("disconnected");
  const [lastError, setLastError] = useState<Error | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number>(0);
  const reconnectTimer = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (!gameId) return;
    const path = `/game/ws/${gameId}`;
    const url = resolveWebSocketUrl(path);

    try {
      setStatus("connecting");
      const ws = new WebSocket(url);
      wsRef.current = ws;

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
        scheduleReconnect();
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
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
        wsRef.current = null;
      }
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
        console.log("Player joined", event.data);
        const p = toPartyPlayer(event.data);
        if (!p) break;
        if (!players.some((pp) => pp.id === p.id)) {
          addPlayer(p);
        }
        break;
      }

      case "player_left": {
        const p = toPartyPlayer(event.data);
        if (!p) break;
        const existing = players.find((pp) => pp.id === p.id);
        if (existing) removePlayer(existing);
        break;
      }

      case "player_count": {
        const n = toNumber(event.data);
        if (typeof n === "number") setPlayerCount(n);
        break;
      }

      case "players_sync": {
        const list = Array.isArray(event.data) ? event.data : [];
        const mapped: PartyPlayer[] = list
          .map(toPartyPlayer)
          .filter((v): v is PartyPlayer => v != null);
        setPlayers(mapped);
        setPlayerCount(mapped.length);
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

      default:
        break;
    }
  }, [addPlayer, players, removePlayer, setPlayerCount, setPlayers, setStage]);

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

function toNumber(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
