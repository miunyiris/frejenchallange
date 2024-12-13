INSERT INTO `tickets`.`departments` (`title`) VALUES ('IT');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Recursos Humanos');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Marketing');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Contabilidade');
INSERT INTO `tickets`.`departments` (`title`) VALUES ('Vendas');

INSERT INTO `tickets`.`states` (`title`) VALUES ('Pendente');
INSERT INTO `tickets`.`states` (`title`) VALUES ('Recusado');
INSERT INTO `tickets`.`states` (`title`) VALUES ('Em tratamento');
INSERT INTO `tickets`.`states` (`title`) VALUES ('Finalizado');


INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('admin', 'admin@gmail.com', 'adminteste1', '1', '1');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Andreia', 'andreia@gmail.com', 'andreiateste1', '2', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Fábio', 'fabio@gmail.com', 'fabioteste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Raquel', 'raquel@gmail.com', 'raquelteste1', '1', '0');
INSERT INTO `tickets`.`users` (`name`, `email`, `password`, `id_department`, `admin`) VALUES ('Tiago', 'tiago@gmail.com', 'tiagoteste1', '1', '0');

INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Problema no servidor', 'Servidor está com problemas', '1', '1', '4', '1', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Revisão de contrato', 'Contrato do colaborador X precisa de ser revisto', '2', '3', '3', '1', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Solicitação de férias', 'Colaborador solicitou férias para o mês de dezembro', '3', '2', '2', '1', 'O colaborador já gozou os 22 dias de férias');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Problema na integração com redes sociais', 'A integração com o Facebook não está funcionando corretamente', '4', '1', '1', '1', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Erro no servidor de e-mails', 'O servidor de e-mails da empresa está fora do ar e precisa de intervenção imediata.', '5', '1', '4', '1', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Solicitação de documentação para admissão', 'O colaborador João da Silva está com documentação pendente para ser admitido.', '2', '3', '2', '2', 'Documentação solicitada ao colaborador por e-mail.');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Campanha de anúncios nas redes sociais', 'Criar e lançar uma campanha de anúncios para promover o novo produto da empresa.', '4', '5', '3', '3', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Falta de documentos fiscais para fechamento do mês', 'Não temos todos os documentos fiscais necessários para o fechamento financeiro do mês.', '3', '5', '2', '4', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Ajuste de preço no site de vendas', 'O preço de um dos produtos no site não foi atualizado corretamente após a promoção.', '2', '4', '3', '5', '');
INSERT INTO `tickets`.`tickets` (`title`, `description`, `created_by`, `updated_by`, `id_state`, `id_department`, `observacoes`) 
VALUES ('Solicitação de licença de software', 'A equipe de TI precisa de licenças adicionais para o novo software de monitoramento.', '1', '1', '2', '1', '');

