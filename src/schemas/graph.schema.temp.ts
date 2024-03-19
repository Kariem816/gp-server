import { z } from "zod";

export const createGraphSchema = z.object({
	label: z.string(),
	xLabel: z.string(),
	yLabel: z.string(),
});

export const updateGraphSchema = z.object({
	value: z.number(),
});
