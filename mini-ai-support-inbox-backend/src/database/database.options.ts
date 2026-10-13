import type { DataSourceOptions } from 'typeorm';

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'support_user',
  password: process.env.DB_PASSWORD ?? 'support_password',
  database: process.env.DB_NAME ?? 'support_inbox',
  synchronize: false,
};