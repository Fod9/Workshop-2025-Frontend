import type { PartyPlayer } from "./player";

export type PartySummary = {
    code: string;
    name: string;
    host_name: string;
    players: PartyPlayer[];
    id: string;
    stage: number;
}

