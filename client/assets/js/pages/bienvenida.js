document.addEventListener("DOMContentLoaded", () => {

    const botonesAdmin =
        document.querySelectorAll(".btn-admin");

    botonesAdmin.forEach(btn => {

        btn.addEventListener("click", () => {

            window.location.href =
                "./pages/admin/login.html";
        });

    });

});