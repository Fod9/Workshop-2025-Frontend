import { useCallback, useRef, useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/afrique/africa2.css";
import { backendService } from "~/services/backend";
import type { ApiSuccess, GameRead } from "~/types/backend";
import { useGame } from "~/context/game";

function normaliseNumberText(s: string): string {
  // Replace comma by dot, trim spaces
  return s.replace(/,/g, ".").trim();
}

function parseRatioFormula(input: string): number | null {
  // Accept forms like: "objectif = base × 0.8" or "objectif=base*0.8" or "base*0.8"
  const str = normaliseNumberText(input).toLowerCase();
  // Extract last number appearing after a * or x or ×
  const m = str.match(/[\*x×]\s*([0-9]+(?:\.[0-9]+)?)/);
  if (m && m[1]) {
    const r = Number(m[1]);
    return Number.isFinite(r) ? r : null;
  }
  // Fallback: get any number between 0 and 1
  const any = str.match(/([0]\.[0-9]+|1(?:\.0+)?)/);
  if (any && any[1]) {
    const r = Number(any[1]);
    if (r >= 0 && r <= 1 && Number.isFinite(r)) return r;
  }
  return null;
}

function parseSubtractFormula(input: string): number | null {
  // Accept forms like: "objectif = base − 92" or "base-92" with hyphen or minus
  const str = normaliseNumberText(input).toLowerCase();
  const m = str.match(/[\-−]\s*([0-9]+(?:\.[0-9]+)?)/);
  if (m && m[1]) {
    const d = Number(m[1]);
    return Number.isFinite(d) ? d : null;
  }
  return null;
}

export default function AmericaRound4() {
  const { gameId, setStage, setPlayers } = useGame();
  const continuedRef = useRef(false);

  const [foodFormula, setFoodFormula] = useState("");
  const [textileFormula, setTextileFormula] = useState("");
  const [cosmFormula, setCosmFormula] = useState("");

  const [foodOk, setFoodOk] = useState<boolean | null>(null);
  const [textileOk, setTextileOk] = useState<boolean | null>(null);
  const [cosmOk, setCosmOk] = useState<boolean | null>(null);

  const [showOverlay, setShowOverlay] = useState(false);

  const testFood = useCallback(() => {
    const r = parseRatioFormula(foodFormula);
    if (r == null) { setFoodOk(false); return; }
    const expected = 2200;
    const base = 2750;
    const result = Math.round(base * r);
    setFoodOk(result === expected);
  }, [foodFormula]);

  const testTextile = useCallback(() => {
    const d = parseSubtractFormula(textileFormula);
    if (d == null) { setTextileOk(false); return; }
    const expected = 132 - 92; // 40
    const base = 132;
    const result = base - d;
    setTextileOk(result === expected);
  }, [textileFormula]);

  const testCosm = useCallback(() => {
    const d = parseSubtractFormula(cosmFormula);
    if (d == null) { setCosmOk(false); return; }
    const expected = 130 - 45; // 85
    const base = 130;
    const result = base - d;
    setCosmOk(result === expected);
  }, [cosmFormula]);

  const canValidate = foodOk === true && textileOk === true && cosmOk === true;

  const handleValidateAll = useCallback(async () => {
    if (!canValidate) return;
    setShowOverlay(true);
    if (continuedRef.current) return;
    continuedRef.current = true;
    try {
      if (!gameId) return;
      const res = await backendService.post<ApiSuccess<GameRead>>(`/game/continue/${gameId}`);
      if (res?.status === "success" && res.data) {
        setStage(res.data.stage);
        const mapped = (res.data.players ?? []).map((p) => ({
          id: String(p.id),
          name: p.name,
          continent: (p.continent ?? "").toString().trim(),
          is_host: p.is_host === true,
        }));
        if (mapped.length) setPlayers(mapped);
      }
    } catch (e) {
      console.error("continue game failed", e);
    }
  }, [canValidate, gameId, setStage, setPlayers]);

  return (
    <>
      <Header title="- Continent Amérique" secondTitle="Réparation de l'unité Amérique (surproduction et déchets)"/>
      <main className="afrique-screen">
        <div className="consigne">
          <p className="console-text">&gt; Le collecteur saisit les 3 formules complètes reçues via le chat.</p>
          <p className="console-text">&gt; Format accepté: par ex. "objectif = base × r" ou "objectif = base − d".</p>
        </div>

        <div className="terminal-wrapper">
          <h3 className="terminal-title">Alimentaire</h3>
          <div className="terminal-box">
            <p className="terminal-line">Base: 2750 kcal/j/pers — Objectif: 2200 kcal/j/pers</p>
            <p className="terminal-line">Formule attendue: objectif = base × r</p>
            <div className="config-form" style={{ gridTemplateColumns: '1fr auto' }}>
              <input className="config-input" placeholder="objectif = base × r" value={foodFormula} onChange={(e) => setFoodFormula(e.target.value)} />
              <button className="send-btn" onClick={testFood}>Tester</button>
            </div>
            {foodOk !== null && (
              <p className={`terminal-line ${foodOk ? '' : 'error'}`}>{foodOk ? '✓ Formule correcte' : '✗ Formule incorrecte'}</p>
            )}
          </div>
        </div>

        <div className="terminal-wrapper">
          <h3 className="terminal-title">Textile</h3>
          <div className="terminal-box">
            <p className="terminal-line">Production: 132 Mds t/an — Objectif: 40 Mds t/an</p>
            <p className="terminal-line">Formule attendue: objectif = base − d</p>
            <div className="config-form" style={{ gridTemplateColumns: '1fr auto' }}>
              <input className="config-input" placeholder="objectif = base − d" value={textileFormula} onChange={(e) => setTextileFormula(e.target.value)} />
              <button className="send-btn" onClick={testTextile}>Tester</button>
            </div>
            {textileOk !== null && (
              <p className={`terminal-line ${textileOk ? '' : 'error'}`}>{textileOk ? '✓ Formule correcte' : '✗ Formule incorrecte'}</p>
            )}
          </div>
        </div>

        <div className="terminal-wrapper">
          <h3 className="terminal-title">Cosmétique</h3>
          <div className="terminal-box">
            <p className="terminal-line">Production: 130 Mds t/an — Objectif: 85 Mds t/an</p>
            <p className="terminal-line">Formule attendue: objectif = base − d</p>
            <div className="config-form" style={{ gridTemplateColumns: '1fr auto' }}>
              <input className="config-input" placeholder="objectif = base − d" value={cosmFormula} onChange={(e) => setCosmFormula(e.target.value)} />
              <button className="send-btn" onClick={testCosm}>Tester</button>
            </div>
            {cosmOk !== null && (
              <p className={`terminal-line ${cosmOk ? '' : 'error'}`}>{cosmOk ? '✓ Formule correcte' : '✗ Formule incorrecte'}</p>
            )}
          </div>
        </div>

        <div className="morse-box" role="group" aria-label="Validation">
          <button className="validate-btn" onClick={handleValidateAll} disabled={!canValidate}>Valider les 3 formules</button>
        </div>

        {showOverlay && (
          <div className="success-overlay">
            <div className="console-overlay">
              <div className="console-line delay-1">&gt; Formules validées.</div>
              <div className="console-line delay-2">&gt; Surproduction corrigée.</div>
              <div className="console-line delay-3">&gt; Passage à l'étape suivante...</div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
