import React, { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/europe.css";
import Info from "../../Info";

export default function EuropeRound1() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <>
      <Header title="- Continent Europe" secondTitle="Réparation de l'unité Asie (pollution de l'air)"/>
      {showInfo && (
          <Info
              continent="Asia"
              onContinue={() => setShowInfo(false)}
          />
      )}
      <main className="europe-screen asia-clues">
        <div className="container">
          <img className="asia-clues-image" src="/assets/asia_clues_1.svg" alt="Clues" />
        </div>
      </main>
    </>
  );
}

