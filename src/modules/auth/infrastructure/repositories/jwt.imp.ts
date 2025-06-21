import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

import { injectable } from '#src/shared/decorator/injectable.decorator';

import { IJwtRepository } from '../../domain/jwt.repository';

@injectable()
export class JwtRepository implements IJwtRepository {
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly verifyOptions: VerifyOptions;

  constructor() {
    // Claves RSA en variables de entorno, reemplazando "\n" por saltos de línea reales
    this.privateKey = (process.env.JWT_PRIVATE_KEY as string).replace(/\\n/g, '\n');
    this.publicKey = (process.env.JWT_PUBLIC_KEY as string).replace(/\\n/g, '\n');
    this.verifyOptions = { algorithms: ['RS256'] };
  }

  sign(
    claims: Record<string, unknown>,
    expiresInSeconds?: number,
  ): { token: string; expiresIn: number } {
    // Usa el valor personalizado o el default
    const expiresIn = expiresInSeconds ?? 3600;

    const signOptions: SignOptions = {
      algorithm: 'RS256',
      expiresIn: expiresIn,
    };

    const token = jwt.sign(claims, this.privateKey, signOptions);
    return { token, expiresIn };
  }

  verify<T = unknown>(token: string): T {
    return jwt.verify(token, this.publicKey, this.verifyOptions) as T;
  }
}
