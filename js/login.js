const formularioLogin = document.getElementById("formularioLogin");
const campoUsuario = document.getElementById("usuario");
const campoContrasena = document.getElementById("contrasena");
const botonMostrarContrasena = document.getElementById("botonMostrarContrasena");
const botonIngresar = document.getElementById("botonIngresar");
const textoBoton = document.getElementById("textoBoton");
const botonRecuperar = document.getElementById("botonRecuperar");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto, tipo = "informacion") {
  mensaje.textContent = texto;
  mensaje.className = `mensaje visible ${tipo}`;
  window.clearTimeout(mostrarMensaje.temporizador);
  mostrarMensaje.temporizador = window.setTimeout(() => {
    mensaje.className = "mensaje";
    mensaje.textContent = "";
  }, 4000);
}

botonMostrarContrasena.addEventListener("click", () => {
  const oculta = campoContrasena.type === "password";
  campoContrasena.type = oculta ? "text" : "password";
  botonMostrarContrasena.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
});

formularioLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const usuario = campoUsuario.value.trim();
  const contrasena = campoContrasena.value.trim();

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
  if (contrasena.length < 4) {
    mostrarMensaje("La contraseña debe tener al menos 4 caracteres.", "error");
    campoContrasena.focus();
    return;
  }

  botonIngresar.disabled = true;
  textoBoton.textContent = "Comprobando acceso...";

  window.setTimeout(() => {
    mostrarMensaje("Acceso correcto. Abriendo el panel principal...", "exito");
    window.setTimeout(() => { window.location.href = "dashboard.html"; }, 700);
  }, 850);
});

botonRecuperar.addEventListener("click", () => {
  mostrarMensaje("La recuperación se conectará más adelante con Google Apps Script.", "informacion");
});
