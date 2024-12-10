const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração de conexão com o banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',  // ou 'postgres', 'sqlite', etc.
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