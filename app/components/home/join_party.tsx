import { useState } from "react";
import { useNavigate } from "react-router";
import JoinPartyModal, { type JoinPartyFormValues } from "./join_party_modal";
import { useJoinParty } from "./join_party.hooks";

export default function JoinParty() {
    const navigate = useNavigate();
    const { joinParty, isJoining, error } = useJoinParty();
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            const party = await joinParty({ name: partyName, hostName: playerName });

            if (party) {
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
