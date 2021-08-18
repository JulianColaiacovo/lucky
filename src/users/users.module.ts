import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { REDIS_HOST, REDIS_PORT, REDIS_TTL } from '../config/constants';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CryptoModule,
    AuthenticationModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          store: redisStore,
          host: config.get(REDIS_HOST),
          port: config.get(REDIS_PORT),
          ttl: config.get(REDIS_TTL),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService, CacheInterceptor],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
