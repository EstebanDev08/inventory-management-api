import { Config, defineConfig } from 'drizzle-kit';

import { enviroment } from '#src/shared/enviroment';

export default defineConfig({
  schema: './src/shared/database/drizzle/models/index.ts',
  out: './.drizzle/migrations',
  dialect: 'mysql',

  dbCredentials: {
    database: enviroment.DB.SCHEMA,
    host: enviroment.DB.HOST,
    password: enviroment.DB.PASSWORD,
    port: enviroment.DB.PORT,
    user: enviroment.DB.USER,
  },
  migrations: {
    schema: enviroment.DB.SCHEMA,
  },
}) satisfies Config;
