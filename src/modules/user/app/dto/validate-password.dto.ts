export class ValidateUserPasswordDto {
  constructor(
    public readonly userId: string,
    public readonly isMatching: boolean,
  ) {}
}
