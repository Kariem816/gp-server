import { z } from "zod";

export const querySchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().optional(),
	search: z.string().optional(),
	sort: z.string().optional(),
	order: z.enum(["asc", "desc"]).optional(),
});
