import React, { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa1.css";
import Info from "../../Info";


export default function AfriqueRound1({ round }: { round: string | undefined }) {
    const [showInfo, setShowInfo] = useState(true);
    const roundNumber = round ? parseInt(round, 10) : 0;

    return (
        <>
        <Header title="- Continent Afrique" secondTitle="Réparation de l'unité Asie (pollution de l'air)"/>
        {showInfo && (
            <Info
                continent="Asia"
                onContinue={() => setShowInfo(false)}
            />
        )}
        <main className={`africa-screen ${roundNumber == 1 ? "asia-clues" : ""}`}>
            <div className="container">
            <img className="asia-clues-image" src="/assets/asia_clues_3.svg" alt="Clues" />
            </div>
        </main>
        </>
    );
}