import { Controller, Get } from '@nestjs/common';

import { CurrentUserDto } from '#src/modules/auth/app/dto/current-user.dto';
import { GetCurrentUserCommand } from '#src/modules/auth/app/useCases/get-current-user/get-current-user.command';
import { GetCurrentUserUseCase } from '#src/modules/auth/app/useCases/get-current-user/get-current-user.usecase';
import { AuthenticatedUser } from '#src/modules/auth/domain/jwt.repository';

import { Auth, CurrentUser } from '../decorators/auth.decorator';

@Controller('auth')
export class GetCurrentUserController {
  constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) {}

  @Get('/me')
  @Auth()
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser): Promise<CurrentUserDto> {
    const command = GetCurrentUserCommand.create({
      authUser: user,
    });

    return this.getCurrentUserUseCase.run(command);
  }
}
