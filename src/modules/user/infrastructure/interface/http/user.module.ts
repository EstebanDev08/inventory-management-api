import { Module } from '@nestjs/common';

import { CreateUserService } from '#src/modules/user/app/service/create-user.service';
import { CreateCustomerUseCase } from '#src/modules/user/app/usecases/create-customer/create-customer.usecase';
import { CreateSellerUseCase } from '#src/modules/user/app/usecases/create-seller/create-seller.usecase';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { DrizzleTransactionService } from '#src/shared/database/drizzle/service/drizzleTransaction.service';
import { ITransactionService } from '#src/shared/database/transaction.interface';
import { EncryptImpl, IEncryptor } from '#src/shared/utils/index';

import { InMemoryRepository } from '../../repositories/in-memory-user.respository';

import { CreateCustomerController } from './controller/create-customer.controller';
import { CreateSellerController } from './controller/create-seller.controller';

@Module({
  providers: [
    DrizzleTransactionService,
    InMemoryRepository,
    EncryptImpl,
    { provide: ITransactionService, useClass: DrizzleTransactionService },
    { provide: IUserRepository, useExisting: InMemoryRepository },
    { provide: IEncryptor, useExisting: EncryptImpl },
    CreateUserService,
    CreateCustomerUseCase,
    CreateSellerUseCase,
  ],
  controllers: [CreateCustomerController, CreateSellerController],
  exports: [InMemoryRepository, EncryptImpl],
})
export class UserModule {}
