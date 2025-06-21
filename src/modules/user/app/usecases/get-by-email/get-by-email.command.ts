import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class GetUserByEmailCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
