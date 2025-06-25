import { UUID } from 'crypto';

import { eq } from 'drizzle-orm';

import { drizzleOrm, models } from '#src/shared/database/drizzle/drizzle';
import { userRole } from '#src/shared/database/drizzle/models/user_role';
import { DrizzleTransaction } from '#src/shared/database/drizzle/service/drizzleTransaction.service';
import { injectable } from '#src/shared/decorator/injectable.decorator';
import { NotFoundError } from '#src/shared/errors/notFound.error';

import { CustomerProfile } from '../../domain/entities/customerProfile.entity';
import { SellerProfile } from '../../domain/entities/sellerProfile.entity';
import { User, UserRole } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/user.repository';

@injectable()
export class DrizzleUserRepository implements IUserRepository {
  async update(data: User, tx?: DrizzleTransaction): Promise<void> {
    const invoker = tx ?? drizzleOrm();
    await invoker
      .update(models.user)
      .set({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      .where(eq(models.user.id, data.id));
  }
  async create(data: User, tx?: DrizzleTransaction): Promise<void> {
    const invoker = tx ?? drizzleOrm();

    await invoker.insert(models.user).values(data);
  }

  async findById(id: UUID): Promise<User | null> {
    const foundUser = await drizzleOrm().query.user.findFirst({ where: eq(models.user.id, id) });

    if (!foundUser) {
      return null;
    }

    const roles = await this.foundUserRoles(foundUser.id);

    return User.create({
      roles,
      ...foundUser,
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    const foundUser = await drizzleOrm().query.user.findFirst({
      where: eq(models.user.email, email),
    });

    if (!foundUser) {
      return null;
    }

    const roles = await this.foundUserRoles(foundUser.id);

    return User.create({
      roles,
      ...foundUser,
    });
  }

  async findMany(): Promise<User[]> {
    const foundUsers = await drizzleOrm().query.user.findMany({
      with: { roles: { with: { role: { columns: { name: true } } } } },
    });

    return foundUsers.map((u) => {
      const roles = u.roles.map((r) => r.role.name);
      return User.create({
        roles,
        email: u.email,
        id: u.id,
        name: u.name,
        password: u.password,
      });
    });
  }
  async createCustomerProfile(profile: CustomerProfile, tx: DrizzleTransaction): Promise<void> {
    const invoker = tx;

    await invoker.insert(models.customer).values({
      user_id: profile.user_id,
      shipping_address: profile.shipping_address,
    });

    const foundRole = await invoker.query.role.findFirst({
      where: eq(models.role.name, UserRole.CUSTOMER),
    });

    if (!foundRole) {
      throw new NotFoundError('Role', { message: `Role ${UserRole.CUSTOMER} not found` });
    }

    await invoker.insert(models.userRole).values({
      user_id: profile.user_id,
      role_id: foundRole.id,
    });
  }
  async createSellerProfile(profile: SellerProfile, tx: DrizzleTransaction): Promise<void> {
    const invoker = tx;

    await invoker.insert(models.seller).values({
      user_id: profile.user_id,
      store_name: profile.store_name,
      store_description: profile.store_description,
    });

    const foundRole = await invoker.query.role.findFirst({
      where: eq(models.role.name, UserRole.SELLER),
    });

    if (!foundRole) {
      throw new NotFoundError('Role', { message: `Role ${UserRole.CUSTOMER} not found` });
    }

    await invoker.insert(models.userRole).values({
      user_id: profile.user_id,
      role_id: foundRole.id,
    });
  }

  private async foundUserRoles(id: UUID): Promise<UserRole[]> {
    const foundUserRoles = await drizzleOrm().query.userRole.findMany({
      with: { role: { columns: { name: true } } },
      where: eq(userRole.user_id, id),
    });

    return foundUserRoles.map((r) => r.role.name);
  }
}
