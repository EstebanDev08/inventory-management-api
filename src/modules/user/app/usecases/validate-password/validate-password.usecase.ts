import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { IEncryptor } from '#src/shared/utils/index';

import { ValidateUserPasswordDto } from '../../dto/validate-password.dto';

import { ValidateUserPasswordCommand } from './validate-password.command';

@injectable()
export class ValidateUserPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly encryptor: IEncryptor,
  ) {}

  async run(command: ValidateUserPasswordCommand): Promise<ValidateUserPasswordDto> {
    const user = await this.userRepo.findById(command.user_id);
    if (!user) {
      return new ValidateUserPasswordDto(command.user_id, false);
    }

    const isMatching = await this.encryptor.compare(command.password, user.password);
    if (!isMatching) {
      return new ValidateUserPasswordDto(command.user_id, false);
    }

    return new ValidateUserPasswordDto(user.id, isMatching);
  }
}
