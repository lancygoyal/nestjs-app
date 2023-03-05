import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateUserDto, LoginResponse, LoginUserDto } from './dtos/users.dto';
import { User } from './user.entity';
import { STATUS, USERS_REPOSITORY } from 'src/constants/users';
import MESSAGES from 'src/constants/messages';
import { UsersUtils } from 'src/utils/users.util';
import { getEnv } from 'src/config/env';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,

    private usersUtils: UsersUtils,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<LoginResponse> {
    let user_;

    try {
      user_ = await this.getUser(createUserDto.email);
    } catch (error) {
      //
    }

    if (user_) {
      throw new BadRequestException(MESSAGES.CONTACT_ADMIN);
    }

    const { salt, hash } = this.usersUtils.hashPassword(
      this.usersUtils.createSalt(),
      createUserDto.password,
    );

    const data = {
      id: this.usersUtils.createUseId(),
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      userName: createUserDto.userName
        ? createUserDto.userName
        : this.usersUtils.createUserName(createUserDto.email),
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      salt,
      hash,
      role: createUserDto.role,
      type: createUserDto.type,
      status: STATUS.INACTIVE,
      bio: createUserDto.bio,
    };

    await this.usersRepository.create({
      ...data,
    });

    return {
      success: true,
      message: 'Success',
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse | undefined> {
    const { hash, salt, status, ...user } = await this.getUser(
      loginUserDto.userName,
    );

    if (this.usersUtils.isValidPassword(hash, salt, loginUserDto.password)) {
      // Todo
      if (status === STATUS.INACTIVE) {
        await this.usersRepository.update(
          { status: STATUS.ACTIVE },
          { where: { id: user.id } },
        );
      }

      await this.usersRepository.update(
        { loginAt: new Date() },
        { where: { id: user.id } },
      );

      return {
        success: true,
        message: 'Success',
        user,
        accessToken: this.usersUtils.createAccessToken(
          user.id,
          user.email,
          user.role,
          user.type,
        ),
        refreshToken: this.usersUtils.createRefreshToken(user.id),
      };
    }

    throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
  }

  async refresh(token: string): Promise<LoginResponse | undefined> {
    try {
      const parsedToken = this.usersUtils.decodeToken(
        token,
        getEnv('REFRESH_TOKEN_SECRET'),
      );

      const user = await this.getMe(parsedToken.id);

      return {
        success: true,
        message: 'Success',
        accessToken: this.usersUtils.createAccessToken(
          user.id,
          user.email,
          user.role,
          user.type,
        ),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.findAll<User>({
      where: { status: STATUS.ACTIVE },
      raw: true,
    });
  }

  async getUser(
    userName: string,
    checkStatus = false,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findOne<User>({
      where: {
        [Op.or]: [
          {
            email: { [Op.eq]: userName },
          },
          {
            userName: { [Op.eq]: userName },
          },
        ],
        ...(checkStatus ? { status: STATUS.ACTIVE } : {}),
      },
      raw: true,
    });
    if (!user) {
      throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async getMe(userId): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, status: STATUS.ACTIVE },
      raw: true,
    });
    if (!user) {
      throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }
}
