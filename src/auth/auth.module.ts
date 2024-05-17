import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../common/strategies';
import { TokenConfigModule, TokenConfigService } from '../config/token';
import {
  TOKEN_SERVICE,
  USER_READ_REPOSITORY,
  USER_SERVICE,
  USER_WRITE_REPOSITORY,
} from './auth.constant';
import { CommandHandlers } from './commands';
import { AuthController } from './controllers';
import { TypeOrmAuthEntities } from './entities';
import { Listeners } from './listeners';
import { AuthReadRepository, AuthWriteRepository } from './repositories';
import { TokenService, UserService } from './services';

const repositories: Provider[] = [
  {
    provide: USER_READ_REPOSITORY,
    useClass: AuthReadRepository,
  },
  {
    provide: USER_WRITE_REPOSITORY,
    useClass: AuthWriteRepository,
  },
];

const services: Provider<any>[] = [
  {
    provide: TOKEN_SERVICE,
    useClass: TokenService,
  },
  {
    provide: USER_SERVICE,
    useClass: UserService,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature(TypeOrmAuthEntities),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: TokenConfigService) => {
        return {
          secret: configService.secret,
          signOptions: {
            algorithm: configService.algorithm as any,
          },
          global: true,
        };
      },
      imports: [TokenConfigModule],
      inject: [TokenConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [...CommandHandlers, ...repositories, ...services, ...Listeners, JwtStrategy],
  exports: [...services],
})
export class AuthModule {}
