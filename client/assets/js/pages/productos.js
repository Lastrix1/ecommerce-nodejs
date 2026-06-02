
let productosData = [];
let carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];

let paginaActual = 1;

const productosPorPagina = 8;

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    
    const btnCarrito = document.getElementById('btn-ver-carrito');
    if (btnCarrito) {
        btnCarrito.onclick = verCarrito;
    }
    
    actualizarContador();
});

function cargarProductos() {
    const productosGuardados = JSON.parse(localStorage.getItem("productosAdmin"));
    
    productosData = (productosGuardados && productosGuardados.length > 0) 
        ? productosGuardados 
        : [];

    renderizarTienda("Todos");
}

window.renderizarTienda = function (categoria) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    // 1. Filtrar los productos por categoría y estado activo
    const filtrados = productosData.filter(p => {
        const coincideCategoria = (categoria === 'Todos' || p.categoria === categoria);
        return coincideCategoria && p.activo;
    });

    // Si no hay productos, mostrar el cartel de alerta
    if (filtrados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center p-5">
                <p class="alert alert-info d-inline-block px-5">No hay productos disponibles en esta categoría actualmente.</p>
            </div>`;
        return;
    }

    // 2. Lógica de Paginación (Acomodada en su lugar correcto)
    const inicio = (paginaActual - 1) * productosPorPagina;
    const fin = inicio + productosPorPagina;
    const productosPagina = filtrados.slice(inicio, fin);

    // 3. Renderizar las tarjetas de los productos de la página actual
    contenedor.innerHTML = productosPagina.map(p => `
        <div class="col">
            <div class="card h-100 tarjeta-producto shadow-sm">
                <div id="carouselProd${p.id}" class="carousel slide" data-bs-ride="false">
                    <div class="carousel-inner p-3">
                        <div class="carousel-item active">
                            <img src="${p.imagen}" class="d-block w-100 img-carousel" alt="${p.nombre}">
                        </div>
                        <div class="carousel-item">
                            <img src="${p.imagen}" class="d-block w-100 img-carousel" style="filter: grayscale(1);" alt="${p.nombre}">
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselProd${p.id}" data-bs-slide="prev">
                        <i class="bi bi-chevron-left text-dark fs-4"></i>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselProd${p.id}" data-bs-slide="next">
                        <i class="bi bi-chevron-right text-dark fs-4"></i>
                    </button>
                </div>
                <div class="card-body d-flex flex-column text-center pt-0">
                    <h5 class="fw-bold mb-1 titulo-producto">${p.nombre}</h5>
                    <p class="text-primary fw-bold h5">$${p.precio.toLocaleString('es-AR')}</p>
                    <button class="btn btn-primary w-100 rounded-pill mt-auto" onclick="agregar(${p.id})">
                        <i class="bi bi-plus-circle me-2"></i>Agregar
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // 4. Dibujar la botonera de paginación
    renderizarPaginacion(filtrados.length, categoria);
};

function renderizarPaginacion(totalProductos, categoria) {
    const contenedor = document.getElementById("paginacion-tienda");
    if (!contenedor) return;

    const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
    contenedor.innerHTML = "";

    if (totalPaginas <= 1) return;

    const esPrimero = paginaActual === 1;
    const claseAnterior = esPrimero ? "btn-paginacion-deshabilitado" : "btn-paginacion-flecha";

    contenedor.innerHTML += `
        <button class="${claseAnterior}" ${esPrimero ? "disabled" : ""} onclick="irPagina(${paginaActual - 1}, '${categoria}')">
            <i class="bi bi-chevron-left me-1"></i> Anterior
        </button>
    `;

    const esUltimo = paginaActual === totalPaginas;
    const claseSiguiente = esUltimo ? "btn-paginacion-deshabilitado" : "btn-paginacion-flecha";

    contenedor.innerHTML += `
        <button class="${claseSiguiente}" ${esUltimo ? "disabled" : ""} onclick="irPagina(${paginaActual + 1}, '${categoria}')">
            Siguiente <i class="bi bi-chevron-right ms-1"></i>
        </button>
    `;
}

window.irPagina = function (pagina, categoria) {
    paginaActual = pagina;
    renderizarTienda(categoria);
};

window.agregar = function (id) {
    const producto = productosData.find(p => p.id == id);
    if (!producto) return;

    const existe = carrito.find(p => p.id == id);
    if (existe) {
        existe.cantidad++;
    } else {
        // Mantiene cantidad y quantity para no romper compatibilidades
        carrito.push({ ...producto, quantity: 1, cantidad: 1 });
    }

    localStorage.setItem('carritoActual', JSON.stringify(carrito));
    actualizarContador();

    // Notificación Toast flotante abajo a la derecha
    Swal.fire({
        title: '¡Añadido al carrito!',
        text: `${producto.nombre} se agregó al carrito`,
        icon: 'success',
        timer: 1500,
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
            text: 'Debes agregar productos antes de ver el resumen.',
            icon: 'warning',
            confirmButtonColor: '#06b6d4'
        });
        return;
    }
    window.location.href = './carrito.html';
};