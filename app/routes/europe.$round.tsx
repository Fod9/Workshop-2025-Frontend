import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import EuropeRound1 from "../components/continents/europe/europe.1";
import EuropeRound3 from "../components/continents/europe/europe.3";
import EuropeRound2 from "../components/continents/europe/europe.2";
import EuropeRound4 from "../components/continents/europe/europe.4";
import EuropeRound5 from "../components/continents/europe/europe.5";

export default function EuropeRound() {
  const { round } = useParams<{ round: string }>();

  switch (round) {
    case "1":
      return <EuropeRound1 />;
    case "2":
      return <EuropeRound2 />;
    case "3":
      return <EuropeRound3 />;
    case "4":
      return <EuropeRound4 />;
    case "5":
      return <EuropeRound5 />;
    default:
      return (
        <>
          <Header title="- Europe : Production d'énergie" />
          <main className="europe-screen">
            <div className="container">
              <p>Round inconnu</p>
            </div>
          </main>
        </>
      );
  }
}
