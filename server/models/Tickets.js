const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Department = require('./Departments');
const State = require('./States');
const User  = require('./User');

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
            model: State,
            key: 'id',
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
            model: Department,
            key: 'id',
        },
        allowNull: false,
    },
});

Department.hasMany(Ticket, { foreignKey: 'id_department' });
Ticket.belongsTo(Department, { foreignKey: 'id_department' });

State.hasMany(Ticket, { foreignKey: 'id_state' });
Ticket.belongsTo(State, { foreignKey: 'id_state' });

User.hasMany(Ticket, { foreignKey: 'created_by' });
Ticket.belongsTo(User, { foreignKey: 'created_by', as: 'createdBy' });
User.hasMany(Ticket, { foreignKey: 'updated_by' });
Ticket.belongsTo(User, { foreignKey: 'updated_by', as: 'updatedBy' });

module.exports = Ticket;