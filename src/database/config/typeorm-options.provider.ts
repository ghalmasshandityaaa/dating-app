import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../../config/database';
import { TYPEORM_PINO_LOGGER } from '../../logger/logger.constants';
import { TypeOrmPinoLoggerProvider } from '../../logger/providers/typeorm.pino-logger.provider';

@Injectable()
export class TypeOrmOptionsProvider implements TypeOrmOptionsFactory {
  constructor(
    private config: DatabaseConfigService,
    @Inject(TYPEORM_PINO_LOGGER)
    private logger: TypeOrmPinoLoggerProvider,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      retryAttempts: 3,
      type: 'postgres',
      url: this.config.url,
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      logger: this.logger,
      ssl: this.config.ssl
        ? {
            rejectUnauthorized: false,
          }
        : false,
    };
  }
}
