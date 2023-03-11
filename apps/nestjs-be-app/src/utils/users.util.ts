import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { getEnv } from '../config/env';

export class UsersUtils {
  createSalt() {
    // Creating a unique salt for a particular user
    const salt = crypto.randomBytes(16).toString('hex');

    return salt;
  }

  hashPassword(salt: string, password: string) {
    // Hashing user's salt and password with 1000 iterations,
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return { salt, hash };
  }

  isValidPassword(hash: string, salt: string, password: string) {
    return hash === this.hashPassword(salt, password).hash;
  }

  createUserName(email: string) {
    return email.replace(/@.*$/, '').replace(/[^a-zA-Z0-9 ]/g, '');
  }

  createUseId() {
    return uuidv4();
  }

  createAccessToken(id: string, email: string, role: string) {
    const accessToken = jwt.sign(
      {
        id,
        email,
        role,
      },
      getEnv('ACCESS_TOKEN_SECRET'),
      {
        expiresIn: '60m',
      },
    );

    return accessToken;
  }

  createRefreshToken(id: string) {
    const refreshToken = jwt.sign(
      {
        id,
      },
      getEnv('REFRESH_TOKEN_SECRET'),
      { expiresIn: '180d' },
    );

    return refreshToken;
  }

  parseBearerToken(token: string) {
    if (token.startsWith('Bearer ')) {
      return token.split(' ')[1];
    } else {
      throw new UnauthorizedException();
    }
  }

  decodeToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw error;
    }
  }
}
