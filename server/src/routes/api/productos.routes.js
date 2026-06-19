const express = require('express');
const router = express.Router();

const { validateProducto, validateActualizarProducto } = require('../../middlewares/producto.validation');
const productoController = require('../../controllers/producto.controller');
const upload = require('../../config/multer');

router.get('/', productoController.listarTodos);
router.get('/:id', productoController.obtenerPorId);

router.post('/', upload.single('imagen'), validateProducto, productoController.crearProducto);
router.put('/:id', upload.single('imagen'), validateActualizarProducto, productoController.actualizarProducto);
module.exports = router;