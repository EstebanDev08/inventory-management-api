import { CustomerProfile } from '#src/modules/user/domain/entities/customerProfile.entity';
import { UserRole } from '#src/modules/user/domain/entities/user.entity';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { ITransactionService } from '#src/shared/database/transaction.interface';
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { CreateUserService } from '../../service/create-user.service';

import { CreateCustomerCommand } from './create-customer.command';
import { CreateCustomerDTO } from './out-create-customer.dto';

@injectable()
export class CreateCustomerUseCase {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly transaction: ITransactionService,
    private readonly UserRepo: IUserRepository,
  ) {}

  async run(command: CreateCustomerCommand): Promise<CreateCustomerDTO> {
    return this.transaction.startTransaction(async (tx) => {
      const newUser = await this.createUserService.run(
        {
          email: command.email,
          name: command.name,
          password: command.password,
          role: UserRole.CUSTOMER,
        },
        tx,
      );

      const newProfile = new CustomerProfile(newUser.id, command.shipping_address);

      await this.UserRepo.createCustomerProfile(newProfile);

      return CreateCustomerDTO.fromEntity(newUser, newProfile);
    });
  }
}
