import { ConflictError } from './conflict.error';

export class ResourceAlreadyExistsError extends ConflictError {
  constructor(resource: string, value: string) {
    super(`El ${resource} ${value} ya está en uso`, { resource, value });
  }
}
