import { GetUserByIduseCase } from '#src/modules/user/app/usecases/get-by-id/get-by-id.usecase';
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { CurrentUserDto } from '../../dto/current-user.dto';

import { GetCurrentUserCommand } from './get-current-user.command';

@injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly getUserByIdUseCase: GetUserByIduseCase) {}

  async run(command: GetCurrentUserCommand): Promise<CurrentUserDto> {
    const user = await this.getUserByIdUseCase.run({ id: command.authUser.sub });

    return new CurrentUserDto(user.id, user.name, user.email, user.roles);
  }
}
