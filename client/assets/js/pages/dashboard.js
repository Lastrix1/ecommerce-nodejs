
if (localStorage.getItem("adminLogueado") !== "true") {
    window.location.href = "./login.html";
}

let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];

function renderizarProductos(filtro = "", categoria = "Todos", orden = "") {
    const tabla = document.getElementById("tabla-productos");
    if (!tabla) return;

    const productosAMostrar = productos.filter(producto => {
        const coincideTexto = 
            producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            producto.categoria.toLowerCase().includes(filtro.toLowerCase());

        const coincideCategoria = 
            categoria === "Todos" || producto.categoria === categoria;

        return coincideTexto && coincideCategoria;
    });

    if (orden === "precioAsc")  productosAMostrar.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    if (orden === "precioDesc") productosAMostrar.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    if (orden === "stockAsc")   productosAMostrar.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    if (orden === "stockDesc")  productosAMostrar.sort((a, b) => (b.stock || 0) - (a.stock || 0));

    const cantidadResultados = document.getElementById("cantidad-resultados");
    if (cantidadResultados) {
        cantidadResultados.innerText = `Mostrando ${productosAMostrar.length} productos`;
    }

    tabla.innerHTML = productosAMostrar.map(producto => `
        <tr>
            <td>${producto.id}</td>
            <td>
                <img src="../../img/${producto.imagen}" alt="${producto.nombre}" width="60" class="rounded shadow-sm">
            </td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${producto.precio}</td>
            <td>${renderBadgeStock(producto.stock)}</td>
            <td>${renderBadgeEstado(producto.activo)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProducto(${producto.id})">Editar</button>
                <button class="btn btn-${producto.activo ? 'danger' : 'success'} btn-sm" onclick="cambiarEstado(${producto.id})">
                    ${producto.activo ? 'Desactivar' : 'Activar'}
                </button>
            </td>
        </tr>
    `).join('');
}

function renderBadgeStock(stock) {
    if (stock === 0) return `<span class="badge bg-danger">Sin stock</span>`;
    if (stock < 5) return `<span class="badge bg-warning text-dark">${stock}</span>`;
    return `<span class="badge bg-success">${stock}</span>`;
}

function renderBadgeEstado(activo) {
    return activo 
        ? `<span class="badge bg-success">Activo</span>` 
        : `<span class="badge bg-danger">Inactivo</span>`;
}

function agregarProducto() {
    window.location.href = "./producto-form.html";
}

function editarProducto(id) {
    window.location.href = `./producto-form.html?id=${id}`;
}

function cerrarSesion() {
    localStorage.removeItem("adminLogueado");
    window.location.href = "./login.html";
}

window.editarProducto = editarProducto;

window.cambiarEstado = function(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    Swal.fire({
        title: producto.activo ? "¿Desactivar producto?" : "¿Activar producto?",
        text: producto.activo ? "El producto dejará de verse en la tienda." : "El producto volverá a verse en la tienda.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            producto.activo = !producto.activo;

            localStorage.setItem("productosAdmin", JSON.stringify(productos));

            const busqueda = document.getElementById("buscar-producto")?.value || "";
            const categoria = document.getElementById("filtro-categoria")?.value || "Todos";
            const orden = document.getElementById("ordenar-productos")?.value || "";

            renderizarProductos(busqueda, categoria, orden);
            renderizarEstadisticas();

            Swal.fire({
                icon: "success",
                title: producto.activo ? "Producto activado" : "Producto desactivado",
                timer: 1200,
                showConfirmButton: false
            });
        }
    });
};


function renderizarVentas() {
    const ventas = JSON.parse(localStorage.getItem("historialVentas")) || [];
    const tablaVentas = document.getElementById("tabla-ventas");
    if (!tablaVentas) return;

    tablaVentas.innerHTML = ventas.map(venta => `
        <tr>
            <td>${venta.usuario}</td>
            <td>${venta.fecha}</td>
            <td>$${venta.total}</td>
        </tr>
    `).join('');
}

function renderizarEstadisticas() {
    const ventas = JSON.parse(localStorage.getItem("historialVentas")) || [];
    const productosActivos = productos.filter(p => p.activo).length;
    const totalVendido = ventas.reduce((acc, venta) => acc + venta.total, 0);

    const eProd = document.getElementById("estad-productos");
    const eVent = document.getElementById("estad-ventas");
    const eTotal = document.getElementById("estad-total");

    if (eProd) eProd.innerText = productosActivos;
    if (eVent) eVent.innerText = ventas.length;
    if (eTotal) eTotal.innerText = `$${totalVendido}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscar-producto");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const ordenarProductos = document.getElementById("ordenar-productos");

    const refrescarTabla = () => {
        renderizarProductos(
            buscador?.value || "",
            filtroCategoria?.value || "Todos",
            ordenarProductos?.value || ""
        );
    };

    buscador?.addEventListener("input", refrescarTabla);
    filtroCategoria?.addEventListener("change", refrescarTabla);
    ordenarProductos?.addEventListener("change", refrescarTabla);


    renderizarProductos();
    renderizarVentas();
    renderizarEstadisticas();
});