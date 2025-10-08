import { useCallback, useMemo, useState } from "react";
import { useGame } from "~/context/game";
import { usePlayer } from "~/context/player";
import { backendService } from "~/services/backend";
import { useNavigate } from "react-router";
import "~/styles/components/leave_button.css";

export default function LeaveGameButton() {
  const { gameId, setGameId, setCode, setStage, setPlayers, setChronometer } = useGame();
  const { player, clearPlayer } = usePlayer();
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  const visible = useMemo(() => Boolean(gameId), [gameId]);

  const cleanup = useCallback(() => {
    setCode(null);
    setGameId(null);
    setStage(0);
    setPlayers([]);
    setChronometer(null);
    clearPlayer();
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("workshop:game");
        window.sessionStorage.removeItem("workshop:player");
      }
    } catch {}
  }, [setCode, setGameId, setStage, setPlayers, setChronometer, clearPlayer]);

  const handleLeave = useCallback(async () => {
    if (!gameId || leaving) {
      navigate("/");
      return;
    }
    setLeaving(true);
    try {
      await backendService.post("/game/leave", {
        game_id: gameId,
        ...(player?.id ? { player_id: player.id } : {}),
      });
    } catch (e) {
    } finally {
      cleanup();
      navigate("/");
    }
  }, [gameId, player?.id, leaving, cleanup, navigate]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="leave-game-button"
      onClick={handleLeave}
      aria-label="Quitter la partie"
      disabled={leaving}
      title="Quitter la partie"
    >
      Quitter
    </button>
  );
}

