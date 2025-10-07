import { useLocation, useNavigate, useParams } from "react-router";
import type { PartyPlayer } from "~/types/player";
import type { PartySummary } from "~/types/party";
import "../styles/home.css";
import "../styles/modal.css";
import PlayerCard from "~/components/global/PlayerCard";

interface LocationState {
  party?: PartySummary;
}

export default function PartyDetails() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const location = useLocation() as { state?: LocationState | null };
  const party = location.state?.party ?? null;

  if (!party) {
    return (
      <>
        <img src="/assets/world_map.svg" className="background-image" alt="Background" />
        <main className="party-page-container">
          <div className="party-details">
            <h1>Partie {code ?? ""}</h1>
            <p>Aucune information de partie disponible. Essaie de recréer une partie.</p>
            <div className="party-actions">
              <button type="button" className="create-game-button-modal" onClick={() => navigate("/")}>
                Retour à l'accueil
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const players: PartyPlayer[] = party.players;

  return (
    <>
      <img src="/assets/world_map.svg" className="background-image" alt="Background" />
      <main className="party-page-container">
        <img src="/assets/logo.svg" alt="Logo" className="logo-top" />
        <div className="party-details">
          <h1>{party.name}</h1>
          <div className="party-code-container">
            <p className="party-code-label">Code de la partie</p>
            <p className="party-code">#{party.code}</p>
          </div>

          <div className="player-container">
            <h2>Joueurs</h2>
            {players.length === 0 ? (
              <p>Aucun joueur dans cette partie.</p>
            ) : (
              players.map((player) => (
                <div key={player.id} className="player-cards">
                  <PlayerCard name={player.name} continent={player.continent} />
                  <PlayerCard name={player.name} continent={"Afrique"} />
                  <PlayerCard name={player.name} continent={"Asie"} />
                  <PlayerCard name={player.name} continent={"Amerique"} />
                </div>
              ))
            )}
          </div>
          <div className="party-actions">
            <button type="button" className="join-game-button" onClick={() => navigate(-1)}>
              Retour
            </button>
            <button type="button" className="create-game-button" onClick={() => navigate("/")}>
              Lancer la partie
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
