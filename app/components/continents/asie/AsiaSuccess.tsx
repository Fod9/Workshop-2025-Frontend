import { useNavigate } from "react-router-dom";
import "../../../styles/asia.css";

export default function AsiaSuccess() {
  const navigate = useNavigate();

  return (
    <>
      <div className="success-overlay" role="dialog" aria-modal="true">
        <div className="console-overlay">
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
            onClick={() => navigate("/asia/2")}
          >
            Continuer
          </button>
        </div>
      </div>
    </>
  );
}
