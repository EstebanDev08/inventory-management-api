import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';
import { IEncryptor } from '#src/shared/utils/index';

import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth.service';

import { LoginCommand } from './login.command';
@injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encryptor: IEncryptor,
    private readonly authService: AuthService,
  ) {}

  async run(command: LoginCommand): Promise<LoginDto> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      const maxWaitTime = 110;
      const minWaitTime = 90;
      const randomWaitTime = Math.floor(Math.random() * (maxWaitTime - minWaitTime) + minWaitTime);
      await new Promise((resolve) => {
        setTimeout(resolve, randomWaitTime);
      });

      throw new UnautorizedError('Incorrect email or password provided', {
        email: command.email,
      });
    }

    const isMatching = await this.encryptor.compare(command.password, user.password);
    if (!isMatching) {
      //Todo: Implementar un mecanismo de bloqueo de cuenta por intentos fallidos
      throw new UnautorizedError('Incorrect email or password provided');
    }

    return new LoginDto(this.authService.generateUserToken(user));
  }
}
