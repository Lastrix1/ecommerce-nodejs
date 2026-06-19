document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-bienvenida");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const nombre = document.getElementById("nombre-cliente").value.trim();
            if (!nombre) return;
            localStorage.setItem("cliente", nombre);
            window.location.href = "./pages/productos.html";
        });
    }

});