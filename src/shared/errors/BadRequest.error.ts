import { BaseError } from './base.error';

export class BadRequestError extends BaseError {
  public readonly code: string;
  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'BAD_REQUEST', metadata);
    this.code = 'BAD_REQUEST';
    this.name = 'BadRequestError';
    this.metadata = metadata;
  }
}
