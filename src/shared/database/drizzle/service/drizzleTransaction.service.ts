import { ExtractTablesWithRelations } from 'drizzle-orm';
import { MySqlTransaction } from 'drizzle-orm/mysql-core/session';
import { MySql2PreparedQueryHKT, MySql2QueryResultHKT } from 'drizzle-orm/mysql2/session';

import models, { drizzleOrm } from '#src/shared/database/drizzle/drizzle';

import { ITransactionManagerService } from '../../transaction.interface';

export type DrizzleTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof models,
  ExtractTablesWithRelations<typeof models>
>;

class DrizzleTransactionService implements ITransactionManagerService {
  startTransaction<T>(clb: (tx: DrizzleTransaction) => Promise<T>): Promise<T> {
    return drizzleOrm.transaction(clb);
  }
}

export const dirzzleTransactionImpl = new DrizzleTransactionService();
