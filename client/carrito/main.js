// 1. Variables Globales
let carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
const cliente = localStorage.getItem('cliente') || "Consumidor Final";

const htmlElement = document.documentElement;
const btnTema = document.getElementById('btn-tema');
const iconoTema = document.getElementById('icono-tema');

// 2. Carga Inicial del DOM
document.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema') || 'light';
    aplicarTema(temaGuardado);

    renderizarResumen();

    // Eventos de botones
    if (btnTema) {
        btnTema.onclick = () => {
            const nuevoTema = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
            aplicarTema(nuevoTema);
        };
    }

    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) btnConfirmar.onclick = finalizarCompra;

    const btnAdmin = document.getElementById('btn-admin');
    if (btnAdmin) {
        btnAdmin.onclick = () => {
            const esOscuro = htmlElement.getAttribute('data-bs-theme') === 'dark';
            Swal.fire({
                title: 'Módulo en Análisis',
                text: 'El panel administrativo está en fase de auditoría técnica.',
                icon: 'info',
                background: esOscuro ? '#333' : '#fff',
                color: esOscuro ? '#fff' : '#000',
            });
        };
    }
});

// --- FUNCIONES DE TEMA ---
function aplicarTema(tema) {
    htmlElement.setAttribute('data-bs-theme', tema);
    localStorage.setItem('tema', tema);
    if (tema === 'dark') {
        iconoTema.className = 'bi bi-moon-fill';
        btnTema.classList.replace('btn-outline-warning', 'btn-outline-info');
    } else {
        iconoTema.className = 'bi bi-sun-fill';
        btnTema.classList.replace('btn-outline-info', 'btn-outline-warning');
    }
}

// --- RENDERIZADO DEL CARRITO ---
function renderizarResumen() {
    const contenedor = document.getElementById('lista-productos');
    const totalTxt = document.getElementById('total-resumen');
    const cantTxt = document.getElementById('cant-items');
    
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center p-5 bg-body-tertiary rounded-4">
                <i class="bi bi-cart-x display-1 text-secondary"></i>
                <p class="mt-3">Tu carrito está actualmente vacío.</p>
            </div>`;
        if (totalTxt) totalTxt.innerText = "$0";
        if (cantTxt) cantTxt.innerText = "0";
        return;
    }

    let totalAcumulado = 0;
    let totalCant = 0;
    contenedor.innerHTML = "";

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        totalAcumulado += subtotal;
        totalCant += p.cantidad;

        contenedor.innerHTML += `
            <div class="card card-carrito shadow-sm p-3">
                <div class="row align-items-center">
                    <div class="col-3 col-md-2">
                        <img src="${p.imagen}" class="item-carrito-img img-fluid rounded" alt="${p.nombre}">
                    </div>
                    <div class="col-9 col-md-5">
                        <h5 class="mb-0 fw-bold">${p.nombre}</h5>
                        <small class="text-secondary">Precio unitario: $${p.precio}</small>
                    </div>
                    <div class="col-6 col-md-3 d-flex align-items-center gap-2 mt-3 mt-md-0">
                        <button class="btn btn-sm btn-outline-primary" onclick="actualizarCantidad(${p.id}, -1)">-</button>
                        <span class="fw-bold px-2">${p.cantidad}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="actualizarCantidad(${p.id}, 1)">+</button>
                    </div>
                    <div class="col-6 col-md-2 text-end mt-3 mt-md-0">
                        <span class="fw-bold text-primary">$${subtotal}</span>
                    </div>
                </div>
            </div>`;
    });

    if (totalTxt) totalTxt.innerText = `$${totalAcumulado}`;
    if (cantTxt) cantTxt.innerText = totalCant;
}

window.actualizarCantidad = (id, cambio) => {

    localStorage.setItem('compraConfirmada', 'false');
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
    }
    localStorage.setItem('carritoActual', JSON.stringify(carrito));
    renderizarResumen();

    if (carrito.length === 0) {
        Swal.fire('Carrito vacío', 'Regresando a la tienda...', 'info').then(() => {
            window.location.href = "../productos/index.html";
        });
    }
};

// --- FINALIZAR COMPRA ---
async function finalizarCompra() {
    if (carrito.length === 0) return;

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const esOscuro = htmlElement.getAttribute('data-bs-theme') === 'dark';

    const result = await Swal.fire({
        title: '¿Confirmar Pedido?',
        text: `El total de tu compra es $${total}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Seguir comprando',
        background: esOscuro ? '#333' : '#fff',
        color: esOscuro ? '#fff' : '#000',
        confirmButtonColor: '#0d6efd'
    });

    if (result.isConfirmed) {

        localStorage.setItem('compraConfirmada', 'true');

        const nuevaVenta = {
            usuario: cliente, 
            fecha: new Date().toLocaleString(),
            total: total,
            productos: carrito 
        };

        const historial = JSON.parse(localStorage.getItem('historialVentas')) || [];
        historial.push(nuevaVenta);
        localStorage.setItem('historialVentas', JSON.stringify(historial));

        window.location.href = "../ticket/index.html";
    }else if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = "../productos/index.html";
    }
}

window.salir = () => {
    const esOscuro = htmlElement.getAttribute('data-bs-theme') === 'dark';
    Swal.fire({
        title: '¿Vaciar carrito y salir?',
        text: "Se perderán tus productos seleccionados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, quedarme',
        background: esOscuro ? '#333' : '#fff',
        color: esOscuro ? '#fff' : '#000',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carritoActual');
            localStorage.removeItem('compraConfirmada');
            
            Swal.fire({
                title: '¡Hasta pronto!',
                text: 'En breve se reiniciará el sistema, redirigiendo ...',
                icon: 'success',
                timer: 3500, 
                timerProgressBar: true, 
                showConfirmButton: false,
                allowOutsideClick: false,
                background: esOscuro ? '#333' : '#fff',
                color: esOscuro ? '#fff' : '#000',
                willClose: () => {
                    window.location.href = "../bienvenida/index.html";
                }
            });


        }
    });
};

// --- NAVEGACIÓN CONTROLADA ---

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

    window.location.href = "../productos/index.html";
};

window.irACarrito = function () {

    const usuario = localStorage.getItem('cliente');
    const carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];

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

    Swal.fire({
        title: `Estas en el carrito ${usuario}`,
        text: `Presiona "Confirmar Pedido" o "Salir" para continuar.`,
        icon: 'info',
        confirmButtonColor: '#0d6efd',

        timer: 5000,
    }).then((result) => {

        if (result.isConfirmed) {
            window.location.href = "../carrito/index.html";
        }
    });
};

window.irATicket = function () {

    const usuario =
        localStorage.getItem('cliente');

    const carrito =
        JSON.parse(localStorage.getItem('carritoActual')) || [];

    const compraConfirmada =
        localStorage.getItem('compraConfirmada');

    // VALIDAR LOGIN
    if (!usuario) {

        Swal.fire({
            title: 'Acceso denegado',
            text: 'Primero debes iniciar sesión.',
            icon: 'warning',

            timer: 2500,
            showConfirmButton: false
        });

        return;
    }

    // VALIDAR CARRITO
    if (carrito.length === 0) {

        Swal.fire({
            title: 'Carrito vacío',
            text: 'Debes agregar productos.',
            icon: 'info',

            timer: 2500,
            showConfirmButton: false
        });

        return;
    }

    // VALIDAR COMPRA CONFIRMADA
    if (!compraConfirmada) {

        Swal.fire({
            title: 'Pedido no confirmado',
            text: 'Debes confirmar el pedido antes de continuar.',
            icon: 'warning',

            timer: 3000,
            showConfirmButton: false
        });

        return;
    }

    if (compraConfirmada === 'false') {

        Swal.fire({
            title: 'Pedido pendiente',
            text: 'Tu compra aún no ha sido confirmada.',
            icon: 'info',

            timer: 3000,
            showConfirmButton: false
        });
    }
}

