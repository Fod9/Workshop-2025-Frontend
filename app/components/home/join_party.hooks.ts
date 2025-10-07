import { useCallback, useState } from "react";
import { backendService } from "~/services/backend";
import type { ApiSuccess, GameRead, PlayerRead } from "~/types/backend";
import type { PartySummary } from "~/types/party";
import type { PartyPlayer } from "~/types/player";

interface JoinPartyParams {
  name: string; // player name
  joinCode: string; // game join code
}

export function useJoinParty() {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const joinParty = useCallback(async ({ name, joinCode }: JoinPartyParams) => {
    setIsJoining(true);
    setError(null);

    try {
      const payload = await backendService.post<ApiSuccess<GameRead>>("/game/join", {
        name: name.trim(),
        join_code: joinCode.trim(),
      });

      if (!payload || payload.status !== "success" || !payload.data) {
        throw new Error("Réponse API invalide pour rejoindre la partie");
      }

      return toPartySummary(payload.data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Échec pour rejoindre la partie");
      setError(err);
      throw err;
    } finally {
      setIsJoining(false);
    }
  }, []);

  return { joinParty, isJoining, error };
}

function toPartySummary(game: GameRead): PartySummary {
  const id = String(game.id);
  const players = mapPlayers(game.players ?? [], game.host_name);

  return {
    code: game.join_code,
    name: game.name,
    host_name: game.host_name,
    players,
    id,
    stage: game.stage,
  };
}

function mapPlayers(players: PlayerRead[], hostName: string): PartyPlayer[] {
  const mapped: Array<{ player: PartyPlayer; isHost: boolean }> = players.map((p) => ({
    player: { id: String(p.id), name: p.name, continent: p.continent.trim() },
    isHost: p.is_host === true,
  }));

  const hostIndex = mapped.findIndex((m) => m.isHost || m.player.name === hostName);
  if (hostIndex > -1) {
    const [host] = mapped.splice(hostIndex, 1);
    return [host.player, ...mapped.map((m) => m.player)];
  }

  return mapped.map((m) => m.player);
}
