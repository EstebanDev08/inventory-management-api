import { IsNotEmpty, IsString } from 'class-validator';

import { BaseCommand } from '#src/shared/commands/baseCommand.command';

export class RefreshTokenCommand extends BaseCommand {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @IsString({ message: 'Refresh token must be a string' })
  readonly refreshToken!: string;
}
