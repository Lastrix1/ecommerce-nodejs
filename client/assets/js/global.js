const htmlElement = document.documentElement;
const btnTema = document.getElementById('btn-tema');
const iconoTema = document.getElementById('icono-tema');

function aplicarTema(tema) {
    if (tema === 'dark') {
        htmlElement.setAttribute('data-bs-theme', 'dark');
        document.body.classList.add('oscuro');
        if (iconoTema) {
            iconoTema.classList.replace('bi-sun-fill', 'bi-moon-fill');
        }
        btnTema?.classList.replace('btn-outline-warning', 'btn-outline-info');
    } else {
        htmlElement.setAttribute('data-bs-theme', 'light');
        document.body.classList.remove('oscuro');
        if (iconoTema) {
            iconoTema.classList.replace('bi-moon-fill', 'bi-sun-fill');
        }
        btnTema?.classList.replace('btn-outline-info', 'btn-outline-warning');
    }
    localStorage.setItem('tema', tema);
}

if (btnTema) {
    btnTema.addEventListener('click', () => {
        const temaActual = htmlElement.getAttribute('data-bs-theme');
        aplicarTema(temaActual === 'dark' ? 'light' : 'dark');
    });
}

const btnAdmin = document.getElementById('btn-admin');
if (btnAdmin) {
    btnAdmin.addEventListener('click', () => {
        const oscuro = esOscuro();
        Swal.fire({
            title: 'Módulo en Análisis',
            text: 'Se encuentra en fase de desarrollo.',
            icon: 'info',
            background: oscuro ? '#333' : '#fff',
            color: oscuro ? '#fff' : '#000',
            confirmButtonColor: '#06b6d4',
            confirmButtonText: 'Cerrar',
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema') || 'light';
    aplicarTema(temaGuardado);
    crearFooter();
});

function esOscuro() {
    return htmlElement.getAttribute('data-bs-theme') === 'dark';
}
