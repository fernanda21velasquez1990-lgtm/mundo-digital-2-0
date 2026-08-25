(() => {
"use strict";
const cfg=window.MUNDO_DIGITAL_CONFIG||{},$=s=>document.querySelector(s);
const menu=$("#menuLateral"),capa=$("#capaOscura"),actualizar=$("#botonActualizar"),mensaje=$("#mensajePanel");
const fmt=n=>Number(n||0).toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const fecha=v=>v?new Date(v+"T00:00:00").toLocaleDateString("es-ES"):"";

function mostrarMensaje(t){mensaje.textContent=t;mensaje.classList.add("visible");clearTimeout(mostrarMensaje.t);mostrarMensaje.t=setTimeout(()=>mensaje.classList.remove("visible"),3500)}
async function get(action){
  if(!cfg.APPS_SCRIPT_URL||!cfg.API_KEY_SOCIOS)throw Error("Falta configurar la conexión con Apps Script.");
  const u=new URL(cfg.APPS_SCRIPT_URL);u.searchParams.set("action",action);u.searchParams.set("claveApi",cfg.API_KEY_SOCIOS);
  const r=await fetch(u,{redirect:"follow"}),d=await r.json();if(!d.ok)throw Error(d.mensaje||"Error de conexión.");return d;
}
function renderActividad(ventas){
  const body=$("#tablaActividadBody");
  if(!ventas.length){body.innerHTML='<tr class="estado-vacio-fila"><td colspan="5"><div class="estado-vacio"><span class="vacio-icono"><svg><use href="#i-cart"></use></svg></span><h4>Tu primera venta aparecerá aquí</h4><p>Cuando registres una operación, verás el cliente, producto, total y estado en tiempo real.</p><button class="boton-vacio" type="button" data-destino="ventas.html"><svg><use href="#i-plus"></use></svg> Registrar primera venta</button></div></td></tr>';return}
  body.innerHTML=ventas.slice(0,5).map(v=>`<tr><td><strong>${esc(v.numeroVenta)}</strong><small>${fecha(v.fechaVenta)}</small></td><td>${esc(v.clienteNombre)}</td><td>${esc(v.productoNombre)}</td><td>${fmt(v.total)} ${esc(v.moneda)}</td><td><span class="estado-tabla-dashboard ${String(v.estadoPago).toLowerCase()}">${esc(v.estadoPago)}</span></td></tr>`).join("");
}
async function cargar(){
  actualizar?.classList.add("girando");
  try{
    const [v,c,s,r]=await Promise.all([get("listarVentas"),get("listarClientes"),get("listarSuscripciones"),get("listarRespuestasRenovacion")]);
    const ventas=v.registros||[],clientes=c.registros||[],sus=s.registros||[],resp=r.registros||[],hoy=new Date();
    const ventasHoy=ventas.filter(x=>new Date(x.fechaVenta+"T00:00:00").toDateString()===hoy.toDateString());
    const ventasMes=ventas.filter(x=>{const d=new Date(x.fechaVenta+"T00:00:00");return d.getMonth()===hoy.getMonth()&&d.getFullYear()===hoy.getFullYear()&&x.estadoPago==="PAGADO"});
    const pendientes=ventas.filter(x=>x.estadoPago==="PENDIENTE"),pagadas=ventas.filter(x=>x.estadoPago==="PAGADO"),entregadas=ventas.filter(x=>x.estadoEntrega==="ENTREGADO");
    $("#kpiVentasDia").textContent=`$${fmt(ventasHoy.reduce((a,x)=>a+Number(x.total||0),0))}`;
    $("#detalleVentasDia").textContent=`${ventasHoy.length} venta(s) registrada(s)`;
    $("#kpiIngresosMes").textContent=`$${fmt(ventasMes.reduce((a,x)=>a+Number(x.total||0),0))}`;
    $("#detalleIngresosMes").textContent=ventasMes.length?`${ventasMes.length} venta(s) pagada(s) este mes`:"Sin movimientos todavía";
    $("#kpiPorCobrar").textContent=`$${fmt(pendientes.reduce((a,x)=>a+Number(x.total||0),0))}`;
    $("#detallePorCobrar").textContent=`${pendientes.length} pago(s) pendiente(s)`;
    $("#kpiClientes").textContent=clientes.length;
    $("#flujoVentas").textContent=ventas.length;$("#flujoEntregadas").textContent=entregadas.length;$("#flujoPendientes").textContent=pendientes.length;$("#flujoConversion").textContent=ventas.length?`${Math.round(pagadas.length/ventas.length*100)}%`:"0%";
    $("#contadorNotificaciones").textContent=resp.filter(x=>x.estado==="PENDIENTE").length+sus.filter(x=>["POR_VENCER","VENCIDA"].includes(x.estado)).length;
    $("#estadoSheets").textContent="Listo";$("#estadoAppsScript").textContent="Conectado";
    renderActividad(ventas);mostrarMensaje("Dashboard sincronizado con Google Sheets.");
  }catch(e){$("#estadoSheets").textContent="Revisar";$("#estadoAppsScript").textContent="Sin conexión";mostrarMensaje(e.message)}
  finally{setTimeout(()=>actualizar?.classList.remove("girando"),500)}
}
$("#fechaActual").textContent=new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
$("#botonAbrirMenu")?.addEventListener("click",()=>{menu.classList.add("abierto");capa.classList.add("visible")});
$("#botonCerrarMenu")?.addEventListener("click",()=>{menu.classList.remove("abierto");capa.classList.remove("visible")});
capa?.addEventListener("click",()=>$("#botonCerrarMenu")?.click());
$("#botonCerrarSesion")?.addEventListener("click",()=>{if(confirm("¿Deseas cerrar la sesión?"))location.href="index.html"});
actualizar?.addEventListener("click",cargar);
document.addEventListener("click",e=>{const b=e.target.closest("[data-destino]");if(b){e.preventDefault();location.href=b.dataset.destino}});
document.querySelectorAll("[data-pagina]").forEach(x=>x.addEventListener("click",e=>{e.preventDefault();mostrarMensaje(`La sección “${x.dataset.pagina}” se conectará en su fase.`)}));
const mapa={clientes:"clientes.html",productos:"productos.html",canva:"canva.html",proveedores:"proveedores.html",revendedores:"revendedores.html",ventas:"ventas.html",pagos:"pagos.html",entregas:"entregas.html",inventario:"inventario.html",suscripciones:"suscripciones.html",renovaciones:"renovaciones.html",reportes:"reportes.html",usuarios:"usuarios.html",configuracion:"configuracion.html",configuración:"configuracion.html",telegram:"telegram-proveedores.html",publicidad:"publicidad.html",chat:"chat-admin.html"};
$("#buscarPlataforma")?.addEventListener("keydown",e=>{if(e.key==="Enter"){const q=e.target.value.trim().toLowerCase(),k=Object.keys(mapa).find(x=>x.includes(q)||q.includes(x));k?location.href=mapa[k]:mostrarMensaje("No encontramos una sección disponible con ese nombre.")}});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#buscarPlataforma")?.focus()}});
cargar();
})();