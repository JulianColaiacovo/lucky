DROP SCHEMA IF EXISTS lucky;

CREATE SCHEMA lucky;

USE lucky;

CREATE TABLE `country`(
  `id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `city`(
  `id` INT UNSIGNED NOT NULL,
  `countryId` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  CONSTRAINT `fk_city_country` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`),
  PRIMARY KEY (`id`)
);

CREATE TABLE `address`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cityId` INT UNSIGNED NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  CONSTRAINT `fk_address_city` FOREIGN KEY (`cityId`) REFERENCES `city` (`id`),
  PRIMARY KEY (`id`)
);

CREATE TABLE `user`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `profile`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` INT UNSIGNED NOT NULL,
  `addressId` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_profile_address` FOREIGN KEY (`addressId`) REFERENCES `address` (`id`),
  PRIMARY KEY (`id`)
);

INSERT INTO country
(id, name)
VALUES
(1, 'Argentina');

INSERT INTO city
(id, countryId, name)
VALUES
(1, 1, 'BsAs');

