(() => {
"use strict";

console.info("Mundo Digital 2.0 - Tienda pública build 2026-07-30-001");

const cfg=window.MD20_TIENDA_CONFIG||{};
const CLAVE_CARRITO="md20_tienda_carrito_v1";

const estado={
  productos:[],
  categorias:[],
  tienda:{
    nombreNegocio:"Mundo Digital 2.0",
    whatsapp:"",
    correo:"",
    moneda:"USD"
  },
  vendedor:"ADMIN",
  categoria:"TODAS",
  texto:"",
  orden:"RECOMENDADOS",
  detalleId:"",
  carrito:[]
};

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];

const E={
  nombreMarca:$("#nombreMarca"),
  nombrePie:$("#nombrePie"),
  nombreDerechos:$("#nombreDerechos"),
  navegacion:$("#navegacionTienda"),
  botonMenu:$("#botonMenu"),
  botonCarrito:$("#botonCarrito"),
  contadorCarrito:$("#contadorCarrito"),
  contadorFlotante:$("#contadorFlotante"),
  totalFlotante:$("#totalFlotante"),
  botonCarritoFlotante:$("#botonCarritoFlotante"),
  heroTotal:$("#heroTotalProductos"),
  heroDestacados:$("#heroDestacados"),
  destacados:$("#destacados"),
  rejillaDestacados:$("#rejillaDestacados"),
  destacadosAnterior:$("#destacadosAnterior"),
  destacadosSiguiente:$("#destacadosSiguiente"),
  botonVerDestacados:$("#botonVerDestacados"),
  buscar:$("#buscarTienda"),
  limpiarBusqueda:$("#limpiarBusqueda"),
  categorias:$("#listaCategorias"),
  orden:$("#ordenProductos"),
  tituloResultados:$("#tituloResultados"),
  textoResultados:$("#textoResultados"),
  cargando:$("#cargandoTienda"),
  error:$("#errorTienda"),
  textoError:$("#textoErrorTienda"),
  reintentar:$("#reintentarTienda"),
  vacio:$("#vacioTienda"),
  rejilla:$("#rejillaProductos"),
  capa:$("#capaModal"),
  modalProducto:$("#modalProducto"),
  cerrarDetalle:$("#cerrarDetalle"),
  detalleImagen:$("#detalleImagen"),
  detalleImagenError:$("#detalleImagenError"),
  detalleBadges:$("#detalleBadges"),
  detalleCategoria:$("#detalleCategoria"),
  detalleNombre:$("#detalleNombre"),
  detalleDescripcion:$("#detalleDescripcion"),
  detalleEtiquetas:$("#detalleEtiquetas"),
  detalleEntrega:$("#detalleEntrega"),
  detalleDisponibilidad:$("#detalleDisponibilidad"),
  detalleDuracionCaja:$("#detalleDuracionCaja"),
  detalleDuracion:$("#detalleDuracion"),
  detallePrecioAnterior:$("#detallePrecioAnterior"),
  detallePrecio:$("#detallePrecio"),
  agregarDetalle:$("#agregarDesdeDetalle"),
  comprarDetalle:$("#comprarDesdeDetalle"),
  panelCarrito:$("#panelCarrito"),
  cerrarCarrito:$("#cerrarCarrito"),
  carritoVacio:$("#carritoVacio"),
  contenidoCarrito:$("#contenidoCarrito"),
  listaCarrito:$("#listaCarrito"),
  cantidadResumen:$("#cantidadResumen"),
  totalCarrito:$("#totalCarrito"),
  seguirComprando:$("#seguirComprando"),
  enviarWhatsApp:$("#enviarPedidoWhatsApp"),
  vaciarCarrito:$("#vaciarCarrito"),
  contactarWhatsAppPie:$("#contactarWhatsAppPie"),
  correoTienda:$("#correoTienda"),
  mensaje:$("#mensajeTienda")
};

function escapar(valor){
  return String(valor??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function normalizarUrlImagen(valor){
  const original=String(valor||"").trim();
  if(!original)return "";

  const archivoDrive=original.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);
  if(archivoDrive){
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(archivoDrive[1])}&sz=w1600`;
  }

  const idDrive=original.match(/[?&]id=([^&#]+)/i);
  if(/drive\.google\.com/i.test(original)&&idDrive){
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(idDrive[1])}&sz=w1600`;
  }

  if(/dropbox\.com/i.test(original)){
    let url=original.replace(/[?&]dl=0\b/i,"?raw=1");
    if(!/[?&]raw=1\b/i.test(url)){
      url+=(url.includes("?")?"&":"?")+"raw=1";
    }
    return url;
  }

  try{
    return new URL(original).href;
  }catch{
    return encodeURI(original);
  }
}

function dinero(valor,moneda){
  const numero=Number(valor||0);
  return `${new Intl.NumberFormat("es-ES",{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  }).format(numero)} ${moneda||estado.tienda.moneda||"USD"}`;
}

function disponibilidadTexto(valor){
  const mapa={
    DISPONIBLE:"Disponible",
    POCOS_CUPOS:"Pocos cupos",
    AGOTADO:"Agotado",
    PROXIMAMENTE:"Próximamente"
  };
  return mapa[String(valor||"").toUpperCase()]||"Disponible";
}

function entregaTexto(valor){
  const mapa={
    ARCHIVO:"Archivo digital",
    CURSO:"Acceso a curso",
    CUENTA:"Cuenta digital",
    ACCESO:"Acceso digital",
    PERFIL:"Perfil digital",
    CANVA:"Acceso a Canva",
    ENLACE:"Enlace digital"
  };
  return mapa[String(valor||"").toUpperCase()]||"Entrega digital";
}

function sePuedeComprar(producto){
  return !["AGOTADO","PROXIMAMENTE"].includes(String(producto.disponibilidad||"").toUpperCase());
}

function mostrarMensaje(texto,tipo="exito"){
  E.mensaje.textContent=texto;
  E.mensaje.className=`mensaje-tienda visible ${tipo}`;
  clearTimeout(mostrarMensaje.timer);
  mostrarMensaje.timer=setTimeout(()=>{
    E.mensaje.className="mensaje-tienda";
  },3900);
}

function validarConfiguracion(){
  if(!cfg.APPS_SCRIPT_URL){
    throw new Error("Falta APPS_SCRIPT_URL en js/tienda-config.js.");
  }
}

function vendedorDesdeUrl(){
  const parametros=new URLSearchParams(location.search);
  return String(parametros.get("vendedor")||"ADMIN").trim()||"ADMIN";
}

async function consultarCatalogo(){
  validarConfiguracion();
  const url=new URL(cfg.APPS_SCRIPT_URL);
  url.searchParams.set("action","listarCatalogoPublicoMD20");
  url.searchParams.set("vendedor",estado.vendedor);

  const respuesta=await fetch(url,{redirect:"follow"});
  const datos=await respuesta.json();

  if(!datos.ok){
    throw new Error(datos.mensaje||"No se pudo cargar el catálogo.");
  }

  return datos;
}

async function cargarTienda(){
  estado.vendedor=vendedorDesdeUrl();

  E.cargando.hidden=false;
  E.error.hidden=true;
  E.vacio.hidden=true;
  E.rejilla.innerHTML="";

  try{
    const datos=await consultarCatalogo();

    estado.productos=Array.isArray(datos.registros)?datos.registros:[];
    estado.categorias=Array.isArray(datos.categorias)?datos.categorias:[];
    estado.tienda={...estado.tienda,...(datos.tienda||{})};

    aplicarMarca();
    restaurarCarrito();
    renderizarCategorias();
    renderizarDestacados();
    renderizarProductos();
    renderizarCarrito();

    E.cargando.hidden=true;
  }catch(error){
    console.error(error);
    E.cargando.hidden=true;
    E.error.hidden=false;
    E.textoError.textContent=error.message;
  }
}

function aplicarMarca(){
  const nombre=estado.tienda.nombreNegocio||"Mundo Digital 2.0";
  E.nombreMarca.textContent=nombre;
  E.nombrePie.textContent=nombre;
  E.nombreDerechos.textContent=nombre;
  document.title=`${nombre} | Tienda`;

  if(estado.tienda.correo){
    E.correoTienda.hidden=false;
    E.correoTienda.textContent=estado.tienda.correo;
    E.correoTienda.href=`mailto:${estado.tienda.correo}`;
  }else{
    E.correoTienda.hidden=true;
  }

  const colores=estado.tienda.colores||{};
  if(/^#[0-9a-f]{6}$/i.test(colores.principal||"")){
    document.documentElement.style.setProperty("--rojo",colores.principal);
  }
  if(/^#[0-9a-f]{6}$/i.test(colores.secundario||"")){
    document.documentElement.style.setProperty("--naranja",colores.secundario);
  }
}

function renderizarCategorias(){
  const botones=[
    `<button class="boton-categoria activo" type="button" data-categoria="TODAS">Todos <span>${estado.productos.length}</span></button>`,
    ...estado.categorias.map(categoria=>`
      <button class="boton-categoria" type="button" data-categoria="${escapar(categoria.id)}">
        ${escapar(categoria.nombre)}
        <span>${Number(categoria.cantidad||0)}</span>
      </button>
    `)
  ];

  E.categorias.innerHTML=botones.join("");

  $$("[data-categoria]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      estado.categoria=boton.dataset.categoria||"TODAS";
      $$("[data-categoria]").forEach(b=>b.classList.toggle("activo",b===boton));
      renderizarProductos();
      document.querySelector("#productos").scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
}

function productosFiltrados(){
  const texto=estado.texto.toLowerCase().trim();

  let productos=estado.productos.filter(producto=>{
    const coincideCategoria=
      estado.categoria==="TODAS"||
      producto.categoriaId===estado.categoria;

    const bolsa=[
      producto.nombre,
      producto.descripcionCorta,
      producto.descripcionCompleta,
      producto.categoriaNombre,
      producto.etiquetas,
      producto.tipoEntrega
    ].join(" ").toLowerCase();

    return coincideCategoria&&(!texto||bolsa.includes(texto));
  });

  productos=[...productos];

  if(estado.orden==="PRECIO_ASC"){
    productos.sort((a,b)=>Number(a.precio||0)-Number(b.precio||0));
  }else if(estado.orden==="PRECIO_DESC"){
    productos.sort((a,b)=>Number(b.precio||0)-Number(a.precio||0));
  }else if(estado.orden==="NOMBRE"){
    productos.sort((a,b)=>String(a.nombre).localeCompare(String(b.nombre),"es"));
  }else{
    productos.sort((a,b)=>
      (b.destacado==="SI")-(a.destacado==="SI")||
      Number(a.orden||999)-Number(b.orden||999)||
      String(a.nombre).localeCompare(String(b.nombre),"es")
    );
  }

  return productos;
}

function badgesProducto(producto){
  const badges=[];

  if(producto.destacado==="SI"){
    badges.push('<span class="badge-producto destacado">DESTACADO</span>');
  }
  if(producto.oferta==="SI"){
    badges.push('<span class="badge-producto oferta">OFERTA</span>');
  }
  if(producto.disponibilidad==="POCOS_CUPOS"){
    badges.push('<span class="badge-producto pocos">POCOS CUPOS</span>');
  }
  if(producto.disponibilidad==="AGOTADO"){
    badges.push('<span class="badge-producto agotado">AGOTADO</span>');
  }
  if(producto.disponibilidad==="PROXIMAMENTE"){
    badges.push('<span class="badge-producto agotado">PRÓXIMAMENTE</span>');
  }

  return badges.join("");
}

function tarjetaProducto(producto){
  const url=normalizarUrlImagen(producto.imagenUrl);
  const comprar=sePuedeComprar(producto);
  const anterior=Number(producto.precioAnterior||0)>Number(producto.precio||0)
    ? `<del>${dinero(producto.precioAnterior,producto.moneda)}</del>`
    : "";

  const duracion=Number(producto.duracionDias||0)>0
    ? `<span>${Number(producto.duracionDias)} días</span>`
    : "";

  return `
    <article class="tarjeta-producto">
      <div class="imagen-producto">
        ${url?`
          <img
            src="${escapar(url)}"
            alt="${escapar(producto.nombre)}"
            loading="lazy"
            referrerpolicy="no-referrer"
            data-imagen-tienda="${escapar(producto.id)}"
          >
        `:""}
        <div class="imagen-fallback" data-fallback-tienda="${escapar(producto.id)}" ${url?"hidden":""}>
          <svg><use href="#t-box"></use></svg>
          <span>Producto digital</span>
        </div>
        <div class="badges-producto">${badgesProducto(producto)}</div>
      </div>

      <div class="cuerpo-producto">
        <span class="categoria-producto">${escapar(producto.categoriaNombre||"Producto digital")}</span>
        <h3>${escapar(producto.nombre)}</h3>
        <p class="descripcion-producto">${escapar(producto.descripcionCorta||"Descubre todos los detalles de este producto digital.")}</p>

        <div class="meta-producto">
          <span>${escapar(entregaTexto(producto.tipoEntrega))}</span>
          <span>${escapar(disponibilidadTexto(producto.disponibilidad))}</span>
          ${duracion}
        </div>

        <div class="pie-producto">
          <div class="precio-producto">
            ${anterior}
            <strong>${dinero(producto.precio,producto.moneda)}</strong>
          </div>

          <div class="acciones-producto">
            <button class="boton-detalle" type="button" data-accion="detalle" data-id="${escapar(producto.id)}" aria-label="Ver detalles">
              <svg><use href="#t-eye"></use></svg>
            </button>
            <button class="boton-comprar" type="button" data-accion="comprar" data-id="${escapar(producto.id)}" ${comprar?"":"disabled"}>
              ${comprar?"Comprar ahora":disponibilidadTexto(producto.disponibilidad)}
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function conectarImagenes(contenedor){
  contenedor.querySelectorAll("[data-imagen-tienda]").forEach(imagen=>{
    const id=imagen.dataset.imagenTienda;
    const fallback=contenedor.querySelector(`[data-fallback-tienda="${CSS.escape(id)}"]`);

    const mostrarFallback=()=>{
      imagen.hidden=true;
      if(fallback)fallback.hidden=false;
    };

    imagen.addEventListener("error",mostrarFallback);

    if(imagen.complete&&imagen.naturalWidth===0){
      mostrarFallback();
    }
  });
}

function conectarAcciones(contenedor){
  contenedor.querySelectorAll("[data-accion]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      const accion=boton.dataset.accion;
      const id=boton.dataset.id;

      if(accion==="detalle"){
        abrirDetalle(id);
      }else if(accion==="comprar"){
        agregarAlCarrito(id);
        abrirCarrito();
      }
    });
  });
}

function renderizarProductos(){
  const productos=productosFiltrados();

  E.cargando.hidden=true;
  E.error.hidden=true;
  E.vacio.hidden=productos.length>0;
  E.rejilla.innerHTML=productos.map(tarjetaProducto).join("");

  const categoria=estado.categorias.find(c=>c.id===estado.categoria);
  E.tituloResultados.textContent=categoria?categoria.nombre:"Todos los productos";
  E.textoResultados.textContent=
    productos.length===1
      ?"1 producto encontrado"
      :`${productos.length} productos encontrados`;

  E.limpiarBusqueda.hidden=!estado.texto;

  conectarImagenes(E.rejilla);
  conectarAcciones(E.rejilla);

  E.heroTotal.textContent=estado.productos.length;
  const cantidadDestacados=estado.productos.filter(p=>p.destacado==="SI").length;
  E.heroDestacados.textContent=`${cantidadDestacados} ${cantidadDestacados===1?"destacado":"destacados"}`;
}

function renderizarDestacados(){
  let productos=estado.productos.filter(p=>p.destacado==="SI");

  if(!productos.length){
    productos=estado.productos.filter(p=>p.oferta==="SI").slice(0,6);
  }

  E.destacados.hidden=productos.length===0;
  E.rejillaDestacados.innerHTML=productos.map(tarjetaProducto).join("");

  conectarImagenes(E.rejillaDestacados);
  conectarAcciones(E.rejillaDestacados);
}

function productoPorId(id){
  return estado.productos.find(producto=>String(producto.id)===String(id));
}

function abrirCapa(){
  E.capa.hidden=false;
  document.body.classList.add("modal-abierto");
}

function cerrarCapaSiCorresponde(){
  if(E.modalProducto.hidden&&E.panelCarrito.hidden){
    E.capa.hidden=true;
    document.body.classList.remove("modal-abierto");
  }
}

function abrirDetalle(id){
  const producto=productoPorId(id);
  if(!producto)return;

  estado.detalleId=producto.id;

  const url=normalizarUrlImagen(producto.imagenUrl);
  E.detalleImagen.hidden=!url;
  E.detalleImagenError.hidden=Boolean(url);

  if(url){
    E.detalleImagen.src=url;
    E.detalleImagen.alt=producto.nombre;
    E.detalleImagen.onerror=()=>{
      E.detalleImagen.hidden=true;
      E.detalleImagenError.hidden=false;
    };
  }

  E.detalleBadges.innerHTML=badgesProducto(producto);
  E.detalleCategoria.textContent=producto.categoriaNombre||"Producto digital";
  E.detalleNombre.textContent=producto.nombre;
  E.detalleDescripcion.textContent=producto.descripcionCompleta||producto.descripcionCorta||"";
  E.detalleEntrega.textContent=entregaTexto(producto.tipoEntrega);
  E.detalleDisponibilidad.textContent=disponibilidadTexto(producto.disponibilidad);

  const etiquetas=String(producto.etiquetas||"")
    .split(",")
    .map(t=>t.trim())
    .filter(Boolean);

  E.detalleEtiquetas.innerHTML=etiquetas.map(t=>`<span>${escapar(t)}</span>`).join("");
  E.detalleEtiquetas.hidden=etiquetas.length===0;

  if(Number(producto.duracionDias||0)>0){
    E.detalleDuracionCaja.hidden=false;
    E.detalleDuracion.textContent=`${Number(producto.duracionDias)} días`;
  }else{
    E.detalleDuracionCaja.hidden=true;
  }

  if(Number(producto.precioAnterior||0)>Number(producto.precio||0)){
    E.detallePrecioAnterior.textContent=dinero(producto.precioAnterior,producto.moneda);
  }else{
    E.detallePrecioAnterior.textContent="";
  }

  E.detallePrecio.textContent=dinero(producto.precio,producto.moneda);

  const habilitado=sePuedeComprar(producto);
  E.agregarDetalle.disabled=!habilitado;
  E.comprarDetalle.disabled=!habilitado;
  E.comprarDetalle.textContent=habilitado?"Comprar ahora":disponibilidadTexto(producto.disponibilidad);

  E.modalProducto.hidden=false;
  abrirCapa();
}

function cerrarDetalle(){
  E.modalProducto.hidden=true;
  estado.detalleId="";
  cerrarCapaSiCorresponde();
}

function leerCarritoGuardado(){
  try{
    const valor=JSON.parse(localStorage.getItem(CLAVE_CARRITO)||"[]");
    return Array.isArray(valor)?valor.map(String):[];
  }catch{
    return [];
  }
}

function guardarCarrito(){
  localStorage.setItem(CLAVE_CARRITO,JSON.stringify(estado.carrito));
}

function restaurarCarrito(){
  const idsDisponibles=new Set(estado.productos.map(p=>String(p.id)));
  estado.carrito=leerCarritoGuardado().filter(id=>idsDisponibles.has(String(id)));
  guardarCarrito();
}

function agregarAlCarrito(id){
  const producto=productoPorId(id);
  if(!producto||!sePuedeComprar(producto))return;

  if(!estado.carrito.includes(String(id))){
    estado.carrito.push(String(id));
    guardarCarrito();
    renderizarCarrito();
    mostrarMensaje(`${producto.nombre} se agregó a tu pedido.`);
  }else{
    mostrarMensaje("Este producto ya está en tu pedido.");
  }
}

function eliminarDelCarrito(id){
  estado.carrito=estado.carrito.filter(productoId=>String(productoId)!==String(id));
  guardarCarrito();
  renderizarCarrito();
}

function productosCarrito(){
  return estado.carrito.map(productoPorId).filter(Boolean);
}

function totalPedido(){
  return productosCarrito().reduce((total,producto)=>total+Number(producto.precio||0),0);
}

function renderizarCarrito(){
  const productos=productosCarrito();
  const cantidad=productos.length;
  const total=totalPedido();
  const moneda=productos[0]?.moneda||estado.tienda.moneda||"USD";

  E.contadorCarrito.textContent=cantidad;
  E.contadorFlotante.textContent=cantidad;
  E.totalFlotante.textContent=dinero(total,moneda);
  E.botonCarritoFlotante.hidden=cantidad===0;
  E.carritoVacio.hidden=cantidad>0;
  E.contenidoCarrito.hidden=cantidad===0;
  E.cantidadResumen.textContent=cantidad;
  E.totalCarrito.textContent=dinero(total,moneda);

  E.listaCarrito.innerHTML=productos.map(producto=>{
    const url=normalizarUrlImagen(producto.imagenUrl);
    return `
      <article class="item-carrito">
        ${url
          ? `<img src="${escapar(url)}" alt="${escapar(producto.nombre)}" referrerpolicy="no-referrer">`
          : `<div class="mini-fallback"><svg><use href="#t-box"></use></svg></div>`
        }
        <div class="item-carrito-copy">
          <strong>${escapar(producto.nombre)}</strong>
          <span>${dinero(producto.precio,producto.moneda)}</span>
        </div>
        <button class="eliminar-carrito" type="button" data-eliminar="${escapar(producto.id)}" aria-label="Eliminar">
          <svg><use href="#t-trash"></use></svg>
        </button>
      </article>
    `;
  }).join("");

  E.listaCarrito.querySelectorAll("[data-eliminar]").forEach(boton=>{
    boton.addEventListener("click",()=>{
      eliminarDelCarrito(boton.dataset.eliminar);
    });
  });

  E.listaCarrito.querySelectorAll("img").forEach(imagen=>{
    imagen.addEventListener("error",()=>{
      const fallback=document.createElement("div");
      fallback.className="mini-fallback";
      fallback.innerHTML='<svg><use href="#t-box"></use></svg>';
      imagen.replaceWith(fallback);
    });
  });
}

function abrirCarrito(){
  E.panelCarrito.hidden=false;
  abrirCapa();
}

function cerrarCarrito(){
  E.panelCarrito.hidden=true;
  cerrarCapaSiCorresponde();
}

function construirMensajePedido(){
  const productos=productosCarrito();
  const moneda=productos[0]?.moneda||estado.tienda.moneda||"USD";
  const lineas=[
    `Hola, quiero realizar una compra en ${estado.tienda.nombreNegocio||"Mundo Digital 2.0"}.`,
    "",
    "Productos seleccionados:"
  ];

  productos.forEach((producto,indice)=>{
    lineas.push(
      `${indice+1}. ${producto.nombre} — ${dinero(producto.precio,producto.moneda)}`
    );
  });

  lineas.push(
    "",
    `Total estimado: ${dinero(totalPedido(),moneda)}`,
    "",
    `Referencia del vendedor: ${estado.vendedor}`,
    "",
    "¿Me indican las formas de pago disponibles?"
  );

  return lineas.join("\n");
}

function enviarPedidoWhatsApp(){
  const productos=productosCarrito();

  if(!productos.length){
    mostrarMensaje("Tu pedido está vacío.","error");
    return;
  }

  const numero=String(estado.tienda.whatsapp||"").replace(/\D/g,"");

  if(!numero){
    mostrarMensaje(
      "Falta configurar WHATSAPP_PRINCIPAL en la pestaña CONFIGURACION.",
      "error"
    );
    return;
  }

  const mensaje=construirMensajePedido();
  window.open(
    `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
    "_blank",
    "noopener"
  );
}

function contactarWhatsApp(){
  const numero=String(estado.tienda.whatsapp||"").replace(/\D/g,"");

  if(!numero){
    mostrarMensaje(
      "Falta configurar WHATSAPP_PRINCIPAL en la pestaña CONFIGURACION.",
      "error"
    );
    return;
  }

  const texto=`Hola, necesito información sobre los productos de ${estado.tienda.nombreNegocio||"Mundo Digital 2.0"}.`;
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`,"_blank","noopener");
}

function cerrarTodo(){
  E.modalProducto.hidden=true;
  E.panelCarrito.hidden=true;
  estado.detalleId="";
  E.capa.hidden=true;
  document.body.classList.remove("modal-abierto");
}

function conectarEventos(){
  E.botonMenu.addEventListener("click",()=>{
    E.navegacion.classList.toggle("abierta");
  });

  E.navegacion.querySelectorAll("a").forEach(enlace=>{
    enlace.addEventListener("click",()=>{
      E.navegacion.classList.remove("abierta");
    });
  });

  E.botonCarrito.addEventListener("click",abrirCarrito);
  E.botonCarritoFlotante.addEventListener("click",abrirCarrito);
  E.cerrarCarrito.addEventListener("click",cerrarCarrito);
  E.cerrarDetalle.addEventListener("click",cerrarDetalle);
  E.capa.addEventListener("click",cerrarTodo);

  E.buscar.addEventListener("input",()=>{
    estado.texto=E.buscar.value;
    renderizarProductos();
  });

  E.limpiarBusqueda.addEventListener("click",()=>{
    E.buscar.value="";
    estado.texto="";
    renderizarProductos();
    E.buscar.focus();
  });

  E.orden.addEventListener("change",()=>{
    estado.orden=E.orden.value;
    renderizarProductos();
  });

  E.reintentar.addEventListener("click",cargarTienda);

  E.destacadosAnterior.addEventListener("click",()=>{
    E.rejillaDestacados.scrollBy({left:-380,behavior:"smooth"});
  });

  E.destacadosSiguiente.addEventListener("click",()=>{
    E.rejillaDestacados.scrollBy({left:380,behavior:"smooth"});
  });

  E.botonVerDestacados.addEventListener("click",()=>{
    const destino=E.destacados.hidden?document.querySelector("#productos"):E.destacados;
    destino.scrollIntoView({behavior:"smooth",block:"start"});
  });

  E.agregarDetalle.addEventListener("click",()=>{
    agregarAlCarrito(estado.detalleId);
  });

  E.comprarDetalle.addEventListener("click",()=>{
    agregarAlCarrito(estado.detalleId);
    cerrarDetalle();
    abrirCarrito();
  });

  E.seguirComprando.addEventListener("click",()=>{
    cerrarCarrito();
    document.querySelector("#productos").scrollIntoView({behavior:"smooth"});
  });

  E.enviarWhatsApp.addEventListener("click",enviarPedidoWhatsApp);

  E.vaciarCarrito.addEventListener("click",()=>{
    estado.carrito=[];
    guardarCarrito();
    renderizarCarrito();
    mostrarMensaje("El pedido quedó vacío.");
  });

  E.contactarWhatsAppPie.addEventListener("click",contactarWhatsApp);

  document.addEventListener("keydown",evento=>{
    if(evento.key==="Escape"){
      cerrarTodo();
    }
  });
}

conectarEventos();
cargarTienda();
})();
