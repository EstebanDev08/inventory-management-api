import { Injectable } from '@nestjs/common';

import { GetUserByIduseCase } from '#src/modules/user/app/usecases/get-by-id/get-by-id.usecase';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';

import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth.service';

import { RefreshTokenCommand } from './refresh-token.command';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly getUserById: GetUserByIduseCase,
  ) {}

  async run(command: RefreshTokenCommand): Promise<LoginDto> {
    const payload = this.authService.verifyRefreshToken(command.refreshToken);

    if (!payload || !payload.sub) {
      throw new UnautorizedError('Invalid refresh token');
    }

    const user = await this.getUserById.run({ id: payload.sub });

    const { token: accessToken, expiresIn } = this.authService.generateUserToken(user);

    const refreshToken = this.authService.generateRefreshToken({ id: user.id });

    return new LoginDto(accessToken, refreshToken, expiresIn);
  }
}
