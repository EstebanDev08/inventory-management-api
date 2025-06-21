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
}
