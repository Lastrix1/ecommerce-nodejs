const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Venta = sequelize.define('Venta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario: {
        type: DataTypes.STRING(100),
        allowNull: false // "Cliente / Comprador"
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // Guarda fecha y hora automáticamente
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = Venta;