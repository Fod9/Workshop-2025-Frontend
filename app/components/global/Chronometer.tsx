import { useEffect, useRef, useState } from "react";
import { useGame } from "~/context/game";
import { usePlayer } from "~/context/player";
import { backendService } from "~/services/backend";
import { useNavigate } from "react-router";
import "../../styles/components/chronometer.css";
import { useConsoleTypingSound } from "~/hooks/useConsoleTypingSound";

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function formatHMS(totalSeconds: number) {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

export default function Chronometer() {
  const { chronometer, stage, gameId, setCode, setGameId, setStage, setPlayers, setChronometer } = useGame();
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate();
  const [display, setDisplay] = useState<number>(chronometer ?? 0);
  const base = useRef<{ t0: number; s0: number } | null>(null);
  const endedRef = useRef(false);
  const zeroTimerRef = useRef<number | null>(null);
  const [showFail, setShowFail] = useState(false);
  const failRef = useRef<HTMLDivElement | null>(null);
  useConsoleTypingSound(failRef, undefined, showFail);

  // Reset baseline whenever server sends a new remaining value
  useEffect(() => {
    if (chronometer == null) {
      base.current = null;
      setDisplay(0);
      return;
    }
    base.current = { t0: Date.now(), s0: chronometer };
    setDisplay(chronometer);
  }, [chronometer]);

  // Local ticking based on last baseline; restart when stage/gameId changes
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!base.current) return;
      const dt = Math.floor((Date.now() - base.current.t0) / 1000);
      setDisplay(Math.max(0, base.current.s0 - dt));
    }, 500);
    return () => window.clearInterval(id);
  }, [stage, gameId]);

  // When timer hits zero, show fail overlay after a short confirmation window
  useEffect(() => {
    // Guard: only in active game with a running timer
    if (!gameId || stage <= 0 || chronometer == null) return;

    if (display <= 0 && !endedRef.current) {
      if (zeroTimerRef.current) window.clearTimeout(zeroTimerRef.current);
      zeroTimerRef.current = window.setTimeout(() => {
        // Double-check still zero
        if (display <= 0 && !endedRef.current) {
          endedRef.current = true;
          setShowFail(true);
        }
      }, 900);
    } else if (display > 0) {
      if (zeroTimerRef.current) {
        window.clearTimeout(zeroTimerRef.current);
        zeroTimerRef.current = null;
      }
      // reset state if timer resumed
      if (endedRef.current) {
        endedRef.current = false;
        setShowFail(false);
      }
    }

    return () => {
      if (zeroTimerRef.current) {
        window.clearTimeout(zeroTimerRef.current);
        zeroTimerRef.current = null;
      }
    };
  }, [display, gameId, stage, chronometer]);

  const handleReturnHome = async () => {
    try {
      if (gameId) {
        await backendService.post("/game/leave", {
          game_id: gameId,
          ...(player?.id ? { player_id: player.id } : {}),
        });
      }
    } catch {}
    // local cleanup
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
    navigate("/");
  };

  // Only show during an active game route when we have a gameId
  if (!gameId || stage <= 0) return null;

  const isDanger = display <= 10;
  const isWarning = !isDanger && display <= 30;

  return (
    <>
      <div className="chronometer">
        <div className={`chronometer-badge ${isDanger ? 'danger' : isWarning ? 'warning' : ''}`}>
          {formatHMS(display)}
        </div>
      </div>

      {showFail && (
        <div className="success-overlay" role="dialog" aria-modal="true" style={{ zIndex: 10000 }}>
          <div className="console-overlay" ref={failRef}>
            <p className="console-line delay-1">&gt; Mission échouée.</p>
            <p className="console-line delay-2">&gt; Temps écoulé.</p>
            <button className="btn-console delay-4" onClick={handleReturnHome}>
              Retourner à l'accueil
            </button>
          </div>
        </div>
      )}
    </>
  );
}
