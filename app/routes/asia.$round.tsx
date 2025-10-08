import React, { useRef, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import "../styles/asia.css";
import Header from "../components/layout/Header";
import AsiaRound from "../components/continents/asie/AsiaRound";

export default function AsiaScreen() {
  const { round } = useParams<{ round: string }>();
  const roundNumber = round ? parseInt(round, 10) : 0;

  return (
    <>
      <Header title="- Asie : Pollution de l'air" />
      {roundNumber == 1 && <AsiaRound/>}
    </>
  )
}
