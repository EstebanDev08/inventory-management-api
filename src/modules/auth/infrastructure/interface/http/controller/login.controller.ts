import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from '#src/modules/auth/app/dto/login.dto';

import { LoginBodyDto } from '../../../schemas/login.schema';

import { LoginCommand } from '#auth/app/useCases/login/login.command';
import { LoginUseCase } from '#auth/app/useCases/login/login.usecase';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/login')
  async run(@Body() createUserDto: LoginBodyDto): Promise<LoginDto> {
    const command = LoginCommand.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return this.loginUseCase.run(command);
  }
}
