import { UUID } from 'crypto';

import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class GetUserByIdCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  id!: UUID;
}
