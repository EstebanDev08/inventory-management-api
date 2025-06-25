import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from '#src/modules/auth/app/dto/login.dto';
import { PasswordResetCommand } from '#src/modules/auth/app/useCases/password-reset/password-reset.command';
import { PasswordResetUseCase } from '#src/modules/auth/app/useCases/password-reset/password-reset.usecase';

import { InPasswordResetBodyDto } from '../../../schemas/password-reset.schema';

@Controller('auth')
export class PasswordResetController {
  constructor(private readonly passwordReset: PasswordResetUseCase) {}

  @Post('/password/reset')
  async run(@Body() body: InPasswordResetBodyDto): Promise<LoginDto> {
    const command = PasswordResetCommand.create({
      token: body.token,
      password: body.password,
    });

    return this.passwordReset.run(command);
  }
}
