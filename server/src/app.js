const express = require('express');
const path = require('path');
const app = express();

// 1. IMPORTAR MODELOS
const { sequelize, Producto, Venta, Usuario } = require('./models');

// 2. CONFIGURAR MOTOR DE PLANTILLAS (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// 3. MIDDLEWARES GLOBALES
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());                          

// 4. ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// 5. RUTAS
const productosApiRoutes = require('./routes/api/productos.routes');

// Express toma las rutas que empiecen con /api/productos
app.use('/api/productos', productosApiRoutes);

app.get('/', (req, res) => {
    res.send('Servidor Backend funcionando correctamente.');
});

// 6. CONEXIÓN A MYSQL Y ARRANQUE
const PORT = process.env.PORT || 3000;

console.log('🔄 Intentando conectar con MySQL Workbench...');

sequelize.sync({ force: false }) 
    .then(async () => {
        console.log('✅ Base de datos MySQL conectada y sincronizada.');

        try {
            const conteoProductos = await Producto.count();
            if (conteoProductos === 0) {
                await Producto.bulkCreate([
                    { nombre: 'Teclado Mecánico RGB', categoria: 'Perifericos', precio: 45000.00, stock: 15, imagen: 'teclado.jpg' },
                    { nombre: 'Mouse Gamer 24000 DPI', categoria: 'Perifericos', precio: 25000.00, stock: 30, imagen: 'mouse.jpg' },
                    { nombre: 'Procesador AMD Ryzen 5', categoria: 'Hardware', precio: 195000.00, stock: 8, imagen: 'ryzen5.jpg' },
                    { nombre: 'Memoria RAM 16GB DDR4', categoria: 'Hardware', precio: 38000.00, stock: 20, imagen: 'ram.jpg' }
                ]);
                console.log('🌱 Productos de prueba cargados con éxito.');
            }

            const conteoUsuarios = await Usuario.count();
            if (conteoUsuarios === 0) {
                await Usuario.create({
                    nombre: 'Admin Punto Tecno',
                    email: 'admin@puntotecno.com',
                    password: 'admin123',
                    rol: 'admin'
                });
                console.log('🌱 Usuario administrador de prueba creado.');
            }
        } catch (errorSeed) {
            console.error('⚠️ Advertencia al cargar datos iniciales:', errorSeed);
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error crítico al conectar la base de datos:', err);
    });