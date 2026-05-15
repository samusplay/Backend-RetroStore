import z from 'zod';
import { Condition } from '../entities/product.entity';

export const updateProductSchema = z.object({
    price: z
        .number({ error: 'El precio debe ser un número' })
        .positive('El precio debe ser mayor a cero')
        .optional(),

    description: z
        .string()
        .min(5, 'La descripción debe ser más detallada')
        .max(1000)
        .optional(),

    condition: z
        .enum([Condition.NUEVO, Condition.USADO], {
            error: 'La condición debe ser NUEVO o USADO',
        })
        .optional(),

        //Tiene el campo optional porque puede ser que el usario no lo envie
    youtubeUrl: z
        .string()
        .url('Debe ser una URL válida')
        .optional()
        
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;