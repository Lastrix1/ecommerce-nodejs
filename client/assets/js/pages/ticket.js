const carrito = JSON.parse(localStorage.getItem('carritoActual')) || [];
const cliente = localStorage.getItem('cliente') || "Consumidor Final";

document.addEventListener('DOMContentLoaded', () => {
    mostrarResumenEnPantalla();

    const btnDescargar = document.getElementById('btn-descargar');
    if (btnDescargar) btnDescargar.onclick = generarPDF;
});

function mostrarResumenEnPantalla() {
    const contenedor = document.getElementById('detalle-ticket');
    if (!contenedor) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `<div class="text-center py-3">
                                    <i class="bi bi-exclamation-triangle text-warning fs-1"></i>
                                    <p class="mt-2">No hay productos registrados en esta compra.</p>
                                </div>`;
        return;
    }

    const fechaActual = new Date().toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    let total = 0;
    let html = `
        <div class="border-bottom border-secondary border-opacity-25 pb-3 mb-3">
            <h5 class="fw-bold text-uppercase mb-1">Comprobante No Válido como Factura</h5>
            <p class="mb-0 small"><strong>Cliente:</strong> ${cliente}</p>
            <p class="mb-0 small"><strong>Fecha:</strong> ${fechaActual}</p>
        </div>
        <div class="mb-3">`;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;
        html += `
            <div class="d-flex justify-content-between mb-2">
                <span class="text-truncate me-2">${p.nombre} (x${p.cantidad})</span>
                <span class="fw-semibold text-nowrap">$${subtotal.toLocaleString()}</span>
            </div>`;
    });

    html += `</div>
        <div class="border-top border-dark border-opacity-50 pt-3 d-flex justify-content-between align-items-center">
            <span class="h5 mb-0 fw-bold">TOTAL PAGADO</span>
            <span class="h3 mb-0 fw-bold text-primary">$${total.toLocaleString()}</span>
        </div>`;

    contenedor.innerHTML = html;
}

async function generarPDF() {
    try {
        const { PDFDocument, StandardFonts, rgb } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([400, 600]);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const oscuro = esOscuro();

        const logoUrl = '../assets/img/favicon.png'; 
        const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoBytes);

        const logoDims = logoImage.scale(0.5);

        let y = 500;

        page.drawImage(logoImage, { x: 40, y: y, width: logoDims.width, height: logoDims.height });
        page.drawText("PUNTO TECNO S.A.", { x: 60, y, size: 22, font: fontBold, color: rgb(0.05, 0.4, 0.9) });
        y -= 40;
        page.drawText(`CLIENTE: ${cliente.toUpperCase()}`, { x: 50, y, size: 10, font: fontNormal });
        y -= 15;
        page.drawText(`FECHA: ${new Date().toLocaleString()}`, { x: 50, y, size: 10, font: fontNormal });
        y -= 25;
        page.drawLine({ start: { x: 50, y }, end: { x: 350, y }, thickness: 1, opacity: 0.5 });
        y -= 30;

        carrito.forEach(p => {
            page.drawText(`${p.cantidad}x ${p.nombre.substring(0, 30)}`, { x: 50, y, size: 10, font: fontNormal });
            page.drawText(`$${(p.precio * p.cantidad).toLocaleString()}`, { x: 300, y, size: 10, font: fontNormal });
            y -= 20;
        });

        y -= 20;
        page.drawLine({ start: { x: 50, y }, end: { x: 350, y }, thickness: 1.5 });
        y -= 30;

        const totalFinal = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        page.drawText("TOTAL:", { x: 50, y, size: 16, font: fontBold });
        page.drawText(`$${totalFinal.toLocaleString()}`, { x: 270, y, size: 16, font: fontBold });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Ticket_PuntoTecno_${Date.now()}.pdf`;
        link.click();

        setTimeout(() => {
            Swal.fire({
                title: '¡Compra finalizada!',
                text: 'Tu ticket fue descargado correctamente. ¿Deseas salir del sistema?',
                icon: 'success',
                background: oscuro ? '#333' : '#fff',
                color: oscuro ? '#fff' : '#000',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                confirmButtonColor: '#0d6efd',
                cancelButtonColor: '#6c757d',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('carritoActual');
                    window.location.href = '../index.html';
                }
            });
        }, 1000);

    } catch (error) {
        console.error("Error PDF:", error);
        Swal.fire('Error', 'No se pudo generar el archivo PDF.', 'error');
    }
}

function salirDelSistema() {
    localStorage.removeItem('carritoActual');
    Swal.fire({
        title: '¡Vuelve pronto!',
        text: 'Redirigiendo a la página de bienvenida...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        window.location.href = '../index.html';
    });
}

/*//  NAVEGACIÓN 

window.irABienvenida = function () {
    Swal.fire({
        title: 'Volver al inicio',
        text: 'Si continúas perderás el progreso actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir a Bienvenida',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#0d6efd'
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
        title: 'Ingresar a Tienda',
        text: `Bienvenido ${usuario}, ¿deseas continuar?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ingresar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#0d6efd'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = './productos.html';
        }
    });
};

window.irACarrito = function () {
    const usuario = localStorage.getItem('cliente');
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual')) || [];

    if (!usuario) {
        Swal.fire({
            title: 'Debes iniciar sesión',
            text: 'Ingresa tu nombre primero.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }

    if (carritoActual.length === 0) {
        Swal.fire({
            title: 'Carrito vacío',
            text: 'Debes agregar productos antes de ingresar.',
            icon: 'info',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }

    window.location.href = './carrito.html';
};

window.irATicket = function () {
    const usuario = localStorage.getItem('cliente');
    const carritoActual = JSON.parse(localStorage.getItem('carritoActual')) || [];

    if (!usuario) {
        Swal.fire({
            title: 'Acceso denegado',
            text: 'Primero debes iniciar sesión.',
            icon: 'warning',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }

    if (carritoActual.length === 0) {
        Swal.fire({
            title: 'Sin compra registrada',
            text: 'Debes confirmar tu pedido primero.',
            icon: 'info',
            confirmButtonColor: '#0d6efd',
            timer: 5000,
        });
        return;
    }

    window.location.href = './ticket.html';
};*/
