import {  useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { backendService } from "~/services/backend";
import type { ApiSuccess, GameRead } from "~/types/backend";
import { useGame } from "~/context/game";

const EXPECTED_PHRASE = "PRIORISER LA FAUNE, REDUIRE LA SECHERESSE.";

const MORSE_CLUE = "·−−· ·−· ·· −−− ·−· ·· ··· · ·−·  ·−·· ·−  ··−· ·− ··− −· · −−··−−  ·−· ··−·· −·· ··− ·· ·−· ·  ·−·· ·−  ··· ··−·· −·−· ···· · ·−· · ··· ··· · ·−·−·− ";

export default function AfriqueRound2() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const { gameId, setStage, setPlayers } = useGame();
  const continuedRef = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);

  async function continueGameOnce() {
    if (continuedRef.current) return;
    continuedRef.current = true;
    try {
      if (!gameId) return;
      const res = await backendService.post<ApiSuccess<GameRead>>(`/game/continue/${gameId}`);
      if (res?.status === "success" && res.data) {
        setStage(res.data.stage);
        const mapped = (res.data.players ?? []).map((p) => ({
          id: String(p.id),
          name: p.name,
          continent: (p.continent ?? "").toString().trim(),
          is_host: p.is_host === true,
        }));
        if (mapped.length) setPlayers(mapped);
      }
    } catch (e) {
      console.error("continue game failed", e);
    }
  }

  // No auto-continue; proceed only on explicit click

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = value.trim() === EXPECTED_PHRASE;
    setAccepted(ok);
    setSubmitted(true);
    if (ok) {
      setShowOverlay(true);
    }
  };

  const statusLine = useMemo(() => {
    if (accepted === true) return "PRIORISE FAUNE: ON; REDUIRE SECHERESSE: ON";
    if (accepted === false) return "ERREUR: configuration invalide (mauvaise phrase)";
    return null;
  }, [accepted]);

  return (
    <>
      <Header title="- Continent Afrique" secondTitle="Réparation de l'unité Afrique (biodiveristé et sécheresse)"/>
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Le noeud de Gaia en charge du maintient de l’écosystème en Afrique a été corrompu et la config est désormais en morse</p>
          <p className="console-text">&gt; Décrypte la configuration et donne-la à Gaia</p>
        </div>

        <div className="morse-box">
          <p className="morse-clue console-text">{MORSE_CLUE}</p>
        </div>

        <form className="config-form" onSubmit={handleSubmit}>
          <input
            className="config-input"
            type="text"
            placeholder="Entrez la configuration déchiffrée"
            value={value}
            onChange={(e) => {
              const noAccents = e.target.value
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
              setValue(noAccents);
            }}
          />
          <button className="send-btn" aria-label="Envoyer" type="submit"></button>
        </form>

        {submitted && (
          <div className="terminal-wrapper">
            <div className="terminal-title">Terminal</div>
            <div className="terminal-box">
              <p className="terminal-line">&gt; Initialisation de la configuration</p>
              <p className="terminal-line">&gt; Réglage des priorités</p>
              {statusLine ? (
                <p className="terminal-line">&gt; {statusLine}</p>
              ) : (
                <p className="terminal-line error">&gt; …</p>
              )}
              <p className="terminal-line">&gt; Fin de la configuration</p>
            </div>
          </div>
        )}

        {showOverlay && accepted && (
          <div className="success-overlay" role="dialog" aria-modal="true">
            <div className="console-overlay">
              <p className="console-line delay-1">&gt; Déchiffrement terminé...</p>
              <p className="console-line delay-2">&gt; Configuration transmise au noeud Afrique.</p>
              <p className="console-line delay-3 green">&gt; Biodiversité priorisée, sécheresse en baisse.</p>
              <button
                className="btn-console delay-4"
                onClick={() => void continueGameOnce()}
              >
                Continuer
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
