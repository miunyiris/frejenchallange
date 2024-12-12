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
            model: Department,
            key: 'id',
        },
        allowNull: false,
    },
    admin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

Department.hasMany(User, { foreignKey: 'id_department' });
User.belongsTo(Department, { foreignKey: 'id_department' });

module.exports = User;