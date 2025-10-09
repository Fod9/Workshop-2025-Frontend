import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AsiaRound1 from "../components/continents/asie/asia.1";
import AsiaRound2 from "../components/continents/asie/asia.2";
import AsiaRound3 from "../components/continents/asie/asia.3";
import AsiaRound4 from "../components/continents/asie/asia.4";
import AsiaRound5 from "../components/continents/asie/asia.5";
import ContinentsFooter from "../components/layout/ContinentsFooter";

export default function AsiaRound() {
  const { round } = useParams<{ round: string }>();
  let View: JSX.Element;
  switch (round) {
    case "1": View = <AsiaRound1 round={round} />; break;
    case "2": View = <AsiaRound2 />; break;
    case "3": View = <AsiaRound3 />; break;
    case "4": View = <AsiaRound4 />; break;
    case "5": View = <AsiaRound5 />; break;
    default:
      View = (
        <>
          <Header title="- Asie : Pollution de l'air" />
          <main className="asia-screen"><div className="container"><p>Round inconnu</p></div></main>
        </>
      );
  }
  return <>{View}<ContinentsFooter active="Asie" /></>;
}
