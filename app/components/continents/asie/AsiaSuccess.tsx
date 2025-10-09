import { useRef } from "react";
import "../../../styles/asia.css";
import { useConsoleTypingSound } from "~/hooks/useConsoleTypingSound";

export default function AsiaSuccess({ onContinue }: { onContinue: () => void }) {
  const called = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  useConsoleTypingSound(overlayRef, undefined, true);

  return (
    <>
      <div className="success-overlay" role="dialog" aria-modal="true">
        <div className="console-overlay" ref={overlayRef}>
          <p className="console-line delay-1">
            &gt; Calcul terminé...
          </p>
          <p className="console-line delay-2">
            &gt; Taux de CO₂ restauré à une valeur stable.
          </p>
          <p className="console-line delay-3 green">
            &gt; Mission accomplie, Gaia te remercie.
          </p>

          <button
            className="btn-console delay-4"
            onClick={() => {
              if (!called.current) {
                called.current = true;
                onContinue();
              }
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </>
  );
}
