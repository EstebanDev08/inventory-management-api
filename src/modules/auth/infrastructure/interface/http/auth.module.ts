import { Module } from '@nestjs/common';

import { AuthService } from '#src/modules/auth/app/services/auth.service';
import { LoginUseCase } from '#src/modules/auth/app/useCases/login/login.usecase';
import { IJwtRepository } from '#src/modules/auth/domain/jwt.repository';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { UserModule } from '#src/modules/user/infrastructure/interface/http/user.module';
import { InMemoryRepository } from '#src/modules/user/infrastructure/repositories/in-memory-user.respository';
import { EncryptImpl, IEncryptor } from '#src/shared/utils/index';

import { JwtRepository } from '../../repositories/jwt.imp';

import { LoginController } from './controller/login.controller';
@Module({
  imports: [UserModule],
  providers: [
    { provide: IJwtRepository, useClass: JwtRepository },
    { provide: IUserRepository, useExisting: InMemoryRepository },
    { provide: IEncryptor, useClass: EncryptImpl },
    AuthService,
    LoginUseCase,
  ],
  controllers: [LoginController],
})
export class AuthModule {}
