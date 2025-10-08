import { useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import AfriqueRound1 from "../components/continents/afrique/africa.1";
import AfriqueRound2 from "../components/continents/afrique/africa.2";

export default function AfricaRound() {
  const { round } = useParams<{ round: string }>();
  
  switch (round) {
    case "1":
      return <AfriqueRound1 round={round} />;
    case "2":
      return <AfriqueRound2 />;
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
