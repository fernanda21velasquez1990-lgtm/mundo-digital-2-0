(() => {
"use strict";

console.info("Mundo Digital 2.0 - Catálogo administrativo build 2026-07-30-IMG-002");

const cfg=window.MUNDO_DIGITAL_CONFIG||{};
const estado={
  productos:[],
  categorias:[],
  editando:"",
  texto:"",
  categoria:"TODAS",
  publicacion:"TODOS",
  disponibilidad:"TODAS"
};

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];

const E={
  menu:$("#menuLateral"),
  capa:$("#capaOscura"),
  abrirMenu:$("#botonAbrirMenu"),
  cerrarMenu:$("#botonCerrarMenu"),
  salir:$("#botonCerrarSesion"),
  actualizar:$("#botonActualizar"),
  nuevo:$("#botonNuevoProducto"),
  modal:$("#modalCatalogo"),
  cerrarModal:$("#botonCerrarModal"),
  cancelar:$("#botonCancelar"),
  formulario:$("#formularioCatalogo"),
  tituloModal:$("#tituloModal"),
  guardar:$("#botonGuardar"),
  rejilla:$("#rejillaCatalogo"),
  cargando:$("#cargandoCatalogo"),
  vacio:$("#estadoVacio"),
  buscar:$("#buscarCatalogo"),
  filtroCategoria:$("#filtroCategoria"),
  filtroPublicacion:$("#filtroPublicacion"),
  filtroDisponibilidad:$("#filtroDisponibilidad"),
  conexion:$("#estadoConexion"),
  puntoConexion:$("#puntoConexion"),
  mensaje:$("#mensajePanel"),
  kTotal:$("#kpiTotal"),
  kPublicados:$("#kpiPublicados"),
  kDestacados:$("#kpiDestacados"),
  kAgotados:$("#kpiAgotados"),
  vistaImagen:$("#vistaImagenCatalogo"),
  estadoVistaImagen:$("#estadoVistaImagenCatalogo")
};

const campos=[
  "nombre",
  "categoriaId",
  "estado",
  "tipoProducto",
  "tipoEntrega",
  "duracionDias",
  "controlarStock",
  "descripcionCorta",
  "descripcionCompleta",
  "imagenUrl",
  "slugProducto",
  "etiquetasPublicas",
  "precioPublico",
  "moneda",
  "precioAnterior",
  "oferta",
  "disponibilidad",
  "ordenCatalogo",
  "archivoId",
  "publicarCatalogo",
  "destacado",
  "vendeAdmin",
  "vendeRevendedor"
];

const C=campos.reduce((obj,id)=>(obj[id]=$("#"+id),obj),{});

function mensaje(texto,tipo="exito"){
  E.mensaje.textContent=texto;
  E.mensaje.className=`mensaje-flotante visible ${tipo}`;
  clearTimeout(mensaje.temporizador);
  mensaje.temporizador=setTimeout(()=>{
    E.mensaje.className="mensaje-flotante";
  },4200);
}

function validarConfiguracion(){
  if(!cfg.APPS_SCRIPT_URL){
    throw new Error("Falta APPS_SCRIPT_URL en js/configuracion.js.");
  }
  if(!cfg.API_KEY_SOCIOS){
    throw new Error("Falta API_KEY_SOCIOS en js/configuracion.js.");
  }
}

async function get(action,parametros={}){
  validarConfiguracion();
  const url=new URL(cfg.APPS_SCRIPT_URL);
  url.searchParams.set("action",action);
  url.searchParams.set("claveApi",cfg.API_KEY_SOCIOS);

  Object.entries(parametros).forEach(([clave,valor])=>{
    url.searchParams.set(clave,String(valor??""));
  });

  const respuesta=await fetch(url,{redirect:"follow"});
  const datos=await respuesta.json();

  if(!datos.ok){
    throw new Error(datos.mensaje||"No se pudo consultar Google Sheets.");
  }

  return datos;
}

async function post(contenido){
  validarConfiguracion();

  const respuesta=await fetch(cfg.APPS_SCRIPT_URL,{
    method:"POST",
    redirect:"follow",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({
      ...contenido,
      claveApi:cfg.API_KEY_SOCIOS
    })
  });

  const datos=await respuesta.json();

  if(!datos.ok){
    throw new Error(datos.mensaje||"No se pudo guardar en Google Sheets.");
  }

  return datos;
}

async function cargar(mostrarMensaje=false){
  E.cargando.hidden=false;
  E.vacio.hidden=true;
  E.rejilla.innerHTML="";

  try{
    const [productos,categorias]=await Promise.all([
      get("listarCatalogoAdminMD20"),
      get("listarCategorias")
    ]);

    estado.productos=productos.registros||[];
    estado.categorias=categorias.registros||[];

    llenarCategorias();
    renderizar();

    E.conexion.textContent="Google Sheets conectado";
    E.puntoConexion.className="punto-estado conectado";

    if(mostrarMensaje){
      mensaje("Catálogo actualizado correctamente.");
    }
  }catch(error){
    E.cargando.hidden=true;
    E.vacio.hidden=false;
    E.vacio.textContent=error.message;
    E.conexion.textContent="No se pudo conectar";
    E.puntoConexion.className="punto-estado error";
    mensaje(error.message,"error");
  }
}

function llenarCategorias(){
  const opciones=estado.categorias
    .map(c=>`<option value="${esc(c.id)}">${esc(c.nombre)}</option>`)
    .join("");

  const seleccionFormulario=C.categoriaId.value;
  const seleccionFiltro=E.filtroCategoria.value;

  C.categoriaId.innerHTML='<option value="">Selecciona una categoría</option>'+opciones;
  E.filtroCategoria.innerHTML='<option value="TODAS">Todas las categorías</option>'+opciones;

  if(seleccionFormulario)C.categoriaId.value=seleccionFormulario;
  if(seleccionFiltro)E.filtroCategoria.value=seleccionFiltro;
}

function productosFiltrados(){
  const texto=estado.texto.toLowerCase();

  return estado.productos.filter(producto=>{
    const coincideCategoria=
      estado.categoria==="TODAS"||
      producto.categoriaId===estado.categoria;

    const coincidePublicacion=
      estado.publicacion==="TODOS"||
      producto.publicarCatalogo===estado.publicacion;

    const coincideDisponibilidad=
      estado.disponibilidad==="TODAS"||
      producto.disponibilidad===estado.disponibilidad;

    const bolsa=[
      producto.nombre,
      producto.descripcionCorta,
      producto.descripcionCompleta,
      producto.categoriaNombre,
      producto.etiquetasPublicas,
      producto.tipoProducto,
      producto.tipoEntrega
    ].join(" ").toLowerCase();

    return coincideCategoria&&
      coincidePublicacion&&
      coincideDisponibilidad&&
      (!texto||bolsa.includes(texto));
  });
}

function renderizar(){
  const productos=productosFiltrados();

  E.cargando.hidden=true;
  E.vacio.hidden=productos.length>0;
  E.rejilla.innerHTML=productos.map(tarjetaProducto).join("");

  actualizarKpis();

  $$("[data-accion-catalogo]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      ejecutarAccion(
        boton.dataset.accionCatalogo,
        boton.dataset.productoId
      );
    });
  });

  $$("[data-imagen-producto]").forEach(imagen=>{
    const id=imagen.dataset.imagenProducto;
    const error=E.rejilla.querySelector(`[data-error-imagen="${CSS.escape(id)}"]`);

    imagen.addEventListener("load",()=>{
      imagen.classList.add("cargada");
      if(error)error.hidden=true;
    });

    imagen.addEventListener("error",()=>{
      imagen.hidden=true;
      if(error)error.hidden=false;
    });

    if(imagen.complete){
      if(imagen.naturalWidth>0){
        imagen.classList.add("cargada");
        if(error)error.hidden=true;
      }else{
        imagen.hidden=true;
        if(error)error.hidden=false;
      }
    }
  });
}


function normalizarUrlImagen(valor){
  const original=String(valor||"").trim();
  if(!original)return "";

  let url=original;

  // Google Drive: transforma un enlace compartido en una miniatura pública.
  const driveArchivo=url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if(driveArchivo){
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveArchivo[1])}&sz=w1600`;
  }

  const driveId=url.match(/[?&]id=([^&#]+)/i);
  if(/drive\.google\.com/i.test(url)&&driveId){
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId[1])}&sz=w1600`;
  }

  // Dropbox: fuerza la visualización directa.
  if(/dropbox\.com/i.test(url)){
    url=url.replace(/[?&]dl=0\b/i,"?raw=1");
    if(!/[?&]raw=1\b/i.test(url)){
      url+=(url.includes("?")?"&":"?")+"raw=1";
    }
  }

  // Asegura espacios y caracteres básicos válidos sin alterar URLs ya codificadas.
  try{
    return new URL(url).href;
  }catch{
    return encodeURI(url);
  }
}

function esPaginaPostimages(valor){
  const url=String(valor||"").trim();
  return /^https?:\/\/postimg\.cc\//i.test(url);
}

function textoAyudaImagen(valor){
  const url=String(valor||"").trim();

  if(!url){
    return "Agrega una URL pública para mostrar la imagen.";
  }

  if(esPaginaPostimages(url)){
    return "Ese es el enlace de la página de Postimages. Copia el enlace directo que comienza con https://i.postimg.cc/";
  }

  return "Comprobando imagen...";
}

function escaparUrlImagen(valor){
  return escAttr(normalizarUrlImagen(valor));
}

function tarjetaProducto(producto){
  const urlImagen=normalizarUrlImagen(producto.imagenUrl);
  const publicado=producto.publicarCatalogo==="SI";
  const precioAnterior=Number(producto.precioAnterior||0)>0
    ? `<span class="precio-anterior">${dinero(producto.precioAnterior)} ${esc(producto.moneda)}</span>`
    : "";

  const iconoPublicacion=publicado?"i-eye-off":"i-eye";
  const tituloPublicacion=publicado?"Retirar del catálogo":"Publicar en el catálogo";

  const contenidoImagen=urlImagen
    ? `
      <img
        class="imagen-producto-catalogo"
        src="${escaparUrlImagen(producto.imagenUrl)}"
        alt="Imagen de ${escAttr(producto.nombre)}"
        loading="lazy"
        referrerpolicy="no-referrer"
        data-imagen-producto="${escAttr(producto.id)}"
      >
      <div class="imagen-error-catalogo" data-error-imagen="${escAttr(producto.id)}" hidden>
        <svg><use href="#i-box"></use></svg>
        <span>No se pudo cargar la imagen</span>
      </div>
    `
    : `
      <div class="imagen-error-catalogo">
        <svg><use href="#i-box"></use></svg>
        <span>Producto sin imagen</span>
      </div>
    `;

  return `
    <article class="tarjeta-catalogo">
      <div class="imagen-catalogo">
        ${contenidoImagen}

        <div class="banda-publicacion">
          <span class="badge-catalogo ${publicado?"publicado":"oculto"}">
            ${publicado?"PUBLICADO":"SIN PUBLICAR"}
          </span>
          ${producto.destacado==="SI"?'<span class="badge-catalogo destacado">DESTACADO</span>':""}
          ${producto.oferta==="SI"?'<span class="badge-catalogo oferta">OFERTA</span>':""}
        </div>

        ${urlImagen?`
          <button
            type="button"
            class="boton-abrir-imagen"
            data-accion-catalogo="imagen"
            data-producto-id="${escAttr(producto.id)}"
            title="Abrir imagen original"
            aria-label="Abrir imagen original"
          >
            <svg><use href="#i-eye"></use></svg>
          </button>
        `:""}
      </div>

      <div class="cuerpo-tarjeta-catalogo">
        <div class="superior-tarjeta-catalogo">
          <div>
            <h3>${esc(producto.nombre)}</h3>
            <p>${esc(producto.categoriaNombre||producto.categoriaId)}</p>
          </div>
          <span class="estado-disponibilidad">${esc(formatearDisponibilidad(producto.disponibilidad))}</span>
        </div>

        <p class="descripcion-catalogo">
          ${esc(producto.descripcionCorta||"Sin descripción pública.")}
        </p>

        <div class="datos-venta-catalogo">
          <span>${esc(producto.tipoEntrega)}</span>
          <span>ADMIN: ${esc(producto.vendeAdmin)}</span>
          <span>REVENDEDOR: ${esc(producto.vendeRevendedor)}</span>
        </div>

        <div class="fila-precio">
          <div>
            <span class="precio-actual">${dinero(producto.precioPublico)} ${esc(producto.moneda)}</span>
            ${precioAnterior}
          </div>

          <div class="acciones-catalogo">
            ${producto.archivoId?`
              <button type="button" data-accion-catalogo="archivo" data-producto-id="${escAttr(producto.id)}" title="Abrir archivo privado">
                <svg><use href="#i-link"></use></svg>
              </button>
            `:""}
            <button type="button" data-accion-catalogo="publicar" data-producto-id="${escAttr(producto.id)}" title="${tituloPublicacion}">
              <svg><use href="#${iconoPublicacion}"></use></svg>
            </button>
            <button type="button" data-accion-catalogo="editar" data-producto-id="${escAttr(producto.id)}" title="Editar producto">
              <svg><use href="#i-edit"></use></svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}
function ejecutarAccion(accion,productoId){
  const producto=estado.productos.find(item=>item.id===productoId);
  if(!producto)return;

  if(accion==="editar"){
    abrirModal(producto);
    return;
  }

  if(accion==="archivo"){
    window.open(producto.archivoId,"_blank","noopener");
    return;
  }

  if(accion==="imagen"){
    const url=normalizarUrlImagen(producto.imagenUrl);
    if(url)window.open(url,"_blank","noopener");
    return;
  }

  if(accion==="publicar"){
    cambiarPublicacion(producto);
  }
}

async function cambiarPublicacion(producto){
  const publicar=producto.publicarCatalogo==="SI"?"NO":"SI";
  const texto=publicar==="SI"?"publicar":"retirar";

  if(!confirm(`¿Confirmas que deseas ${texto} "${producto.nombre}"?`)){
    return;
  }

  try{
    await post({
      action:"cambiarPublicacionCatalogoMD20",
      productoId:producto.id,
      publicar
    });

    mensaje(
      publicar==="SI"
        ?"Producto publicado correctamente."
        :"Producto retirado del catálogo."
    );

    await cargar();
  }catch(error){
    mensaje(error.message,"error");
  }
}

function abrirModal(producto=null){
  estado.editando=producto?.id||"";
  E.formulario.reset();

  C.estado.value="ACTIVO";
  C.tipoProducto.value="DIGITAL";
  C.tipoEntrega.value="ARCHIVO";
  C.duracionDias.value=0;
  C.controlarStock.value="NO";
  C.moneda.value="USD";
  C.precioAnterior.value=0;
  C.oferta.value="NO";
  C.disponibilidad.value="DISPONIBLE";
  C.ordenCatalogo.value=999;
  C.publicarCatalogo.value="NO";
  C.destacado.value="NO";
  C.vendeAdmin.value="SI";
  C.vendeRevendedor.value="SI";

  E.tituloModal.textContent=producto?"Editar producto":"Nuevo producto";

  if(producto){
    campos.forEach(campo=>{
      if(producto[campo]!=null){
        C[campo].value=producto[campo];
      }
    });
  }

  actualizarVistaImagen();

  E.modal.classList.add("visible");
  E.modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";

  setTimeout(()=>C.nombre.focus(),80);
}

function cerrarModal(){
  E.modal.classList.remove("visible");
  E.modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
  estado.editando="";
}

function crearSlug(texto){
  return String(texto||"")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .slice(0,90);
}

function actualizarSlugAutomatico(){
  if(!estado.editando||!C.slugProducto.dataset.modificado){
    C.slugProducto.value=crearSlug(C.nombre.value);
  }
}

function actualizarVistaImagen(){
  const original=C.imagenUrl.value.trim();
  const url=normalizarUrlImagen(original);

  E.estadoVistaImagen.textContent=textoAyudaImagen(original);
  E.estadoVistaImagen.className="estado-vista-imagen";

  if(!url){
    E.vistaImagen.innerHTML='<svg><use href="#i-box"></use></svg>';
    E.vistaImagen.className="";
    return;
  }

  if(esPaginaPostimages(original)){
    E.vistaImagen.innerHTML='<svg><use href="#i-box"></use></svg>';
    E.vistaImagen.className="error";
    E.estadoVistaImagen.className="estado-vista-imagen error";
    return;
  }

  const imagen=document.createElement("img");
  imagen.alt="Vista previa del producto";
  imagen.referrerPolicy="no-referrer";
  imagen.src=url;

  imagen.addEventListener("load",()=>{
    E.vistaImagen.className="correcta";
    E.estadoVistaImagen.textContent="Imagen cargada correctamente.";
    E.estadoVistaImagen.className="estado-vista-imagen correcta";
  });

  imagen.addEventListener("error",()=>{
    E.vistaImagen.innerHTML='<svg><use href="#i-box"></use></svg>';
    E.vistaImagen.className="error";
    E.estadoVistaImagen.textContent="No se pudo cargar la imagen. Usa una URL pública y directa. En Postimages debe comenzar con https://i.postimg.cc/";
    E.estadoVistaImagen.className="estado-vista-imagen error";
  });

  E.vistaImagen.className="cargando";
  E.vistaImagen.replaceChildren(imagen);
}
async function guardar(evento){
  evento.preventDefault();

  const registro={id:estado.editando};

  campos.forEach(campo=>{
    registro[campo]=C[campo].value;
  });

  registro.descripcion=registro.descripcionCorta;
  registro.precioVenta=registro.precioPublico;

  if(!registro.nombre.trim()){
    return mensaje("El nombre es obligatorio.","error");
  }

  if(!registro.categoriaId){
    return mensaje("Selecciona una categoría.","error");
  }

  if(!registro.descripcionCorta.trim()){
    return mensaje("La descripción corta es obligatoria.","error");
  }

  if(registro.precioPublico===""){
    return mensaje("El precio público es obligatorio.","error");
  }

  if(registro.imagenUrl&&esPaginaPostimages(registro.imagenUrl)){
    return mensaje(
      "Usa el enlace directo de Postimages. Debe comenzar con https://i.postimg.cc/",
      "error"
    );
  }

  E.guardar.disabled=true;
  E.guardar.textContent="Guardando...";

  try{
    await post({
      action:"guardarCatalogoProductoMD20",
      registro
    });

    cerrarModal();
    mensaje(
      registro.publicarCatalogo==="SI"
        ?"Producto guardado y publicado."
        :"Producto guardado sin publicar."
    );
    await cargar();
  }catch(error){
    mensaje(error.message,"error");
  }finally{
    E.guardar.disabled=false;
    E.guardar.textContent="Guardar producto";
  }
}

function actualizarKpis(){
  E.kTotal.textContent=estado.productos.length;
  E.kPublicados.textContent=estado.productos.filter(p=>p.publicarCatalogo==="SI").length;
  E.kDestacados.textContent=estado.productos.filter(p=>p.destacado==="SI").length;
  E.kAgotados.textContent=estado.productos.filter(p=>p.disponibilidad==="AGOTADO").length;
}

function formatearDisponibilidad(valor){
  return String(valor||"DISPONIBLE").replaceAll("_"," ");
}

function dinero(valor){
  return Number(valor||0).toLocaleString("es-ES",{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });
}

function esc(valor){
  return String(valor??"").replace(/[&<>"']/g,caracter=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[caracter]));
}

function escAttr(valor){
  return esc(valor).replace(/`/g,"&#96;");
}

E.nuevo.addEventListener("click",()=>abrirModal());
E.cerrarModal.addEventListener("click",cerrarModal);
E.cancelar.addEventListener("click",cerrarModal);
E.formulario.addEventListener("submit",guardar);

E.modal.addEventListener("click",evento=>{
  if(evento.target===E.modal)cerrarModal();
});

E.buscar.addEventListener("input",()=>{
  estado.texto=E.buscar.value.trim();
  renderizar();
});

E.filtroCategoria.addEventListener("change",()=>{
  estado.categoria=E.filtroCategoria.value;
  renderizar();
});

E.filtroPublicacion.addEventListener("change",()=>{
  estado.publicacion=E.filtroPublicacion.value;
  renderizar();
});

E.filtroDisponibilidad.addEventListener("change",()=>{
  estado.disponibilidad=E.filtroDisponibilidad.value;
  renderizar();
});

E.actualizar.addEventListener("click",()=>cargar(true));

C.nombre.addEventListener("input",actualizarSlugAutomatico);
C.slugProducto.addEventListener("input",()=>{
  C.slugProducto.dataset.modificado="SI";
});
C.imagenUrl.addEventListener("input",actualizarVistaImagen);

E.abrirMenu.addEventListener("click",()=>{
  E.menu.classList.add("abierto");
  E.capa.classList.add("visible");
});

E.cerrarMenu.addEventListener("click",()=>{
  E.menu.classList.remove("abierto");
  E.capa.classList.remove("visible");
});

E.capa.addEventListener("click",()=>E.cerrarMenu.click());

E.salir.addEventListener("click",()=>{
  if(confirm("¿Cerrar sesión?")){
    location.href="index.html";
  }
});

$$("[data-pagina]").forEach(enlace=>{
  enlace.addEventListener("click",evento=>{
    evento.preventDefault();
    mensaje(`La sección ${enlace.dataset.pagina} se creará después.`,"informacion");
  });
});

document.addEventListener("keydown",evento=>{
  if(evento.key==="Escape"&&E.modal.classList.contains("visible")){
    cerrarModal();
  }
});

cargar();
})();
