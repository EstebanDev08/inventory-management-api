import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtGuard, RolesGuard));
}

// Decorador para obtener el usuario actual
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserRole } from '#src/modules/user/domain/entities/user.entity';

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
