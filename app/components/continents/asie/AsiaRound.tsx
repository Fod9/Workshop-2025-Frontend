import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import "../../../styles/asia.css";
import AsiaSuccess from "./AsiaSuccess";
import { backendService } from "~/services/backend";
import type { ApiSuccess, GameRead } from "~/types/backend";
import { useGame } from "~/context/game";
import Info from "./Info";

type Point = { x: number; y: number };
type Connection = { from: string; to: string };
type OpId = 'mul9' | 'mul12' | 'mul16';

const OPS: Record<OpId, (x: number) => number> = {
  mul9: (x) => x * 9,
  mul12: (x) => x * 12,
  mul16: (x) => x * 16
};

export default function AsiaRound() {
  const [showInfo, setShowInfo] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const { gameId, setStage, setPlayers } = useGame();
  const continuedRef = useRef(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);

  const current_value = 523;
  const target_value = 117;

  const first_number = 5;
  const second_number = 2;
  const third_number = 3;

  const [connections, setConnections] = useState<Connection[]>([]);
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [draggingExisting, setDraggingExisting] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Point | null>(null);
  const [hoverSymbol, setHoverSymbol] = useState<string | null>(null);

  const SYMBOL_TO_OP: Record<string, OpId> = useMemo(() => ({
    top_sym: 'mul16',
    middle_sym: 'mul9',
    bottom_sym: 'mul12'
  }), []);

  const NUM_VALUE_BY_ID: Record<string, number> = useMemo(() => ({
    top_num: first_number,
    middle_num: second_number,
    bottom_num: third_number
  }), [first_number, second_number, third_number]);

  const valueForLink = useCallback((link: Connection) => {
    const base = NUM_VALUE_BY_ID[link.from];
    const opId = SYMBOL_TO_OP[link.to];
    const op = opId ? OPS[opId] : undefined;
    if (typeof base !== 'number' || !op) return 0;
    return op(base);
  }, [NUM_VALUE_BY_ID, SYMBOL_TO_OP]);

  const calculated_value = useMemo(
    () => connections.reduce((sum, l) => sum + valueForLink(l), 0),
    [connections, valueForLink]
  );

  useEffect(() => {
    if (calculated_value === target_value && !isSuccess) {
        setIsSuccess(true);
        setTimeout(() => setShowOverlay(true), 2000);
    }
  }, [calculated_value, target_value, isSuccess]);

  const handleContinue = useCallback(async () => {
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

  const ANCHOR_OUTSET = 6;

  const getAnchor = (id: string, side: 'left' | 'right' | 'top' | 'bottom' | 'center'): Point | null => {
    const container = containerRef.current;
    const el = document.getElementById(id);
    if (!container || !el) return null;
    const rect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    const xLeft = rect.left - cRect.left;
    const xRight = rect.right - cRect.left;
    const yTop = rect.top - cRect.top;
    const yBottom = rect.bottom - cRect.top;
    const xCenter = (xLeft + xRight) / 2;
    const yCenter = (yTop + yBottom) / 2;

    switch (side) {
      case 'left':   return { x: xLeft  - ANCHOR_OUTSET, y: yCenter };
      case 'right':  return { x: xRight + ANCHOR_OUTSET, y: yCenter };
      case 'top':    return { x: xCenter, y: yTop    - ANCHOR_OUTSET };
      case 'bottom': return { x: xCenter, y: yBottom + ANCHOR_OUTSET };
      default:       return { x: xCenter, y: yCenter };
    }
  };

  const getFromAnchor = (fromId: string) => getAnchor(fromId, 'right');

  const getToAnchor = (toId: string) => getAnchor(toId, 'left');

  const getHoverTargetPoint = (): Point | null => {
    if (hoverSymbol) {
      return getToAnchor(hoverSymbol) ?? mousePos;
    }
    return mousePos;
  };

  const makePath = (a: Point, b: Point) => {
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`;
  };

  const handleStart = (id: string) => {
    const existing = connections.find((c) => c.from === id);
    if (existing) {
      setConnections((prev) => prev.filter((c) => c.from !== id));
      setDraggingExisting(id);
    } else {
      setDragFrom(id);
    }
  };

  const handleMove = (e: React.MouseEvent) => {
    if ((!dragFrom && !draggingExisting) || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleEnterSymbol = (id: string) => setHoverSymbol(id);
  const handleLeaveSymbol = () => setHoverSymbol(null);

  const handleDrop = (symbolId: string) => {
    const from = dragFrom || draggingExisting;
    if (!from) return;
    setConnections((prev) => {
      const filtered = prev.filter((c) => c.from !== from);
      return [...filtered, { from, to: symbolId }];
    });
    setDragFrom(null);
    setDraggingExisting(null);
    setMousePos(null);
    setHoverSymbol(null);
  };

  const handleCancel = () => {
    if (dragFrom || draggingExisting) {
      setDragFrom(null);
      setDraggingExisting(null);
      setMousePos(null);
      setHoverSymbol(null);
    }
  };

  const activeFrom = dragFrom || draggingExisting;

  return (
    <>
      {showInfo && (
        <Info
          continent="Asia"
          onContinue={() => setShowInfo(false)}
        />
      )}
      <main className="asia-screen" onMouseMove={handleMove} onMouseUp={handleCancel}>
        <div className="consigne">
          <p className="console-text">
            &gt; Le noeud de Gaia chargé de garantir un taux de CO2 dans l'air stable a été corrompu.
          </p>
          <p className="console-text">&gt; Aide Gaia à rétablir un taux acceptable.</p>
        </div>

        <div className="values-header">
          <div className="target-value">
            <p className="white console-text">Taux de CO2 cible :</p>
            <p className="bold green console-text">{target_value}µg/m3</p>
          </div>
          <div className="current-value">
            <p className="white console-text">Taux de CO2 actuel :</p>
            <p className="bold red console-text">{current_value}µg/m3</p>
          </div>
        </div>

        <div className="outlined-container" ref={containerRef}>
          <div className="calculated-value-text">
            <p className={`number bold console-text ${target_value === calculated_value ? "right-calculated-value" : "calculated-value"}`}>{calculated_value}</p>
          </div>

          <svg className="cables">
            {connections.map((c, i) => {
              const a = getFromAnchor(c.from);
              const b = getToAnchor(c.to);
              if (!a || !b) return null;
              return (
                <path
                  key={i}
                  d={makePath(a, b)}
                  stroke="var(--color-bright-turquoise)"
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}

            {activeFrom && (mousePos || hoverSymbol) && (() => {
              const a = getFromAnchor(activeFrom);
              const b = getHoverTargetPoint();
              if (!a || !b) return null;
              return (
                <path
                  d={makePath(a, b)}
                  stroke="var(--color-green)"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })()}
          </svg>

          <div className="top-left number">{first_number}</div>
          <img
            id="top_num"
            draggable={false}
            onMouseDown={(e) => { e.preventDefault(); handleStart("top_num"); }}
            className="top-bidule"
            src="/assets/bidule.svg"
            alt=""
          />

          <div className="middle-left number">{second_number}</div>
          <img
            id="middle_num"
            draggable={false}
            onMouseDown={(e) => { e.preventDefault(); handleStart("middle_num"); }}
            className="middle-bidule"
            src="/assets/bidule.svg"
            alt=""
          />

          <div className="bottom-left number">{third_number}</div>
          <img
            id="bottom_num"
            draggable={false}
            onMouseDown={(e) => { e.preventDefault(); handleStart("bottom_num"); }}
            className="bottom-bidule"
            src="/assets/bidule.svg"
            alt=""
          />

          <div
            id="top_sym"
            className={`top-right ${hoverSymbol === "top_sym" ? "hovered-symbol" : ""}`}
            onMouseUp={() => handleDrop("top_sym")}
            onMouseEnter={() => handleEnterSymbol("top_sym")}
            onMouseLeave={handleLeaveSymbol}
          >
            <img src="/assets/symbol1.svg" alt="Symbole 1" />
          </div>

          <div
            id="middle_sym"
            className={`middle-right ${hoverSymbol === "middle_sym" ? "hovered-symbol" : ""}`}
            onMouseUp={() => handleDrop("middle_sym")}
            onMouseEnter={() => handleEnterSymbol("middle_sym")}
            onMouseLeave={handleLeaveSymbol}
          >
            <img src="/assets/symbol2.svg" alt="Symbole 2" />
          </div>

          <div
            id="bottom_sym"
            className={`bottom-right ${hoverSymbol === "bottom_sym" ? "hovered-symbol" : ""}`}
            onMouseUp={() => handleDrop("bottom_sym")}
            onMouseEnter={() => handleEnterSymbol("bottom_sym")}
            onMouseLeave={handleLeaveSymbol}
          >
            <img src="/assets/symbol3.svg" alt="Symbole 3" />
          </div>
        </div>
        {isSuccess && <AsiaSuccess onContinue={handleContinue} />}
      </main>
    </>
  );
}
