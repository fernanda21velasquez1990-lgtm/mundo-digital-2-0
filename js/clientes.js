(() => {
  "use strict";

  const config = window.MUNDO_DIGITAL_CONFIG || {};
  const estadoApp = { registros: [], editandoId: "", filtroTexto: "", filtroEstado: "TODOS" };
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const el = {
    menu: $("#menuLateral"), capa: $("#capaOscura"), abrirMenu: $("#botonAbrirMenu"),
    cerrarMenu: $("#botonCerrarMenu"), cerrarSesion: $("#botonCerrarSesion"),
    nuevo: $("#botonNuevoCliente"), nuevoVacio: $("#botonNuevoVacio"),
    modal: $("#modalCliente"), cerrarModal: $("#botonCerrarModal"), cancelar: $("#botonCancelar"),
    formulario: $("#formularioCliente"), tituloModal: $("#tituloModal"), guardar: $("#botonGuardar"),
    tabla: $("#tablaClientesBody"), cargando: $("#cargandoTabla"), vacio: $("#estadoVacio"),
    buscar: $("#buscarCliente"), filtro: $("#filtroEstado"), actualizar: $("#botonActualizar"),
    conexion: $("#estadoConexion"), mensaje: $("#mensajePanel"),
    kpiTotal: $("#kpiTotal"), kpiActivos: $("#kpiActivos"),
    kpiConCompras: $("#kpiConCompras"), kpiVentas: $("#kpiVentas"),
    modalHistorial: $("#modalHistorial"), cerrarHistorial: $("#botonCerrarHistorial"),
    tituloHistorial: $("#tituloHistorial"), contenidoHistorial: $("#contenidoHistorial")
  };

  const campos = ["nombreCompleto","codigoPais","telefono","correo","documento","pais","ciudad",
    "direccion","fechaNacimiento","origenCliente","etiquetas","notas","estado"]
    .reduce((o, id) => (o[id] = $("#" + id), o), {});

  function mostrarMensaje(texto, tipo = "exito") {
    el.mensaje.textContent = texto;
    el.mensaje.className = `mensaje-flotante visible ${tipo}`;
    clearTimeout(mostrarMensaje.t);
    mostrarMensaje.t = setTimeout(() => el.mensaje.className = "mensaje-flotante", 3800);
  }

  function abrirModal(registro = null) {
    estadoApp.editandoId = registro?.id || "";
    el.formulario.reset();
    campos.codigoPais.value = "+58";
    campos.origenCliente.value = "WHATSAPP";
    campos.estado.value = "ACTIVO";
    el.tituloModal.textContent = registro ? "Editar cliente" : "Nuevo cliente";

    if (registro) {
      Object.keys(campos).forEach(k => {
        if (registro[k] !== undefined && registro[k] !== null) campos[k].value = registro[k];
      });
    }

    el.modal.classList.add("visible");
    el.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => campos.nombreCompleto.focus(), 100);
  }

  function cerrarModal() {
    el.modal.classList.remove("visible");
    el.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    estadoApp.editandoId = "";
  }

  function abrirHistorialModal() {
    el.modalHistorial.classList.add("visible");
    el.modalHistorial.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function cerrarHistorialModal() {
    el.modalHistorial.classList.remove("visible");
    el.modalHistorial.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function normalizarTelefono(codigo, telefono) {
    const c = String(codigo || "").replace(/\D/g, "");
    const t = String(telefono || "").replace(/\D/g, "");
    return `${c}${t}`.replace(/^0+/, "");
  }

  async function peticionGet(action, extra = {}) {
    if (!config.APPS_SCRIPT_URL || !config.API_KEY_SOCIOS) throw new Error("Falta configurar la URL o la clave API.");
    const url = new URL(config.APPS_SCRIPT_URL);
    url.searchParams.set("action", action);
    url.searchParams.set("claveApi", config.API_KEY_SOCIOS);
    Object.entries(extra).forEach(([k,v]) => url.searchParams.set(k, v));
    const r = await fetch(url.toString(), { method: "GET", redirect: "follow" });
    const data = await r.json();
    if (!data.ok) throw new Error(data.mensaje || "No se pudo completar la consulta.");
    return data;
  }

  async function peticionPost(cuerpo) {
    if (!config.APPS_SCRIPT_URL || !config.API_KEY_SOCIOS) throw new Error("Falta configurar la URL o la clave API.");
    const r = await fetch(config.APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...cuerpo, claveApi: config.API_KEY_SOCIOS })
    });
    const data = await r.json();
    if (!data.ok) throw new Error(data.mensaje || "No se pudo guardar.");
    return data;
  }

  async function cargarClientes() {
    el.cargando.hidden = false; el.vacio.hidden = true; el.tabla.innerHTML = "";
    try {
      const data = await peticionGet("listarClientes");
      estadoApp.registros = Array.isArray(data.registros) ? data.registros : [];
      el.conexion.textContent = "Google Sheets conectado";
      el.conexion.className = "estado-conexion conectado";
      renderizar();
    } catch (error) {
      el.conexion.textContent = "Sin conexión";
      el.conexion.className = "estado-conexion local";
      el.cargando.hidden = true; el.vacio.hidden = false;
      mostrarMensaje(error.message, "error");
    }
  }

  function registrosFiltrados() {
    const texto = estadoApp.filtroTexto.toLowerCase();
    return estadoApp.registros.filter(r => {
      const coincideEstado = estadoApp.filtroEstado === "TODOS" || r.estado === estadoApp.filtroEstado;
      const bolsa = [r.nombreCompleto,r.telefono,r.correo,r.documento,r.pais,r.ciudad,r.etiquetas].join(" ").toLowerCase();
      return coincideEstado && (!texto || bolsa.includes(texto));
    });
  }

  function renderizar() {
    const lista = registrosFiltrados();
    el.cargando.hidden = true;
    el.vacio.hidden = lista.length !== 0;
    el.tabla.innerHTML = lista.map(filaHtml).join("");
    actualizarKpis();
    conectarAcciones();
  }

  function filaHtml(r) {
    const iniciales = String(r.nombreCompleto || "C").split(/\s+/).slice(0,2).map(x => x[0]).join("").toUpperCase();
    const etiquetas = String(r.etiquetas || "").split(",").map(x=>x.trim()).filter(Boolean)
      .slice(0,3).map(x=>`<span class="etiqueta-cliente">${esc(x)}</span>`).join("");
    return `<tr>
      <td><div class="cliente-identidad"><span class="cliente-avatar">${esc(iniciales)}</span><div><strong>${esc(r.nombreCompleto)}</strong><small>${esc(r.correo || "Sin correo")}</small><small>${esc(r.documento || "Sin documento")}</small></div></div></td>
      <td><div class="cliente-dato"><strong>+${esc(r.telefono || "")}</strong><small>${esc(r.codigoPais || "")}</small></div></td>
      <td><div class="cliente-dato"><strong>${esc(r.ciudad || "Sin ciudad")}</strong><small>${esc(r.pais || "Sin país")}</small></div></td>
      <td><div class="cliente-dato"><strong>${esc(r.origenCliente || "OTRO")}</strong><div class="etiquetas-cliente">${etiquetas || '<small>Sin etiquetas</small>'}</div></div></td>
      <td><div class="compras-cliente"><strong>${formatoDinero(r.totalCompras)}</strong><small>${Number(r.cantidadCompras || 0)} compra(s)</small></div></td>
      <td><div class="cliente-dato"><strong>${formatoFecha(r.ultimaCompra)}</strong><small>${r.ultimaCompra ? "Último movimiento" : "Sin compras"}</small></div></td>
      <td><span class="estado-cliente ${String(r.estado).toLowerCase()}">${esc(r.estado)}</span></td>
      <td><div class="acciones-cliente">
        <button class="accion-cliente whatsapp" data-accion="whatsapp" data-id="${esc(r.id)}" title="Abrir WhatsApp"><svg><use href="#i-whatsapp"></use></svg></button>
        <button class="accion-cliente" data-accion="historial" data-id="${esc(r.id)}" title="Historial"><svg><use href="#i-history"></use></svg></button>
        <button class="accion-cliente" data-accion="portal" data-id="${esc(r.id)}" title="Generar portal privado"><svg><use href="#i-link"></use></svg></button>
        <button class="accion-cliente" data-accion="editar" data-id="${esc(r.id)}" title="Editar"><svg><use href="#i-edit"></use></svg></button>
        <button class="accion-cliente" data-accion="desactivar" data-id="${esc(r.id)}" title="Desactivar"><svg><use href="#i-trash"></use></svg></button>
      </div></td>
    </tr>`;
  }

  function conectarAcciones() {
    $$("[data-accion]").forEach(b => b.addEventListener("click", async () => {
      const r = estadoApp.registros.find(x => x.id === b.dataset.id);
      if (!r) return;
      if (b.dataset.accion === "editar") abrirModal(r);
      if (b.dataset.accion === "whatsapp") abrirWhatsApp(r);
      if (b.dataset.accion === "historial") await verHistorial(r);
      if (b.dataset.accion === "portal") await generarPortal(r);
      if (b.dataset.accion === "desactivar") await desactivar(r);
    }));
  }

  async function generarPortal(r) {
    try {
      const data = await peticionPost({ action:"generarPortalCliente", clienteId:r.id });
      const base = location.href.replace(/clientes\.html.*$/i, "mi-cuenta.html");
      const enlace = `${base}?token=${encodeURIComponent(data.token)}`;
      await navigator.clipboard.writeText(enlace);
      mostrarMensaje("Enlace privado copiado. Ya puedes enviarlo al cliente.");
      const numero = String(r.telefono || "").replace(/\D/g,"");
      const mensaje = `Hola ${r.nombreCompleto} 👋\n\nPuedes consultar tus cuentas, vencimientos y confirmar renovaciones desde este enlace privado:\n\n${enlace}\n\nNo compartas este enlace con otras personas.`;
      if (numero && confirm("El enlace fue copiado. ¿Abrir WhatsApp para enviarlo al cliente?")) {
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
      }
    } catch (e) {
      mostrarMensaje(e.message, "error");
    }
  }

  function abrirWhatsApp(r) {
    const numero = String(r.telefono || "").replace(/\D/g,"");
    if (!numero) return mostrarMensaje("Este cliente no tiene WhatsApp.", "error");
    const mensaje = `Hola ${r.nombreCompleto}, te saludamos de Mundo Digital 2.0. ¿Cómo podemos ayudarte hoy?`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
  }

  async function verHistorial(r) {
    abrirHistorialModal();
    el.tituloHistorial.textContent = `Compras de ${r.nombreCompleto}`;
    el.contenidoHistorial.innerHTML = '<div class="historial-vacio">Cargando historial...</div>';
    try {
      const data = await peticionGet("historialCliente", { clienteId: r.id });
      const ventas = data.ventas || [];
      if (!ventas.length) {
        el.contenidoHistorial.innerHTML = '<div class="historial-vacio">Este cliente todavía no tiene compras registradas.</div>';
        return;
      }
      const total = ventas.reduce((s,v)=>s+Number(v.total||0),0);
      const pagado = ventas.reduce((s,v)=>s+Number(v.montoPagado||0),0);
      el.contenidoHistorial.innerHTML = `
        <div class="historial-resumen">
          <article><span>Cantidad de ventas</span><strong>${ventas.length}</strong></article>
          <article><span>Total vendido</span><strong>${formatoDinero(total)}</strong></article>
          <article><span>Total pagado</span><strong>${formatoDinero(pagado)}</strong></article>
        </div>
        <div style="overflow:auto"><table class="tabla-historial"><thead><tr><th>Venta</th><th>Fecha</th><th>Total</th><th>Pagado</th><th>Pago</th><th>Entrega</th></tr></thead>
        <tbody>${ventas.map(v=>`<tr><td>${esc(v.numeroVenta)}</td><td>${formatoFecha(v.fechaVenta)}</td><td>${formatoDinero(v.total)} ${esc(v.moneda)}</td><td>${formatoDinero(v.montoPagado)}</td><td>${esc(v.estadoPago)}</td><td>${esc(v.estadoEntrega)}</td></tr>`).join("")}</tbody></table></div>`;
    } catch (e) {
      el.contenidoHistorial.innerHTML = `<div class="historial-vacio">${esc(e.message)}</div>`;
    }
  }

  async function desactivar(r) {
    if (!confirm(`¿Deseas desactivar a ${r.nombreCompleto}?`)) return;
    try {
      await peticionPost({ action:"desactivarCliente", id:r.id });
      mostrarMensaje("Cliente desactivado correctamente.");
      await cargarClientes();
    } catch(e) { mostrarMensaje(e.message, "error"); }
  }

  async function guardar(evento) {
    evento.preventDefault();
    const registro = {
      id: estadoApp.editandoId,
      nombreCompleto: campos.nombreCompleto.value.trim(),
      codigoPais: campos.codigoPais.value.trim(),
      telefono: normalizarTelefono(campos.codigoPais.value, campos.telefono.value),
      correo: campos.correo.value.trim(),
      documento: campos.documento.value.trim(),
      pais: campos.pais.value.trim(),
      ciudad: campos.ciudad.value.trim(),
      direccion: campos.direccion.value.trim(),
      fechaNacimiento: campos.fechaNacimiento.value,
      origenCliente: campos.origenCliente.value,
      etiquetas: campos.etiquetas.value.trim(),
      notas: campos.notas.value.trim(),
      estado: campos.estado.value
    };
    if (!registro.nombreCompleto || !registro.telefono) return mostrarMensaje("Nombre y WhatsApp son obligatorios.", "error");
    el.guardar.disabled = true; el.guardar.textContent = "Guardando...";
    try {
      await peticionPost({ action:"guardarCliente", registro });
      cerrarModal(); mostrarMensaje("Cliente guardado correctamente."); await cargarClientes();
    } catch(e) { mostrarMensaje(e.message, "error"); }
    finally { el.guardar.disabled = false; el.guardar.textContent = "Guardar cliente"; }
  }

  function actualizarKpis() {
    const activos = estadoApp.registros.filter(r=>r.estado==="ACTIVO").length;
    const conCompras = estadoApp.registros.filter(r=>Number(r.cantidadCompras||0)>0).length;
    const total = estadoApp.registros.reduce((s,r)=>s+Number(r.totalCompras||0),0);
    el.kpiTotal.textContent = estadoApp.registros.length;
    el.kpiActivos.textContent = activos;
    el.kpiConCompras.textContent = conCompras;
    el.kpiVentas.textContent = formatoDinero(total);
  }

  function formatoDinero(n) { return Number(n||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function formatoFecha(v) { if(!v) return "Sin compras"; const d=new Date(v+"T00:00:00"); return isNaN(d)?"Sin compras":d.toLocaleDateString("es-ES"); }
  function esc(v) { return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])); }

  el.nuevo.addEventListener("click",()=>abrirModal());
  el.nuevoVacio.addEventListener("click",()=>abrirModal());
  el.cerrarModal.addEventListener("click",cerrarModal);
  el.cancelar.addEventListener("click",cerrarModal);
  el.modal.addEventListener("click",e=>{if(e.target===el.modal)cerrarModal();});
  el.cerrarHistorial.addEventListener("click",cerrarHistorialModal);
  el.modalHistorial.addEventListener("click",e=>{if(e.target===el.modalHistorial)cerrarHistorialModal();});
  el.formulario.addEventListener("submit",guardar);
  el.buscar.addEventListener("input",()=>{estadoApp.filtroTexto=el.buscar.value.trim();renderizar();});
  el.filtro.addEventListener("change",()=>{estadoApp.filtroEstado=el.filtro.value;renderizar();});
  el.actualizar.addEventListener("click",cargarClientes);
  el.abrirMenu.addEventListener("click",()=>{el.menu.classList.add("abierto");el.capa.classList.add("visible");});
  el.cerrarMenu.addEventListener("click",()=>{el.menu.classList.remove("abierto");el.capa.classList.remove("visible");});
  el.capa.addEventListener("click",()=>el.cerrarMenu.click());
  el.cerrarSesion.addEventListener("click",()=>{if(confirm("¿Deseas cerrar la sesión?"))location.href="index.html";});
  $$("[data-pagina]").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();mostrarMensaje(`La sección ${a.dataset.pagina} se creará en la siguiente fase.`,"informacion");}));

  cargarClientes();
})();