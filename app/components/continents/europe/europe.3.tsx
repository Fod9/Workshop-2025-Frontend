import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "~/components/layout/Header";
import "~/styles/continents/europe/europe3.css";
import "~/styles/continents/afrique/africa2.css"; // reuse overlay/console styles
import { backendService } from "~/services/backend";
import type { ApiSuccess, GameRead } from "~/types/backend";
import { useGame } from "~/context/game";

type Grid = boolean[][];

const SIZE = 9; // beaucoup d’ampoules pour une bonne difficulté
const MID = Math.floor(SIZE / 2);

function makeGrid(size: number): Grid {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => false));
}

export default function EuropeRound3() {
  const [grid, setGrid] = useState<Grid>(() => makeGrid(SIZE));
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const continuedRef = useRef(false);

  const { gameId, setStage, setPlayers } = useGame();

  // État cible (exemple cohérent avec des règles réparties sur les continents):
  // - Bords éteints
  // - Ligne & colonne centrales allumées (hors bords)
  // - Tout le reste éteint
  const isTargetState = useMemo(() => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const isBorder = r === 0 || c === 0 || r === SIZE - 1 || c === SIZE - 1;
        const isCenter = r === MID && c === MID;
        const dist = Math.abs(r - MID) + Math.abs(c - MID);
        const isDiamond = dist <= 3; // zone centrale en losange
        const isDiagonal = r === c || r + c === SIZE - 1; // croix en X
        const isHole = (r % 2 === 0) && (c % 2 === 0); // damier clair
        const shouldOn = !isBorder && (isDiamond || isDiagonal) && (!isHole || isCenter);
        if (grid[r][c] !== shouldOn) return false;
      }
    }
    return true;
  }, [grid]);

  const handleClick = useCallback((r: number, c: number) => {
    setGrid(prev => {
      const next = prev.map(row => row.slice());
      next[r][c] = !next[r][c];
      return next;
    });
  }, []);

  const continueGame = useCallback(async () => {
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
  }, [gameId, setStage, setPlayers]);

  // Déclenche l’overlay de succès uniquement si la configuration correspond à l'état cible
  useEffect(() => {
    if (!isSuccess && isTargetState) {
      setIsSuccess(true);
      setShowOverlay(true);
    }
  }, [isTargetState, isSuccess]);

  return (
    <>
      <Header title="- Continent Europe" secondTitle="Réparation de l'unité Europe (production d'énergie)"/>
      <main className="europe-lamps-screen">
        <div className="consigne">
          <p className="rule">Consigne: allume/éteins les ampoules une par une pour obtenir le bon schéma.</p>
          <p className="hint">Les autres continents donnent les règles à respecter. Quand toutes les règles sont satisfaites, la mission se termine.</p>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem'}}>
          <button className="btn-console" style={{padding: '0.3rem 0.8rem'}} onClick={() => setGrid(makeGrid(SIZE))}>Réinitialiser</button>
        </div>

        <div className="bulb-grid" role="grid" aria-label="Grille d’ampoules">
          {grid.map((row, r) => (
            <div key={r} className="bulb-row" role="row">
              {row.map((on, c) => (
                <button
                  key={`${r}-${c}`}
                  role="gridcell"
                  aria-pressed={on}
                  aria-label={`Ampoule ${r + 1}, ${c + 1} ${on ? "allumée" : "éteinte"}`}
                  className={`bulb ${on ? "on" : "off"}`}
                  onClick={() => handleClick(r, c)}
                >
                  <span className="bulb-core" />
                </button>
              ))}
            </div>
          ))}
        </div>

        {showOverlay && (
          <div className="success-overlay" role="dialog" aria-modal="true">
            <div className="console-overlay">
              <p className="console-line delay-1">&gt; Réseau stabilisé...</p>
              <p className="console-line delay-2">&gt; Toutes les ampoules sont allumées.</p>
              <p className="console-line delay-3 green">&gt; Mission accomplie, passe à la suite.</p>
              <button className="btn-console delay-4" onClick={continueGame}>Continuer</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
