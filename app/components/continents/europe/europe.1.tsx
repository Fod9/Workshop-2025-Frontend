import Header from "~/components/layout/Header";
import "~/styles/europe.css";

export default function EuropeRound1() {
  return (
    <>
      <Header title="- Europe : Production d'énergie" />
      <main className="europe-screen asia-clues">
        <div className="container">
          <img className="asia-clues-image" src="/assets/asia_clues_1.svg" alt="Clues" />
        </div>
      </main>
    </>
  );
}

