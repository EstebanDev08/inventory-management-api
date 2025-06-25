// src/modules/auth/infrastructure/guards/roles.guard.ts
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { injectable } from '#src/shared/decorator/injectable.decorator';
import { ForbiddenError } from '#src/shared/errors/forbidden.error';

@injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenError('User not authenticated');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRequiredRole) {
      throw new ForbiddenError('access this resource');
    }

    return true;
  }
}
