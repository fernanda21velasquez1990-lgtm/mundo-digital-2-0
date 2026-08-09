(() => {
  "use strict";

  const config = window.MUNDO_DIGITAL_CONFIG || {};
  const modulo = document.body.dataset.modulo === "REVENDEDOR" ? "REVENDEDOR" : "PROVEEDOR";
  const plural = modulo === "PROVEEDOR" ? "proveedores" : "revendedores";
  const singular = modulo === "PROVEEDOR" ? "proveedor" : "revendedor";
  const prefijoLocal = `md20_${plural}`;

  const estado = {
    registros: [],
    editandoId: "",
    filtroTexto: "",
    filtroEstado: "TODOS"
  };

  const $ = (selector, contexto = document) => contexto.querySelector(selector);
  const $$ = (selector, contexto = document) => [...contexto.querySelectorAll(selector)];

  const elementos = {
    menuLateral: $("#menuLateral"),
    capaOscura: $("#capaOscura"),
    botonAbrirMenu: $("#botonAbrirMenu"),
    botonCerrarMenu: $("#botonCerrarMenu"),
    botonCerrarSesion: $("#botonCerrarSesion"),
    botonNuevo: $("#botonNuevoSocio"),
    botonNuevoVacio: $("#botonNuevoVacio"),
    botonCerrarModal: $("#botonCerrarModal"),
    botonCancelar: $("#botonCancelar"),
    modal: $("#modalSocio"),
    formulario: $("#formularioSocio"),
    tituloModal: $("#tituloModal"),
    mensaje: $("#mensajePanel"),
    tablaCuerpo: $("#tablaSociosBody"),
    estadoVacio: $("#estadoVacio"),
    cargandoTabla: $("#cargandoTabla"),
    buscar: $("#buscarSocio"),
    filtroEstado: $("#filtroEstado"),
    botonActualizar: $("#botonActualizar"),
    estadoConexion: $("#estadoConexion"),
    total: $("#kpiTotal"),
    activos: $("#kpiActivos"),
    porVencer: $("#kpiPorVencer"),
    vencidos: $("#kpiVencidos"),
    fechaCompra: $("#fechaCompra"),
    tiempoServicio: $("#tiempoServicio"),
    fechaVencimiento: $("#fechaVencimiento"),
    precioCuenta: $("#precioCuenta"),
    precioFinal: $("#precioFinal"),
    ganancia: $("#ganancia")
  };

  function mostrarMensaje(texto, tipo = "informacion") {
    elementos.mensaje.textContent = texto;
    elementos.mensaje.className = `mensaje-flotante visible ${tipo}`;
    clearTimeout(mostrarMensaje.temporizador);
    mostrarMensaje.temporizador = setTimeout(() => {
      elementos.mensaje.className = "mensaje-flotante";
      elementos.mensaje.textContent = "";
    }, 4200);
  }

  function abrirMenu() {
    elementos.menuLateral?.classList.add("abierto");
    elementos.capaOscura?.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function cerrarMenu() {
    elementos.menuLateral?.classList.remove("abierto");
    elementos.capaOscura?.classList.remove("visible");
    document.body.style.overflow = "";
  }

  function abrirModal(registro = null) {
    estado.editandoId = registro?.id || "";
    elementos.formulario.reset();
    elementos.tituloModal.textContent = registro ? `Editar ${singular}` : `Nuevo ${singular}`;

    if (registro) {
      const valores = {
        nombre: registro.nombre,
        apellido: registro.apellido,
        whatsapp: registro.whatsapp,
        producto: registro.producto,
        fechaCompra: registro.fechaCompra,
        tiempoServicio: registro.tiempoServicio,
        fechaVencimiento: registro.fechaVencimiento,
        correoCuenta: registro.correoCuenta,
        contrasenaCuenta: registro.contrasenaCuenta,
        precioCuenta: registro.precioCuenta,
        precioFinal: registro.precioFinal,
        ganancia: registro.ganancia,
        moneda: registro.moneda || "USD",
        notas: registro.notas || ""
      };

      Object.entries(valores).forEach(([id, valor]) => {
        const campo = document.getElementById(id);
        if (campo) campo.value = valor ?? "";
      });
    } else {
      elementos.fechaCompra.value = fechaISO(new Date());
      $("#moneda").value = "USD";
      calcularVencimientoFormulario();
      calcularGananciaFormulario();
    }

    elementos.modal.classList.add("visible");
    elementos.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("#nombre")?.focus(), 100);
  }

  function cerrarModal() {
    elementos.modal.classList.remove("visible");
    elementos.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    estado.editandoId = "";
  }

  function fechaISO(fecha) {
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  function agregarMesesSeguro(fechaTexto, meses) {
    if (!fechaTexto || !meses) return "";
    const [ano, mes, dia] = fechaTexto.split("-").map(Number);
    const fecha = new Date(ano, mes - 1, 1);
    fecha.setMonth(fecha.getMonth() + Number(meses));
    const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
    fecha.setDate(Math.min(dia, ultimoDia));
    return fechaISO(fecha);
  }

  function calcularVencimientoFormulario() {
    elementos.fechaVencimiento.value = agregarMesesSeguro(
      elementos.fechaCompra.value,
      elementos.tiempoServicio.value
    );
  }

  function calcularGananciaFormulario() {
    const costo = Number(elementos.precioCuenta.value || 0);
    const precio = Number(elementos.precioFinal.value || 0);
    elementos.ganancia.value = (precio - costo).toFixed(2);
  }

  function diasRestantes(fechaTexto) {
    if (!fechaTexto) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [ano, mes, dia] = fechaTexto.split("-").map(Number);
    const vencimiento = new Date(ano, mes - 1, dia);
    return Math.ceil((vencimiento - hoy) / 86400000);
  }

  function calcularEstado(fechaTexto) {
    const dias = diasRestantes(fechaTexto);
    const alerta = Number(config.DIAS_ALERTA_VENCIMIENTO || 3);
    if (dias < 0) return "VENCIDO";
    if (dias <= alerta) return "POR_VENCER";
    return "ACTIVO";
  }

  function formatearFecha(fechaTexto) {
    if (!fechaTexto) return "—";
    const [ano, mes, dia] = fechaTexto.split("-").map(Number);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(ano, mes - 1, dia));
  }

  function formatearDinero(valor, moneda = "USD") {
    const numero = Number(valor || 0);
    try {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: moneda,
        minimumFractionDigits: 2
      }).format(numero);
    } catch {
      return `${numero.toFixed(2)} ${moneda}`;
    }
  }

  function escaparHtml(valor) {
    return String(valor ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizarTelefono(numero) {
    return String(numero || "").replace(/\D/g, "");
  }

  function etiquetaTiempo(meses) {
    const opciones = {
      "1": "1 mes",
      "2": "2 meses",
      "3": "3 meses",
      "6": "6 meses",
      "12": "1 año"
    };
    return opciones[String(meses)] || `${meses} meses`;
  }

  function crearMensajeWhatsApp(registro) {
    const nombre = `${registro.nombre || ""} ${registro.apellido || ""}`.trim();
    const fecha = formatearFecha(registro.fechaVencimiento);
    const cuenta = registro.correoCuenta ? ` asociada al correo ${registro.correoCuenta}` : "";

    if (modulo === "PROVEEDOR") {
      return `Hola ${nombre}. La cuenta de ${registro.producto}${cuenta} vence el ${fecha}. Deseo renovarla por ${etiquetaTiempo(registro.tiempoServicio)}. Por favor, indícame disponibilidad y precio de renovación.`;
    }

    return `Hola ${nombre}. Te informo que la cuenta de ${registro.producto}${cuenta} vence el ${fecha}. El precio de renovación es ${formatearDinero(registro.precioFinal, registro.moneda)}. Confírmame si deseas renovarla.`;
  }

  function abrirWhatsApp(id) {
    const registro = estado.registros.find((item) => item.id === id);
    if (!registro) return;
    const telefono = normalizarTelefono(registro.whatsapp);
    if (!telefono) {
      mostrarMensaje("Este registro no tiene un número de WhatsApp válido.", "error");
      return;
    }
    const mensaje = encodeURIComponent(crearMensajeWhatsApp(registro));
    window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank", "noopener,noreferrer");
  }

  function obtenerDatosFormulario() {
    const formData = new FormData(elementos.formulario);
    const registro = Object.fromEntries(formData.entries());
    registro.id = estado.editandoId;
    registro.modulo = modulo;
    registro.precioCuenta = Number(registro.precioCuenta || 0);
    registro.precioFinal = Number(registro.precioFinal || 0);
    registro.ganancia = Number(registro.precioFinal - registro.precioCuenta);
    registro.fechaVencimiento = agregarMesesSeguro(registro.fechaCompra, registro.tiempoServicio);
    registro.estado = calcularEstado(registro.fechaVencimiento);
    registro.diasRestantes = diasRestantes(registro.fechaVencimiento);
    return registro;
  }

  function validarRegistro(registro) {
    const obligatorios = [
      [registro.nombre, "nombre"],
      [registro.apellido, "apellido"],
      [registro.whatsapp, "WhatsApp"],
      [registro.producto, "producto"],
      [registro.fechaCompra, "fecha de compra"],
      [registro.tiempoServicio, "tiempo del servicio"],
      [registro.correoCuenta, "correo de la cuenta"],
      [registro.contrasenaCuenta, "contraseña de la cuenta"]
    ];
    const faltante = obligatorios.find(([valor]) => !String(valor || "").trim());
    if (faltante) return `Debes completar el campo ${faltante[1]}.`;
    if (normalizarTelefono(registro.whatsapp).length < 8) return "Escribe el WhatsApp con código de país.";
    if (registro.precioCuenta < 0 || registro.precioFinal < 0) return "Los precios no pueden ser negativos.";
    return "";
  }

  function tieneConexionApi() {
    return Boolean(
      String(config.APPS_SCRIPT_URL || "").startsWith("https://script.google.com/") &&
      String(config.API_KEY_SOCIOS || "").trim()
    );
  }

  async function peticionApi(accion, datos = null) {
    const urlBase = String(config.APPS_SCRIPT_URL || "").trim();
    const claveApi = String(config.API_KEY_SOCIOS || "").trim();

    if (!tieneConexionApi()) throw new Error("MODO_LOCAL");

    if (!datos) {
      const url = new URL(urlBase);
      url.searchParams.set("action", accion);
      url.searchParams.set("tipo", modulo);
      url.searchParams.set("claveApi", claveApi);
      const respuesta = await fetch(url.toString(), { cache: "no-store" });
      const json = await respuesta.json();
      if (!json.ok) throw new Error(json.mensaje || "No se pudo consultar la información.");
      return json;
    }

    const respuesta = await fetch(urlBase, {
      method: "POST",
      body: JSON.stringify({ action: accion, tipo: modulo, claveApi, ...datos })
    });
    const json = await respuesta.json();
    if (!json.ok) throw new Error(json.mensaje || "No se pudo guardar la información.");
    return json;
  }

  function leerLocal() {
    try {
      return JSON.parse(localStorage.getItem(prefijoLocal) || "[]");
    } catch {
      return [];
    }
  }

  function guardarLocal(registros) {
    localStorage.setItem(prefijoLocal, JSON.stringify(registros));
  }

  async function cargarRegistros() {
    elementos.cargandoTabla.hidden = false;
    elementos.estadoVacio.hidden = true;
    elementos.tablaCuerpo.innerHTML = "";

    try {
      if (tieneConexionApi()) {
        const respuesta = await peticionApi("listarSocios");
        estado.registros = respuesta.registros || [];
        elementos.estadoConexion.textContent = "Google Sheets conectado";
        elementos.estadoConexion.className = "estado-conexion conectado";
      } else {
        estado.registros = leerLocal();
        elementos.estadoConexion.textContent = "Modo local — falta conectar Apps Script";
        elementos.estadoConexion.className = "estado-conexion local";
      }
    } catch (error) {
      console.error(error);
      estado.registros = leerLocal();
      elementos.estadoConexion.textContent = "Sin conexión — mostrando datos locales";
      elementos.estadoConexion.className = "estado-conexion error";
      mostrarMensaje("No se pudo conectar con Google Sheets. Se muestran los datos guardados en este navegador.", "error");
    } finally {
      elementos.cargandoTabla.hidden = true;
      renderizar();
    }
  }

  async function guardarRegistro(evento) {
    evento.preventDefault();
    const registro = obtenerDatosFormulario();
    const error = validarRegistro(registro);
    if (error) {
      mostrarMensaje(error, "error");
      return;
    }

    const boton = $("#botonGuardar");
    boton.disabled = true;
    boton.textContent = "Guardando...";

    try {
      if (tieneConexionApi()) {
        await peticionApi("guardarSocio", { registro });
      } else {
        const locales = leerLocal();
        if (registro.id) {
          const indice = locales.findIndex((item) => item.id === registro.id);
          if (indice >= 0) locales[indice] = { ...locales[indice], ...registro };
        } else {
          registro.id = `${modulo === "PROVEEDOR" ? "PRV" : "REV"}-LOCAL-${Date.now()}`;
          registro.creadoEn = new Date().toISOString();
          locales.unshift(registro);
        }
        guardarLocal(locales);
      }

      cerrarModal();
      await cargarRegistros();
      mostrarMensaje(`${singular[0].toUpperCase() + singular.slice(1)} guardado correctamente.`, "exito");
    } catch (errorGuardado) {
      console.error(errorGuardado);
      mostrarMensaje(errorGuardado.message || "No se pudo guardar el registro.", "error");
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar registro";
    }
  }

  async function desactivarRegistro(id) {
    const registro = estado.registros.find((item) => item.id === id);
    if (!registro) return;
    if (!window.confirm(`¿Deseas desactivar el registro de ${registro.nombre} ${registro.apellido}?`)) return;

    try {
      if (tieneConexionApi()) {
        await peticionApi("desactivarSocio", { id });
      } else {
        const locales = leerLocal().map((item) => item.id === id ? { ...item, estado: "INACTIVO" } : item);
        guardarLocal(locales);
      }
      await cargarRegistros();
      mostrarMensaje("Registro desactivado.", "exito");
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo desactivar el registro.", "error");
    }
  }

  function obtenerFiltrados() {
    const texto = estado.filtroTexto.toLowerCase();
    return estado.registros
      .map((registro) => ({
        ...registro,
        diasRestantes: diasRestantes(registro.fechaVencimiento),
        estado: registro.estado === "INACTIVO" ? "INACTIVO" : calcularEstado(registro.fechaVencimiento)
      }))
      .filter((registro) => {
        const coincideTexto = !texto || [
          registro.nombre,
          registro.apellido,
          registro.producto,
          registro.correoCuenta,
          registro.whatsapp
        ].some((valor) => String(valor || "").toLowerCase().includes(texto));
        const coincideEstado = estado.filtroEstado === "TODOS" || registro.estado === estado.filtroEstado;
        return coincideTexto && coincideEstado;
      });
  }

  function renderizarKpis() {
    const activos = estado.registros.filter((r) => calcularEstado(r.fechaVencimiento) === "ACTIVO" && r.estado !== "INACTIVO").length;
    const porVencer = estado.registros.filter((r) => calcularEstado(r.fechaVencimiento) === "POR_VENCER" && r.estado !== "INACTIVO").length;
    const vencidos = estado.registros.filter((r) => calcularEstado(r.fechaVencimiento) === "VENCIDO" && r.estado !== "INACTIVO").length;
    elementos.total.textContent = estado.registros.length;
    elementos.activos.textContent = activos;
    elementos.porVencer.textContent = porVencer;
    elementos.vencidos.textContent = vencidos;
  }

  function renderizar() {
    renderizarKpis();
    const registros = obtenerFiltrados();
    elementos.tablaCuerpo.innerHTML = "";
    elementos.estadoVacio.hidden = registros.length > 0;

    registros.forEach((registro) => {
      const fila = document.createElement("tr");
      const dias = registro.diasRestantes;
      const textoDias = registro.estado === "VENCIDO"
        ? `Venció hace ${Math.abs(dias)} día${Math.abs(dias) === 1 ? "" : "s"}`
        : `${dias} día${dias === 1 ? "" : "s"} restantes`;
      const gananciaClase = Number(registro.ganancia) >= 0 ? "ganancia-positiva" : "ganancia-negativa";

      fila.innerHTML = `
        <td>
          <div class="celda-contacto">
            <span class="avatar-tabla">${escaparHtml((registro.nombre || "?").charAt(0).toUpperCase())}</span>
            <div><strong>${escaparHtml(registro.nombre)} ${escaparHtml(registro.apellido)}</strong><small>${escaparHtml(registro.whatsapp)}</small></div>
          </div>
        </td>
        <td><div class="celda-producto"><strong>${escaparHtml(registro.producto)}</strong><small>${etiquetaTiempo(registro.tiempoServicio)}</small></div></td>
        <td>
          <div class="celda-cuenta"><strong>${escaparHtml(registro.correoCuenta)}</strong>
          <div class="password-fila"><code data-password="${escaparHtml(registro.contrasenaCuenta)}">••••••••</code><button type="button" class="boton-mini" data-accion="ver-password" data-id="${escaparHtml(registro.id)}">Ver</button></div></div>
        </td>
        <td><div class="celda-fechas"><span>Compra: ${formatearFecha(registro.fechaCompra)}</span><strong>Vence: ${formatearFecha(registro.fechaVencimiento)}</strong><small>${textoDias}</small></div></td>
        <td><span class="chip-tiempo">${etiquetaTiempo(registro.tiempoServicio)}</span></td>
        <td>
          <div class="celda-precios"><span>Costo: ${formatearDinero(registro.precioCuenta, registro.moneda)}</span><span>Final: ${formatearDinero(registro.precioFinal, registro.moneda)}</span><strong class="${gananciaClase}">Ganancia: ${formatearDinero(registro.ganancia, registro.moneda)}</strong></div>
        </td>
        <td><span class="estado-chip estado-${registro.estado.toLowerCase()}">${registro.estado.replace("_", " ")}</span></td>
        <td>
          <div class="acciones-tabla">
            <button type="button" class="boton-accion whatsapp" data-accion="whatsapp" data-id="${escaparHtml(registro.id)}" title="Abrir mensaje de WhatsApp" aria-label="Abrir mensaje de WhatsApp"><svg><use href="#i-whatsapp"></use></svg></button>
            <button type="button" class="boton-accion" data-accion="editar" data-id="${escaparHtml(registro.id)}" title="Editar" aria-label="Editar"><svg><use href="#i-edit"></use></svg></button>
            <button type="button" class="boton-accion peligro" data-accion="desactivar" data-id="${escaparHtml(registro.id)}" title="Desactivar" aria-label="Desactivar"><svg><use href="#i-trash"></use></svg></button>
          </div>
        </td>`;
      elementos.tablaCuerpo.appendChild(fila);
    });
  }

  function manejarAccionTabla(evento) {
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;
    const { accion, id } = boton.dataset;
    const registro = estado.registros.find((item) => item.id === id);

    if (accion === "whatsapp") abrirWhatsApp(id);
    if (accion === "editar" && registro) abrirModal(registro);
    if (accion === "desactivar") desactivarRegistro(id);
    if (accion === "ver-password") {
      const codigo = boton.parentElement.querySelector("code");
      const oculto = codigo.textContent === "••••••••";
      codigo.textContent = oculto ? codigo.dataset.password : "••••••••";
      boton.textContent = oculto ? "Ocultar" : "Ver";
    }
  }

  function configurarEventos() {
    elementos.botonAbrirMenu?.addEventListener("click", abrirMenu);
    elementos.botonCerrarMenu?.addEventListener("click", cerrarMenu);
    elementos.capaOscura?.addEventListener("click", cerrarMenu);
    elementos.botonCerrarSesion?.addEventListener("click", () => {
      if (window.confirm("¿Deseas cerrar la sesión?")) window.location.href = "index.html";
    });
    elementos.botonNuevo?.addEventListener("click", () => abrirModal());
    elementos.botonNuevoVacio?.addEventListener("click", () => abrirModal());
    elementos.botonCerrarModal?.addEventListener("click", cerrarModal);
    elementos.botonCancelar?.addEventListener("click", cerrarModal);
    elementos.modal?.addEventListener("click", (evento) => {
      if (evento.target === elementos.modal) cerrarModal();
    });
    elementos.formulario?.addEventListener("submit", guardarRegistro);
    elementos.fechaCompra?.addEventListener("change", calcularVencimientoFormulario);
    elementos.tiempoServicio?.addEventListener("change", calcularVencimientoFormulario);
    elementos.precioCuenta?.addEventListener("input", calcularGananciaFormulario);
    elementos.precioFinal?.addEventListener("input", calcularGananciaFormulario);
    elementos.tablaCuerpo?.addEventListener("click", manejarAccionTabla);
    elementos.buscar?.addEventListener("input", (evento) => {
      estado.filtroTexto = evento.target.value.trim();
      renderizar();
    });
    elementos.filtroEstado?.addEventListener("change", (evento) => {
      estado.filtroEstado = evento.target.value;
      renderizar();
    });
    elementos.botonActualizar?.addEventListener("click", cargarRegistros);
    document.querySelectorAll("[data-pagina]").forEach((enlace) => {
      enlace.addEventListener("click", (evento) => {
        evento.preventDefault();
        mostrarMensaje(`La sección “${enlace.dataset.pagina || "Esta sección"}” se conectará en una fase posterior.`, "informacion");
        if (window.innerWidth <= 980) cerrarMenu();
      });
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) cerrarMenu();
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && elementos.modal.classList.contains("visible")) cerrarModal();
    });
  }

  configurarEventos();
  cargarRegistros();
})();
