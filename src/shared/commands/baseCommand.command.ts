import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';

import { ValidationErrorMetadata } from '../errors/validationError';

import { CommandError } from './command.error';

function flattenErrors(errors: ValidationError[]): ValidationErrorMetadata {
  return errors.flatMap((item) => {
    if (!item.constraints) {
      return [];
    }

    return {
      property: item.property,
      value: item.value,
      errors: Object.values(item.constraints),
    };
  });
}

export abstract class BaseCommand {
  static create<T extends BaseCommand>(this: new (...args: unknown[]) => T, data: T): T {
    const convertedObject = plainToInstance<T, unknown>(this, {
      ...data,
    });

    const errors = validateSync(convertedObject);

    const metadataError = flattenErrors(errors);

    if (metadataError.length > 0) {
      throw new CommandError('Validation error: invalid values', metadataError);
    }

    return convertedObject;
  }
}
