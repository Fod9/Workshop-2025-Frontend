import { createContext, useState, useEffect, useContext } from "react";
import type { PartyPlayer } from "~/types/player";

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
    setPlayers: (players: PartyPlayer[]) => void;
}
const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [code, setCode] = useState<string | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const [stage, setStage] = useState<number>(0);
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [players, setPlayer] = useState<PartyPlayer[]>([]);

    useEffect(() => {
    }, [code, gameId, stage, playerCount, players]);

    useEffect(() => {
        setPlayerCount(players.length);
    }, [players]);

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
    return (
        <GameContext.Provider value={{ code, setCode, gameId, setGameId, stage, setStage, playerCount, setPlayerCount, players, addPlayer, removePlayer, setPlayers }}>
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
