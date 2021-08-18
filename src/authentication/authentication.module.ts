import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CryptoModule } from '../crypto/crypto.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRATION_TIME, JWT_SECRET } from '../config/constants';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    CryptoModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
        signOptions: {
          expiresIn: `${configService.get(JWT_EXPIRATION_TIME)}s`,
        },
      }),
    }),
  ],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
