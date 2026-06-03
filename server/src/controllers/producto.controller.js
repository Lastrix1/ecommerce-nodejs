const { Producto } = require('../models');

const productoController = {
    listarTodos: async (req, res) => {
        try {
            const productos = await Producto.findAll();
            // Devuelve los datos en formato JSON para la API
            return res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = productoController;