import { IsEmail, IsNotEmpty } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class PasswordResetRequetCommand extends BaseCommand {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
