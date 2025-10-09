import React, { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/america.css";
import Info from "../../Info";

export default function AmericaRound1() {
  const [showInfo, setShowInfo] = useState(true);
  
  return (
    <>
      <Header title="- Amérique : Surproduction et déchets" />
      {showInfo && (
          <Info
              continent="Asia"
              onContinue={() => setShowInfo(false)}
          />
      )}
      <main className="america-screen asia-clues">
        <div className="container">
          <img className="asia-clues-image" src="/assets/asia_clues_2.svg" alt="Clues" />
        </div>
      </main>
    </>
  );
}

