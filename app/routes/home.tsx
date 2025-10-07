import "../styles/home.css"
import CreateParty from "../components/home/create_party"

export default function Home() {
  return (
    <div className="home-page-container">
      <h1>EcoRescue</h1>
      <button className="join-game-button">Rejoindre une partie</button>
      <CreateParty />
    </div>
  )
}
