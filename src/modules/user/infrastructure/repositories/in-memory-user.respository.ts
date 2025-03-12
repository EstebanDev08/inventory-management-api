/* eslint-disable no-console */
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { CustomerProfile } from '../../domain/entities/customerProfile.entity';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/user.repository';

@injectable()
export class InMemoryRepository implements IUserRepository {
  private users: User[] = [];

  async create(data: User): Promise<void> {
    this.users.push(data);
  }
  async findById(): Promise<User | null> {
    return this.users[0];
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((item) => item.email === email) ?? null;
  }

  async findMany(): Promise<User[]> {
    return this.users;
  }
  async craateCustomerProfile(profile: CustomerProfile): Promise<void> {
    console.log('creado un perfil');

    console.log(profile);
  }
}
