(() => {
"use strict";
const cfg=window.MUNDO_DIGITAL_CONFIG||{};
const state={entregas:[],ventas:[],cuentas:[],grupoVipUrl:"",texto:"",estado:"TODOS",tipo:"TODOS",editando:""};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const E={menu:$("#menuLateral"),capa:$("#capaOscura"),abrir:$("#botonAbrirMenu"),cerrar:$("#botonCerrarMenu"),salir:$("#botonCerrarSesion"),actualizar:$("#botonActualizar"),conexion:$("#estadoConexion"),mensaje:$("#mensajePanel"),nueva:$("#botonNuevaEntrega"),modal:$("#modalEntrega"),cerrarModal:$("#botonCerrarModal"),cancelar:$("#botonCancelar"),form:$("#formularioEntrega"),titulo:$("#tituloModal"),guardar:$("#botonGuardar"),tabla:$("#tablaEntregasBody"),cargando:$("#cargandoEntregas"),vacio:$("#estadoVacio"),buscar:$("#buscarEntrega"),filtroEstado:$("#filtroEstado"),filtroTipo:$("#filtroTipo"),kTotal:$("#kpiTotal"),kPend:$("#kpiPendientes"),kAut:$("#kpiAutorizadas"),kEnt:$("#kpiEntregadas"),contador:$("#contadorPendientes"),modalDetalle:$("#modalDetalle"),cerrarDetalle:$("#botonCerrarDetalle"),tituloDetalle:$("#tituloDetalle"),contenidoDetalle:$("#contenidoDetalle")};
const ids=["ventaId","clienteNombre","productoNombre","estadoPago","estado","tipoEntrega","cuentaId","archivoUrl","enlaceEntregado","usuarioEntregado","contrasenaEntregada","perfilEntregado","pinEntregado","medioEntrega","autorizadoPor","mensajeEntrega","notas"];
const C=ids.reduce((o,id)=>(o[id]=$("#"+id),o),{});
const ayudaCuenta=$("#ayudaCuenta"),avisoPagoEntrega=$("#avisoPagoEntrega");

function msg(t,tipo="exito"){E.mensaje.textContent=t;E.mensaje.className=`mensaje-flotante visible ${tipo}`;clearTimeout(msg.t);msg.t=setTimeout(()=>E.mensaje.className="mensaje-flotante",4200)}
async function get(action,extra={}){const u=new URL(cfg.APPS_SCRIPT_URL);u.searchParams.set("action",action);u.searchParams.set("claveApi",cfg.API_KEY_SOCIOS);Object.entries(extra).forEach(([k,v])=>u.searchParams.set(k,v));const r=await fetch(u,{redirect:"follow"}),d=await r.json();if(!d.ok)throw Error(d.mensaje||"Error");return d}
async function post(body){const r=await fetch(cfg.APPS_SCRIPT_URL,{method:"POST",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...body,claveApi:cfg.API_KEY_SOCIOS})}),d=await r.json();if(!d.ok)throw Error(d.mensaje||"Error");return d}

async function cargar(silencioso=false){
  if(!silencioso){E.cargando.hidden=false;E.vacio.hidden=true;E.tabla.innerHTML=""}
  try{
    const [en,v,cu,conf]=await Promise.all([
      get("listarEntregasMD20"),
      get("listarVentas"),
      get("listarInventarioDigital"),
      get("obtenerConfiguracionEntregaMD20")
    ]);
    state.entregas=en.registros||[];
    state.ventas=v.registros||[];
    state.cuentas=cu.registros||[];
    state.grupoVipUrl=conf.registro?.grupoVipUrl||"";
    llenarSelects();render();
    E.conexion.textContent="Google Sheets conectado";E.conexion.className="estado-conexion conectado";
  }catch(e){if(!silencioso){E.cargando.hidden=true;E.vacio.hidden=false;msg(e.message,"error")}E.conexion.textContent="Sin conexión"}
}

function llenarSelects(){
  const ventaActual=C.ventaId.value,cuentaActual=C.cuentaId.value;
  C.ventaId.innerHTML='<option value="">Selecciona una venta</option>'+state.ventas.map(v=>`<option value="${esc(v.id)}">${esc(v.numeroVenta)} · ${esc(v.clienteNombre)} · ${esc(v.productoNombre)} · ${esc(v.estadoPago)}</option>`).join("");
  C.cuentaId.innerHTML='<option value="">Sin cuenta del inventario</option>'+state.cuentas.filter(c=>["DISPONIBLE","ASIGNADA"].includes(c.estado)).map(c=>`<option value="${esc(c.id)}">${esc(c.productoNombre)} · ${esc(c.usuarioCuenta)} · ${Number(c.pantallasDisponibles||0)} cupo(s)</option>`).join("");
  if(ventaActual&&[...C.ventaId.options].some(o=>o.value===ventaActual))C.ventaId.value=ventaActual;
  if(cuentaActual&&[...C.cuentaId.options].some(o=>o.value===cuentaActual))C.cuentaId.value=cuentaActual;
}

function filtradas(){const t=state.texto.toLowerCase();return state.entregas.filter(e=>(state.estado==="TODOS"||e.estado===state.estado)&&(state.tipo==="TODOS"||e.tipoEntrega===state.tipo)&&(!t||[e.clienteNombre,e.productoNombre,e.numeroVenta,e.usuarioEntregado,e.cuentaId].join(" ").toLowerCase().includes(t)))}
function render(){const l=filtradas();E.cargando.hidden=true;E.vacio.hidden=!!l.length;E.tabla.innerHTML=l.map(row).join("");kpis();$$("[data-entrega]").forEach(b=>b.onclick=()=>accion(b.dataset.entrega,b.dataset.id))}
function row(e){const contenido=e.usuarioEntregado||e.archivoUrl||e.enlaceEntregado||"Sin preparar";return `<tr><td><div class="celda-entrega"><strong>${esc(e.clienteNombre)}</strong><small>+${esc(e.clienteTelefono)}</small></div></td><td><div class="celda-entrega"><strong>${esc(e.productoNombre)}</strong><small>${esc(e.productoId)}</small></div></td><td><div class="celda-entrega"><strong>${esc(e.numeroVenta)}</strong><small>${esc(e.ventaId)}</small></div></td><td>${esc(e.tipoEntrega)}</td><td><div class="celda-entrega"><strong>${esc(contenido)}</strong><small>${esc(e.perfilEntregado||e.cuentaId||"")}</small></div></td><td><span class="estado-pago-entrega ${String(e.estadoPago).toLowerCase()}">${esc(e.estadoPago)}</span></td><td><span class="estado-entrega ${String(e.estado).toLowerCase()}">${esc(e.estado)}</span></td><td>${fechaHora(e.fechaEntrega||e.actualizadoEn)}</td><td><div class="acciones-entrega"><button data-entrega="ver" data-id="${e.id}" title="Ver"><svg><use href="#i-eye"></use></svg></button><button data-entrega="editar" data-id="${e.id}" title="Editar"><svg><use href="#i-edit"></use></svg></button>${e.estadoPago==="PAGADO"&&["BLOQUEADA","PENDIENTE"].includes(e.estado)?`<button class="autorizar" data-entrega="autorizar" data-id="${e.id}" title="Autorizar"><svg><use href="#i-check"></use></svg></button>`:""}${["AUTORIZADA","ENVIANDO","ENVIADA"].includes(e.estado)?`<button class="whatsapp" data-entrega="whatsapp" data-id="${e.id}" title="Enviar por WhatsApp"><svg><use href="#i-whatsapp"></use></svg></button>`:""}${["AUTORIZADA","ENVIADA"].includes(e.estado)?`<button class="completar" data-entrega="entregada" data-id="${e.id}" title="Marcar entregada"><svg><use href="#i-send"></use></svg></button>`:""}</div></td></tr>`}

function accion(a,id){const e=state.entregas.find(x=>x.id===id);if(!e)return;if(a==="ver")ver(e);if(a==="editar")abrirModal(e);if(a==="autorizar")cambiarEstado(e,"AUTORIZADA");if(a==="entregada")cambiarEstado(e,"ENTREGADA");if(a==="whatsapp")abrirWhatsapp(e)}
async function abrirModal(e=null){state.editando=e?.id||"";E.form.reset();C.estado.value="PENDIENTE";C.tipoEntrega.value="ARCHIVO";C.medioEntrega.value="WHATSAPP";C.autorizadoPor.value="ADMINISTRADOR";E.titulo.textContent=e?"Editar entrega":"Nueva entrega";if(e){if(e.ventaId&&![...C.ventaId.options].some(o=>o.value===e.ventaId))C.ventaId.insertAdjacentHTML("beforeend",`<option value="${esc(e.ventaId)}">${esc(e.numeroVenta)} · ${esc(e.clienteNombre)} · ${esc(e.productoNombre)}</option>`);if(e.cuentaId&&![...C.cuentaId.options].some(o=>o.value===e.cuentaId))C.cuentaId.insertAdjacentHTML("beforeend",`<option value="${esc(e.cuentaId)}">${esc(e.usuarioEntregado||e.cuentaId)}</option>`);ids.forEach(id=>{if(e[id]!=null)C[id].value=e[id]})}await aplicarVenta(false);actualizarAyudaCuenta();E.modal.classList.add("visible");document.body.style.overflow="hidden"}
function cerrarModal(){E.modal.classList.remove("visible");document.body.style.overflow="";state.editando=""}
function ventaElegida(){return state.ventas.find(v=>v.id===C.ventaId.value)}
function cuentaElegida(){return state.cuentas.find(c=>c.id===C.cuentaId.value)}
async function aplicarVenta(regenerar=true){
  const v=ventaElegida();

  if(!v){
    C.clienteNombre.value="";
    C.productoNombre.value="";
    C.estadoPago.value="";
    actualizarBloqueoPago();
    return;
  }

  C.clienteNombre.value=v.clienteNombre||"";
  C.productoNombre.value=v.productoNombre||"";
  C.estadoPago.value=v.estadoPago||"PENDIENTE";

  if(!state.editando){
    C.estado.value=v.estadoPago==="PAGADO"?"PENDIENTE":"BLOQUEADA";
  }

  actualizarBloqueoPago();

  try{
    const respuesta=await get(
      "obtenerDatosProductoEntregaMD20",
      {productoId:v.productoId||""}
    );

    const datos=respuesta.registro||{};

    if(datos.tipoEntrega && !state.editando){
      C.tipoEntrega.value=datos.tipoEntrega;
    }

    if(datos.archivoUrl && !C.archivoUrl.value){
      C.archivoUrl.value=datos.archivoUrl;
    }

    if(datos.enlaceEntrega && !C.enlaceEntregado.value){
      C.enlaceEntregado.value=datos.enlaceEntrega;
    }

    if(!datos.archivoUrl && C.tipoEntrega.value==="ARCHIVO"){
      msg("El producto no devolvió ARCHIVO_ID. Revisa que PRODUCTO_ID coincida en PRODUCTOS.","error");
    }
  }catch(error){
    console.error("No se pudo cargar ARCHIVO_ID:",error);
    msg("No se pudo leer ARCHIVO_ID del producto.","error");
  }

  if(regenerar)generarMensaje();
}
function actualizarBloqueoPago(){
  const pagado=String(C.estadoPago.value||"").toUpperCase()==="PAGADO";
  const estadosProtegidos=["AUTORIZADA","ENVIANDO","ENVIADA","ENTREGADA"];

  [...C.estado.options].forEach(op=>{
    op.disabled=!pagado&&estadosProtegidos.includes(op.value);
  });

  if(!pagado){
    if(estadosProtegidos.includes(C.estado.value)){
      C.estado.value="BLOQUEADA";
    }
    avisoPagoEntrega.hidden=false;
    avisoPagoEntrega.className="aviso-pago-entrega ancho-3";
    avisoPagoEntrega.textContent="Esta entrega está bloqueada porque la venta todavía no aparece como PAGADA. Confirma primero el pago en el módulo Pagos.";
  }else{
    avisoPagoEntrega.hidden=false;
    avisoPagoEntrega.className="aviso-pago-entrega ancho-3 ok";
    avisoPagoEntrega.textContent="Pago confirmado. Ya puedes autorizar, enviar o marcar esta entrega como entregada.";
  }
}

function aplicarCuenta(){const c=cuentaElegida();if(!c){actualizarAyudaCuenta();return}C.usuarioEntregado.value=c.usuarioCuenta||"";C.contrasenaEntregada.value=c.contrasenaCuenta||"";C.perfilEntregado.value=c.perfil||"";C.pinEntregado.value=c.pin||"";C.tipoEntrega.value=c.tipoCuenta==="PERFIL"?"PERFIL":"CUENTA";actualizarAyudaCuenta();generarMensaje()}
function actualizarAyudaCuenta(){const c=cuentaElegida();ayudaCuenta.textContent=c?`Cuenta: ${c.usuarioCuenta} · Disponibles: ${c.pantallasDisponibles} de ${c.pantallasTotales}`:"Opcional para archivos, enlaces y cursos."}
function crearMensajePorTipo(datos){
  const tipo=String(datos.tipoEntrega||"ARCHIVO").toUpperCase();
  const lineas=[
    `Hola ${datos.clienteNombre}`,
    "",
    `Tu compra de ${datos.productoNombre} está lista.`
  ];

  if(tipo==="ARCHIVO"){
    if(datos.archivoUrl){
      lineas.push(
        "",
        "Aquí tienes tu archivo para descargar:",
        datos.archivoUrl,
        "",
        "No olvides descargarlo y guardarlo en tu dispositivo para que no pierdas el acceso a tu compra."
      );
    }else{
      lineas.push(
        "",
        "Tu archivo está preparado, pero todavía falta colocar el enlace de descarga."
      );
    }
  }

  if(tipo==="CURSO"){
    const acceso=datos.enlaceEntregado||datos.archivoUrl||"";
    if(acceso){
      lineas.push(
        "",
        "Aquí tienes el acceso a tu curso:",
        acceso
      );
    }
    if(datos.usuarioEntregado)lineas.push(`Usuario o correo: ${datos.usuarioEntregado}`);
    if(datos.contrasenaEntregada)lineas.push(`Contraseña: ${datos.contrasenaEntregada}`);
    lineas.push(
      "",
      "No olvides guardar esta información para que puedas ingresar nuevamente cuando la necesites."
    );
    if(state.grupoVipUrl){
      lineas.push(
        "",
        "Únete a nuestra comunidad VIP en el siguiente enlace:",
        state.grupoVipUrl
      );
    }
  }

  if(tipo==="ENLACE"){
    if(datos.enlaceEntregado){
      lineas.push(
        "",
        "Aquí tienes tu enlace de acceso:",
        datos.enlaceEntregado,
        "",
        "Guárdalo para futuras consultas."
      );
    }
  }

  if(tipo==="CUENTA" || tipo==="ACCESO"){
    if(datos.usuarioEntregado)lineas.push("",`Usuario o correo: ${datos.usuarioEntregado}`);
    if(datos.contrasenaEntregada)lineas.push(`Contraseña: ${datos.contrasenaEntregada}`);
    if(datos.enlaceEntregado)lineas.push(`Enlace de acceso: ${datos.enlaceEntregado}`);
    lineas.push(
      "",
      "No compartas tus datos de acceso con otras personas."
    );
  }

  if(tipo==="PERFIL"){
    if(datos.usuarioEntregado)lineas.push("",`Usuario o correo: ${datos.usuarioEntregado}`);
    if(datos.contrasenaEntregada)lineas.push(`Contraseña: ${datos.contrasenaEntregada}`);
    if(datos.perfilEntregado)lineas.push(`Perfil: ${datos.perfilEntregado}`);
    if(datos.pinEntregado)lineas.push(`PIN: ${datos.pinEntregado}`);
    lineas.push(
      "",
      "No compartas tus datos de acceso con otras personas."
    );
  }

  if(tipo==="CANVA"){
    if(datos.usuarioEntregado)lineas.push("",`Correo: ${datos.usuarioEntregado}`);
    if(datos.perfilEntregado)lineas.push(`Equipo: ${datos.perfilEntregado}`);
    if(datos.enlaceEntregado)lineas.push(`Enlace de acceso: ${datos.enlaceEntregado}`);
    lineas.push(
      "",
      "Guarda esta información para futuras consultas."
    );
  }

  lineas.push(
    "",
    "Gracias por confiar en Mundo Digital 2.0."
  );

  return lineas.join("\n");
}

function generarMensaje(){
  const v=ventaElegida();
  if(!v)return;

  C.mensajeEntrega.value=crearMensajePorTipo({
    clienteNombre:v.clienteNombre,
    productoNombre:v.productoNombre,
    tipoEntrega:C.tipoEntrega.value,
    archivoUrl:C.archivoUrl.value,
    enlaceEntregado:C.enlaceEntregado.value,
    usuarioEntregado:C.usuarioEntregado.value,
    contrasenaEntregada:C.contrasenaEntregada.value,
    perfilEntregado:C.perfilEntregado.value,
    pinEntregado:C.pinEntregado.value
  });
}

function construirMensajeEntregaDesdeRegistro(e){
  return crearMensajePorTipo(e);
}

async function guardar(ev){
  ev.preventDefault();

  if(!C.ventaId.value){
    alert("Selecciona una venta.");
    return;
  }

  const estadosProtegidos=["AUTORIZADA","ENVIANDO","ENVIADA","ENTREGADA"];

  if(estadosProtegidos.includes(C.estado.value)&&String(C.estadoPago.value).toUpperCase()!=="PAGADO"){
    actualizarBloqueoPago();
    alert("No se puede guardar como "+C.estado.value+" porque el pago todavía está PENDIENTE.\n\nPrimero confirma el pago en el módulo Pagos.");
    return;
  }

  E.guardar.disabled=true;
  E.guardar.textContent="Guardando...";
  const registro={id:state.editando};
  ids.forEach(id=>registro[id]=C[id].value);

  try{
    await post({action:"guardarEntregaMD20",registro});
    cerrarModal();
    msg("Entrega guardada correctamente.");
    await cargar(false);
  }catch(e){
    msg(e.message,"error");
    alert("No se pudo guardar la entrega:\n\n"+e.message);
  }finally{
    E.guardar.disabled=false;
    E.guardar.textContent="Guardar entrega";
  }
}
async function cambiarEstado(e,estado){if(estado==="AUTORIZADA"&&e.estadoPago!=="PAGADO")return msg("El pago todavía no está confirmado.","error");if(!confirm(`¿Cambiar la entrega a ${estado}?`))return;try{await post({action:"cambiarEstadoEntregaMD20",entregaId:e.id,estado});msg(`Entrega cambiada a ${estado}.`);await cargar(false)}catch(err){msg(err.message,"error")}}
function construirMensajeEntregaDesdeRegistro(e){
  const tipo=String(e.tipoEntrega||"ARCHIVO").toUpperCase();
  const lineas=[
    `Hola ${e.clienteNombre} 👋`,
    "",
    `Tu compra de ${e.productoNombre} está lista.`
  ];

  if(tipo==="ARCHIVO"){
    if(e.archivoUrl){
      lineas.push(
        "",
        "Puedes descargar tu producto desde este enlace:",
        e.archivoUrl,
        "",
        "Guarda este enlace para futuras consultas."
      );
    }else{
      lineas.push(
        "",
        "Tu archivo está preparado, pero todavía falta colocar el enlace de descarga."
      );
    }
  }

  if(tipo==="ENLACE" || tipo==="CURSO"){
    if(e.enlaceEntregado){
      lineas.push(
        "",
        tipo==="CURSO" ? "Acceso al curso:" : "Enlace de acceso:",
        e.enlaceEntregado
      );
    }
    if(e.usuarioEntregado)lineas.push(`Usuario o correo: ${e.usuarioEntregado}`);
    if(e.contrasenaEntregada)lineas.push(`Contraseña: ${e.contrasenaEntregada}`);
  }

  if(tipo==="CUENTA" || tipo==="ACCESO"){
    if(e.usuarioEntregado)lineas.push("",`Usuario o correo: ${e.usuarioEntregado}`);
    if(e.contrasenaEntregada)lineas.push(`Contraseña: ${e.contrasenaEntregada}`);
    if(e.enlaceEntregado)lineas.push(`Enlace de acceso: ${e.enlaceEntregado}`);
  }

  if(tipo==="PERFIL"){
    if(e.usuarioEntregado)lineas.push("",`Usuario o correo: ${e.usuarioEntregado}`);
    if(e.contrasenaEntregada)lineas.push(`Contraseña: ${e.contrasenaEntregada}`);
    if(e.perfilEntregado)lineas.push(`Perfil: ${e.perfilEntregado}`);
    if(e.pinEntregado)lineas.push(`PIN: ${e.pinEntregado}`);
  }

  if(tipo==="CANVA"){
    if(e.usuarioEntregado)lineas.push("",`Correo: ${e.usuarioEntregado}`);
    if(e.perfilEntregado)lineas.push(`Equipo: ${e.perfilEntregado}`);
    if(e.enlaceEntregado)lineas.push(`Enlace de acceso: ${e.enlaceEntregado}`);
  }

  lineas.push(
    "",
    "No compartas tus datos de acceso con otras personas.",
    "",
    "Gracias por confiar en Mundo Digital 2.0."
  );

  return lineas.join("\n");
}

function abrirWhatsapp(e){
  const numero=String(e.clienteTelefono||"").replace(/\D/g,"");

  if(!numero){
    return msg("El cliente no tiene WhatsApp.","error");
  }

  // Reconstruir siempre con la plantilla actual.
  // No reutilizar mensajes antiguos guardados en MENSAJE_ENTREGA.
  const texto=construirMensajeEntregaDesdeRegistro(e);

  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`,
    "_blank",
    "noopener"
  );

  post({
    action:"guardarMensajeEntregaGeneradoMD20",
    entregaId:e.id,
    mensajeEntrega:texto
  }).catch(error=>console.error("No se pudo guardar el mensaje generado:",error));

  post({
    action:"cambiarEstadoEntregaMD20",
    entregaId:e.id,
    estado:"ENVIADA"
  }).then(()=>setTimeout(()=>cargar(true),1200)).catch(()=>{});
}
function ver(e){E.tituloDetalle.textContent=`${e.id} · ${e.numeroVenta}`;E.contenidoDetalle.innerHTML=`<div class="detalle-grid-entrega"><div class="detalle-item-entrega"><span>Cliente</span><strong>${esc(e.clienteNombre)}</strong></div><div class="detalle-item-entrega"><span>WhatsApp</span><strong>+${esc(e.clienteTelefono)}</strong></div><div class="detalle-item-entrega"><span>Producto</span><strong>${esc(e.productoNombre)}</strong></div><div class="detalle-item-entrega"><span>Venta</span><strong>${esc(e.numeroVenta)}</strong></div><div class="detalle-item-entrega"><span>Pago</span><strong>${esc(e.estadoPago)}</strong></div><div class="detalle-item-entrega"><span>Estado</span><strong>${esc(e.estado)}</strong></div><div class="detalle-item-entrega"><span>Usuario</span><strong>${esc(e.usuarioEntregado||"")}</strong></div><div class="detalle-item-entrega"><span>Contraseña</span><strong>${esc(e.contrasenaEntregada||"")}</strong></div><div class="detalle-item-entrega"><span>Perfil</span><strong>${esc(e.perfilEntregado||"")}</strong></div><div class="detalle-item-entrega"><span>PIN</span><strong>${esc(e.pinEntregado||"")}</strong></div><div class="detalle-item-entrega ancho"><span>Archivo o enlace</span><strong>${esc(e.archivoUrl||e.enlaceEntregado||"Sin enlace")}</strong></div><div class="detalle-item-entrega ancho"><span>Mensaje</span><strong class="mensaje-previo">${esc(e.mensajeEntrega||"Sin mensaje")}</strong></div><div class="detalle-item-entrega ancho"><span>Notas</span><strong>${esc(e.notas||"Sin notas")}</strong></div></div>`;E.modalDetalle.classList.add("visible");document.body.style.overflow="hidden"}
function cerrarDetalle(){E.modalDetalle.classList.remove("visible");document.body.style.overflow=""}
function kpis(){const pendientes=state.entregas.filter(e=>["BLOQUEADA","PENDIENTE"].includes(e.estado)).length;E.kTotal.textContent=state.entregas.length;E.kPend.textContent=pendientes;E.kAut.textContent=state.entregas.filter(e=>e.estado==="AUTORIZADA").length;E.kEnt.textContent=state.entregas.filter(e=>e.estado==="ENTREGADA").length;E.contador.textContent=pendientes}
const fechaHora=v=>v?new Date(v).toLocaleString("es-ES"):"",esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

E.nueva.onclick=()=>abrirModal();E.cerrarModal.onclick=E.cancelar.onclick=cerrarModal;E.modal.onclick=e=>{if(e.target===E.modal)cerrarModal()};E.form.onsubmit=guardar;C.ventaId.onchange=async()=>await aplicarVenta(true);C.estado.onchange=actualizarBloqueoPago;C.tipoEntrega.onchange=generarMensaje;C.cuentaId.onchange=aplicarCuenta;["archivoUrl","enlaceEntregado","usuarioEntregado","contrasenaEntregada","perfilEntregado","pinEntregado"].forEach(id=>C[id].addEventListener("input",generarMensaje));E.cerrarDetalle.onclick=cerrarDetalle;E.modalDetalle.onclick=e=>{if(e.target===E.modalDetalle)cerrarDetalle()};E.buscar.oninput=()=>{state.texto=E.buscar.value.trim();render()};E.filtroEstado.onchange=()=>{state.estado=E.filtroEstado.value;render()};E.filtroTipo.onchange=()=>{state.tipo=E.filtroTipo.value;render()};E.actualizar.onclick=()=>cargar(false);E.abrir.onclick=()=>{E.menu.classList.add("abierto");E.capa.classList.add("visible")};E.cerrar.onclick=()=>{E.menu.classList.remove("abierto");E.capa.classList.remove("visible")};E.capa.onclick=()=>E.cerrar.click();E.salir.onclick=()=>{if(confirm("¿Cerrar sesión?"))location.href="index.html"};document.querySelectorAll("[data-pagina]").forEach(a=>a.onclick=e=>{e.preventDefault();msg(`La sección ${a.dataset.pagina} se desarrollará en su fase.`,"informacion")});
let timer=setInterval(()=>{if(!document.hidden&&!E.modal.classList.contains("visible")&&!E.modalDetalle.classList.contains("visible"))cargar(true)},10000);window.addEventListener("beforeunload",()=>clearInterval(timer));cargar();
})();