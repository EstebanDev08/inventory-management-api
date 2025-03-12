import { ITransaction } from '#src/shared/database/transaction.interface';

import { CustomerProfile } from './entities/customerProfile.entity';
import { User } from './entities/user.entity';

export abstract class IUserRepository {
  abstract create(data: User, tx?: ITransaction): Promise<void>;
  abstract findById(): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findMany(): Promise<User[]>;

  abstract craateCustomerProfile(profile: CustomerProfile): Promise<void>;
}
