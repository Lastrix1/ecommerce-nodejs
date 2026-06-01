
document.addEventListener("DOMContentLoaded", () => {
    
    const adminLogueado = localStorage.getItem("adminLogueado");
    if (adminLogueado !== "true") {
        window.location.href = "./login.html";
        return; 
    }

    const params = new URLSearchParams(window.location.search);
    const idEditar = params.get("id");

    const form = document.getElementById("form-producto");
    if (!form) return;

    let productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];

    if (idEditar) {
        const producto = productos.find(p => p.id == idEditar);

        if (producto) {
            establecerValorInput("nombre", producto.nombre);
            establecerValorInput("precio", producto.precio);
            establecerValorInput("imagen", producto.imagen);
            establecerValorInput("categoria", producto.categoria);
            establecerValorInput("stock", producto.stock);
            
            const inputActivo = document.getElementById("activo");
            if (inputActivo) inputActivo.checked = producto.activo;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        productos = JSON.parse(localStorage.getItem("productosAdmin")) || [];

        const nuevoProducto = {
            id: idEditar ? Number(idEditar) : Date.now(),
            nombre: document.getElementById("nombre")?.value || "",
            precio: Number(document.getElementById("precio")?.value || 0),
            imagen: document.getElementById("imagen")?.value || "",
            categoria: document.getElementById("categoria")?.value || "",
            activo: document.getElementById("activo")?.checked || false,
            stock: Number(document.getElementById("stock")?.value || 0)
        };

        if (idEditar) {
            const indice = productos.findIndex(p => p.id == idEditar);
            if (indice !== -1) {
                productos[indice] = nuevoProducto;
            }
        } else {
            productos.push(nuevoProducto);
        }

        localStorage.setItem("productosAdmin", JSON.stringify(productos));

        Swal.fire({
            icon: "success",
            title: idEditar ? "Producto actualizado" : "Producto creado",
            text: idEditar 
                ? "Los cambios fueron guardados correctamente." 
                : "El producto fue agregado correctamente.",
            confirmButtonColor: "#06b6d4",
            timer: 1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.href = "./dashboard.html";
            }
        });
    });
});

function establecerValorInput(idElemento, valor) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.value = valor;
    }
}