import {
  BadRequestException,
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Headers,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUser } from './api/create.user';
import { User } from './api/user';
import { UsersService } from './users.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getUser(@Headers('Authorization') token: string): Promise<User> {
    const payload = await this.authenticationService.getJwtPayload(token);
    if (payload?.username) {
      return this.usersService.findUser(payload.username);
    } else {
      throw new BadRequestException('Invalid or expired JWT token');
    }
  }

  @Post()
  createUser(@Body() user: CreateUser): any {
    return this.usersService.createUser(user);
  }
}
