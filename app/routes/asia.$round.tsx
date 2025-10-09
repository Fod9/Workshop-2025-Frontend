import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AsiaRound1 from "../components/continents/asie/asia.1";
import AsiaRound2 from "../components/continents/asie/asia.2";
import AsiaRound3 from "../components/continents/asie/asia.3";
import AsiaRound4 from "../components/continents/asie/asia.4";
import AsiaRound5 from "../components/continents/asie/asia.5";

export default function AsiaRound() {
  const { round } = useParams<{ round: string }>();

  switch (round) {
    case "1":
      return <AsiaRound1 round={round} />;
    case "2":
      return <AsiaRound2 />;
    case "3":
      return <AsiaRound3 />;
    case "4":
      return <AsiaRound4 />;
    case "5":
      return <AsiaRound5 />;
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
