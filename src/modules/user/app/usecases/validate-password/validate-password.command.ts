import { UUID } from 'crypto';

import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class ValidateUserPasswordCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  user_id!: UUID;

  @IsDefined()
  @IsNotEmpty()
  password!: string;
}
