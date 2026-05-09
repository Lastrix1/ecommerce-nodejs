// SELECCIÓN DE ELEMENTOS
const btnTema = document.getElementById('btn-tema');
const iconoTema = document.getElementById('icono-tema');
const htmlElement = document.documentElement; // Para controlar data-bs-theme

/**
 * Función para aplicar el tema y cambiar el icono
 * @param {string} tema - 'dark' o 'light'
 */
function aplicarTema(tema) {
    if (tema === 'dark') {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        document.body.classList.add('oscuro');
        // Icono a LUNA para el modo oscuro
        if (iconoTema) {
            iconoTema.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
        // Cambiar color del borde del botón para que resalte en oscuro
        btnTema.classList.replace('btn-outline-warning', 'btn-outline-info');
    } else {
        htmlElement.setAttribute('data-bs-theme', 'light');
        document.body.classList.remove('oscuro');
        // Icono a SOL para el modo claro
        if (iconoTema) {
            iconoTema.classList.replace('bi-moon-fill', 'bi-sun-fill');
        }
        btnTema.classList.replace('btn-outline-info', 'btn-outline-warning');
    }
    localStorage.setItem('tema', tema);
}

// LÓGICA DE CLICK EN EL BOTÓN
if (btnTema) {
    btnTema.addEventListener('click', () => {
        const temaActual = htmlElement.getAttribute('data-bs-theme');
        const nuevoTema = (temaActual === 'dark') ? 'light' : 'dark';
        aplicarTema(nuevoTema);
    });
}

// LÓGICA DE ADMIN (Alerta con SweetAlert2)
const btnAdmin = document.getElementById('btn-admin');
if (btnAdmin) {
    btnAdmin.onclick = () => {
        const esOscuro = htmlElement.getAttribute('data-bs-theme') === 'dark';
        Swal.fire({
            title: 'Módulo en Análisis',
            text: 'El panel administrativo está en fase de auditoría técnica.',
            icon: 'info',
            background: esOscuro ? '#333' : '#fff',
            color: esOscuro ? '#fff' : '#000',
            confirmButtonColor: '#007bff',
            confirmButtonText: 'Cerrar',
        });
    };
}

// LÓGICA DE INICIO (Formulario)
const formInicio = document.getElementById('form-inicio');
if (formInicio) {
    formInicio.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre-usuario').value;
        localStorage.setItem('cliente', nombre); 
        window.location.href = "../productos/index.html";
    });
}

// PERSISTENCIA: Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema') || 'light';
    aplicarTema(temaGuardado);
});

// --- NAVEGACIÓN CONTROLADA ---

window.irABienvenida = function () {

    Swal.fire({
        title: 'Acceso denegado',
        text: 'Debes ingresar tu nombre para continuar.',
        icon: 'warning',

        timer: 5000,

    }).then((result) => {

        if (result.isConfirmed) {

            window.location.href =
                "../bienvenida/index.html";
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
        text: `Primero debes iniciar sesión.`,
        icon: 'warning',
        confirmButtonColor: '#0d6efd',

        timer: 5000,

    }).then((result) => {

        if (result.isConfirmed) {

            window.location.href =
                "../bienvenida/index.html";
        }
    });
};

window.irACarrito = function () {

    const usuario = localStorage.getItem('cliente');
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

    window.location.href = "../carrito/index.html";
};

window.irATicket = function () {

    const usuario = localStorage.getItem('cliente');
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

    window.location.href = "../ticket/index.html";
};

