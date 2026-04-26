import { z } from 'zod';

export const createProductSchema = z.object({
    //con z string validamos campos gracias a zod
    name: z.string({
        error: 'El nombre del producto es obligatorio'
    })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(150, 'El nombre es demasiado largo'),
    code: z.string({
        error: 'La descripción es obligatoria',
    })
        .min(5, 'La descripción es muy corta, añade más detalles'),

    description: z.string()
        .min(5, 'La descripción debe ser más detallada')
        .max(1000),

    price: z.number({
        error: 'El precio es obligatorio y debe ser un número',
    })
        .positive('El precio debe ser mayor a cero'),
    imageId: z.string().optional()
});

//exportamos el type
export type CreateProductDto = z.infer<typeof createProductSchema>