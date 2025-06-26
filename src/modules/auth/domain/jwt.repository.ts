import { UUID } from 'crypto';

import { UserRole } from '#src/modules/user/domain/entities/user.entity';

export type AuthenticatedUser = {
  sub: UUID;
  email: string;
  roles: UserRole[];
};

export abstract class IJwtRepository {
  /**
   * Genera un JWT con los claims indicados.
   * @param claims Datos a incluir en el token
   * @param expiresInSeconds Duración personalizada en segundos (opcional)
   * @returns token y tiempo de expiración en segundos
   */
  abstract sign(
    claims: Record<string, unknown>,
    expiresInSeconds?: number,
  ): { token: string; expiresIn: number };

  /**
   * Verifica y decodifica un JWT.
   * @throws Error si no es válido o expiró
   */
  abstract verify<T = unknown>(token: string): T;

  /**
   * Genera un refresh token con mayor duración.
   * @param payload Datos del usuario
   * @returns refresh token
   */
  abstract generateRefreshToken(payload: Record<string, unknown>): string;

  /**
   * Verifica un refresh token.
   * @param token Refresh token a verificar
   * @throws Error si no es válido o expiró
   */
  abstract verifyRefreshToken<T>(token: string): T;
}
