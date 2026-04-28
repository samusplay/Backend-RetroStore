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

  // PASO 1: Agregamos el campo como URL y Opcional
  youtubeUrl: z.string()
    .url({ message: 'Debe ser una URL válida (ej: https://youtube.com/...)' })
    .optional()
    .or(z.literal('')), // Útil por si el frontend de React manda un string vacío "" en vez de un null/undefined
})
  // PASO 2: MAGIA DE ZOD (Validación cruzada entre campos)
  .refine((data) => {
    // Si hay una URL escrita, pero la categoría NO es VINILO -> Falla la validación
    if (data.youtubeUrl && data.youtubeUrl.trim() !== '' && data.category !== Category.VINILO) {
      return false;
    }
    return true;
  }, {
    message: "Error de lógica: Solo la categoría VINILO puede tener una URL de YouTube.",
    path: ["youtubeUrl"] // Esto hace que el mensaje de error se asocie directamente al input de youtubeUrl en el frontend

  });

//inferimos el type
export type CreateProductDto = z.infer<typeof createProductSchema>;

