import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

import { ValidationError } from '#src/shared/errors/validationError';

function transformErrors(
  errors: ZodError,
): { property: string; value: unknown; errors: string[] }[] {
  const resultMap: { [key: string]: { property: string; value: unknown; errors: string[] } } = {};

  errors.issues.forEach((error) => {
    const property = error.path.join('.');

    // Comprobar si la propiedad `received` existe en el error
    if ('received' in error) {
      // Si existe, procesamos el error
      const value = error.received;
      if (resultMap[property]) {
        resultMap[property].errors.push(error.message);
      } else {
        resultMap[property] = {
          property: property,
          value: value,
          errors: [error.message],
        };
      }
    } else {
      // Si no existe `received`, lo manejamos de otra manera, por ejemplo:
      if (resultMap[property]) {
        resultMap[property].errors.push(error.message);
      } else {
        resultMap[property] = {
          property: property,
          value: null, // o algún valor por defecto
          errors: [error.message],
        };
      }
    }
  });

  // Convertir el mapa a un array de resultados
  return Object.values(resultMap);
}

export const MyZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) =>
    new ValidationError('error in the scheme', 'SCHEMA_VALIDATION_ERROR', transformErrors(error)),
});
