import { forwardRef, Module } from '@nestjs/common';

import { AuthService } from '#src/modules/auth/app/services/auth.service';
import { LoginUseCase } from '#src/modules/auth/app/useCases/login/login.usecase';
import { PasswordResetUseCase } from '#src/modules/auth/app/useCases/password-reset/password-reset.usecase';
import { PasswordResetRequestUseCase } from '#src/modules/auth/app/useCases/password-reset-request/password-reset-requet.usecase';
import { RefreshTokenUseCase } from '#src/modules/auth/app/useCases/refresh-token/refresh-token.usecase';
import { UpdatePasswordUseCase } from '#src/modules/auth/app/useCases/update-password/update-password.usecase';
import { IJwtRepository } from '#src/modules/auth/domain/jwt.repository';
import { UserModule } from '#src/modules/user/infrastructure/interface/http/user.module';

import { JwtRepository } from '../../repositories/jwt.imp';

import { LoginController } from './controller/login.controller';
import { PasswordResetController } from './controller/password-reset.controller';
import { PasswordResetRequestRequestController } from './controller/password-reset-request.controller';
import { RefreshTokenController } from './controller/refresh-token.controller';
import { UpdatePasswordController } from './controller/update-password.controller';
import { JwtGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [
    { provide: IJwtRepository, useClass: JwtRepository },
    AuthService,
    LoginUseCase,
    RefreshTokenUseCase,
    RolesGuard,
    JwtGuard,
    PasswordResetUseCase,
    PasswordResetRequestUseCase,
    UpdatePasswordUseCase,
  ],
  controllers: [
    LoginController,
    RefreshTokenController,
    PasswordResetController,
    PasswordResetRequestRequestController,
    UpdatePasswordController,
  ],
  exports: [IJwtRepository],
})
export class AuthModule {}
