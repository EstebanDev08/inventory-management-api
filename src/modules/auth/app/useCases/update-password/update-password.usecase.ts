import { GetUserByIduseCase } from '#src/modules/user/app/usecases/get-by-id/get-by-id.usecase';
import { UpdateUserUseCase } from '#src/modules/user/app/usecases/update/update.usecase';
import { ValidateUserPasswordUseCase } from '#src/modules/user/app/usecases/validate-password/validate-password.usecase';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';

import { UpdatePasswordCommand } from './update-password.command';

@injectable()
export class UpdatePasswordUseCase {
  constructor(
    private readonly validateUserPasswordUseCase: ValidateUserPasswordUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIduseCase,
  ) {}

  async run(command: UpdatePasswordCommand): Promise<void> {
    await this.getUserByIdUseCase.run({ id: command.authUser.sub });

    const { isMatching } = await this.validateUserPasswordUseCase.run({
      user_id: command.authUser.sub,
      password: command.currentPassword,
    });

    if (!isMatching) {
      throw new UnautorizedError('Cannot update password');
    }

    const isSamePassword = await this.validateUserPasswordUseCase.run({
      user_id: command.authUser.sub,
      password: command.newPassword,
    });

    if (isSamePassword.isMatching) {
      throw new UnautorizedError('Cannot update password');
    }

    await this.updateUserUseCase.run({
      id: command.authUser.sub,
      password: command.newPassword,
    });
  }
}
