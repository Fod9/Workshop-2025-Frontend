import { useParams } from "react-router-dom";
import "../styles/europe.css";
import Header from "../components/layout/Header";

export default function AsiaRound() {
  const { round } = useParams<{ round: string }>();
  const roundNumber = round ? parseInt(round, 10) : 0;

  return (
    <>
      <Header title="- Europe : Production d'énergie" />
      <main className={`europe-screen ${roundNumber == 1 ? "asia-clues" : ""}`}>
        <div className="container">
          <img className="asia-clues-image" src="/assets/asia_clues_1.svg" alt="Clues" />
        </div>
      </main>
    </>
  );
}
