import { BaseError } from './base.error';

export abstract class ConflictError extends BaseError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'CONFLICT', metadata);
  }
}
