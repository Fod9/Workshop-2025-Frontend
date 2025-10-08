import "../styles/home.css";
import CreateParty from "../components/home/create_party";
import JoinParty from "../components/home/join_party";
import { useEffect } from "react";
import { useGame } from "~/context/game";
import { usePlayer } from "~/context/player";

export default function Home() {
  const { setCode, setGameId, setStage, setPlayers, setChronometer } = useGame();
  const { clearPlayer } = usePlayer();

  useEffect(() => {
    // Clear all stored session state when landing on home
    setCode(null);
    setGameId(null);
    setStage(0);
    setPlayers([]);
    setChronometer(null);
    clearPlayer();
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("workshop:game");
        window.sessionStorage.removeItem("workshop:player");
      }
    } catch {}
  }, []);
  return (
    <>
      <img src="/assets/world_map.svg" className="background-image" alt="Background" />
      <div className="home-page-container">
        <img src="/assets/logo.svg" className="logo" alt="Logo" />
        <JoinParty />
        <CreateParty />
      </div>
    </>
  );
}
