import { useState } from "react";
import { useNavigate } from "react-router";
import JoinPartyModal, { type JoinPartyFormValues } from "./join_party_modal";
import { useJoinParty } from "./join_party.hooks";
import { useGame } from "~/context/game";
import { usePlayer } from "~/context/player";

export default function JoinParty() {
    const navigate = useNavigate();
    const { joinParty, isJoining, error } = useJoinParty();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { setGameId, setCode, addPlayer, setPlayers } = useGame();
    const { setPlayer } = usePlayer();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (!isJoining) {
            setIsModalOpen(false);
        }
    };

    const handleSubmit = async ({ partyName, playerName }: JoinPartyFormValues) => {
        try {
            const party = await joinParty({ name: playerName, joinCode: partyName });

            if (party) {
                // Set context for current game and player
                setGameId(party.id);
                setCode(party.code);
                setPlayers(party.players);
                const currentPlayer = party.players.find(p => p.name === playerName);
                if (currentPlayer) {
                    setPlayer(currentPlayer);
                }
                setIsModalOpen(false);
                navigate(`/party/${party.code}`, { state: { party } });
            }
        } catch (err) {
            console.error("Error joining party:", err);
        }
    };

    return (
        <>
            <button
                type="button"
                className="join-game-button"
                onClick={handleOpenModal}
                disabled={isJoining}
            >
                {isJoining ? "Arrivée dans la partie en cours..." : "Rejoindre une partie"}
            </button>
            <JoinPartyModal
                isOpen={isModalOpen}
                isSubmitting={isJoining}
                error={error}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
        </>
    );
}
