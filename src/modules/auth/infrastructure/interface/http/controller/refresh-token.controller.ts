import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto } from '#src/modules/auth/app/dto/login.dto';
import { RefreshTokenCommand } from '#src/modules/auth/app/useCases/refresh-token/refresh-token.command';
import { RefreshTokenUseCase } from '#src/modules/auth/app/useCases/refresh-token/refresh-token.usecase';

import { InRefreshTokenBodyDto } from '../../../schemas/refesh-token.schema';

@Controller('auth')
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: InRefreshTokenBodyDto): Promise<LoginDto> {
    const command = RefreshTokenCommand.create({
      refreshToken: refreshTokenDto.refresh_token,
    });

    return this.refreshTokenUseCase.run(command);
  }
}
