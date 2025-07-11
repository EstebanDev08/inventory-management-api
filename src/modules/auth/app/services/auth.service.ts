import { UUID } from 'crypto';

import { UserRole } from '#src/modules/user/domain/entities/user.entity';
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { IJwtRepository } from '../../domain/jwt.repository';

@injectable()
export class AuthService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  generateUserToken(user: { id: UUID; email: string; roles: UserRole[] }): string {
    return this.jwtRepository.sign({
      sub: user.id,
      email: user.email,
      roles: user.roles,
    }).token;
  }

  generatePasswordResetToken(id: string): string {
    return this.jwtRepository.sign({ id, type: 'password-reset' }, 600).token;
  }

  verifyPasswordResetToken(token: string): { id: UUID; type: string } {
    return this.jwtRepository.verify<{ id: UUID; type: string }>(token);
  }
}
