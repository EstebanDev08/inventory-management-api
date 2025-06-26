import { IsNotEmpty, ValidateNested } from 'class-validator';

import { AuthenticatedUser } from '#src/modules/auth/domain/jwt.repository';

import { BaseCommand } from './baseCommand.command';

export abstract class AuthenticatedCommand extends BaseCommand {
  @IsNotEmpty()
  @ValidateNested()
  public readonly authUser!: AuthenticatedUser;
}
