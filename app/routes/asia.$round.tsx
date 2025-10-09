import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AsiaRound1 from "../components/continents/asie/asia.1";
import AsiaRound2 from "../components/continents/asie/asia.2";
import AsiaRound3 from "../components/continents/asie/asia.3";

export default function AsiaRound() {
  const { round } = useParams<{ round: string }>();

  switch (round) {
    case "1":
      return <AsiaRound1 round={round} />;
    case "2":
      return <AsiaRound2 />;
    case "3":
      return <AsiaRound3 />;
    default:
      return (
        <>
          <Header title="- Asie : Pollution de l'air" />
          <main className="asia-screen">
            <div className="container">
              <p>Round inconnu</p>
            </div>
          </main>
        </>
      );
  }
}
