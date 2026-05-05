// 1. Variables Globales
let carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
const cliente = localStorage.getItem('cliente') || "Consumidor Final";

// 2. Carga Inicial del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar tema al cargar
    const temaActual = localStorage.getItem('tema');
    if (temaActual === 'dark') document.body.classList.add('oscuro');

    // Dibujar los productos en la pantalla de fondo
    renderizarResumen();

    // --- CONFIGURACIÓN DE BOTONES ---

    // 1. Botón Confirmar
    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) btnConfirmar.onclick = abrirCarrito;

    // 2. Botón Tema 
    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        btnTema.onclick = () => {
            document.body.classList.toggle('oscuro');
            const esOscuro = document.body.classList.contains('oscuro');
            localStorage.setItem('tema', esOscuro ? 'dark' : 'light');
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

// 3. Función para manejar cantidades 
window.actualizarCantidad = (id, cambio, esDesdeModal = false) => {
    const producto = carrito.find(p => p.id === id);
    if (producto) {
        producto.cantidad += cambio;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== id);
        }
    }
    
    // Guardar cambios
    localStorage.setItem('carritoActual', JSON.stringify(carrito));
    
    // Actualizar la pantalla de fondo
    renderizarResumen();

    // Validar si el carrito quedó vacío
    if (carrito.length === 0) {
        if (esDesdeModal) Swal.close();
        Swal.fire('Carrito vacío', 'Redirigiendo a la tienda...', 'info').then(() => {
            window.location.href = "../productos/index.html";
        });
        return;
    }

    if (esDesdeModal) {
        abrirCarrito(); 
    }


};


// 4. Renderizado de la PANTALLA 
function renderizarResumen() {
    const contenedor = document.getElementById('lista-productos');
    const totalTxt = document.getElementById('total-resumen');
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        if (totalTxt) totalTxt.innerText = "Total: $0";
        return;
    }

    let totalAcumulado = 0;
    let html = "";

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        totalAcumulado += subtotal;
        html += `
            <div class="item-carrito" style="border-bottom: 1px solid #eee; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <div><strong>${p.nombre}</strong></div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="actualizarCantidad(${p.id}, -1, false)" style="padding: 5px 10px; cursor: pointer;">-</button>
                    <span>${p.cantidad}</span>
                    <button onclick="actualizarCantidad(${p.id}, 1, false)" style="padding: 5px 10px; cursor: pointer;">+</button>
                    <span style="margin-left: 20px; font-weight: bold;">$${subtotal}</span>
                </div>
            </div>`;
    });

    contenedor.innerHTML = html;
    if (totalTxt) totalTxt.innerText = `Total: $${totalAcumulado}`;
}

// 5. Renderizado del MODAL (SweetAlert2)
async function abrirCarrito() {
    if (carrito.length === 0) return;

    const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

    let detalleHtml = `<div style="text-align: left;">`;
    carrito.forEach(p => {
        detalleHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <span>${p.nombre} (x${p.cantidad})</span>
                <div>
                    <button onclick="actualizarCantidad(${p.id}, -1, true)" style="padding: 2px 6px;">-</button>
                    <button onclick="actualizarCantidad(${p.id}, 1, true)" style="padding: 2px 6px;">+</button>
                    <strong style="margin-left: 10px;">$${p.precio * p.cantidad}</strong>
                </div>
            </div>`;
    });
    detalleHtml += `<div style="font-size: 1.2rem; font-weight: bold; margin-top: 15px;">Total: $${total}</div></div>`;

    const result = await Swal.fire({
        title: 'Confirmar Pedido',
        html: detalleHtml,
        showCancelButton: true,
        confirmButtonText: 'Finalizar Compra',
        cancelButtonText: 'Seguir comprando',
        confirmButtonColor: '#6f6af8',
        width: '500px'
    });

    if (result.isConfirmed) {
// --- LÓGICA DE PERSISTENCIA ---
        
        const nuevaVenta = {
            usuario: cliente, 
            fecha: new Date().toLocaleString(),
            total: carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0),
            productos: carrito 
        };

        const historial = JSON.parse(localStorage.getItem('historialVentas')) || [];

        historial.push(nuevaVenta);

        localStorage.setItem('historialVentas', JSON.stringify(historial));

        window.location.href = "../ticket/index.html";
    }
}


window.salir = () => {

    Swal.fire({

        title: '¿Deseas salir?',

        text: "Se perderan tus productos y el carrito se vaciará.",

        icon: 'warning',

        showCancelButton: true,

        confirmButtonColor: '#d33',

        cancelButtonColor: '#3085d6',

        confirmButtonText: 'Sí, salir',

        cancelButtonText: 'Cancelar'

    }).then((result) => {

        if (result.isConfirmed) {

            localStorage.clear();

            window.location.href = "../bienvenida/index.html";

        }

    });

};

