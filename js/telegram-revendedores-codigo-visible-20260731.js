(() => {
"use strict";

const config=window.MUNDO_DIGITAL_CONFIG||{};
const $=selector=>document.querySelector(selector);

const E={
  token:$("#tokenBot"),
  secreto:$("#secretoWebhook"),
  estado:$("#estadoBot"),
  datos:$("#datosBot"),
  guardar:$("#guardarBot"),
  probar:$("#probarBot"),
  webhook:$("#registrarWebhook"),
  diagnosticar:$("#diagnosticarWebhook"),
  diagnostico:$("#diagnosticoWebhook"),
  actualizar:$("#actualizarLista"),
  lista:$("#lista"),
  resumen:$("#resumen"),
  mensaje:$("#mensaje")
};

const codigosGenerados=new Map();

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

  const respuesta=await fetch(url);
  const datos=await respuesta.json();

  if(!datos.ok){
    throw new Error(datos.mensaje||"Error de conexión.");
  }
  return datos;
}

async function post(action,extra={}){
  apiValida();

  const respuesta=await fetch(config.APPS_SCRIPT_URL,{
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({
      action,
      claveApi:config.API_KEY_SOCIOS,
      ...extra
    })
  });

  const datos=await respuesta.json();

  if(!datos.ok){
    throw new Error(datos.mensaje||"Error de conexión.");
  }
  return datos;
}

function mostrarMensaje(texto){
  E.mensaje.textContent=texto;
  E.mensaje.className="mensaje visible";
  clearTimeout(mostrarMensaje.timer);
  mostrarMensaje.timer=setTimeout(()=>{
    E.mensaje.className="mensaje";
  },4200);
}

function escaparHtml(valor){
  return String(valor??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function extraerCodigo(registro){
  const directo=String(registro.codigo||"").trim().toUpperCase();
  if(directo)return directo;

  const comando=String(registro.comando||"").trim();
  const coincidencia=comando.match(/\/vincular\s+([A-Z0-9]{4,12})/i);
  if(coincidencia)return coincidencia[1].toUpperCase();

  const token=String(
    registro.tokenVinculacion||
    registro.token||
    ""
  ).trim().toUpperCase();

  if(/^[A-Z0-9]{4,12}$/.test(token))return token;

  return "";
}

function normalizarRegistroCodigo(registro,id){
  const codigo=extraerCodigo(registro);
  if(!codigo){
    throw new Error(
      "Apps Script no devolvió el código. Actualiza Código.gs y crea una Nueva versión de la implementación."
    );
  }

  const username=String(
    registro.botUsername||
    registro.usuarioBot||
    ""
  ).replace(/^@/,"").trim();

  return {
    revendedorId:id,
    nombre:String(registro.nombre||id),
    codigo,
    comando:`/vincular ${codigo}`,
    enlaceBot:String(
      registro.enlaceBot||
      (username?`https://t.me/${username}`:"https://t.me/")
    ),
    venceEnMinutos:Number(registro.venceEnMinutos||30)
  };
}

async function cargarConfiguracion(){
  const datos=await get("obtenerConfiguracionTelegramRevendedoresMD20");
  const configuracion=datos.registro||{};

  E.estado.textContent=configuracion.listo
    ?"CONFIGURADO"
    :"SIN CONFIGURAR";

  E.estado.classList.toggle("activo",Boolean(configuracion.listo));

  E.datos.innerHTML=[
    `<b>Bot:</b> ${configuracion.botUsername?"@"+escaparHtml(configuracion.botUsername):"Sin configurar"}`,
    `<b>Implementación:</b> ${escaparHtml(configuracion.urlImplementacion||"No disponible")}`,
    `<b>Webhook:</b> ${escaparHtml(configuracion.webhookUrl||"Pendiente")}`
  ].join("<br>");
}

function tarjetaCodigo(registro){
  if(!registro)return "";

  return `
    <section class="codigo-vinculacion">
      <span class="codigo-etiqueta">TU CÓDIGO</span>
      <strong class="codigo-grande">${escaparHtml(registro.codigo)}</strong>
      <p>Envía al bot el siguiente comando:</p>
      <code>${escaparHtml(registro.comando)}</code>

      <small>
        Este código dura aproximadamente
        ${registro.venceEnMinutos} minutos y debe utilizarse una sola vez.
      </small>

      <div class="codigo-acciones">
        <button
          class="principal"
          data-codigo-accion="copiar"
          data-id="${escaparHtml(registro.revendedorId)}"
        >
          Copiar comando
        </button>

        <button
          data-codigo-accion="abrir"
          data-id="${escaparHtml(registro.revendedorId)}"
        >
          Abrir Telegram
        </button>

        <button
          data-codigo-accion="regenerar"
          data-id="${escaparHtml(registro.revendedorId)}"
        >
          Generar otro código
        </button>
      </div>
    </section>
  `;
}

async function cargarLista(){
  E.lista.innerHTML='<p class="cargando">Cargando revendedores...</p>';

  const datos=await get("listarVinculacionesTelegramRevendedoresMD20");
  const registros=datos.registros||[];

  const vinculados=registros.filter(
    registro=>registro.telegramEstado==="VINCULADO"
  ).length;

  const pendientes=registros.filter(
    registro=>registro.telegramEstado==="PENDIENTE"
  ).length;

  E.resumen.innerHTML=`
    <span>Total: ${registros.length}</span>
    <span>Vinculados: ${vinculados}</span>
    <span>Pendientes: ${pendientes}</span>
  `;

  E.lista.innerHTML=registros.length
    ?registros.map(registro=>{
      const codigo=codigosGenerados.get(registro.revendedorId);

      return `
        <article class="fila fila-con-codigo">
          <div class="fila-principal">
            <div>
              <h3>${escaparHtml(registro.nombre)}</h3>
              <p>
                ${escaparHtml(registro.revendedorId)}
                ·
                ${escaparHtml(registro.whatsapp||"Sin WhatsApp")}
              </p>

              <span class="estado ${
                registro.telegramEstado==="VINCULADO"
                  ?"vinculado"
                  :""
              }">
                ${escaparHtml(registro.telegramEstado)}
                ${
                  registro.telegramUsername
                    ?" · @"+escaparHtml(registro.telegramUsername)
                    :""
                }
                ${
                  registro.chatIdProtegido
                    ?" · "+escaparHtml(registro.chatIdProtegido)
                    :""
                }
              </span>
            </div>

            <div class="botones">
              <button
                data-accion="codigo"
                data-id="${escaparHtml(registro.revendedorId)}"
              >
                Generar código
              </button>

              ${
                registro.telegramEstado==="VINCULADO"
                  ?`
                    <button
                      data-accion="prueba"
                      data-id="${escaparHtml(registro.revendedorId)}"
                    >
                      Enviar prueba
                    </button>

                    <button
                      class="peligro"
                      data-accion="desvincular"
                      data-id="${escaparHtml(registro.revendedorId)}"
                    >
                      Desvincular
                    </button>
                  `
                  :""
              }
            </div>
          </div>

          ${tarjetaCodigo(codigo)}
        </article>
      `;
    }).join("")
    :'<p class="cargando">No hay revendedores registrados.</p>';

  conectarEventosLista();
}

function conectarEventosLista(){
  E.lista.querySelectorAll("[data-accion]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      accionFila(boton.dataset.accion,boton.dataset.id);
    });
  });

  E.lista.querySelectorAll("[data-codigo-accion]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      accionCodigo(
        boton.dataset.codigoAccion,
        boton.dataset.id
      );
    });
  });
}

async function generarCodigo(id){
  const datos=await post(
    "generarCodigoTelegramRevendedorMD20",
    {revendedorId:id}
  );

  const registro=normalizarRegistroCodigo(
    datos.registro||{},
    id
  );

  codigosGenerados.set(id,registro);
  await cargarLista();
  mostrarMensaje("Código generado correctamente.");
}

async function accionFila(accion,id){
  try{
    if(accion==="codigo"){
      await generarCodigo(id);
      return;
    }

    if(accion==="prueba"){
      await post(
        "enviarPruebaTelegramRevendedorMD20",
        {revendedorId:id}
      );
      mostrarMensaje("Mensaje de prueba enviado.");
      return;
    }

    if(accion==="desvincular"){
      if(!confirm(
        "¿Deseas desconectar el Telegram de este revendedor?"
      ))return;

      await post(
        "desvincularTelegramRevendedorMD20",
        {revendedorId:id}
      );

      codigosGenerados.delete(id);
      mostrarMensaje("Telegram desvinculado.");
      await cargarLista();
    }
  }catch(error){
    mostrarMensaje(error.message);
  }
}

async function copiarTexto(texto){
  try{
    await navigator.clipboard.writeText(texto);
  }catch(error){
    const temporal=document.createElement("textarea");
    temporal.value=texto;
    temporal.style.position="fixed";
    temporal.style.opacity="0";
    document.body.appendChild(temporal);
    temporal.focus();
    temporal.select();
    document.execCommand("copy");
    temporal.remove();
  }
}

async function accionCodigo(accion,id){
  const registro=codigosGenerados.get(id);
  if(!registro){
    mostrarMensaje("Genera primero el código.");
    return;
  }

  if(accion==="copiar"){
    await copiarTexto(registro.comando);
    mostrarMensaje("Comando copiado.");
    return;
  }

  if(accion==="abrir"){
    window.open(registro.enlaceBot,"_blank","noopener");
    return;
  }

  if(accion==="regenerar"){
    try{
      await generarCodigo(id);
    }catch(error){
      mostrarMensaje(error.message);
    }
  }
}

E.guardar.addEventListener("click",async()=>{
  try{
    await post(
      "guardarConfiguracionTelegramRevendedoresMD20",
      {
        registro:{
          token:E.token.value.trim(),
          secreto:E.secreto.value.trim()
        }
      }
    );

    E.token.value="";
    mostrarMensaje("Configuración guardada.");
    await cargarConfiguracion();
  }catch(error){
    mostrarMensaje(error.message);
  }
});

E.probar.addEventListener("click",async()=>{
  try{
    const datos=await post("probarTelegramRevendedoresMD20");
    mostrarMensaje(datos.mensaje||"Bot conectado.");
  }catch(error){
    mostrarMensaje(error.message);
  }
});

E.webhook.addEventListener("click",async()=>{
  try{
    const datos=await post(
      "registrarWebhookTelegramRevendedoresMD20"
    );

    mostrarMensaje(datos.mensaje||"Webhook registrado.");
    await cargarConfiguracion();
    await diagnosticarWebhook();
  }catch(error){
    mostrarMensaje(error.message);
  }
});

async function diagnosticarWebhook(){
  try{
    const datos=await get(
      "diagnosticarWebhookTelegramRevendedoresMD20"
    );

    const resultado=datos.registro||{};
    const telegram=resultado.telegram||{};

    E.diagnostico.innerHTML=`
      <strong>
        ${
          resultado.coincide
            ?"✅ Webhook correcto"
            :"❌ Webhook incorrecto"
        }
      </strong>
      <span>
        <b>URL guardada:</b>
        ${escaparHtml(telegram.url||"Vacía")}
      </span>
      <span>
        <b>Actualizaciones pendientes:</b>
        ${Number(telegram.actualizacionesPendientes||0)}
      </span>
      <span>
        <b>Último error:</b>
        ${escaparHtml(telegram.ultimoErrorMensaje||"Sin errores")}
      </span>
      <span>
        <b>Fecha del error:</b>
        ${escaparHtml(telegram.ultimoErrorFecha||"—")}
      </span>
    `;
  }catch(error){
    E.diagnostico.innerHTML=`
      <strong>Diagnóstico fallido</strong>
      <span>${escaparHtml(error.message)}</span>
    `;
  }
}

E.diagnosticar.addEventListener("click",diagnosticarWebhook);
E.actualizar.addEventListener("click",cargarLista);

Promise.all([
  cargarConfiguracion(),
  cargarLista(),
  diagnosticarWebhook()
]).catch(error=>mostrarMensaje(error.message));
})();
