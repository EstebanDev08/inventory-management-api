import { UUID } from 'crypto';

import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class UpdateUserCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  id!: UUID;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
}
