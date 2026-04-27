import { z } from 'zod';

// Catálogo - minimalista
export const productCatalogResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrl: z.string().optional(),
  price: z.number(),
});

// Detalle completo
export const productDetailResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  platform: z.string(),
  condition: z.string(),
  imageUrl: z.string().optional(),
  trivia: z.string().optional(),
  seller: z.string(),
});

export type ProductCatalogResponseDto = z.infer<typeof productCatalogResponseSchema>;
export type ProductDetailResponseDto = z.infer<typeof productDetailResponseSchema>;