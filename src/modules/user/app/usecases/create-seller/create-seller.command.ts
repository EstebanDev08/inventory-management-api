import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class CreateSellerCommand extends BaseCommand {
  @IsNotEmpty()
  @IsString()
  public readonly name!: string;

  @IsNotEmpty()
  @IsEmail()
  public readonly email!: string;

  @IsNotEmpty()
  @IsString()
  public readonly password!: string;

  @IsNotEmpty()
  @IsString()
  public readonly store_name!: string;

  @IsNotEmpty()
  @IsString()
  public readonly store_description!: string;
}
