import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class LoginCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @IsDefined()
  readonly password!: string;
}
