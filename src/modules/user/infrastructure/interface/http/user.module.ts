import { Module } from '@nestjs/common';

import { CreateUserService } from '#src/modules/user/app/service/create-user.service';
import { CreateCustomerUseCase } from '#src/modules/user/app/usecases/create-customer/create-customer.usecase';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { DrizzleTransactionService } from '#src/shared/database/drizzle/service/drizzleTransaction.service';
import { ITransactionService } from '#src/shared/database/transaction.interface';
import { EncryptImpl, IEncryptor } from '#src/shared/utils/index';

import { InMemoryRepository } from '../../repositories/in-memory-user.respository';

import { CreateCustomerController } from './create-customer.controller';

@Module({
  providers: [
    DrizzleTransactionService,
    InMemoryRepository,
    EncryptImpl,
    { provide: ITransactionService, useExisting: DrizzleTransactionService },
    { provide: IUserRepository, useExisting: InMemoryRepository },
    { provide: IEncryptor, useExisting: EncryptImpl },
    CreateUserService,
    CreateCustomerUseCase,
  ],
  controllers: [CreateCustomerController],
  exports: [CreateUserService, CreateCustomerUseCase],
})
export class UserModule {}
