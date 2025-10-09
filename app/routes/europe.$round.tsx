import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import EuropeRound1 from "../components/continents/europe/europe.1";
import EuropeRound3 from "../components/continents/europe/europe.3";
import EuropeRound2 from "../components/continents/europe/europe.2";
import EuropeRound4 from "../components/continents/europe/europe.4";
import EuropeRound5 from "../components/continents/europe/europe.5";
import ContinentsFooter from "../components/layout/ContinentsFooter";

export default function EuropeRound() {
  const { round } = useParams<{ round: string }>();
  let View: JSX.Element;
  switch (round) {
    case "1": View = <EuropeRound1 />; break;
    case "2": View = <EuropeRound2 />; break;
    case "3": View = <EuropeRound3 />; break;
    case "4": View = <EuropeRound4 />; break;
    case "5": View = <EuropeRound5 />; break;
    default:
      View = (
        <>
          <Header title="- Europe : Production d'énergie" />
          <main className="europe-screen"><div className="container"><p>Round inconnu</p></div></main>
        </>
      );
  }
  return <>{View}<ContinentsFooter active="Europe" /></>;
}
