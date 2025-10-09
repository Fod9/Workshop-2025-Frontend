import { useEffect, useRef, useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useConsoleTypingSound } from "~/hooks/useConsoleTypingSound";
import { useNavigate } from "react-router";

export default function AmericaRound5() {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  useConsoleTypingSound(overlayRef);
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
      <Header title="- Continent Amérique" secondTitle="Fin de partie"/>
      <main className="afrique-screen">
        <div className="success-overlay">
          <div className="console-overlay" ref={overlayRef}>
            <div className="console-line delay-1">&gt; Bravo !</div>
            <div className="console-line delay-2">&gt; L'Amérique a résolu ses énigmes.</div>
            <div className="console-line delay-3" ref={lastLineRef}>&gt; Merci d'avoir joué.</div>
          </div>
        </div>
      </main>
    </>
  );
}
