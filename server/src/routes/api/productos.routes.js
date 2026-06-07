const express = require('express');
const router = express.Router();

const validateProducto = require('../../middlewares/producto.validation');
const productoController = require('../../controllers/producto.controller');

router.get('/', productoController.listarTodos);
router.get('/:id', productoController.obtenerPorId);

router.post('/', validateProducto, productoController.crearProducto);
router.put('/:id', validateProducto, productoController.actualizarProducto);

module.exports = router;