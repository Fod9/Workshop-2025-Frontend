import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

export default function AfriqueRound5() {
  return (
    <>
      <Header title="- Afrique : Fin de partie" />
      <main className="afrique-screen">
        <div className="success-overlay">
          <div className="console-overlay">
            <div className="console-line delay-1">&gt; Félicitations !</div>
            <div className="console-line delay-2">&gt; L'Afrique a complété l'aventure.</div>
            <div className="console-line delay-3">&gt; À bientôt.</div>
          </div>
        </div>
      </main>
    </>
  );
}
