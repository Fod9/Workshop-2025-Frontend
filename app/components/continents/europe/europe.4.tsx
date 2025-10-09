import { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useChat as useChatContext } from "~/context/chat";

export default function EuropeRound4() {
  const { sendMessage } = useChatContext();
  const [num, setNum] = useState("");
  const [den, setDen] = useState("");
  const [tested, setTested] = useState(false);

  const base = 2750;
  const objective = 2200;
  const n = num.trim() === '' ? NaN : Number(num.replace(',', '.'));
  const d = den.trim() === '' ? NaN : Number(den.replace(',', '.'));
  const ratio = isFinite(n) && isFinite(d) && d !== 0 ? (n / d) : NaN;
  const result = Math.round(base * (isFinite(ratio) ? ratio : 0));
  const ok = isFinite(ratio) && result === objective;

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
            <p className="terminal-line">Formule: objectif = base × (n / d)</p>
            <div className="config-form" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
              <input className="config-input" placeholder="n" value={num} onChange={(e) => { setNum(e.target.value); setTested(false); }} />
              <input className="config-input" placeholder="d" value={den} onChange={(e) => { setDen(e.target.value); setTested(false); }} />
              <button className="send-btn" onClick={() => setTested(true)}>Tester</button>
            </div>
            {tested && (
              <p className={`terminal-line ${ok ? '' : 'error'}`}>
                Résultat: {isFinite(ratio) ? result : '—'} kcal/j/pers {ok ? '✓' : '✗'}
              </p>
            )}
            <button className="send-btn" onClick={() => sendMessage(`Formule Alimentaire: objectif = base × (${num || 'n'}/${den || 'd'})`)}>Envoyer au collecteur</button>
          </div>
        </div>
      </main>
    </>
  );
}
