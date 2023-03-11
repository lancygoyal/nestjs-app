import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { getEnv } from '../config/env';
import { UsersUtils } from '../utils/users.util';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersUtils: UsersUtils) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authToken = request.headers['authorization'];

    try {
      const decodedTokenData = this.usersUtils.decodeToken(
        this.usersUtils.parseBearerToken(authToken),
        getEnv('ACCESS_TOKEN_SECRET'),
      );

      request.user = decodedTokenData;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
