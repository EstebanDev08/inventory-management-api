/* eslint-disable no-console */
import { UUID } from 'crypto';

import { injectable } from '#src/shared/decorator/injectable.decorator';

import { CustomerProfile } from '../../domain/entities/customerProfile.entity';
import { SellerProfile } from '../../domain/entities/sellerProfile.entity';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/user.repository';

@injectable()
export class InMemoryRepository implements IUserRepository {
  private readonly users: User[] = [];
  private readonly customerProfiles: CustomerProfile[] = [];
  private readonly sellerProfiles: SellerProfile[] = [];

  async create(data: User): Promise<void> {
    this.users.push(data);
  }

  async findById(id: UUID): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findMany(): Promise<User[]> {
    return this.users;
  }

  async createCustomerProfile(profile: CustomerProfile): Promise<void> {
    this.customerProfiles.push(profile);
    this.printAll();
  }

  async createSellerProfile(profile: SellerProfile): Promise<void> {
    this.sellerProfiles.push(profile);
    this.printAll();
  }

  private printAll(): void {
    console.log('Users:', this.users);
    console.log('Customer Profiles:', this.customerProfiles);
    console.log('Seller Profiles:', this.sellerProfiles);
  }
}
