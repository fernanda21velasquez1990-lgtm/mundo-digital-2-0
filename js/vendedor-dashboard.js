(() => {
  "use strict";

  const sesion = window.MD20Auth?.leerSesion();
  if (!sesion?.usuario) return;

  const cfg = window.MUNDO_DIGITAL_CONFIG || {};
  const u = sesion.usuario;
  const tokenSesion = String(sesion.tokenSesion || "").trim();

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const E = {
    nombre: $("#nombreVendedor"),
    vendedorId: $("#vendedorId"),
    usuario: $("#usuarioVendedor"),
    conexion: $("#estadoConexion"),
    actualizacion: $("#ultimaActualizacion"),
    statVentas: $("#statVentas"),
    statVentasTotal: $("#statVentasTotal"),
    statComisionPendiente: $("#statComisionPendiente"),
    statComisiones: $("#statComisiones"),
    statClientes: $("#statClientes"),
    statProductos: $("#statProductos"),
    eyebrow: $("#workspaceEyebrow"),
    title: $("#workspaceTitle"),
    text: $("#workspaceText"),
    body: $("#workspaceBody"),
    loading: $("#workspaceLoading"),
    error: $("#workspaceError"),
    actualizar: $("#botonActualizar"),
    toast: $("#toast")
  };

  const MODULOS = {
    ventas: { numero: "01", titulo: "Mis ventas", texto: "Operaciones asociadas a tu ID de vendedor." },
    clientes: { numero: "02", titulo: "Mis clientes", texto: "Clientes relacionados con tus operaciones." },
    pagos: { numero: "03", titulo: "Mis pagos", texto: "Estado de pagos vinculados a tus ventas." },
    comisiones: { numero: "04", titulo: "Mis comisiones", texto: "Comisiones pendientes, pagadas e historial." },
    productos: { numero: "05", titulo: "Productos", texto: "Productos publicados y autorizados para vender." },
    chat: { numero: "06", titulo: "Chat con Administrador", texto: "Comunicación interna con administración." }
  };

  const state = {
    modulo: "ventas",
    datos: null,
    cargando: false
  };

  E.nombre.textContent = u.nombreCompleto || u.usuario || "Vendedor";
  E.vendedorId.textContent = u.vendedorId || "SIN VÍNCULO";
  E.usuario.textContent = `@${u.usuario || "vendedor"}`;

  function aviso(texto, tipo = "normal") {
    E.toast.textContent = texto;
    E.toast.className = `toast show ${tipo}`;
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => { E.toast.className = "toast"; }, 3600);
  }

  function esc(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, (m) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
  }

  function escAttr(valor) {
    return esc(valor).replace(/`/g, "&#096;");
  }

  function money(valor) {
    return Number(valor || 0).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function fecha(valor, conHora = false) {
    if (!valor) return "—";
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return esc(valor);
    return d.toLocaleString("es-ES", conHora
      ? { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }
      : { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function estadoClase(valor) {
    const e = String(valor || "").toUpperCase();
    if (["PAGADO", "PAGADA", "CONFIRMADO", "ACTIVO", "ACTIVA", "ENTREGADO", "DISPONIBLE"].includes(e)) return "good";
    if (["PENDIENTE", "EN_REVISION", "BLOQUEADA", "PROCESANDO", "POR_VENCER"].includes(e)) return "warn";
    if (["RECHAZADO", "ANULADO", "CANCELADO", "INACTIVO", "VENCIDO"].includes(e)) return "bad";
    return "neutral";
  }

  function vacio(titulo, texto) {
    return `<div class="empty-state"><strong>${esc(titulo)}</strong><span>${esc(texto)}</span></div>`;
  }

  function tabla(headers, filas) {
    return `<div class="table-wrap"><table class="seller-table"><thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${filas.join("")}</tbody></table></div>`;
  }

  async function getPanel() {
    if (!cfg.APPS_SCRIPT_URL) throw new Error("Falta configurar la conexión con Apps Script.");
    if (!tokenSesion) throw new Error("Debes cerrar sesión e iniciar nuevamente para activar los módulos del vendedor.");

    const url = new URL(cfg.APPS_SCRIPT_URL);
    url.searchParams.set("action", "panelVendedorMD20");
    url.searchParams.set("tokenSesion", tokenSesion);
    url.searchParams.set("_", Date.now());

    const r = await fetch(url, { redirect: "follow", cache: "no-store" });
    const d = await r.json();
    if (!d.ok) throw new Error(d.mensaje || "No se pudieron cargar tus datos.");
    return d;
  }

  async function post(body) {
    const r = await fetch(cfg.APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...body, tokenSesion })
    });
    const d = await r.json();
    if (!d.ok) throw new Error(d.mensaje || "No se pudo completar la operación.");
    return d;
  }

  function actualizarResumen() {
    const r = state.datos?.resumen || {};
    E.statVentas.textContent = Number(r.ventas || 0);
    E.statVentasTotal.textContent = `${money(r.ventasTotal)} USD acumulados`;
    E.statComisionPendiente.textContent = `${money(r.comisionPendienteUsd)} USD`;
    E.statComisiones.textContent = `${Number(r.comisiones || 0)} comisiones registradas`;
    E.statClientes.textContent = Number(r.clientes || 0);
    E.statProductos.textContent = `${Number(r.productos || 0)} productos disponibles`;
  }

  function renderVentas() {
    const ventas = state.datos?.ventas || [];
    if (!ventas.length) {
      E.body.innerHTML = vacio("Todavía no tienes ventas asociadas", "Cuando una venta quede vinculada a tu ID de vendedor aparecerá aquí.");
      return;
    }

    E.body.innerHTML = tabla(
      ["Venta", "Cliente", "Producto", "Fecha", "Total", "Pago", "Entrega"],
      ventas.map(v => `<tr>
        <td><strong>${esc(v.numeroVenta || v.id)}</strong><small>${esc(v.id)}</small></td>
        <td><strong>${esc(v.clienteNombre)}</strong><small>${esc(v.clienteTelefono ? "+" + v.clienteTelefono : "")}</small></td>
        <td>${esc(v.productoNombre || "—")}</td>
        <td>${fecha(v.fechaVenta)}</td>
        <td><strong>${money(v.total)} ${esc(v.moneda || "USD")}</strong></td>
        <td><span class="status ${estadoClase(v.estadoPago)}">${esc(v.estadoPago || "PENDIENTE")}</span></td>
        <td><span class="status ${estadoClase(v.estadoEntrega)}">${esc(v.estadoEntrega || "PENDIENTE")}</span></td>
      </tr>`)
    );
  }

  function renderClientes() {
    const clientes = state.datos?.clientes || [];
    if (!clientes.length) {
      E.body.innerHTML = vacio("Sin clientes asociados", "Los clientes aparecerán cuando tengan una venta vinculada a tu vendedor.");
      return;
    }

    E.body.innerHTML = tabla(
      ["Cliente", "WhatsApp", "Correo", "País / Ciudad", "Compras", "Estado"],
      clientes.map(c => `<tr>
        <td><strong>${esc(c.nombreCompleto || "Cliente")}</strong><small>${esc(c.id)}</small></td>
        <td>${esc(c.telefono ? "+" + c.telefono : "—")}</td>
        <td>${esc(c.correo || "—")}</td>
        <td>${esc([c.pais, c.ciudad].filter(Boolean).join(" / ") || "—")}</td>
        <td>${Number(c.cantidadCompras || 0)}</td>
        <td><span class="status ${estadoClase(c.estado)}">${esc(c.estado || "ACTIVO")}</span></td>
      </tr>`)
    );
  }

  function renderPagos() {
    const pagos = state.datos?.pagos || [];
    if (!pagos.length) {
      E.body.innerHTML = vacio("Sin pagos asociados", "Los pagos correspondientes a tus ventas aparecerán aquí.");
      return;
    }

    E.body.innerHTML = tabla(
      ["Venta", "Cliente", "Monto", "Método", "Referencia", "Estado", "Fecha"],
      pagos.map(p => `<tr>
        <td><strong>${esc(p.numeroVenta || p.ventaId)}</strong><small>${esc(p.id)}</small></td>
        <td>${esc(p.clienteNombre || "—")}</td>
        <td><strong>${money(p.monto)} ${esc(p.moneda || "USD")}</strong></td>
        <td>${esc(p.metodoPagoNombre || "—")}</td>
        <td>${esc(p.referencia || "—")}</td>
        <td><span class="status ${estadoClase(p.estado)}">${esc(p.estado || "PENDIENTE")}</span></td>
        <td>${fecha(p.fechaPago)}</td>
      </tr>`)
    );
  }

  function renderComisiones() {
    const lista = state.datos?.comisiones || [];
    if (!lista.length) {
      E.body.innerHTML = vacio("Sin comisiones registradas", "Cuando el Bot Admin genere una comisión para tu vendedor, se mostrará aquí.");
      return;
    }

    const pendientes = lista.filter(c => String(c.estado).toUpperCase() === "PENDIENTE");
    const pagadas = lista.filter(c => String(c.estado).toUpperCase() === "PAGADA");
    const resumen = `<div class="mini-kpis">
      <article><span>Pendientes</span><strong>${pendientes.length}</strong><small>${money(pendientes.reduce((s,c)=>s+Number(c.monto||0),0))} USD</small></article>
      <article><span>Pagadas</span><strong>${pagadas.length}</strong><small>${money(pagadas.reduce((s,c)=>s+Number(c.monto||0),0))} USD</small></article>
      <article><span>Total generado</span><strong>${money(lista.reduce((s,c)=>s+Number(c.monto||0),0))}</strong><small>USD</small></article>
    </div>`;

    E.body.innerHTML = resumen + tabla(
      ["Comisión", "Cliente", "Venta", "Tipo / Valor", "Monto", "Estado", "Generada", "Pagada"],
      lista.map(c => `<tr>
        <td><strong>${esc(c.id || "—")}</strong></td>
        <td>${esc(c.cliente || "—")}</td>
        <td>${money(c.montoVenta)} USD</td>
        <td>${esc(c.tipo || "—")}<small>${Number(c.valor || 0) ? esc(String(c.valor)) : ""}</small></td>
        <td><strong>${money(c.monto)} ${esc(c.moneda || "USD")}</strong></td>
        <td><span class="status ${estadoClase(c.estado)}">${esc(c.estado || "PENDIENTE")}</span></td>
        <td>${fecha(c.generadaEn, true)}</td>
        <td>${c.pagadaEn ? fecha(c.pagadaEn, true) : "—"}</td>
      </tr>`)
    );
  }

  function renderProductos() {
    const productos = state.datos?.productos || [];
    if (!productos.length) {
      E.body.innerHTML = vacio("No hay productos publicados", "Administración debe habilitar productos para vendedores en el catálogo.");
      return;
    }

    E.body.innerHTML = `<div class="product-grid">${productos.map(p => `
      <article class="product-card">
        <div class="product-image">${p.imagenUrl ? `<img src="${escAttr(p.imagenUrl)}" alt="${escAttr(p.nombre)}" loading="lazy">` : `<span>MD</span>`}</div>
        <div class="product-info">
          <small>${esc(p.categoria || "Producto digital")}</small>
          <strong>${esc(p.nombre)}</strong>
          <div><b>${money(p.precio)} ${esc(p.moneda || "USD")}</b>${Number(p.precioAnterior || 0) > Number(p.precio || 0) ? `<del>${money(p.precioAnterior)}</del>` : ""}</div>
          <span class="status ${estadoClase(p.disponibilidad)}">${esc(p.disponibilidad || "DISPONIBLE")}</span>
        </div>
      </article>`).join("")}</div>`;
  }

  function renderChat() {
    const mensajes = state.datos?.chat || [];
    const items = mensajes.length
      ? mensajes.map(m => `<div class="chat-message ${String(m.remitente).toUpperCase() === "VENDEDOR" ? "mine" : "admin"}">
          <small>${String(m.remitente).toUpperCase() === "VENDEDOR" ? "Tú" : "Administrador"}</small>
          <p>${esc(m.mensaje)}</p>
          <time>${fecha(m.creadoEn, true)}</time>
        </div>`).join("")
      : `<div class="chat-empty">Aún no hay mensajes. Puedes escribirle al Administrador desde aquí.</div>`;

    E.body.innerHTML = `<div class="chat-shell">
      <div class="chat-history" id="chatHistory">${items}</div>
      <form class="chat-form" id="formChat">
        <textarea id="mensajeChat" maxlength="2000" rows="3" placeholder="Escribe un mensaje al Administrador…" required></textarea>
        <button type="submit" id="enviarChat">Enviar mensaje</button>
      </form>
    </div>`;

    const history = $("#chatHistory");
    if (history) history.scrollTop = history.scrollHeight;

    $("#formChat")?.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const textarea = $("#mensajeChat");
      const boton = $("#enviarChat");
      const mensaje = textarea.value.trim();
      if (!mensaje) return;
      boton.disabled = true;
      boton.textContent = "Enviando…";
      try {
        await post({ action: "enviarMensajeVendedorPanelMD20", mensaje });
        textarea.value = "";
        await cargarPanel(false);
        aviso("Mensaje enviado al Administrador.", "exito");
      } catch (e) {
        aviso(e.message || "No se pudo enviar el mensaje.", "error");
      } finally {
        boton.disabled = false;
        boton.textContent = "Enviar mensaje";
      }
    });
  }

  function renderModulo() {
    const info = MODULOS[state.modulo];
    E.eyebrow.textContent = `MÓDULO ${info.numero}`;
    E.title.textContent = info.titulo;
    E.text.textContent = info.texto;
    E.error.hidden = true;
    E.loading.hidden = true;

    if (!state.datos) {
      E.body.innerHTML = vacio("Información no disponible", "Actualiza el panel para volver a intentar.");
      return;
    }

    if (state.modulo === "ventas") renderVentas();
    if (state.modulo === "clientes") renderClientes();
    if (state.modulo === "pagos") renderPagos();
    if (state.modulo === "comisiones") renderComisiones();
    if (state.modulo === "productos") renderProductos();
    if (state.modulo === "chat") renderChat();
  }

  async function cargarPanel(mostrarCarga = true) {
    if (state.cargando) return;
    state.cargando = true;
    E.error.hidden = true;
    if (mostrarCarga) {
      E.loading.hidden = false;
      E.body.innerHTML = "";
    }
    E.conexion.textContent = "Sincronizando…";
    E.conexion.className = "connection checking";
    E.actualizar.disabled = true;

    try {
      state.datos = await getPanel();
      actualizarResumen();
      renderModulo();
      E.conexion.textContent = "Google Sheets conectado";
      E.conexion.className = "connection online";
      E.actualizacion.textContent = `Actualizado ${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
    } catch (e) {
      E.loading.hidden = true;
      E.body.innerHTML = "";
      E.error.hidden = false;
      E.error.innerHTML = `<strong>No se pudo cargar el panel</strong><span>${esc(e.message || "Error de conexión")}</span>`;
      E.conexion.textContent = "Sin conexión";
      E.conexion.className = "connection offline";
    } finally {
      state.cargando = false;
      E.actualizar.disabled = false;
    }
  }

  $$('[data-modulo]').forEach((boton) => {
    boton.addEventListener("click", () => {
      const modulo = boton.dataset.modulo;
      if (!MODULOS[modulo]) return;
      state.modulo = modulo;
      $$('[data-modulo]').forEach(b => b.classList.toggle("active", b === boton));
      renderModulo();
      $("#workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  E.actualizar.addEventListener("click", () => cargarPanel(true));

  cargarPanel(true);
})();
