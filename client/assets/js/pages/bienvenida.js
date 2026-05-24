const formInicio = document.getElementById('form-inicio');
if (formInicio) {
    formInicio.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputNombre = document.getElementById('nombre-usuario');
        const nombre = inputNombre.value.trim();
        const oscuro = esOscuro();

        if (!nombre) {
            Swal.fire({
                title: 'Campo vacío',
                text: 'Por favor, ingresa tu nombre.',
                icon: 'warning',
                background: oscuro ? '#333' : '#fff',
                color: oscuro ? '#fff' : '#000',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#0d6efd',
            });
            return;
        }
        if (nombre.length < 4) {
            Swal.fire({
                title: 'Nombre demasiado corto',
                text: 'El nombre debe tener al menos 4 caracteres.',
                icon: 'warning',
                background: oscuro ? '#333' : '#fff',
                color: oscuro ? '#fff' : '#000',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#0d6efd',
            });
            return;
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
            Swal.fire({
                title: 'Caracteres inválidos',
                text: 'El nombre solo puede contener letras.',
                icon: 'warning',
                background: oscuro ? '#333' : '#fff',
                color: oscuro ? '#fff' : '#000',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#0d6efd',
            });
            return;
        }
        localStorage.setItem('cliente', nombre);
        window.location.href = './pages/productos.html';
    });
}

const btnAdmin = document.getElementById('btn-admin');
if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
        const oscuro = esOscuro();
        Swal.fire({
            title: 'Módulo en Análisis',
            text: 'El panel administrativo está en fase de auditoría técnica.',
            icon: 'info',
            background: oscuro ? '#333' : '#fff',
            color: oscuro ? '#fff' : '#000',
            confirmButtonColor: '#007bff',
            confirmButtonText: 'Cerrar',
        });
    });
}
