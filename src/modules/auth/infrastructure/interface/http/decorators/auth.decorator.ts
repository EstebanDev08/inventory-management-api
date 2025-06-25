import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtGuard, RolesGuard));
}

// Decorador para obtener el usuario actual
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedUser } from '#src/modules/auth/domain/jwt.repository';
import { UserRole } from '#src/modules/user/domain/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return {
      sub: request.user.sub,
      email: request.user.email,
      roles: request.user.roles,
    };
  },
);
