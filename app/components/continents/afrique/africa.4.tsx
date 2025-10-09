import { useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { useChat as useChatContext } from "~/context/chat";
import Info from "../../Info";

export default function AfriqueRound4() {
  const [showInfo, setShowInfo] = useState(true);
  const { sendMessage } = useChatContext();
  const [d, setD] = useState("");
  const [tested, setTested] = useState(false);

  const base = 130;
  const objective = 85;
  const parsed = d.trim() === '' ? NaN : Number(d.replace(',', '.'));
  const result = base - (isFinite(parsed) ? parsed : 0);
  const ok = isFinite(parsed) && result === objective;

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

