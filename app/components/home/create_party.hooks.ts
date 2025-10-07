import { backendService } from "~/services/backend";

export function useCreateParty() {
    const createParty = () => {
        backendService.post("/parties", {});
    };

    return { createParty };
}