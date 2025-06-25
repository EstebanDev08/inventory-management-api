import { BaseError } from './base.error';

export class ForbiddenError extends BaseError {
  constructor(action: string) {
    super(`User does not have permission to ${action}`, 'NOT_HAVE_PERMISSION', { action });
  }
}
