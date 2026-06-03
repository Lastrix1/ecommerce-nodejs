const express = require('express');
const router = express.Router();
const productoController = require('../../controllers/producto.controller'); 

// Cuando entren a esta ruta, se ejecuta el controlador
router.get('/', productoController.listarTodos);

module.exports = router;