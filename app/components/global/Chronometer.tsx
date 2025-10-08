import { useEffect, useRef, useState } from "react";
import { useGame } from "~/context/game";

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

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(0,0,0,0.75)",
      color: "#fff",
      fontWeight: 600,
      zIndex: 1000,
      letterSpacing: "0.5px",
    }}>
      {formatHMS(display)}
    </div>
  );
}
