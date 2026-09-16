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

  const modalRecuperacion = document.getElementById("modalRecuperacion");
  const cerrarRecuperacion = document.getElementById("cerrarRecuperacion");
  const volverLoginRecuperacion = document.getElementById("volverLoginRecuperacion");
  const mensajeRecuperacion = document.getElementById("mensajeRecuperacion");
  const textoRecuperacion = document.getElementById("textoRecuperacion");
  const formRecuperacionCorreo = document.getElementById("formRecuperacionCorreo");
  const formRecuperacionCodigo = document.getElementById("formRecuperacionCodigo");
  const formNuevaContrasena = document.getElementById("formNuevaContrasena");
  const correoRecuperacion = document.getElementById("correoRecuperacion");
  const correoDestino = document.getElementById("correoDestino");
  const codigoRecuperacion = document.getElementById("codigoRecuperacion");
  const nuevaContrasena = document.getElementById("nuevaContrasena");
  const confirmarNuevaContrasena = document.getElementById("confirmarNuevaContrasena");
  const botonEnviarCodigo = document.getElementById("botonEnviarCodigo");
  const botonVerificarCodigo = document.getElementById("botonVerificarCodigo");
  const botonCambiarContrasena = document.getElementById("botonCambiarContrasena");
  const botonReenviarCodigo = document.getElementById("botonReenviarCodigo");

  const cfg = window.MUNDO_DIGITAL_CONFIG || {};
  const CLAVE_SESION = "md20_session";

  const recuperacion = {
    paso: 1,
    correo: "",
    token: ""
  };

  function mostrarMensaje(texto, tipo = "informacion") {
    mensaje.textContent = texto;
    mensaje.className = `mensaje visible ${tipo}`;
    window.clearTimeout(mostrarMensaje.temporizador);
    mostrarMensaje.temporizador = window.setTimeout(() => {
      mensaje.className = "mensaje";
      mensaje.textContent = "";
    }, 5000);
  }

  function mostrarMensajeRecuperacion(texto, tipo = "informacion", ocultarDespues = true) {
    if (!mensajeRecuperacion) return;
    mensajeRecuperacion.textContent = texto;
    mensajeRecuperacion.className = `mensaje recuperacion-mensaje visible ${tipo}`;
    window.clearTimeout(mostrarMensajeRecuperacion.temporizador);
    if (ocultarDespues) {
      mostrarMensajeRecuperacion.temporizador = window.setTimeout(() => {
        mensajeRecuperacion.className = "mensaje recuperacion-mensaje";
        mensajeRecuperacion.textContent = "";
      }, 6500);
    }
  }

  function limpiarMensajeRecuperacion() {
    window.clearTimeout(mostrarMensajeRecuperacion.temporizador);
    if (!mensajeRecuperacion) return;
    mensajeRecuperacion.className = "mensaje recuperacion-mensaje";
    mensajeRecuperacion.textContent = "";
  }

  function leerSesionExistente() {
    const bruto = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION);
    if (!bruto) return null;
    try { return JSON.parse(bruto); } catch (_) { return null; }
  }

  function guardarSesion(respuesta) {
    const sesion = {
      usuario: respuesta.usuario,
      tokenSesion: respuesta.tokenSesion || "",
      expiraSegundos: Number(respuesta.expiraSegundos || 21600),
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

  async function postPublico(action, datos = {}) {
    if (!cfg.APPS_SCRIPT_URL) {
      throw new Error("Falta configurar la conexión con Apps Script.");
    }

    const respuesta = await fetch(cfg.APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...datos })
    });

    const resultado = await respuesta.json();
    if (!resultado || !resultado.ok) {
      throw new Error(resultado?.mensaje || "No se pudo completar la solicitud.");
    }
    return resultado;
  }

  function textoBotonTemporal(boton, texto, deshabilitado = true) {
    if (!boton) return () => {};
    const span = boton.querySelector("span");
    const anterior = span ? span.textContent : boton.textContent;
    if (deshabilitado) boton.disabled = true;
    if (span) span.textContent = texto;
    else boton.textContent = texto;
    return () => {
      boton.disabled = false;
      if (span) span.textContent = anterior;
      else boton.textContent = anterior;
    };
  }

  function cambiarPasoRecuperacion(paso) {
    recuperacion.paso = paso;
    limpiarMensajeRecuperacion();

    formRecuperacionCorreo?.classList.toggle("activo", paso === 1);
    formRecuperacionCodigo?.classList.toggle("activo", paso === 2);
    formNuevaContrasena?.classList.toggle("activo", paso === 3);

    document.querySelectorAll("[data-indicador-paso]").forEach((el) => {
      const numero = Number(el.dataset.indicadorPaso || 0);
      el.classList.toggle("activo", numero <= paso);
      el.classList.toggle("actual", numero === paso);
    });

    if (textoRecuperacion) {
      textoRecuperacion.textContent = paso === 1
        ? "Te enviaremos un código de seguridad al correo registrado."
        : paso === 2
          ? "Escribe el código que recibiste por correo."
          : "Crea una contraseña nueva para volver a ingresar.";
    }

    window.setTimeout(() => {
      if (paso === 1) correoRecuperacion?.focus();
      if (paso === 2) codigoRecuperacion?.focus();
      if (paso === 3) nuevaContrasena?.focus();
    }, 80);
  }

  function abrirRecuperacion() {
    recuperacion.correo = "";
    recuperacion.token = "";
    if (correoRecuperacion) {
      const posibleCorreo = String(campoUsuario?.value || "").trim();
      correoRecuperacion.value = posibleCorreo.includes("@") ? posibleCorreo : "";
    }
    if (codigoRecuperacion) codigoRecuperacion.value = "";
    if (nuevaContrasena) nuevaContrasena.value = "";
    if (confirmarNuevaContrasena) confirmarNuevaContrasena.value = "";
    cambiarPasoRecuperacion(1);
    modalRecuperacion?.classList.add("visible");
    modalRecuperacion?.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-abierto");
  }

  function cerrarModalRecuperacion() {
    modalRecuperacion?.classList.remove("visible");
    modalRecuperacion?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-abierto");
    limpiarMensajeRecuperacion();
    botonRecuperar?.focus();
  }

  async function solicitarCodigo(esReenvio = false) {
    const correo = String(esReenvio ? recuperacion.correo : correoRecuperacion?.value || "")
      .trim()
      .toLowerCase();

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      mostrarMensajeRecuperacion("Escribe un correo válido.", "error");
      correoRecuperacion?.focus();
      return;
    }

    const boton = esReenvio ? botonReenviarCodigo : botonEnviarCodigo;
    const restaurar = textoBotonTemporal(boton, esReenvio ? "Enviando..." : "Enviando código...");

    try {
      const datos = await postPublico("solicitarRecuperacionContrasenaMD20", { correo });
      recuperacion.correo = correo;
      recuperacion.token = "";
      if (correoDestino) correoDestino.textContent = datos.correoOculto || correo;
      if (!esReenvio) cambiarPasoRecuperacion(2);
      if (codigoRecuperacion) codigoRecuperacion.value = "";
      mostrarMensajeRecuperacion(
        datos.mensaje || "Si el correo está registrado, recibirás un código de verificación.",
        "exito",
        false
      );
      codigoRecuperacion?.focus();
    } catch (error) {
      mostrarMensajeRecuperacion(error.message || "No se pudo enviar el código.", "error", false);
    } finally {
      restaurar();
    }
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
      const datos = await postPublico("loginWebMD20", { usuario, contrasena });
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

  botonRecuperar?.addEventListener("click", abrirRecuperacion);
  cerrarRecuperacion?.addEventListener("click", cerrarModalRecuperacion);
  volverLoginRecuperacion?.addEventListener("click", cerrarModalRecuperacion);
  modalRecuperacion?.querySelectorAll("[data-cerrar-recuperacion]").forEach((el) => {
    el.addEventListener("click", cerrarModalRecuperacion);
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && modalRecuperacion?.classList.contains("visible")) {
      cerrarModalRecuperacion();
    }
  });

  formRecuperacionCorreo?.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    await solicitarCodigo(false);
  });

  codigoRecuperacion?.addEventListener("input", () => {
    codigoRecuperacion.value = codigoRecuperacion.value.replace(/\D/g, "").slice(0, 6);
  });

  formRecuperacionCodigo?.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const codigo = String(codigoRecuperacion?.value || "").replace(/\D/g, "");

    if (!/^\d{6}$/.test(codigo)) {
      mostrarMensajeRecuperacion("Escribe los 6 dígitos del código recibido.", "error");
      codigoRecuperacion?.focus();
      return;
    }

    const restaurar = textoBotonTemporal(botonVerificarCodigo, "Verificando...");
    try {
      const datos = await postPublico("verificarCodigoRecuperacionMD20", {
        correo: recuperacion.correo,
        codigo
      });
      recuperacion.token = String(datos.tokenRecuperacion || "");
      if (!recuperacion.token) throw new Error("No se recibió la autorización para cambiar la contraseña.");
      cambiarPasoRecuperacion(3);
      mostrarMensajeRecuperacion(datos.mensaje || "Código correcto.", "exito");
    } catch (error) {
      mostrarMensajeRecuperacion(error.message || "No se pudo verificar el código.", "error", false);
      codigoRecuperacion?.select();
    } finally {
      restaurar();
    }
  });

  botonReenviarCodigo?.addEventListener("click", async () => {
    await solicitarCodigo(true);
  });

  formNuevaContrasena?.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const clave = String(nuevaContrasena?.value || "");
    const confirmar = String(confirmarNuevaContrasena?.value || "");

    if (clave.length < 8 || !/[A-Za-z]/.test(clave) || !/\d/.test(clave)) {
      mostrarMensajeRecuperacion("La contraseña debe tener mínimo 8 caracteres e incluir letras y números.", "error", false);
      nuevaContrasena?.focus();
      return;
    }

    if (clave !== confirmar) {
      mostrarMensajeRecuperacion("Las contraseñas no coinciden.", "error", false);
      confirmarNuevaContrasena?.focus();
      return;
    }

    const restaurar = textoBotonTemporal(botonCambiarContrasena, "Actualizando...");
    try {
      const datos = await postPublico("restablecerContrasenaWebMD20", {
        correo: recuperacion.correo,
        tokenRecuperacion: recuperacion.token,
        nuevaContrasena: clave,
        confirmarContrasena: confirmar
      });

      if (campoUsuario) campoUsuario.value = recuperacion.correo;
      if (campoContrasena) campoContrasena.value = "";
      cerrarModalRecuperacion();
      mostrarMensaje(datos.mensaje || "Contraseña actualizada correctamente. Ya puedes iniciar sesión.", "exito");
      campoContrasena?.focus();
    } catch (error) {
      mostrarMensajeRecuperacion(error.message || "No se pudo cambiar la contraseña.", "error", false);
    } finally {
      restaurar();
    }
  });
})();
