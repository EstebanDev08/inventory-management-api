import { BaseError } from './base.error';

export class UnautorizedError extends BaseError {
  public readonly code: string;
  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'UNAUTHORIZED', metadata);
    this.code = 'UNAUTHORIZED';
    this.name = 'UnauthorizedError';
    this.metadata = metadata;
  }
}
