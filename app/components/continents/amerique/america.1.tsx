import Header from "~/components/layout/Header";
import "~/styles/america.css";

export default function AmericaRound1() {
  return (
    <>
      <Header title="- Amérique : Surproduction et déchets" />
      <main className="america-screen asia-clues">
        <div className="container">
          <img className="asia-clues-image" src="/assets/asia_clues_2.svg" alt="Clues" />
        </div>
      </main>
    </>
  );
}

