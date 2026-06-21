const express = require('express');
const router = express.Router();
const ventaController = require('../../controllers/venta.controller');
const validarVenta = require('../../middlewares/venta.validation');
const { verificarToken, soloAdmin } = require('../../middlewares/auth.middleware');

// Crear venta — usuario autenticado (o anónimo con nombre_cliente)
router.post('/', validarVenta, ventaController.crearVenta);

// Ver todas las ventas — solo admin
router.get('/', verificarToken, soloAdmin, ventaController.listarTodas);

// Ver mis compras — usuario autenticado
router.get('/usuario/:id', verificarToken, ventaController.listarPorUsuario);

module.exports = router;