CREATE SCHEMA `tickets` ;

CREATE TABLE `tickets`.`states` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `tickets`.`departments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `tickets`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `id_department` INT NOT NULL,
  `admin` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_idDepartment_idx` (`id_department` ASC) VISIBLE,
  CONSTRAINT `fk_idDepartment`
    FOREIGN KEY (`id_department`)
    REFERENCES `tickets`.`departments` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE);


CREATE TABLE `tickets`.`tickets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  `id_state` INT NOT NULL,
  `id_department` INT NOT NULL,
  `observacoes` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_departmentId_idx` (`id_department` ASC) VISIBLE,
  INDEX `fk_stateId_idx` (`id_state` ASC) VISIBLE,
  INDEX `fk_user_idx` (`created_by` ASC) VISIBLE,
  INDEX `fk_updatedBy_idx` (`updated_by` ASC) VISIBLE,
  CONSTRAINT `fk_departmentId`
    FOREIGN KEY (`id_department`)
    REFERENCES `tickets`.`departments` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_stateId`
    FOREIGN KEY (`id_state`)
    REFERENCES `tickets`.`states` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_createdBy`
    FOREIGN KEY (`created_by`)
    REFERENCES `tickets`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_updatedBy`
    FOREIGN KEY (`updated_by`)
    REFERENCES `tickets`.`users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
 

