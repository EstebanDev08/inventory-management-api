import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { UserModule } from '#src/modules/user/infrastructure/interface/http/user.module';

import { MyZodValidationPipe } from './pipes/zod-validation.pipe';

@Module({
  imports: [UserModule],
  providers: [{ provide: APP_PIPE, useClass: MyZodValidationPipe }],
})
export class AppModule {}
