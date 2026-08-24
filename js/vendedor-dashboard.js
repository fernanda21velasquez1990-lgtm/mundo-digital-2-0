(() => {
  "use strict";
  const sesion = window.MD20Auth?.leerSesion();
  if (!sesion?.usuario) return;

  const u = sesion.usuario;
  document.getElementById("nombreVendedor").textContent = u.nombreCompleto || u.usuario || "Vendedor";
  document.getElementById("vendedorId").textContent = u.vendedorId || "SIN VÍNCULO";
  document.getElementById("usuarioVendedor").textContent = `@${u.usuario || "vendedor"}`;
  document.getElementById("horaSesion").textContent = new Date(sesion.inicio || Date.now()).toLocaleTimeString("es-ES", {hour:"2-digit",minute:"2-digit"});

  const toast = document.getElementById("toast");
  function aviso(texto) {
    toast.textContent = texto;
    toast.classList.add("show");
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  document.querySelectorAll("[data-modulo]").forEach((boton) => {
    boton.addEventListener("click", () => {
      aviso(`${boton.dataset.modulo}: acceso preparado. Lo conectaremos con tus datos en la siguiente etapa.`);
    });
  });
})();
