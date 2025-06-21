import { injectable } from '#src/shared/decorator/injectable.decorator';

import { IJwtRepository } from '../../domain/jwt.repository';

import { User } from '#user/domain/entities/user.entity';

@injectable()
export class AuthService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  generateUserToken(user: User): string {
    return this.jwtRepository.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    }).token;
  }
}
