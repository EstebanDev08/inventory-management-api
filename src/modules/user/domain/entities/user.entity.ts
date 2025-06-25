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
  roles: UserRole[];
}

export class User {
  private constructor(
    readonly id: UUID,
    readonly name: string,
    readonly email: string,
    readonly password: string,
    readonly roles: UserRole[],
  ) {}

  public static create(props: UserProps): User {
    return new User(props.id, props.name, props.email, props.password, props.roles);
  }

  public hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }

  public hasAnyRole(roles: UserRole[]): boolean {
    return roles.some((role) => this.roles.includes(role));
  }

  public get primaryRole(): UserRole | undefined {
    return this.roles[0];
  }
}
