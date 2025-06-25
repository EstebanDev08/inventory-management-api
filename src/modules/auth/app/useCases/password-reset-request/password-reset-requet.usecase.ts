import { GetUserByEmailuseCase } from '#src/modules/user/app/usecases/get-by-email/get-by-email.usecase';
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { PasswordResetRequestDto } from '../../dto/password-reset-request.dto';
import { AuthService } from '../../services/auth.service';

import { PasswordResetRequetCommand } from './password-reset-request.command';

@injectable()
export class PasswordResetRequestUseCase {
  constructor(
    private readonly getUserByEmail: GetUserByEmailuseCase,
    private readonly authService: AuthService,
  ) {}

  async run(command: PasswordResetRequetCommand): Promise<PasswordResetRequestDto> {
    const response = new PasswordResetRequestDto(
      true,
      'If your email is registered, you will receive a password reset link',
    );

    try {
      const user = await this.getUserByEmail.run({
        email: command.email,
      });

      const resetToken = this.authService.generatePasswordResetToken(user.id);

      return new PasswordResetRequestDto(true, resetToken);
    } catch {
      return response;
    }
  }
}
