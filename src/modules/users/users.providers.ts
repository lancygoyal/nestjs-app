import { USERS_REPOSITORY } from 'src/constants/entity';
import { User } from './user.entity';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
