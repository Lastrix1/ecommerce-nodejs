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

// NAVEGACIÓN 

window.irABienvenida = function () {
    Swal.fire({
        title: 'Acceso denegado',
        text: 'Debes ingresar tu nombre para continuar.',
        icon: 'warning',
        timer: 5000,
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('carritoActual');
            localStorage.removeItem('compraConfirmada');
            window.location.href = '../index.html';
        }
    });
};

window.irAProductos = function () {
    const usuario = localStorage.getItem('cliente');
    if (!usuario) {
        Swal.fire({
            title: 'Acceso restringido',
            text: 'Debes ingresar tu nombre para continuar.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    Swal.fire({
        title: 'Acceso denegado',
        text: 'Primero debes iniciar sesión.',
        icon: 'warning',
        confirmButtonColor: '#0d6efd',
        timer: 5000,
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../index.html';
        }
    });
};

window.irACarrito = function () {
    const carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Acceso denegado',
            text: 'Primero debes iniciar sesión.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    window.location.href = './pages/carrito.html';
};

window.irATicket = function () {
    const carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
    if (carrito.length === 0) {
        Swal.fire({
            title: 'Acceso denegado',
            text: 'Primero debes iniciar sesión.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }
    window.location.href = './pages/ticket.html';
};
