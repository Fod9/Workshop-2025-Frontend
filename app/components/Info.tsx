import { useState, useEffect, useRef } from "react";
import "../styles/asia.css";
import { useTypingSound } from "../hooks/useTypingSound";

type Continent = "Asia" | "Europe" | "Africa" | "America";

const LINES: Record<Continent, string[]> = {
  Asia: [
    "Gaia > Alerte. Je constate un taux de CO₂ critique en Asie.",
    "Gaia > Les populations risquent de développer des problèmes de santé importants.",
    "Gaia > L'atmosphère se dégrade et l'effet de serre s'accélère.",
    "Gaia > Mon système a été corrompu. J'ai besoin de ton aide pour rétablir un taux de CO₂ stable.",
  ],
  Europe: [
    "Gaia > Alerte. Je constate une surutilisation des énergies fossiles.",
    "Gaia > La production d'énergie est trop consommatrice.",
    "Gaia > Nous risquons d'épuiser les ressources.",
    "Gaia > Mon système a été corrompu. J'ai besoin de ton aide pour rééquilibrer les sources d'énergie.",
  ],
  Africa: [
    "Gaia > Alerte. Impossible de récupérer les instructions du module climatique.",
    "Gaia > Je détecte une forte sécheresse et des espèces animales en péril.",
    "Gaia > Je n'arrive plus à stabiliser le cycle de l'eau ni à contrôler l'évaporation.",
    "Gaia > Mon système a été corrompu. J'ai besoin de ton aide pour rétablir un équilibre hydrique viable.",
  ],
  America: [
    "Gaia > Alerte. L'équilibre de la production a été corrompu.",
    "Gaia > Nous générons beaucoup trop de déchets et les ressources s'épuisent.",
    "Gaia > Je n'ai plus accès aux valeurs seuils qui régulaient la production et la consommation.",
    "Gaia > J'ai besoin de ton aide pour retrouver les paramètres permettant de limiter la surproduction.",
  ],
};

export default function Info({
  continent,
  onContinue,
}: {
  continent: Continent;
  onContinue: () => void;
}) {
  const called = useRef(false);
  // play typing sound while lines are being typed

  const lines = LINES[continent];

  const typingDelay = 25;
  const linePause = 500;

  const [typed, setTyped] = useState<string[]>(() =>
    Array(lines.length).fill("")
  );
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // play typing sound strictly while characters are appearing (pauses during line gaps)
  const isTyping = lineIndex < lines.length && charIndex < (lines[lineIndex]?.length ?? 0);
  useTypingSound(isTyping, { src: "/assets/typing_morse.mp3" });

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
  }, [continent]);


  useEffect(() => {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];

    if (charIndex < line.length) {
      const t = setTimeout(() => {
        setTyped((prev) => {
          const next = [...prev];
          next[lineIndex] = line.slice(0, charIndex + 1);
          return next;
        });
        setCharIndex((ci) => ci + 1);
      }, typingDelay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIndex((li) => li + 1);
        setCharIndex(0);
      }, linePause);
      return () => clearTimeout(t);
    }
  }, [lineIndex, charIndex, lines, typingDelay, linePause]);

  // (sound is handled by useTypingSound)

  const allDone = lineIndex >= lines.length;

  return (
    <div className="info-overlay" role="dialog" aria-modal="true">
      <div className="info-console-overlay">
        {lines.map((_, i) => (
          <p key={i} className="info-line red">
            {typed[i]}
            {i === lineIndex && !allDone && <span className="cursor">▋</span>}
          </p>
        ))}

        {allDone && (
          <button
            className="red-btn-console"
            onClick={() => {
              if (!called.current) {
                called.current = true;
                onContinue();
              }
            }}
          >
            Démarrer
          </button>
        )}
      </div>
    </div>
  );
}
