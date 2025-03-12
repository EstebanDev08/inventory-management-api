import { UUID } from 'crypto';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SELLER = 'seller',
  DELIVERY = 'delivery',
}

export class User {
  constructor(
    readonly id: UUID,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly role: string,
  ) {}

  public hasRole(role: UserRole): boolean {
    return this.role === role;
  }
}
