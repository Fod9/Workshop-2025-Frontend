import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

export default function EuropeRound5() {
  return (
    <>
      <Header title="- Europe : Fin de partie" />
      <main className="afrique-screen">
        <div className="success-overlay">
          <div className="console-overlay">
            <div className="console-line delay-1">&gt; Mission accomplie !</div>
            <div className="console-line delay-2">&gt; L'Europe a résolu ses énigmes.</div>
            <div className="console-line delay-3">&gt; Merci !</div>
          </div>
        </div>
      </main>
    </>
  );
}
