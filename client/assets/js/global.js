/* -------------------------------------------------------------------------- */
/* 1. EJECUCIÓN INMEDIATA (EVITA EL PARPADEO / FLASH BLANCO)                  */
/* -------------------------------------------------------------------------- */

const htmlElement = document.documentElement;

// 🟢 SOLUCIÓN: Leemos y aplicamos el atributo de Bootstrap antes de que se dibuje el body
const temaGuardado = localStorage.getItem('tema') || 'light';
htmlElement.setAttribute('data-bs-theme', temaGuardado);

/* -------------------------------------------------------------------------- */
/* 2. INICIALIZACIÓN DE COMPONENTES DEL DOM                                   */
/* -------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const btnTema = document.getElementById('btn-tema');
    const iconoTema = document.getElementById('icono-tema');
    const btnAdmin = document.getElementById('btn-admin');

    // Sincronizamos los elementos visuales (íconos y botones) con el tema ya aplicado
    sincronizarComponentesVisuales(temaGuardado, btnTema, iconoTema);

    // Evento para alternar entre modos
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            const temaActual = htmlElement.getAttribute('data-bs-theme');
            const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';
            
            // Cambiar atributo global y guardar en disco
            htmlElement.setAttribute('data-bs-theme', nuevoTema);
            localStorage.setItem('tema', nuevoTema);
            
            // Actualizar la interfaz
            sincronizarComponentesVisuales(nuevoTema, btnTema, iconoTema);
        });
    }

    // Modal de desarrollo del Módulo Administrador
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
});

/* -------------------------------------------------------------------------- */
/* 3. FUNCIONES AUXILIARES Y RENDERIZADO VISUAL                               */
/* -------------------------------------------------------------------------- */

function sincronizarComponentesVisuales(tema, btnTema, iconoTema) {
    if (tema === 'dark') {
        document.body.classList.add('oscuro');
        
        if (iconoTema) {
            iconoTema.classList.remove('bi-sun-fill');
            iconoTema.classList.add('bi-moon-fill');
        }
        
        if (btnTema) {
            btnTema.classList.remove('btn-outline-warning');
            btnTema.classList.add('btn-outline-info');
        }
    } else {
        document.body.classList.remove('oscuro');
        
        if (iconoTema) {
            iconoTema.classList.remove('bi-moon-fill');
            iconoTema.classList.add('bi-sun-fill');
        }
        
        if (btnTema) {
            btnTema.classList.remove('btn-outline-info');
            btnTema.classList.add('btn-outline-warning');
        }
    }
}

function esOscuro() {
    return htmlElement.getAttribute('data-bs-theme') === 'dark';
}