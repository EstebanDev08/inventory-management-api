import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import {
  BaseError,
  ConflictError,
  NotFoundError,
  UnautorizedError,
  ValidationError,
} from '#src/shared/errors';
import { BadRequestError } from '#src/shared/errors/BadRequest.error';
import { ForbiddenError } from '#src/shared/errors/forbidden.error';

@Catch(BaseError)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: BaseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof ValidationError) {
      statusCode = HttpStatus.UNPROCESSABLE_ENTITY; // 422
    }

    if (exception instanceof ConflictError) {
      statusCode = HttpStatus.CONFLICT; // 409
    }
    if (exception instanceof UnautorizedError) {
      statusCode = HttpStatus.UNAUTHORIZED; // 401
    }
    if (exception instanceof NotFoundError) {
      statusCode = HttpStatus.NOT_FOUND; // 404
    }

    if (exception instanceof ForbiddenError) {
      statusCode = HttpStatus.FORBIDDEN; // 403
    }

    if (exception instanceof BadRequestError) {
      statusCode = HttpStatus.BAD_REQUEST; // 400
    }

    /*  
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
