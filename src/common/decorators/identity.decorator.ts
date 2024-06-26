import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IIdentity } from '../interfaces';

type RequestWithIdentity<T> = Request & {
  user: T;
};

export const Identity = createParamDecorator(
  <T extends IIdentity>(data: unknown, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest<RequestWithIdentity<T>>();
    return request.user;
  },
);
