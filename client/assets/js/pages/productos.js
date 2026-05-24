let productosData = [];
let carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarContador();
});

async function cargarProductos() {
    try {
        const respuesta = await fetch('../assets/data/productos.json');
        productosData = await respuesta.json();
        renderizarTienda('Todos');
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

window.renderizarTienda = function (categoria) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const filtrados = categoria === 'Todos'
        ? productosData
        : productosData.filter(p => p.categoria === categoria);

    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p class="alert alert-info">No hay productos en esta categoría.</p>
            </div>`;
        return;
    }

    filtrados.forEach(p => {
        if (p.activo) {
            contenedor.innerHTML += `
            <div class="col">
                <div class="card h-100 tarjeta-producto shadow-sm">
                    <div id="carousel${p.id}" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-inner p-3">
                            <div class="carousel-item active">
                                <img src="${p.imagen}" class="d-block w-100 img-carousel" alt="${p.nombre}">
                            </div>
                            <div class="carousel-item">
                                <img src="${p.imagen}" class="d-block w-100 img-carousel" style="filter: grayscale(1);" alt="${p.nombre}">
                            </div>
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel${p.id}" data-bs-slide="prev">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel${p.id}" data-bs-slide="next">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    <div class="card-body d-flex flex-column text-center pt-0">
                        <h5 class="fw-bold mb-1 titulo-producto">${p.nombre}</h5>
                        <p class="text-primary fw-bold h5">$${p.precio}</p>
                        <button class="btn btn-primary w-100 rounded-pill mt-auto" onclick="agregar(${p.id})">
                            <i class="bi bi-plus-circle me-2"></i>Agregar
                        </button>
                    </div>
                </div>
            </div>`;
        }
    });
};

window.agregar = function (id) {
    const producto = productosData.find(p => p.id === id);
    if (!producto) return;

    const existe = carrito.find(p => p.id === id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carritoActual', JSON.stringify(carrito));
    actualizarContador();

    Swal.fire({
        title: '¡Añadido al carrito!',
        text: `${producto.nombre} se agregó al carrito`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'bottom-end'
    });
};

function actualizarContador() {
    const btnCarrito = document.getElementById('btn-ver-carrito');
    if (!btnCarrito) return;

    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    btnCarrito.innerHTML = `<i class="bi bi-cart4 me-2"></i>Ver Carrito (${totalItems})`;
}

window.verCarrito = function () {
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Debes agregar productos antes de ver el carrito.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd'
        });
        return;
    }
    window.location.href = './carrito.html';
};

window.cerrarResumen = () => {
    const resumen = document.getElementById('vista-resumen-pedido');
    if (resumen) resumen.style.display = 'none';
};

//  NAVEGACIÓN 

window.irABienvenida = function () {
    Swal.fire({
        title: 'Volver al inicio',
        text: 'Si continúas perderás el progreso actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir a Bienvenida',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#0d6efd'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carritoActual');
            localStorage.removeItem('compraConfirmada');
            window.location.href = '../index.html';
        }
    });
};

window.irAProductos = function () {
    const usuario = localStorage.getItem('cliente');
    if (!usuario) {
        Swal.fire({
            title: 'Acceso restringido',
            text: 'Debes ingresar tu nombre para continuar.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    Swal.fire({
        title: `Estas en la tienda ${usuario}`,
        text: `¿deseas continuar?`,
        icon: 'question',
        confirmButtonColor: '#0d6efd',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = './productos.html';
        }
    });
};

window.irACarrito = function () {
    const usuario = localStorage.getItem('cliente');
    if (!usuario) {
        Swal.fire({
            title: 'Debes iniciar sesión',
            text: 'Ingresa tu nombre primero.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Debes agregar productos antes de ingresar.',
            icon: 'info',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    window.location.href = './carrito.html';
};

window.irATicket = function () {
    const usuario = localStorage.getItem('cliente');
    if (!usuario) {
        Swal.fire({
            title: 'Acceso denegado',
            text: 'Primero debes iniciar sesión.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Sin compra registrada',
            text: 'Debes confirmar tu pedido primero.',
            icon: 'info',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    window.location.href = './ticket.html';
};
