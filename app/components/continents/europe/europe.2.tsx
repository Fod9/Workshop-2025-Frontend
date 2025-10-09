import React, { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import Info from "../../Info";

const MORSE_TABLE_PART = `J: ·−−−\nK: −·−\nL: ·−··\nM: −−\nN: −·\nO: −−−\nP: ·−−·\nQ: −−·−\nR: ·−·`;

export default function EuropeRound2() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <>
      <Header title="- Continent Europe" secondTitle="Réparation de l'unité Afrique (biodiveristé et sécheresse)"/>
      {showInfo && (
        <Info
            continent="Africa"
            onContinue={() => setShowInfo(false)}
        />
      )}
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Indice: Table de conversion Morse (lettres uniquement)</p>
          <p className="console-text">&gt; Voici une partie utile à la décryption.</p>
        </div>

        <div className="morse-box">
          <p className="morse-clue console-text" aria-label="Table Morse partielle">
            {MORSE_TABLE_PART}
          </p>
        </div>
      </main>
    </>
  );
}

