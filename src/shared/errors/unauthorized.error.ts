export class UnautorizedError extends Error {
  public readonly code: string;
  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = 'UNAUTHORIZED';
    this.metadata = metadata;
  }
}
