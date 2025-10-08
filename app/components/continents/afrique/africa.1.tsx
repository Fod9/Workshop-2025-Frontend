import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa1.css";


export default function AfriqueRound1({ round }: { round: string | undefined }) {
    const roundNumber = round ? parseInt(round, 10) : 0;

    return (
        <>
        <Header title="- Afrique : Biodiversité et sécheresse" />
        <main className={`africa-screen ${roundNumber == 1 ? "asia-clues" : ""}`}>
            <div className="container">
            <img className="asia-clues-image" src="/assets/asia_clues_3.svg" alt="Clues" />
            </div>
        </main>
        </>
    );
}