import { createContext, useState, useEffect, useContext  } from "react";
import type { PartyPlayer } from "~/types/player";
import { useNavigate } from "react-router";

interface GameContextValue {
    code: string | null;
    setCode: (code: string | null) => void;
    gameId: string | null;
    setGameId: (gameId: string | null) => void;
    stage: number;
    setStage: (stage: number) => void;
    playerCount: number;
    setPlayerCount: (count: number) => void;
    players : PartyPlayer[];
    addPlayer: (player: PartyPlayer) => void;
    removePlayer: (player: PartyPlayer) => void;
    removePlayerById: (id: string) => void;
    setPlayers: (players: PartyPlayer[]) => void;
}
const GameContext = createContext<GameContextValue | undefined>(undefined);

const STORAGE_KEY = "workshop:game";

type SavedGame = {
    code: string | null;
    gameId: string | null;
    stage: number;
    players: PartyPlayer[];
};

function readGameFromStorage(): SavedGame | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as Partial<SavedGame>;
        const code = typeof data.code === "string" || data.code === null ? data.code ?? null : null;
        const gameId = typeof data.gameId === "string" || data.gameId === null ? data.gameId ?? null : null;
        const stage = typeof data.stage === "number" ? data.stage : 0;
        const players = Array.isArray(data.players) ? data.players.filter(isPartyPlayer) : [];
        return { code, gameId, stage, players };
    } catch {
        return null;
    }
}

function writeGameToStorage(value: SavedGame) {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
        // ignore persistence errors
    }
}

function isPartyPlayer(candidate: unknown): candidate is PartyPlayer {
    if (!candidate || typeof candidate !== "object") return false;
    const r = candidate as Record<string, unknown>;
    return (
        typeof r.id === "string" &&
        typeof r.name === "string" &&
        typeof r.continent === "string" &&
        typeof r.is_host === "boolean"
    );
}

export function GameProvider({ children }: { children: React.ReactNode }) {
    const saved = readGameFromStorage();
    const [code, setCode] = useState<string | null>(() => saved?.code ?? null);
    const [gameId, setGameId] = useState<string | null>(() => saved?.gameId ?? null);
    const [stage, setStage] = useState<number>(() => saved?.stage ?? 0);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [players, setPlayer] = useState<PartyPlayer[]>(() => saved?.players ?? []);
    const navigate = useNavigate();


    useEffect(() => {
        setPlayerCount(players.length);
    }, [players]);

    useEffect(() => {
        writeGameToStorage({ code, gameId, stage, players });
    }, [code, gameId, stage, players]);

    useEffect(() => {
        console.log("Stage changed:", stage);
    }, [stage]);

    const addPlayer = (player: PartyPlayer) => {
        setPlayer((prevPlayers) => {
            if (prevPlayers.some((p) => p.id === player.id)) return prevPlayers;
            return [...prevPlayers, player];
        });
    }
    const setPlayers = (players: PartyPlayer[]) => {
        setPlayer(players);
    };

    const removePlayer = (player: PartyPlayer) => {
        setPlayer((prevPlayers) => prevPlayers.filter(p => p.id !== player.id));
    }
    const removePlayerById = (id: string) => {
        setPlayer((prevPlayers) => prevPlayers.filter(p => p.id !== id));
    }
    return (
        <GameContext.Provider value={{ code, setCode, gameId, setGameId, stage, setStage, playerCount, setPlayerCount, players, addPlayer, removePlayer, removePlayerById, setPlayers }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
