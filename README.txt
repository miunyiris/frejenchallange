Tecnologias Utilizadas

Frontend: React.js

Backend:Node.js com Express.js

Banco de Dados: MySQL.

ORM Sequelize para gerenciar modelos e realizar consultas.

Estrutura do Projeto

Base de Dados

A estrutura da base de dados foi implementada com dois arquivos principais:

db-create.sql: Responsável pela criação do esquema e tabelas do banco de dados.

db-populate.sql: Contém scripts para população inicial com dados necessários, como estados, departamentos e usuários(contem também tickets exemplo).

Como Executar o Projeto

Instalação de Dependências:

Back-end:

Use o Yarn para instalar as dependências:

yarn install

Configuração do Banco de Dados:

(!!!)Atualizar as variáveis de ambiente da base de dados se necessário no .env(!!!)

Execute o script db-create.sql para criar o esquema e as tabelas.

Execute o script db-populate.sql para inserir dados iniciais.

Execução do Backend:

Inicie o servidor com:

yarn start

Execução do Frontend:

Inicie o React no ambiente de desenvolvimento:

yarn start

Estrutura do Repositório

/server: Contém o código da API em Express.js.

/client: Contém o código da interface em React.js.