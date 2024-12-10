const { Sequelize } = require('sequelize');

// Configuração de conexão com o banco de dados
const sequelize = new Sequelize('tickets', 'user', 'user', {
    host: 'localhost',   // ou o host do seu banco de dados, como 'localhost'
    dialect: 'mysql',    // ou 'postgres', 'sqlite', etc.
});

async function connectDatabase() {
    try {
        await sequelize.authenticate();  // Testa a conexão
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    }
}

module.exports = { sequelize, connectDatabase };