/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import mysql, { Pool } from 'mysql2';

import * as models from '#src/shared/database/drizzle/models/index';
import { enviroment } from '#src/shared/enviroment';

const globalAny: any = global;
globalAny.__dbPool = null;
globalAny.__dbConnection = null;

function createDatabaseConnection() {
  const poolConnection: Pool = mysql.createPool(enviroment.DB.URL);
  console.log('🔌 Nueva conexión creada');
  globalAny.__dbPool = poolConnection;
  globalAny.__dbConnection = drizzle(poolConnection, { schema: models, mode: 'default' });
}

function getDatabase() {
  if (!globalAny.__dbPool) {
    createDatabaseConnection();
  }
  return globalAny.__dbConnection;
}

export function getDrizzleOrm() {
  return getDatabase() as MySql2Database<typeof models>;
}
const drizzleOrm = getDrizzleOrm;

export { drizzleOrm, models };
