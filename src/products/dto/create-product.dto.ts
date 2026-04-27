import z from "zod";
import { Category, Condition } from "../entities/product.entity";

export const createProductSchema = z.object({
  name: z.string({ error: 'El nombre del producto es obligatorio' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre es demasiado largo'),

  code: z.string({ error: 'El código es obligatorio' })
    .min(2, 'El código es muy corto'),

  description: z.string()
    .min(5, 'La descripción debe ser más detallada')
    .max(1000),

  price: z.coerce.number({ error: 'El precio es obligatorio y debe ser un número' })
    .positive('El precio debe ser mayor a cero'),

  platform: z.string().min(1, 'La plataforma es obligatoria'),

  condition: z.enum(Object.values(Condition) as [string, ...string[]]),

  category: z.enum(Object.values(Category) as [string, ...string[]]),
});

//inferimos el type
export type CreateProductDto = z.infer<typeof createProductSchema>;

