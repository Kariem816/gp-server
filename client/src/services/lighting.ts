import { get } from "./api";
import type { APIQuery } from "~/types/query";
export type LightSpot = {
    id: number;
    state: boolean;
    location: string;
}
export async function getAllLamps(query: APIQuery = {}): Promise<PaginatedResponse<LightSpot>> {
    return get("/lighting", query);
}