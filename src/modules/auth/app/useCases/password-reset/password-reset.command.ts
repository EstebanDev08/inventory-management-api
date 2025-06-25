import { IsDefined, IsJWT, IsNotEmpty, IsString } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class PasswordResetCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsJWT()
  token!: string;
}
