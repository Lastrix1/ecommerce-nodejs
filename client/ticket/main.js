// 1. Variables Globales 
const carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
const cliente = localStorage.getItem('cliente') || "Consumidor Final";

document.addEventListener('DOMContentLoaded', () => {
    // Aplicar tema guardado
    if (localStorage.getItem('tema') === 'dark') {
        document.body.classList.add('oscuro');
    }

    // Dibujar resumen en pantalla
    mostrarResumenEnPantalla();

    // --- CONFIGURACIÓN DE BOTONES ---

    // 1. Botón Descargar (PDF)
    const btnDescargar = document.getElementById('btn-descargar');
    if (btnDescargar) {
        btnDescargar.onclick = mostrarModalConfirmacion;
    }

    // 2. Botón Salir
    const btnSalirPantalla = document.querySelector('.btn-exit'); 
    if (btnSalirPantalla) {
        btnSalirPantalla.onclick = salirDelSistema;
    }

    // 3. Botón Cambio de Tema
    const btnTema = document.getElementById('btn-tema');
    if (btnTema) {
        btnTema.onclick = () => {
            document.body.classList.toggle('oscuro');
            localStorage.setItem('tema', document.body.classList.contains('oscuro') ? 'dark' : 'light');
        };
    }

    // 4. Botón Admin Login (Agregado)
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
});

function mostrarResumenEnPantalla() {
    const contenedor = document.getElementById('detalle-ticket');
    if (!contenedor) return;

    // Recuperar datos del usuario y fecha
    const nombreUsuario = localStorage.getItem('cliente') || "Usuario Desconocido";
    const fechaActual = new Date().toLocaleDateString();

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
        return;
    }

    let total = 0;
    let html = `
        <div class="ticket-header">
            <h3>Comprobante de Venta</h3>
            <p><strong>Cliente:</strong> ${nombreUsuario}</p>
            <p><strong>Fecha:</strong> ${fechaActual}</p>
        </div>
        <ul style="list-style: none; padding: 0;">`;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;
        html += `
            <li style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; padding: 10px 0;">
                <span>${p.nombre} (x${p.cantidad})</span>
                <span>$${subtotal}</span>
            </li>`;
    });

    html += `</ul><div style="text-align: right; font-weight: bold; margin-top: 15px; font-size: 1.3rem;">
                Total: $${total}
             </div>`;

    contenedor.innerHTML = html;
}

async function mostrarModalConfirmacion() {
    const result = await Swal.fire({
        title: '¡Compra Exitosa!',
        text: `Gracias ${cliente} por elegirnos.`,
        icon: 'success',
        imageUrl: '../assets/img/favicon.png', 
        imageWidth: 80,
        imageHeight: 80,
        showCancelButton: true,
        confirmButtonText: 'Descargar Ticket PDF',
        cancelButtonText: 'Finalizar y Salir',
        confirmButtonColor: '#757579',
        cancelButtonColor: 'rgb(81, 79, 79)',
        allowOutsideClick: false 
    });

    if (result.isConfirmed) {
        await generarPDF();
        mostrarModalConfirmacion(); 
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        salirDelSistema();
    }
}


async function generarPDF() {
    if (carrito.length === 0) return;

    try {
        const { PDFDocument, StandardFonts } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([300, 500]);
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // --- 1. LÓGICA PARA EL LOGO ---
    let yPosition = 450;
        try {
            const urlLogo = '../assets/img/favicon.png'; 
            const imageBytes = await fetch(urlLogo).then((res) => res.arrayBuffer());
            const logoImagen = await pdfDoc.embedPng(imageBytes);


            page.drawImage(logoImagen, {
                x: 15,
                y: yPosition - 10,
                width: 30,
                height: 30,
            });

        } catch (error){
            page.drawText("PUNTO TECNO S.A.", { 
                x: 50, 
                y: yPosition, 
                size: 16, 
                font
            });
            console.warn("No se pudo cargar el logo en el PDF.", error);
        }

        const fecha = new Date().toLocaleDateString();
        const totalFinal = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

        let y = 450;
        page.drawText("PUNTO TECNO S.A.", { x: 50, y: y, size: 16, font });
        y -= 30;
        page.drawText(`Cliente: ${cliente}`, { x: 50, y: y, size: 11, font });
        y -= 15;
        page.drawText(`Fecha: ${fecha}`, { x: 50, y: y, size: 10, font });
        y -= 40;

        carrito.forEach(p => {
            page.drawText(`${p.cantidad}x ${p.nombre} - $${p.precio * p.cantidad}`, { x: 50, y, size: 10, font });
            y -= 15; 
        });

        page.drawText(`TOTAL FINAL: $${totalFinal}`, { x: 50, y: y - 20, size: 14, font });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Ticket_${cliente.replace(/\s+/g, '_')}.pdf`;
        link.click();
    } catch (error) {
        console.error("Error al generar PDF:", error);
    }
}

function salirDelSistema() {
    localStorage.removeItem('carritoActual');
    localStorage.removeItem('cliente'); 
    
    Swal.fire({
        title: 'Finalizando...',
        text: '¡Hasta la próxima!',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = "../bienvenida/index.html";
    });
}

