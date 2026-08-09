(() => {
"use strict";
const cfg=window.MUNDO_DIGITAL_CONFIG||{},state={pagos:[],ventas:[],metodos:[],texto:"",estado:"TODOS",metodo:"TODOS",editando:""};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const E={menu:$("#menuLateral"),capa:$("#capaOscura"),abrir:$("#botonAbrirMenu"),cerrar:$("#botonCerrarMenu"),salir:$("#botonCerrarSesion"),actualizar:$("#botonActualizar"),conexion:$("#estadoConexion"),mensaje:$("#mensajePanel"),nuevo:$("#botonNuevoPago"),modal:$("#modalPago"),cerrarModal:$("#botonCerrarModal"),cancelar:$("#botonCancelar"),form:$("#formularioPago"),titulo:$("#tituloModal"),guardar:$("#botonGuardar"),tabla:$("#tablaPagosBody"),cargando:$("#cargandoPagos"),vacio:$("#estadoVacio"),buscar:$("#buscarPago"),filtroEstado:$("#filtroEstado"),filtroMetodo:$("#filtroMetodo"),kTotal:$("#kpiTotal"),kPend:$("#kpiPendientes"),kConf:$("#kpiConfirmados"),kMonto:$("#kpiMonto"),contador:$("#contadorPendientes"),modalDetalle:$("#modalDetalle"),cerrarDetalle:$("#botonCerrarDetalle"),tituloDetalle:$("#tituloDetalle"),contenidoDetalle:$("#contenidoDetalle")};
const C={ventaId:$("#ventaId"),clienteNombre:$("#clienteNombre"),productoNombre:$("#productoNombre"),fechaPago:$("#fechaPago"),monto:$("#monto"),moneda:$("#moneda"),metodoPagoId:$("#metodoPagoId"),referencia:$("#referencia"),comprobanteUrl:$("#comprobanteUrl"),estado:$("#estado"),notas:$("#notas")};

function msg(t,tipo="exito"){E.mensaje.textContent=t;E.mensaje.className=`mensaje-flotante visible ${tipo}`;clearTimeout(msg.t);msg.t=setTimeout(()=>E.mensaje.className="mensaje-flotante",4000)}
async function get(action){const u=new URL(cfg.APPS_SCRIPT_URL);u.searchParams.set("action",action);u.searchParams.set("claveApi",cfg.API_KEY_SOCIOS);const r=await fetch(u,{redirect:"follow"}),d=await r.json();if(!d.ok)throw Error(d.mensaje||"Error");return d}
async function post(body){const r=await fetch(cfg.APPS_SCRIPT_URL,{method:"POST",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({...body,claveApi:cfg.API_KEY_SOCIOS})}),d=await r.json();if(!d.ok)throw Error(d.mensaje||"Error");return d}

async function cargar(silencioso=false){
  if(!silencioso){E.cargando.hidden=false;E.vacio.hidden=true;E.tabla.innerHTML="";}
  try{
    const [p,v,m]=await Promise.all([get("listarPagosMD20"),get("listarVentas"),get("listarMetodosPago")]);
    state.pagos=p.registros||[];state.ventas=v.registros||[];state.metodos=m.registros||[];
    llenarSelects();render();
    E.conexion.textContent="Google Sheets conectado";E.conexion.className="estado-conexion conectado";
  }catch(e){if(!silencioso){E.cargando.hidden=true;E.vacio.hidden=false;msg(e.message,"error")}E.conexion.textContent="Sin conexión"}
}

function llenarSelects(){
  const ventaActual=C.ventaId.value;
  const metodoActual=C.metodoPagoId.value;
  const filtroMetodoActual=E.filtroMetodo.value;

  C.ventaId.innerHTML='<option value="">Selecciona una venta</option>'+state.ventas.map(v=>`<option value="${esc(v.id)}">${esc(v.numeroVenta)} · ${esc(v.clienteNombre)} · ${esc(v.productoNombre)} · ${money(v.total)} ${esc(v.moneda)}</option>`).join("");
  C.metodoPagoId.innerHTML='<option value="">Sin especificar</option>'+state.metodos.map(m=>`<option value="${esc(m.id)}">${esc(m.nombre)} · ${esc(m.moneda)}</option>`).join("");
  E.filtroMetodo.innerHTML='<option value="TODOS">Todos los métodos</option>'+state.metodos.map(m=>`<option value="${esc(m.id)}">${esc(m.nombre)}</option>`).join("");

  if(ventaActual && [...C.ventaId.options].some(o=>o.value===ventaActual))C.ventaId.value=ventaActual;
  if(metodoActual && [...C.metodoPagoId.options].some(o=>o.value===metodoActual))C.metodoPagoId.value=metodoActual;
  if(filtroMetodoActual && [...E.filtroMetodo.options].some(o=>o.value===filtroMetodoActual))E.filtroMetodo.value=filtroMetodoActual;
}

function filtrados(){const t=state.texto.toLowerCase();return state.pagos.filter(p=>(state.estado==="TODOS"||p.estado===state.estado)&&(state.metodo==="TODOS"||p.metodoPagoId===state.metodo)&&(!t||[p.id,p.numeroVenta,p.clienteNombre,p.productoNombre,p.referencia,p.metodoPagoNombre].join(" ").toLowerCase().includes(t)))}
function render(){const l=filtrados();E.cargando.hidden=true;E.vacio.hidden=!!l.length;E.tabla.innerHTML=l.map(row).join("");kpis();$$("[data-pago]").forEach(b=>b.onclick=()=>accion(b.dataset.pago,b.dataset.id))}
function row(p){return `<tr><td><div class="celda-pago"><strong>${esc(p.id)}</strong><small>${esc(p.numeroVenta)}</small></div></td><td><div class="celda-pago"><strong>${esc(p.clienteNombre)}</strong><small>+${esc(p.clienteTelefono)}</small></div></td><td><div class="celda-pago"><strong>${esc(p.productoNombre)}</strong><small>${esc(p.ventaId)}</small></div></td><td>${fecha(p.fechaPago)}</td><td><strong>${money(p.monto)} ${esc(p.moneda)}</strong></td><td>${esc(p.metodoPagoNombre||"Sin especificar")}</td><td>${esc(p.referencia||"Sin referencia")}</td><td><span class="estado-pago ${p.estado.toLowerCase()}">${esc(p.estado)}</span></td><td><div class="acciones-pago"><button data-pago="ver" data-id="${p.id}" title="Ver detalle"><svg><use href="#i-eye"></use></svg></button><button data-pago="editar" data-id="${p.id}" title="Editar"><svg><use href="#i-edit"></use></svg></button>${p.comprobanteUrl?`<a href="${escAttr(p.comprobanteUrl)}" target="_blank" rel="noopener" title="Ver comprobante"><svg><use href="#i-link"></use></svg></a>`:""}${["PENDIENTE","EN_REVISION"].includes(p.estado)?`<button class="confirmar" data-pago="confirmar" data-id="${p.id}" title="Confirmar"><svg><use href="#i-check"></use></svg></button><button class="rechazar" data-pago="rechazar" data-id="${p.id}" title="Rechazar"><svg><use href="#i-x"></use></svg></button>`:""}</div></td></tr>`}

function accion(a,id){const p=state.pagos.find(x=>x.id===id);if(!p)return;if(a==="ver")ver(p);if(a==="editar")abrirModal(p);if(a==="confirmar")cambiarEstado(p,"CONFIRMADO");if(a==="rechazar")cambiarEstado(p,"RECHAZADO")}
function abrirModal(p=null){
state.editando=p?.id||"";
E.form.reset();
C.fechaPago.value=hoy();
C.estado.value="PENDIENTE";
C.moneda.value="USD";
E.titulo.textContent=p?"Editar pago":"Registrar pago";

if(p){
  if(p.ventaId && ![...C.ventaId.options].some(o=>o.value===p.ventaId)){
    C.ventaId.insertAdjacentHTML("beforeend",`<option value="${esc(p.ventaId)}">${esc(p.numeroVenta||p.ventaId)} · ${esc(p.clienteNombre)} · ${esc(p.productoNombre)}</option>`);
  }
  C.ventaId.value=p.ventaId;
  C.clienteNombre.value=p.clienteNombre;
  C.productoNombre.value=p.productoNombre;
  C.fechaPago.value=p.fechaPago;
  C.monto.value=p.monto;
  C.moneda.value=p.moneda;
  C.metodoPagoId.value=p.metodoPagoId;
  C.referencia.value=p.referencia;
  C.comprobanteUrl.value=p.comprobanteUrl;
  C.estado.value=p.estado;
  C.notas.value=p.notas;
}
E.modal.classList.add("visible");
document.body.style.overflow="hidden";
}
function cerrarModal(){E.modal.classList.remove("visible");document.body.style.overflow="";state.editando=""}
function ventaElegida(){return state.ventas.find(v=>v.id===C.ventaId.value)}
function aplicarVenta(){const v=ventaElegida();if(!v){C.clienteNombre.value="";C.productoNombre.value="";return}C.clienteNombre.value=v.clienteNombre;C.productoNombre.value=v.productoNombre;C.monto.value=Number(v.total||0);C.moneda.value=v.moneda||"USD";if(v.metodoPagoId)C.metodoPagoId.value=v.metodoPagoId}
async function guardar(ev){
  ev.preventDefault();

  if(E.guardar.disabled)return;

  if(!C.ventaId.value || Number(C.monto.value||0)<=0){
    msg("Selecciona una venta y coloca un monto válido.","error");
    return;
  }

  E.guardar.disabled=true;
  E.guardar.textContent="Guardando...";

  try{
    const respuesta=await post({
      action:"guardarPagoMD20",
      registro:{
        id:state.editando,
        ventaId:C.ventaId.value,
        fechaPago:C.fechaPago.value,
        monto:Number(C.monto.value),
        moneda:C.moneda.value,
        metodoPagoId:C.metodoPagoId.value,
        referencia:C.referencia.value.trim(),
        comprobanteUrl:C.comprobanteUrl.value.trim(),
        estado:C.estado.value,
        notas:C.notas.value.trim()
      }
    });

    cerrarModal();
    msg(`Pago guardado como ${respuesta.registro?.estado||C.estado.value}.`);
    await cargar(false);
  }catch(e){
    console.error("Error guardando pago:",e);
    msg(e.message||"No se pudo guardar el pago.","error");
    alert("No se pudo guardar el pago:\n\n"+(e.message||"Error desconocido"));
  }finally{
    E.guardar.disabled=false;
    E.guardar.textContent="Guardar pago";
  }
}
async function cambiarEstado(p,estado){const texto=estado==="CONFIRMADO"?`¿Confirmar el pago ${p.id}? Esto marcará la venta como pagada y creará la entrega pendiente.`:`¿Rechazar el pago ${p.id}?`;if(!confirm(texto))return;try{await post({action:"cambiarEstadoPagoMD20",pagoId:p.id,estado});msg(estado==="CONFIRMADO"?"Pago confirmado y entrega preparada.":"Pago rechazado.");await cargar()}catch(e){msg(e.message,"error")}}
function ver(p){E.tituloDetalle.textContent=`${p.id} · ${p.numeroVenta}`;E.contenidoDetalle.innerHTML=`<div class="detalle-grid-pago"><div class="detalle-item-pago"><span>Cliente</span><strong>${esc(p.clienteNombre)}</strong></div><div class="detalle-item-pago"><span>WhatsApp</span><strong>+${esc(p.clienteTelefono)}</strong></div><div class="detalle-item-pago"><span>Producto</span><strong>${esc(p.productoNombre)}</strong></div><div class="detalle-item-pago"><span>Venta</span><strong>${esc(p.numeroVenta)}</strong></div><div class="detalle-item-pago"><span>Fecha</span><strong>${fecha(p.fechaPago)}</strong></div><div class="detalle-item-pago"><span>Monto</span><strong>${money(p.monto)} ${esc(p.moneda)}</strong></div><div class="detalle-item-pago"><span>Método</span><strong>${esc(p.metodoPagoNombre||"Sin especificar")}</strong></div><div class="detalle-item-pago"><span>Referencia</span><strong>${esc(p.referencia||"Sin referencia")}</strong></div><div class="detalle-item-pago"><span>Estado</span><strong>${esc(p.estado)}</strong></div><div class="detalle-item-pago"><span>Confirmado por</span><strong>${esc(p.confirmadoPor||"Pendiente")}</strong></div><div class="detalle-item-pago ancho"><span>Notas</span><strong>${esc(p.notas||"Sin notas")}</strong></div></div><div class="detalle-acciones-pago">${p.comprobanteUrl?`<a href="${escAttr(p.comprobanteUrl)}" target="_blank" rel="noopener">Abrir comprobante</a>`:""}</div>`;E.modalDetalle.classList.add("visible");document.body.style.overflow="hidden"}
function cerrarDetalle(){E.modalDetalle.classList.remove("visible");document.body.style.overflow=""}
function kpis(){const pend=state.pagos.filter(p=>["PENDIENTE","EN_REVISION"].includes(p.estado)).length,conf=state.pagos.filter(p=>p.estado==="CONFIRMADO"),monto=conf.reduce((s,p)=>s+Number(p.monto||0),0);E.kTotal.textContent=state.pagos.length;E.kPend.textContent=pend;E.kConf.textContent=conf.length;E.kMonto.textContent=money(monto);E.contador.textContent=pend}
const hoy=()=>new Date().toISOString().slice(0,10),fecha=v=>v?new Date(v+"T00:00:00").toLocaleDateString("es-ES"):"",money=n=>Number(n||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}),esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m])),escAttr=v=>esc(v).replace(/'/g,"&#39;");

E.nuevo.onclick=()=>abrirModal();E.cerrarModal.onclick=E.cancelar.onclick=cerrarModal;E.modal.onclick=e=>{if(e.target===E.modal)cerrarModal()};E.form.onsubmit=guardar;C.ventaId.onchange=aplicarVenta;E.cerrarDetalle.onclick=cerrarDetalle;E.modalDetalle.onclick=e=>{if(e.target===E.modalDetalle)cerrarDetalle()};E.buscar.oninput=()=>{state.texto=E.buscar.value.trim();render()};E.filtroEstado.onchange=()=>{state.estado=E.filtroEstado.value;render()};E.filtroMetodo.onchange=()=>{state.metodo=E.filtroMetodo.value;render()};E.actualizar.onclick=()=>cargar(false);
let temporizadorPagos=setInterval(()=>{
  if(!document.hidden && !E.modal.classList.contains("visible") && !E.modalDetalle.classList.contains("visible")){
    cargar(true);
  }
},8000);
document.addEventListener("visibilitychange",()=>{
  if(!document.hidden && !E.modal.classList.contains("visible") && !E.modalDetalle.classList.contains("visible")){
    cargar(true);
  }
});
window.addEventListener("beforeunload",()=>clearInterval(temporizadorPagos));
E.abrir.onclick=()=>{E.menu.classList.add("abierto");E.capa.classList.add("visible")};E.cerrar.onclick=()=>{E.menu.classList.remove("abierto");E.capa.classList.remove("visible")};E.capa.onclick=()=>E.cerrar.click();E.salir.onclick=()=>{if(confirm("¿Cerrar sesión?"))location.href="index.html"};document.querySelectorAll("[data-pagina]").forEach(a=>a.onclick=e=>{e.preventDefault();msg(`La sección ${a.dataset.pagina} se creará después.`,"informacion")});cargar();
})();