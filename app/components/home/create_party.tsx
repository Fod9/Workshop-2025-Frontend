import { useState } from "react";
import { useNavigate } from "react-router";
import CreatePartyModal, { type CreatePartyFormValues } from "./create_party_modal";
import { useCreateParty } from "./create_party.hooks";

export default function CreateParty() {
    const navigate = useNavigate();
    const { createParty, isCreating, error } = useCreateParty();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (!isCreating) {
            setIsModalOpen(false);
        }
    };

    const handleSubmit = async ({ partyName, playerName }: CreatePartyFormValues) => {
        try {
            const party = await createParty({ name: partyName, hostName: playerName });

            if (party) {
                setIsModalOpen(false);
                navigate(`/party/${party.code}`, { state: { party } });
            }
        } catch (err) {
            console.error("Error creating party:", err);
        }
    };

    return (
        <>
            <button
                type="button"
                className="create-game-button"
                onClick={handleOpenModal}
                disabled={isCreating}
            >
                {isCreating ? "Création en cours..." : "Créer une partie"}
            </button>
            <CreatePartyModal
                isOpen={isModalOpen}
                isSubmitting={isCreating}
                error={error}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
        </>
    );
}
