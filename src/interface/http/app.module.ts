import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { MyZodValidationPipe } from './pipes/zod-validation.pipe';

import { AuthModule } from '#auth/infrastructure/interface/http/auth.module';
import { UserModule } from '#user/infrastructure/interface/http/user.module';

@Module({
  imports: [UserModule, AuthModule],
  providers: [{ provide: APP_PIPE, useClass: MyZodValidationPipe }],
})
export class AppModule {}
