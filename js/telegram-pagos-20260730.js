(() => {
"use strict";

const CONFIG=window.MUNDO_DIGITAL_CONFIG||{};
const $=s=>document.querySelector(s);

const E={
  token:$("#tokenBot"),
  chats:$("#chatIds"),
  secreto:$("#secretoWebhook"),
  estadoToken:$("#estadoToken"),
  estadoChats:$("#estadoChats"),
  estadoWebhook:$("#estadoWebhook"),
  guardar:$("#guardarTelegram"),
  probar:$("#probarTelegram"),
  webhook:$("#registrarWebhook"),
  pendientes:$("#enviarPendientes"),
  mensaje:$("#mensajeTelegram")
};

function configuracion(){
  return {
    url:String(CONFIG.APPS_SCRIPT_URL||"").trim(),
    clave:String(CONFIG.API_KEY_SOCIOS||CONFIG.API_KEY||"").trim()
  };
}

function mensaje(texto,tipo="exito"){
  E.mensaje.textContent=texto;
  E.mensaje.className=`mensaje visible ${tipo}`;
  clearTimeout(mensaje.timer);
  mensaje.timer=setTimeout(()=>{
    E.mensaje.className="mensaje";
  },4200);
}

function bloquear(valor){
  [E.guardar,E.probar,E.webhook,E.pendientes].forEach(b=>b.disabled=valor);
}

async function get(action){
  const cfg=configuracion();
  if(!cfg.url)throw new Error("Falta APPS_SCRIPT_URL en configuracion-estable.js.");

  const url=new URL(cfg.url);
  url.searchParams.set("action",action);
  url.searchParams.set("claveApi",cfg.clave);

  const respuesta=await fetch(url,{redirect:"follow"});
  const datos=await respuesta.json();
  if(!datos.ok)throw new Error(datos.mensaje||"No se pudo cargar.");
  return datos;
}

async function post(action,registro={}){
  const cfg=configuracion();
  if(!cfg.url)throw new Error("Falta APPS_SCRIPT_URL en configuracion-estable.js.");

  const respuesta=await fetch(cfg.url,{
    method:"POST",
    redirect:"follow",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({
      action,
      claveApi:cfg.clave,
      registro
    })
  });

  const datos=await respuesta.json();
  if(!datos.ok)throw new Error(datos.mensaje||"No se pudo completar la operación.");
  return datos;
}

function pintarEstado(registro){
  E.estadoToken.textContent=registro.tokenConfigurado?"Configurado":"Pendiente";
  E.estadoToken.className=registro.tokenConfigurado?"ok":"error";

  E.estadoChats.textContent=String((registro.chatIds||[]).length);
  E.estadoChats.className=(registro.chatIds||[]).length?"ok":"error";

  E.estadoWebhook.textContent=registro.listo?"Listo":"Pendiente";
  E.estadoWebhook.className=registro.listo?"ok":"error";

  E.chats.value=(registro.chatIds||[]).join("\n");
}

async function cargar(){
  try{
    bloquear(true);
    const datos=await get("obtenerConfiguracionTelegramPagosMD20");
    pintarEstado(datos.registro||{});
  }catch(error){
    mensaje(error.message,"error");
  }finally{
    bloquear(false);
  }
}

E.guardar.addEventListener("click",async()=>{
  try{
    bloquear(true);
    const datos=await post("guardarConfiguracionTelegramPagosMD20",{
      token:E.token.value.trim(),
      chatIds:E.chats.value.trim(),
      secreto:E.secreto.value.trim()
    });
    E.token.value="";
    E.secreto.value="";
    pintarEstado(datos.registro||{});
    mensaje("Configuración de Telegram guardada.");
  }catch(error){
    mensaje(error.message,"error");
  }finally{
    bloquear(false);
  }
});

E.probar.addEventListener("click",async()=>{
  try{
    bloquear(true);
    const datos=await post("probarTelegramPagosMD20");
    mensaje(datos.mensaje||"Mensaje enviado.");
  }catch(error){
    mensaje(error.message,"error");
  }finally{
    bloquear(false);
  }
});

E.webhook.addEventListener("click",async()=>{
  try{
    bloquear(true);
    const datos=await post("registrarWebhookTelegramPagosMD20");
    mensaje(datos.mensaje||"Webhook registrado.");
    await cargar();
  }catch(error){
    mensaje(error.message,"error");
  }finally{
    bloquear(false);
  }
});

E.pendientes.addEventListener("click",async()=>{
  try{
    bloquear(true);
    const datos=await post("enviarAlertasTelegramPendientesMD20");
    mensaje(
      `${datos.alertas||0} alertas procesadas · ${datos.enviados||0} mensajes enviados.`
    );
  }catch(error){
    mensaje(error.message,"error");
  }finally{
    bloquear(false);
  }
});

cargar();
})();
