import { useParams } from "react-router-dom";
import "../styles/africa.css";
import Header from "../components/layout/Header";

export default function AfricaRound() {
  const { round } = useParams<{ round: string }>();
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
