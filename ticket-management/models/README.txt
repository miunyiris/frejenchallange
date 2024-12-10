CREATE SCHEMA `tickets` ;

CREATE TABLE `tickets`.`departments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `tickets`.`departments` (`title`) VALUES ('IT');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Recursos Humanos');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Marketing');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Contabilidade');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Vendas');

CREATE TABLE `tickets`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `id_department` INT NOT NULL,
  `admin` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_departmentId`
    FOREIGN KEY (`id_department`)
    REFERENCES `tickets`.`departments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('admin', 'admin@gmail.com', 'adminteste1', '1', '1');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Andreia', 'andreia@gmail.com', 'andreiateste1', '2', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Fábio', 'fabio@gmail.com', 'fabioteste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Raquel', 'raquel@gmail.com', 'raquelteste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Tiago', 'tiago@gmail.com', 'tiagoteste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Carolina', 'carolina@gmail.com', 'carolinateste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Paulo', 'paulo@gmail.com', 'pauloteste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Bruno', 'bruno@gmail.com', 'brunoteste1', '1', '0');


ALTER TABLE tickets.users
ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;


CREATE TABLE `tickets`.`states` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `tickets`.`tickets` (
  `id` INT NOT NULL,
  `title` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT NOT NULL,
  `updated_by` INT NOT NULL,
  `id_state` INT NOT NULL,
  `observacoes` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_stateId_idx` (`id_state` ASC) VISIBLE,
  CONSTRAINT `fk_stateId`
    FOREIGN KEY (`id_state`)
    REFERENCES `tickets`.`states` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


INSERT INTO `tickets`.`states` (`title`) VALUES ('Pendente');
INSERT INTO `tickets`.`states` (`title`) VALUES ('Recusado');
INSERT INTO `tickets`.`states` (`title`) VALUES ('Em tratamento');
INSERT INTO `tickets`.`states` (`title`) VALUES ('Finalizado');


ALTER TABLE `tickets`.`tickets` 
DROP FOREIGN KEY `fk_stateId`;
ALTER TABLE `tickets`.`tickets` 
CHANGE COLUMN `id_state` `id_state` INT NOT NULL DEFAULT 1 ;
ALTER TABLE `tickets`.`tickets` 
ADD CONSTRAINT `fk_stateId`
  FOREIGN KEY (`id_state`)
  REFERENCES `tickets`.`states` (`id`);


ALTER TABLE `tickets`.`tickets` 
CHANGE COLUMN `id` `id` INT NOT NULL AUTO_INCREMENT ;


INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`) VALUES ('Problema no servidor', 'Servidor está com problemas', '8', '8', '4');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`) VALUES ('Revisão de contrato', 'Contrato do colaborador X precisa de ser revisto', '3', '2', '3');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `observacoes`) VALUES ('Solicitação de férias', 'Colaborador solicitou férias para o mês de dezembro', '5', '2', '2', 'O colaborador já gozou os 22 dias de férias');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`) VALUES ('Problema na integração com redes sociais', 'A integração com o Facebook não está funcionando corretamente', '2', '4', '1');






