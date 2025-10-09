import Header from "~/components/layout/Header";
import "~/styles/asia.css";
import AsiaRound from "./AsiaRound";

export default function AsieRound1({ round }: { round: string | undefined }) {
  return (
    <>
      <Header title="- Continent Asie" secondTitle="Réparation de l'unité Asie (pollution de l'air)"/>
      <AsiaRound />
    </>
  );
}

