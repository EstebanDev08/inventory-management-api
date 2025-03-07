import { Module } from '@nestjs/common';

import { UserService } from '../../../app/services/user.service';

import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
