
import { useCreateParty } from "./create_party.hooks";

export default function CreateParty() {
    const { createParty } = useCreateParty();

    return (
        <button onClick={createParty} className="create-game-button">Créer une partie</button>
    );
}