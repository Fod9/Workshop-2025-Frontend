import { useEffect, useRef, useState } from "react";
import { useGame } from "~/context/game";
import "../../styles/components/chronometer.css";

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
  const { chronometer, stage, gameId } = useGame();
  const [display, setDisplay] = useState<number>(chronometer ?? 0);
  const base = useRef<{ t0: number; s0: number } | null>(null);

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

  // Only show during an active game route when we have a gameId
  if (!gameId || stage <= 0) return null;

  const isDanger = display <= 10;
  const isWarning = !isDanger && display <= 30;

  return (
    <div className="chronometer">
      <div className={`chronometer-badge ${isDanger ? 'danger' : isWarning ? 'warning' : ''}`}>
        {formatHMS(display)}
      </div>
    </div>
  );
}
