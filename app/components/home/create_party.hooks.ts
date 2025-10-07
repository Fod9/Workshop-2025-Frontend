import { useCallback, useState } from "react";
import { backendService } from "~/services/backend";
import type { PartySummary } from "~/types/party";
import type { GameRead, PlayerRead, ApiSuccess } from "~/types/backend";

interface CreatePartyParams {
  name: string;
  hostName: string;
}

export function useCreateParty() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createParty = useCallback(async ({ name, hostName }: CreatePartyParams) => {
    setIsCreating(true);
    setError(null);

    try {
      const payload = await backendService.post<ApiSuccess<GameRead>>("/game/create", {
        name: name.trim(),
        host_name: hostName.trim(),
      });

      console.log(payload)

      // Defensive guard in case backend changes shape at runtime
      if (!payload || payload.status !== "success" || !payload.data) {
        throw new Error("Réponse API invalide pour la création de partie");
      }

      return toPartySummary(payload.data);
    } catch (e) {
      const err = e instanceof Error ? e : new Error("Échec de la création de la partie");
      setError(err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { createParty, isCreating, error };
}

function toPartySummary(game: GameRead): PartySummary {
  const id = String(game.id);
  const players = game.players.map((p) => ({
    id: p.id,
    name: p.name,
    is_host: p.is_host,
    continent: p.continent.trim(),
  }));

  return {
    code: game.join_code,
    name: game.name,
    host_name: game.host_name,
    players,
    id,
    stage: game.stage,
  };
}
