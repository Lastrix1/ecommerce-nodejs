const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(50),
        allowNull: false // Hardware o Perifericos
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true // Guarda el nombre del archivo de la foto
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true // Activo por defecto 
    }
}, {
    timestamps: false // Evita que Sequelize cree las columnas automáticas createdAt y updatedAt
});

module.exports = Producto;