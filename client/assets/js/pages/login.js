document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("login-form");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (email === "admin@puntotecno.com" && password === "1234") {
            
            localStorage.setItem("adminLogueado", "true");

            window.location.href = "./dashboard.html";

        } else {
            
            const esOscuro = document.documentElement.getAttribute('data-bs-theme') === 'dark';

            Swal.fire({
                icon: "error",
                title: "Acceso denegado",
                text: "Usuario o contraseña incorrectos.",
                confirmButtonColor: "#06b6d4", 
                background: esOscuro ? "#333" : "#fff",
                color: esOscuro ? "#fff" : "#000"
            });
        }
    });
});