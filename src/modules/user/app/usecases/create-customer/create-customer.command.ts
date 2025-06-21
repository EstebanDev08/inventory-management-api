import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class CreateCustomerCommand extends BaseCommand {
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  readonly password!: string;

  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @IsNotEmpty()
  @IsString()
  readonly shipping_address!: string;
}
