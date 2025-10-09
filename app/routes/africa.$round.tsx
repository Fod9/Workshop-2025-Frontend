import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AfriqueRound1 from "../components/continents/afrique/africa.1";
import AfriqueRound2 from "../components/continents/afrique/africa.2";
import AfriqueRound3 from "../components/continents/afrique/africa.3";
import AfriqueRound4 from "../components/continents/afrique/africa.4";
import AfriqueRound5 from "../components/continents/afrique/africa.5";
import ContinentsFooter from "../components/layout/ContinentsFooter";

export default function AfricaRound() {
  const { round } = useParams<{ round: string }>();
  let View: JSX.Element;
  switch (round) {
    case "1": View = <AfriqueRound1 round={round} />; break;
    case "2": View = <AfriqueRound2 />; break;
    case "3": View = <AfriqueRound3 />; break;
    case "4": View = <AfriqueRound4 />; break;
    case "5": View = <AfriqueRound5 />; break;
    default:
      View = (
        <>
          <Header title="- Afrique" />
          <main className="africa-screen"><div className="container"><p>Round inconnu</p></div></main>
        </>
      );
  }
  return <>{View}<ContinentsFooter active="Afrique" /></>;
}
