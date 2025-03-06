import { IsNotEmpty, ValidateNested } from 'class-validator';

import { User } from '#src/modules/user/domain/entities/user.entity';

import { BaseCommand } from './baseCommand.command';

export abstract class AuthenticatedCommand extends BaseCommand {
  @IsNotEmpty()
  @ValidateNested()
  public readonly authUser!: User;
}
