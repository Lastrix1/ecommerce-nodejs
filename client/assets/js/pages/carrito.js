
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

    contenedor.innerHTML = carrito.map(p => {
        const subtotal = p.precio * p.cantidad;
        totalAcumulado += subtotal;
        totalCant += p.cantidad;

        return `
            <div class="card card-carrito shadow-sm p-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-3 col-md-2">
                        <img src="${p.imagen}" class="item-carrito-img img-fluid rounded" alt="${p.nombre}">
                    </div>
                    <div class="col-9 col-md-5">
                        <h5 class="mb-0 fw-bold">${p.nombre}</h5>
                        <small class="text-secondary">Precio unitario: $${p.precio}</small>
                    </div>
                    <div class="col-12 col-md-5 d-flex align-items-center justify-content-md-end gap-2 mt-3 mt-md-0">
                        <button class="btn btn-sm btn-outline-secondary" onclick="actualizarCantidad(${p.id}, -1)">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="fw-bold px-2">${p.cantidad}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="actualizarCantidad(${p.id}, 1)">
                            <i class="bi bi-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-3" onclick="eliminarProducto(${p.id})">
                            <i class="bi bi-trash"></i> Borrar
                        </button>
                    </div>
                </div>
            </div>`;
    }).join('');

    if (totalTxt) totalTxt.innerText = `$${totalAcumulado.toLocaleString()}`;
    if (cantTxt) cantTxt.innerText = totalCant;
}

window.actualizarCantidad = (id, cambio) => {
    localStorage.setItem('compraConfirmada', 'false');
    const producto = carrito.find(p => p.id === id);
    
    if (producto) {
        producto.cantidad += cambio;

        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        } else {
            Swal.fire({
                title: 'Carrito actualizado',
                text: `${producto.nombre}: ${producto.cantidad} un.`,
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: 'bottom-end'
            });
        }
    }

    guardarYRefrescar();
};

window.eliminarProducto = (id) => {
    const producto = carrito.find(p => p.id === id);
    if (!producto) return;

    carrito = carrito.filter(p => p.id !== id);

    Swal.fire({
        title: 'Producto eliminado',
        text: `${producto.nombre} se quitó del carrito`,
        icon: 'info',
        timer: 1500,
        showConfirmButton: false, 
        toast: true,
        position: 'bottom-end'
    });
 
    guardarYRefrescar();
};

async function finalizarCompra() {
    if (carrito.length === 0) return;

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    const result = await Swal.fire({
        title: '¿Confirmar Pedido?',
        text: `El total de tu compra es $${total.toLocaleString()}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'No, volver',
        confirmButtonColor: '#06b6d4',
        reverseButtons: true
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
    }
}

window.salir = () => {
    Swal.fire({
        title: '¿Vaciar carrito?',
        text: 'Todos los productos serán eliminados del pedido actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'No, continuar',
        confirmButtonColor: '#d33',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed){
            localStorage.removeItem('carritoActual');
            localStorage.setItem('compraConfirmada', 'false');
            carrito = [];
            window.location.href = "./productos.html";
        }
    });
};

function guardarYRefrescar() {
    localStorage.setItem('carritoActual', JSON.stringify(carrito));
    renderizarResumen();

    if (carrito.length === 0) {
        const esOscuro = document.documentElement.getAttribute('data-bs-theme') === 'dark';

        Swal.fire({
            title: 'Carrito vacío',
            text: 'No quedan elementos. ¿A dónde deseas ir?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Ir a Inicio',
            cancelButtonText: 'Volver a Tienda',
            background: esOscuro ? '#333' : '#fff',
            color: esOscuro ? '#fff' : '#000'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../index.html";
            } else {
                window.location.href = "./productos.html";
            }
        });
    }
}