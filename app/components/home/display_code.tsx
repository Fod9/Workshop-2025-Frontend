
interface DisplayGameCodeProps {
    gameCode: string;
}

export default function DisplayGameCode({ gameCode }: DisplayGameCodeProps) {
    return (
        <div>
            <h1>Code de la partie</h1>
            <p>Votre code de partie est : {gameCode}</p>
            <button onClick={() => navigator.clipboard.writeText(gameCode)}>Copier le code</button>
            <button>Rejoindre la partie</button>
        </div>
    )
}