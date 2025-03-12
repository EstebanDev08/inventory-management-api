import { SellerProfile } from '#src/modules/user/domain/entities/sellerProfile.entity';
import { UserRole } from '#src/modules/user/domain/entities/user.entity';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { ITransactionService } from '#src/shared/database/transaction.interface';
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { CreateUserService } from '../../service/create-user.service';

import { CreateSellerCommand } from './create-seller.command';
import { CreateSellerDTO } from './out-create-seller.dto';

@injectable()
export class CreateSellerUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly transaction: ITransactionService,
    private readonly createUserService: CreateUserService,
  ) {}

  async run(command: CreateSellerCommand): Promise<CreateSellerDTO> {
    return this.transaction.startTransaction(async (tx) => {
      const newUser = await this.createUserService.run(
        {
          email: command.email,
          name: command.name,
          password: command.password,
          role: UserRole.SELLER,
        },
        tx,
      );

      const newSellerProfile = new SellerProfile(
        newUser.id,
        command.store_name,
        command.store_description,
      );

      await this.userRepository.createSellerProfile(newSellerProfile, tx);

      return CreateSellerDTO.fromEntity(newUser, newSellerProfile);
    });
  }
}
