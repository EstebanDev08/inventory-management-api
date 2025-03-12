import { UUID } from 'crypto';

import { ITransaction } from '#src/shared/database/transaction.interface';

import { CustomerProfile } from './entities/customerProfile.entity';
import { SellerProfile } from './entities/sellerProfile.entity';
import { User } from './entities/user.entity';

export abstract class IUserRepository {
  abstract create(data: User, tx?: ITransaction): Promise<void>;
  abstract findById(id: UUID): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findMany(): Promise<User[]>;

  abstract createCustomerProfile(profile: CustomerProfile, tx?: ITransaction): Promise<void>;
  abstract createSellerProfile(profile: SellerProfile, tx?: ITransaction): Promise<void>;
}
