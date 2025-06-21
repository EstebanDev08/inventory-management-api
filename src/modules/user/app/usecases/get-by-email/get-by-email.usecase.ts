import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { NotFoundError } from '#src/shared/errors/notFound.error';

import { GetUserDto } from '../../dto/get-user.dto';

import { GetUserByEmailCommand } from './get-by-email.command';

@injectable()
export class GetUserByEmailuseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async run(command: GetUserByEmailCommand): Promise<GetUserDto> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new NotFoundError('user', { email: command.email });
    }
    return GetUserDto.fromEntity(user);
  }
}
