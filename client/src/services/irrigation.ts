
import { get } from "./api";
import type { APIQuery } from "~/types/query";
export type Plants = {
    id: string;
    lastUpdated: number;
    isWatering: boolean;
    type:string;
}
export async function getAllPlants(query: APIQuery = {}): Promise<APIResponse<Plants[]>> {
    return get("/irrigation", query);
}

