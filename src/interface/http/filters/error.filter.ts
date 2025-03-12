import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { BaseError } from '#src/shared/errors/base.error';
import { ValidationError } from '#src/shared/errors/validationError';

@Catch(BaseError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // 422
    }
    /*  if (exception instanceof UnauthorizedError) {
      statusCode = HttpStatus.UNAUTHORIZED; // 401
    }
    if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND; // 404
    }
    if (exception instanceof ForbiddenError) {
      statusCode = HttpStatus.FORBIDDEN; // 403
    }
    if (exception instanceof BusinessLogicError) {
      statusCode = HttpStatus.BAD_REQUEST; // 400
    }*/

    response.status(statusCode).send({
      statusCode,
      code: exception.code,
      error: exception.message,
      metadata: exception.metadata || {},
    });
  }
}
