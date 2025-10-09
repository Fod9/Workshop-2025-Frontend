import { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useChat as useChatContext } from "~/context/chat";
import Info from "../../Info";

export default function AsiaRound4() {
  const [showInfo, setShowInfo] = useState(true);
  const { sendMessage } = useChatContext();
  const [d, setD] = useState("");
  const [tested, setTested] = useState(false);

  const base = 132;
  const objective = 40;
  const parsed = d.trim() === '' ? NaN : Number(d.replace(',', '.'));
  const result = base - (isFinite(parsed) ? parsed : 0);
  const ok = isFinite(parsed) && result === objective;

  return (
    <>
      <Header title="- Continent Asie" secondTitle="Réparation de l'unité Amérique (surproduction et déchets)"/>
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
          <h3 className="terminal-title">Textile</h3>
          <div className="terminal-box">
            <p className="terminal-line">Production: 132 Mds t/an — Objectif: 40 Mds t/an</p>
            <p className="terminal-line">Formule: objectif = base − d</p>
            <div className="config-form">
              <input className="config-input" placeholder="d (déchets)" value={d} onChange={(e) => { setD(e.target.value); setTested(false); }} />
              <button className="send-btn" onClick={() => setTested(true)}>Tester</button>
            </div>
            {tested && (
              <p className={`terminal-line ${ok ? '' : 'error'}`}>
                Résultat: {isFinite(parsed) ? result : '—'} Mds t/an {ok ? '✓' : '✗'}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

