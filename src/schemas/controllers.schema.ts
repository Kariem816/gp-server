import { z } from "zod";

export const updateReconizerTokenSchema = z.object({
	token: z.string(),
});
