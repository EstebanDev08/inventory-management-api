import { UUID } from 'crypto';

import { UserRole } from '#src/modules/user/domain/entities/user.entity';

export class CurrentUserDto {
  constructor(
    readonly id: UUID,
    readonly name: string,
    readonly email: string,
    readonly roles: UserRole[],
  ) {}
}
