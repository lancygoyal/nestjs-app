import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEmail, UserId } from 'src/decorators/user.decorator';
import { ResponseDTO } from 'src/dtos/response';
import { AuthGuard } from 'src/middlewares/auth.guard';
import {
  CreateUserDto,
  LoginUserDto,
  RefreshTokenDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './dtos/users-request.dto';
import { LoginResponse } from './dtos/users-response.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseDTO | undefined> {
    return this.usersService.register(createUserDto);
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginResponse | undefined> {
    return this.usersService.login(loginUserDto);
  }

  // Todo
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('JWT-auth')
  // @Post('/activate')
  // async activateUser(): Promise<User> {
  //   return null;
  // }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse | undefined> {
    return this.usersService.refresh(refreshTokenDto.token);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/me')
  async getMe(@UserId() userId: string): Promise<User> {
    return this.usersService.getMe(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('/edit')
  async updateUser(
    @UserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<LoginResponse | undefined> {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Put('/update-password')
  async updatePassword(
    @UserEmail() email: string,
    @Body() updatePasswordDto: UpdateUserPasswordDto,
  ): Promise<ResponseDTO | undefined> {
    return this.usersService.updatePassword(email, updatePasswordDto);
  }
}
