import { UpdateUserUseCase } from '#src/modules/user/app/usecases/update/update.usecase';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { BadRequestError } from '#src/shared/errors/BadRequest.error';

import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth.service';

import { PasswordResetCommand } from './password-reset.command';

@injectable()
export class PasswordResetUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  async run(command: PasswordResetCommand): Promise<LoginDto> {
    try {
      const payload = this.authService.verifyPasswordResetToken(command.token);

      if (payload.type !== 'password-reset') {
        throw new BadRequestError('Bad token provided');
      }

      const updatedUser = await this.updateUserUseCase.run({
        password: command.password,
        id: payload.id,
      });

      const { expiresIn, token } = this.authService.generateUserToken({
        id: updatedUser.id,
        email: updatedUser.email,
        roles: updatedUser.roles,
      });

      const refreshToken = this.authService.generateRefreshToken({ id: updatedUser.id });

      return new LoginDto(token, refreshToken, expiresIn);
    } catch {
      throw new BadRequestError('Bad token provided');
    }
  }
}
