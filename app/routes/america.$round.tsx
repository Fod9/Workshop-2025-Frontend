import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AmericaRound1 from "../components/continents/amerique/america.1";
import AmericaRound2 from "../components/continents/amerique/america.2";
import AmericaRound3 from "../components/continents/amerique/america.3";
import AmericaRound4 from "../components/continents/amerique/america.4";
import AmericaRound5 from "../components/continents/amerique/america.5";

export default function AmericaRound() {
  const { round } = useParams<{ round: string }>();

  switch (round) {
    case "1":
      return <AmericaRound1 />;
    case "2":
      return <AmericaRound2 />;
    case "3":
      return <AmericaRound3 />;
    case "4":
      return <AmericaRound4 />;
    case "5":
      return <AmericaRound5 />;
    default:
      return (
        <>
          <Header title="- Amérique : Surproduction et déchets" />
          <main className="america-screen">
            <div className="container">
              <p>Round inconnu</p>
            </div>
          </main>
        </>
      );
  }
}
