(() => {
"use strict";

const cfg = window.MUNDO_DIGITAL_CONFIG || {};
const $ = s => document.querySelector(s);

const E = {
  login: $("#loginPortal"),
  form: $("#formAcceso"),
  telefono: $("#telefonoPortal"),
  token: $("#tokenPortal"),
  entrar: $("#btnEntrar"),
  cargando: $("#cargandoPortal"),
  error: $("#errorPortal"),
  textoError: $("#textoError"),
  volver: $("#volverLogin"),
  contenido: $("#contenidoPortal"),
  nombre: $("#nombreCliente"),
  soporte: $("#botonSoporte"),
  salir: $("#cerrarSesion"),
  activos: $("#totalActivos"),
  por: $("#totalPorVencer"),
  vencidos: $("#totalVencidos"),
  lista: $("#listaServicios"),
  sin: $("#sinServicios"),
  mensaje: $("#mensajePortal")
};

let sesion = { telefono:"", token:"" };

function limpiarTelefono(v){ return String(v||"").replace(/\D/g,"").replace(/^0+/,""); }
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function fecha(v){
  if(!v) return "Sin fecha";
  const s=String(v).slice(0,10);
  const d=new Date(s+"T12:00:00");
  return isNaN(d.getTime()) ? esc(v) : d.toLocaleDateString("es-ES");
}
function msg(t,tipo="ok"){
  E.mensaje.textContent=t;
  E.mensaje.className=`mensaje visible ${tipo==="error"?"error":""}`;
  clearTimeout(msg.t);
  msg.t=setTimeout(()=>E.mensaje.className="mensaje",3800);
}
function mostrarLogin(){
  E.login.hidden=false; E.cargando.hidden=true; E.error.hidden=true; E.contenido.hidden=true;
}
function mostrarCarga(){
  E.login.hidden=true; E.cargando.hidden=false; E.error.hidden=true; E.contenido.hidden=true;
}
function mostrarError(texto){
  E.login.hidden=true; E.cargando.hidden=true; E.contenido.hidden=true; E.error.hidden=false;
  E.textoError.textContent=texto||"No se pudo abrir tu cuenta.";
}

async function getPortal(telefono,token){
  if(!cfg.APPS_SCRIPT_URL) throw Error("La página todavía no está conectada al sistema.");
  const u=new URL(cfg.APPS_SCRIPT_URL);
  u.searchParams.set("action","consultarPortalClienteLogin");
  u.searchParams.set("telefono",limpiarTelefono(telefono));
  u.searchParams.set("token",String(token||"").trim().toUpperCase());
  u.searchParams.set("_",Date.now());
  const r=await fetch(u,{redirect:"follow",cache:"no-store"});
  const d=await r.json();
  if(!d.ok) throw Error(d.mensaje||"Número o token incorrecto.");
  return d;
}

async function responder(servicioId,tipoServicio,respuesta){
  const r=await fetch(cfg.APPS_SCRIPT_URL,{
    method:"POST",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({
      action:"responderRenovacionPortal",
      telefono:sesion.telefono,
      token:sesion.token,
      servicioId,tipoServicio,respuesta
    })
  });
  const d=await r.json();
  if(!d.ok) throw Error(d.mensaje||"No se pudo guardar la respuesta.");
  return d;
}

function dato(label,valor,clase=""){
  if(valor===undefined||valor===null||String(valor).trim()==="") return "";
  return `<div class="dato ${clase}"><span>${esc(label)}</span><strong>${esc(valor)}</strong></div>`;
}

function tarjeta(s){
  const respuesta=s.respuestaCliente||"SIN_RESPUESTA";
  const tipo=s.tipoServicio==="CANVA"?"Cuenta de Canva":"Cuenta / suscripción digital";
  const credenciales=[
    dato("Correo o usuario",s.correo||s.usuarioCuenta||""),
    dato("Contraseña",s.contrasenaCuenta||"",s.contrasenaCuenta?"sensible":""),
    dato("Perfil",s.perfil||""),
    dato("PIN",s.pin||"",s.pin?"sensible":""),
    dato(s.tipoServicio==="CANVA"?"Equipo":"Plataforma",s.equipoNombre||s.plataforma||""),
    dato("Fecha de compra",fecha(s.fechaInicio)),
    dato("Fecha de vencimiento",fecha(s.fechaVencimiento)),
    dato("Días restantes",Number(s.diasRestantes||0)),
    dato("Precio de renovación",`${Number(s.precioRenovacion||0).toLocaleString("es-ES",{minimumFractionDigits:2})} ${s.moneda||"USD"}`)
  ].join("");

  return `<article class="servicio">
    <div class="servicio-cabecera">
      <div><h4>${esc(s.nombre)}</h4><p class="subtitulo">${esc(tipo)}</p></div>
      <span class="estado ${String(s.estado||"").toLowerCase()}">${esc(s.estado||"SIN ESTADO")}</span>
    </div>
    <div class="datos">${credenciales}</div>
    <div class="acciones">
      <button class="renovar" data-id="${esc(s.id)}" data-tipo="${esc(s.tipoServicio)}" data-respuesta="RENOVAR">Quiero renovar</button>
      <button class="no-renovar" data-id="${esc(s.id)}" data-tipo="${esc(s.tipoServicio)}" data-respuesta="NO_RENOVAR">No renovar</button>
    </div>
    <div class="respuesta">Respuesta actual: <strong>${esc(respuesta)}</strong></div>
  </article>`;
}

async function cargar(telefono,token){
  sesion.telefono=limpiarTelefono(telefono);
  sesion.token=String(token||"").trim().toUpperCase();
  mostrarCarga();
  try{
    const d=await getPortal(sesion.telefono,sesion.token);
    const servicios=d.servicios||[];
    E.nombre.textContent=d.cliente?.nombreCompleto||"cliente";
    const numero=String(d.soporteWhatsapp||"").replace(/\D/g,"");
    E.soporte.href=numero?`https://wa.me/${numero}?text=${encodeURIComponent("Hola, necesito ayuda con mis servicios de Mundo Digital 2.0.")}`:"#";
    E.activos.textContent=servicios.filter(x=>x.estado==="ACTIVA"||x.estado==="ACTIVO").length;
    E.por.textContent=servicios.filter(x=>x.estado==="POR_VENCER").length;
    E.vencidos.textContent=servicios.filter(x=>x.estado==="VENCIDA"||x.estado==="VENCIDO").length;
    E.lista.innerHTML=servicios.map(tarjeta).join("");
    E.sin.hidden=servicios.length>0;
    E.cargando.hidden=true;
    E.contenido.hidden=false;

    document.querySelectorAll("[data-respuesta]").forEach(b=>b.onclick=async()=>{
      const texto=b.dataset.respuesta==="RENOVAR"?"¿Confirmas que deseas renovar este servicio?":"¿Confirmas que no deseas renovar este servicio?";
      if(!confirm(texto))return;
      b.disabled=true;
      try{
        await responder(b.dataset.id,b.dataset.tipo,b.dataset.respuesta);
        msg("Tu respuesta fue registrada correctamente.");
        await cargar(sesion.telefono,sesion.token);
      }catch(e){msg(e.message,"error")}finally{b.disabled=false}
    });
  }catch(e){ mostrarError(e.message); }
}

E.form.addEventListener("submit",e=>{
  e.preventDefault();
  const telefono=limpiarTelefono(E.telefono.value);
  const token=String(E.token.value||"").trim().toUpperCase();
  if(!telefono){msg("Escribe tu número de celular.","error");return;}
  if(!token){msg("Escribe tu token de acceso.","error");return;}
  cargar(telefono,token);
});

E.volver.addEventListener("click",mostrarLogin);
E.salir.addEventListener("click",()=>{
  sesion={telefono:"",token:""};
  E.token.value="";
  mostrarLogin();
});

// Compatibilidad: si viene un token antiguo por URL, conservamos la pantalla de login.
const tokenUrl=new URLSearchParams(location.search).get("token")||"";
if(tokenUrl && tokenUrl.startsWith("MD20-")) E.token.value=tokenUrl;
mostrarLogin();
})();
