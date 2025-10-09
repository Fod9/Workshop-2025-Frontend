import { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useChat as useChatContext } from "~/context/chat";
import Info from "../../Info";

export default function AfriqueRound4() {
  const [showInfo, setShowInfo] = useState(true);
  const { sendMessage } = useChatContext();
  const [k, setK] = useState("");
  const [m, setM] = useState("");
  const [tested, setTested] = useState(false);

  const base = 130;
  const objective = 85;
  const fk = k.trim() === '' ? NaN : Number(k.replace(',', '.'));
  const fm = m.trim() === '' ? NaN : Number(m.replace(',', '.'));
  const prod = (isFinite(fk) ? fk : 0) * (isFinite(fm) ? fm : 0);
  const result = base - prod;
  const ok = isFinite(fk) && isFinite(fm) && result === objective;

  return (
    <>
      <Header title="- Continent Afrique" secondTitle="Réparation de l'unité Amérique (surproduction et déchets)"/>
      {showInfo && (
        <Info
            continent="America"
            onContinue={() => setShowInfo(false)}
        />
      )}
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Trouvez d dans la formule.</p>
        </div>
        <div className="terminal-wrapper">
          <h3 className="terminal-title">Cosmétique</h3>
          <div className="terminal-box">
            <p className="terminal-line">Production: 130 Mds t/an — Objectif: 85 Mds t/an</p>
            <p className="terminal-line">Formule: objectif = base − (k × m)</p>
            <div className="config-form" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
              <input className="config-input" placeholder="k" value={k} onChange={(e) => { setK(e.target.value); setTested(false); }} />
              <input className="config-input" placeholder="m" value={m} onChange={(e) => { setM(e.target.value); setTested(false); }} />
              <button className="send-btn" onClick={() => setTested(true)}>Tester</button>
            </div>
            {tested && (
              <p className={`terminal-line ${ok ? '' : 'error'}`}>
                Résultat: {isFinite(fk) && isFinite(fm) ? result : '—'} Mds t/an {ok ? '✓' : '✗'}
              </p>
            )}
            <button className="send-btn" onClick={() => sendMessage(`Formule Cosmétique: objectif = base − (${k || 'k'} × ${m || 'm'})`)}>Envoyer au collecteur</button>
          </div>
        </div>
      </main>
    </>
  );
}
