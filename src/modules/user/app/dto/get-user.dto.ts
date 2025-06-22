import { UUID } from 'crypto';

import { User, UserRole } from '../../domain/entities/user.entity';

export class GetUserDto {
  constructor(
    public id: UUID,
    public name: string,
    public email: string,
    public roles: UserRole[],
  ) {}

  static fromEntity(user: User): GetUserDto {
    return new GetUserDto(user.id, user.name, user.email, user.roles);
  }
}
