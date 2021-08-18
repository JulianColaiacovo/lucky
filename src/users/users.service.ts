import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { CreateUser } from './api/create.user';
import { User } from './api/user';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(private cryptoService: CryptoService) {}

  async findUser(username: string): Promise<User> {
    return await getManager()
      .query(
        `
                SELECT profile.id id, profile.name name, address.street street, city.name city, country.name country
                FROM user
                         INNER JOIN profile ON profile.userId = user.id
                         INNER JOIN address ON address.id = profile.addressId
                         INNER JOIN city ON city.id = address.cityId
                         INNER JOIN country ON country.id = city.countryId
                WHERE user.username = ?
                ORDER BY profile.id DESC
                LIMIT 1
            `,
        [username],
      )
      .then((users) => users.map(UsersService.mapUser)[0]);
  }

  async createUser(createUser: CreateUser): Promise<void> {
    return getManager().transaction(async (transaction) => {
      const resultUser = await transaction.query(
        `
                    INSERT INTO user (username, password)
                    VALUES (?, ?);
                `,
        [
          createUser.username,
          await this.cryptoService.hash(createUser.password),
        ],
      );
      const resultAddress = await transaction.query(
        `
                    INSERT INTO address (cityId, street)
                    VALUES (?, ?);
                `,
        [createUser.cityId, createUser.address],
      );
      return transaction.query(
        `
                    INSERT INTO profile (userId, addressId, name)
                    VALUES (?, ?, ?);
                `,
        [resultUser.insertId, resultAddress.insertId, createUser.name],
      );
    });
  }

  private static mapUser(resultSet: any): User {
    return {
      id: resultSet.id,
      name: resultSet.name,
      address: {
        street: resultSet.street,
        city: resultSet.city,
        country: resultSet.country,
      },
    };
  }
}
