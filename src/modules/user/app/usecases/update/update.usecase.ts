import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { NotFoundError } from '#src/shared/errors/notFound.error';
import { IEncryptor } from '#src/shared/utils/index';

import { GetUserDto } from '../../dto/get-user.dto';

import { UpdateUserCommand } from './update.command';

@injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptor: IEncryptor,
  ) {}

  async run(command: UpdateUserCommand): Promise<GetUserDto> {
    const foundUser = await this.userRepository.findById(command.id);
    if (!foundUser) {
      throw new NotFoundError('user', { id: command.id });
    }

    const updatedUser = foundUser.update({
      email: command.email,
      name: command.name,
      password: command.password ? await this.encryptor.encrypt(command.password) : undefined,
    });

    await this.userRepository.update(updatedUser);

    return GetUserDto.fromEntity(updatedUser);
  }
}
