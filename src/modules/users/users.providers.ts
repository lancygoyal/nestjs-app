import { USERS_REPOSITORY } from 'src/constants/users';
import { User } from './user.entity';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
