import { get } from "./api";
import type { APIQuery } from "~/types/query";
export type ParkingSlot = {
        id: number;
    isEmpty: boolean;
    location: string;
}
export async function getAllSlots(query: APIQuery = {}): Promise<APIResponse<ParkingSlot[]>> {
        return get("/parking", query);
    }