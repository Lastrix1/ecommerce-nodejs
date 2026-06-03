const { Sequelize } = require('sequelize');

// Configuración de los parámetros de la Base de Datos local (MySQL)
const sequelize = new Sequelize('punto_tecno_db', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false 
});

module.exports = sequelize;