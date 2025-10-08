import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";

const MORSE_TABLE_PART = `A: ·−\nB: −···\nC: −·−·\nD: −··\nE: ·\nF: ··−·\nG: −−·\nH: ····\nI: ··`;

export default function AsieRound2() {
  return (
    <>
      <Header title="- Asie : Indice Morse" />
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Indice: Table de conversion Morse (lettres uniquement)</p>
          <p className="console-text">&gt; Voici une partie utile à la décryption.</p>
        </div>

        <div className="morse-box">
          <p className="morse-clue console-text" aria-label="Table Morse partielle">
            {MORSE_TABLE_PART}
          </p>
        </div>
      </main>
    </>
  );
}
