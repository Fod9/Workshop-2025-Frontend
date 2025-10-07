import { useLocation, useNavigate, useParams } from "react-router";
import type { PartyPlayer } from "~/types/player";
import type { PartySummary } from "~/types/party";
import "../styles/home.css";
import "../styles/modal.css";
import PlayerCard from "~/components/global/PlayerCard";
import { useGame } from "~/context/game";

interface LocationState {
  party?: PartySummary;
}

export default function PartyDetails() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const location = useLocation() as { state?: LocationState | null };
  const party = location.state?.party ?? null;
  const { players: ctxPlayers, code: ctxCode } = useGame();

  if (!party) {
    return (
      <>
        <img src="/assets/world_map.svg" className="background-image" alt="Background" />
        <main className="party-page-container">
          <div className="party-details">
            <h1>Partie {ctxCode ?? code ?? ""}</h1>
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

  const players: PartyPlayer[] = ctxPlayers.length ? ctxPlayers : party.players;

  return (
    <>
      <img src="/assets/world_map.svg" className="background-image" alt="Background" />
      <main className="party-page-container">
        <img src="/assets/logo.svg" alt="Logo" className="logo-top" />
        <div className="party-details">
          <h1>{party.name}</h1>
          <div className="party-code-container">
            <p className="party-code-label">Code de la partie</p>
            <p className="party-code">#{ctxCode ?? party.code}</p>
          </div>

          <div className="player-container">
            <h2>Joueurs</h2>
            {players.length === 0 ? (
              <p>Aucun joueur dans cette partie.</p>
            ) : (
              <div className="player-cards">
                {players.map((player) => (
                  <PlayerCard key={player.id} name={player.name} continent={player.continent}/>
                ))}
              </div>
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
