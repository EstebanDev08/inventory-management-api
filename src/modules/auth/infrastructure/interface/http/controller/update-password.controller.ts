import { Body, Controller, Post } from '@nestjs/common';

import { UpdatePasswordCommand } from '#src/modules/auth/app/useCases/update-password/update-password.command';
import { UpdatePasswordUseCase } from '#src/modules/auth/app/useCases/update-password/update-password.usecase';
import { AuthenticatedUser } from '#src/modules/auth/domain/jwt.repository';

import { UpdatePasswordBodyDto } from '../../../schemas/update-password.schema';
import { Auth, CurrentUser } from '../decorators/auth.decorator';

@Controller('auth')
export class UpdatePasswordController {
  constructor(private readonly updatePasswordUseCase: UpdatePasswordUseCase) {}

  @Post('/update-password')
  @Auth()
  async updatePassword(
    @Body() body: UpdatePasswordBodyDto,
    @CurrentUser() authUser: AuthenticatedUser,
  ): Promise<void> {
    const command = UpdatePasswordCommand.create({
      authUser,
      currentPassword: body.current_password,
      newPassword: body.new_password,
    });

    await this.updatePasswordUseCase.run(command);
  }
}
