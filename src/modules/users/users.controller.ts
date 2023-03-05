import {
  Body,
  Controller,
  Get,
  HttpCode,
  Request,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import {
  CreateUserDto,
  LoginResponse,
  LoginUserDto,
  RefreshTokenDto,
} from './dtos/users.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginResponse | undefined> {
    return this.usersService.login(loginUserDto);
  }

  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse | undefined> {
    return this.usersService.refresh(refreshTokenDto.token);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  @ApiBearerAuth('JWT-auth')
  async getMe(@Request() req): Promise<User> {
    return this.usersService.getMe(req.user.id);
  }

  // Todo
  // @UseGuards(AuthGuard('jwt'))
  @Put('/edit')
  async updateUser(): Promise<User> {
    return null;
  }

  // Todo
  // @UseGuards(AuthGuard('jwt'))
  @Post('/activate')
  async activateUser(): Promise<User> {
    return null;
  }

  // Todo
  // @UseGuards(AuthGuard('jwt'))
  @Put('/update-password')
  async updatePassword(): Promise<User> {
    return null;
  }
}
