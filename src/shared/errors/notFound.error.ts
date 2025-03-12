import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(name: string, metadata?: Record<string, unknown>) {
    super(`${name} not found`, 'NOT_FOUND', {
      ...metadata,
      entity: name,
    });
  }
}
