const express = require('express');
const router = express.Router();

const { validateProducto, validateActualizarProducto } = require('../../middlewares/producto.validation');
const productoController = require('../../controllers/producto.controller');
const upload = require('../../config/multer');
const { verificarToken, soloAdmin } = require('../../middlewares/auth.middleware');

// Rutas públicas — cualquiera puede ver productos
router.get('/', productoController.listarTodos);
router.get('/:id', productoController.obtenerPorId);

// Rutas protegidas — solo admins autenticados pueden crear/editar
router.post('/', verificarToken, soloAdmin, upload.single('imagen'), validateProducto, productoController.crearProducto);
router.put('/:id', verificarToken, soloAdmin, upload.single('imagen'), validateActualizarProducto, productoController.actualizarProducto);

module.exports = router;