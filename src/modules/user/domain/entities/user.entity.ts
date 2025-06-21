import { UUID } from 'crypto';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SELLER = 'seller',
  DELIVERY = 'delivery',
}

export interface UserProps {
  id: UUID;
  name: string;
  email: string;
  password: string;
  role: string;
}

export class User {
  private constructor(
    readonly id: UUID,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly role: string,
  ) {}

  public static create(props: UserProps): User {
    return new User(props.id, props.name, props.email, props.password, props.role);
  }

  public hasRole(role: UserRole): boolean {
    return this.role === role;
  }
}
