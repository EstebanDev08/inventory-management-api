import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class CreateCustomerCommand extends BaseCommand {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly shipping_address!: string;
}
