import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

export default function AsieRound3() {
  return (
    <>
      <Header title="- Asie : Règles d'allumage" />
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Lis attentivement et communique ces règles à l'Europe.</p>
        </div>

        <div className="morse-box" role="note" aria-label="Règles Asie">
          <p className="morse-clue console-text">1) Le centre éclaire: l’ampoule centrale est allumée.</p>
          <p className="morse-clue console-text">2) Les deux diagonales principales dessinent un X de lumière (du bord intérieur au bord intérieur).</p>
          <p className="morse-clue console-text">3) Considère la “distance de Manhattan” au centre. Les ampoules à distance ≤ 3 appartiennent à la zone lumineuse (sous réserve d’autres règles).</p>
        </div>
      </main>
    </>
  );
}
