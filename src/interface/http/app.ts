/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';

import { AppModule } from '#src/interface/http/app.module';

import { AppErrorFilter } from './filters/error.filter';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AppErrorFilter());

  const port = process.env.PORT ?? 3000;

  await app.listen(process.env.PORT ?? 3000);
  console.log(`port :${port}`);
}
