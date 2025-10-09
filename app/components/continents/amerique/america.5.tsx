import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

export default function AmericaRound5() {
  return (
    <>
      <Header title="- Amérique : Fin de partie" />
      <main className="afrique-screen">
        <div className="success-overlay">
          <div className="console-overlay">
            <div className="console-line delay-1">&gt; Bravo !</div>
            <div className="console-line delay-2">&gt; L'Amérique a résolu ses énigmes.</div>
            <div className="console-line delay-3">&gt; Merci d'avoir joué.</div>
          </div>
        </div>
      </main>
    </>
  );
}
