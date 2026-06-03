const sequelize = require('../config/db');
const Producto = require('./Producto');
const Venta = require('./Venta');
const Usuario = require('./Usuario');

Venta.belongsToMany(Producto, { through: 'Venta_Productos', foreignKey: 'venta_id' });
Producto.belongsToMany(Venta, { through: 'Venta_Productos', foreignKey: 'producto_id' });

module.exports = {
    sequelize,
    Producto,
    Venta,
    Usuario 
};