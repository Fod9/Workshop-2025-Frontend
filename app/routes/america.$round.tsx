import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AmericaRound1 from "../components/continents/amerique/america.1";
import AmericaRound2 from "../components/continents/amerique/america.2";
import AmericaRound3 from "../components/continents/amerique/america.3";
import AmericaRound4 from "../components/continents/amerique/america.4";
import AmericaRound5 from "../components/continents/amerique/america.5";
import ContinentsFooter from "../components/layout/ContinentsFooter";

export default function AmericaRound() {
  const { round } = useParams<{ round: string }>();
  let View: JSX.Element;
  switch (round) {
    case "1": View = <AmericaRound1 />; break;
    case "2": View = <AmericaRound2 />; break;
    case "3": View = <AmericaRound3 />; break;
    case "4": View = <AmericaRound4 />; break;
    case "5": View = <AmericaRound5 />; break;
    default:
      View = (
        <>
          <Header title="- Amérique : Surproduction et déchets" />
          <main className="america-screen"><div className="container"><p>Round inconnu</p></div></main>
        </>
      );
  }
  return <>{View}<ContinentsFooter active="Amerique" /></>;
}
