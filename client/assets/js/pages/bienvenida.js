document.addEventListener("DOMContentLoaded", () => {
    
    const formInicio = document.getElementById('form-inicio');

    if (formInicio) {
        formInicio.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!formInicio.checkValidity()) {
                formInicio.classList.add('was-validated');
                return;
            }

            const nombreUsuario = document.getElementById('nombre-usuario');
            if (nombreUsuario) {
                const nombre = nombreUsuario.value.trim();
                localStorage.setItem('cliente', nombre);
            }

            window.location.href = './pages/productos.html';
        });
    }

    const botonesAdmin = document.querySelectorAll('.btn-admin');
    
    botonesAdmin.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = './pages/admin/login.html';
        });
    });

});