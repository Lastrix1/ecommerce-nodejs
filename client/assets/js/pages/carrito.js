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
                        <button class="btn btn-sm btn-outline-primary" onclick="actualizarCantidad(${p.id}, -1)">-</button>
                        <span class="fw-bold px-2">${p.cantidad}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="actualizarCantidad(${p.id}, 1)">+</button>
                    </div>
                    <div class="col-6 col-md-2 text-end mt-3 mt-md-0">
                        <span class="fw-bold text-primary">$${subtotal}</span>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarProducto(${p.id})">
                            <i class="bi bi-trash"></i>
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
        cancelButtonText: 'Seguir comprando',
        background: oscuro ? '#333' : '#fff',
        color: oscuro ? '#fff' : '#000',
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

        window.location.href = './ticket.html';
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = './productos.html';
    }
}

window.salir = () => {
    const oscuro = esOscuro();
    Swal.fire({
        title: '¿Vaciar carrito y salir?',
        text: "Se perderán tus productos seleccionados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, quedarme',
        background: oscuro ? '#333' : '#fff',
        color: oscuro ? '#fff' : '#000',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carritoActual');
            carrito = [];
            renderizarResumen();

            Swal.fire({
                title: 'Carrito vaciado',
                text: 'Tu carrito fue limpiado correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: oscuro ? '#333' : '#fff',
                color: oscuro ? '#fff' : '#000',
            });
        }
    });
};

//NAVEGACIÓN

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
    window.location.href = './productos.html';
};

window.irACarrito = function () {
    const usuario = localStorage.getItem('cliente');
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual')) || [];

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

    if (carritoActual.length === 0) {
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
            window.location.href = './carrito.html';
        }
    });
};

window.irATicket = function () {
    const usuario = localStorage.getItem('cliente');
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual')) || [];
    const compraConfirmada = localStorage.getItem('compraConfirmada');

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

    if (carritoActual.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Debes agregar productos.',
            icon: 'info',
            timer: 2500,
            showConfirmButton: false
        });
        return;
    }

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
        return;
    }

    window.location.href = './ticket.html';
};
