import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { PartyPlayer } from "~/types/player";

interface PlayerContextValue {
  player: PartyPlayer | null;
  setPlayer: (player: PartyPlayer | null) => void;
  updatePlayer: (changes: Partial<PartyPlayer>) => void;
  clearPlayer: () => void;
}

interface PlayerProviderProps {
  children: ReactNode;
  initialPlayer?: PartyPlayer | null;
}

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);
const STORAGE_KEY = "workshop:player";

function normaliseCandidate(candidate: unknown): PartyPlayer | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const record = candidate as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id : null;
  const name = typeof record.name === "string" ? record.name : null;
  if (!id || !name) {
    return null;
  }

  const continent = typeof record.continent === "string" ? record.continent : "Unknown";
  return { id, name, continent };
}

function readPlayerFromStorage(): PartyPlayer | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const rawValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }
    return normaliseCandidate(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

function writePlayerToStorage(player: PartyPlayer | null) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    if (player) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore persistence errors (private browsing, quota, etc.)
  }
}

export function PlayerProvider({ children, initialPlayer = null }: PlayerProviderProps) {
  const [player, setPlayerState] = useState<PartyPlayer | null>(() => initialPlayer ?? readPlayerFromStorage());

  useEffect(() => {
    writePlayerToStorage(player);
  }, [player]);

  useEffect(() => {
    if (initialPlayer) {
      setPlayerState(initialPlayer);
    }
  }, [initialPlayer]);

  const setPlayer = useCallback((next: PartyPlayer | null) => {
    setPlayerState(next ? { ...next } : null);
  }, []);

  const updatePlayer = useCallback((changes: Partial<PartyPlayer>) => {
    setPlayerState((current) => (current ? { ...current, ...changes } : current));
  }, []);

  const clearPlayer = useCallback(() => {
    setPlayerState(null);
  }, []);

  

  const value = useMemo(
    () => ({
      player,
      setPlayer,
      updatePlayer,
      clearPlayer,
    }),
    [player, setPlayer, updatePlayer, clearPlayer]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

export function useCurrentPlayer() {
  return usePlayer().player;
}
