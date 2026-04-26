import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T>) {}

  transform(value: unknown, metadata: ArgumentMetadata): T {
    // 🔍 DEBUG: Esto DEBE aparecer en tu consola negra si el pipe funciona
    console.log('--- ¡EL PIPE DE ZOD ESTÁ TRABAJANDO! ---');
    console.log('Datos que llegaron:', value);

    try {
      // Validamos directamente lo que sea que llegue
      return this.schema.parse(value);
    } catch (error: any) {
      // Si Zod encuentra un error, lanzamos el 400
      throw new BadRequestException({
        message: 'Error de validación (Zod)',
        errors: error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
  }
}