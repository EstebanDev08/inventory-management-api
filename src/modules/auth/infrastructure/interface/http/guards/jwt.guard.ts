/* eslint-disable @typescript-eslint/no-explicit-any */

import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { AuthenticatedUser, IJwtRepository } from '#src/modules/auth/domain/jwt.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';

@injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = this.jwtRepository.verify<AuthenticatedUser>(token);

      request.user = payload;
      return true;
    } catch {
      throw new UnautorizedError('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
