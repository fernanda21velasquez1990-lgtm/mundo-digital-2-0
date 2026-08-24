(() => {
  "use strict";

  const formularioLogin = document.getElementById("formularioLogin");
  const campoUsuario = document.getElementById("usuario");
  const campoContrasena = document.getElementById("contrasena");
  const botonMostrarContrasena = document.getElementById("botonMostrarContrasena");
  const botonIngresar = document.getElementById("botonIngresar");
  const textoBoton = document.getElementById("textoBoton");
  const botonRecuperar = document.getElementById("botonRecuperar");
  const mensaje = document.getElementById("mensaje");
  const recordarme = document.getElementById("recordarme");
  const cfg = window.MUNDO_DIGITAL_CONFIG || {};
  const CLAVE_SESION = "md20_session";

  function mostrarMensaje(texto, tipo = "informacion") {
    mensaje.textContent = texto;
    mensaje.className = `mensaje visible ${tipo}`;
    window.clearTimeout(mostrarMensaje.temporizador);
    mostrarMensaje.temporizador = window.setTimeout(() => {
      mensaje.className = "mensaje";
      mensaje.textContent = "";
    }, 5000);
  }

  function leerSesionExistente() {
    const bruto = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION);
    if (!bruto) return null;
    try { return JSON.parse(bruto); } catch (_) { return null; }
  }

  function guardarSesion(respuesta) {
    const sesion = {
      usuario: respuesta.usuario,
      inicio: new Date().toISOString()
    };
    sessionStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_SESION);
    (recordarme?.checked ? localStorage : sessionStorage)
      .setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
  }

  function irSegunRol(usuario) {
    const rol = String(usuario?.rolId || "").toUpperCase();
    if (rol === "ROL-VENDEDOR") {
      location.replace("vendedor-dashboard.html");
      return;
    }
    if (rol === "ROL-ADMIN" || rol === "ROL-SOPORTE") {
      location.replace("dashboard.html");
      return;
    }
    throw new Error("El usuario no tiene un rol habilitado para la plataforma.");
  }

  const existente = leerSesionExistente();
  if (existente?.usuario?.rolId) {
    irSegunRol(existente.usuario);
    return;
  }

  botonMostrarContrasena?.addEventListener("click", () => {
    const oculta = campoContrasena.type === "password";
    campoContrasena.type = oculta ? "text" : "password";
    botonMostrarContrasena.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
  });

  formularioLogin?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const usuario = campoUsuario.value.trim();
    const contrasena = campoContrasena.value;

    if (!usuario) {
      mostrarMensaje("Debes escribir tu usuario o correo.", "error");
      campoUsuario.focus();
      return;
    }

    if (!contrasena) {
      mostrarMensaje("Debes escribir tu contraseña.", "error");
      campoContrasena.focus();
      return;
    }

    if (!cfg.APPS_SCRIPT_URL) {
      mostrarMensaje("Falta configurar la conexión con Apps Script.", "error");
      return;
    }

    botonIngresar.disabled = true;
    textoBoton.textContent = "Comprobando acceso...";

    try {
      const respuesta = await fetch(cfg.APPS_SCRIPT_URL, {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "loginWebMD20",
          usuario,
          contrasena
        })
      });

      const datos = await respuesta.json();
      if (!datos.ok) throw new Error(datos.mensaje || "No se pudo iniciar sesión.");

      guardarSesion(datos);
      mostrarMensaje(`Bienvenido, ${datos.usuario.nombreCompleto || datos.usuario.usuario}.`, "exito");
      window.setTimeout(() => irSegunRol(datos.usuario), 450);
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo conectar con el sistema.", "error");
      campoContrasena.select();
    } finally {
      botonIngresar.disabled = false;
      textoBoton.textContent = "Entrar a la plataforma";
    }
  });

  botonRecuperar?.addEventListener("click", () => {
    mostrarMensaje("La recuperación de contraseña se habilitará desde el panel administrativo.", "informacion");
  });
})();
