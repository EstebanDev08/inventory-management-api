import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

import { AuthenticatedCommand } from '#src/shared/commands/authCommand.command';

export class UpdatePasswordCommand extends AuthenticatedCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  currentPassword!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  newPassword!: string;
}
