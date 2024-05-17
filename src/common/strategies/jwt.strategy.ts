import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthError } from '../../auth/errors';
import { IUserService } from '../../user/interfaces';
import { USER_SERVICE } from '../../user/user.constant';
import { IIdentity } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly configService: ConfigService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<IIdentity> {
    const user = await this.userService.findById(payload.sub);
    if (!user) throw new AuthError.InvalidCredentials();

    return {
      id: payload.sub,
      package: user.package,
    };
  }
}
