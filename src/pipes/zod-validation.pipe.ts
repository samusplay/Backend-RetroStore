import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      const errors = result.error.flatten();
      throw new BadRequestException({
        message: 'Error de validación',
        errors: errors.fieldErrors ?? errors.formErrors,
      });
    }
    return result.data;
  }
}