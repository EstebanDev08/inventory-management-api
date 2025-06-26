import jwt, {
  JsonWebTokenError,
  SignOptions,
  TokenExpiredError,
  VerifyOptions,
} from 'jsonwebtoken';

import { injectable } from '#src/shared/decorator/injectable.decorator';
import { enviroment } from '#src/shared/enviroment';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';

import { IJwtRepository } from '../../domain/jwt.repository';

@injectable()
export class JwtRepository implements IJwtRepository {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly refreshSecret: string;
  private readonly verifyOptions: VerifyOptions;

  constructor() {
    this.privateKey = (enviroment.APP.JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n');
    this.publicKey = (enviroment.APP.JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n');
    this.refreshSecret = enviroment.APP.JWT_REFRESH_SECRET;
    this.verifyOptions = { algorithms: ['RS256'] };
  }

  sign(
    claims: Record<string, unknown>,
    expiresInSeconds?: number,
  ): { token: string; expiresIn: number } {
    try {
      // Usa el valor personalizado o el default
      const expiresIn = expiresInSeconds ?? 3600;

      const signOptions: SignOptions = {
        algorithm: 'RS256',
        expiresIn: expiresIn,
      };

      const token = jwt.sign(claims, this.privateKey, signOptions);
      return { token, expiresIn };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to sign JWT: ${errorMessage}`);
    }
  }

  verify<T = unknown>(token: string): T {
    try {
      return jwt.verify(token, this.publicKey, this.verifyOptions) as T;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnautorizedError('Authentication token has expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnautorizedError('Invalid authentication token');
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new UnautorizedError(`Authentication error: ${errorMessage}`);
    }
  }

  generateRefreshToken(payload: Record<string, unknown>): string {
    try {
      return jwt.sign(payload, this.refreshSecret, {
        expiresIn: '7d',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to generate refresh token: ${errorMessage}`);
    }
  }

  verifyRefreshToken<T>(token: string): T {
    try {
      return jwt.verify(token, this.refreshSecret) as T;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnautorizedError('Refresh token has expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnautorizedError('Invalid refresh token');
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new UnautorizedError(`Refresh token error: ${errorMessage}`);
    }
  }
}
