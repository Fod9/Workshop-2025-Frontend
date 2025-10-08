import Header from "~/components/layout/Header";
import "~/styles/asia.css";
import AsiaRound from "./AsiaRound";

export default function AsieRound1({ round }: { round: string | undefined }) {
  return (
    <>
      <Header title="- Asie : Pollution de l'air" />
      <AsiaRound />
    </>
  );
}

