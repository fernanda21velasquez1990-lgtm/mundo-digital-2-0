(() => {
"use strict";

const cfg=window.MUNDO_DIGITAL_CONFIG||{};
const token=new URLSearchParams(location.search).get("token")||"";
const $=s=>document.querySelector(s);

const E={
  cargando:$("#cargandoPortal"),
  error:$("#errorPortal"),
  textoError:$("#textoError"),
  contenido:$("#contenidoPortal"),
  nombre:$("#nombreCliente"),
  soporte:$("#botonSoporte"),
  compras:$("#totalCompras"),
  activos:$("#totalActivos"),
  por:$("#totalPorVencer"),
  vencidos:$("#totalVencidos"),
  listaServicios:$("#listaServicios"),
  sinServicios:$("#sinServicios"),
  listaMateriales:$("#listaMateriales"),
  sinMateriales:$("#sinMateriales"),
  historial:$("#historialCompras"),
  sinCompras:$("#sinCompras"),
  mensaje:$("#mensajePortal")
};

let soporteWhatsapp="";

function msg(t,tipo="ok"){
  E.mensaje.textContent=t;
  E.mensaje.className=`mensaje visible ${tipo==="error"?"error":""}`;
  clearTimeout(msg.t);
  msg.t=setTimeout(()=>E.mensaje.className="mensaje",3800);
}

async function getPortal(){
  if(!token)throw Error("El enlace no contiene un token.");

  const u=new URL(cfg.APPS_SCRIPT_URL);
  u.searchParams.set("action","consultarPortalCliente");
  u.searchParams.set("token",token);
  u.searchParams.set("nocache",Date.now());

  const r=await fetch(u,{redirect:"follow",cache:"no-store"});
  const d=await r.json();

  if(!d.ok)throw Error(d.mensaje||"No se pudo abrir el portal.");
  return d;
}

async function responder(servicioId,tipoServicio,respuesta){
  const r=await fetch(cfg.APPS_SCRIPT_URL,{
    method:"POST",
    redirect:"follow",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({
      action:"responderRenovacionPortal",
      token,
      servicioId,
      tipoServicio,
      respuesta
    })
  });

  const d=await r.json();
  if(!d.ok)throw Error(d.mensaje||"No se pudo guardar la respuesta.");
  return d;
}

function esc(v){
  return String(v??"").replace(/[&<>"']/g,m=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function safeUrl(v){
  const s=String(v||"").trim();
  return /^https?:\/\//i.test(s)?s:"";
}

function fecha(v){
  const s=String(v||"").trim();
  if(!s)return "Sin fecha";

  let d;
  if(/^\d{4}-\d{2}-\d{2}$/.test(s)){
    const [y,m,day]=s.split("-").map(Number);
    d=new Date(y,m-1,day);
  }else{
    d=new Date(s.replace(" ","T"));
  }

  return !d||Number.isNaN(d.getTime())
    ? esc(s)
    : d.toLocaleDateString("es-ES");
}

function estadoClase(v){
  return String(v||"").toLowerCase().replace(/\s+/g,"_");
}

function estadoBonito(v){
  return String(v||"SIN ESTADO").replace(/_/g," ");
}

function secreto(label,valor){
  if(!valor)return "";
  const id="sec-"+Math.random().toString(36).slice(2);
  return `<div class="dato dato-secreto">
    <span>${esc(label)}</span>
    <strong id="${id}" data-secreto="${esc(valor)}">••••••••</strong>
    <button type="button" class="mostrar-secreto" data-target="${id}">👁 Mostrar</button>
  </div>`;
}

function dato(label,valor){
  if(valor===undefined||valor===null||String(valor)==="")return "";
  return `<div class="dato"><span>${esc(label)}</span><strong>${esc(valor)}</strong></div>`;
}

function whatsappServicio(nombre){
  const numero=String(soporteWhatsapp||"").replace(/\D/g,"");
  if(!numero)return "#";

  const texto=`Hola, necesito ayuda con mi servicio ${nombre} en Mundo Digital 2.0.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}

function tarjetaServicio(s){
  const respuesta=s.respuestaCliente||"SIN_RESPUESTA";
  const equipo=s.equipoNombre||"";
  const plataforma=s.plataforma||"";
  const enlace=safeUrl(s.enlaceAcceso);
  const esCanva=s.tipoServicio==="CANVA";

  const datos=[
    dato(esCanva?"Correo de Canva":"Usuario / correo",s.usuarioCuenta||s.correo),
    esCanva?dato("Equipo de Canva",equipo):dato("Plataforma",plataforma),
    dato("Tipo de cuenta",s.tipoCuenta),
    secreto("Contraseña",s.contrasenaCuenta),
    dato("Perfil",s.perfil),
    secreto("PIN",s.pin),
    dato("Fecha de compra / inicio",fecha(s.fechaInicio)),
    dato("Fecha de vencimiento",fecha(s.fechaVencimiento)),
    s.fechaVencimiento?dato("Días restantes",Number(s.diasRestantes||0)):"",
    s.precioRenovacion!==undefined
      ?dato("Precio de renovación",`${Number(s.precioRenovacion||0).toLocaleString("es-ES",{minimumFractionDigits:2})} ${s.moneda||"USD"}`)
      :""
  ].join("");

  const renovar=s.renovable!==false
    ?`<button class="renovar" data-id="${esc(s.id)}" data-tipo="${esc(s.tipoServicio)}" data-respuesta="RENOVAR">🔄 Quiero renovar</button>
       <button class="no-renovar" data-id="${esc(s.id)}" data-tipo="${esc(s.tipoServicio)}" data-respuesta="NO_RENOVAR">🚫 No renovar</button>`
    :"";

  return `<article class="servicio">
    <div class="servicio-cabecera">
      <div>
        <span class="tipo-servicio">${esCanva?"🎨 CANVA":"📺 CUENTA / SERVICIO"}</span>
        <h4>${esc(s.nombre||"Servicio digital")}</h4>
        <p class="subtitulo">${esc(esCanva?(equipo||"Cuenta de Canva"):(plataforma||s.tipoCuenta||"Servicio digital"))}</p>
      </div>
      <span class="estado ${estadoClase(s.estado)}">${esc(estadoBonito(s.estado))}</span>
    </div>

    <div class="datos">${datos}</div>

    ${enlace?`<a class="boton-acceso" href="${esc(enlace)}" target="_blank" rel="noopener noreferrer">🔗 Abrir acceso</a>`:""}

    <div class="acciones">
      ${renovar}
      <a class="whatsapp-servicio" href="${esc(whatsappServicio(s.nombre||"mi servicio"))}" target="_blank" rel="noopener">💬 WhatsApp</a>
    </div>

    ${s.renovable!==false?`<div class="respuesta">Respuesta de renovación: <strong>${esc(estadoBonito(respuesta))}</strong></div>`:""}
  </article>`;
}

function tarjetaMaterial(m){
  const url=safeUrl(m.archivoUrl)||safeUrl(m.enlaceAcceso);

  return `<article class="material">
    <div class="material-icono">📚</div>
    <div class="material-contenido">
      <div class="material-top">
        <div>
          <span class="tipo-servicio">${esc(m.tipoEntrega||"MATERIAL DIGITAL")}</span>
          <h4>${esc(m.nombre||"Material digital")}</h4>
        </div>
        <span class="estado ${estadoClase(m.estado)}">${esc(estadoBonito(m.estado))}</span>
      </div>
      <div class="material-datos">
        <span>Compra: <strong>${fecha(m.fechaCompra)}</strong></span>
        ${m.fechaEntrega?`<span>Entrega: <strong>${fecha(m.fechaEntrega)}</strong></span>`:""}
      </div>
      <div class="acciones-material">
        ${url
          ?`<a class="descargar" href="${esc(url)}" target="_blank" rel="noopener noreferrer">📥 Abrir / descargar</a>`
          :`<span class="sin-enlace">Enlace pendiente de carga</span>`}
        <a class="whatsapp-servicio" href="${esc(whatsappServicio(m.nombre||"mi material"))}" target="_blank" rel="noopener">💬 Ayuda</a>
      </div>
    </div>
  </article>`;
}

function filaCompra(v){
  return `<article class="compra">
    <div class="compra-principal">
      <strong>${esc(v.productoNombre||"Producto digital")}</strong>
      <span>${esc(v.numeroVenta||v.id||"")}</span>
    </div>
    <div class="compra-dato"><span>Fecha</span><strong>${fecha(v.fechaVenta)}</strong></div>
    <div class="compra-dato"><span>Total</span><strong>${Number(v.total||0).toLocaleString("es-ES",{minimumFractionDigits:2})} ${esc(v.moneda||"USD")}</strong></div>
    <div class="compra-dato"><span>Pago</span><strong>${esc(estadoBonito(v.estadoPago))}</strong></div>
    <div class="compra-dato"><span>Entrega</span><strong>${esc(estadoBonito(v.estadoEntrega))}</strong></div>
  </article>`;
}

function enlazarBotones(){
  document.querySelectorAll(".mostrar-secreto").forEach(b=>{
    b.onclick=()=>{
      const el=document.getElementById(b.dataset.target);
      if(!el)return;
      const visible=el.dataset.visible==="1";
      el.textContent=visible?"••••••••":el.dataset.secreto;
      el.dataset.visible=visible?"0":"1";
      b.textContent=visible?"👁 Mostrar":"🙈 Ocultar";
    };
  });

  document.querySelectorAll("[data-respuesta]").forEach(b=>{
    b.onclick=async()=>{
      const renovar=b.dataset.respuesta==="RENOVAR";
      const texto=renovar
        ?"¿Confirmas que deseas renovar este servicio?"
        :"¿Confirmas que no deseas renovar este servicio?";

      if(!confirm(texto))return;

      b.disabled=true;

      try{
        const r=await responder(b.dataset.id,b.dataset.tipo,b.dataset.respuesta);
        msg(r.mensaje||"Tu respuesta fue registrada correctamente.");
        await cargar();
      }catch(e){
        msg(e.message,"error");
      }finally{
        b.disabled=false;
      }
    };
  });
}

async function cargar(){
  try{
    const d=await getPortal();
    const servicios=d.servicios||[];
    const materiales=d.materiales||[];
    const compras=d.compras||[];

    soporteWhatsapp=String(d.soporteWhatsapp||"");
    E.nombre.textContent=d.cliente?.nombreCompleto||"cliente";

    const numero=soporteWhatsapp.replace(/\D/g,"");
    E.soporte.href=numero
      ?`https://wa.me/${numero}?text=${encodeURIComponent("Hola, necesito ayuda con mis servicios de Mundo Digital 2.0.")}`
      :"#";

    E.compras.textContent=compras.length;
    E.activos.textContent=servicios.filter(x=>["ACTIVA","ASIGNADA","DISPONIBLE","ENVIADA","ENTREGADA"].includes(String(x.estado||"").toUpperCase())).length;
    E.por.textContent=servicios.filter(x=>String(x.estado||"").toUpperCase()==="POR_VENCER").length;
    E.vencidos.textContent=servicios.filter(x=>String(x.estado||"").toUpperCase()==="VENCIDA").length;

    E.listaServicios.innerHTML=servicios.map(tarjetaServicio).join("");
    E.sinServicios.hidden=servicios.length>0;

    E.listaMateriales.innerHTML=materiales.map(tarjetaMaterial).join("");
    E.sinMateriales.hidden=materiales.length>0;

    E.historial.innerHTML=compras.map(filaCompra).join("");
    E.sinCompras.hidden=compras.length>0;

    E.cargando.hidden=true;
    E.error.hidden=true;
    E.contenido.hidden=false;

    enlazarBotones();

  }catch(e){
    E.cargando.hidden=true;
    E.contenido.hidden=true;
    E.error.hidden=false;
    E.textoError.textContent=e.message;
  }
}

cargar();
})();