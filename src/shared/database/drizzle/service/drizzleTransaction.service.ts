import { ExtractTablesWithRelations } from 'drizzle-orm';
import { MySqlTransaction } from 'drizzle-orm/mysql-core/session';
import { MySql2PreparedQueryHKT, MySql2QueryResultHKT } from 'drizzle-orm/mysql2/session';

import models, { drizzleOrm } from '#src/shared/database/drizzle/drizzle';
import { injectable } from '#src/shared/decorator/injectable.decorator';

import { ITransactionService } from '../../transaction.interface';

export type DrizzleTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof models,
  ExtractTablesWithRelations<typeof models>
>;

@injectable()
export class DrizzleTransactionService implements ITransactionService {
  startTransaction<T>(clb: (tx: DrizzleTransaction) => Promise<T>): Promise<T> {
    return drizzleOrm.transaction(clb);
  }
}
