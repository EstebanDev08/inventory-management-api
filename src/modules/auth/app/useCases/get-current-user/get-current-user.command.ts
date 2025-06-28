import { AuthenticatedCommand } from '#src/shared/commands/authCommand.command';

export class GetCurrentUserCommand extends AuthenticatedCommand {
  // No necesita propiedades adicionales, solo el authUser del token
}
