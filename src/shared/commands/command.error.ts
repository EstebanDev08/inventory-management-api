import { ValidationError, ValidationErrorMetadata } from '../errors/validationError';

export class CommandError extends ValidationError {
  constructor(
    msg: string,
    readonly validationErrors: ValidationErrorMetadata,
  ) {
    super(msg, 'COMMAND_VALIDATION_ERROR', validationErrors);
    this.cause = 'Error in command property values';
  }
}
