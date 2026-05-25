//CARRITO 
let carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
const cliente = localStorage.getItem('cliente') || "Consumidor Final";

document.addEventListener('DOMContentLoaded', () => {
    renderizarResumen();

    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) btnConfirmar.onclick = finalizarCompra;
});

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
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                        <span class="fw-bold px-2">${p.cantidad}</span>
                        <button class="btn btn-sm btn-outline-success" onclick="actualizarCantidad(${p.id}, 1)">
                            <i class="bi bi-cart-plus"></i>
                        </button>
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
            window.location.href = './productos.html';
        });
    }
};

window.eliminarProducto = (id) => {

    carrito = carrito.filter(p => p.id !== id);

    localStorage.setItem('carritoActual', JSON.stringify(carrito));

    renderizarResumen();

    if (carrito.length === 0) {

        const esOscuro =
            htmlElement.getAttribute('data-bs-theme') === 'dark';

        Swal.fire({
            title: 'Tu carrito quedó vacío',
            text: '¿Qué deseas hacer?',
            icon: 'question',

            showCancelButton: true,

            confirmButtonText: 'Volver a Tienda',
            cancelButtonText: 'Ir a Inicio',


            confirmButtonColor: '#06b6d4',
            cancelButtonColor: '#0891b2',

            background: esOscuro ? '#333' : '#fff',
            color: esOscuro ? '#fff' : '#000'

        }).then((result) => {

            if (result.isConfirmed) {

                window.location.href =
                    "./productos.html";

            } else {

                localStorage.removeItem('cliente');
                localStorage.removeItem('carritoActual');
                localStorage.removeItem('compraConfirmada');

                window.location.href =
                    "../index.html";
            }
        });
    }
};

async function finalizarCompra() {
    if (carrito.length === 0) return;

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
    const oscuro = esOscuro();

    const result = await Swal.fire({
        title: '¿Confirmar Pedido?',
        text: `El total de tu compra es $${total}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Volver a Tienda',
        confirmButtonColor: '#0891b2',
        cancelButtonColor: '#06b6d4',

        background: esOscuro ? '#333' : '#fff',
        color: esOscuro ? '#fff' : '#000',

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

        window.location.href = './ticket.html';
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = './productos.html';
    }
}

window.salir = () => {

    const esOscuro =
        htmlElement.getAttribute('data-bs-theme') === 'dark';

    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Todos los productos serán eliminados.',
        icon: 'warning',
        showCancelButton: true,

        confirmButtonText: 'Ir a Tienda',
        cancelButtonText: 'Ir a Bienvenida',

        confirmButtonColor: '#06b6d4',
        cancelButtonColor: '#0891b2',

        background: esOscuro ? '#333' : '#fff',
        color: esOscuro ? '#fff' : '#000',

    }).then((result) => {

        localStorage.removeItem('carritoActual');
        localStorage.removeItem('compraConfirmada');

        carrito = [];

        if (result.isConfirmed) {

            window.location.href =
                "./productos.html";
        }

        else if (result.dismiss === Swal.DismissReason.cancel) {

            localStorage.removeItem('cliente');

            window.location.href =
                "../index.html";
        }
    });
};