import { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useChat as useChatContext } from "~/context/chat";

export default function AsiaRound4() {
  const { sendMessage } = useChatContext();
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [tested, setTested] = useState(false);

  const base = 132;
  const objective = 40;
  const p1 = d1.trim() === '' ? NaN : Number(d1.replace(',', '.'));
  const p2 = d2.trim() === '' ? NaN : Number(d2.replace(',', '.'));
  const sum = (isFinite(p1) ? p1 : 0) + (isFinite(p2) ? p2 : 0);
  const result = base - sum;
  const ok = isFinite(p1) && isFinite(p2) && result === objective;

  return (
    <>
      <Header title="- Asie : Énigme 4 (Textile)" />
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Trouvez d dans la formule.</p>
        </div>
        <div className="terminal-wrapper">
          <h3 className="terminal-title">Textile</h3>
          <div className="terminal-box">
            <p className="terminal-line">Production: 132 Mds t/an — Objectif: 40 Mds t/an</p>
            <p className="terminal-line">Formule: objectif = base − (d1 + d2)</p>
            <div className="config-form" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
              <input className="config-input" placeholder="d1" value={d1} onChange={(e) => { setD1(e.target.value); setTested(false); }} />
              <input className="config-input" placeholder="d2" value={d2} onChange={(e) => { setD2(e.target.value); setTested(false); }} />
              <button className="send-btn" onClick={() => setTested(true)}>Tester</button>
            </div>
            {tested && (
              <p className={`terminal-line ${ok ? '' : 'error'}`}>
                Résultat: {isFinite(p1) && isFinite(p2) ? result : '—'} Mds t/an {ok ? '✓' : '✗'}
              </p>
            )}
            <button className="send-btn" onClick={() => sendMessage(`Formule Textile: objectif = base − (${d1 || 'd1'} + ${d2 || 'd2'})`)}>Envoyer au collecteur</button>
          </div>
        </div>
      </main>
    </>
  );
}
