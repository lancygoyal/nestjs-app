import { Sequelize } from 'sequelize-typescript';
import { getEnv, isLocalDev } from 'src/config/env';
import entities from '../entities';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: getEnv('DB_HOST'),
        port: getEnv('DB_PORT'),
        username: getEnv('DB_USER'),
        password: getEnv('DB_PASSWORD'),
        database: getEnv('DB_NAME'),
        dialectOptions: { ssl: getEnv('DB_SSL') },
        schema: getEnv('DB_SCHEMA'),
        pool: { min: 1, max: 10 },
        logging: false,
      });

      await sequelize.addModels(entities);

      await sequelize.sync({ force: isLocalDev() });

      return sequelize;
    },
  },
];
