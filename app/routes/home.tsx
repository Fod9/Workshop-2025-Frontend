import "../styles/home.css";
import CreateParty from "../components/home/create_party";

export default function Home() {
  return (
    <>
      <img src="/assets/world_map.svg" className="background-image" alt="Background" />
      <div className="home-page-container">
        <img src="/assets/logo.svg" className="logo" alt="Logo" />
        <button className="join-game-button">Rejoindre une partie</button>
        <CreateParty />
      </div>
    </>
  );
}
