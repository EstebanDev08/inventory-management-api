import { SellerProfile } from '#src/modules/user/domain/entities/sellerProfile.entity';

import { User } from '../../../domain/entities/user.entity';

export class CreateSellerDTO {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public roles: string[],
    public profile: {
      store_name: string;
      store_description: string;
    },
  ) {}

  static fromEntity(user: User, profile: SellerProfile): CreateSellerDTO {
    return new CreateSellerDTO(user.id, user.name, user.email, user.roles, {
      store_description: profile.store_description,
      store_name: profile.store_name,
    });
  }
}
