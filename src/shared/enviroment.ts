import { z } from 'zod';

import 'dotenv/config';

function envToString(value: string | undefined, defaultValue: string): string;
function envToString(value: string | undefined, defaultValue?: undefined): string | undefined;
function envToString(value: string | undefined, defaultValue?: string): string | undefined {
  return value === undefined || value === '' ? defaultValue : value;
}

// overload envToNumber so we know what the return value will be if a default
// value is provided
function envToNumber(value: string | undefined, defaultValue: number): number;
function envToNumber(value: string | undefined, defaultValue?: undefined): number | undefined;
function envToNumber(value: string | undefined, defaultValue?: number): number | undefined {
  return value === undefined || value === '' ? defaultValue : Number(value);
}

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

const configSchema = z.object({
  ENV: z.string(),
  DB: z.object({
    HOST: z.string().nonempty(),
    USER: z.string().nonempty(),
    PASSWORD: z.string().nonempty(),
    SCHEMA: z.string().nonempty(),
    PORT: z.number().positive(),
    URL: z.string().nonempty(),
  }),
  APP: z.object({
    PORT: z.number().positive().optional(),
    JWT_PRIVATE_KEY: z.string().nonempty(),
    JWT_PUBLIC_KEY: z.string().nonempty(),
  }),
});

// Definir una función auxiliar para hacer que los objetos sean de solo lectura en profundidad
function makeReadOnly<T>(obj: T): DeepReadonly<T> {
  if (typeof obj === 'object' && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = makeReadOnly(obj[key]);
      }
    }
    return Object.freeze(result);
  }
  return obj as DeepReadonly<T>;
}

const environmentData = {
  ENV: process.env.ENV ?? 'dev',
  DB: {
    URL: envToString(process.env.DATABASE_URL),
    USER: envToString(process.env.DB_USER),
    PASSWORD: envToString(process.env.DB_PASSWORD),
    HOST: envToString(process.env.DB_HOST),
    PORT: envToNumber(process.env.DB_PORT),
    SCHEMA: envToString(process.env.DB_SCHEMA),
  },
  APP: {
    PORT: envToNumber(process.env.APP_PORT, 3000),
    JWT_PRIVATE_KEY: envToString(process.env.JWT_PRIVATE_KEY),
    JWT_PUBLIC_KEY: envToString(process.env.JWT_PUBLIC_KEY),
  },
};

export const enviroment = makeReadOnly(configSchema.parse(environmentData));

export type Enviroment = typeof enviroment;
