import { useCallback, useState } from "react";
import { backendService } from "~/services/backend";

interface JoinPartyParams {
    name: string;
    joinCode: string;
}

export interface PartyPlayer {
    id: string;
    name: string;
    continent?: string;
}

export interface PartySummary {
    name: string;
    join_code: string;
    players: PartyPlayer[];
    id?: string;
    stage?: number;
}

export function useJoinParty() {
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const joinParty = useCallback(async (params: JoinPartyParams) => {
        setIsJoining(true);
        setError(null);

        try {
            const payload = await backendService.post<unknown>("/game/join", {
                name: params.name.trim(),
                join_code: params.joinCode.trim(),
            });

            const party = normalisePartyResponse(payload, params);

            if (!party.players.some((player) => player.name === party.join_code)) {
                party.players.unshift({ id: "host", name: party.join_code, continent: "Europe" });
            }

            return party;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsJoining(false);
        }
    }, []);

    return { joinParty, isJoining, error };
}

function normalisePartyResponse(raw: unknown, params: JoinPartyParams): PartySummary {
    if (!raw || typeof raw !== "object") {
        throw new Error("Réponse inattendue du serveur");
    }

    const candidate = raw as Record<string, unknown>;
    const details = resolvePartyDetails(candidate);

    if (!details) {
        throw new Error("La création de la partie n'a pas retourné d'information valide");
    }

    const code = getString(
        details.join_code ??
        details.code ??
        candidate.join_code ??
        candidate.code
    );
    const name = (getString(details.name ?? candidate.name) ?? params.name).trim();
    const joinCode = (
        getString(
            details.join_code ??
                details.joinCode ??
                candidate.join_code ??
                candidate.joinCode
        ) ?? params.joinCode
    ).trim();
    const stage = getNumber(details.stage ?? candidate.stage);
    const id = getString(details.id ?? candidate.id);

    if (!name) {
        throw new Error("Le nom du joueur est manquant");
    }
    if (!joinCode) {
        throw new Error("Le code de la partie est manquant");
    }

    const players = normalisePlayers(
        details,
        candidate,
        toRecord(candidate.data),
        toRecord(candidate.party)
    );

    return {
        name,
        join_code: joinCode,
        players,
        id,
        stage,
    };
}

function resolvePartyDetails(candidate: Record<string, unknown>): Record<string, unknown> | null {
    const sources: unknown[] = [
        candidate.data,
        candidate.party,
        candidate.result,
        candidate.payload,
        candidate,
    ];

    for (const source of sources) {
        if (!source || typeof source !== "object") {
            continue;
        }

        const record = source as Record<string, unknown>;

        if (hasPartyShape(record)) {
            return record;
        }
    }

    return null;
}

function getString(value: unknown): string | undefined {
    if (typeof value === "string") {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }
    return undefined;
}

function getNumber(value: unknown): number | undefined {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}

function toRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalisePlayers(
    ...sources: Array<Record<string, unknown> | null>
): PartyPlayer[] {
    const candidateArray = findFirstArray(
        ...sources,
    );

    if (!candidateArray) {
        return [];
    }

    return candidateArray
        .map((entry, index) => {
            if (!entry || typeof entry !== "object") {
                return null;
            }

            const record = entry as Record<string, unknown>;
            const name = getString(
                record.name ??
                record.username ??
                record.displayName ??
                record.fullName ??
                record.playerName
            );

            if (!name) {
                return null;
            }

            const id = getString(record.id ?? record._id ?? record.code ?? `${index}`) ?? `${index}`;

            return { id, name } as PartyPlayer;
        })
        .filter((player): player is PartyPlayer => player !== null);
}

function findFirstArray(
    ...sources: Array<Record<string, unknown> | null>
): unknown[] | null {
    const candidateKeys = ["players", "participants", "members", "users", "list"];

    for (const source of sources) {
        if (!source) {
            continue;
        }

        for (const key of candidateKeys) {
            const maybe = source[key];
            if (Array.isArray(maybe)) {
                return maybe;
            }
        }
    }

    return null;
}

function hasPartyShape(record: Record<string, unknown>): boolean {
    return (
        "join_code" in record ||
        "code" in record ||
        "name" in record ||
        "join_code" in record ||
        Array.isArray(record.players) ||
        Array.isArray(record.participants)
    );
}
