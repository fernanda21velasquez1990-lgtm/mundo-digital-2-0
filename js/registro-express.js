(()=>{
  "use strict";

  const $=s=>document.querySelector(s);
  const api=window.MD20AdminAPI;

  const E={
    menu:$("#menuLateral"),capa:$("#capaOscura"),abrir:$("#botonAbrirMenu"),cerrar:$("#botonCerrarMenu"),
    salir:$("#botonCerrarSesion"),actualizar:$("#botonActualizar"),conexion:$("#estadoConexion"),form:$("#formRegistroExpress"),
    plataforma:$("#plataforma"),correo:$("#correoCuenta"),contrasena:$("#contrasena"),perfil:$("#perfil"),pin:$("#pin"),
    cliente:$("#cliente"),whatsapp:$("#whatsapp"),proveedor:$("#proveedorId"),campoProveedorManual:$("#campoProveedorManual"),
    proveedorManual:$("#proveedorManual"),selectorMeses:$("#selectorMeses"),mesesManual:$("#mesesManual"),inicio:$("#fechaInicio"),
    vence:$("#fechaVencimiento"),tiempoVista:$("#tiempoVista"),guardar:$("#botonGuardarExpress"),resultado:$("#resultadoExpress"),
    resultadoDatos:$("#resultadoDatos"),resultadoMomento:$("#resultadoMomento"),mensajeCliente:$("#mensajeClienteExpress"),
    copiarMensaje:$("#copiarMensajeExpress"),whatsappMensaje:$("#whatsappMensajeExpress"),
    nuevo:$("#nuevoRegistroExpress"),verPass:$("#verContrasena")
  };

  let meses=1;
  let proveedores=[];
  let ultimoRegistro=null;

  function hoyISO(){
    const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),dia=String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${dia}`;
  }

  function parseLocal(iso){
    const [y,m,d]=String(iso||"").split("-").map(Number);
    return new Date(y,m-1,d,12,0,0,0);
  }

  function isoLocal(d){
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function sumarMesesSeguro(fecha,cantidad){
    const dia=fecha.getDate(),x=new Date(fecha.getFullYear(),fecha.getMonth(),1,12);
    x.setMonth(x.getMonth()+Number(cantidad||0));
    const ultimo=new Date(x.getFullYear(),x.getMonth()+1,0).getDate();
    x.setDate(Math.min(dia,ultimo));
    return x;
  }

  function actualizarFechas(){
    E.inicio.value=hoyISO();
    const n=Math.max(1,Math.min(36,Number(meses)||1));
    E.vence.value=isoLocal(sumarMesesSeguro(parseLocal(E.inicio.value),n));
    E.tiempoVista.value=n+(n===1?" mes":" meses");
  }

  function formatearFecha(iso){
    const d=parseLocal(iso);
    if(isNaN(d.getTime())) return String(iso||"");
    return new Intl.DateTimeFormat("es-VE",{day:"2-digit",month:"2-digit",year:"numeric"}).format(d);
  }

  function formatearMomento(d){
    return new Intl.DateTimeFormat("es-VE",{
      day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"
    }).format(d);
  }

  function toast(t,error=false){
    if(api&&api.toast) return api.toast(t,error?"error":"ok");
    const m=$("#mensajePanel");
    if(!m) return;
    m.textContent=t;
    m.classList.add("visible");
    setTimeout(()=>m.classList.remove("visible"),3500);
  }

  function nombreProveedor(p){
    return [p?.nombre,p?.apellido].filter(Boolean).join(" ").trim()||p?.producto||"Proveedor";
  }

  async function cargarProveedores(){
    E.conexion.textContent="Sincronizando...";
    try{
      const d=await api.get("listarSocios",{tipo:"PROVEEDOR"});
      proveedores=d.registros||[];
      const base=['<option value="">Sin proveedor</option>'];
      proveedores.forEach(p=>base.push(`<option value="${api.esc(p.id)}">${api.esc(nombreProveedor(p))}</option>`));
      base.push('<option value="__OTRO__">Otro / escribir manualmente</option>');
      E.proveedor.innerHTML=base.join("");
      E.conexion.textContent="Google Sheets conectado";
      E.conexion.classList.remove("local");
    }catch(e){
      console.error(e);
      E.conexion.textContent="Revisar conexión";
      toast(e.message,true);
    }
  }

  function proveedorSeleccionado(){
    if(E.proveedor.value==="__OTRO__") return {id:"",nombre:E.proveedorManual.value.trim()};
    const p=proveedores.find(x=>String(x.id)===String(E.proveedor.value));
    return {id:p?.id||"",nombre:p?nombreProveedor(p):""};
  }

  function seleccionarMeses(valor,boton){
    E.selectorMeses.querySelectorAll("button").forEach(b=>b.classList.remove("activo"));
    boton?.classList.add("activo");
    if(valor==="otro"){
      E.mesesManual.hidden=false;
      meses=Math.max(1,Math.min(36,Number(E.mesesManual.value)||1));
    }else{
      E.mesesManual.hidden=true;
      meses=Number(valor)||1;
      E.mesesManual.value=meses;
    }
    actualizarFechas();
  }

  function resetearCampos(){
    E.form.reset();
    meses=1;
    E.selectorMeses.querySelectorAll("button").forEach(b=>b.classList.toggle("activo",b.dataset.meses==="1"));
    E.mesesManual.hidden=true;
    E.mesesManual.value="1";
    E.campoProveedorManual.hidden=true;
    E.contrasena.type="password";
    E.verPass.textContent="Ver";
    actualizarFechas();
  }

  function limpiar(){
    resetearCampos();
    ultimoRegistro=null;
    E.resultado.hidden=true;
    E.form.hidden=false;
    E.resultadoDatos.innerHTML="";
    E.resultadoMomento.textContent="";
    E.mensajeCliente.value="";
    E.plataforma.focus();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  // Usamos escapes Unicode para que los emojis viajen correctamente a WhatsApp
  // incluso cuando el navegador o WhatsApp cambian la codificacion del texto.
  const ICONOS={
    portapapeles:"\u{1F4CB}", hola:"\u{1F44B}", ok:"\u{2705}", plataforma:"\u{1F3AC}",
    correo:"\u{1F4E7}", clave:"\u{1F511}", perfil:"\u{1F464}", pin:"\u{1F522}",
    tiempo:"\u{23F3}", calendario:"\u{1F4C5}", guardar:"\u{1F4E9}", gracias:"\u{1F499}"
  };

  function construirMensajeCliente(registro){
    const lineas=[
      `${ICONOS.portapapeles} DATOS DE TU SERVICIO ${String(registro.plataforma||"").toUpperCase()}`,
      "",
      `Hola ${registro.cliente} ${ICONOS.hola}`,
      "",
      `${ICONOS.ok} Tu servicio ha sido registrado correctamente.`,
      "",
      `${ICONOS.plataforma} Plataforma: ${registro.plataforma}`,
      `${ICONOS.correo} Usuario/Correo: ${registro.correoCuenta}`,
      `${ICONOS.clave} Contraseña: ${registro.contrasena}`,
      registro.perfil ? `${ICONOS.perfil} Perfil: ${registro.perfil}` : "",
      registro.pin ? `${ICONOS.pin} PIN: ${registro.pin}` : "",
      `${ICONOS.tiempo} Tiempo contratado: ${registro.meses} ${Number(registro.meses)===1?"mes":"meses"}`,
      `${ICONOS.calendario} Fecha de inicio: ${formatearFecha(registro.fechaInicio)}`,
      `${ICONOS.calendario} Fecha de vencimiento: ${formatearFecha(registro.fechaVencimiento)}`,
      "",
      `${ICONOS.guardar} Guarda estos datos para acceder a tu servicio.`,
      `${ICONOS.gracias} Gracias por tu compra en Mundo Digital 2.0.`
    ];
    return lineas.filter((linea,indice,arr)=>linea!=="" || (indice>0 && arr[indice-1]!=="")).join("\n").trim();
  }

  function mostrarConfirmacion(registro,respuesta){
    const r=respuesta||{};
    const momento=new Date();
    ultimoRegistro={
      cliente:r.cliente||registro.cliente,
      whatsapp:r.whatsapp||registro.whatsapp,
      plataforma:r.plataforma||registro.plataforma,
      correoCuenta:r.correoCuenta||registro.correoCuenta,
      contrasena:registro.contrasena,
      perfil:r.perfil||registro.perfil,
      pin:r.pin||registro.pin,
      proveedorNombre:r.proveedorNombre||registro.proveedorNombre||"Sin proveedor",
      meses:Number(r.meses||registro.meses||1),
      fechaInicio:r.fechaInicio||registro.fechaInicio,
      fechaVencimiento:r.fechaVencimiento||registro.fechaVencimiento,
      suscripcionId:r.suscripcionId||"",
      momento
    };

    E.resultadoMomento.textContent=`Confirmado el ${formatearMomento(momento)} · Solo aparece después de guardar correctamente.`;
    E.resultadoDatos.innerHTML=[
      `<span>👤 ${api.esc(ultimoRegistro.cliente)}</span>`,
      `<span>🎬 ${api.esc(ultimoRegistro.plataforma)}</span>`,
      `<span>📧 ${api.esc(ultimoRegistro.correoCuenta)}</span>`,
      ultimoRegistro.perfil?`<span>👤 Perfil: ${api.esc(ultimoRegistro.perfil)}</span>`:"",
      ultimoRegistro.pin?`<span>🔢 PIN: ${api.esc(ultimoRegistro.pin)}</span>`:"",
      `<span>⏳ ${api.esc(String(ultimoRegistro.meses))} ${ultimoRegistro.meses===1?"mes":"meses"}</span>`,
      `<span>📅 Inicio: ${api.esc(formatearFecha(ultimoRegistro.fechaInicio))}</span>`,
      `<span>📅 Vence: ${api.esc(formatearFecha(ultimoRegistro.fechaVencimiento))}</span>`,
      ultimoRegistro.suscripcionId?`<span>🆔 ${api.esc(ultimoRegistro.suscripcionId)}</span>`:""
    ].filter(Boolean).join("");

    E.mensajeCliente.value=construirMensajeCliente(ultimoRegistro);
    E.form.hidden=true;
    E.resultado.hidden=false;
    E.resultado.scrollIntoView({behavior:"smooth",block:"start"});
  }

  async function copiarMensaje(){
    const texto=E.mensajeCliente.value;
    if(!texto) return toast("No hay un mensaje listo para copiar.",true);
    try{
      await navigator.clipboard.writeText(texto);
      toast("Mensaje copiado. Ya puedes pegarlo donde quieras.");
    }catch(_){
      E.mensajeCliente.focus();
      E.mensajeCliente.select();
      const ok=document.execCommand("copy");
      window.getSelection()?.removeAllRanges();
      toast(ok?"Mensaje copiado.":"No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.",!ok);
    }
  }

  function abrirWhatsApp(){
    if(!ultimoRegistro) return toast("Primero guarda un registro express.",true);
    const tel=String(ultimoRegistro.whatsapp||"").replace(/\D/g,"");
    if(tel.length<8) return toast("El WhatsApp del cliente no es válido.",true);
    const texto=E.mensajeCliente.value||construirMensajeCliente(ultimoRegistro);
    window.open(`https://api.whatsapp.com/send?phone=${tel}&text=${encodeURIComponent(texto)}`,"_blank","noopener,noreferrer");
  }

  E.selectorMeses.addEventListener("click",e=>{
    const b=e.target.closest("button[data-meses]");
    if(!b) return;
    seleccionarMeses(b.dataset.meses,b);
  });

  E.mesesManual.addEventListener("input",()=>{
    meses=Math.max(1,Math.min(36,Number(E.mesesManual.value)||1));
    actualizarFechas();
  });

  E.proveedor.addEventListener("change",()=>{
    E.campoProveedorManual.hidden=E.proveedor.value!=="__OTRO__";
    if(!E.campoProveedorManual.hidden) E.proveedorManual.focus();
  });

  E.verPass.addEventListener("click",()=>{
    const mostrar=E.contrasena.type==="password";
    E.contrasena.type=mostrar?"text":"password";
    E.verPass.textContent=mostrar?"Ocultar":"Ver";
  });

  E.form.addEventListener("submit",async e=>{
    e.preventDefault();

    const tel=E.whatsapp.value.replace(/\D/g,"");
    if(tel.length<8) return toast("Escribe un WhatsApp válido con código de país.",true);

    const prov=proveedorSeleccionado();
    const n=Math.max(1,Math.min(36,Number(meses)||1));
    const registro={
      plataforma:E.plataforma.value.trim(),
      correoCuenta:E.correo.value.trim(),
      contrasena:E.contrasena.value,
      perfil:E.perfil.value.trim(),
      pin:E.pin.value.trim(),
      cliente:E.cliente.value.trim(),
      whatsapp:tel,
      proveedorId:prov.id,
      proveedorNombre:prov.nombre,
      meses:n,
      fechaInicio:E.inicio.value,
      fechaVencimiento:E.vence.value
    };

    E.guardar.disabled=true;
    const anterior=E.guardar.textContent;
    E.guardar.textContent="Guardando...";
    E.resultado.hidden=true;

    try{
      const d=await api.post("registrarExpressWebMD20",{registro});
      const r=d.registro||{};

      mostrarConfirmacion(registro,r);

      // Limpiamos los campos inmediatamente después de una confirmación real del servidor.
      // La tarjeta verde conserva únicamente una copia del registro confirmado para copiar/enviar al cliente.
      resetearCampos();
      toast("Registro express guardado correctamente.");
    }catch(x){
      console.error(x);
      E.resultado.hidden=true;
      E.form.hidden=false;
      toast(x.message||"No se pudo guardar el registro express.",true);
    }finally{
      E.guardar.disabled=false;
      E.guardar.textContent=anterior;
    }
  });

  E.copiarMensaje?.addEventListener("click",copiarMensaje);
  E.whatsappMensaje?.addEventListener("click",abrirWhatsApp);
  E.nuevo.addEventListener("click",limpiar);
  E.actualizar?.addEventListener("click",cargarProveedores);

  E.abrir?.addEventListener("click",()=>{
    E.menu?.classList.add("abierto");
    E.capa?.classList.add("visible");
  });
  E.cerrar?.addEventListener("click",()=>{
    E.menu?.classList.remove("abierto");
    E.capa?.classList.remove("visible");
  });
  E.capa?.addEventListener("click",()=>E.cerrar?.click());

  // Estado inicial inequívoco: formulario visible y confirmación oculta.
  E.resultado.hidden=true;
  E.form.hidden=false;
  actualizarFechas();
  cargarProveedores();
})();
