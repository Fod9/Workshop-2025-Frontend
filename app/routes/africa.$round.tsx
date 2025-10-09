import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AfriqueRound1 from "../components/continents/afrique/africa.1";
import AfriqueRound2 from "../components/continents/afrique/africa.2";
import AfriqueRound3 from "../components/continents/afrique/africa.3";
import AfriqueRound4 from "../components/continents/afrique/africa.4";

export default function AfricaRound() {
  const { round } = useParams<{ round: string }>();
  
  switch (round) {
    case "1":
      return <AfriqueRound1 round={round} />;
    case "2":
      return <AfriqueRound2 />;
    case "3":
      return <AfriqueRound3 />;
    case "4":
      return <AfriqueRound4 />;
    default:
      return (
        <>
          <Header title="- Afrique" />
          <main className="africa-screen">
            <div className="container">
              <p>Round inconnu</p>
            </div>
          </main>
        </>
      );
  }
}
