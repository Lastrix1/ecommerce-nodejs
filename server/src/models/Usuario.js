const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING,
        defaultValue: 'client' // Puede ser 'admin' o 'client'
    }
}, {
    tableName: 'usuarios', // Fuerza a que la tabla en MySQL se llame exactamente así
    timestamps: true       // Crea automáticamente las columnas de cuándo se creó y actualizó el usuario
});

module.exports = Usuario;