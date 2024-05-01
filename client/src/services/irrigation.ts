
import { get } from "./api";
import type { APIQuery } from "~/types/query";
export type Plants = {
    id: number;
    lastUpdated: string;
    isWatering: boolean;
    type:string;
}
export async function getAllPlants(query: APIQuery = {}): Promise<PaginatedResponse<Plants>> {
    return get("/irrigation", query);
}

