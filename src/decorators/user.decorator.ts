import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

export const UserId = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.id;
  },
);

export const UserEmail = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.email;
  },
);
