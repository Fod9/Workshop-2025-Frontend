import { useParams } from "react-router-dom";
import "../styles/america.css";
import Header from "../components/layout/Header";

export default function AmericaRound() {
  const { round } = useParams<{ round: string }>();
  const roundNumber = round ? parseInt(round, 10) : 0;

  return (
    <>
      <Header title="- Amérique : Surproduction et déchets" />
      <main className={`america-screen ${roundNumber == 1 ? "asia-clues" : ""}`}>
        <div className="container">
          <img className="asia-clues-image" src="/assets/asia_clues_2.svg" alt="Clues" />
        </div>
      </main>
    </>
  );
}
