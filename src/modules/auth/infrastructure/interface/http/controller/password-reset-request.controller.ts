import { Body, Controller, Post } from '@nestjs/common';

import { InPasswordResetRequestBodyDto } from '../../../schemas/password-reset-request.schema';

import { PasswordResetRequestDto } from '#auth/app/dto/password-reset-request.dto';
import { PasswordResetRequetCommand } from '#auth/app/useCases/password-reset-request/password-reset-request.command';
import { PasswordResetRequestUseCase } from '#auth/app/useCases/password-reset-request/password-reset-requet.usecase';

@Controller('auth')
export class PasswordResetRequestRequestController {
  constructor(private readonly passwordResetRequest: PasswordResetRequestUseCase) {}

  @Post('/request/password/reset')
  async run(@Body() body: InPasswordResetRequestBodyDto): Promise<PasswordResetRequestDto> {
    const command = PasswordResetRequetCommand.create({
      email: body.email,
    });

    return this.passwordResetRequest.run(command);
  }
}
