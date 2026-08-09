(() => {
"use strict";

const config=window.MUNDO_DIGITAL_CONFIG||{};
const $=s=>document.querySelector(s);
const E={
  token:$("#tokenBot"),
  secreto:$("#secretoWebhook"),
  estado:$("#estadoBot"),
  datos:$("#datosBot"),
  guardar:$("#guardarBot"),
  probar:$("#probarBot"),
  webhook:$("#registrarWebhook"),
  actualizar:$("#actualizarLista"),
  lista:$("#lista"),
  resumen:$("#resumen"),
  modal:$("#modalEnlace"),
  cerrar:$("#cerrarModal"),
  nombreModal:$("#nombreModal"),
  enlaceModal:$("#enlaceModal"),
  copiar:$("#copiarEnlace"),
  abrir:$("#abrirEnlace"),
  mensaje:$("#mensaje")
};

let enlaceActual="";

function apiValida(){
  if(!config.APPS_SCRIPT_URL){
    throw new Error("Falta APPS_SCRIPT_URL en configuracion.js.");
  }
  if(!config.API_KEY_SOCIOS){
    throw new Error("Falta API_KEY_SOCIOS en configuracion.js.");
  }
}

async function get(action){
  apiValida();
  const url=new URL(config.APPS_SCRIPT_URL);
  url.searchParams.set("action",action);
  url.searchParams.set("claveApi",config.API_KEY_SOCIOS);
  const r=await fetch(url);
  const d=await r.json();
  if(!d.ok)throw new Error(d.mensaje||"Error de conexión.");
  return d;
}

async function post(action,extra={}){
  apiValida();
  const r=await fetch(config.APPS_SCRIPT_URL,{
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({
      action,
      claveApi:config.API_KEY_SOCIOS,
      ...extra
    })
  });
  const d=await r.json();
  if(!d.ok)throw new Error(d.mensaje||"Error de conexión.");
  return d;
}

function mensaje(texto){
  E.mensaje.textContent=texto;
  E.mensaje.className="mensaje visible";
  clearTimeout(mensaje.timer);
  mensaje.timer=setTimeout(()=>E.mensaje.className="mensaje",3600);
}

async function cargarConfiguracion(){
  const d=await get("obtenerConfiguracionTelegramRevendedoresMD20");
  const c=d.registro||{};
  E.estado.textContent=c.listo?"CONFIGURADO":"SIN CONFIGURAR";
  E.estado.classList.toggle("activo",Boolean(c.listo));
  E.datos.innerHTML=[
    `<b>Bot:</b> ${c.botUsername?"@"+c.botUsername:"Sin configurar"}`,
    `<b>Implementación:</b> ${c.urlImplementacion||"No disponible"}`,
    `<b>Webhook:</b> ${c.webhookUrl||"Pendiente"}`
  ].join("<br>");
}

async function cargarLista(){
  E.lista.innerHTML='<p class="cargando">Cargando revendedores...</p>';
  const d=await get("listarVinculacionesTelegramRevendedoresMD20");
  const rows=d.registros||[];
  const vinculados=rows.filter(r=>r.telegramEstado==="VINCULADO").length;
  const pendientes=rows.filter(r=>r.telegramEstado==="PENDIENTE").length;

  E.resumen.innerHTML=`
    <span>Total: ${rows.length}</span>
    <span>Vinculados: ${vinculados}</span>
    <span>Pendientes: ${pendientes}</span>
  `;

  E.lista.innerHTML=rows.length?rows.map(r=>`
    <article class="fila">
      <div>
        <h3>${r.nombre}</h3>
        <p>${r.revendedorId} · ${r.whatsapp||"Sin WhatsApp"}</p>
        <span class="estado ${r.telegramEstado==="VINCULADO"?"vinculado":""}">
          ${r.telegramEstado}
          ${r.telegramUsername?" · @"+r.telegramUsername:""}
          ${r.chatIdProtegido?" · "+r.chatIdProtegido:""}
        </span>
      </div>
      <div class="botones">
        <button data-accion="enlace" data-id="${r.revendedorId}">
          Generar enlace
        </button>
        ${r.telegramEstado==="VINCULADO"?`
          <button data-accion="prueba" data-id="${r.revendedorId}">
            Enviar prueba
          </button>
          <button class="peligro" data-accion="desvincular" data-id="${r.revendedorId}">
            Desvincular
          </button>
        `:""}
      </div>
    </article>
  `).join(""):'<p class="cargando">No hay revendedores registrados.</p>';

  E.lista.querySelectorAll("[data-accion]").forEach(b=>{
    b.addEventListener("click",()=>accionFila(b.dataset.accion,b.dataset.id));
  });
}

async function accionFila(accion,id){
  try{
    if(accion==="enlace"){
      const d=await post("generarEnlaceTelegramRevendedorMD20",{revendedorId:id});
      const r=d.registro||{};
      enlaceActual=r.enlace||"";
      E.nombreModal.textContent=r.nombre||id;
      E.enlaceModal.value=enlaceActual;
      E.modal.hidden=false;
    }

    if(accion==="prueba"){
      await post("enviarPruebaTelegramRevendedorMD20",{revendedorId:id});
      mensaje("Mensaje de prueba enviado.");
    }

    if(accion==="desvincular"){
      if(!confirm("¿Deseas desconectar el Telegram de este revendedor?"))return;
      await post("desvincularTelegramRevendedorMD20",{revendedorId:id});
      mensaje("Telegram desvinculado.");
      await cargarLista();
    }
  }catch(e){
    mensaje(e.message);
  }
}

E.guardar.addEventListener("click",async()=>{
  try{
    await post("guardarConfiguracionTelegramRevendedoresMD20",{
      registro:{
        token:E.token.value.trim(),
        secreto:E.secreto.value.trim()
      }
    });
    E.token.value="";
    mensaje("Configuración guardada.");
    await cargarConfiguracion();
  }catch(e){mensaje(e.message);}
});

E.probar.addEventListener("click",async()=>{
  try{
    const d=await post("probarTelegramRevendedoresMD20");
    mensaje(d.mensaje||"Bot conectado.");
  }catch(e){mensaje(e.message);}
});

E.webhook.addEventListener("click",async()=>{
  try{
    const d=await post("registrarWebhookTelegramRevendedoresMD20");
    mensaje(d.mensaje||"Webhook registrado.");
    await cargarConfiguracion();
  }catch(e){mensaje(e.message);}
});

E.actualizar.addEventListener("click",cargarLista);
E.cerrar.addEventListener("click",()=>E.modal.hidden=true);
E.modal.addEventListener("click",e=>{if(e.target===E.modal)E.modal.hidden=true;});
E.copiar.addEventListener("click",async()=>{
  await navigator.clipboard.writeText(enlaceActual);
  mensaje("Enlace copiado.");
});
E.abrir.addEventListener("click",()=>window.open(enlaceActual,"_blank","noopener"));

Promise.all([cargarConfiguracion(),cargarLista()]).catch(e=>mensaje(e.message));
})();