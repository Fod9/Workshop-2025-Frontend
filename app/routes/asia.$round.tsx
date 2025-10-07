import { useParams } from "react-router";
import "../styles/asia.css";
import Header from "../components/layout/Header"

export default function AsiaRound() {
  const { round } = useParams<{ round: string }>();

  return (
    <>
        <Header title={"- Asie : Pollution de l'air"}/>
        <main className="asia-screen">
            <p className="console-text">&gt; Le noeud de Gaia chargé de garantir un taux de CO2 dans l'air stable a été corrompu.</p>
            <p className="console-text">&gt; Aide Gaia à rétablir un taux acceptable.</p>
            <div className="outlined-container">
                <div className="target-value">
                    <p className="white console-text">Taux de CO2 cible : <p className="bold green console-text">117µg/m3</p></p>
                </div>
            </div>
        </main>
    </>
  );
}