import React, { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import Info from "../../Info";

export default function AfriqueRound3() {
  const [showInfo, setShowInfo] = useState(true);
  
  return (
    <>
      <Header title="- Continent Afrique" secondTitle="Réparation de l'unité Europe (production d'énergie)"/>
      {showInfo && (
        <Info
            continent="Europe"
            onContinue={() => setShowInfo(false)}
        />
      )}
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Partage ces consignes avec l’Europe.</p>
        </div>

        <div className="morse-box" role="note" aria-label="Règles Afrique">
          <p className="morse-clue console-text">1) Les lampes sur le pourtour (bords) sont toutes éteintes. Aucune lampe d’angle n’est allumée.</p>
          <p className="morse-clue console-text">2) Les lampes à distance de Manhattan strictement supérieure à 3 du centre sont éteintes.</p>
        </div>
      </main>
    </>
  );
}
