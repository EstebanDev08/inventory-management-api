import { ITransaction } from '#src/shared/database/transaction.interface';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { ResourceAlreadyExistsError } from '#src/shared/errors/resourceAlreadyExists.error';
import { IEncryptor, UuidHandler } from '#src/shared/utils/index';

import { User, UserRole } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/user.repository';

@injectable()
export class CreateUserService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly encryptor: IEncryptor,
  ) {}

  async run(
    data: { name: string; email: string; password: string; role: UserRole },
    tx: ITransaction,
  ): Promise<User> {
    const foundUser = await this.userRepo.findByEmail(data.email);

    if (foundUser) {
      if (foundUser.email === data.email) {
        throw new ResourceAlreadyExistsError('email', data.email);
      }
    }

    const hashedPassword = await this.encryptor.encrypt(data.password);

    const user = User.create({
      email: data.email,
      id: UuidHandler.newUuid(),
      name: data.name,
      password: hashedPassword,
      roles: [data.role],
    });

    await this.userRepo.create(user, tx);
    return user;
  }
}
