const { DataTypes } = require('sequelize');
const { sequelize } = require('../db'); // Importa a conexão com o banco de dados

// Importando os modelos relacionados
const Department = require('./Departments');
const State = require('./States'); // Presumindo que exista um modelo para os estados

// Definindo o modelo Ticket (representação da tabela no banco)
const Ticket = sequelize.define('tickets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    id_state: {
        type: DataTypes.INTEGER,
        references: {
            model: State, // A referência para a tabela 'States'
            key: 'id', // Chave primária da tabela States
        },
        allowNull: false,
        defaultValue: 1
    },
    observacoes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    id_department: {
        type: DataTypes.INTEGER,
        references: {
            model: Department, // A referência para a tabela 'Departments'
            key: 'id', // Chave primária da tabela Departments
        },
        allowNull: false,
    },
});

// Relacionamentos entre as tabelas
Department.hasMany(Ticket, { foreignKey: 'id_department' });
Ticket.belongsTo(Department, { foreignKey: 'id_department' });

State.hasMany(Ticket, { foreignKey: 'id_state' });
Ticket.belongsTo(State, { foreignKey: 'id_state' });

// Exporta o modelo para ser utilizado em outras partes do código
module.exports = Ticket;