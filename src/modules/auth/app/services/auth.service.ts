import { UUID } from 'crypto';

import { injectable } from '#src/shared/decorator/injectable.decorator';

import { IJwtRepository } from '../../domain/jwt.repository';

@injectable()
export class AuthService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  generateUserToken(user: { id: UUID; email: string; role: string }): string {
    return this.jwtRepository.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }).token;
  }
}
