// LÓGICA DE TEMA (LocalStorage)
const btnTema = document.getElementById('btn-tema');
if (btnTema) {
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('oscuro');
        localStorage.setItem('tema', document.body.classList.contains('oscuro') ? 'dark' : 'light');
    });

// LÓGICA DE ADMIN (LocalStorage)
const btnAdmin = document.getElementById('btn-admin');
    if (btnAdmin) {
        btnAdmin.onclick = () => {
            const esOscuro = document.body.classList.contains('oscuro');
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
}

// Persistir tema al cargar
if (localStorage.getItem('tema') === 'dark') document.body.classList.add('oscuro');


const formInicio = document.getElementById('form-inicio');
formInicio.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-usuario').value;
    localStorage.setItem('cliente', nombre); 
    
    window.location.href = "../productos/index.html";
});



