(() => {
  "use strict";

  const CLAVE = "md20_session";

  function leerSesion() {
    let bruto = sessionStorage.getItem(CLAVE) || localStorage.getItem(CLAVE) || "";
    if (!bruto) return null;
    try {
      const sesion = JSON.parse(bruto);
      if (!sesion || !sesion.usuario || !sesion.usuario.rolId) return null;
      return sesion;
    } catch (_) {
      return null;
    }
  }

  function guardarSesion(sesion, recordar) {
    sessionStorage.removeItem(CLAVE);
    localStorage.removeItem(CLAVE);
    (recordar ? localStorage : sessionStorage).setItem(CLAVE, JSON.stringify(sesion));
  }

  function cerrarSesion(redirigir = true) {
    sessionStorage.removeItem(CLAVE);
    localStorage.removeItem(CLAVE);
    if (redirigir) location.href = "index.html";
  }

  function rutaActual() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function protegerPagina() {
    const pagina = rutaActual();
    const sesion = leerSesion();

    if (pagina === "index.html" || pagina === "") return sesion;

    const esPanelVendedor = pagina.startsWith("vendedor-");
    const paginasPublicas = new Set([
      "tienda.html",
      "chat-vendedor.html"
    ]);

    if (paginasPublicas.has(pagina)) return sesion;

    if (!sesion) {
      location.replace("index.html");
      return null;
    }

    const rol = String(sesion.usuario.rolId || "").toUpperCase();

    if (esPanelVendedor && rol !== "ROL-VENDEDOR") {
      location.replace("dashboard.html");
      return null;
    }

    if (!esPanelVendedor && rol === "ROL-VENDEDOR") {
      location.replace("vendedor-dashboard.html");
      return null;
    }

    return sesion;
  }

  window.MD20Auth = {
    leerSesion,
    guardarSesion,
    cerrarSesion,
    protegerPagina
  };

  const sesion = protegerPagina();

  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("#botonCerrarSesion,[data-cerrar-sesion]");
    if (!boton) return;
    evento.preventDefault();
    evento.stopImmediatePropagation();
    cerrarSesion(true);
  }, true);

  window.dispatchEvent(new CustomEvent("md20:auth", { detail: sesion }));
})();
