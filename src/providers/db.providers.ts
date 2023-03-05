import { Sequelize } from 'sequelize-typescript';
import { getEnv } from 'src/config/env';
import { User } from '../modules/users/user.entity';

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
        pool: { min: 1, max: 10 },
        logging: false,
      });

      sequelize.addModels([User]);

      await sequelize.sync({ force: false });

      return sequelize;
    },
  },
];
