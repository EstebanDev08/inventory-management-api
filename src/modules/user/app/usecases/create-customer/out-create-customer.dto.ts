import { CustomerProfile } from '#src/modules/user/domain/entities/customerProfile.entity';

import { User } from '../../../domain/entities/user.entity';

export class CreateCustomerDTO {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public roles: string[],
    public profile: {
      shipping_address: string;
    },
  ) {}

  static fromEntity(user: User, profile: CustomerProfile): CreateCustomerDTO {
    return new CreateCustomerDTO(user.id, user.name, user.email, user.roles, {
      shipping_address: profile.shipping_address,
    });
  }
}
