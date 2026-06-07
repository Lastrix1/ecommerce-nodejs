document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-producto");
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id"); 

    if (productoId && productoId !== "null" && productoId !== "undefined") {
        fetch(`http://localhost:3000/api/productos/${productoId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`El producto con ID ${productoId} no existe.`);
                }
                return res.json();
            })
            .then(producto => {
                document.getElementById("nombre").value = producto.nombre || "";
                document.getElementById("precio").value = producto.precio || "";
                document.getElementById("stock").value = producto.stock || "";
                document.getElementById("imagen").value = producto.imagen || "";
                document.getElementById("categoria").value = producto.categoria || "";
                document.getElementById("activo").checked = producto.activo == 1 || producto.activo == true;
            })
            .catch(err => {
                console.error("Error al cargar ficha de producto:", err);
                Swal.fire({
                    icon: "error",
                    title: "Producto no encontrado",
                    text: "El artículo que intentás editar no existe."
                }).then(() => {
                    window.location.href = "./dashboard.html";
                });
            });
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const productoData = {
            nombre: document.getElementById("nombre").value.trim(),
            precio: parseFloat(document.getElementById("precio").value),
            stock: parseInt(document.getElementById("stock").value),
            imagen: document.getElementById("imagen").value.trim() || "favicon.png",
            categoria: document.getElementById("categoria").value,
            activo: document.getElementById("activo").checked ? 1 : 0
        };

        try {
            let url = "http://localhost:3000/api/productos";
            let metodo = "POST"; 

            if (productoId && productoId !== "null" && productoId !== "undefined") {
                url = `http://localhost:3000/api/productos/${productoId}`;
                metodo = "PUT"; 
            }

            const respuesta = await fetch(url, {
                method: metodo,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productoData)
            });

            if (!respuesta.ok) throw new Error("Error en la operación del servidor");

            await Swal.fire({
                icon: "success",
                title: productoId ? "Producto actualizado" : "Producto guardado con éxito",
                text: "Los cambios impactaron en la base de datos.",
                timer: 1500,
                showConfirmButton: false
            });

            window.location.href = "./dashboard.html";

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error de guardado",
                text: "No se pudo sincronizar el cambio con el backend."
            });
        }
    });
});

if (localStorage.getItem("adminLogueado") !== "true") {
    window.location.href = "./login.html";
}