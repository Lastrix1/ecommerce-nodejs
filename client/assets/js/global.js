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

function crearFooter() {
    const footer = document.createElement('footer');
    footer.textContent = "Integrantes: Busico Lautaro, Pertot Mabel, Raczkowski Martin."
    document.body.append(footer);
}

window.addEventListener('DOMContentLoaded', () => {
    const temaGuardado = localStorage.getItem('tema') || 'light';
    aplicarTema(temaGuardado);
    crearFooter();
});

function esOscuro() {
    return htmlElement.getAttribute('data-bs-theme') === 'dark';
}
