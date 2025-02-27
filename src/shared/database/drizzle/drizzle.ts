import { ExtractTablesWithRelations } from 'drizzle-orm';
import { MySqlTransaction } from 'drizzle-orm/mysql-core';
import { drizzle, MySql2PreparedQueryHKT, MySql2QueryResultHKT } from 'drizzle-orm/mysql2';
import mysql, { Pool } from 'mysql2';

import * as models from '#src/shared/database/drizzle/models/index';
import { enviroment } from '#src/shared/enviroment';

const connection: Pool = mysql.createPool(enviroment.DB.URL);

// Singleton function to ensure only one db instance is created
function singleton<Value>(name: string, value: () => Value): Value {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = global;
  globalAny.__singletons = globalAny.__singletons || {};

  if (!globalAny.__singletons[name]) {
    globalAny.__singletons[name] = value();
  }

  return globalAny.__singletons[name];
}

// Function to create the database connection and apply migrations if needed
function createDatabaseConnection() {
  const poolConnection = connection;
  return drizzle(poolConnection, { schema: models, mode: 'default' });
}

export const drizzleOrm = singleton('db', createDatabaseConnection);

export type DrizzleTransaction = MySqlTransaction<
  MySql2QueryResultHKT,
  MySql2PreparedQueryHKT,
  typeof models,
  ExtractTablesWithRelations<typeof models>
>;
export default models;
