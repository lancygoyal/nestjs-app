import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsNotEmpty, IsIn } from 'class-validator';
import { ROLE, ROLE_TYPE } from 'src/constants/users';
import { ResponseDTO } from 'src/dtos/response';

export class CreateUserDto {
  @IsOptional()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  userName?: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsOptional()
  @ApiProperty({ required: false })
  phoneNumber?: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @IsNotEmpty()
  @IsIn(Object.values(ROLE))
  @ApiProperty({ required: true, enum: Object.values(ROLE) })
  role: string;

  @IsNotEmpty()
  @IsIn(Object.values(ROLE_TYPE))
  @ApiProperty({ required: true, enum: Object.values(ROLE_TYPE) })
  type: string;

  @IsOptional()
  @ApiProperty({ required: false })
  bio?: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  userName?: string;

  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @ApiProperty({ required: true })
  token?: string;
}

export class LoginResponse extends ResponseDTO {
  accessToken?: string;

  refreshToken?: string;

  user?: {
    id: string;

    firstName: string;

    lastName: string;

    userName: string;

    email: string;

    phoneNumber: string;

    role: string;

    type: string;

    bio: string;
  };
}
