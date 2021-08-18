import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import JwtPayload from './api/jwt.payload';
import JwtToken from './api/jwt.token';
import { Credentials } from './api/credentials';
import { getManager } from 'typeorm';

@Injectable()
export class AuthenticationService {
  constructor(
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  public getJwtPayload(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (e) {
      throw new BadRequestException(e, 'Invalid jwt token');
    }
  }

  public async buildJwtToken(
    username: string,
    password: string,
  ): Promise<JwtToken> {
    const credentials = await this.findCredentials(username);
    if (credentials) {
      const validPassword = await this.cryptoService.samePassword(
        password,
        credentials.password,
      );
      if (validPassword) {
        const payload: JwtPayload = { username };
        const token = this.jwtService.sign(payload);
        return { token };
      }
    }
    throw new BadRequestException('Invalid username or password');
  }

  async findCredentials(username: string): Promise<Credentials> {
    return await getManager()
      .query(
        `
                SELECT user.username, user.password
                FROM user
                WHERE user.username = ?
                LIMIT 1
            `,
        [username],
      )
      .then((users) => users.map(AuthenticationService.mapCredentials)[0]);
  }

  private static mapCredentials(resultSet: any): Credentials {
    return {
      username: resultSet.username,
      password: resultSet.password,
    };
  }
}
