import { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useChat as useChatContext } from "~/context/chat";

export default function EuropeRound4() {
  const { sendMessage } = useChatContext();
  const [ratio, setRatio] = useState("");
  const [tested, setTested] = useState(false);

  const base = 2750;
  const objective = 2200;
  const parsed = ratio.trim() === '' ? NaN : Number(ratio.replace(',', '.'));
  const result = Math.round(base * (isFinite(parsed) ? parsed : 0));
  const ok = isFinite(parsed) && result === objective;

  return (
    <>
      <Header title="- Europe : Énigme 4 (Alimentaire)" />
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Calculez la constante r de la formule.</p>
        </div>
        <div className="terminal-wrapper">
          <h3 className="terminal-title">Alimentaire</h3>
          <div className="terminal-box">
            <p className="terminal-line">Base: 2750 kcal/j/pers — Objectif: 2200 kcal/j/pers</p>
            <p className="terminal-line">Formule: objectif = base × r</p>
            <div className="config-form">
              <input className="config-input" placeholder="r" value={ratio} onChange={(e) => { setRatio(e.target.value); setTested(false); }} />
              <button className="send-btn" onClick={() => setTested(true)}>Tester</button>
            </div>
            {tested && (
              <p className={`terminal-line ${ok ? '' : 'error'}`}>
                Résultat: {isFinite(parsed) ? result : '—'} kcal/j/pers {ok ? '✓' : '✗'}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
