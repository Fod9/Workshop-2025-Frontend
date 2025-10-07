import { useEffect, useMemo, useState, type FormEvent } from "react";

export interface CreatePartyFormValues {
    partyName: string;
    playerName: string;
}

interface CreatePartyModalProps {
    isOpen: boolean;
    isSubmitting?: boolean;
    error?: unknown;
    onClose: () => void;
    onSubmit: (values: CreatePartyFormValues) => Promise<void>;
}

export default function CreatePartyModal({
    isOpen,
    isSubmitting = false,
    error,
    onClose,
    onSubmit,
}: CreatePartyModalProps) {
    const [partyName, setPartyName] = useState("");
    const [playerName, setPlayerName] = useState("");

    useEffect(() => {
        if (isOpen) {
            setPartyName("");
            setPlayerName("");
        }
    }, [isOpen]);

    const errorMessage = useMemo(() => {
        if (!error) {
            return null;
        }

        if (typeof error === "string") {
            return error;
        }

        if (error instanceof Error) {
            return error.message;
        }

        return "Une erreur est survenue lors de la création de la partie.";
    }, [error]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSubmit({ partyName: partyName.trim(), playerName: playerName.trim() });
    };

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-content">
                <button type="button" className="modal-close" aria-label="Fermer" onClick={onClose}>
                    ×
                </button>
                <h2>Créer une nouvelle partie</h2>
                <p className="modal-description">
                    Renseigne le nom de ta partie et ton nom de joueur pour commencer.
                </p>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <label>
                        Nom de la partie
                        <input
                            type="text"
                            name="partyName"
                            value={partyName}
                            onChange={(event) => setPartyName(event.target.value)}
                            placeholder="Ex: EcoRescue Squad"
                            required
                        />
                    </label>
                    <label>
                        Ton nom de joueur
                        <input
                            type="text"
                            name="playerName"
                            value={playerName}
                            onChange={(event) => setPlayerName(event.target.value)}
                            placeholder="Ex: Alex"
                            required
                        />
                    </label>
                    {errorMessage && <p className="modal-error" role="alert">{errorMessage}</p>}
                    <button
                        type="submit"
                        className="create-game-button-modal"
                        disabled={isSubmitting || partyName.trim() === "" || playerName.trim() === ""}
                    >
                        {isSubmitting ? "Création..." : "Créer la partie"}
                    </button>
                </form>
            </div>
        </div>
    );
}
