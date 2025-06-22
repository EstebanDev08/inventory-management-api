import { Module } from '@nestjs/common';

import { CreateUserService } from '#src/modules/user/app/service/create-user.service';
import { CreateCustomerUseCase } from '#src/modules/user/app/usecases/create-customer/create-customer.usecase';
import { CreateSellerUseCase } from '#src/modules/user/app/usecases/create-seller/create-seller.usecase';
import { GetUserByEmailuseCase } from '#src/modules/user/app/usecases/get-by-email/get-by-email.usecase';
import { ValidateUserPasswordUseCase } from '#src/modules/user/app/usecases/validate-password/validate-password.usecase';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { DrizzleTransactionService } from '#src/shared/database/drizzle/service/drizzleTransaction.service';
import { ITransactionService } from '#src/shared/database/transaction.interface';
import { EncryptImpl, IEncryptor } from '#src/shared/utils/index';

import { DrizzleUserRepository } from '../../repositories/drizzle-user.repository';

import { CreateCustomerController } from './controller/create-customer.controller';
import { CreateSellerController } from './controller/create-seller.controller';

@Module({
  providers: [
    DrizzleTransactionService,
    DrizzleUserRepository,
    EncryptImpl,
    { provide: ITransactionService, useClass: DrizzleTransactionService },
    { provide: IUserRepository, useExisting: DrizzleUserRepository },
    { provide: IEncryptor, useExisting: EncryptImpl },
    CreateUserService,
    CreateCustomerUseCase,
    CreateSellerUseCase,
    GetUserByEmailuseCase,
    ValidateUserPasswordUseCase,
  ],
  controllers: [CreateCustomerController, CreateSellerController],
  exports: [GetUserByEmailuseCase, ValidateUserPasswordUseCase],
})
export class UserModule {}
