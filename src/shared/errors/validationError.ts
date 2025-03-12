import { BaseError } from './base.error';

export type ValidationErrorMetadata = { property: string; value: unknown; errors: string[] }[];

export class ValidationError extends BaseError {
  constructor(msg: string, code?: string, metadata?: ValidationErrorMetadata) {
    super(msg, code ?? 'VALIDATION_ERROR', {
      info: metadata,
    });
  }
}
