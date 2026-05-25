import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5410,
  username: 'postgres',
  password: '123',
  database: 'typeorm_db_laboratory',
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
});
