export class LoginDto {
  constructor(
    public readonly token: string,
    public readonly refreshToken: string,
    public readonly expiresIn: number,
  ) {}
}
