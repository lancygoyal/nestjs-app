import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './dtos/users-request.dto';
import { User } from './user.entity';
import { STATUS } from '../../constants/users';
import MESSAGES from '../../constants/messages';
import { USERS_REPOSITORY } from '../../constants/entity';
import { UsersUtils } from '../../utils/users.util';
import { getEnv } from '../../config/env';
import { LoginResponse } from './dtos/users-response.dto';

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
        ),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.findAll<User>({
      where: { status: STATUS.ACTIVE },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'role',
        'status',
        'bio',
        'loginAt',
        'createdAt',
        'updatedAt',
      ],
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
      attributes: [
        'id',
        'firstName',
        'lastName',
        'userName',
        'email',
        'role',
        'status',
        'bio',
        'loginAt',
        'createdAt',
        'updatedAt',
      ],
      raw: true,
    });
    if (!user) {
      throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<LoginResponse> {
    await this.getMe(userId);

    await this.usersRepository.update(
      { ...updateUserDto },
      { where: { id: userId } },
    );

    return {
      success: true,
      message: 'Success',
      user: await this.getMe(userId),
    };
  }

  async updatePassword(
    email: string,
    updatePasswordDto: UpdateUserPasswordDto,
  ): Promise<LoginResponse> {
    const user = await this.getUser(email);

    if (
      this.usersUtils.isValidPassword(
        user.hash,
        user.salt,
        updatePasswordDto.lastPwd,
      )
    ) {
      if (
        this.usersUtils.isValidPassword(
          user.hash,
          user.salt,
          updatePasswordDto.password,
        )
      ) {
        throw new BadRequestException(MESSAGES.SAME_PASSWORD);
      } else {
        const { hash } = this.usersUtils.hashPassword(
          user.salt,
          updatePasswordDto.password,
        );

        await this.usersRepository.update({ hash }, { where: { id: user.id } });

        return {
          success: true,
          message: 'Success',
        };
      }
    }

    throw new BadRequestException(MESSAGES.INVALID_PASSWORD);
  }
}
