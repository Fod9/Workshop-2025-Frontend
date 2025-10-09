import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

export default function AmericaRound3() {
  return (
    <>
      <Header title="- Amérique : Règles d'allumage" />
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Transmets ces contraintes à l'équipe Europe.</p>
        </div>

        <div className="morse-box" role="note" aria-label="Règles Amérique">
          <p className="morse-clue console-text">1) Imagine un damier: si la ligne ET la colonne d’une ampoule sont paires (0‑indexées), alors cette ampoule doit rester éteinte.</p>
          <p className="morse-clue console-text">2) Exception: l’ampoule centrale est allumée même si elle viole la règle précédente.</p>
        </div>
      </main>
    </>
  );
}
