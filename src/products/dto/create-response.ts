import z from "zod";

// --- Response ---
export const createProductResponseSchema = z.object({
  message: z.string(),
  productId: z.string(),
});

export type CreateProductResponseDto = z.infer<typeof createProductResponseSchema>;