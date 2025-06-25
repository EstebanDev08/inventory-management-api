import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { NotFoundError } from '#src/shared/errors/notFound.error';

import { GetUserDto } from '../../dto/get-user.dto';

import { GetUserByIdCommand } from './get-by-id.command';

@injectable()
export class GetUserByIduseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(command: GetUserByIdCommand): Promise<GetUserDto> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundError('user', { id: command.id });
    }
    return GetUserDto.fromEntity(user);
  }
}
