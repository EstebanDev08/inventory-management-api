/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetUserByEmailuseCase } from '#src/modules/user/app/usecases/get-by-email/get-by-email.usecase';
import { ValidateUserPasswordUseCase } from '#src/modules/user/app/usecases/validate-password/validate-password.usecase';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';

import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth.service';

import { LoginCommand } from './login.command';
@injectable()
export class LoginUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly validateUserPasswordUseCase: ValidateUserPasswordUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailuseCase,
  ) {}

  async run(command: LoginCommand): Promise<LoginDto> {
    try {
      const user = await this.getUserByEmailUseCase.run({ email: command.email });

      const { isMatching } = await this.validateUserPasswordUseCase.run({
        password: command.password,
        user_id: user.id,
      });

      if (!isMatching) {
        //Todo: Implementar un mecanismo de bloqueo de cuenta por intentos fallidos
        throw new UnautorizedError('Incorrect email or password provided');
      }

      const { token, expiresIn } = this.authService.generateUserToken(user);
      const refreshToken = this.authService.generateRefreshToken({ id: user.id });

      return new LoginDto(token, refreshToken, expiresIn);
    } catch (error) {
      await this.applyRandomDelay();

      throw new UnautorizedError('Incorrect email or password provided');
    }
  }

  private async applyRandomDelay(): Promise<void> {
    const delayMs = Math.floor(Math.random() * 20) + 90; // 90-110ms
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
