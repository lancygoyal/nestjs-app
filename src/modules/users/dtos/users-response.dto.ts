import { ResponseDTO } from 'src/dtos/response';

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
