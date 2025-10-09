import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

export default function AsiaRound5() {
  return (
    <>
      <Header title="- Asie : Fin de partie" />
      <main className="afrique-screen">
        <div className="success-overlay">
          <div className="console-overlay">
            <div className="console-line delay-1">&gt; Bien joué !</div>
            <div className="console-line delay-2">&gt; L'Asie a rempli sa mission.</div>
            <div className="console-line delay-3">&gt; Rendez-vous pour la suite !</div>
          </div>
        </div>
      </main>
    </>
  );
}
