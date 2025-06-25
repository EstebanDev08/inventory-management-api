export class PasswordResetRequestDto {
  constructor(
    readonly succes: boolean,
    readonly message: string,
  ) {}
}
