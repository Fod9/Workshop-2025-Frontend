
import "../../styles/components/player_card.css"

export default function PlayerCard({ name, continent }: { name: string; continent?: string }) {
    return (
        <div className="player-card">
            <img src={`/assets/continents/${continent}.png`} alt={continent ?? "unknown"} className="player-flag" />
            <p className="player-continent">{continent}</p>
            <p className="player-name">{name}</p>
        </div>
    );
}