import { Body, Controller, Post } from '@nestjs/common';
import { Credentials } from './api/credentials';
import { AuthenticationService } from './authentication.service';
import JwtToken from './api/jwt.token';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  buildJwtToken(@Body() credentials: Credentials): Promise<JwtToken> {
    return this.authenticationService.buildJwtToken(
      credentials.username,
      credentials.password,
    );
  }
}
