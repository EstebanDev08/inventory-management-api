import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from '#src/modules/auth/app/services/auth.service';
import { LoginUseCase } from '#src/modules/auth/app/useCases/login/login.usecase';
import { IJwtRepository } from '#src/modules/auth/domain/jwt.repository';
import { UserModule } from '#src/modules/user/infrastructure/interface/http/user.module';

import { JwtRepository } from '../../repositories/jwt.imp';

import { LoginController } from './controller/login.controller';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [
    { provide: IJwtRepository, useClass: JwtRepository },
    AuthService,
    LoginUseCase,
    RolesGuard,
    JwtGuard,
  ],
  controllers: [LoginController],
  exports: [IJwtRepository],
})
export class AuthModule {}
