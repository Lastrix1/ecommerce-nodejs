// FORMULARIO DE INICIO
const formInicio = document.getElementById('form-inicio');

if (formInicio) {

    formInicio.addEventListener('submit', (e) => {

        e.preventDefault();

        if (!formInicio.checkValidity()) {

            formInicio.classList.add('was-validated');

            return;
        }

        const nombre =
            document.getElementById('nombre-usuario')
            .value
            .trim();

        localStorage.setItem('cliente', nombre);

        window.location.href = './pages/productos.html';
    });
}

