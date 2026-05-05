let productosData = [];
let carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuración de Tema
    if (localStorage.getItem('tema') === 'dark') document.body.classList.add('oscuro');
    
    // 2. Carga inicial
    cargarProductos(); 
    actualizarContador();

    // 3. Lógica Botón Tema
    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        btnTema.onclick = () => {
            document.body.classList.toggle('oscuro');
            localStorage.setItem('tema', document.body.classList.contains('oscuro') ? 'dark' : 'light');
        };
    }

// LÓGICA DE ADMIN (LocalStorage)
const btnAdmin = document.getElementById('btn-admin');
    if (btnAdmin) {
        btnAdmin.onclick = () => {
            const esOscuro = document.body.classList.contains('oscuro');
            Swal.fire({
                title: 'Módulo en Análisis',
                text: 'El panel administrativo está en fase de auditoría técnica.',
                icon: 'info',
                background: esOscuro ? '#333' : '#fff',
                color: esOscuro ? '#fff' : '#000',
                confirmButtonColor: '#007bff',
                confirmButtonText: 'Cerrar',
            });
        };
    }
});

async function cargarProductos() {
    try {
        const respuesta = await fetch('../json/productos.json');
        productosData = await respuesta.json();
        renderizarTienda('Todos'); 
    } catch (error) {
        console.error("Error al cargar productos", error);
    }
}

function renderizarTienda(categoria) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;
    contenedor.innerHTML = ''; 
    
    const filtrados = categoria === 'Todos' 
        ? productosData 
        : productosData.filter(p => p.categoria === categoria);

    filtrados.forEach(p => {
        if (p.activo) {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <img src="${p.imagen}" alt="${p.nombre}">
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio}</p>
                    <button onclick="agregar(${p.id})">Agregar</button> 
                </div>`;
        }
    });
}

window.renderizarTienda = function(categoria) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;
    contenedor.innerHTML = ''; 
    
    const filtrados = categoria === 'Todos' 
        ? productosData 
        : productosData.filter(p => p.categoria === categoria);

    if (filtrados.length === 0) {
        contenedor.innerHTML = '<p>No hay productos en esta categoría.</p>';
        return;
    }

    filtrados.forEach(p => {
        if (p.activo) {
            contenedor.innerHTML += `
                <div class="tarjeta">
                    <img src="${p.imagen}" alt="${p.nombre}">
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio}</p>
                    <button onclick="agregar(${p.id})">Agregar</button> 
                </div>`;
        }
    });
};

// Las funciones de agregar y contador 
window.agregar = function(id) {
    const producto = productosData.find(p => p.id === id);
    if (producto) {
        const existe = carrito.find(p => p.id === id);
        if (existe) { existe.cantidad++; } 
        else { carrito.push({ ...producto, cantidad: 1 }); }
        
        localStorage.setItem('carritoActual', JSON.stringify(carrito));
        actualizarContador();
        Swal.fire({ title: '¡Añadido!', icon: 'success', timer: 600, showConfirmButton: false });
    }
};

function actualizarContador() {
    const btnCarrito = document.getElementById('btn-ver-carrito');
    if (btnCarrito) {
        const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
        btnCarrito.innerText = `Ver Carrito (${totalItems})`;
    }
}

window.verCarrito = () => {
    if (carrito.length === 0) {
        Swal.fire('Carrito vacío', '', 'warning');
        return;
    }
    window.location.href = "../carrito/index.html";
};
