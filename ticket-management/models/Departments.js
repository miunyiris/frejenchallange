const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db'); // Importa a conexão com o banco de dados

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Department;