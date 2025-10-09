import { useEffect, useRef, useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useConsoleTypingSound } from "~/hooks/useConsoleTypingSound";
import { useNavigate } from "react-router";

export default function AfriqueRound5() {
  const ref = useRef<HTMLDivElement | null>(null);
  useConsoleTypingSound(ref);
  const navigate = useNavigate();
  const lastLineRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = lastLineRef.current;
    if (!el) return;
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === 'typing') {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => navigate('/'), 2000);
      }
    };
    el.addEventListener('animationend', onEnd as unknown as EventListener);
    return () => {
      el.removeEventListener('animationend', onEnd as unknown as EventListener);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [navigate]);
  return (
    <>
      <Header title="- Continent Afrique" secondTitle="Fin de partie"/>
      <main className="afrique-screen">
        <div className="success-overlay">
          <div className="console-overlay" ref={ref}>
            <div className="console-line delay-1">&gt; Félicitations !</div>
            <div className="console-line delay-2">&gt; L'Afrique a complété l'aventure.</div>
            <div className="console-line delay-3" ref={lastLineRef}>&gt; À bientôt.</div>
          </div>
        </div>
      </main>
    </>
  );
}
