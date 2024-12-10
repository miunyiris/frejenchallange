const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');  // Importa a conexão com o banco de dados

// Importando o modelo de Department
const Department = require('./Departments');

// Definindo o modelo User (representação da tabela no banco)
const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_department: {
        type: DataTypes.INTEGER,
        references: {
            model: Department, // A referência para a tabela 'Department'
            key: 'id', // Chave primária da tabela Department
        },
        allowNull: false, // Opcional, caso o departamento seja obrigatório para o usuário
    },
    admin: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Usuário não é admin por padrão
    }
});

// Relacionamento entre as tabelas
Department.hasMany(User, { foreignKey: 'id_department' });
User.belongsTo(Department, { foreignKey: 'id_department' });

// Exporta o modelo para ser utilizado em outras partes do código
module.exports = User;