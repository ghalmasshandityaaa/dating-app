import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from './database';
import { LoggerConfigModule } from './logger';
import { ServerConfigModule } from './server';
import { TokenConfigModule } from './token';

@Module({
  imports: [ServerConfigModule, LoggerConfigModule, DatabaseConfigModule, TokenConfigModule],
})
export class ConfigModule {}
