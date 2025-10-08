import {  useMemo, useState } from "react";
import type { FormEvent } from "react";
import Header from "../components/layout/Header";
import "../styles/afrique.css";

// Remplace cette constante par la vraie phrase attendue si besoin
const EXPECTED_PHRASE = "PRIORISER LA FAUNE, REDUIRE LA SECHERESSE.";

// Emplacement pour la phrase en morse (affichage piste)
const MORSE_CLUE = "·−−· ·−· ·· −−− ·−· ·· ··· · ·−·  ·−·· ·−  ··−· ·− ··− −· · −−··−−  ·−· ··−·· −·· ··− ·· ·−· ·  ·−·· ·−  ··· ··−·· −·−· ···· · ·−· · ··· ··· · ·−·−·− ";

export default function AfriqueRound2() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ok = value.trim() === EXPECTED_PHRASE;
    setAccepted(ok);
    setSubmitted(true);
  };

  const statusLine = useMemo(() => {
    if (accepted === true) return "PRIORISE FAUNE: ON; REDUIRE SECHERESSE: ON";
    if (accepted === false) return "ERREUR: configuration invalide (mauvaise phrase)";
    return null;
  }, [accepted]);

  return (
    <>
      <Header title="- Afrique : La faune" />
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
      </main>
    </>
  );
}

