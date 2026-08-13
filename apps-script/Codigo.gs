/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — CONEXIÓN ESTABLE FASE 5
 * Mantiene las acciones/respuestas originales de Fase 5.
 * Solo fija la base real y sincroniza la clave usada por la web.
 * =========================================================
 */
const MD20_SPREADSHEET_ID_ESTABLE = '1FQyMHtJOnOomg1BPDZKUHxyMbyfjlkCOZJWvuL12zeY';
const MD20_API_KEY_ESTABLE = 'c6beff9d014d4e9d840f4d8f86a39680d18092ef5e1c4891abda044336002241';

function md20LibroEstable_() {
  return SpreadsheetApp.openById(MD20_SPREADSHEET_ID_ESTABLE);
}

/**
 * =========================================================
 * MUNDO DIGITAL 2.0
 * CREACIÓN COMPLETA DE LA BASE DE DATOS
 * =========================================================
 *
 * Este código crea:
 * - Todas las pestañas.
 * - Encabezados.
 * - Colores y formatos.
 * - Listas desplegables.
 * - Estados con colores.
 * - Configuración inicial.
 * - Roles y permisos.
 * - Categorías.
 * - Métodos de pago.
 * - Plantillas de WhatsApp.
 * - Reportes disponibles.
 * - Primer producto.
 *
 * Puede ejecutarse nuevamente sin duplicar
 * los registros iniciales.
 */


/**
 * FUNCIÓN PRINCIPAL
 *
 * Esta es la función que debes ejecutar.
 */
function crearBaseDeDatosMundoDigital20() {
  const libro = md20LibroEstable_();

  libro.toast(
    "Preparando pestañas y configuraciones...",
    "Mundo Digital 2.0",
    5
  );

  const estructura = obtenerEstructuraBase_();

  Object.keys(estructura).forEach((nombreHoja) => {
    const datosHoja = estructura[nombreHoja];

    let hoja = libro.getSheetByName(nombreHoja);

    if (!hoja) {
      hoja = libro.insertSheet(nombreHoja);
    }

    prepararHoja_(
      hoja,
      datosHoja.encabezados,
      datosHoja.color
    );
  });

  cargarConfiguracionInicial_(libro);
  cargarRolesIniciales_(libro);
  cargarCategoriasIniciales_(libro);
  cargarMetodosPagoIniciales_(libro);
  cargarListasIniciales_(libro);
  cargarPlantillasWhatsApp_(libro);
  cargarReportesIniciales_(libro);
  cargarProductoInicial_(libro);

  aplicarValidaciones_(libro);
  aplicarFormatosEspeciales_(libro);
  aplicarColoresDeEstado_(libro);

  ordenarPestanas_(
    libro,
    Object.keys(estructura)
  );

  eliminarHojaInicialVacia_(libro);

  SpreadsheetApp.flush();

  libro.setActiveSheet(
    libro.getSheetByName("CONFIGURACION")
  );

  SpreadsheetApp.getUi().alert(
    "Mundo Digital 2.0",
    "La base de datos fue creada correctamente.\n\n" +
    "Se prepararon todas las pestañas, listas, formatos, " +
    "categorías, métodos de pago y configuraciones iniciales.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}


/**
 * DEFINE TODAS LAS PESTAÑAS Y ENCABEZADOS
 */
function obtenerEstructuraBase_() {
  return {
    CONFIGURACION: {
      color: "#FF3D00",
      encabezados: [
        "CLAVE",
        "VALOR",
        "DESCRIPCION",
        "TIPO",
        "EDITABLE",
        "ACTUALIZADO_EN"
      ]
    },

    USUARIOS: {
      color: "#FF1744",
      encabezados: [
        "USUARIO_ID",
        "NOMBRE_COMPLETO",
        "USUARIO",
        "CORREO",
        "CLAVE_HASH",
        "ROL_ID",
        "TELEFONO",
        "ESTADO",
        "ULTIMO_ACCESO",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    ROLES_PERMISOS: {
      color: "#D50000",
      encabezados: [
        "ROL_ID",
        "NOMBRE",
        "DESCRIPCION",
        "PERMISOS_JSON",
        "ESTADO",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    CLIENTES: {
      color: "#FF6D00",
      encabezados: [
        "CLIENTE_ID",
        "NOMBRE_COMPLETO",
        "TELEFONO",
        "CODIGO_PAIS",
        "CORREO",
        "DOCUMENTO",
        "PAIS",
        "CIUDAD",
        "DIRECCION",
        "FECHA_NACIMIENTO",
        "ORIGEN_CLIENTE",
        "ETIQUETAS",
        "NOTAS",
        "TOTAL_COMPRAS",
        "ULTIMA_COMPRA",
        "ESTADO",
        "CREADO_POR",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    CATEGORIAS: {
      color: "#FF9100",
      encabezados: [
        "CATEGORIA_ID",
        "NOMBRE",
        "DESCRIPCION",
        "ICONO",
        "COLOR",
        "ORDEN",
        "ESTADO",
        "CREADO_EN"
      ]
    },

    PRODUCTOS: {
      color: "#FF6D00",
      encabezados: [
        "PRODUCTO_ID",
        "NOMBRE",
        "DESCRIPCION",
        "CATEGORIA_ID",
        "TIPO_PRODUCTO",
        "TIPO_ENTREGA",
        "PRECIO_COMPRA",
        "PRECIO_VENTA",
        "MONEDA",
        "DURACION_DIAS",
        "STOCK_MINIMO",
        "CONTROLAR_STOCK",
        "ARCHIVO_ID",
        "IMAGEN_URL",
        "ESTADO",
        "CREADO_POR",
        "CREADO_EN",
        "ACTUALIZADO_EN",
        "PUBLICAR_CATALOGO",
        "SLUG_PRODUCTO",
        "DESCRIPCION_CORTA",
        "DESCRIPCION_COMPLETA",
        "PRECIO_PUBLICO",
        "PRECIO_ANTERIOR",
        "OFERTA",
        "DESTACADO",
        "ORDEN_CATALOGO",
        "DISPONIBILIDAD",
        "ETIQUETAS_PUBLICAS",
        "VENDE_ADMIN",
        "VENDE_REVENDEDOR",
        "ACTUALIZADO_CATALOGO_EN"
      ]
    },

    PROVEEDORES: {
      color: "#FFAB00",
      encabezados: [
        "PROVEEDOR_ID",
        "NOMBRE",
        "CONTACTO",
        "TELEFONO",
        "CORREO",
        "PAIS",
        "TIPO_PRODUCTOS",
        "METODO_PAGO",
        "DATOS_PAGO",
        "NOTAS",
        "ESTADO",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    INVENTARIO: {
      color: "#FF8F00",
      encabezados: [
        "INVENTARIO_ID",
        "PRODUCTO_ID",
        "PROVEEDOR_ID",
        "TIPO_INVENTARIO",
        "DESCRIPCION",
        "CANTIDAD_INICIAL",
        "CANTIDAD_DISPONIBLE",
        "CANTIDAD_RESERVADA",
        "COSTO_UNITARIO",
        "MONEDA",
        "FECHA_COMPRA",
        "FECHA_VENCIMIENTO",
        "UBICACION",
        "ESTADO",
        "NOTAS",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    CUENTAS_DIGITALES: {
      color: "#FF6F00",
      encabezados: [
        "CUENTA_ID",
        "PRODUCTO_ID",
        "PROVEEDOR_ID",
        "PLATAFORMA",
        "TIPO_CUENTA",
        "USUARIO_CUENTA",
        "CONTRASENA_CUENTA",
        "CORREO_RECUPERACION",
        "TELEFONO_RECUPERACION",
        "PERFIL",
        "PIN",
        "PANTALLAS_TOTALES",
        "PANTALLAS_DISPONIBLES",
        "FECHA_COMPRA",
        "FECHA_VENCIMIENTO",
        "COSTO",
        "MONEDA",
        "ESTADO",
        "NOTAS",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    VENTAS: {
      color: "#FF3D00",
      encabezados: [
        "VENTA_ID",
        "NUMERO_VENTA",
        "CLIENTE_ID",
        "FECHA_VENTA",
        "SUBTOTAL",
        "DESCUENTO",
        "TOTAL",
        "MONEDA",
        "MONTO_PAGADO",
        "SALDO_PENDIENTE",
        "ESTADO_PAGO",
        "ESTADO_ENTREGA",
        "METODO_PAGO_PRINCIPAL",
        "VENDEDOR_ID",
        "CANAL_VENTA",
        "NOTAS",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    DETALLE_VENTAS: {
      color: "#FF5722",
      encabezados: [
        "DETALLE_ID",
        "VENTA_ID",
        "PRODUCTO_ID",
        "INVENTARIO_ID",
        "CUENTA_ID",
        "DESCRIPCION",
        "CANTIDAD",
        "PRECIO_UNITARIO",
        "DESCUENTO",
        "SUBTOTAL",
        "DURACION_DIAS",
        "FECHA_INICIO",
        "FECHA_VENCIMIENTO",
        "ESTADO"
      ]
    },

    PAGOS: {
      color: "#FF9800",
      encabezados: [
        "PAGO_ID",
        "VENTA_ID",
        "CLIENTE_ID",
        "FECHA_PAGO",
        "MONTO",
        "MONEDA",
        "METODO_PAGO_ID",
        "REFERENCIA",
        "BANCO_ORIGEN",
        "TITULAR",
        "COMPROBANTE_URL",
        "ESTADO",
        "CONFIRMADO_POR",
        "FECHA_CONFIRMACION",
        "NOTAS",
        "CREADO_EN"
      ]
    },

    ENTREGAS: {
      color: "#FF6D00",
      encabezados: [
        "ENTREGA_ID",
        "VENTA_ID",
        "DETALLE_ID",
        "CLIENTE_ID",
        "PRODUCTO_ID",
        "CUENTA_ID",
        "FECHA_ENTREGA",
        "TIPO_ENTREGA",
        "ARCHIVO_URL",
        "USUARIO_ENTREGADO",
        "CONTRASENA_ENTREGADA",
        "PERFIL_ENTREGADO",
        "PIN_ENTREGADO",
        "ENLACE_ENTREGADO",
        "MENSAJE_ENTREGA",
        "MEDIO_ENTREGA",
        "ENTREGADO_POR",
        "ESTADO",
        "NOTAS"
      ]
    },

    SUSCRIPCIONES: {
      color: "#FFAB00",
      encabezados: [
        "SUSCRIPCION_ID",
        "CLIENTE_ID",
        "VENTA_ID",
        "PRODUCTO_ID",
        "CUENTA_ID",
        "FECHA_INICIO",
        "FECHA_VENCIMIENTO",
        "DIAS_RESTANTES",
        "PRECIO_RENOVACION",
        "MONEDA",
        "RENOVACION_AUTOMATICA",
        "AVISO_ENVIADO",
        "ULTIMO_AVISO",
        "ESTADO",
        "NOTAS",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    RENOVACIONES: {
      color: "#FF8F00",
      encabezados: [
        "RENOVACION_ID",
        "SUSCRIPCION_ID",
        "CLIENTE_ID",
        "PRODUCTO_ID",
        "FECHA_RENOVACION",
        "FECHA_INICIO_ANTERIOR",
        "FECHA_VENCIMIENTO_ANTERIOR",
        "NUEVA_FECHA_INICIO",
        "NUEVA_FECHA_VENCIMIENTO",
        "MONTO",
        "MONEDA",
        "PAGO_ID",
        "ESTADO_PAGO",
        "RENOVADO_POR",
        "NOTAS",
        "CREADO_EN"
      ]
    },

    METODOS_PAGO: {
      color: "#FF6F00",
      encabezados: [
        "METODO_PAGO_ID",
        "NOMBRE",
        "TIPO",
        "MONEDA",
        "TITULAR",
        "DOCUMENTO",
        "BANCO",
        "NUMERO_CUENTA",
        "TELEFONO",
        "CORREO",
        "DATOS_ADICIONALES",
        "ESTADO",
        "ORDEN"
      ]
    },

    GASTOS: {
      color: "#E65100",
      encabezados: [
        "GASTO_ID",
        "FECHA",
        "CATEGORIA",
        "DESCRIPCION",
        "PROVEEDOR_ID",
        "MONTO",
        "MONEDA",
        "METODO_PAGO",
        "REFERENCIA",
        "COMPROBANTE_URL",
        "REGISTRADO_POR",
        "ESTADO",
        "NOTAS",
        "CREADO_EN"
      ]
    },

    ARCHIVOS: {
      color: "#FF9100",
      encabezados: [
        "ARCHIVO_ID",
        "NOMBRE",
        "TIPO_ARCHIVO",
        "PRODUCTO_ID",
        "DRIVE_FILE_ID",
        "DRIVE_URL",
        "NOMBRE_ORIGINAL",
        "TAMANO",
        "VERSION",
        "ES_PRINCIPAL",
        "ESTADO",
        "SUBIDO_POR",
        "SUBIDO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    PLANTILLAS_WHATSAPP: {
      color: "#FF6D00",
      encabezados: [
        "PLANTILLA_ID",
        "NOMBRE",
        "TIPO",
        "ASUNTO",
        "MENSAJE",
        "VARIABLES",
        "USAR_EMOJIS",
        "ESTADO",
        "CREADO_EN",
        "ACTUALIZADO_EN"
      ]
    },

    NOTIFICACIONES: {
      color: "#FF3D00",
      encabezados: [
        "NOTIFICACION_ID",
        "USUARIO_ID",
        "TIPO",
        "TITULO",
        "MENSAJE",
        "MODULO",
        "REGISTRO_ID",
        "PRIORIDAD",
        "LEIDA",
        "FECHA_CREACION",
        "FECHA_LECTURA",
        "ESTADO"
      ]
    },

    REPORTES: {
      color: "#FF1744",
      encabezados: [
        "REPORTE_ID",
        "NOMBRE",
        "DESCRIPCION",
        "MODULO",
        "TIPO_REPORTE",
        "FILTROS_JSON",
        "ULTIMA_EJECUCION",
        "ESTADO"
      ]
    },

    LISTAS: {
      color: "#FF9800",
      encabezados: [
        "LISTA_ID",
        "TIPO",
        "VALOR",
        "ETIQUETA",
        "ORDEN",
        "ESTADO"
      ]
    },

    LOGS: {
      color: "#D50000",
      encabezados: [
        "LOG_ID",
        "FECHA_HORA",
        "USUARIO_ID",
        "ACCION",
        "MODULO",
        "REGISTRO_ID",
        "DETALLE",
        "RESULTADO"
      ]
    }
  };
}


/**
 * PREPARA EL DISEÑO DE CADA PESTAÑA
 */
function prepararHoja_(hoja, encabezados, colorPestana) {
  const cantidadColumnas = encabezados.length;

  if (hoja.getMaxColumns() < cantidadColumnas) {
    hoja.insertColumnsAfter(
      hoja.getMaxColumns(),
      cantidadColumnas - hoja.getMaxColumns()
    );
  }

  if (hoja.getMaxRows() < 1000) {
    hoja.insertRowsAfter(
      hoja.getMaxRows(),
      1000 - hoja.getMaxRows()
    );
  }

  hoja
    .getRange(1, 1, 1, cantidadColumnas)
    .setValues([encabezados]);

  hoja.setFrozenRows(1);
  hoja.setHiddenGridlines(false);
  hoja.setTabColor(colorPestana);
  hoja.setRowHeight(1, 42);

  const encabezado = hoja.getRange(
    1,
    1,
    1,
    cantidadColumnas
  );

  encabezado
    .setBackground("#111114")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setFontFamily("Arial")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  const rangoDatos = hoja.getRange(
    2,
    1,
    hoja.getMaxRows() - 1,
    cantidadColumnas
  );

  rangoDatos
    .setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle");

  encabezados.forEach((encabezadoTexto, indice) => {
    const columna = indice + 1;
    let ancho = 135;

    if (
      encabezadoTexto.includes("DESCRIPCION") ||
      encabezadoTexto.includes("MENSAJE") ||
      encabezadoTexto.includes("NOTAS") ||
      encabezadoTexto.includes("DETALLE") ||
      encabezadoTexto.includes("PERMISOS")
    ) {
      ancho = 300;
    }

    if (
      encabezadoTexto.includes("URL") ||
      encabezadoTexto.includes("CORREO")
    ) {
      ancho = 230;
    }

    if (
      encabezadoTexto.includes("NOMBRE") ||
      encabezadoTexto.includes("TITULO")
    ) {
      ancho = 190;
    }

    if (
      encabezadoTexto.includes("FECHA") ||
      encabezadoTexto.includes("_EN") ||
      encabezadoTexto.includes("ULTIMO")
    ) {
      ancho = 155;
    }

    if (
      encabezadoTexto.includes("CONTRASENA") ||
      encabezadoTexto.includes("CLAVE_HASH")
    ) {
      ancho = 190;
    }

    hoja.setColumnWidth(columna, ancho);
  });
}


/**
 * CARGA LA CONFIGURACIÓN INICIAL
 */
function cargarConfiguracionInicial_(libro) {
  const hoja = libro.getSheetByName("CONFIGURACION");
  const ahora = new Date();

  const datos = [
    [
      "NOMBRE_NEGOCIO",
      "Mundo Digital 2.0",
      "Nombre principal mostrado en la plataforma",
      "TEXTO",
      "SI",
      ahora
    ],
    [
      "VERSION_SISTEMA",
      "1.0.0",
      "Versión actual de la plataforma",
      "TEXTO",
      "NO",
      ahora
    ],
    [
      "MONEDA_PRINCIPAL",
      "USD",
      "Moneda principal utilizada en las ventas",
      "LISTA",
      "SI",
      ahora
    ],
    [
      "MONEDAS_HABILITADAS",
      "USD,VES,COP",
      "Monedas permitidas en el sistema",
      "TEXTO",
      "SI",
      ahora
    ],
    [
      "COLOR_PRINCIPAL",
      "#FF1744",
      "Color rojo principal",
      "COLOR",
      "SI",
      ahora
    ],
    [
      "COLOR_SECUNDARIO",
      "#FF6D00",
      "Color naranja principal",
      "COLOR",
      "SI",
      ahora
    ],
    [
      "COLOR_FONDO",
      "#08080A",
      "Color negro principal",
      "COLOR",
      "SI",
      ahora
    ],
    [
      "WHATSAPP_PRINCIPAL",
      "",
      "Número principal de WhatsApp con código de país",
      "TELEFONO",
      "SI",
      ahora
    ],
    [
      "CORREO_NEGOCIO",
      "",
      "Correo principal del negocio",
      "CORREO",
      "SI",
      ahora
    ],
    [
      "DIAS_AVISO_VENCIMIENTO",
      "3",
      "Días de anticipación para avisar vencimientos",
      "NUMERO",
      "SI",
      ahora
    ],
    [
      "PERMITIR_PAGOS_PARCIALES",
      "SI",
      "Permite registrar abonos y pagos parciales",
      "BOOLEANO",
      "SI",
      ahora
    ],
    [
      "ENTREGA_AUTOMATICA",
      "NO",
      "Activar entrega automática después del pago",
      "BOOLEANO",
      "SI",
      ahora
    ],
    [
      "SPREADSHEET_ID",
      libro.getId(),
      "Identificador de esta base de datos",
      "SISTEMA",
      "NO",
      ahora
    ],
    [
      "URL_APPS_SCRIPT",
      "",
      "Dirección de la aplicación web de Apps Script",
      "URL",
      "NO",
      ahora
    ],
    [
      "URL_VERCEL",
      "",
      "Dirección pública de la plataforma",
      "URL",
      "SI",
      ahora
    ]
  ];

  datos.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA ROLES Y PERMISOS
 */
function cargarRolesIniciales_(libro) {
  const hoja = libro.getSheetByName("ROLES_PERMISOS");
  const ahora = new Date();

  const permisosAdministrador = {
    dashboard: true,
    clientes: true,
    productos: true,
    inventario: true,
    cuentas: true,
    ventas: true,
    pagos: true,
    entregas: true,
    suscripciones: true,
    renovaciones: true,
    reportes: true,
    usuarios: true,
    configuracion: true,
    logs: true
  };

  const permisosVendedor = {
    dashboard: true,
    clientes: true,
    productos: true,
    inventario: false,
    cuentas: false,
    ventas: true,
    pagos: true,
    entregas: true,
    suscripciones: true,
    renovaciones: true,
    reportes: false,
    usuarios: false,
    configuracion: false,
    logs: false
  };

  const permisosSoporte = {
    dashboard: true,
    clientes: true,
    productos: true,
    inventario: false,
    cuentas: true,
    ventas: false,
    pagos: false,
    entregas: true,
    suscripciones: true,
    renovaciones: false,
    reportes: false,
    usuarios: false,
    configuracion: false,
    logs: false
  };

  const roles = [
    [
      "ROL-ADMIN",
      "ADMINISTRADOR",
      "Acceso completo a toda la plataforma",
      JSON.stringify(permisosAdministrador),
      "ACTIVO",
      ahora,
      ahora
    ],
    [
      "ROL-VENDEDOR",
      "VENDEDOR",
      "Acceso a clientes, ventas, pagos y entregas",
      JSON.stringify(permisosVendedor),
      "ACTIVO",
      ahora,
      ahora
    ],
    [
      "ROL-SOPORTE",
      "SOPORTE",
      "Acceso a entregas, cuentas y suscripciones",
      JSON.stringify(permisosSoporte),
      "ACTIVO",
      ahora,
      ahora
    ]
  ];

  roles.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA LAS CATEGORÍAS
 */
function cargarCategoriasIniciales_(libro) {
  const hoja = libro.getSheetByName("CATEGORIAS");
  const ahora = new Date();

  const categorias = [
    [
      "CAT-AGENDA",
      "Agendas digitales",
      "Agendas y planificadores en formato PDF",
      "calendar",
      "#FF6D00",
      1,
      "ACTIVO",
      ahora
    ],
    [
      "CAT-CURSO",
      "Cursos digitales",
      "Cursos, talleres y capacitaciones",
      "graduation-cap",
      "#FF1744",
      2,
      "ACTIVO",
      ahora
    ],
    [
      "CAT-LIBRO",
      "Libros digitales",
      "Libros, guías y manuales en PDF",
      "book-open",
      "#FF9100",
      3,
      "ACTIVO",
      ahora
    ],
    [
      "CAT-STREAMING",
      "Streaming",
      "Pantallas, perfiles y cuentas de entretenimiento",
      "play",
      "#E50914",
      4,
      "ACTIVO",
      ahora
    ],
    [
      "CAT-PLATAFORMA",
      "Plataformas digitales",
      "Accesos a herramientas y plataformas",
      "monitor",
      "#FF3D00",
      5,
      "ACTIVO",
      ahora
    ],
    [
      "CAT-SERVICIO",
      "Servicios digitales",
      "Otros productos y servicios digitales",
      "sparkles",
      "#FFAB00",
      6,
      "ACTIVO",
      ahora
    ]
  ];

  categorias.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA LOS MÉTODOS DE PAGO
 */
function cargarMetodosPagoIniciales_(libro) {
  const hoja = libro.getSheetByName("METODOS_PAGO");

  const metodos = [
    [
      "MET-PAGO-MOVIL",
      "Pago móvil",
      "BANCO",
      "VES",
      "",
      "",
      "",
      "",
      "",
      "",
      "Requiere número de referencia",
      "ACTIVO",
      1
    ],
    [
      "MET-BINANCE",
      "Binance",
      "BILLETERA",
      "USD",
      "",
      "",
      "Binance",
      "",
      "",
      "",
      "Agregar correo, ID o Pay ID",
      "ACTIVO",
      2
    ],
    [
      "MET-PAYPAL",
      "PayPal",
      "BILLETERA",
      "USD",
      "",
      "",
      "PayPal",
      "",
      "",
      "",
      "Agregar correo principal de PayPal",
      "ACTIVO",
      3
    ],
    [
      "MET-TRANSFERENCIA",
      "Transferencia bancaria",
      "BANCO",
      "USD",
      "",
      "",
      "",
      "",
      "",
      "",
      "Agregar información bancaria",
      "ACTIVO",
      4
    ]
  ];

  metodos.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA LAS LISTAS DESPLEGABLES
 */
function cargarListasIniciales_(libro) {
  const hoja = libro.getSheetByName("LISTAS");

  const listas = [
    ["LST-EST-001", "ESTADO_GENERAL", "ACTIVO", "Activo", 1, "ACTIVO"],
    ["LST-EST-002", "ESTADO_GENERAL", "INACTIVO", "Inactivo", 2, "ACTIVO"],
    ["LST-EST-003", "ESTADO_GENERAL", "SUSPENDIDO", "Suspendido", 3, "ACTIVO"],

    ["LST-USU-001", "ROL_USUARIO", "ROL-ADMIN", "Administrador", 1, "ACTIVO"],
    ["LST-USU-002", "ROL_USUARIO", "ROL-VENDEDOR", "Vendedor", 2, "ACTIVO"],
    ["LST-USU-003", "ROL_USUARIO", "ROL-SOPORTE", "Soporte", 3, "ACTIVO"],

    ["LST-TIP-001", "TIPO_PRODUCTO", "DIGITAL", "Producto digital", 1, "ACTIVO"],
    ["LST-TIP-002", "TIPO_PRODUCTO", "SUSCRIPCION", "Suscripción", 2, "ACTIVO"],
    ["LST-TIP-003", "TIPO_PRODUCTO", "SERVICIO", "Servicio", 3, "ACTIVO"],

    ["LST-ENT-001", "TIPO_ENTREGA", "PDF", "Archivo PDF", 1, "ACTIVO"],
    ["LST-ENT-002", "TIPO_ENTREGA", "ARCHIVO", "Archivo digital", 2, "ACTIVO"],
    ["LST-ENT-003", "TIPO_ENTREGA", "ENLACE", "Enlace", 3, "ACTIVO"],
    ["LST-ENT-004", "TIPO_ENTREGA", "CREDENCIALES", "Usuario y contraseña", 4, "ACTIVO"],
    ["LST-ENT-005", "TIPO_ENTREGA", "PLATAFORMA", "Acceso a plataforma", 5, "ACTIVO"],

    ["LST-MON-001", "MONEDA", "USD", "Dólares", 1, "ACTIVO"],
    ["LST-MON-002", "MONEDA", "VES", "Bolívares", 2, "ACTIVO"],
    ["LST-MON-003", "MONEDA", "COP", "Pesos colombianos", 3, "ACTIVO"],

    ["LST-PAG-001", "ESTADO_PAGO", "PENDIENTE", "Pendiente", 1, "ACTIVO"],
    ["LST-PAG-002", "ESTADO_PAGO", "PARCIAL", "Pago parcial", 2, "ACTIVO"],
    ["LST-PAG-003", "ESTADO_PAGO", "PAGADO", "Pagado", 3, "ACTIVO"],
    ["LST-PAG-004", "ESTADO_PAGO", "RECHAZADO", "Rechazado", 4, "ACTIVO"],
    ["LST-PAG-005", "ESTADO_PAGO", "CANCELADO", "Cancelado", 5, "ACTIVO"],

    ["LST-ENV-001", "ESTADO_ENTREGA", "PENDIENTE", "Pendiente", 1, "ACTIVO"],
    ["LST-ENV-002", "ESTADO_ENTREGA", "PREPARANDO", "Preparando", 2, "ACTIVO"],
    ["LST-ENV-003", "ESTADO_ENTREGA", "ENTREGADO", "Entregado", 3, "ACTIVO"],
    ["LST-ENV-004", "ESTADO_ENTREGA", "CANCELADO", "Cancelado", 4, "ACTIVO"],

    ["LST-SUS-001", "ESTADO_SUSCRIPCION", "ACTIVA", "Activa", 1, "ACTIVO"],
    ["LST-SUS-002", "ESTADO_SUSCRIPCION", "POR_VENCER", "Por vencer", 2, "ACTIVO"],
    ["LST-SUS-003", "ESTADO_SUSCRIPCION", "VENCIDA", "Vencida", 3, "ACTIVO"],
    ["LST-SUS-004", "ESTADO_SUSCRIPCION", "SUSPENDIDA", "Suspendida", 4, "ACTIVO"],
    ["LST-SUS-005", "ESTADO_SUSCRIPCION", "CANCELADA", "Cancelada", 5, "ACTIVO"],

    ["LST-SINO-001", "SI_NO", "SI", "Sí", 1, "ACTIVO"],
    ["LST-SINO-002", "SI_NO", "NO", "No", 2, "ACTIVO"],

    ["LST-CAN-001", "CANAL_VENTA", "WHATSAPP", "WhatsApp", 1, "ACTIVO"],
    ["LST-CAN-002", "CANAL_VENTA", "INSTAGRAM", "Instagram", 2, "ACTIVO"],
    ["LST-CAN-003", "CANAL_VENTA", "FACEBOOK", "Facebook", 3, "ACTIVO"],
    ["LST-CAN-004", "CANAL_VENTA", "TELEGRAM", "Telegram", 4, "ACTIVO"],
    ["LST-CAN-005", "CANAL_VENTA", "PAGINA_WEB", "Página web", 5, "ACTIVO"],
    ["LST-CAN-006", "CANAL_VENTA", "OTRO", "Otro", 6, "ACTIVO"],

    ["LST-PRI-001", "PRIORIDAD", "BAJA", "Baja", 1, "ACTIVO"],
    ["LST-PRI-002", "PRIORIDAD", "MEDIA", "Media", 2, "ACTIVO"],
    ["LST-PRI-003", "PRIORIDAD", "ALTA", "Alta", 3, "ACTIVO"],
    ["LST-PRI-004", "PRIORIDAD", "URGENTE", "Urgente", 4, "ACTIVO"]
  ];

  listas.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA PLANTILLAS DE WHATSAPP
 */
function cargarPlantillasWhatsApp_(libro) {
  const hoja = libro.getSheetByName(
    "PLANTILLAS_WHATSAPP"
  );

  const ahora = new Date();

  const plantillas = [
    [
      "PLA-BIENVENIDA",
      "Bienvenida al cliente",
      "BIENVENIDA",
      "Bienvenido a Mundo Digital 2.0",
      "Hola {{NOMBRE_CLIENTE}}. Gracias por comunicarte con Mundo Digital 2.0. ¿En qué podemos ayudarte?",
      "{{NOMBRE_CLIENTE}}",
      "SI",
      "ACTIVO",
      ahora,
      ahora
    ],
    [
      "PLA-PAGO",
      "Pago recibido",
      "PAGO_CONFIRMADO",
      "Pago confirmado",
      "Hola {{NOMBRE_CLIENTE}}. Confirmamos tu pago de {{MONTO}} {{MONEDA}} correspondiente a la venta {{NUMERO_VENTA}}.",
      "{{NOMBRE_CLIENTE}}, {{MONTO}}, {{MONEDA}}, {{NUMERO_VENTA}}",
      "SI",
      "ACTIVO",
      ahora,
      ahora
    ],
    [
      "PLA-ENTREGA",
      "Entrega de producto",
      "ENTREGA",
      "Tu producto está listo",
      "Hola {{NOMBRE_CLIENTE}}. Tu producto {{PRODUCTO}} está listo. Aquí tienes la información de entrega: {{DETALLE_ENTREGA}}",
      "{{NOMBRE_CLIENTE}}, {{PRODUCTO}}, {{DETALLE_ENTREGA}}",
      "SI",
      "ACTIVO",
      ahora,
      ahora
    ],
    [
      "PLA-VENCIMIENTO",
      "Aviso de vencimiento",
      "VENCIMIENTO",
      "Tu servicio está por vencer",
      "Hola {{NOMBRE_CLIENTE}}. Tu servicio {{PRODUCTO}} vence el {{FECHA_VENCIMIENTO}}. Puedes renovarlo por {{PRECIO_RENOVACION}} {{MONEDA}}.",
      "{{NOMBRE_CLIENTE}}, {{PRODUCTO}}, {{FECHA_VENCIMIENTO}}, {{PRECIO_RENOVACION}}, {{MONEDA}}",
      "SI",
      "ACTIVO",
      ahora,
      ahora
    ],
    [
      "PLA-RENOVACION",
      "Renovación confirmada",
      "RENOVACION",
      "Servicio renovado",
      "Hola {{NOMBRE_CLIENTE}}. Tu servicio {{PRODUCTO}} fue renovado correctamente hasta el {{NUEVA_FECHA_VENCIMIENTO}}.",
      "{{NOMBRE_CLIENTE}}, {{PRODUCTO}}, {{NUEVA_FECHA_VENCIMIENTO}}",
      "SI",
      "ACTIVO",
      ahora,
      ahora
    ]
  ];

  plantillas.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA LOS REPORTES DISPONIBLES
 */
function cargarReportesIniciales_(libro) {
  const hoja = libro.getSheetByName("REPORTES");

  const reportes = [
    [
      "REP-VENTAS-DIA",
      "Ventas del día",
      "Resumen de ventas registradas durante el día",
      "VENTAS",
      "RESUMEN",
      "{}",
      "",
      "ACTIVO"
    ],
    [
      "REP-VENTAS-MES",
      "Ventas del mes",
      "Resumen mensual de ingresos y ventas",
      "VENTAS",
      "RESUMEN",
      "{}",
      "",
      "ACTIVO"
    ],
    [
      "REP-PRODUCTOS",
      "Productos más vendidos",
      "Clasificación de productos por cantidad vendida",
      "PRODUCTOS",
      "CLASIFICACION",
      "{}",
      "",
      "ACTIVO"
    ],
    [
      "REP-CLIENTES",
      "Clientes frecuentes",
      "Clientes con mayor número de compras",
      "CLIENTES",
      "CLASIFICACION",
      "{}",
      "",
      "ACTIVO"
    ],
    [
      "REP-PAGOS",
      "Ingresos por método de pago",
      "Totales recibidos por cada método de pago",
      "PAGOS",
      "RESUMEN",
      "{}",
      "",
      "ACTIVO"
    ],
    [
      "REP-VENCIMIENTOS",
      "Próximos vencimientos",
      "Suscripciones próximas a vencer",
      "SUSCRIPCIONES",
      "ALERTA",
      "{}",
      "",
      "ACTIVO"
    ],
    [
      "REP-GANANCIAS",
      "Ganancias y gastos",
      "Comparación entre ingresos, costos y gastos",
      "FINANZAS",
      "FINANCIERO",
      "{}",
      "",
      "ACTIVO"
    ]
  ];

  reportes.forEach((fila) => {
    insertarSiNoExiste_(
      hoja,
      1,
      fila[0],
      fila
    );
  });
}


/**
 * CARGA EL PRIMER PRODUCTO
 */
function cargarProductoInicial_(libro) {
  const hoja = libro.getSheetByName("PRODUCTOS");
  const ahora = new Date();

  const producto = [
    "PRO-000001",
    "Agenda para maestras 2026 - 2027",
    "Agenda en formato PDF para que la maestra lleve el registro de sus alumnos.",
    "CAT-AGENDA",
    "DIGITAL",
    "PDF",
    0,
    4,
    "USD",
    0,
    0,
    "NO",
    "",
    "",
    "ACTIVO",
    "SISTEMA",
    ahora,
    ahora
  ];

  insertarSiNoExiste_(
    hoja,
    1,
    producto[0],
    producto
  );
}


/**
 * EVITA DUPLICAR REGISTROS INICIALES
 */
function insertarSiNoExiste_(
  hoja,
  columnaClave,
  valorClave,
  fila
) {
  const ultimaFila = hoja.getLastRow();

  if (ultimaFila > 1) {
    const valores = hoja
      .getRange(
        2,
        columnaClave,
        ultimaFila - 1,
        1
      )
      .getDisplayValues()
      .flat()
      .map((valor) => String(valor).trim());

    if (valores.includes(String(valorClave).trim())) {
      return;
    }
  }

  hoja.appendRow(fila);
}


/**
 * APLICA LISTAS DESPLEGABLES
 */
function aplicarValidaciones_(libro) {
  aplicarValidacion_(
    libro,
    "USUARIOS",
    "ROL_ID",
    ["ROL-ADMIN", "ROL-VENDEDOR", "ROL-SOPORTE"]
  );

  aplicarValidacion_(
    libro,
    "USUARIOS",
    "ESTADO",
    ["ACTIVO", "INACTIVO", "SUSPENDIDO"]
  );

  aplicarValidacion_(
    libro,
    "CLIENTES",
    "ESTADO",
    ["ACTIVO", "INACTIVO"]
  );

  aplicarValidacion_(
    libro,
    "CATEGORIAS",
    "ESTADO",
    ["ACTIVO", "INACTIVO"]
  );

  aplicarValidacion_(
    libro,
    "PRODUCTOS",
    "TIPO_PRODUCTO",
    ["DIGITAL", "SUSCRIPCION", "SERVICIO"]
  );

  aplicarValidacion_(
    libro,
    "PRODUCTOS",
    "TIPO_ENTREGA",
    [
      "PDF",
      "ARCHIVO",
      "ENLACE",
      "CREDENCIALES",
      "PLATAFORMA"
    ]
  );

  aplicarValidacion_(
    libro,
    "PRODUCTOS",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "PRODUCTOS",
    "CONTROLAR_STOCK",
    ["SI", "NO"]
  );

  aplicarValidacion_(
    libro,
    "PRODUCTOS",
    "ESTADO",
    ["ACTIVO", "INACTIVO"]
  );

  aplicarValidacion_(
    libro,
    "INVENTARIO",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "INVENTARIO",
    "ESTADO",
    [
      "DISPONIBLE",
      "RESERVADO",
      "AGOTADO",
      "VENCIDO",
      "INACTIVO"
    ]
  );

  aplicarValidacion_(
    libro,
    "CUENTAS_DIGITALES",
    "TIPO_CUENTA",
    [
      "CUENTA_COMPLETA",
      "PANTALLA",
      "PERFIL",
      "ACCESO"
    ]
  );

  aplicarValidacion_(
    libro,
    "CUENTAS_DIGITALES",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "CUENTAS_DIGITALES",
    "ESTADO",
    [
      "DISPONIBLE",
      "ASIGNADA",
      "POR_VENCER",
      "VENCIDA",
      "SUSPENDIDA",
      "INACTIVA"
    ]
  );

  aplicarValidacion_(
    libro,
    "VENTAS",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "VENTAS",
    "ESTADO_PAGO",
    [
      "PENDIENTE",
      "PARCIAL",
      "PAGADO",
      "RECHAZADO",
      "CANCELADO"
    ]
  );

  aplicarValidacion_(
    libro,
    "VENTAS",
    "ESTADO_ENTREGA",
    [
      "PENDIENTE",
      "PREPARANDO",
      "ENTREGADO",
      "CANCELADO"
    ]
  );

  aplicarValidacion_(
    libro,
    "VENTAS",
    "CANAL_VENTA",
    [
      "WHATSAPP",
      "INSTAGRAM",
      "FACEBOOK",
      "TELEGRAM",
      "PAGINA_WEB",
      "OTRO"
    ]
  );

  aplicarValidacion_(
    libro,
    "PAGOS",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "PAGOS",
    "ESTADO",
    [
      "PENDIENTE",
      "CONFIRMADO",
      "RECHAZADO",
      "ANULADO"
    ]
  );

  aplicarValidacion_(
    libro,
    "ENTREGAS",
    "TIPO_ENTREGA",
    [
      "PDF",
      "ARCHIVO",
      "ENLACE",
      "CREDENCIALES",
      "PLATAFORMA"
    ]
  );

  aplicarValidacion_(
    libro,
    "ENTREGAS",
    "MEDIO_ENTREGA",
    [
      "WHATSAPP",
      "CORREO",
      "TELEGRAM",
      "PAGINA_WEB",
      "OTRO"
    ]
  );

  aplicarValidacion_(
    libro,
    "ENTREGAS",
    "ESTADO",
    [
      "PENDIENTE",
      "ENTREGADO",
      "FALLIDO",
      "CANCELADO"
    ]
  );

  aplicarValidacion_(
    libro,
    "SUSCRIPCIONES",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "SUSCRIPCIONES",
    "RENOVACION_AUTOMATICA",
    ["SI", "NO"]
  );

  aplicarValidacion_(
    libro,
    "SUSCRIPCIONES",
    "AVISO_ENVIADO",
    ["SI", "NO"]
  );

  aplicarValidacion_(
    libro,
    "SUSCRIPCIONES",
    "ESTADO",
    [
      "ACTIVA",
      "POR_VENCER",
      "VENCIDA",
      "SUSPENDIDA",
      "CANCELADA"
    ]
  );

  aplicarValidacion_(
    libro,
    "RENOVACIONES",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "RENOVACIONES",
    "ESTADO_PAGO",
    [
      "PENDIENTE",
      "PARCIAL",
      "PAGADO",
      "RECHAZADO"
    ]
  );

  aplicarValidacion_(
    libro,
    "GASTOS",
    "MONEDA",
    ["USD", "VES", "COP"]
  );

  aplicarValidacion_(
    libro,
    "GASTOS",
    "ESTADO",
    [
      "PENDIENTE",
      "PAGADO",
      "ANULADO"
    ]
  );

  aplicarValidacion_(
    libro,
    "ARCHIVOS",
    "ES_PRINCIPAL",
    ["SI", "NO"]
  );

  aplicarValidacion_(
    libro,
    "ARCHIVOS",
    "ESTADO",
    ["ACTIVO", "INACTIVO", "ELIMINADO"]
  );

  aplicarValidacion_(
    libro,
    "PLANTILLAS_WHATSAPP",
    "USAR_EMOJIS",
    ["SI", "NO"]
  );

  aplicarValidacion_(
    libro,
    "PLANTILLAS_WHATSAPP",
    "ESTADO",
    ["ACTIVO", "INACTIVO"]
  );

  aplicarValidacion_(
    libro,
    "NOTIFICACIONES",
    "PRIORIDAD",
    ["BAJA", "MEDIA", "ALTA", "URGENTE"]
  );

  aplicarValidacion_(
    libro,
    "NOTIFICACIONES",
    "LEIDA",
    ["SI", "NO"]
  );

  aplicarValidacion_(
    libro,
    "NOTIFICACIONES",
    "ESTADO",
    ["ACTIVA", "ARCHIVADA", "ELIMINADA"]
  );
}


/**
 * CREA UNA LISTA DESPLEGABLE EN UNA COLUMNA
 */
function aplicarValidacion_(
  libro,
  nombreHoja,
  nombreColumna,
  valores
) {
  const hoja = libro.getSheetByName(nombreHoja);

  if (!hoja) {
    return;
  }

  const encabezados = hoja
    .getRange(1, 1, 1, hoja.getLastColumn())
    .getDisplayValues()[0];

  const indice = encabezados.indexOf(nombreColumna);

  if (indice === -1) {
    return;
  }

  const regla = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(valores, true)
    .setAllowInvalid(false)
    .setHelpText(
      "Selecciona una opción de la lista."
    )
    .build();

  hoja
    .getRange(
      2,
      indice + 1,
      hoja.getMaxRows() - 1,
      1
    )
    .setDataValidation(regla);
}


/**
 * APLICA FORMATOS DE FECHA, NÚMERO Y DINERO
 */
function aplicarFormatosEspeciales_(libro) {
  libro.getSheets().forEach((hoja) => {
    const ultimaColumna = hoja.getLastColumn();

    if (ultimaColumna === 0) {
      return;
    }

    const encabezados = hoja
      .getRange(1, 1, 1, ultimaColumna)
      .getDisplayValues()[0];

    encabezados.forEach((texto, indice) => {
      const columna = indice + 1;

      const rango = hoja.getRange(
        2,
        columna,
        hoja.getMaxRows() - 1,
        1
      );

      const nombre = String(texto).toUpperCase();

      if (
        nombre.includes("FECHA") ||
        nombre.endsWith("_EN") ||
        nombre.includes("ULTIMO_ACCESO") ||
        nombre.includes("ULTIMA_COMPRA") ||
        nombre.includes("ULTIMO_AVISO")
      ) {
        rango.setNumberFormat(
          "dd/MM/yyyy HH:mm:ss"
        );
      }

      if (
        nombre.includes("PRECIO") ||
        nombre.includes("MONTO") ||
        nombre.includes("TOTAL") ||
        nombre.includes("SUBTOTAL") ||
        nombre.includes("DESCUENTO") ||
        nombre.includes("COSTO") ||
        nombre.includes("SALDO")
      ) {
        rango.setNumberFormat("0.00");
      }

      if (
        nombre.includes("CANTIDAD") ||
        nombre.includes("ORDEN") ||
        nombre.includes("DURACION_DIAS") ||
        nombre.includes("DIAS_RESTANTES") ||
        nombre.includes("PANTALLAS")
      ) {
        rango.setNumberFormat("0");
      }
    });
  });
}


/**
 * COLOREA AUTOMÁTICAMENTE LOS ESTADOS
 */
function aplicarColoresDeEstado_(libro) {
  const estadosVerdes = [
    "ACTIVO",
    "ACTIVA",
    "PAGADO",
    "CONFIRMADO",
    "ENTREGADO",
    "DISPONIBLE",
    "LISTO"
  ];

  const estadosNaranjas = [
    "PENDIENTE",
    "PARCIAL",
    "PREPARANDO",
    "POR_VENCER",
    "RESERVADO"
  ];

  const estadosRojos = [
    "INACTIVO",
    "INACTIVA",
    "VENCIDO",
    "VENCIDA",
    "RECHAZADO",
    "CANCELADO",
    "CANCELADA",
    "SUSPENDIDO",
    "SUSPENDIDA",
    "AGOTADO",
    "FALLIDO",
    "ANULADO"
  ];

  libro.getSheets().forEach((hoja) => {
    const ultimaColumna = hoja.getLastColumn();

    if (ultimaColumna === 0) {
      return;
    }

    const encabezados = hoja
      .getRange(1, 1, 1, ultimaColumna)
      .getDisplayValues()[0];

    const rangosEstado = [];

    encabezados.forEach((encabezado, indice) => {
      const nombre = String(encabezado).toUpperCase();

      if (
        nombre === "ESTADO" ||
        nombre === "ESTADO_PAGO" ||
        nombre === "ESTADO_ENTREGA" ||
        nombre === "RESULTADO"
      ) {
        rangosEstado.push(
          hoja.getRange(
            2,
            indice + 1,
            hoja.getMaxRows() - 1,
            1
          )
        );
      }
    });

    hoja.setConditionalFormatRules([]);

    if (rangosEstado.length === 0) {
      return;
    }

    const reglas = [];

    estadosVerdes.forEach((estado) => {
      reglas.push(
        SpreadsheetApp
          .newConditionalFormatRule()
          .whenTextEqualTo(estado)
          .setBackground("#123D2A")
          .setFontColor("#9EF0BD")
          .setBold(true)
          .setRanges(rangosEstado)
          .build()
      );
    });

    estadosNaranjas.forEach((estado) => {
      reglas.push(
        SpreadsheetApp
          .newConditionalFormatRule()
          .whenTextEqualTo(estado)
          .setBackground("#4A2D08")
          .setFontColor("#FFD08A")
          .setBold(true)
          .setRanges(rangosEstado)
          .build()
      );
    });

    estadosRojos.forEach((estado) => {
      reglas.push(
        SpreadsheetApp
          .newConditionalFormatRule()
          .whenTextEqualTo(estado)
          .setBackground("#4A1418")
          .setFontColor("#FFADB3")
          .setBold(true)
          .setRanges(rangosEstado)
          .build()
      );
    });

    hoja.setConditionalFormatRules(reglas);
  });
}


/**
 * ORDENA LAS PESTAÑAS
 */
function ordenarPestanas_(libro, nombres) {
  nombres.forEach((nombre, indice) => {
    const hoja = libro.getSheetByName(nombre);

    if (!hoja) {
      return;
    }

    libro.setActiveSheet(hoja);
    libro.moveActiveSheet(indice + 1);
  });
}


/**
 * ELIMINA LA HOJA VACÍA CREADA POR GOOGLE
 */
function eliminarHojaInicialVacia_(libro) {
  const nombresPosibles = [
    "Hoja 1",
    "Hoja1",
    "Sheet1",
    "Página1"
  ];

  nombresPosibles.forEach((nombre) => {
    const hoja = libro.getSheetByName(nombre);

    if (!hoja) {
      return;
    }

    const valorInicial = hoja
      .getRange("A1")
      .getDisplayValue()
      .trim();

    if (
      valorInicial === "" &&
      libro.getSheets().length > 1
    ) {
      libro.deleteSheet(hoja);
    }
  });
}
function mostrarLineasYBordesMundoDigital20() {
  const libro = md20LibroEstable_();
  const hojas = libro.getSheets();

  hojas.forEach((hoja) => {
    // Mostrar líneas de cuadrícula
    hoja.setHiddenGridlines(false);

    const ultimaFila = Math.max(hoja.getLastRow(), 30);
    const ultimaColumna = Math.max(hoja.getLastColumn(), 8);

    // Área que tendrá bordes
    const rango = hoja.getRange(1, 1, ultimaFila, ultimaColumna);

    // Quitar bordes anteriores
    rango.setBorder(false, false, false, false, false, false);

    // Bordes en toda el área
    rango.setBorder(
      true,   // arriba
      true,   // izquierda
      true,   // abajo
      true,   // derecha
      true,   // verticales internas
      true,   // horizontales internas
      "#2A2A2A",
      SpreadsheetApp.BorderStyle.SOLID
    );

    // Encabezado más marcado
    hoja.getRange(1, 1, 1, ultimaColumna).setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "#000000",
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );
  });

  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    "Listo",
    "Ya se mostraron las líneas y se aplicaron bordes en todas las pestañas.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
/**
 * =========================================================
 * MUNDO DIGITAL 2.0
 * DISEÑO PROFESIONAL DE GOOGLE SHEETS
 * =========================================================
 *
 * Esta función:
 * - No elimina los registros existentes.
 * - Crea una portada profesional.
 * - Muestra líneas de cuadrícula.
 * - Aplica bordes y filas alternadas.
 * - Ajusta columnas y formatos.
 * - Crea filtros.
 * - Mejora la lectura de todas las pestañas.
 */


/**
 * FUNCIÓN PRINCIPAL
 *
 * Ejecuta solamente esta función.
 */
function mejorarDisenoProfesionalMundoDigital20() {
  const libro = md20LibroEstable_();

  const colores = {
    negro: "#101014",
    negroFondo: "#08080A",
    rojo: "#FF1744",
    naranja: "#FF6D00",
    naranjaClaro: "#FFF3EB",
    grisClaro: "#F4F4F6",
    grisBorde: "#D9D9DE",
    grisTexto: "#55555F",
    blanco: "#FFFFFF",
    verde: "#16A765"
  };

  libro.toast(
    "Aplicando diseño profesional a todas las pestañas...",
    "Mundo Digital 2.0",
    8
  );

  crearPortadaProfesional_(libro, colores);

  libro.getSheets().forEach((hoja) => {
    if (hoja.getName() === "PORTADA") {
      return;
    }

    formatearHojaProfesional_(hoja, colores);
  });

  moverPortadaAlInicio_(libro);

  SpreadsheetApp.flush();

  libro.setActiveSheet(
    libro.getSheetByName("PORTADA")
  );

  SpreadsheetApp.getUi().alert(
    "Diseño terminado",
    "Todas las pestañas fueron organizadas y formateadas correctamente.\n\n" +
    "También se creó una portada profesional con accesos rápidos.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}


/**
 * CREA LA PESTAÑA PORTADA
 */
function crearPortadaProfesional_(libro, colores) {
  let portada = libro.getSheetByName("PORTADA");

  if (!portada) {
    portada = libro.insertSheet("PORTADA");
  }

  if (portada.getFilter()) {
    portada.getFilter().remove();
  }

  portada.getBandings().forEach((banda) => {
    banda.remove();
  });

  portada
    .getRange(
      1,
      1,
      Math.min(portada.getMaxRows(), 40),
      Math.min(portada.getMaxColumns(), 12)
    )
    .breakApart();

  portada.clear();

  portada.setHiddenGridlines(true);
  portada.setFrozenRows(0);
  portada.setFrozenColumns(0);
  portada.setTabColor(colores.rojo);

  if (portada.getMaxRows() < 30) {
    portada.insertRowsAfter(
      portada.getMaxRows(),
      30 - portada.getMaxRows()
    );
  }

  if (portada.getMaxColumns() < 8) {
    portada.insertColumnsAfter(
      portada.getMaxColumns(),
      8 - portada.getMaxColumns()
    );
  }

  const rangoPortada = portada.getRange("A1:H30");

  rangoPortada
    .setBackground(colores.negroFondo)
    .setFontFamily("Arial")
    .setFontColor(colores.blanco);

  const anchos = [
    130,
    130,
    130,
    130,
    130,
    130,
    130,
    130
  ];

  anchos.forEach((ancho, indice) => {
    portada.setColumnWidth(indice + 1, ancho);
  });

  for (let fila = 1; fila <= 30; fila++) {
    portada.setRowHeight(fila, 32);
  }

  portada.setRowHeight(1, 45);
  portada.setRowHeight(2, 45);
  portada.setRowHeight(3, 35);

  // Título principal
  portada.getRange("A1:H2").merge();

  portada
    .getRange("A1")
    .setValue("MUNDO DIGITAL 2.0")
    .setFontSize(28)
    .setFontWeight("bold")
    .setFontColor(colores.blanco)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground(colores.negro);

  // Subtítulo
  portada.getRange("A3:H3").merge();

  portada
    .getRange("A3")
    .setValue("CENTRO DE DATOS Y ADMINISTRACIÓN")
    .setFontSize(11)
    .setFontWeight("bold")
    .setFontColor("#FF9D65")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBackground("#17171C");

  // Línea de color
  portada.getRange("A4:H4").merge();

  portada
    .getRange("A4")
    .setBackground(colores.naranja);

  portada.setRowHeight(4, 6);

  // Encabezado de resumen
  portada.getRange("A5:H5").merge();

  portada
    .getRange("A5")
    .setValue("RESUMEN DE LA BASE DE DATOS")
    .setFontSize(12)
    .setFontWeight("bold")
    .setFontColor("#FF9D65")
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle");

  crearTarjetaResumen_(
    portada,
    "A6:B6",
    "A7:B8",
    "CLIENTES REGISTRADOS",
    '=COUNTA(CLIENTES!A2:A)',
    colores
  );

  crearTarjetaResumen_(
    portada,
    "C6:D6",
    "C7:D8",
    "PRODUCTOS",
    '=COUNTA(PRODUCTOS!A2:A)',
    colores
  );

  crearTarjetaResumen_(
    portada,
    "E6:F6",
    "E7:F8",
    "VENTAS",
    '=COUNTA(VENTAS!A2:A)',
    colores
  );

  crearTarjetaResumen_(
    portada,
    "G6:H6",
    "G7:H8",
    "SUSCRIPCIONES",
    '=COUNTA(SUSCRIPCIONES!A2:A)',
    colores
  );

  // Información
  portada.getRange("A10:H10").merge();

  portada
    .getRange("A10")
    .setValue("INFORMACIÓN DEL SISTEMA")
    .setFontSize(12)
    .setFontWeight("bold")
    .setFontColor("#FF9D65");

  portada.getRange("A11:H13").merge();

  portada
    .getRange("A11")
    .setValue(
      "Esta hoja funciona como la base de datos central de Mundo Digital 2.0. " +
      "Los clientes, productos, ventas, pagos, entregas, cuentas digitales y " +
      "suscripciones serán administrados desde la plataforma."
    )
    .setFontSize(12)
    .setFontColor("#D7D7DD")
    .setWrap(true)
    .setHorizontalAlignment("left")
    .setVerticalAlignment("middle")
    .setBackground("#15151A");

  portada
    .getRange("A11:H13")
    .setBorder(
      true,
      true,
      true,
      true,
      false,
      false,
      "#34343B",
      SpreadsheetApp.BorderStyle.SOLID
    );

  // Accesos rápidos
  portada.getRange("A15:H15").merge();

  portada
    .getRange("A15")
    .setValue("ACCESOS RÁPIDOS")
    .setFontSize(12)
    .setFontWeight("bold")
    .setFontColor("#FF9D65");

  crearBotonNavegacion_(
    libro,
    portada,
    "A17:B18",
    "CLIENTES",
    "CLIENTES",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "C17:D18",
    "PRODUCTOS",
    "PRODUCTOS",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "E17:F18",
    "VENTAS",
    "VENTAS",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "G17:H18",
    "PAGOS",
    "PAGOS",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "A20:B21",
    "INVENTARIO",
    "INVENTARIO",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "C20:D21",
    "CUENTAS DIGITALES",
    "CUENTAS_DIGITALES",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "E20:F21",
    "ENTREGAS",
    "ENTREGAS",
    colores
  );

  crearBotonNavegacion_(
    libro,
    portada,
    "G20:H21",
    "SUSCRIPCIONES",
    "SUSCRIPCIONES",
    colores
  );

  // Advertencia
  portada.getRange("A24:H26").merge();

  portada
    .getRange("A24")
    .setValue(
      "IMPORTANTE: no cambies los nombres de las pestañas ni los encabezados. " +
      "La plataforma utiliza esos nombres para guardar y consultar la información."
    )
    .setFontSize(11)
    .setFontWeight("bold")
    .setFontColor("#FFD0D3")
    .setBackground("#3A1115")
    .setWrap(true)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  portada
    .getRange("A24:H26")
    .setBorder(
      true,
      true,
      true,
      true,
      false,
      false,
      colores.rojo,
      SpreadsheetApp.BorderStyle.SOLID
    );

  portada.getRange("A28:H28").merge();

  portada
    .getRange("A28")
    .setValue(
      "Mundo Digital 2.0 · Base de datos administrativa"
    )
    .setFontSize(10)
    .setFontColor("#777780")
    .setHorizontalAlignment("center");

  // Ocultar columnas y filas sobrantes en la portada
  if (portada.getMaxColumns() > 8) {
    portada.hideColumns(
      9,
      portada.getMaxColumns() - 8
    );
  }

  if (portada.getMaxRows() > 30) {
    portada.hideRows(
      31,
      portada.getMaxRows() - 30
    );
  }
}


/**
 * CREA LAS TARJETAS DE RESUMEN
 */
function crearTarjetaResumen_(
  hoja,
  rangoTitulo,
  rangoValor,
  titulo,
  formula,
  colores
) {
  hoja.getRange(rangoTitulo).merge();
  hoja.getRange(rangoValor).merge();

  hoja
    .getRange(rangoTitulo)
    .setValue(titulo)
    .setFontSize(10)
    .setFontWeight("bold")
    .setFontColor("#AFAFB7")
    .setBackground("#17171C")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  hoja
    .getRange(rangoValor)
    .setFormula(formula)
    .setFontSize(24)
    .setFontWeight("bold")
    .setFontColor(colores.blanco)
    .setBackground("#17171C")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  const filaInicial = hoja.getRange(rangoTitulo).getRow();
  const columnaInicial = hoja.getRange(rangoTitulo).getColumn();
  const cantidadFilas =
    hoja.getRange(rangoValor).getLastRow() - filaInicial + 1;
  const cantidadColumnas =
    hoja.getRange(rangoTitulo).getNumColumns();

  hoja
    .getRange(
      filaInicial,
      columnaInicial,
      cantidadFilas,
      cantidadColumnas
    )
    .setBorder(
      true,
      true,
      true,
      true,
      false,
      false,
      "#34343B",
      SpreadsheetApp.BorderStyle.SOLID
    );
}


/**
 * CREA BOTONES PARA NAVEGAR A LAS PESTAÑAS
 */
function crearBotonNavegacion_(
  libro,
  portada,
  rango,
  texto,
  nombreHoja,
  colores
) {
  const hojaDestino = libro.getSheetByName(nombreHoja);

  portada.getRange(rango).merge();

  if (!hojaDestino) {
    portada
      .getRange(rango)
      .setValue(texto)
      .setFontColor("#777780");
    return;
  }

  const identificador = hojaDestino.getSheetId();

  portada
    .getRange(rango)
    .setFormula(
      '=HYPERLINK("#gid=' +
      identificador +
      '","' +
      texto +
      '")'
    )
    .setFontSize(11)
    .setFontWeight("bold")
    .setFontColor(colores.blanco)
    .setBackground("#23150F")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  portada
    .getRange(rango)
    .setBorder(
      true,
      true,
      true,
      true,
      false,
      false,
      colores.naranja,
      SpreadsheetApp.BorderStyle.SOLID
    );
}


/**
 * FORMATEA CADA PESTAÑA DE DATOS
 */
function formatearHojaProfesional_(hoja, colores) {
  const ultimaColumna = hoja.getLastColumn();

  if (ultimaColumna === 0) {
    return;
  }

  const ultimaFilaConDatos = Math.max(
    hoja.getLastRow(),
    2
  );

  const filasDeTrabajo = Math.min(
    Math.max(ultimaFilaConDatos + 30, 100),
    hoja.getMaxRows()
  );

  hoja.setHiddenGridlines(false);
  hoja.setFrozenRows(1);
  hoja.setFrozenColumns(1);
  hoja.setTabColor(
    obtenerColorPestana_(hoja.getName())
  );

  // Eliminar bandas anteriores
  hoja.getBandings().forEach((banda) => {
    banda.remove();
  });

  // Preparar rango de trabajo
  const rangoTrabajo = hoja.getRange(
    1,
    1,
    filasDeTrabajo,
    ultimaColumna
  );

  rangoTrabajo
    .setFontFamily("Arial")
    .setFontSize(11)
    .setVerticalAlignment("middle");

  // Aplicar filas alternadas
  const banda = rangoTrabajo.applyRowBanding(
    SpreadsheetApp.BandingTheme.GREY,
    true,
    false
  );

  banda.setHeaderRowColor(colores.negro);
  banda.setFirstRowColor(colores.blanco);
  banda.setSecondRowColor(colores.naranjaClaro);

  // Bordes suaves
  rangoTrabajo.setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    colores.grisBorde,
    SpreadsheetApp.BorderStyle.SOLID
  );

  // Encabezados
  const encabezado = hoja.getRange(
    1,
    1,
    1,
    ultimaColumna
  );

  encabezado
    .setBackground(colores.negro)
    .setFontColor(colores.blanco)
    .setFontWeight("bold")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setWrap(true);

  encabezado.setBorder(
    true,
    true,
    true,
    true,
    true,
    true,
    colores.naranja,
    SpreadsheetApp.BorderStyle.SOLID_MEDIUM
  );

  hoja.setRowHeight(1, 42);

  if (filasDeTrabajo > 1) {
    hoja.setRowHeights(
      2,
      filasDeTrabajo - 1,
      29
    );
  }

  // Filtro automático
  const filtroAnterior = hoja.getFilter();

  if (filtroAnterior) {
    filtroAnterior.remove();
  }

  hoja
    .getRange(
      1,
      1,
      filasDeTrabajo,
      ultimaColumna
    )
    .createFilter();

  const encabezados = encabezado
    .getDisplayValues()[0];

  encabezados.forEach((textoEncabezado, indice) => {
    const columna = indice + 1;
    const nombre = String(textoEncabezado)
      .trim()
      .toUpperCase();

    const rangoColumna = hoja.getRange(
      2,
      columna,
      filasDeTrabajo - 1,
      1
    );

    let ancho = 145;

    // Columnas de identificación
    if (
      nombre === "ID" ||
      nombre.endsWith("_ID") ||
      nombre.includes("NUMERO_VENTA")
    ) {
      ancho = 145;

      rangoColumna
        .setHorizontalAlignment("center")
        .setNumberFormat("@");
    }

    // Nombres y títulos
    if (
      nombre.includes("NOMBRE") ||
      nombre.includes("TITULO") ||
      nombre.includes("PLATAFORMA")
    ) {
      ancho = 210;
    }

    // Descripciones y textos largos
    if (
      nombre.includes("DESCRIPCION") ||
      nombre.includes("MENSAJE") ||
      nombre.includes("NOTAS") ||
      nombre.includes("DETALLE") ||
      nombre.includes("DIRECCION") ||
      nombre.includes("PERMISOS") ||
      nombre.includes("VARIABLES")
    ) {
      ancho = 320;

      rangoColumna
        .setWrap(true)
        .setHorizontalAlignment("left");
    }

    // Correos y enlaces
    if (
      nombre.includes("CORREO") ||
      nombre.includes("URL") ||
      nombre.includes("DRIVE")
    ) {
      ancho = 240;

      rangoColumna
        .setWrap(false)
        .setHorizontalAlignment("left");
    }

    // Fechas
    if (
      nombre.includes("FECHA") ||
      nombre.endsWith("_EN") ||
      nombre.includes("ULTIMO_ACCESO") ||
      nombre.includes("ULTIMA_COMPRA") ||
      nombre.includes("ULTIMO_AVISO")
    ) {
      ancho = 165;

      rangoColumna
        .setHorizontalAlignment("center")
        .setNumberFormat("dd/MM/yyyy HH:mm");
    }

    // Valores monetarios
    if (
      nombre.includes("PRECIO") ||
      nombre.includes("MONTO") ||
      nombre.includes("TOTAL") ||
      nombre.includes("SUBTOTAL") ||
      nombre.includes("DESCUENTO") ||
      nombre.includes("COSTO") ||
      nombre.includes("SALDO")
    ) {
      ancho = 130;

      rangoColumna
        .setHorizontalAlignment("right")
        .setNumberFormat("#,##0.00");
    }

    // Cantidades
    if (
      nombre.includes("CANTIDAD") ||
      nombre.includes("ORDEN") ||
      nombre.includes("DURACION_DIAS") ||
      nombre.includes("DIAS_RESTANTES") ||
      nombre.includes("PANTALLAS") ||
      nombre.includes("STOCK")
    ) {
      ancho = 125;

      rangoColumna
        .setHorizontalAlignment("center")
        .setNumberFormat("0");
    }

    // Estados y opciones
    if (
      nombre === "ESTADO" ||
      nombre.includes("ESTADO_") ||
      nombre === "MONEDA" ||
      nombre === "TIPO" ||
      nombre.includes("TIPO_") ||
      nombre === "ROL_ID" ||
      nombre === "EDITABLE"
    ) {
      ancho = 145;

      rangoColumna
        .setHorizontalAlignment("center");
    }

    // Datos que deben conservar ceros iniciales
    if (
      nombre.includes("TELEFONO") ||
      nombre.includes("DOCUMENTO") ||
      nombre.includes("REFERENCIA") ||
      nombre.includes("PIN") ||
      nombre.includes("USUARIO_CUENTA") ||
      nombre.includes("CONTRASENA") ||
      nombre.includes("CLAVE_HASH")
    ) {
      ancho = 190;

      rangoColumna
        .setNumberFormat("@")
        .setHorizontalAlignment("left");
    }

    hoja.setColumnWidth(columna, ancho);
  });

  // Color de texto del área de datos
  hoja
    .getRange(
      2,
      1,
      filasDeTrabajo - 1,
      ultimaColumna
    )
    .setFontColor("#24242A");
}


/**
 * DEVUELVE UN COLOR SEGÚN EL MÓDULO
 */
function obtenerColorPestana_(nombreHoja) {
  const colores = {
    CONFIGURACION: "#FF1744",
    USUARIOS: "#D50000",
    ROLES_PERMISOS: "#B71C1C",

    CLIENTES: "#FF6D00",
    CATEGORIAS: "#FF9100",
    PRODUCTOS: "#FF6D00",
    PROVEEDORES: "#FFAB00",

    INVENTARIO: "#FF8F00",
    CUENTAS_DIGITALES: "#FF6F00",
    ARCHIVOS: "#FF9800",

    VENTAS: "#FF3D00",
    DETALLE_VENTAS: "#FF5722",
    PAGOS: "#FF9800",
    ENTREGAS: "#FF6D00",

    SUSCRIPCIONES: "#FFAB00",
    RENOVACIONES: "#FF8F00",

    METODOS_PAGO: "#FF6F00",
    GASTOS: "#E65100",

    PLANTILLAS_WHATSAPP: "#FF6D00",
    NOTIFICACIONES: "#FF1744",

    REPORTES: "#D50000",
    LISTAS: "#FF9800",
    LOGS: "#B71C1C"
  };

  return colores[nombreHoja] || "#FF6D00";
}


/**
 * COLOCA PORTADA COMO PRIMERA PESTAÑA
 */
function moverPortadaAlInicio_(libro) {
  const portada = libro.getSheetByName("PORTADA");

  if (!portada) {
    return;
  }

  libro.setActiveSheet(portada);
  libro.moveActiveSheet(1);
}
/**
 * =========================================================
 * MUNDO DIGITAL 2.0
 * CREACIÓN DEL PRIMER ADMINISTRADOR
 * =========================================================
 *
 * La contraseña nunca se guarda directamente.
 * Solo se guarda una firma protegida con HMAC-SHA256.
 */


/**
 * FUNCIÓN PRINCIPAL
 *
 * Ejecuta esta función para crear el administrador.
 */
function crearPrimerAdministradorMundoDigital20() {
  const ui = SpreadsheetApp.getUi();
  const libro = md20LibroEstable_();
  const hojaUsuarios = libro.getSheetByName("USUARIOS");

  try {
    if (!hojaUsuarios) {
      throw new Error(
        'No se encontró la pestaña "USUARIOS".'
      );
    }

    const nombreCompleto = solicitarDatoObligatorio_(
      ui,
      "1 de 5 — Nombre completo",
      "Escribe el nombre completo del administrador."
    );

    if (nombreCompleto === null) {
      mostrarProcesoCancelado_(ui);
      return;
    }

    const usuarioIngresado = solicitarDatoObligatorio_(
      ui,
      "2 de 5 — Nombre de usuario",
      "Escribe el usuario que utilizarás para iniciar sesión.\n\n" +
      "Ejemplo: administrador"
    );

    if (usuarioIngresado === null) {
      mostrarProcesoCancelado_(ui);
      return;
    }

    const usuario = normalizarUsuario_(
      usuarioIngresado
    );

    if (!validarNombreUsuario_(usuario)) {
      ui.alert(
        "Usuario no válido",
        "El usuario debe tener entre 3 y 30 caracteres.\n\n" +
        "Solo puede contener letras, números, puntos, " +
        "guiones y guiones bajos.",
        ui.ButtonSet.OK
      );

      return;
    }

    const correoIngresado = solicitarDatoObligatorio_(
      ui,
      "3 de 5 — Correo electrónico",
      "Escribe el correo del administrador."
    );

    if (correoIngresado === null) {
      mostrarProcesoCancelado_(ui);
      return;
    }

    const correo = String(correoIngresado)
      .trim()
      .toLowerCase();

    if (!validarCorreo_(correo)) {
      ui.alert(
        "Correo no válido",
        "Escribe una dirección de correo válida.",
        ui.ButtonSet.OK
      );

      return;
    }

    const respuestaTelefono = ui.prompt(
      "4 de 5 — Teléfono",
      "Escribe el teléfono con código de país.\n\n" +
      "También puedes dejarlo vacío y continuar.",
      ui.ButtonSet.OK_CANCEL
    );

    if (
      respuestaTelefono.getSelectedButton() !==
      ui.Button.OK
    ) {
      mostrarProcesoCancelado_(ui);
      return;
    }

    const telefono = respuestaTelefono
      .getResponseText()
      .trim();

    const contrasena = solicitarContrasenaSegura_(ui);

    if (contrasena === null) {
      mostrarProcesoCancelado_(ui);
      return;
    }

    const duplicado = comprobarUsuarioDuplicado_(
      hojaUsuarios,
      usuario,
      correo
    );

    if (duplicado) {
      ui.alert(
        "Usuario duplicado",
        duplicado,
        ui.ButtonSet.OK
      );

      return;
    }

    const usuarioId = generarSiguienteUsuarioId_(
      hojaUsuarios
    );

    const claveHash = generarHashContrasena_(
      usuario,
      contrasena
    );

    const ahora = new Date();

    const filaUsuario = [
      usuarioId,
      nombreCompleto,
      usuario,
      correo,
      claveHash,
      "ROL-ADMIN",
      telefono,
      "ACTIVO",
      "",
      ahora,
      ahora
    ];

    hojaUsuarios.appendRow(filaUsuario);

    const numeroFila = hojaUsuarios.getLastRow();

    hojaUsuarios
      .getRange(numeroFila, 9, 1, 3)
      .setNumberFormat("dd/MM/yyyy HH:mm:ss");

    hojaUsuarios
      .getRange(numeroFila, 1, 1, filaUsuario.length)
      .setVerticalAlignment("middle");

    registrarLogAdministrador_(
      libro,
      usuarioId,
      "CREAR_PRIMER_ADMINISTRADOR",
      "Administrador principal creado correctamente."
    );

    SpreadsheetApp.flush();

    ui.alert(
      "Administrador creado",
      "El primer administrador fue creado correctamente.\n\n" +
      "Usuario para iniciar sesión:\n" +
      usuario +
      "\n\n" +
      "La contraseña fue protegida y no quedó guardada " +
      "como texto visible.\n\n" +
      "Recuerda conservar la contraseña que escribiste.",
      ui.ButtonSet.OK
    );

    libro.setActiveSheet(hojaUsuarios);

  } catch (error) {
    console.error(error);

    ui.alert(
      "No se pudo crear el administrador",
      error.message ||
      "Ocurrió un error inesperado.",
      ui.ButtonSet.OK
    );
  }
}


/**
 * SOLICITA UN DATO OBLIGATORIO
 */
function solicitarDatoObligatorio_(
  ui,
  titulo,
  mensaje
) {
  while (true) {
    const respuesta = ui.prompt(
      titulo,
      mensaje,
      ui.ButtonSet.OK_CANCEL
    );

    if (
      respuesta.getSelectedButton() !==
      ui.Button.OK
    ) {
      return null;
    }

    const valor = respuesta
      .getResponseText()
      .trim();

    if (valor !== "") {
      return valor;
    }

    ui.alert(
      "Dato obligatorio",
      "Este campo no puede quedar vacío.",
      ui.ButtonSet.OK
    );
  }
}


/**
 * SOLICITA Y CONFIRMA LA CONTRASEÑA
 */
function solicitarContrasenaSegura_(ui) {
  while (true) {
    const primeraRespuesta = ui.prompt(
      "5 de 5 — Contraseña",
      "Escribe una contraseña nueva para el administrador.\n\n" +
      "Debe tener por lo menos 8 caracteres e incluir " +
      "letras y números.\n\n" +
      "Importante: la contraseña se verá mientras la escribes. " +
      "No envíes capturas de esta pantalla.",
      ui.ButtonSet.OK_CANCEL
    );

    if (
      primeraRespuesta.getSelectedButton() !==
      ui.Button.OK
    ) {
      return null;
    }

    const contrasena = primeraRespuesta
      .getResponseText();

    if (!validarContrasena_(contrasena)) {
      ui.alert(
        "Contraseña no válida",
        "La contraseña debe tener como mínimo 8 caracteres " +
        "y contener por lo menos una letra y un número.",
        ui.ButtonSet.OK
      );

      continue;
    }

    const segundaRespuesta = ui.prompt(
      "Confirmar contraseña",
      "Escribe nuevamente la misma contraseña.",
      ui.ButtonSet.OK_CANCEL
    );

    if (
      segundaRespuesta.getSelectedButton() !==
      ui.Button.OK
    ) {
      return null;
    }

    const confirmacion = segundaRespuesta
      .getResponseText();

    if (contrasena !== confirmacion) {
      ui.alert(
        "Las contraseñas no coinciden",
        "Escríbelas nuevamente.",
        ui.ButtonSet.OK
      );

      continue;
    }

    return contrasena;
  }
}


/**
 * NORMALIZA EL NOMBRE DE USUARIO
 */
function normalizarUsuario_(usuario) {
  return String(usuario)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}


/**
 * VALIDA EL NOMBRE DE USUARIO
 */
function validarNombreUsuario_(usuario) {
  return /^[a-z0-9._-]{3,30}$/.test(usuario);
}


/**
 * VALIDA EL CORREO
 */
function validarCorreo_(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}


/**
 * VALIDA LA CONTRASEÑA
 */
function validarContrasena_(contrasena) {
  if (typeof contrasena !== "string") {
    return false;
  }

  if (contrasena.length < 8) {
    return false;
  }

  const contieneLetra = /[A-Za-z]/.test(
    contrasena
  );

  const contieneNumero = /\d/.test(
    contrasena
  );

  return contieneLetra && contieneNumero;
}


/**
 * COMPRUEBA USUARIOS Y CORREOS DUPLICADOS
 */
function comprobarUsuarioDuplicado_(
  hojaUsuarios,
  usuario,
  correo
) {
  const ultimaFila = hojaUsuarios.getLastRow();

  if (ultimaFila <= 1) {
    return "";
  }

  const registros = hojaUsuarios
    .getRange(
      2,
      1,
      ultimaFila - 1,
      hojaUsuarios.getLastColumn()
    )
    .getDisplayValues();

  const usuarioDuplicado = registros.some(
    (fila) =>
      String(fila[2])
        .trim()
        .toLowerCase() === usuario
  );

  if (usuarioDuplicado) {
    return (
      'Ya existe un administrador o vendedor con el usuario "' +
      usuario +
      '".'
    );
  }

  const correoDuplicado = registros.some(
    (fila) =>
      String(fila[3])
        .trim()
        .toLowerCase() === correo
  );

  if (correoDuplicado) {
    return (
      'Ya existe un usuario con el correo "' +
      correo +
      '".'
    );
  }

  return "";
}


/**
 * GENERA EL SIGUIENTE IDENTIFICADOR
 *
 * Ejemplo:
 * USR-000001
 */
function generarSiguienteUsuarioId_(hojaUsuarios) {
  const ultimaFila = hojaUsuarios.getLastRow();

  if (ultimaFila <= 1) {
    return "USR-000001";
  }

  const identificadores = hojaUsuarios
    .getRange(
      2,
      1,
      ultimaFila - 1,
      1
    )
    .getDisplayValues()
    .flat();

  let numeroMayor = 0;

  identificadores.forEach((identificador) => {
    const numero = parseInt(
      String(identificador).replace(/\D/g, ""),
      10
    );

    if (
      !Number.isNaN(numero) &&
      numero > numeroMayor
    ) {
      numeroMayor = numero;
    }
  });

  return (
    "USR-" +
    String(numeroMayor + 1).padStart(6, "0")
  );
}


/**
 * GENERA O RECUPERA LA CLAVE PRIVADA
 */
function obtenerSecretoContrasenas_() {
  const propiedades =
    PropertiesService.getScriptProperties();

  const nombrePropiedad =
    "MUNDO_DIGITAL_PASSWORD_SECRET";

  let secreto = propiedades.getProperty(
    nombrePropiedad
  );

  if (!secreto) {
    secreto =
      Utilities.getUuid() +
      Utilities.getUuid() +
      Utilities.getUuid();

    propiedades.setProperty(
      nombrePropiedad,
      secreto
    );
  }

  return secreto;
}


/**
 * TRANSFORMA LA CONTRASEÑA CON HMAC-SHA256
 */
function generarHashContrasena_(
  usuario,
  contrasena
) {
  const secreto = obtenerSecretoContrasenas_();

  const contenido =
    String(usuario).toLowerCase() +
    "|" +
    String(contrasena);

  const firma =
    Utilities.computeHmacSha256Signature(
      contenido,
      secreto
    );

  return firma
    .map((byte) => {
      const valorPositivo = (byte + 256) % 256;

      return valorPositivo
        .toString(16)
        .padStart(2, "0");
    })
    .join("");
}


/**
 * REGISTRA LA CREACIÓN EN LOGS
 */
function registrarLogAdministrador_(
  libro,
  usuarioId,
  accion,
  detalle
) {
  const hojaLogs = libro.getSheetByName("LOGS");

  if (!hojaLogs) {
    return;
  }

  const logId =
    "LOG-" +
    Utilities
      .getUuid()
      .replace(/-/g, "")
      .slice(0, 12)
      .toUpperCase();

  hojaLogs.appendRow([
    logId,
    new Date(),
    usuarioId,
    accion,
    "USUARIOS",
    usuarioId,
    detalle,
    "EXITO"
  ]);
}


/**
 * MENSAJE DE CANCELACIÓN
 */
function mostrarProcesoCancelado_(ui) {
  ui.alert(
    "Proceso cancelado",
    "No se creó ningún usuario.",
    ui.ButtonSet.OK
  );
}
/**
 * =========================================================
 * MUNDO DIGITAL 2.0
 * PROVEEDORES + REVENDEDORES + API WEB
 * =========================================================
 * Ejecuta primero: prepararProveedoresYRevendedoresMD20
 */

/**
 * =========================================================
 * MÓDULO CORREGIDO DE PROVEEDORES Y REVENDEDORES
 * Se conserva íntegro todo el código anterior del sistema.
 * =========================================================
 */

/**
 * =========================================================
 * MUNDO DIGITAL 2.0
 * PROVEEDORES + REVENDEDORES + API WEB
 * =========================================================
 * Ejecuta primero: prepararProveedoresYRevendedoresMD20
 */

const MD20_SOCIOS = {
  HOJAS: {
    PROVEEDOR: 'PROVEEDORES',
    REVENDEDOR: 'REVENDEDORES'
  },
  ENCABEZADOS: [
    'REGISTRO_ID', 'NOMBRE', 'APELLIDO', 'WHATSAPP', 'PRODUCTO',
    'FECHA_COMPRA', 'TIEMPO_MESES', 'FECHA_VENCIMIENTO',
    'CORREO_CUENTA', 'CONTRASENA_CUENTA', 'PRECIO_CUENTA',
    'PRECIO_FINAL', 'GANANCIA', 'MONEDA', 'ESTADO',
    'DIAS_RESTANTES', 'ULTIMO_AVISO', 'NOTAS', 'CREADO_EN',
    'ACTUALIZADO_EN'
  ],
  DIAS_ALERTA: 3
};

function prepararProveedoresYRevendedoresMD20() {
  const libro = md20LibroEstable_();
  const apiKey = obtenerOCrearApiKeySocios_();

  prepararHojaSocios_(libro, 'PROVEEDOR');
  prepararHojaSocios_(libro, 'REVENDEDOR');
  guardarConfiguracionSocios_(libro, apiKey);
  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    'Proveedores y revendedores listos',
    'Se prepararon las pestañas PROVEEDORES y REVENDEDORES.\n\n' +
    'También se creó la clave API en CONFIGURACION con el nombre API_KEY_SOCIOS.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function prepararHojaSocios_(libro, tipo) {
  const nombreHoja = MD20_SOCIOS.HOJAS[tipo];
  let hoja = libro.getSheetByName(nombreHoja);
  if (!hoja) hoja = libro.insertSheet(nombreHoja);

  const columnas = MD20_SOCIOS.ENCABEZADOS.length;
  if (hoja.getMaxColumns() < columnas) {
    hoja.insertColumnsAfter(hoja.getMaxColumns(), columnas - hoja.getMaxColumns());
  }
  if (hoja.getMaxRows() < 1000) {
    hoja.insertRowsAfter(hoja.getMaxRows(), 1000 - hoja.getMaxRows());
  }

  hoja.getRange(1, 1, 1, columnas).setValues([MD20_SOCIOS.ENCABEZADOS]);
  hoja.setFrozenRows(1);
  hoja.setFrozenColumns(1);
  hoja.setHiddenGridlines(false);
  hoja.setTabColor(tipo === 'PROVEEDOR' ? '#FF6D00' : '#FF1744');
  hoja.setRowHeight(1, 44);

  hoja.getRange(1, 1, 1, columnas)
    .setBackground('#101014')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#FF6D00', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  const datos = hoja.getRange(2, 1, hoja.getMaxRows() - 1, columnas);
  datos.setFontFamily('Arial').setFontSize(11).setVerticalAlignment('middle');
  datos.setBorder(true, true, true, true, true, true, '#D9D9DE', SpreadsheetApp.BorderStyle.SOLID);

  const anchos = [145,150,150,170,220,145,130,155,230,190,130,130,130,100,135,130,155,260,155,155];
  anchos.forEach((ancho, i) => hoja.setColumnWidth(i + 1, ancho));

  hoja.getRange(2, 6, hoja.getMaxRows() - 1, 1).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(2, 8, hoja.getMaxRows() - 1, 1).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(2, 17, hoja.getMaxRows() - 1, 1).setNumberFormat('dd/MM/yyyy HH:mm');
  hoja.getRange(2, 19, hoja.getMaxRows() - 1, 2).setNumberFormat('dd/MM/yyyy HH:mm');
  hoja.getRange(2, 11, hoja.getMaxRows() - 1, 3).setNumberFormat('#,##0.00');
  hoja.getRange(2, 4, hoja.getMaxRows() - 1, 1).setNumberFormat('@');
  hoja.getRange(2, 9, hoja.getMaxRows() - 1, 2).setNumberFormat('@');

  const reglaTiempo = SpreadsheetApp.newDataValidation()
    .requireValueInList(['1', '2', '3', '6', '12'], true)
    .setAllowInvalid(false)
    .setHelpText('Selecciona 1, 2, 3, 6 o 12 meses.')
    .build();
  hoja.getRange(2, 7, hoja.getMaxRows() - 1, 1).setDataValidation(reglaTiempo);

  const reglaMoneda = SpreadsheetApp.newDataValidation()
    .requireValueInList(['USD', 'VES', 'COP'], true)
    .setAllowInvalid(false)
    .build();
  hoja.getRange(2, 14, hoja.getMaxRows() - 1, 1).setDataValidation(reglaMoneda);

  // Los cálculos se realizan al guardar desde la página o mediante onEdit.
  // No se llenan columnas completas con fórmulas porque eso hace que Google Sheets
  // considere ocupadas todas las filas y envíe los nuevos registros al final.

  // Filas alternadas.
  hoja.getBandings().forEach(b => b.remove());
  const banda = hoja.getRange(1, 1, Math.min(200, hoja.getMaxRows()), columnas)
    .applyRowBanding(SpreadsheetApp.BandingTheme.GREY, true, false);
  banda.setHeaderRowColor('#101014');
  banda.setFirstRowColor('#FFFFFF');
  banda.setSecondRowColor('#FFF3EB');

  if (hoja.getFilter()) hoja.getFilter().remove();
  hoja.getRange(1, 1, hoja.getMaxRows(), columnas).createFilter();

  aplicarColoresEstadoSocios_(hoja);
}

function aplicarColoresEstadoSocios_(hoja) {
  const rango = hoja.getRange(2, 15, hoja.getMaxRows() - 1, 1);
  const reglas = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('ACTIVO')
      .setBackground('#123D2A').setFontColor('#9EF0BD').setBold(true).setRanges([rango]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('POR_VENCER')
      .setBackground('#4A2D08').setFontColor('#FFD08A').setBold(true).setRanges([rango]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('VENCIDO')
      .setBackground('#4A1418').setFontColor('#FFADB3').setBold(true).setRanges([rango]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('INACTIVO')
      .setBackground('#36363D').setFontColor('#C7C7CE').setBold(true).setRanges([rango]).build()
  ];
  hoja.setConditionalFormatRules(reglas);
}

function guardarConfiguracionSocios_(libro, apiKey) {
  const hoja = libro.getSheetByName('CONFIGURACION');
  if (!hoja) return;
  guardarConfig_(hoja, 'API_KEY_SOCIOS', apiKey, 'Clave privada para conectar proveedores y revendedores');
  guardarConfig_(hoja, 'DIAS_ALERTA_SOCIOS', String(MD20_SOCIOS.DIAS_ALERTA), 'Días antes del vencimiento para mostrar alerta');
}

function guardarConfig_(hoja, clave, valor, descripcion) {
  const ultima = Math.max(hoja.getLastRow(), 1);
  const claves = ultima > 1 ? hoja.getRange(2, 1, ultima - 1, 1).getDisplayValues().flat() : [];
  const indice = claves.indexOf(clave);
  if (indice >= 0) {
    hoja.getRange(indice + 2, 2).setValue(valor);
    hoja.getRange(indice + 2, 3).setValue(descripcion);
    hoja.getRange(indice + 2, 6).setValue(new Date());
  } else {
    hoja.appendRow([clave, valor, descripcion, 'SISTEMA', 'NO', new Date()]);
  }
}

function obtenerOCrearApiKeySocios_() {
  return MD20_API_KEY_ESTABLE;
}

/** API WEB — SISTEMA COMPLETO CON PORTAL PÚBLICO POR TOKEN */
function doGet(e) {
  try {
    const p=e&&e.parameter?e.parameter:{};
    const a=String(p.action||'');

    // Acciones públicas protegidas por token individual.
    if(a==='consultarPortalCliente'){
      return respuestaJson_(consultarPortalClienteMD20_(p.token||''));
    }

    // Catálogo público: devuelve únicamente campos seguros.
    if(a==='listarCatalogoPublicoMD20'){
      const canal=String(p.vendedor||p.canal||'ADMIN').trim();
      const registros=listarCatalogoPublicoMD20_(canal);

      return respuestaJson_({
        ok:true,
        registros:registros,
        categorias:listarCategoriasCatalogoPublicoMD20_(registros),
        metodosPago:listarMetodosPagoPublicosMD20_(),
        tienda:obtenerConfiguracionTiendaPublicaMD20_(),
        vendedor:canal||'ADMIN'
      });
    }

    if(a==='consultarPedidoTiendaMD20'){
      return respuestaJson_(consultarPedidoTiendaPublicaMD20_(p.token||''));
    }

    // Chat público de vendedores protegido por token individual.
    if(a==='consultarChatVendedorMD20'){
      return respuestaJson_(consultarChatVendedorMD20_(p.token||''));
    }

    validarClaveApi_(p.claveApi||'');

    if(a==='listarSuscripciones')return respuestaJson_({ok:true,registros:listarSuscripcionesMD20_()});
    if(a==='listarEntregasMD20')return respuestaJson_({ok:true,registros:listarEntregasMD20_()});
    if(a==='obtenerConfiguracionEntregaMD20')return respuestaJson_({ok:true,registro:obtenerConfiguracionEntregaMD20_()});
    if(a==='obtenerDatosProductoEntregaMD20')return respuestaJson_({ok:true,registro:obtenerDatosProductoEntregaDirectoMD20_(p.productoId||'')});
    if(a==='listarPagosMD20')return respuestaJson_({ok:true,registros:listarPagosMD20_()});
    if(a==='listarAlertasPagosTiendaMD20')return respuestaJson_({ok:true,registros:listarAlertasPagosTiendaMD20_()});
    if(a==='listarInventarioDigital')return respuestaJson_({ok:true,registros:listarInventarioDigitalMD20_()});
    if(a==='listarRespuestasRenovacion')return respuestaJson_({ok:true,registros:listarRespuestasRenovacionMD20_()});
    if(a==='listarEquiposCanva')return respuestaJson_({ok:true,registros:listarEquiposCanvaMD20_()});
    if(a==='listarCuentasCanva')return respuestaJson_({ok:true,registros:listarCuentasCanvaMD20_()});
    if(a==='resumenCanvaTelegram')return respuestaJson_({ok:true,resumen:obtenerResumenCanvaTelegramMD20_()});
    if(a==='listarCuentasDisponibles')return respuestaJson_({ok:true,registros:listarCuentasDisponiblesMD20_()});
    if(a==='listarVentas')return respuestaJson_({ok:true,registros:listarVentasMD20_()});
    if(a==='listarMetodosPago')return respuestaJson_({ok:true,registros:listarMetodosPagoMD20_()});
    if(a==='obtenerConfiguracionPagosTiendaMD20')return respuestaJson_({ok:true,registro:obtenerConfiguracionPagosTiendaMD20_()});
    if(a==='listarProductos')return respuestaJson_({ok:true,registros:listarProductosMD20_()});
    if(a==='listarCatalogoAdminMD20')return respuestaJson_({ok:true,registros:listarCatalogoAdminMD20_()});
    if(a==='listarCategorias')return respuestaJson_({ok:true,registros:listarCategoriasMD20_()});
    if(a==='listarClientes')return respuestaJson_({ok:true,registros:listarClientesMD20_()});
    if(a==='historialCliente')return respuestaJson_({ok:true,ventas:obtenerHistorialClienteMD20_(p.clienteId||'')});
    if(a==='listarSocios'){const t=validarTipoSocio_(p.tipo);return respuestaJson_({ok:true,registros:listarSocios_(t)});}
    if(a==='listarTelegramProveedoresMD20')return respuestaJson_({ok:true,registros:listarTelegramProveedoresMD20_()});
    if(a==='listarPublicidadMD20')return respuestaJson_({ok:true,registros:listarPublicidadMD20_()});
    if(a==='listarChatsAdminMD20')return respuestaJson_({ok:true,registros:listarChatsAdminMD20_()});
    if(a==='listarMensajesChatAdminMD20')return respuestaJson_({ok:true,registros:listarMensajesChatAdminMD20_(p.vendedorId||'')});
    return respuestaJson_({ok:false,mensaje:'Acción GET no reconocida.'});
  }catch(error){return respuestaJson_({ok:false,mensaje:error.message||'Error inesperado.'});}
}

function doPost(e) {
  try {
    const c=JSON.parse((e&&e.postData&&e.postData.contents)||'{}');
    const a=String(c.action||'');

    // Acción pública protegida por token individual.
    if(a==='responderRenovacionPortal'){
      return respuestaJson_(responderRenovacionPortalMD20_(c));
    }

    // Checkout público. No utiliza la clave privada del panel.
    if(a==='crearPedidoTiendaPublicaMD20'){
      return respuestaJson_(registrarPedidoTiendaPublicaMD20_(c.registro||{}));
    }

    if(a==='registrarPagoPedidoTiendaMD20'){
      return respuestaJson_(registrarPagoPedidoTiendaMD20_(c.registro||{}));
    }

    // Chat público de vendedores protegido por token individual.
    if(a==='enviarMensajeChatVendedorMD20'){
      return respuestaJson_(enviarMensajeChatVendedorMD20_(c.token||'',c.mensaje||''));
    }

    validarClaveApi_(c.claveApi);

    if(a==='generarPortalCliente')return respuestaJson_(generarPortalClienteMD20_(c.clienteId||''));
    if(a==='guardarEntregaMD20')return respuestaJson_({ok:true,registro:guardarEntregaMD20_(c.registro||{})});
    if(a==='cambiarEstadoEntregaMD20')return respuestaJson_({ok:true,registro:cambiarEstadoEntregaMD20_(c.entregaId||'',c.estado||'')});
    if(a==='guardarMensajeEntregaGeneradoMD20')return respuestaJson_({ok:true,registro:guardarMensajeEntregaGeneradoMD20_(c.entregaId||'',c.mensajeEntrega||'')});
    if(a==='guardarPagoMD20')return respuestaJson_({ok:true,registro:guardarPagoMD20_(c.registro||{})});
    if(a==='cambiarEstadoPagoMD20')return respuestaJson_({ok:true,registro:cambiarEstadoPagoMD20_(c.pagoId||'',c.estado||'')});
    if(a==='resolverAlertaPagoTiendaMD20')return respuestaJson_(resolverAlertaPagoTiendaMD20_(c.registro||{}));
    if(a==='guardarInventarioDigital')return respuestaJson_({ok:true,registro:guardarInventarioDigitalMD20_(c.registro||{})});
    if(a==='procesarRespuestaRenovacion')return respuestaJson_({ok:true,registro:procesarRespuestaRenovacionMD20_(c.respuestaId||'')});
    if(a==='guardarSuscripcion')return respuestaJson_({ok:true,registro:guardarSuscripcionMD20_(c.registro||{})});
    if(a==='guardarEquipoCanva')return respuestaJson_({ok:true,registro:guardarEquipoCanvaMD20_(c.registro||{})});
    if(a==='guardarCuentaCanva')return respuestaJson_({ok:true,registro:guardarCuentaCanvaMD20_(c.registro||{})});
    if(a==='crearVenta')return respuestaJson_({ok:true,registro:crearVentaMD20_(c.registro||{})});
    if(a==='cambiarEstadoPagoVenta')return respuestaJson_({ok:true,registro:cambiarEstadoPagoVentaMD20_(c.ventaId,c.estado)});
    if(a==='guardarProducto')return respuestaJson_({ok:true,registro:guardarProductoMD20_(c.registro||{})});
    if(a==='guardarConfiguracionPagosTiendaMD20')return respuestaJson_({ok:true,registro:guardarConfiguracionPagosTiendaMD20_(c.registro||{})});
    if(a==='guardarCatalogoProductoMD20')return respuestaJson_({ok:true,registro:guardarCatalogoProductoMD20_(c.registro||{})});
    if(a==='cambiarPublicacionCatalogoMD20')return respuestaJson_({ok:true,registro:cambiarPublicacionCatalogoMD20_(c.productoId||'',c.publicar||'NO')});
    if(a==='desactivarProducto'){desactivarProductoMD20_(c.id);return respuestaJson_({ok:true});}
    if(a==='guardarCliente')return respuestaJson_({ok:true,registro:guardarClienteMD20_(c.registro||{})});
    if(a==='desactivarCliente'){desactivarClienteMD20_(c.id);return respuestaJson_({ok:true});}
    if(a==='guardarSocio'){const t=validarTipoSocio_(c.tipo);return respuestaJson_({ok:true,registro:guardarSocio_(t,c.registro||{})});}
    if(a==='desactivarSocio'){const t=validarTipoSocio_(c.tipo);desactivarSocio_(t,c.id);return respuestaJson_({ok:true});}
    if(a==='guardarTelegramProveedorMD20')return respuestaJson_({ok:true,registro:guardarTelegramProveedorMD20_(c.registro||{})});
    if(a==='cambiarEstadoTelegramProveedorMD20')return respuestaJson_({ok:true,registro:cambiarEstadoTelegramProveedorMD20_(c.id||'',c.estado||'')});
    if(a==='guardarPublicidadMD20')return respuestaJson_({ok:true,registro:guardarPublicidadMD20_(c.registro||{})});
    if(a==='cambiarEstadoPublicidadMD20')return respuestaJson_({ok:true,registro:cambiarEstadoPublicidadMD20_(c.id||'',c.estado||'')});
    if(a==='generarAccesoChatVendedorMD20')return respuestaJson_({ok:true,registro:generarAccesoChatVendedorMD20_(c.registro||{})});
    if(a==='cambiarEstadoAccesoChatVendedorMD20')return respuestaJson_({ok:true,registro:cambiarEstadoAccesoChatVendedorMD20_(c.vendedorId||'',c.estado||'')});
    if(a==='enviarMensajeChatAdminMD20')return respuestaJson_({ok:true,registro:enviarMensajeChatAdminMD20_(c.vendedorId||'',c.mensaje||'')});
    return respuestaJson_({ok:false,mensaje:'Acción POST no reconocida.'});
  }catch(error){return respuestaJson_({ok:false,mensaje:error.message||'Error inesperado.'});}
}

function validarClaveApi_(clave) {
  const correcta = obtenerOCrearApiKeySocios_();
  if (!clave || clave !== correcta) throw new Error('Clave API inválida.');
}

function validarTipoSocio_(tipo) {
  const limpio = String(tipo || '').toUpperCase();
  if (!MD20_SOCIOS.HOJAS[limpio]) throw new Error('Tipo de registro no válido.');
  return limpio;
}

function listarSocios_(tipo) {
  const hoja = md20LibroEstable_().getSheetByName(MD20_SOCIOS.HOJAS[tipo]);
  if (!hoja || hoja.getLastRow() <= 1) return [];
  const valores = hoja.getRange(2, 1, hoja.getLastRow() - 1, MD20_SOCIOS.ENCABEZADOS.length).getValues();
  return valores.filter(f => f[0] && f[14] !== 'INACTIVO').map(filaARegistro_);
}

function filaARegistro_(fila) {
  return {
    id: fila[0], nombre: fila[1], apellido: fila[2], whatsapp: fila[3], producto: fila[4],
    fechaCompra: fechaApi_(fila[5]), tiempoServicio: String(fila[6] || ''), fechaVencimiento: fechaApi_(fila[7]),
    correoCuenta: fila[8], contrasenaCuenta: fila[9], precioCuenta: Number(fila[10] || 0),
    precioFinal: Number(fila[11] || 0), ganancia: Number(fila[12] || 0), moneda: fila[13] || 'USD',
    estado: calcularEstadoSocio_(fila[7], fila[14]), diasRestantes: calcularDias_(fila[7]),
    ultimoAviso: fechaHoraApi_(fila[16]), notas: fila[17] || ''
  };
}

function guardarSocio_(tipo, registro) {
  const libro = md20LibroEstable_();
  const hoja = libro.getSheetByName(MD20_SOCIOS.HOJAS[tipo]);
  if (!hoja) throw new Error('La pestaña todavía no está preparada.');

  const id = String(registro.id || '').trim() || generarIdSocio_(tipo);
  const filaExistente = buscarFilaPorId_(hoja, id);
  const fechaCompra = convertirFecha_(registro.fechaCompra);
  const meses = Number(registro.tiempoServicio || 0);
  const vencimiento = sumarMesesSeguro_(fechaCompra, meses);
  const costo = Number(registro.precioCuenta || 0);
  const final = Number(registro.precioFinal || 0);
  const ahora = new Date();
  const creado = filaExistente ? hoja.getRange(filaExistente, 19).getValue() || ahora : ahora;

  const fila = [
    id, limpiar_(registro.nombre), limpiar_(registro.apellido), limpiarTelefono_(registro.whatsapp),
    limpiar_(registro.producto), fechaCompra, meses, vencimiento, limpiar_(registro.correoCuenta),
    limpiar_(registro.contrasenaCuenta), costo, final, final - costo, limpiar_(registro.moneda) || 'USD',
    calcularEstadoSocio_(vencimiento, ''), calcularDias_(vencimiento), '', limpiar_(registro.notas), creado, ahora
  ];

  const numeroFila = filaExistente || obtenerPrimeraFilaLibreSocio_(hoja);
  hoja.getRange(numeroFila, 1, 1, fila.length).setValues([fila]);
  hoja.getRange(numeroFila, 6).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(numeroFila, 8).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(numeroFila, 11, 1, 3).setNumberFormat('#,##0.00');
  hoja.getRange(numeroFila, 19, 1, 2).setNumberFormat('dd/MM/yyyy HH:mm');
  SpreadsheetApp.flush();
  return filaARegistro_(fila);
}

function desactivarSocio_(tipo, id) {
  const hoja = md20LibroEstable_().getSheetByName(MD20_SOCIOS.HOJAS[tipo]);
  const fila = buscarFilaPorId_(hoja, String(id || ''));
  if (!fila) throw new Error('No se encontró el registro.');
  hoja.getRange(fila, 15).setValue('INACTIVO');
  hoja.getRange(fila, 20).setValue(new Date());
}

function buscarFilaPorId_(hoja, id) {
  if (!hoja || hoja.getLastRow() <= 1 || !id) return 0;
  const ids = hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getDisplayValues().flat();
  const indice = ids.indexOf(id);
  return indice < 0 ? 0 : indice + 2;
}

function generarIdSocio_(tipo) {
  const prefijo = tipo === 'PROVEEDOR' ? 'PRV' : 'REV';
  return prefijo + '-' + Utilities.getUuid().replace(/-/g, '').slice(0, 10).toUpperCase();
}

function sumarMesesSeguro_(fecha, meses) {
  const base = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const dia = fecha.getDate();
  base.setMonth(base.getMonth() + Number(meses));
  const ultimo = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  base.setDate(Math.min(dia, ultimo));
  return base;
}

function calcularDias_(fecha) {
  if (!(fecha instanceof Date) || isNaN(fecha)) return 0;
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const fin = new Date(fecha); fin.setHours(0,0,0,0);
  return Math.ceil((fin - hoy) / 86400000);
}

function calcularEstadoSocio_(fecha, estadoActual) {
  if (estadoActual === 'INACTIVO') return 'INACTIVO';
  const dias = calcularDias_(fecha);
  if (dias < 0) return 'VENCIDO';
  if (dias <= MD20_SOCIOS.DIAS_ALERTA) return 'POR_VENCER';
  return 'ACTIVO';
}

function convertirFecha_(valor) {
  if (valor instanceof Date && !isNaN(valor)) return valor;
  const partes = String(valor || '').split('-').map(Number);
  if (partes.length !== 3 || !partes[0] || !partes[1] || !partes[2]) throw new Error('La fecha de compra no es válida.');
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

function fechaApi_(valor) {
  if (!(valor instanceof Date) || isNaN(valor)) return '';
  return Utilities.formatDate(valor, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function fechaHoraApi_(valor) {
  if (!(valor instanceof Date) || isNaN(valor)) return '';
  return Utilities.formatDate(valor, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss");
}

function limpiar_(valor) { return String(valor == null ? '' : valor).trim(); }
function limpiarTelefono_(valor) { return String(valor == null ? '' : valor).replace(/[^0-9+]/g, ''); }
function respuestaJson_(objeto) { return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON); }

/**
 * Al editar directamente en Sheets recalcula vencimiento, ganancia y estado.
 */
function onEdit(e) {
  try {
    manejarEdicionManualPagoMD20_(e);
    manejarMenuProductoCuentaMD20_(e);
    manejarEdicionCanvaMD20_(e);
    const hoja = e.range.getSheet();
    if (!['PROVEEDORES', 'REVENDEDORES'].includes(hoja.getName()) || e.range.getRow() < 2) return;
    const fila = e.range.getRow();
    const fecha = hoja.getRange(fila, 6).getValue();
    const meses = Number(hoja.getRange(fila, 7).getValue() || 0);
    const costo = Number(hoja.getRange(fila, 11).getValue() || 0);
    const final = Number(hoja.getRange(fila, 12).getValue() || 0);
    if (fecha instanceof Date && !isNaN(fecha) && meses) hoja.getRange(fila, 8).setValue(sumarMesesSeguro_(fecha, meses));
    hoja.getRange(fila, 13).setValue(final - costo);
    const vencimiento = hoja.getRange(fila, 8).getValue();
    if (vencimiento instanceof Date && !isNaN(vencimiento)) {
      hoja.getRange(fila, 15).setValue(calcularEstadoSocio_(vencimiento, hoja.getRange(fila, 15).getValue()));
      hoja.getRange(fila, 16).setValue(calcularDias_(vencimiento));
    }
    hoja.getRange(fila, 20).setValue(new Date());
  } catch (error) {
    console.error(error);
  }
}

/**
 * =========================================================
 * REPARACIÓN DEL MÓDULO DE PROVEEDORES Y REVENDEDORES
 * =========================================================
 * Ejecuta una vez esta función después de pegar esta versión.
 * - Recupera registros guardados al final de la hoja.
 * - Los mueve desde la fila 2 en adelante.
 * - Elimina fórmulas colocadas en filas vacías.
 * - Evita que los próximos registros terminen en la fila 1001.
 */
function repararProveedoresYRevendedoresMD20() {
  const libro = md20LibroEstable_();
  ['PROVEEDORES', 'REVENDEDORES'].forEach(nombre => repararHojaSocios_(libro.getSheetByName(nombre)));
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert(
    'Reparación terminada',
    'Se recuperaron y organizaron los registros. Ya puedes volver a probar desde la página.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function repararHojaSocios_(hoja) {
  if (!hoja) return;
  const columnas = MD20_SOCIOS.ENCABEZADOS.length;
  const maxFilas = hoja.getMaxRows();
  const valores = hoja.getRange(2, 1, maxFilas - 1, columnas).getValues();
  const registros = valores.filter(fila => String(fila[0] || '').trim() !== '');

  // Limpiar únicamente el área de datos, conservando formato y validaciones.
  hoja.getRange(2, 1, maxFilas - 1, columnas).clearContent();

  if (registros.length) {
    hoja.getRange(2, 1, registros.length, columnas).setValues(registros);
  }

  // Volver a aplicar formatos importantes.
  hoja.getRange(2, 6, maxFilas - 1, 1).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(2, 8, maxFilas - 1, 1).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(2, 11, maxFilas - 1, 3).setNumberFormat('#,##0.00');
  hoja.getRange(2, 19, maxFilas - 1, 2).setNumberFormat('dd/MM/yyyy HH:mm');
}

/**
 * Devuelve la primera fila realmente libre tomando REGISTRO_ID como referencia.
 */
function obtenerPrimeraFilaLibreSocio_(hoja) {
  const maxFilas = hoja.getMaxRows();
  const ids = hoja.getRange(2, 1, maxFilas - 1, 1).getDisplayValues().flat();
  const indiceLibre = ids.findIndex(valor => String(valor || '').trim() === '');
  if (indiceLibre >= 0) return indiceLibre + 2;
  hoja.insertRowsAfter(maxFilas, 100);
  return maxFilas + 1;
}


/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — MÓDULO COMPLETO DE CLIENTES
 * =========================================================
 * Conserva la pestaña CLIENTES creada originalmente.
 * Ejecuta una vez: prepararModuloClientesMD20
 */

const MD20_CLIENTES = {
  HOJA: 'CLIENTES',
  ENCABEZADOS: [
    'CLIENTE_ID','NOMBRE_COMPLETO','TELEFONO','CODIGO_PAIS','CORREO',
    'DOCUMENTO','PAIS','CIUDAD','DIRECCION','FECHA_NACIMIENTO',
    'ORIGEN_CLIENTE','ETIQUETAS','NOTAS','TOTAL_COMPRAS','ULTIMA_COMPRA',
    'ESTADO','CREADO_POR','CREADO_EN','ACTUALIZADO_EN'
  ]
};

function prepararModuloClientesMD20() {
  const libro = md20LibroEstable_();
  let hoja = libro.getSheetByName(MD20_CLIENTES.HOJA);
  if (!hoja) hoja = libro.insertSheet(MD20_CLIENTES.HOJA);

  const columnas = MD20_CLIENTES.ENCABEZADOS.length;
  if (hoja.getMaxColumns() < columnas) {
    hoja.insertColumnsAfter(hoja.getMaxColumns(), columnas - hoja.getMaxColumns());
  }
  if (hoja.getMaxRows() < 1000) {
    hoja.insertRowsAfter(hoja.getMaxRows(), 1000 - hoja.getMaxRows());
  }

  hoja.getRange(1,1,1,columnas).setValues([MD20_CLIENTES.ENCABEZADOS]);
  hoja.setFrozenRows(1);
  hoja.setFrozenColumns(1);
  hoja.setHiddenGridlines(false);
  hoja.setTabColor('#FF6D00');
  hoja.setRowHeight(1,44);

  hoja.getRange(1,1,1,columnas)
    .setBackground('#101014').setFontColor('#FFFFFF').setFontWeight('bold')
    .setFontSize(11).setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(true,true,true,true,true,true,'#FF6D00',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  const datos = hoja.getRange(2,1,hoja.getMaxRows()-1,columnas);
  datos.setFontFamily('Arial').setFontSize(11).setVerticalAlignment('middle')
    .setBorder(true,true,true,true,true,true,'#D9D9DE',SpreadsheetApp.BorderStyle.SOLID);

  const anchos=[145,220,175,120,230,150,150,150,260,155,150,220,300,140,155,130,145,155,155];
  anchos.forEach((a,i)=>hoja.setColumnWidth(i+1,a));

  hoja.getRange(2,3,hoja.getMaxRows()-1,4).setNumberFormat('@');
  hoja.getRange(2,10,hoja.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(2,14,hoja.getMaxRows()-1,1).setNumberFormat('#,##0.00');
  hoja.getRange(2,15,hoja.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  hoja.getRange(2,18,hoja.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy HH:mm');

  const reglaEstado = SpreadsheetApp.newDataValidation()
    .requireValueInList(['ACTIVO','INACTIVO'],true).setAllowInvalid(false).build();
  hoja.getRange(2,16,hoja.getMaxRows()-1,1).setDataValidation(reglaEstado);

  const reglaOrigen = SpreadsheetApp.newDataValidation()
    .requireValueInList(['WHATSAPP','INSTAGRAM','FACEBOOK','TELEGRAM','PAGINA_WEB','REFERIDO','OTRO'],true)
    .setAllowInvalid(false).build();
  hoja.getRange(2,11,hoja.getMaxRows()-1,1).setDataValidation(reglaOrigen);

  hoja.getBandings().forEach(b=>b.remove());
  const banda=hoja.getRange(1,1,Math.min(200,hoja.getMaxRows()),columnas)
    .applyRowBanding(SpreadsheetApp.BandingTheme.GREY,true,false);
  banda.setHeaderRowColor('#101014');
  banda.setFirstRowColor('#FFFFFF');
  banda.setSecondRowColor('#FFF3EB');

  if (hoja.getFilter()) hoja.getFilter().remove();
  hoja.getRange(1,1,hoja.getMaxRows(),columnas).createFilter();

  const rangoEstado=hoja.getRange(2,16,hoja.getMaxRows()-1,1);
  hoja.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('ACTIVO')
      .setBackground('#123D2A').setFontColor('#9EF0BD').setBold(true).setRanges([rangoEstado]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('INACTIVO')
      .setBackground('#36363D').setFontColor('#C7C7CE').setBold(true).setRanges([rangoEstado]).build()
  ]);

  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Clientes listos','La pestaña CLIENTES quedó preparada para conectarse con la página.',SpreadsheetApp.getUi().ButtonSet.OK);
}

function listarClientesMD20_() {
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName(MD20_CLIENTES.HOJA);
  if (!hoja || hoja.getLastRow()<=1) return [];

  const filas=hoja.getRange(2,1,hoja.getLastRow()-1,MD20_CLIENTES.ENCABEZADOS.length).getValues();
  return filas.filter(f=>String(f[0]||'').trim()!=='').map(f=>filaClienteARegistroMD20_(f));
}

function filaClienteARegistroMD20_(fila) {
  const datosCompras=calcularComprasClienteMD20_(String(fila[0]||''));
  return {
    id:String(fila[0]||''), nombreCompleto:String(fila[1]||''),
    telefono:String(fila[2]||''), codigoPais:String(fila[3]||''),
    correo:String(fila[4]||''), documento:String(fila[5]||''),
    pais:String(fila[6]||''), ciudad:String(fila[7]||''),
    direccion:String(fila[8]||''), fechaNacimiento:fechaApi_(fila[9]),
    origenCliente:String(fila[10]||''), etiquetas:String(fila[11]||''),
    notas:String(fila[12]||''), totalCompras:datosCompras.total,
    cantidadCompras:datosCompras.cantidad,
    ultimaCompra:datosCompras.ultimaFecha || fechaApi_(fila[14]),
    estado:String(fila[15]||'ACTIVO'), creadoPor:String(fila[16]||'SISTEMA'),
    creadoEn:fechaHoraApi_(fila[17]), actualizadoEn:fechaHoraApi_(fila[18])
  };
}

function guardarClienteMD20_(registro) {
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName(MD20_CLIENTES.HOJA);
  if (!hoja) throw new Error('La pestaña CLIENTES no está preparada.');

  const nombre=String(registro.nombreCompleto||'').trim();
  const telefono=String(registro.telefono||'').replace(/\D/g,'');
  if (!nombre) throw new Error('El nombre del cliente es obligatorio.');
  if (!telefono) throw new Error('El WhatsApp del cliente es obligatorio.');

  const id=String(registro.id||'').trim() || generarIdClienteMD20_();
  const filaExistente=buscarFilaClienteMD20_(hoja,id);
  validarClienteDuplicadoMD20_(hoja,id,telefono,String(registro.correo||'').trim());

  const ahora=new Date();
  const compras=calcularComprasClienteMD20_(id);
  const creado=filaExistente ? hoja.getRange(filaExistente,18).getValue() || ahora : ahora;

  const fila=[
    id,nombre,telefono,String(registro.codigoPais||'').trim(),
    String(registro.correo||'').trim().toLowerCase(),String(registro.documento||'').trim(),
    String(registro.pais||'').trim(),String(registro.ciudad||'').trim(),
    String(registro.direccion||'').trim(),convertirFechaClienteMD20_(registro.fechaNacimiento),
    String(registro.origenCliente||'WHATSAPP').trim().toUpperCase(),
    String(registro.etiquetas||'').trim(),String(registro.notas||'').trim(),
    compras.total,compras.ultimaDate || '',String(registro.estado||'ACTIVO').trim().toUpperCase(),
    'ADMINISTRADOR',creado,ahora
  ];

  const numeroFila=filaExistente || primeraFilaLibreClienteMD20_(hoja);
  hoja.getRange(numeroFila,1,1,fila.length).setValues([fila]);
  hoja.getRange(numeroFila,10).setNumberFormat('dd/MM/yyyy');
  hoja.getRange(numeroFila,14).setNumberFormat('#,##0.00');
  hoja.getRange(numeroFila,15).setNumberFormat('dd/MM/yyyy HH:mm');
  hoja.getRange(numeroFila,18,1,2).setNumberFormat('dd/MM/yyyy HH:mm');
  SpreadsheetApp.flush();
  return filaClienteARegistroMD20_(fila);
}

function desactivarClienteMD20_(id) {
  const hoja=md20LibroEstable_().getSheetByName(MD20_CLIENTES.HOJA);
  const fila=buscarFilaClienteMD20_(hoja,String(id||''));
  if (!fila) throw new Error('No se encontró el cliente.');
  hoja.getRange(fila,16).setValue('INACTIVO');
  hoja.getRange(fila,19).setValue(new Date());
}

function obtenerHistorialClienteMD20_(clienteId) {
  const hoja=md20LibroEstable_().getSheetByName('VENTAS');
  if (!hoja || hoja.getLastRow()<=1 || !clienteId) return [];
  const valores=hoja.getRange(2,1,hoja.getLastRow()-1,18).getValues();
  return valores.filter(f=>String(f[2]||'')===String(clienteId)).map(f=>({
    id:String(f[0]||''), numeroVenta:String(f[1]||''),
    fechaVenta:fechaApi_(f[3]), total:Number(f[6]||0), moneda:String(f[7]||'USD'),
    montoPagado:Number(f[8]||0), saldoPendiente:Number(f[9]||0),
    estadoPago:String(f[10]||''), estadoEntrega:String(f[11]||'')
  })).sort((a,b)=>String(b.fechaVenta).localeCompare(String(a.fechaVenta)));
}

function calcularComprasClienteMD20_(clienteId) {
  const ventas=obtenerHistorialClienteMD20_(clienteId);
  let ultimaDate=null;
  ventas.forEach(v=>{
    if (v.fechaVenta) {
      const d=new Date(v.fechaVenta+'T00:00:00');
      if (!isNaN(d) && (!ultimaDate || d>ultimaDate)) ultimaDate=d;
    }
  });
  return {
    cantidad:ventas.length,
    total:ventas.reduce((s,v)=>s+Number(v.total||0),0),
    ultimaFecha:ultimaDate ? fechaApi_(ultimaDate) : '',
    ultimaDate:ultimaDate || ''
  };
}

function validarClienteDuplicadoMD20_(hoja,id,telefono,correo) {
  if (hoja.getLastRow()<=1) return;
  const valores=hoja.getRange(2,1,hoja.getLastRow()-1,5).getDisplayValues();
  valores.forEach(f=>{
    if (String(f[0])===String(id)) return;
    if (telefono && String(f[2]).replace(/\D/g,'')===telefono) {
      throw new Error('Ya existe un cliente con ese WhatsApp.');
    }
    if (correo && String(f[4]).trim().toLowerCase()===correo.toLowerCase()) {
      throw new Error('Ya existe un cliente con ese correo.');
    }
  });
}

function buscarFilaClienteMD20_(hoja,id) {
  if (!hoja || hoja.getLastRow()<=1 || !id) return 0;
  const ids=hoja.getRange(2,1,hoja.getLastRow()-1,1).getDisplayValues().flat();
  const i=ids.indexOf(id);
  return i<0 ? 0 : i+2;
}

function primeraFilaLibreClienteMD20_(hoja) {
  const ids=hoja.getRange(2,1,hoja.getMaxRows()-1,1).getDisplayValues().flat();
  const i=ids.findIndex(v=>String(v||'').trim()==='');
  if (i>=0) return i+2;
  const max=hoja.getMaxRows();
  hoja.insertRowsAfter(max,100);
  return max+1;
}

function generarIdClienteMD20_() {
  return 'CLI-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
}

function convertirFechaClienteMD20_(valor) {
  if (!valor) return '';
  if (valor instanceof Date && !isNaN(valor)) return valor;
  const p=String(valor).split('-').map(Number);
  if (p.length!==3 || !p[0] || !p[1] || !p[2]) return '';
  return new Date(p[0],p[1]-1,p[2]);
}


/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — MÓDULO DE PRODUCTOS
 * Ejecuta una vez: prepararModuloProductosMD20
 * =========================================================
 */
function prepararModuloProductosMD20(){
  const l=md20LibroEstable_(),h=l.getSheetByName('PRODUCTOS');
  if(!h)throw new Error('No existe la pestaña PRODUCTOS.');
  aplicarValidaciones_(l);aplicarFormatosEspeciales_(l);
  SpreadsheetApp.getUi().alert('Productos listos','La pestaña PRODUCTOS quedó conectada con la página.',SpreadsheetApp.getUi().ButtonSet.OK);
}
function listarCategoriasMD20_(){
  const h=md20LibroEstable_().getSheetByName('CATEGORIAS');
  if(!h||h.getLastRow()<=1)return[];
  return h.getRange(2,1,h.getLastRow()-1,8).getValues().filter(f=>f[0]&&f[6]!=='INACTIVO').map(f=>({id:String(f[0]),nombre:String(f[1]),descripcion:String(f[2]||''),icono:String(f[3]||''),color:String(f[4]||'')}));
}
function listarProductosMD20_(){
  const l=md20LibroEstable_(),h=l.getSheetByName('PRODUCTOS');
  if(!h||h.getLastRow()<=1)return[];
  const cats={};listarCategoriasMD20_().forEach(c=>cats[c.id]=c.nombre);
  return h.getRange(2,1,h.getLastRow()-1,18).getValues().filter(f=>f[0]).map(f=>({
    id:String(f[0]),nombre:String(f[1]||''),descripcion:String(f[2]||''),categoriaId:String(f[3]||''),
    categoriaNombre:cats[String(f[3]||'')]||String(f[3]||''),tipoProducto:String(f[4]||'DIGITAL'),
    tipoEntrega:String(f[5]||'PDF'),precioCompra:Number(f[6]||0),precioVenta:Number(f[7]||0),
    moneda:String(f[8]||'USD'),duracionDias:Number(f[9]||0),stockMinimo:Number(f[10]||0),
    controlarStock:String(f[11]||'NO'),archivoId:String(f[12]||''),imagenUrl:String(f[13]||''),
    estado:String(f[14]||'ACTIVO'),creadoPor:String(f[15]||''),creadoEn:fechaHoraApi_(f[16]),actualizadoEn:fechaHoraApi_(f[17])
  }));
}
function guardarProductoMD20_(r){
  const h=md20LibroEstable_().getSheetByName('PRODUCTOS');
  if(!h)throw new Error('No existe la pestaña PRODUCTOS.');
  const nombre=String(r.nombre||'').trim(),cat=String(r.categoriaId||'').trim();
  if(!nombre)throw new Error('El nombre es obligatorio.');
  if(!cat)throw new Error('La categoría es obligatoria.');
  const precio=Number(r.precioVenta||0);if(precio<0)throw new Error('El precio no es válido.');
  const id=String(r.id||'').trim()||'PRO-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
  const fila=buscarFilaProductoMD20_(h,id),ahora=new Date(),creado=fila?h.getRange(fila,17).getValue()||ahora:ahora;
  const valores=[id,nombre,String(r.descripcion||'').trim(),cat,String(r.tipoProducto||'DIGITAL').toUpperCase(),
    String(r.tipoEntrega||'PDF').toUpperCase(),Number(r.precioCompra||0),precio,String(r.moneda||'USD').toUpperCase(),
    Number(r.duracionDias||0),Number(r.stockMinimo||0),String(r.controlarStock||'NO').toUpperCase(),
    String(r.archivoId||'').trim(),String(r.imagenUrl||'').trim(),String(r.estado||'ACTIVO').toUpperCase(),
    'ADMINISTRADOR',creado,ahora];
  const n=fila||primeraFilaLibreProductoMD20_(h);h.getRange(n,1,1,18).setValues([valores]);
  h.getRange(n,7,1,2).setNumberFormat('#,##0.00');h.getRange(n,17,1,2).setNumberFormat('dd/MM/yyyy HH:mm');
  SpreadsheetApp.flush();return listarProductosMD20_().find(p=>p.id===id);
}
function desactivarProductoMD20_(id){
  const h=md20LibroEstable_().getSheetByName('PRODUCTOS'),f=buscarFilaProductoMD20_(h,String(id||''));
  if(!f)throw new Error('No se encontró el producto.');h.getRange(f,15).setValue('INACTIVO');h.getRange(f,18).setValue(new Date());
}
function buscarFilaProductoMD20_(h,id){
  if(!h||h.getLastRow()<=1||!id)return 0;const ids=h.getRange(2,1,h.getLastRow()-1,1).getDisplayValues().flat(),i=ids.indexOf(id);return i<0?0:i+2;
}
function primeraFilaLibreProductoMD20_(h){
  const ids=h.getRange(2,1,h.getMaxRows()-1,1).getDisplayValues().flat(),i=ids.findIndex(v=>String(v||'').trim()==='');
  if(i>=0)return i+2;const m=h.getMaxRows();h.insertRowsAfter(m,100);return m+1;
}


/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — MÓDULO COMPLETO DE VENTAS
 * Ejecuta una vez: prepararModuloVentasMD20
 * =========================================================
 */
function prepararModuloVentasMD20(){
  const l=md20LibroEstable_();
  ['VENTAS','DETALLE_VENTAS','PAGOS','ENTREGAS'].forEach(n=>{
    if(!l.getSheetByName(n))throw new Error('No existe la pestaña '+n+'.');
  });
  aplicarValidaciones_(l);
  aplicarFormatosEspeciales_(l);
  SpreadsheetApp.getUi().alert('Ventas listas','El módulo de Ventas quedó preparado para registrar pagos pendientes y confirmarlos.',SpreadsheetApp.getUi().ButtonSet.OK);
}

function listarMetodosPagoMD20_(){
  const h=md20LibroEstable_().getSheetByName('METODOS_PAGO');
  if(!h||h.getLastRow()<=1)return[];
  return h.getRange(2,1,h.getLastRow()-1,13).getValues()
    .filter(f=>f[0]&&String(f[11]||'ACTIVO')==='ACTIVO')
    .map(f=>({id:String(f[0]),nombre:String(f[1]||''),tipo:String(f[2]||''),moneda:String(f[3]||'USD')}));
}

function listarVentasMD20_(){
  const l=md20LibroEstable_(),hv=l.getSheetByName('VENTAS'),hd=l.getSheetByName('DETALLE_VENTAS'),hp=l.getSheetByName('PAGOS');
  if(!hv||hv.getLastRow()<=1)return[];
  const clientes={};listarClientesMD20_().forEach(c=>clientes[c.id]=c);
  const productos={};listarProductosMD20_().forEach(p=>productos[p.id]=p);
  const metodos={};listarMetodosPagoMD20_().forEach(m=>metodos[m.id]=m.nombre);
  const detalles={};
  if(hd&&hd.getLastRow()>1){
    hd.getRange(2,1,hd.getLastRow()-1,14).getValues().forEach(f=>{
      if(!f[1])return;
      detalles[String(f[1])]={detalleId:String(f[0]||''),productoId:String(f[2]||''),descripcion:String(f[5]||''),cantidad:Number(f[6]||0),precioUnitario:Number(f[7]||0),descuento:Number(f[8]||0),subtotal:Number(f[9]||0),duracionDias:Number(f[10]||0),fechaInicio:fechaApi_(f[11]),fechaVencimiento:fechaApi_(f[12])};
    });
  }
  const pagos={};
  if(hp&&hp.getLastRow()>1){
    hp.getRange(2,1,hp.getLastRow()-1,16).getValues().forEach(f=>{if(f[1])pagos[String(f[1])]={pagoId:String(f[0]||''),metodoPagoId:String(f[6]||''),referencia:String(f[7]||''),comprobanteUrl:String(f[10]||''),estado:String(f[11]||'PENDIENTE')};});
  }
  return hv.getRange(2,1,hv.getLastRow()-1,18).getValues().filter(f=>f[0]).map(f=>{
    const d=detalles[String(f[0])]||{},c=clientes[String(f[2])]||{},p=productos[d.productoId]||{},pg=pagos[String(f[0])]||{};
    return {id:String(f[0]),numeroVenta:String(f[1]||''),clienteId:String(f[2]||''),clienteNombre:String(c.nombreCompleto||'Cliente no encontrado'),clienteTelefono:String(c.telefono||''),fechaVenta:fechaApi_(f[3]),subtotal:Number(f[4]||0),descuento:Number(f[5]||0),total:Number(f[6]||0),moneda:String(f[7]||'USD'),montoPagado:Number(f[8]||0),saldoPendiente:Number(f[9]||0),estadoPago:String(f[10]||'PENDIENTE'),estadoEntrega:String(f[11]||'PENDIENTE'),metodoPagoId:String(f[12]||pg.metodoPagoId||''),metodoPagoNombre:metodos[String(f[12]||pg.metodoPagoId||'')]||'',canalVenta:String(f[14]||''),notas:String(f[15]||''),productoId:d.productoId||'',productoNombre:String(p.nombre||d.descripcion||'Producto no encontrado'),cantidad:Number(d.cantidad||0),precioUnitario:Number(d.precioUnitario||0),duracionDias:Number(d.duracionDias||0),referencia:pg.referencia||'',comprobanteUrl:pg.comprobanteUrl||'',creadoEn:fechaHoraApi_(f[16]),actualizadoEn:fechaHoraApi_(f[17])};
  }).sort((a,b)=>String(b.creadoEn).localeCompare(String(a.creadoEn)));
}

function crearVentaMD20_(r){
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    const l=md20LibroEstable_(),hv=l.getSheetByName('VENTAS'),hd=l.getSheetByName('DETALLE_VENTAS'),hp=l.getSheetByName('PAGOS');
    if(!hv||!hd||!hp)throw new Error('Las pestañas de ventas no están preparadas.');
    const clienteId=String(r.clienteId||'').trim(),productoId=String(r.productoId||'').trim();
    if(!clienteId||!productoId)throw new Error('Cliente y producto son obligatorios.');
    const cliente=listarClientesMD20_().find(x=>x.id===clienteId),producto=listarProductosMD20_().find(x=>x.id===productoId);
    if(!cliente)throw new Error('No se encontró el cliente.');
    if(!producto||producto.estado!=='ACTIVO')throw new Error('El producto no está disponible.');
    const cantidad=Math.max(1,Number(r.cantidad||1)),precio=Math.max(0,Number(r.precioUnitario||producto.precioVenta||0)),descuento=Math.max(0,Number(r.descuento||0)),subtotal=cantidad*precio,total=Math.max(0,subtotal-descuento);
    const ahora=new Date(),ventaId='VEN-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),numero=generarNumeroVentaMD20_(hv),detalleId='DET-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),pagoId='PAG-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),moneda=String(r.moneda||producto.moneda||'USD').toUpperCase(),metodo=String(r.metodoPagoId||'').trim();
    hv.appendRow([ventaId,numero,clienteId,ahora,subtotal,descuento,total,moneda,0,total,'PENDIENTE','PENDIENTE',metodo,'ADMINISTRADOR',String(r.canalVenta||'WHATSAPP').toUpperCase(),String(r.notas||'').trim(),ahora,ahora]);
    hd.appendRow([detalleId,ventaId,productoId,'','',producto.nombre,cantidad,precio,descuento,total,Number(r.duracionDias||producto.duracionDias||0),ahora,'','PENDIENTE']);
    hp.appendRow([pagoId,ventaId,clienteId,ahora,total,moneda,metodo,String(r.referencia||'').trim(),'','',String(r.comprobanteUrl||'').trim(),'PENDIENTE','', '',String(r.notas||'').trim(),ahora]);
    registrarLogVentaMD20_('CREAR_VENTA',ventaId,'Venta '+numero+' registrada como pendiente.');
    SpreadsheetApp.flush();
    return listarVentasMD20_().find(v=>v.id===ventaId);
  }finally{lock.releaseLock();}
}

function cambiarEstadoPagoVentaMD20_(ventaId,estado){
  const permitido=['PAGADO','RECHAZADO'];estado=String(estado||'').toUpperCase();
  if(!permitido.includes(estado))throw new Error('Estado de pago no válido.');
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    const l=md20LibroEstable_(),hv=l.getSheetByName('VENTAS'),hp=l.getSheetByName('PAGOS'),he=l.getSheetByName('ENTREGAS');
    const fv=buscarFilaPorValorMD20_(hv,1,String(ventaId||''));if(!fv)throw new Error('No se encontró la venta.');
    const actual=String(hv.getRange(fv,11).getValue()||'');
    if(actual===estado)return listarVentasMD20_().find(v=>v.id===ventaId);
    const total=Number(hv.getRange(fv,7).getValue()||0),ahora=new Date();
    hv.getRange(fv,9).setValue(estado==='PAGADO'?total:0);
    hv.getRange(fv,10).setValue(estado==='PAGADO'?0:total);
    hv.getRange(fv,11).setValue(estado);
    hv.getRange(fv,12).setValue(estado==='PAGADO'?'PENDIENTE':'CANCELADO');
    hv.getRange(fv,18).setValue(ahora);
    const fp=buscarFilaPorValorMD20_(hp,2,String(ventaId||''));
    if(fp){hp.getRange(fp,12).setValue(estado==='PAGADO'?'CONFIRMADO':'RECHAZADO');hp.getRange(fp,13).setValue('ADMINISTRADOR');hp.getRange(fp,14).setValue(ahora);}
    if(estado==='PAGADO'&&he){
      const existe=buscarFilaPorValorMD20_(he,2,String(ventaId||''));
      if(!existe){
        const detalle=obtenerDetalleVentaMD20_(ventaId),clienteId=String(hv.getRange(fv,3).getValue()||'');
        he.appendRow(['ENT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),ventaId,detalle.detalleId||'',clienteId,detalle.productoId||'','', '', '', '', '', '', '', '', '', '', '', '', 'PENDIENTE','Entrega creada automáticamente al confirmar el pago.']);
      }
    }
    registrarLogVentaMD20_('CAMBIAR_ESTADO_PAGO',ventaId,'Pago cambiado a '+estado+'.');
    SpreadsheetApp.flush();
    return listarVentasMD20_().find(v=>v.id===ventaId);
  }finally{lock.releaseLock();}
}

function obtenerDetalleVentaMD20_(ventaId){
  const h=md20LibroEstable_().getSheetByName('DETALLE_VENTAS');
  if(!h||h.getLastRow()<=1)return{};
  const filas=h.getRange(2,1,h.getLastRow()-1,14).getValues(),f=filas.find(x=>String(x[1]||'')===String(ventaId));
  return f?{detalleId:String(f[0]||''),productoId:String(f[2]||'')}:{};
}

function generarNumeroVentaMD20_(h){
  const tz=Session.getScriptTimeZone(),fecha=Utilities.formatDate(new Date(),tz,'yyyyMMdd');
  let secuencia=1;
  if(h.getLastRow()>1){
    const numeros=h.getRange(2,2,h.getLastRow()-1,1).getDisplayValues().flat().filter(v=>String(v).startsWith('MD-'+fecha+'-'));
    secuencia=numeros.length+1;
  }
  return 'MD-'+fecha+'-'+String(secuencia).padStart(4,'0');
}

function buscarFilaPorValorMD20_(h,columna,valor){
  if(!h||h.getLastRow()<=1||!valor)return 0;
  const datos=h.getRange(2,columna,h.getLastRow()-1,1).getDisplayValues().flat(),i=datos.indexOf(valor);
  return i<0?0:i+2;
}

function registrarLogVentaMD20_(accion,registroId,detalle){
  const h=md20LibroEstable_().getSheetByName('LOGS');
  if(h)h.appendRow(['LOG-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),new Date(),'ADMINISTRADOR',accion,'VENTAS',registroId,detalle,'OK']);
}


/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — SUSCRIPCIONES Y CUENTAS ASIGNADAS
 * Ejecuta una vez: prepararModuloSuscripcionesMD20
 * =========================================================
 */
const MD20_SUSCRIPCIONES_EXT = {
  ENCABEZADOS: [
    'SUSCRIPCION_ID','CLIENTE_ID','VENTA_ID','PRODUCTO_ID','CUENTA_ID',
    'FECHA_INICIO','FECHA_VENCIMIENTO','DIAS_RESTANTES','PRECIO_RENOVACION',
    'MONEDA','RENOVACION_AUTOMATICA','AVISO_ENVIADO','ULTIMO_AVISO','ESTADO',
    'NOTAS','CREADO_EN','ACTUALIZADO_EN','PROVEEDOR_ID','PLATAFORMA',
    'TIPO_CUENTA','USUARIO_CUENTA','CONTRASENA_CUENTA','PERFIL','PIN',
    'TIEMPO_MESES','ESTADO_RENOVACION','RESPUESTA_CLIENTE','FECHA_RESPUESTA'
  ]
};

function prepararModuloSuscripcionesMD20(){
  const l=md20LibroEstable_();
  let h=l.getSheetByName('SUSCRIPCIONES');
  if(!h)h=l.insertSheet('SUSCRIPCIONES');
  const enc=MD20_SUSCRIPCIONES_EXT.ENCABEZADOS;
  if(h.getMaxColumns()<enc.length)h.insertColumnsAfter(h.getMaxColumns(),enc.length-h.getMaxColumns());
  if(h.getMaxRows()<1000)h.insertRowsAfter(h.getMaxRows(),1000-h.getMaxRows());

  const anteriores=h.getRange(1,1,1,h.getLastColumn()).getDisplayValues()[0];
  const filaEnc=enc.slice();
  h.getRange(1,1,1,filaEnc.length).setValues([filaEnc]);

  h.setFrozenRows(1);h.setFrozenColumns(1);h.setTabColor('#FFAB00');h.setRowHeight(1,44);
  h.getRange(1,1,1,enc.length).setBackground('#101014').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true).setBorder(true,true,true,true,true,true,'#FF6D00',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  h.getRange(2,1,h.getMaxRows()-1,enc.length).setFontFamily('Arial').setFontSize(11).setVerticalAlignment('middle').setBorder(true,true,true,true,true,true,'#D9D9DE',SpreadsheetApp.BorderStyle.SOLID);

  const anchos=[150,150,150,150,150,145,155,120,145,100,150,130,155,130,260,155,155,150,160,160,230,190,130,100,130,180,180,160];
  anchos.forEach((a,i)=>h.setColumnWidth(i+1,a));

  h.getRange(2,6,h.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy');
  h.getRange(2,9,h.getMaxRows()-1,1).setNumberFormat('#,##0.00');
  h.getRange(2,13,h.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  h.getRange(2,16,h.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy HH:mm');
  h.getRange(2,28,h.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  h.getRange(2,21,h.getMaxRows()-1,4).setNumberFormat('@');

  aplicarValidacionSuscripcionesMD20_(h,11,['SI','NO']);
  aplicarValidacionSuscripcionesMD20_(h,12,['SI','NO']);
  aplicarValidacionSuscripcionesMD20_(h,14,['ACTIVA','POR_VENCER','VENCIDA','SUSPENDIDA','CANCELADA']);
  aplicarValidacionSuscripcionesMD20_(h,20,['CUENTA_COMPLETA','PANTALLA','PERFIL','ACCESO']);
  aplicarValidacionSuscripcionesMD20_(h,25,['1','2','3','6','12']);
  aplicarValidacionSuscripcionesMD20_(h,26,['SIN_RESPUESTA','DESEA_RENOVAR','NO_DESEA_RENOVAR','RENOVACION_PENDIENTE','RENOVADA','CORTAR_SERVICIO','SERVICIO_CORTADO']);
  aplicarListasDinamicasSuscripcionesMD20_(l,h);

  if(h.getFilter())h.getFilter().remove();
  h.getRange(1,1,h.getMaxRows(),enc.length).createFilter();
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Suscripciones listas','Ya puedes relacionar cliente, producto, proveedor, cuenta y vencimiento.',SpreadsheetApp.getUi().ButtonSet.OK);
}

function aplicarValidacionSuscripcionesMD20_(h,col,valores){
  const regla=SpreadsheetApp.newDataValidation().requireValueInList(valores,true).setAllowInvalid(false).build();
  h.getRange(2,col,h.getMaxRows()-1,1).setDataValidation(regla);
}


/**
 * Devuelve solo las cuentas disponibles para asignación.
 * El proveedor se utiliza únicamente en el panel administrativo.
 */
function listarCuentasDisponiblesMD20_(){
  const h=md20LibroEstable_().getSheetByName('CUENTAS_DIGITALES');
  if(!h||h.getLastRow()<=1)return[];
  return h.getRange(2,1,h.getLastRow()-1,21).getValues()
    .filter(f=>f[0]&&['DISPONIBLE','ACTIVA','ACTIVO'].includes(String(f[17]||'DISPONIBLE').toUpperCase()))
    .map(f=>({
      id:String(f[0]||''),productoId:String(f[1]||''),proveedorId:String(f[2]||''),
      plataforma:String(f[3]||''),tipoCuenta:String(f[4]||'ACCESO'),
      usuarioCuenta:String(f[5]||''),contrasenaCuenta:String(f[6]||''),
      perfil:String(f[9]||''),pin:String(f[10]||''),
      pantallasTotales:Number(f[11]||0),pantallasDisponibles:Number(f[12]||0),
      fechaCompra:fechaApi_(f[13]),fechaVencimiento:fechaApi_(f[14]),
      costo:Number(f[15]||0),moneda:String(f[16]||'USD'),estado:String(f[17]||'DISPONIBLE')
    }));
}

/**
 * Crea listas desplegables en Google Sheets usando las cuentas y proveedores existentes.
 */
function aplicarListasDinamicasSuscripcionesMD20_(libro,hojaSuscripciones){
  const hojaCuentas=libro.getSheetByName('CUENTAS_DIGITALES');
  const hojaProveedores=libro.getSheetByName('PROVEEDORES');

  if(hojaCuentas&&hojaCuentas.getLastRow()>1){
    const rangoCuentas=hojaCuentas.getRange(2,1,Math.max(1,hojaCuentas.getLastRow()-1),1);
    const reglaCuentas=SpreadsheetApp.newDataValidation()
      .requireValueInRange(rangoCuentas,true)
      .setAllowInvalid(true)
      .setHelpText('Selecciona una cuenta registrada en CUENTAS_DIGITALES.')
      .build();
    hojaSuscripciones.getRange(2,5,hojaSuscripciones.getMaxRows()-1,1).setDataValidation(reglaCuentas);
  }

  if(hojaProveedores&&hojaProveedores.getLastRow()>1){
    const rangoProveedores=hojaProveedores.getRange(2,1,Math.max(1,hojaProveedores.getLastRow()-1),1);
    const reglaProveedores=SpreadsheetApp.newDataValidation()
      .requireValueInRange(rangoProveedores,true)
      .setAllowInvalid(true)
      .setHelpText('Información privada para administración.')
      .build();
    hojaSuscripciones.getRange(2,18,hojaSuscripciones.getMaxRows()-1,1).setDataValidation(reglaProveedores);
  }
}

/**
 * Cambia el estado de una cuenta cuando se asigna a una suscripción.
 */
function actualizarEstadoCuentaAsignadaMD20_(cuentaId,estado){
  if(!cuentaId)return;
  const h=md20LibroEstable_().getSheetByName('CUENTAS_DIGITALES');
  if(!h||h.getLastRow()<=1)return;
  const fila=buscarFilaPorValorMD20_(h,1,String(cuentaId));
  if(!fila)return;
  h.getRange(fila,18).setValue(estado);
  h.getRange(fila,21).setValue(new Date());
}

function listarSuscripcionesMD20_(){
  const l=md20LibroEstable_(),h=l.getSheetByName('SUSCRIPCIONES');
  if(!h||h.getLastRow()<=1)return[];
  const clientes={};listarClientesMD20_().forEach(c=>clientes[c.id]=c);
  const productos={};listarProductosMD20_().forEach(p=>productos[p.id]=p);
  const proveedores={};listarSocios_('PROVEEDOR').forEach(p=>proveedores[p.id]=p);
  return h.getRange(2,1,h.getLastRow()-1,MD20_SUSCRIPCIONES_EXT.ENCABEZADOS.length).getValues()
    .filter(f=>f[0]).map(f=>{
      const dias=calcularDias_(f[6]),estado=calcularEstadoSuscripcionMD20_(f[6],String(f[13]||''));
      const c=clientes[String(f[1]) ]||{},p=productos[String(f[3]) ]||{},pr=proveedores[String(f[17]) ]||{};
      return {
        id:String(f[0]),clienteId:String(f[1]||''),ventaId:String(f[2]||''),productoId:String(f[3]||''),cuentaId:String(f[4]||''),
        clienteNombre:String(c.nombreCompleto||''),clienteTelefono:String(c.telefono||''),productoNombre:String(p.nombre||''),
        fechaInicio:fechaApi_(f[5]),fechaVencimiento:fechaApi_(f[6]),diasRestantes:dias,precioRenovacion:Number(f[8]||0),
        moneda:String(f[9]||'USD'),renovacionAutomatica:String(f[10]||'NO'),avisoEnviado:String(f[11]||'NO'),
        ultimoAviso:fechaHoraApi_(f[12]),estado:estado,notas:String(f[14]||''),creadoEn:fechaHoraApi_(f[15]),
        actualizadoEn:fechaHoraApi_(f[16]),proveedorId:String(f[17]||''),proveedorNombre:[pr.nombre,pr.apellido].filter(Boolean).join(' '),
        proveedorWhatsapp:String(pr.whatsapp||''),/* DATOS PRIVADOS: solo panel administrativo */plataforma:String(f[18]||''),tipoCuenta:String(f[19]||'ACCESO'),
        usuarioCuenta:String(f[20]||''),contrasenaCuenta:String(f[21]||''),perfil:String(f[22]||''),pin:String(f[23]||''),
        tiempoMeses:String(f[24]||'1'),estadoRenovacion:String(f[25]||'SIN_RESPUESTA'),respuestaCliente:String(f[26]||''),
        fechaRespuesta:fechaHoraApi_(f[27])
      };
    });
}

function guardarSuscripcionMD20_(r){
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    const h=md20LibroEstable_().getSheetByName('SUSCRIPCIONES');
    if(!h)throw new Error('La pestaña SUSCRIPCIONES no está preparada.');
    const clienteId=String(r.clienteId||'').trim(),productoId=String(r.productoId||'').trim();
    if(!clienteId||!productoId)throw new Error('Cliente y producto son obligatorios.');
    const inicio=convertirFecha_(r.fechaInicio),meses=Number(r.tiempoMeses||1),vence=sumarMesesSeguro_(inicio,meses),dias=calcularDias_(vence);
    const id=String(r.id||'').trim()||'SUS-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
    const fila=buscarFilaPorValorMD20_(h,1,id),ahora=new Date(),creado=fila?h.getRange(fila,16).getValue()||ahora:ahora;
    const cuentaAnterior=fila?String(h.getRange(fila,5).getValue()||''):'';
    const estado=calcularEstadoSuscripcionMD20_(vence,String(r.estado||''));
    const valores=[id,clienteId,String(r.ventaId||'').trim(),productoId,String(r.cuentaId||'').trim(),inicio,vence,dias,Number(r.precioRenovacion||0),String(r.moneda||'USD').toUpperCase(),String(r.renovacionAutomatica||'NO').toUpperCase(),'NO','',estado,String(r.notas||'').trim(),creado,ahora,String(r.proveedorId||'').trim(),String(r.plataforma||'').trim(),String(r.tipoCuenta||'ACCESO').toUpperCase(),String(r.usuarioCuenta||'').trim(),String(r.contrasenaCuenta||'').trim(),String(r.perfil||'').trim(),String(r.pin||'').trim(),meses,String(r.estadoRenovacion||'SIN_RESPUESTA').toUpperCase(),'', ''];
    const n=fila||primeraFilaLibreSuscripcionMD20_(h);
    h.getRange(n,1,1,valores.length).setValues([valores]);
    h.getRange(n,6,1,2).setNumberFormat('dd/MM/yyyy');
    h.getRange(n,9).setNumberFormat('#,##0.00');
    h.getRange(n,16,1,2).setNumberFormat('dd/MM/yyyy HH:mm');
    if(cuentaAnterior&&cuentaAnterior!==String(r.cuentaId||''))actualizarEstadoCuentaAsignadaMD20_(cuentaAnterior,'DISPONIBLE');
    if(String(r.cuentaId||'').trim())actualizarEstadoCuentaAsignadaMD20_(String(r.cuentaId||'').trim(),'ASIGNADA');
    registrarLogVentaMD20_('GUARDAR_SUSCRIPCION',id,'Suscripción guardada para cliente '+clienteId+'.');
    SpreadsheetApp.flush();
    return listarSuscripcionesMD20_().find(x=>x.id===id);
  }finally{lock.releaseLock();}
}

function primeraFilaLibreSuscripcionMD20_(h){
  const ids=h.getRange(2,1,h.getMaxRows()-1,1).getDisplayValues().flat(),i=ids.findIndex(v=>String(v||'').trim()==='');
  if(i>=0)return i+2;const m=h.getMaxRows();h.insertRowsAfter(m,100);return m+1;
}

function calcularEstadoSuscripcionMD20_(fecha,actual){
  if(['SUSPENDIDA','CANCELADA'].includes(actual))return actual;
  const d=calcularDias_(fecha);
  if(d<0)return 'VENCIDA';
  if(d<=3)return 'POR_VENCER';
  return 'ACTIVA';
}

function actualizarEstadosSuscripcionesMD20(){
  const h=md20LibroEstable_().getSheetByName('SUSCRIPCIONES');
  if(!h||h.getLastRow()<=1)return;
  const filas=h.getRange(2,1,h.getLastRow()-1,MD20_SUSCRIPCIONES_EXT.ENCABEZADOS.length).getValues();
  filas.forEach((f,i)=>{
    if(!f[0])return;
    const fila=i+2,dias=calcularDias_(f[6]),estado=calcularEstadoSuscripcionMD20_(f[6],String(f[13]||''));
    h.getRange(fila,8).setValue(dias);
    h.getRange(fila,14).setValue(estado);
    h.getRange(fila,17).setValue(new Date());
  });
  SpreadsheetApp.flush();
}



/**
 * =========================================================
 * MENÚ DESPLEGABLE DE PRODUCTOS EN CUENTAS_DIGITALES
 * =========================================================
 * Ejecuta una sola vez:
 * prepararMenuProductosCuentasMD20
 *
 * Agrega PRODUCTO_NOMBRE al final de CUENTAS_DIGITALES.
 * El menú muestra todos los productos activos.
 * Al seleccionar un nombre completa PRODUCTO_ID y PLATAFORMA.
 */
function prepararMenuProductosCuentasMD20(mostrarAlerta) {
  mostrarAlerta = mostrarAlerta !== false;
  const libro = md20LibroEstable_();
  const hojaCuentas = libro.getSheetByName('CUENTAS_DIGITALES');
  const hojaProductos = libro.getSheetByName('PRODUCTOS');

  if (!hojaCuentas) {
    throw new Error('No existe la pestaña CUENTAS_DIGITALES.');
  }

  if (!hojaProductos) {
    throw new Error('No existe la pestaña PRODUCTOS.');
  }

  let encabezados = hojaCuentas
    .getRange(1, 1, 1, hojaCuentas.getLastColumn())
    .getDisplayValues()[0];

  let columnaProductoNombre = encabezados.indexOf('PRODUCTO_NOMBRE') + 1;

  if (!columnaProductoNombre) {
    columnaProductoNombre = hojaCuentas.getLastColumn() + 1;

    if (hojaCuentas.getMaxColumns() < columnaProductoNombre) {
      hojaCuentas.insertColumnAfter(hojaCuentas.getMaxColumns());
    }

    hojaCuentas
      .getRange(1, columnaProductoNombre)
      .setValue('PRODUCTO_NOMBRE');
  }

  hojaCuentas.setColumnWidth(columnaProductoNombre, 240);

  hojaCuentas
    .getRange(1, columnaProductoNombre)
    .setBackground('#101014')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      '#FF6D00',
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );

  const productos = obtenerProductosActivosMenuMD20_();

  if (!productos.length) {
    throw new Error(
      'No existen productos activos en la pestaña PRODUCTOS.'
    );
  }

  const nombres = productos.map(producto => producto.nombre);

  const regla = SpreadsheetApp
    .newDataValidation()
    .requireValueInList(nombres, true)
    .setAllowInvalid(false)
    .setHelpText(
      'Selecciona uno de los productos activos registrados en PRODUCTOS.'
    )
    .build();

  hojaCuentas
    .getRange(
      2,
      columnaProductoNombre,
      hojaCuentas.getMaxRows() - 1,
      1
    )
    .setDataValidation(regla)
    .setNumberFormat('@');

  // Completar el nombre visible de las cuentas ya registradas.
  if (hojaCuentas.getLastRow() > 1) {
    const filas = hojaCuentas
      .getRange(
        2,
        1,
        hojaCuentas.getLastRow() - 1,
        hojaCuentas.getLastColumn()
      )
      .getValues();

    const mapaPorId = {};
    productos.forEach(producto => {
      mapaPorId[producto.id] = producto.nombre;
    });

    const nombresActuales = filas.map(fila => [
      mapaPorId[String(fila[1] || '').trim()] || ''
    ]);

    hojaCuentas
      .getRange(2, columnaProductoNombre, nombresActuales.length, 1)
      .setValues(nombresActuales);
  }

  SpreadsheetApp.flush();

  if (mostrarAlerta) {
    try {
      SpreadsheetApp.getUi().alert(
        'Menú de productos listo',
        'En CUENTAS_DIGITALES se agregó la columna PRODUCTO_NOMBRE.\n\n' +
        'Ahora puedes seleccionar cualquier producto activo desde el menú desplegable.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } catch (error) {
      console.log('Menú de productos preparado sin mostrar alerta: ' + error.message);
    }
  }
}


/**
 * Devuelve los productos activos con ID y nombre.
 */
function obtenerProductosActivosMenuMD20_() {
  const hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('PRODUCTOS');

  if (!hoja || hoja.getLastRow() <= 1) {
    return [];
  }

  return hoja
    .getRange(2, 1, hoja.getLastRow() - 1, 18)
    .getValues()
    .filter(fila =>
      String(fila[0] || '').trim() !== '' &&
      String(fila[14] || 'ACTIVO').toUpperCase() === 'ACTIVO'
    )
    .map(fila => ({
      id: String(fila[0] || '').trim(),
      nombre: String(fila[1] || '').trim(),
      tipoProducto: String(fila[4] || '').trim(),
      tipoEntrega: String(fila[5] || '').trim()
    }))
    .filter(producto => producto.nombre);
}


/**
 * Se ejecuta desde el onEdit principal.
 * Al seleccionar PRODUCTO_NOMBRE completa:
 * - PRODUCTO_ID
 * - PLATAFORMA
 */
function manejarMenuProductoCuentaMD20_(e) {
  if (!e || !e.range) {
    return;
  }

  const hoja = e.range.getSheet();

  if (
    hoja.getName() !== 'CUENTAS_DIGITALES' ||
    e.range.getRow() < 2
  ) {
    return;
  }

  const encabezados = hoja
    .getRange(1, 1, 1, hoja.getLastColumn())
    .getDisplayValues()[0];

  const columnaProductoNombre =
    encabezados.indexOf('PRODUCTO_NOMBRE') + 1;

  if (
    !columnaProductoNombre ||
    e.range.getColumn() !== columnaProductoNombre
  ) {
    return;
  }

  const nombreSeleccionado = String(
    e.range.getDisplayValue() || ''
  ).trim();

  if (!nombreSeleccionado) {
    hoja.getRange(e.range.getRow(), 2).clearContent();
    hoja.getRange(e.range.getRow(), 4).clearContent();
    return;
  }

  const producto = obtenerProductosActivosMenuMD20_()
    .find(item => item.nombre === nombreSeleccionado);

  if (!producto) {
    throw new Error(
      'No se encontró el producto seleccionado.'
    );
  }

  // Columna 2: PRODUCTO_ID
  hoja
    .getRange(e.range.getRow(), 2)
    .setValue(producto.id)
    .setNumberFormat('@');

  // Columna 4: PLATAFORMA
  hoja
    .getRange(e.range.getRow(), 4)
    .setValue(producto.nombre);
}


/**
 * Actualiza el menú cuando se agreguen nuevos productos.
 * Puedes ejecutar esta función cada vez que agregues productos.
 */
function actualizarMenuProductosCuentasMD20() {
  prepararMenuProductosCuentasMD20();
}



/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — PANEL COMPLETO DE CANVA
 * =========================================================
 * Ejecuta una sola vez:
 * prepararPanelCanvaMD20
 */
const MD20_CANVA = {
  EQUIPOS: 'CANVA_EQUIPOS',
  CUENTAS: 'CANVA_CUENTAS',
  ENC_EQUIPOS: [
    'EQUIPO_ID','NOMBRE_EQUIPO','CORREO_ADMINISTRADOR','CAPACIDAD_TOTAL',
    'CUENTAS_OCUPADAS','CUENTAS_DISPONIBLES','PROVEEDOR_ID','ESTADO',
    'NOTAS','CREADO_EN','ACTUALIZADO_EN'
  ],
  ENC_CUENTAS: [
    'CANVA_ID','CLIENTE_ID','NOMBRE_COMPLETO','WHATSAPP','CORREO_CANVA',
    'EQUIPO_ID','NOMBRE_EQUIPO','FECHA_COMPRA','TIEMPO_MESES',
    'DIAS_SERVICIO','FECHA_VENCIMIENTO','TIPO_OPERACION','TIPO_VENDEDOR',
    'REVENDEDOR_ID','VENDEDOR_NOMBRE','PRECIO','MONEDA','ESTADO_PAGO',
    'DIAS_RESTANTES','ESTADO','AVISO_3_DIAS_ENVIADO','ULTIMO_AVISO',
    'RESPUESTA_CLIENTE','NOTAS','CREADO_EN','ACTUALIZADO_EN'
  ]
};

function prepararPanelCanvaMD20(){
  const libro=md20LibroEstable_();
  const equipos=obtenerOCrearHojaCanvaMD20_(libro,MD20_CANVA.EQUIPOS,MD20_CANVA.ENC_EQUIPOS,'#7D2AE8');
  const cuentas=obtenerOCrearHojaCanvaMD20_(libro,MD20_CANVA.CUENTAS,MD20_CANVA.ENC_CUENTAS,'#00C4CC');

  aplicarFormatoCanvaMD20_(equipos,MD20_CANVA.ENC_EQUIPOS,[145,220,240,140,145,155,150,120,280,155,155]);
  aplicarFormatoCanvaMD20_(cuentas,MD20_CANVA.ENC_CUENTAS,[150,150,220,170,240,150,220,145,130,130,155,150,145,150,210,130,100,130,130,130,165,155,180,280,155,155]);

  aplicarValidacionesCanvaMD20_(libro,equipos,cuentas);
  actualizarTodosLosEquiposCanvaMD20_();
  SpreadsheetApp.flush();

  SpreadsheetApp.getUi().alert(
    'Panel de Canva listo',
    'Se crearon CANVA_EQUIPOS y CANVA_CUENTAS con menús, cálculos y control de cupos.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function obtenerOCrearHojaCanvaMD20_(libro,nombre,encabezados,color){
  let hoja=libro.getSheetByName(nombre);
  if(!hoja)hoja=libro.insertSheet(nombre);
  if(hoja.getMaxColumns()<encabezados.length)hoja.insertColumnsAfter(hoja.getMaxColumns(),encabezados.length-hoja.getMaxColumns());
  if(hoja.getMaxRows()<1000)hoja.insertRowsAfter(hoja.getMaxRows(),1000-hoja.getMaxRows());
  hoja.getRange(1,1,1,encabezados.length).setValues([encabezados]);
  hoja.setFrozenRows(1);hoja.setFrozenColumns(1);hoja.setTabColor(color);hoja.setRowHeight(1,44);
  return hoja;
}

function aplicarFormatoCanvaMD20_(hoja,encabezados,anchos){
  hoja.getRange(1,1,1,encabezados.length)
    .setBackground('#101014').setFontColor('#FFFFFF').setFontWeight('bold')
    .setFontSize(11).setHorizontalAlignment('center').setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(true,true,true,true,true,true,'#00C4CC',SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  hoja.getRange(2,1,hoja.getMaxRows()-1,encabezados.length)
    .setFontFamily('Arial').setFontSize(11).setVerticalAlignment('middle')
    .setBorder(true,true,true,true,true,true,'#D9D9DE',SpreadsheetApp.BorderStyle.SOLID);
  anchos.forEach((a,i)=>hoja.setColumnWidth(i+1,a));
  if(hoja.getFilter())hoja.getFilter().remove();
  hoja.getRange(1,1,hoja.getMaxRows(),encabezados.length).createFilter();
}

function aplicarValidacionesCanvaMD20_(libro,equipos,cuentas){
  aplicarValidacionCanvaLista_(equipos,8,['ACTIVO','INACTIVO']);
  aplicarValidacionCanvaLista_(cuentas,9,['1','2','3','4','6','12']);
  aplicarValidacionCanvaLista_(cuentas,12,['NUEVO','RENOVACION']);
  aplicarValidacionCanvaLista_(cuentas,13,['ADMIN','REVENDEDOR']);
  aplicarValidacionCanvaLista_(cuentas,17,['USD','VES','COP']);
  aplicarValidacionCanvaLista_(cuentas,18,['PENDIENTE','PAGADO']);
  aplicarValidacionCanvaLista_(cuentas,20,['ACTIVA','POR_VENCER','VENCIDA','CORTADA','CANCELADA']);
  aplicarValidacionCanvaLista_(cuentas,21,['SI','NO']);

  cuentas.getRange(2,8,cuentas.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy');
  cuentas.getRange(2,11,cuentas.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy');
  cuentas.getRange(2,16,cuentas.getMaxRows()-1,1).setNumberFormat('#,##0.00');
  cuentas.getRange(2,22,cuentas.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  cuentas.getRange(2,25,cuentas.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy HH:mm');
  cuentas.getRange(2,4,cuentas.getMaxRows()-1,2).setNumberFormat('@');

  const rangoEquipos=equipos.getRange(2,1,Math.max(1,equipos.getMaxRows()-1),1);
  const reglaEquipos=SpreadsheetApp.newDataValidation().requireValueInRange(rangoEquipos,true).setAllowInvalid(false).setHelpText('Selecciona un equipo registrado en CANVA_EQUIPOS.').build();
  cuentas.getRange(2,6,cuentas.getMaxRows()-1,1).setDataValidation(reglaEquipos);

  const hojaRevendedores=libro.getSheetByName('REVENDEDORES');
  if(hojaRevendedores&&hojaRevendedores.getLastRow()>1){
    const rango=hojaRevendedores.getRange(2,1,hojaRevendedores.getLastRow()-1,1);
    cuentas.getRange(2,14,cuentas.getMaxRows()-1,1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(rango,true).setAllowInvalid(true).build()
    );
  }

  const hojaProveedores=libro.getSheetByName('PROVEEDORES');
  if(hojaProveedores&&hojaProveedores.getLastRow()>1){
    const rango=hojaProveedores.getRange(2,1,hojaProveedores.getLastRow()-1,1);
    equipos.getRange(2,7,equipos.getMaxRows()-1,1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(rango,true).setAllowInvalid(true).build()
    );
  }
}

function aplicarValidacionCanvaLista_(hoja,col,valores){
  hoja.getRange(2,col,hoja.getMaxRows()-1,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(valores,true).setAllowInvalid(false).build()
  );
}

function listarEquiposCanvaMD20_(){
  const h=md20LibroEstable_().getSheetByName(MD20_CANVA.EQUIPOS);
  if(!h||h.getLastRow()<=1)return[];
  actualizarTodosLosEquiposCanvaMD20_();
  return h.getRange(2,1,h.getLastRow()-1,MD20_CANVA.ENC_EQUIPOS.length).getValues().filter(f=>f[0]).map(f=>({
    id:String(f[0]),nombre:String(f[1]||''),correoAdministrador:String(f[2]||''),
    capacidad:Number(f[3]||0),ocupados:Number(f[4]||0),disponibles:Number(f[5]||0),
    proveedorId:String(f[6]||''),estado:String(f[7]||'ACTIVO'),notas:String(f[8]||''),
    creadoEn:fechaHoraApi_(f[9]),actualizadoEn:fechaHoraApi_(f[10])
  }));
}

function guardarEquipoCanvaMD20_(r){
  const h=md20LibroEstable_().getSheetByName(MD20_CANVA.EQUIPOS);
  if(!h)throw new Error('Ejecuta primero prepararPanelCanvaMD20.');
  const nombre=String(r.nombre||'').trim(),capacidad=Number(r.capacidad||0);
  if(!nombre||capacidad<1)throw new Error('Nombre y capacidad son obligatorios.');
  const id=String(r.id||'').trim()||'CANEQ-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
  const fila=buscarFilaPorValorMD20_(h,1,id),ahora=new Date(),creado=fila?h.getRange(fila,10).getValue()||ahora:ahora;
  const ocupados=contarCuentasActivasEquipoCanvaMD20_(id),disponibles=Math.max(0,capacidad-ocupados);
  const valores=[id,nombre,String(r.correoAdministrador||'').trim(),capacidad,ocupados,disponibles,String(r.proveedorId||'').trim(),String(r.estado||'ACTIVO').toUpperCase(),String(r.notas||'').trim(),creado,ahora];
  const n=fila||primeraFilaLibreCanvaMD20_(h);h.getRange(n,1,1,valores.length).setValues([valores]);
  SpreadsheetApp.flush();return listarEquiposCanvaMD20_().find(x=>x.id===id);
}

function listarCuentasCanvaMD20_(){
  const libro=md20LibroEstable_(),h=libro.getSheetByName(MD20_CANVA.CUENTAS);
  if(!h||h.getLastRow()<=1)return[];
  const equipos={};listarEquiposCanvaMD20_().forEach(e=>equipos[e.id]=e);
  const revendedores={};listarSocios_('REVENDEDOR').forEach(r=>revendedores[r.id]=[r.nombre,r.apellido].filter(Boolean).join(' '));
  return h.getRange(2,1,h.getLastRow()-1,MD20_CANVA.ENC_CUENTAS.length).getValues().filter(f=>f[0]).map(f=>{
    const dias=calcularDiasCanvaMD20_(f[10]),estado=calcularEstadoCanvaMD20_(f[10],String(f[19]||'')),equipo=equipos[String(f[5])]||{};
    return {
      id:String(f[0]),clienteId:String(f[1]||''),nombreCompleto:String(f[2]||''),whatsapp:String(f[3]||''),
      correoCanva:String(f[4]||''),equipoId:String(f[5]||''),equipoNombre:String(equipo.nombre||f[6]||''),
      equipoDisponibles:Number(equipo.disponibles||0),fechaCompra:fechaApi_(f[7]),tiempoMeses:Number(f[8]||1),
      diasServicio:Number(f[9]||30),fechaVencimiento:fechaApi_(f[10]),tipoOperacion:String(f[11]||'NUEVO'),
      tipoVendedor:String(f[12]||'ADMIN'),revendedorId:String(f[13]||''),vendedorNombre:String(f[14]||revendedores[String(f[13])]||'Administrador'),
      precio:Number(f[15]||0),moneda:String(f[16]||'USD'),estadoPago:String(f[17]||'PENDIENTE'),
      diasRestantes:dias,estado:estado,aviso3DiasEnviado:String(f[20]||'NO'),ultimoAviso:fechaHoraApi_(f[21]),
      respuestaCliente:String(f[22]||''),notas:String(f[23]||''),creadoEn:fechaHoraApi_(f[24]),actualizadoEn:fechaHoraApi_(f[25])
    };
  }).sort((a,b)=>String(b.creadoEn).localeCompare(String(a.creadoEn)));
}

function guardarCuentaCanvaMD20_(r){
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    const libro=md20LibroEstable_(),h=libro.getSheetByName(MD20_CANVA.CUENTAS);
    if(!h)throw new Error('Ejecuta primero prepararPanelCanvaMD20.');
    const nombre=String(r.nombreCompleto||'').trim(),whatsapp=String(r.whatsapp||'').replace(/\D/g,''),correo=String(r.correoCanva||'').trim().toLowerCase(),equipoId=String(r.equipoId||'').trim();
    if(!nombre||!whatsapp||!correo||!equipoId)throw new Error('Nombre, WhatsApp, correo y equipo son obligatorios.');
    const equipos=listarEquiposCanvaMD20_(),equipo=equipos.find(e=>e.id===equipoId);
    if(!equipo||equipo.estado!=='ACTIVO')throw new Error('El equipo seleccionado no está disponible.');
    const id=String(r.id||'').trim()||'CAN-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();
    const fila=buscarFilaPorValorMD20_(h,1,id);
    if(!fila&&equipo.disponibles<=0)throw new Error('El equipo seleccionado no tiene cupos disponibles.');
    validarCorreoCanvaDuplicadoMD20_(h,id,correo);
    const fechaCompra=convertirFecha_(r.fechaCompra),meses=Number(r.tiempoMeses||1),diasServicio=meses*30,vence=new Date(fechaCompra);vence.setDate(vence.getDate()+diasServicio);
    const ahora=new Date(),creado=fila?h.getRange(fila,25).getValue()||ahora:ahora,estado=calcularEstadoCanvaMD20_(vence,String(r.estado||''));
    const tipoVendedor=String(r.tipoVendedor||'ADMIN').toUpperCase(),revendedorId=tipoVendedor==='REVENDEDOR'?String(r.revendedorId||'').trim():'';
    if(tipoVendedor==='REVENDEDOR'&&!revendedorId)throw new Error('Selecciona el revendedor.');
    const vendedorNombre=tipoVendedor==='ADMIN'?'Administrador':obtenerNombreRevendedorCanvaMD20_(revendedorId);
    const valores=[id,String(r.clienteId||'').trim(),nombre,whatsapp,correo,equipoId,equipo.nombre,fechaCompra,meses,diasServicio,vence,String(r.tipoOperacion||'NUEVO').toUpperCase(),tipoVendedor,revendedorId,vendedorNombre,Number(r.precio||0),String(r.moneda||'USD').toUpperCase(),String(r.estadoPago||'PENDIENTE').toUpperCase(),calcularDiasCanvaMD20_(vence),estado,'NO','', '',String(r.notas||'').trim(),creado,ahora];
    const n=fila||primeraFilaLibreCanvaMD20_(h);h.getRange(n,1,1,valores.length).setValues([valores]);
    h.getRange(n,8).setNumberFormat('dd/MM/yyyy');h.getRange(n,11).setNumberFormat('dd/MM/yyyy');h.getRange(n,16).setNumberFormat('#,##0.00');h.getRange(n,25,1,2).setNumberFormat('dd/MM/yyyy HH:mm');
    actualizarTodosLosEquiposCanvaMD20_();
    crearNotificacionCanvaMD20_(id,nombre,equipo.nombre,estado,String(r.tipoOperacion||'NUEVO'));
    registrarLogVentaMD20_('GUARDAR_CANVA',id,'Cuenta Canva '+String(r.tipoOperacion||'NUEVO')+' para '+nombre+'.');
    SpreadsheetApp.flush();return listarCuentasCanvaMD20_().find(x=>x.id===id);
  }finally{lock.releaseLock();}
}

function validarCorreoCanvaDuplicadoMD20_(h,id,correo){
  if(h.getLastRow()<=1)return;
  h.getRange(2,1,h.getLastRow()-1,5).getDisplayValues().forEach(f=>{
    if(String(f[0])===id)return;
    if(String(f[4]||'').trim().toLowerCase()===correo)throw new Error('Ese correo de Canva ya está registrado.');
  });
}

function obtenerNombreRevendedorCanvaMD20_(id){
  const r=listarSocios_('REVENDEDOR').find(x=>x.id===id);
  if(!r)throw new Error('No se encontró el revendedor.');
  return [r.nombre,r.apellido].filter(Boolean).join(' ');
}

function contarCuentasActivasEquipoCanvaMD20_(equipoId){
  const h=md20LibroEstable_().getSheetByName(MD20_CANVA.CUENTAS);
  if(!h||h.getLastRow()<=1)return 0;
  return h.getRange(2,1,h.getLastRow()-1,20).getValues().filter(f=>String(f[5]||'')===String(equipoId)&&['ACTIVA','POR_VENCER'].includes(calcularEstadoCanvaMD20_(f[10],String(f[19]||'')))).length;
}

function actualizarTodosLosEquiposCanvaMD20_(){
  const h=md20LibroEstable_().getSheetByName(MD20_CANVA.EQUIPOS);
  if(!h||h.getLastRow()<=1)return;
  const datos=h.getRange(2,1,h.getLastRow()-1,MD20_CANVA.ENC_EQUIPOS.length).getValues();
  datos.forEach((f,i)=>{
    if(!f[0])return;
    const ocupados=contarCuentasActivasEquipoCanvaMD20_(String(f[0])),capacidad=Number(f[3]||0);
    h.getRange(i+2,5).setValue(ocupados);
    h.getRange(i+2,6).setValue(Math.max(0,capacidad-ocupados));
    h.getRange(i+2,11).setValue(new Date());
  });
}

function calcularDiasCanvaMD20_(fecha){
  if(!(fecha instanceof Date)||isNaN(fecha))return 0;
  const hoy=new Date();hoy.setHours(0,0,0,0);const fin=new Date(fecha);fin.setHours(0,0,0,0);
  return Math.ceil((fin-hoy)/86400000);
}

function calcularEstadoCanvaMD20_(fecha,actual){
  if(['CORTADA','CANCELADA'].includes(actual))return actual;
  const dias=calcularDiasCanvaMD20_(fecha);
  if(dias<0)return 'VENCIDA';
  if(dias<=3)return 'POR_VENCER';
  return 'ACTIVA';
}

function primeraFilaLibreCanvaMD20_(h){
  const ids=h.getRange(2,1,h.getMaxRows()-1,1).getDisplayValues().flat(),i=ids.findIndex(v=>String(v||'').trim()==='');
  if(i>=0)return i+2;const m=h.getMaxRows();h.insertRowsAfter(m,100);return m+1;
}

function crearNotificacionCanvaMD20_(id,cliente,equipo,estado,operacion){
  const h=md20LibroEstable_().getSheetByName('NOTIFICACIONES');
  if(!h)return;
  h.appendRow(['NOT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),'ADMINISTRADOR','CANVA',operacion+' de Canva',cliente+' · '+equipo+' · '+estado,'CANVA',id,estado==='POR_VENCER'?'ALTA':'MEDIA','NO',new Date(),'','ACTIVA']);
}

function obtenerResumenCanvaTelegramMD20_(){
  const cuentas=listarCuentasCanvaMD20_(),equipos=listarEquiposCanvaMD20_();
  return {
    equiposActivos:equipos.filter(e=>e.estado==='ACTIVO').length,
    cuposDisponibles:equipos.reduce((s,e)=>s+Number(e.disponibles||0),0),
    cuentasActivas:cuentas.filter(c=>c.estado==='ACTIVA').length,
    porVencer:cuentas.filter(c=>c.estado==='POR_VENCER'),
    vencidas:cuentas.filter(c=>c.estado==='VENCIDA'),
    pagosPendientes:cuentas.filter(c=>c.estadoPago==='PENDIENTE')
  };
}

function actualizarEstadosCanvaMD20(){
  const h=md20LibroEstable_().getSheetByName(MD20_CANVA.CUENTAS);
  if(!h||h.getLastRow()<=1)return;
  const datos=h.getRange(2,1,h.getLastRow()-1,MD20_CANVA.ENC_CUENTAS.length).getValues();
  datos.forEach((f,i)=>{
    if(!f[0])return;
    const fila=i+2,dias=calcularDiasCanvaMD20_(f[10]),estado=calcularEstadoCanvaMD20_(f[10],String(f[19]||''));
    h.getRange(fila,19).setValue(dias);h.getRange(fila,20).setValue(estado);h.getRange(fila,26).setValue(new Date());
  });
  actualizarTodosLosEquiposCanvaMD20_();SpreadsheetApp.flush();
}

function manejarEdicionCanvaMD20_(e){
  if(!e||!e.range)return;
  const h=e.range.getSheet(),fila=e.range.getRow();
  if(fila<2)return;

  if(h.getName()===MD20_CANVA.CUENTAS){
    const col=e.range.getColumn();
    if([8,9].includes(col)){
      const fecha=h.getRange(fila,8).getValue(),meses=Number(h.getRange(fila,9).getValue()||1);
      if(fecha instanceof Date&&!isNaN(fecha)){
        const vence=new Date(fecha);vence.setDate(vence.getDate()+meses*30);
        h.getRange(fila,10).setValue(meses*30);h.getRange(fila,11).setValue(vence);
        h.getRange(fila,19).setValue(calcularDiasCanvaMD20_(vence));
        h.getRange(fila,20).setValue(calcularEstadoCanvaMD20_(vence,String(h.getRange(fila,20).getValue()||'')));
      }
    }
    if(col===6){
      const equipoId=String(h.getRange(fila,6).getValue()||''),equipo=listarEquiposCanvaMD20_().find(x=>x.id===equipoId);
      if(equipo)h.getRange(fila,7).setValue(equipo.nombre);
    }
    if(col===13&&String(h.getRange(fila,13).getValue()||'')==='ADMIN'){
      h.getRange(fila,14,1,2).clearContent();h.getRange(fila,15).setValue('Administrador');
    }
    h.getRange(fila,26).setValue(new Date());
    actualizarTodosLosEquiposCanvaMD20_();
  }

  if(h.getName()===MD20_CANVA.EQUIPOS){
    actualizarTodosLosEquiposCanvaMD20_();
  }
}



/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — PORTAL DEL CLIENTE CON TOKEN
 * =========================================================
 * Ejecuta una sola vez:
 * prepararPortalClientesMD20
 */
const MD20_PORTAL = {
  HOJA_PORTAL:'PORTAL_CLIENTES',
  HOJA_RESPUESTAS:'RESPUESTAS_RENOVACION',
  HOJA_ALERTAS:'ALERTAS_RENOVACION',
  ENC_PORTAL:['PORTAL_ID','CLIENTE_ID','TOKEN_HASH','TOKEN_PISTA','TOKEN_CREADO_EN','TOKEN_EXPIRA_EN','ULTIMO_ACCESO','ESTADO','CREADO_EN','ACTUALIZADO_EN'],
  ENC_RESPUESTAS:['RESPUESTA_ID','CLIENTE_ID','TIPO_SERVICIO','SERVICIO_ID','PRODUCTO_NOMBRE','RESPUESTA','FECHA_RESPUESTA','ORIGEN','ESTADO','PROCESADO_POR','PROCESADO_EN'],
  ENC_ALERTAS:['ALERTA_ID','CLIENTE_ID','TIPO_SERVICIO','SERVICIO_ID','TIPO_ALERTA','FECHA_VENCIMIENTO','DIAS_RESTANTES','ESTADO','CREADO_EN']
};

function prepararPortalClientesMD20(){
  const l=md20LibroEstable_();
  prepararHojaPortalMD20_(l,MD20_PORTAL.HOJA_PORTAL,MD20_PORTAL.ENC_PORTAL,'#673AB7');
  prepararHojaPortalMD20_(l,MD20_PORTAL.HOJA_RESPUESTAS,MD20_PORTAL.ENC_RESPUESTAS,'#00BCD4');
  prepararHojaPortalMD20_(l,MD20_PORTAL.HOJA_ALERTAS,MD20_PORTAL.ENC_ALERTAS,'#FF9800');
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Portal listo','Ya puedes generar enlaces privados desde la página Clientes.',SpreadsheetApp.getUi().ButtonSet.OK);
}

function prepararHojaPortalMD20_(libro,nombre,encabezados,color){
  let h=libro.getSheetByName(nombre);if(!h)h=libro.insertSheet(nombre);
  if(h.getMaxColumns()<encabezados.length)h.insertColumnsAfter(h.getMaxColumns(),encabezados.length-h.getMaxColumns());
  if(h.getMaxRows()<1000)h.insertRowsAfter(h.getMaxRows(),1000-h.getMaxRows());
  h.getRange(1,1,1,encabezados.length).setValues([encabezados]);
  h.setFrozenRows(1);h.setTabColor(color);h.setRowHeight(1,44);
  h.getRange(1,1,1,encabezados.length).setBackground('#101014').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  h.getRange(2,1,h.getMaxRows()-1,encabezados.length).setBorder(true,true,true,true,true,true,'#D9D9DE',SpreadsheetApp.BorderStyle.SOLID);
  if(h.getFilter())h.getFilter().remove();h.getRange(1,1,h.getMaxRows(),encabezados.length).createFilter();
}

function generarPortalClienteMD20_(clienteId){
  const cliente=listarClientesMD20_().find(c=>c.id===String(clienteId||''));
  if(!cliente)throw new Error('No se encontró el cliente.');
  const h=md20LibroEstable_().getSheetByName(MD20_PORTAL.HOJA_PORTAL);
  if(!h)throw new Error('Ejecuta primero prepararPortalClientesMD20.');
  const token=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
  const hash=hashTokenPortalMD20_(token),ahora=new Date(),expira=new Date(ahora);expira.setFullYear(expira.getFullYear()+1);
  let fila=0;
  if(h.getLastRow()>1){
    const datos=h.getRange(2,1,h.getLastRow()-1,10).getValues();
    const i=datos.findIndex(f=>String(f[1]||'')===cliente.id&&String(f[7]||'')==='ACTIVO');
    if(i>=0){fila=i+2;h.getRange(fila,8).setValue('REEMPLAZADO');h.getRange(fila,10).setValue(ahora);}
  }
  h.appendRow(['POR-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),cliente.id,hash,token.slice(-6),ahora,expira,'','ACTIVO',ahora,ahora]);
  registrarLogVentaMD20_('GENERAR_PORTAL',cliente.id,'Se generó un enlace privado para el cliente.');
  return {ok:true,token:token};
}

function consultarPortalClienteMD20_(token){
  const acceso=validarTokenPortalMD20_(token),cliente=listarClientesMD20_().find(c=>c.id===acceso.clienteId);
  if(!cliente)throw new Error('El cliente del portal no existe.');
  const servicios=[];

  listarSuscripcionesMD20_().filter(s=>s.clienteId===cliente.id&&['ACTIVA','POR_VENCER'].includes(s.estado)).forEach(s=>{
    servicios.push({
      id:s.id,tipoServicio:'SUSCRIPCION',nombre:s.productoNombre||s.plataforma||'Servicio digital',
      correo:s.usuarioCuenta||'',usuarioCuenta:s.usuarioCuenta||'',plataforma:s.plataforma||'',
      fechaInicio:s.fechaInicio,fechaVencimiento:s.fechaVencimiento,diasRestantes:s.diasRestantes,
      precioRenovacion:s.precioRenovacion,moneda:s.moneda,estado:s.estado,
      respuestaCliente:s.respuestaCliente||s.estadoRenovacion||'SIN_RESPUESTA'
      // PROVEEDOR OMITIDO INTENCIONALMENTE: información exclusiva del administrador.
    });
  });

  listarCuentasCanvaMD20_().filter(c=>(c.clienteId===cliente.id||normalizarTelefonoPortalMD20_(c.whatsapp)===normalizarTelefonoPortalMD20_(cliente.telefono))&&['ACTIVA','POR_VENCER'].includes(c.estado)).forEach(c=>{
    servicios.push({
      id:c.id,tipoServicio:'CANVA',nombre:'Canva',correo:c.correoCanva,equipoNombre:c.equipoNombre,
      fechaInicio:c.fechaCompra,fechaVencimiento:c.fechaVencimiento,diasRestantes:c.diasRestantes,
      precioRenovacion:c.precio,moneda:c.moneda,estado:c.estado,respuestaCliente:c.respuestaCliente||'SIN_RESPUESTA'
      // PROVEEDOR OMITIDO INTENCIONALMENTE.
    });
  });

  if(!servicios.length){
    throw new Error('Tu enlace está activo, pero actualmente no tienes servicios vigentes con Mundo Digital 2.0.');
  }
  acceso.hoja.getRange(acceso.fila,7).setValue(new Date());
  return {ok:true,cliente:{id:cliente.id,nombreCompleto:cliente.nombreCompleto},servicios:servicios,soporteWhatsapp:obtenerWhatsappSoportePortalMD20_()};
}

function responderRenovacionPortalMD20_(c){
  const acceso=validarTokenPortalMD20_(c.token||''),respuesta=String(c.respuesta||'').toUpperCase();
  if(!['RENOVAR','NO_RENOVAR'].includes(respuesta))throw new Error('Respuesta no válida.');
  const tipo=String(c.tipoServicio||'').toUpperCase(),servicioId=String(c.servicioId||'');
  let nombreProducto='',fechaVencimiento='',dias=0;

  if(tipo==='SUSCRIPCION'){
    const h=md20LibroEstable_().getSheetByName('SUSCRIPCIONES'),fila=buscarFilaPorValorMD20_(h,1,servicioId);
    if(!fila)throw new Error('No se encontró la suscripción.');
    if(String(h.getRange(fila,2).getValue()||'')!==acceso.clienteId)throw new Error('El servicio no pertenece a este cliente.');
    h.getRange(fila,26).setValue(respuesta==='RENOVAR'?'DESEA_RENOVAR':'NO_DESEA_RENOVAR');
    h.getRange(fila,27).setValue(respuesta);
    h.getRange(fila,28).setValue(new Date());
    const s=listarSuscripcionesMD20_().find(x=>x.id===servicioId);nombreProducto=s?s.productoNombre:'';fechaVencimiento=s?s.fechaVencimiento:'';dias=s?s.diasRestantes:0;
  }else if(tipo==='CANVA'){
    const h=md20LibroEstable_().getSheetByName(MD20_CANVA.CUENTAS),fila=buscarFilaPorValorMD20_(h,1,servicioId);
    if(!fila)throw new Error('No se encontró la cuenta de Canva.');
    const cuenta=listarCuentasCanvaMD20_().find(x=>x.id===servicioId);
    const cliente=listarClientesMD20_().find(x=>x.id===acceso.clienteId);
    if(!cuenta||!(cuenta.clienteId===acceso.clienteId||normalizarTelefonoPortalMD20_(cuenta.whatsapp)===normalizarTelefonoPortalMD20_(cliente.telefono)))throw new Error('El servicio no pertenece a este cliente.');
    h.getRange(fila,23).setValue(respuesta);
    h.getRange(fila,26).setValue(new Date());
    nombreProducto='Canva';fechaVencimiento=cuenta.fechaVencimiento;dias=cuenta.diasRestantes;
  }else throw new Error('Tipo de servicio no válido.');

  const hr=md20LibroEstable_().getSheetByName(MD20_PORTAL.HOJA_RESPUESTAS);
  hr.appendRow(['RES-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),acceso.clienteId,tipo,servicioId,nombreProducto,respuesta,new Date(),'PORTAL_CLIENTE','PENDIENTE','','']);
  const ha=md20LibroEstable_().getSheetByName(MD20_PORTAL.HOJA_ALERTAS);
  ha.appendRow(['ALR-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),acceso.clienteId,tipo,servicioId,respuesta==='RENOVAR'?'CLIENTE_DESEA_RENOVAR':'CLIENTE_NO_RENOVARA',fechaVencimiento,dias,'ACTIVA',new Date()]);
  crearNotificacionRespuestaPortalMD20_(acceso.clienteId,nombreProducto,respuesta,servicioId);
  registrarLogVentaMD20_('RESPUESTA_PORTAL',servicioId,'Cliente respondió '+respuesta+'.');
  return {ok:true,mensaje:'Respuesta registrada correctamente.'};
}

function validarTokenPortalMD20_(token){
  token=String(token||'').trim();if(token.length<40)throw new Error('El token del portal no es válido.');
  const h=md20LibroEstable_().getSheetByName(MD20_PORTAL.HOJA_PORTAL);
  if(!h||h.getLastRow()<=1)throw new Error('El portal todavía no está preparado.');
  const hash=hashTokenPortalMD20_(token),datos=h.getRange(2,1,h.getLastRow()-1,10).getValues();
  const i=datos.findIndex(f=>String(f[2]||'')===hash&&String(f[7]||'')==='ACTIVO');
  if(i<0)throw new Error('El enlace no es válido o fue reemplazado.');
  const expira=datos[i][5];if(expira instanceof Date&&expira<new Date())throw new Error('Este enlace ya venció.');
  return {clienteId:String(datos[i][1]||''),fila:i+2,hoja:h};
}

function hashTokenPortalMD20_(token){
  const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(token),Utilities.Charset.UTF_8);
  return bytes.map(b=>(b+256)%256).map(b=>('0'+b.toString(16)).slice(-2)).join('');
}

function normalizarTelefonoPortalMD20_(v){return String(v||'').replace(/\D/g,'').replace(/^0+/,'');}

function obtenerWhatsappSoportePortalMD20_(){
  const h=md20LibroEstable_().getSheetByName('CONFIGURACION');
  if(h&&h.getLastRow()>1){
    const d=h.getRange(2,1,h.getLastRow()-1,2).getDisplayValues();
    const fila=d.find(f=>['WHATSAPP_SOPORTE','TELEFONO_SOPORTE'].includes(String(f[0]||'').toUpperCase()));
    if(fila)return String(fila[1]||'');
  }
  return '';
}

function crearNotificacionRespuestaPortalMD20_(clienteId,producto,respuesta,servicioId){
  const cliente=listarClientesMD20_().find(c=>c.id===clienteId),h=md20LibroEstable_().getSheetByName('NOTIFICACIONES');
  if(h)h.appendRow(['NOT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),'ADMINISTRADOR','RENOVACION','Respuesta del cliente',(cliente?cliente.nombreCompleto:'Cliente')+' respondió '+respuesta+' para '+producto,'PORTAL_CLIENTE',servicioId,'ALTA','NO',new Date(),'','ACTIVA']);
}



/**
 * =========================================================
 * CENTRO ADMINISTRATIVO DE RENOVACIONES
 * =========================================================
 */
function listarRespuestasRenovacionMD20_(){
  actualizarEstadosSistemaDiarioMD20();
  const h=md20LibroEstable_().getSheetByName(MD20_PORTAL.HOJA_RESPUESTAS);
  if(!h||h.getLastRow()<=1)return[];
  const clientes={};listarClientesMD20_().forEach(c=>clientes[c.id]=c);
  const suscripciones={};listarSuscripcionesMD20_().forEach(s=>suscripciones[s.id]=s);
  const canva={};listarCuentasCanvaMD20_().forEach(c=>canva[c.id]=c);

  return h.getRange(2,1,h.getLastRow()-1,MD20_PORTAL.ENC_RESPUESTAS.length).getValues()
    .filter(f=>f[0]).map(f=>{
      const cliente=clientes[String(f[1])]||{};
      const tipo=String(f[2]||''),servicioId=String(f[3]||'');
      const servicio=tipo==='CANVA'?(canva[servicioId]||{}):(suscripciones[servicioId]||{});
      return {
        id:String(f[0]),clienteId:String(f[1]||''),clienteNombre:String(cliente.nombreCompleto||''),
        clienteTelefono:String(cliente.telefono||''),tipoServicio:tipo,servicioId:servicioId,
        productoNombre:String(f[4]||servicio.productoNombre||servicio.nombre||'Servicio'),
        respuesta:String(f[5]||''),fechaRespuesta:fechaHoraApi_(f[6]),origen:String(f[7]||'PORTAL_CLIENTE'),
        estado:String(f[8]||'PENDIENTE'),procesadoPor:String(f[9]||''),procesadoEn:fechaHoraApi_(f[10]),
        fechaVencimiento:String(servicio.fechaVencimiento||''),diasRestantes:Number(servicio.diasRestantes||0)
      };
    }).sort((a,b)=>String(b.fechaRespuesta).localeCompare(String(a.fechaRespuesta)));
}

function procesarRespuestaRenovacionMD20_(respuestaId){
  const h=md20LibroEstable_().getSheetByName(MD20_PORTAL.HOJA_RESPUESTAS);
  const fila=buscarFilaPorValorMD20_(h,1,String(respuestaId||''));
  if(!fila)throw new Error('No se encontró la respuesta.');
  h.getRange(fila,9).setValue('PROCESADO');
  h.getRange(fila,10).setValue('ADMINISTRADOR');
  h.getRange(fila,11).setValue(new Date());
  return {id:String(respuestaId),estado:'PROCESADO'};
}

/**
 * Recalcula todos los estados de forma diaria.
 * Se puede ejecutar manualmente y también mediante activador.
 */
function actualizarEstadosSistemaDiarioMD20(){
  actualizarEstadosSuscripcionesMD20();
  actualizarEstadosCanvaMD20();
  SpreadsheetApp.flush();
}

/**
 * Ejecuta una sola vez para crear el activador diario.
 */
function instalarActualizacionDiariaMD20(){
  ScriptApp.getProjectTriggers()
    .filter(t=>t.getHandlerFunction()==='actualizarEstadosSistemaDiarioMD20')
    .forEach(t=>ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('actualizarEstadosSistemaDiarioMD20')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();

  SpreadsheetApp.getUi().alert(
    'Actualización diaria instalada',
    'Los estados se recalcularán automáticamente todos los días aproximadamente a las 6:00 a. m.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}



/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — INVENTARIO DE CUENTAS DIGITALES
 * Ejecuta una sola vez: prepararModuloInventarioDigitalMD20
 * =========================================================
 */
function prepararModuloInventarioDigitalMD20(){
  const l=md20LibroEstable_(),h=l.getSheetByName('CUENTAS_DIGITALES');
  if(!h)throw new Error('No existe CUENTAS_DIGITALES.');
  if(h.getMaxColumns()<22)h.insertColumnsAfter(h.getMaxColumns(),22-h.getMaxColumns());
  h.getRange(1,22).setValue('PRODUCTO_NOMBRE');
  h.setFrozenRows(1);h.setTabColor('#FF6F00');
  h.getRange(1,1,1,22).setBackground('#101014').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  h.getRange(2,14,h.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy');
  h.getRange(2,16,h.getMaxRows()-1,1).setNumberFormat('#,##0.00');
  h.getRange(2,20,h.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy HH:mm');
  h.getRange(2,6,h.getMaxRows()-1,5).setNumberFormat('@');
  aplicarValidacionInventarioMD20_(h,5,['CUENTA_COMPLETA','PANTALLA','PERFIL','ACCESO']);
  aplicarValidacionInventarioMD20_(h,17,['USD','VES','COP']);
  aplicarValidacionInventarioMD20_(h,18,['DISPONIBLE','ASIGNADA','POR_VENCER','VENCIDA','SUSPENDIDA','CORTADA','INACTIVA']);
  prepararMenuProductosCuentasMD20(false);
  aplicarListasInventarioDigitalMD20_(l,h);
  try {
    SpreadsheetApp.getUi().alert(
      'Inventario listo',
      'CUENTAS_DIGITALES quedó preparada y conectada con la página Inventario.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    console.log('Inventario preparado correctamente sin mostrar alerta: ' + error.message);
  }
}
function aplicarValidacionInventarioMD20_(h,c,valores){h.getRange(2,c,h.getMaxRows()-1,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(valores,true).setAllowInvalid(false).build());}
function aplicarListasInventarioDigitalMD20_(l,h){
  const p=l.getSheetByName('PROVEEDORES');
  if(p&&p.getLastRow()>1)h.getRange(2,3,h.getMaxRows()-1,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInRange(p.getRange(2,1,p.getLastRow()-1,1),true).setAllowInvalid(true).build());
}
function listarInventarioDigitalMD20_(){
  const h=md20LibroEstable_().getSheetByName('CUENTAS_DIGITALES');if(!h||h.getLastRow()<=1)return[];
  const productos={};listarProductosMD20_().forEach(p=>productos[p.id]=p);
  const proveedores={};listarSocios_('PROVEEDOR').forEach(p=>proveedores[p.id]=p);
  return h.getRange(2,1,h.getLastRow()-1,Math.max(22,h.getLastColumn())).getValues().filter(f=>f[0]).map(f=>{
    const dias=calcularDias_(f[14]),estado=calcularEstadoInventarioMD20_(f[14],String(f[17]||'')),p=productos[String(f[1])]||{},pr=proveedores[String(f[2])]||{};
    return {id:String(f[0]),productoId:String(f[1]||''),productoNombre:String(p.nombre||f[21]||f[3]||''),proveedorId:String(f[2]||''),proveedorNombre:[pr.nombre,pr.apellido].filter(Boolean).join(' '),plataforma:String(f[3]||''),tipoCuenta:String(f[4]||'CUENTA_COMPLETA'),usuarioCuenta:String(f[5]||''),contrasenaCuenta:String(f[6]||''),correoRecuperacion:String(f[7]||''),telefonoRecuperacion:String(f[8]||''),perfil:String(f[9]||''),pin:String(f[10]||''),pantallasTotales:Number(f[11]||1),pantallasDisponibles:Number(f[12]||0),fechaCompra:fechaApi_(f[13]),fechaVencimiento:fechaApi_(f[14]),diasRestantes:dias,costo:Number(f[15]||0),moneda:String(f[16]||'USD'),estado:estado,notas:String(f[18]||''),creadoEn:fechaHoraApi_(f[19]),actualizadoEn:fechaHoraApi_(f[20])};
  });
}
function guardarInventarioDigitalMD20_(r){
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    const h=md20LibroEstable_().getSheetByName('CUENTAS_DIGITALES');if(!h)throw new Error('No existe CUENTAS_DIGITALES.');
    const productoId=String(r.productoId||'').trim(),usuario=String(r.usuarioCuenta||'').trim();if(!productoId||!usuario)throw new Error('Producto y usuario son obligatorios.');
    const total=Math.max(1,Number(r.pantallasTotales||1)),disp=Math.max(0,Number(r.pantallasDisponibles||0));if(disp>total)throw new Error('Los cupos disponibles no pueden superar el total.');
    const producto=listarProductosMD20_().find(p=>p.id===productoId);if(!producto)throw new Error('No se encontró el producto.');
    const id=String(r.id||'').trim()||'CUE-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),fila=buscarFilaPorValorMD20_(h,1,id),ahora=new Date(),creado=fila?h.getRange(fila,20).getValue()||ahora:ahora;
    const vence=convertirFecha_(r.fechaVencimiento),estado=calcularEstadoInventarioMD20_(vence,String(r.estado||'DISPONIBLE').toUpperCase());
    const valores=[id,productoId,String(r.proveedorId||'').trim(),String(r.plataforma||producto.nombre).trim(),String(r.tipoCuenta||'CUENTA_COMPLETA').toUpperCase(),usuario,String(r.contrasenaCuenta||'').trim(),String(r.correoRecuperacion||'').trim(),String(r.telefonoRecuperacion||'').trim(),String(r.perfil||'').trim(),String(r.pin||'').trim(),total,disp,convertirFecha_(r.fechaCompra),vence,Number(r.costo||0),String(r.moneda||'USD').toUpperCase(),estado,String(r.notas||'').trim(),creado,ahora,producto.nombre];
    const n=fila||primeraFilaLibreCanvaMD20_(h);h.getRange(n,1,1,valores.length).setValues([valores]);h.getRange(n,14,1,2).setNumberFormat('dd/MM/yyyy');h.getRange(n,16).setNumberFormat('#,##0.00');h.getRange(n,20,1,2).setNumberFormat('dd/MM/yyyy HH:mm');
    SpreadsheetApp.flush();return listarInventarioDigitalMD20_().find(x=>x.id===id);
  }finally{lock.releaseLock();}
}
function calcularEstadoInventarioMD20_(fecha,actual){
  if(['CORTADA','SUSPENDIDA','INACTIVA','ASIGNADA'].includes(actual))return actual;
  if(!(fecha instanceof Date)||isNaN(fecha))return actual||'DISPONIBLE';
  const d=calcularDias_(fecha);if(d<0)return 'VENCIDA';if(d<=3)return 'POR_VENCER';return actual==='VENCIDA'||actual==='POR_VENCER'?'DISPONIBLE':(actual||'DISPONIBLE');
}
function actualizarEstadosInventarioDigitalMD20(){
  const h=md20LibroEstable_().getSheetByName('CUENTAS_DIGITALES');if(!h||h.getLastRow()<=1)return;
  const d=h.getRange(2,1,h.getLastRow()-1,21).getValues();d.forEach((f,i)=>{if(!f[0])return;h.getRange(i+2,18).setValue(calcularEstadoInventarioMD20_(f[14],String(f[17]||'')));h.getRange(i+2,21).setValue(new Date());});
}



/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — MÓDULO COMPLETO DE PAGOS
 * Ejecuta una sola vez: prepararModuloPagosMD20
 * =========================================================
 */
function prepararModuloPagosMD20(){
  const l=md20LibroEstable_(),h=l.getSheetByName('PAGOS');
  if(!h)throw new Error('No existe la pestaña PAGOS.');
  if(h.getMaxColumns()<16)h.insertColumnsAfter(h.getMaxColumns(),16-h.getMaxColumns());
  h.setFrozenRows(1);h.setTabColor('#00A86B');h.setRowHeight(1,44);
  h.getRange(1,1,1,16).setBackground('#101014').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  h.getRange(2,4,h.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy');
  h.getRange(2,5,h.getMaxRows()-1,1).setNumberFormat('#,##0.00');
  h.getRange(2,14,h.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  h.getRange(2,16,h.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  h.getRange(2,8,h.getMaxRows()-1,4).setNumberFormat('@');
  aplicarValidacionPagoMD20_(h,12,['PENDIENTE','EN_REVISION','CONFIRMADO','RECHAZADO','ANULADO']);
  aplicarListasPagoMD20_(l,h);
  try{
    SpreadsheetApp.getUi().alert('Pagos listos','La pestaña PAGOS quedó preparada y conectada con la página.',SpreadsheetApp.getUi().ButtonSet.OK);
  }catch(error){
    console.log('Pagos preparados sin mostrar alerta: '+error.message);
  }
}

function aplicarValidacionPagoMD20_(h,col,valores){
  h.getRange(2,col,h.getMaxRows()-1,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(valores,true).setAllowInvalid(false).build()
  );
}

function aplicarListasPagoMD20_(l,h){
  const ventas=l.getSheetByName('VENTAS'),metodos=l.getSheetByName('METODOS_PAGO');
  if(ventas&&ventas.getLastRow()>1){
    h.getRange(2,2,h.getMaxRows()-1,1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(ventas.getRange(2,1,ventas.getLastRow()-1,1),true).setAllowInvalid(true).build()
    );
  }
  if(metodos&&metodos.getLastRow()>1){
    h.getRange(2,7,h.getMaxRows()-1,1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInRange(metodos.getRange(2,1,metodos.getLastRow()-1,1),true).setAllowInvalid(true).build()
    );
  }
}

function listarPagosMD20_(){
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName('PAGOS');

  if(!hoja||hoja.getLastRow()<=1)return[];

  const encabezados=hoja
    .getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(x=>String(x||'').trim().toUpperCase());

  const indice=nombre=>encabezados.indexOf(nombre);

  const ventas={};
  listarVentasMD20_().forEach(v=>ventas[String(v.id)]=v);

  const metodos={};
  listarMetodosPagoMD20_().forEach(m=>metodos[String(m.id)]=m.nombre);

  return hoja
    .getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getValues()
    .filter(f=>f[indice('PAGO_ID')])
    .map(f=>{
      const valor=nombre=>{
        const i=indice(nombre);
        return i>=0?f[i]:'';
      };

      const ventaId=String(valor('VENTA_ID')||'');
      const venta=ventas[ventaId]||{};
      const metodoId=String(valor('METODO_PAGO_ID')||'');

      return {
        id:String(valor('PAGO_ID')||''),
        ventaId:ventaId,
        clienteId:String(valor('CLIENTE_ID')||venta.clienteId||''),
        numeroVenta:String(venta.numeroVenta||''),
        clienteNombre:String(venta.clienteNombre||''),
        clienteTelefono:String(venta.clienteTelefono||''),
        productoNombre:String(venta.productoNombre||''),
        fechaPago:fechaApi_(valor('FECHA_PAGO')),
        monto:Number(valor('MONTO')||0),
        moneda:String(valor('MONEDA')||venta.moneda||'USD'),
        metodoPagoId:metodoId,
        metodoPagoNombre:String(metodos[metodoId]||''),
        referencia:String(valor('REFERENCIA')||''),
        bancoOrigen:String(valor('BANCO_ORIGEN')||''),
        bancoDestino:String(valor('BANCO_DESTINO')||''),
        titular:String(valor('TITULAR')||''),
        comprobanteUrl:String(valor('COMPROBANTE_URL')||''),
        estado:String(valor('ESTADO')||'PENDIENTE'),
        confirmadoPor:String(valor('CONFIRMADO_POR')||''),
        confirmadoEn:fechaHoraApi_(valor('FECHA_CONFIRMACION')),
        notas:String(valor('NOTAS')||''),
        creadoEn:fechaHoraApi_(valor('CREADO_EN'))
      };
    })
    .sort((a,b)=>String(b.creadoEn).localeCompare(String(a.creadoEn)));
}

function guardarPagoMD20_(r){
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);

  try{
    const libro=md20LibroEstable_();
    const hoja=libro.getSheetByName('PAGOS');

    if(!hoja)throw new Error('No existe la pestaña PAGOS.');

    const ventaId=String(r.ventaId||'').trim();
    const venta=listarVentasMD20_().find(v=>String(v.id)===ventaId);

    if(!venta)throw new Error('No se encontró la venta seleccionada.');

    const monto=Number(r.monto||0);
    if(monto<=0)throw new Error('El monto debe ser mayor que cero.');

    const estado=String(r.estado||'PENDIENTE').trim().toUpperCase();
    const estadosPermitidos=['PENDIENTE','EN_REVISION','CONFIRMADO','RECHAZADO','ANULADO'];

    if(!estadosPermitidos.includes(estado)){
      throw new Error('El estado seleccionado no es válido.');
    }

    const encabezados=hoja
      .getRange(1,1,1,hoja.getLastColumn())
      .getDisplayValues()[0]
      .map(x=>String(x||'').trim().toUpperCase());

    const col=nombre=>{
      const indice=encabezados.indexOf(nombre);
      if(indice<0)throw new Error('Falta la columna '+nombre+' en PAGOS.');
      return indice+1;
    };

    const id=String(r.id||'').trim()||
      'PAG-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();

    let fila=buscarFilaPorValorMD20_(hoja,col('PAGO_ID'),id);
    if(!fila)fila=primeraFilaLibreCanvaMD20_(hoja);

    const ahora=new Date();
    const creadoActual=hoja.getRange(fila,col('CREADO_EN')).getValue();
    const creado=creadoActual||ahora;

    const asignar=(nombre,valor)=>{
      const columna=encabezados.indexOf(nombre);
      if(columna>=0)hoja.getRange(fila,columna+1).setValue(valor);
    };

    asignar('PAGO_ID',id);
    asignar('VENTA_ID',ventaId);
    asignar('CLIENTE_ID',venta.clienteId||'');
    asignar('FECHA_PAGO',convertirFecha_(r.fechaPago));
    asignar('MONTO',monto);
    asignar('MONEDA',String(r.moneda||venta.moneda||'USD').toUpperCase());
    asignar('METODO_PAGO_ID',String(r.metodoPagoId||'').trim());
    asignar('REFERENCIA',String(r.referencia||'').trim());
    asignar('COMPROBANTE_URL',String(r.comprobanteUrl||'').trim());
    asignar('ESTADO',estado);
    asignar('NOTAS',String(r.notas||'').trim());
    asignar('CREADO_EN',creado);

    if(estado==='CONFIRMADO'){
      asignar('CONFIRMADO_POR','ADMINISTRADOR');
      asignar('FECHA_CONFIRMACION',ahora);
    }else{
      asignar('CONFIRMADO_POR','');
      asignar('FECHA_CONFIRMACION','');
    }

    SpreadsheetApp.flush();

    // El pago ya quedó guardado. Lo secundario no debe impedirlo.
    try{
      recalcularVentaPorPagosMD20_(ventaId);
    }catch(errorRecalculo){
      console.error(
        'El pago se guardó, pero no se pudo recalcular la venta: '+
        errorRecalculo.message
      );
      registrarLogVentaMD20_(
        'ADVERTENCIA_RECALCULO_PAGO',
        id,
        'Pago guardado como '+estado+
        ', pero falló el recálculo: '+errorRecalculo.message
      );
    }

    try{
      registrarLogVentaMD20_(
        'GUARDAR_PAGO',
        id,
        'Pago guardado para venta '+venta.numeroVenta+
        ' con estado '+estado+'.'
      );
    }catch(errorLog){
      console.error('No se pudo guardar el LOG: '+errorLog.message);
    }

    SpreadsheetApp.flush();

    const registro=listarPagosMD20_().find(p=>String(p.id)===id);

    return registro||{
      id:id,
      ventaId:ventaId,
      estado:estado,
      monto:monto,
      moneda:String(r.moneda||venta.moneda||'USD').toUpperCase()
    };

  }finally{
    lock.releaseLock();
  }
}

function cambiarEstadoPagoMD20_(pagoId,estado){
  estado=String(estado||'').trim().toUpperCase();

  const permitidos=['PENDIENTE','EN_REVISION','CONFIRMADO','RECHAZADO','ANULADO'];
  if(!permitidos.includes(estado))throw new Error('Estado de pago no válido.');

  const lock=LockService.getScriptLock();
  lock.waitLock(30000);

  try{
    const hoja=md20LibroEstable_().getSheetByName('PAGOS');
    if(!hoja)throw new Error('No existe la pestaña PAGOS.');

    const encabezados=hoja
      .getRange(1,1,1,hoja.getLastColumn())
      .getDisplayValues()[0]
      .map(x=>String(x||'').trim().toUpperCase());

    const col=nombre=>{
      const i=encabezados.indexOf(nombre);
      if(i<0)throw new Error('Falta la columna '+nombre+' en PAGOS.');
      return i+1;
    };

    const fila=buscarFilaPorValorMD20_(
      hoja,
      col('PAGO_ID'),
      String(pagoId||'').trim()
    );

    if(!fila)throw new Error('No se encontró el pago.');

    const actual=String(
      hoja.getRange(fila,col('ESTADO')).getValue()||'PENDIENTE'
    ).toUpperCase();

    if(actual===estado){
      return listarPagosMD20_().find(p=>String(p.id)===String(pagoId));
    }

    hoja.getRange(fila,col('ESTADO')).setValue(estado);

    if(estado==='CONFIRMADO'){
      hoja.getRange(fila,col('CONFIRMADO_POR')).setValue('ADMINISTRADOR');
      hoja.getRange(fila,col('FECHA_CONFIRMACION')).setValue(new Date());
    }else{
      hoja.getRange(fila,col('CONFIRMADO_POR')).clearContent();
      hoja.getRange(fila,col('FECHA_CONFIRMACION')).clearContent();
    }

    SpreadsheetApp.flush();

    const ventaId=String(
      hoja.getRange(fila,col('VENTA_ID')).getValue()||''
    ).trim();

    try{
      recalcularVentaPorPagosMD20_(ventaId);
    }catch(errorRecalculo){
      console.error(
        'Estado guardado, pero falló el recálculo: '+
        errorRecalculo.message
      );
    }

    try{
      crearNotificacionPagoMD20_(pagoId,ventaId,estado);
      registrarLogVentaMD20_(
        'CAMBIAR_ESTADO_PAGO',
        pagoId,
        'Pago cambiado de '+actual+' a '+estado+'.'
      );
    }catch(errorSecundario){
      console.error(errorSecundario.message);
    }

    return listarPagosMD20_().find(
      p=>String(p.id)===String(pagoId)
    );

  }finally{
    lock.releaseLock();
  }
}

function procesarConfirmacionPagoMD20_(pagoId,filaPago){
  const l=md20LibroEstable_(),hp=l.getSheetByName('PAGOS'),hv=l.getSheetByName('VENTAS'),he=l.getSheetByName('ENTREGAS');
  const ventaId=String(hp.getRange(filaPago,2).getValue()||''),filaVenta=buscarFilaPorValorMD20_(hv,1,ventaId);
  if(!filaVenta)throw new Error('No se encontró la venta relacionada.');
  const ahora=new Date();
  hp.getRange(filaPago,12).setValue('CONFIRMADO');
  hp.getRange(filaPago,13).setValue('ADMINISTRADOR');
  hp.getRange(filaPago,14).setValue(ahora);
  recalcularVentaPorPagosMD20_(ventaId);
  crearNotificacionPagoMD20_(pagoId,ventaId,'CONFIRMADO');
}

function procesarRechazoPagoMD20_(filaPago,estado){
  const l=md20LibroEstable_(),hp=l.getSheetByName('PAGOS'),hv=l.getSheetByName('VENTAS'),ventaId=String(hp.getRange(filaPago,2).getValue()||''),filaVenta=buscarFilaPorValorMD20_(hv,1,ventaId);
  hp.getRange(filaPago,13).setValue('ADMINISTRADOR');
  hp.getRange(filaPago,14).setValue(new Date());
  recalcularVentaPorPagosMD20_(ventaId);
  crearNotificacionPagoMD20_(String(hp.getRange(filaPago,1).getValue()||''),ventaId,estado);
}

function crearNotificacionPagoMD20_(pagoId,ventaId,estado){
  const h=md20LibroEstable_().getSheetByName('NOTIFICACIONES');
  if(!h)return;
  h.appendRow(['NOT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),'ADMINISTRADOR','PAGOS','Pago '+estado,'Pago '+pagoId+' de la venta '+ventaId+' cambió a '+estado,'PAGOS',pagoId,estado==='CONFIRMADO'?'MEDIA':'ALTA','NO',new Date(),'','ACTIVA']);
}



/**
 * Sincroniza los cambios manuales realizados en la columna ESTADO de PAGOS.
 * Columna L = 12.
 */
function manejarEdicionManualPagoMD20_(e){
  if(!e || !e.range)return;

  const hoja=e.range.getSheet();
  if(hoja.getName()!=='PAGOS' || e.range.getRow()<2 || e.range.getColumn()!==12)return;

  const fila=e.range.getRow();
  const estado=String(e.range.getValue()||'PENDIENTE').trim().toUpperCase();
  const permitidos=['PENDIENTE','EN_REVISION','CONFIRMADO','RECHAZADO','ANULADO'];

  if(!permitidos.includes(estado)){
    e.range.setValue(String(e.oldValue||'PENDIENTE').toUpperCase());
    return;
  }

  const ventaId=String(hoja.getRange(fila,2).getValue()||'').trim();
  const pagoId=String(hoja.getRange(fila,1).getValue()||'').trim();
  if(!ventaId || !pagoId)return;

  if(estado==='CONFIRMADO'){
    hoja.getRange(fila,13).setValue('ADMINISTRADOR');
    hoja.getRange(fila,14).setValue(new Date());
  }else{
    hoja.getRange(fila,13,1,2).clearContent();
  }

  recalcularVentaPorPagosMD20_(ventaId);
  registrarLogVentaMD20_(
    'EDICION_MANUAL_PAGO',
    pagoId,
    'Pago cambiado manualmente en Google Sheets a '+estado+'.'
  );
}

/**
 * Recalcula la venta usando todos sus pagos confirmados.
 * También crea o bloquea la entrega según el saldo.
 */
function recalcularVentaPorPagosMD20_(ventaId){
  const libro=md20LibroEstable_();
  const hojaPagos=libro.getSheetByName('PAGOS');
  const hojaVentas=libro.getSheetByName('VENTAS');
  const hojaEntregas=libro.getSheetByName('ENTREGAS');

  const filaVenta=buscarFilaPorValorMD20_(hojaVentas,1,String(ventaId||''));
  if(!filaVenta)return;

  const total=Number(hojaVentas.getRange(filaVenta,7).getValue()||0);
  let confirmado=0;

  if(hojaPagos && hojaPagos.getLastRow()>1){
    const pagos=hojaPagos.getRange(2,1,hojaPagos.getLastRow()-1,16).getValues();
    pagos.forEach(fila=>{
      if(
        String(fila[1]||'')===String(ventaId) &&
        String(fila[11]||'').toUpperCase()==='CONFIRMADO'
      ){
        confirmado+=Number(fila[4]||0);
      }
    });
  }

  const pagado=Math.min(total,confirmado);
  const saldo=Math.max(0,total-pagado);
  const ahora=new Date();

  let estadoPago='PENDIENTE';
  let estadoEntrega='BLOQUEADA';

  if(pagado>0 && saldo>0)estadoPago='PARCIAL';
  if(total>0 && saldo===0){
    estadoPago='PAGADO';
    estadoEntrega='PENDIENTE';
  }

  hojaVentas.getRange(filaVenta,9).setValue(pagado);
  hojaVentas.getRange(filaVenta,10).setValue(saldo);
  hojaVentas.getRange(filaVenta,11).setValue(estadoPago);
  hojaVentas.getRange(filaVenta,12).setValue(estadoEntrega);
  hojaVentas.getRange(filaVenta,18).setValue(ahora);

  if(!hojaEntregas)return;

  const filaEntrega=buscarFilaPorValorMD20_(hojaEntregas,2,String(ventaId));

  if(estadoPago==='PAGADO'){
    if(!filaEntrega){
      const detalle=obtenerDetalleVentaMD20_(ventaId);
      const clienteId=String(hojaVentas.getRange(filaVenta,3).getValue()||'');

      hojaEntregas.appendRow([
        'ENT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
        ventaId,
        detalle.detalleId||'',
        clienteId,
        detalle.productoId||'',
        '','','','','','','','','','','','','PENDIENTE',
        'Entrega creada automáticamente al completar el pago.'
      ]);
    }else{
      const estadoActual=String(hojaEntregas.getRange(filaEntrega,18).getValue()||'');
      if(['BLOQUEADA','PENDIENTE',''].includes(estadoActual)){
        hojaEntregas.getRange(filaEntrega,18).setValue('PENDIENTE');
        hojaEntregas.getRange(filaEntrega,19).setValue('Pago completo. Entrega pendiente de autorización.');
      }
    }
  }else if(filaEntrega){
    const estadoActual=String(hojaEntregas.getRange(filaEntrega,18).getValue()||'');
    if(!['ENVIADA','ENTREGADA'].includes(estadoActual)){
      hojaEntregas.getRange(filaEntrega,18).setValue('BLOQUEADA');
      hojaEntregas.getRange(filaEntrega,19).setValue('Entrega bloqueada porque la venta no tiene el pago completo.');
    }
  }

  SpreadsheetApp.flush();
}



/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — MÓDULO COMPLETO DE ENTREGAS
 * Ejecuta una sola vez: prepararModuloEntregasMD20
 * =========================================================
 */
const MD20_ENTREGAS_ENCABEZADOS=[
  'ENTREGA_ID','VENTA_ID','DETALLE_ID','CLIENTE_ID','PRODUCTO_ID','CUENTA_ID',
  'FECHA_ENTREGA','TIPO_ENTREGA','ARCHIVO_URL','USUARIO_ENTREGADO',
  'CONTRASENA_ENTREGADA','PERFIL_ENTREGADO','PIN_ENTREGADO','ENLACE_ENTREGADO',
  'MENSAJE_ENTREGA','MEDIO_ENTREGA','ENTREGADO_POR','ESTADO','NOTAS',
  'AUTORIZADO_POR','AUTORIZADO_EN','ACTUALIZADO_EN'
];

function prepararModuloEntregasMD20(){
  const libro=md20LibroEstable_();
  let hoja=libro.getSheetByName('ENTREGAS');
  if(!hoja)hoja=libro.insertSheet('ENTREGAS');

  if(hoja.getMaxColumns()<MD20_ENTREGAS_ENCABEZADOS.length){
    hoja.insertColumnsAfter(
      hoja.getMaxColumns(),
      MD20_ENTREGAS_ENCABEZADOS.length-hoja.getMaxColumns()
    );
  }

  hoja.getRange(1,1,1,MD20_ENTREGAS_ENCABEZADOS.length)
    .setValues([MD20_ENTREGAS_ENCABEZADOS])
    .setBackground('#101014')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  hoja.setFrozenRows(1);
  hoja.setTabColor('#FF6D00');
  hoja.setRowHeight(1,44);

  hoja.getRange(2,7,hoja.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');
  hoja.getRange(2,21,hoja.getMaxRows()-1,2).setNumberFormat('dd/MM/yyyy HH:mm');

  aplicarValidacionEntregaListaMD20_(hoja,8,['ARCHIVO','ENLACE','CUENTA','PERFIL','CURSO','CANVA','ACCESO']);
  aplicarValidacionEntregaListaMD20_(hoja,16,['WHATSAPP','TELEGRAM','CORREO','MANUAL']);
  aplicarValidacionEntregaListaMD20_(hoja,18,['BLOQUEADA','PENDIENTE','AUTORIZADA','ENVIANDO','ENVIADA','ENTREGADA','ERROR','CANCELADA']);

  const ventas=libro.getSheetByName('VENTAS');
  if(ventas&&ventas.getLastRow()>1){
    hoja.getRange(2,2,hoja.getMaxRows()-1,1).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInRange(ventas.getRange(2,1,ventas.getLastRow()-1,1),true)
        .setAllowInvalid(true).build()
    );
  }

  const cuentas=libro.getSheetByName('CUENTAS_DIGITALES');
  if(cuentas&&cuentas.getLastRow()>1){
    hoja.getRange(2,6,hoja.getMaxRows()-1,1).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInRange(cuentas.getRange(2,1,cuentas.getLastRow()-1,1),true)
        .setAllowInvalid(true).build()
    );
  }

  sincronizarEntregasDesdeVentasMD20_();

  try{
    SpreadsheetApp.getUi().alert(
      'Entregas listas',
      'La pestaña ENTREGAS quedó preparada y conectada con Ventas, Pagos e Inventario.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }catch(error){
    console.log('Entregas preparadas sin mostrar alerta: '+error.message);
  }
}

function aplicarValidacionEntregaListaMD20_(hoja,columna,valores){
  hoja.getRange(2,columna,hoja.getMaxRows()-1,1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(valores,true)
      .setAllowInvalid(false)
      .build()
  );
}

function encabezadosEntregaMD20_(hoja){
  return hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());
}

function listarEntregasMD20_(){
  sincronizarEntregasDesdeVentasMD20_();

  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName('ENTREGAS');
  if(!hoja||hoja.getLastRow()<=1)return[];

  const encabezados=encabezadosEntregaMD20_(hoja);
  const indice=n=>encabezados.indexOf(n);

  const ventas={};
  listarVentasMD20_().forEach(v=>ventas[String(v.id)]=v);

  const cuentas={};
  listarInventarioDigitalMD20_().forEach(c=>cuentas[String(c.id)]=c);

  return hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getValues()
    .filter(f=>f[indice('ENTREGA_ID')])
    .map(f=>{
      const valor=n=>indice(n)>=0?f[indice(n)]:'';
      const venta=ventas[String(valor('VENTA_ID'))]||{};
      const cuenta=cuentas[String(valor('CUENTA_ID'))]||{};

      return {
        id:String(valor('ENTREGA_ID')||''),
        ventaId:String(valor('VENTA_ID')||''),
        detalleId:String(valor('DETALLE_ID')||''),
        clienteId:String(valor('CLIENTE_ID')||venta.clienteId||''),
        productoId:String(valor('PRODUCTO_ID')||venta.productoId||''),
        cuentaId:String(valor('CUENTA_ID')||''),
        numeroVenta:String(venta.numeroVenta||''),
        clienteNombre:String(venta.clienteNombre||''),
        clienteTelefono:String(venta.clienteTelefono||''),
        productoNombre:String(venta.productoNombre||''),
        estadoPago:String(venta.estadoPago||'PENDIENTE'),
        fechaEntrega:fechaHoraApi_(valor('FECHA_ENTREGA')),
        tipoEntrega:String(valor('TIPO_ENTREGA')||'ARCHIVO'),
        archivoUrl:String(valor('ARCHIVO_URL')||''),
        usuarioEntregado:String(valor('USUARIO_ENTREGADO')||cuenta.usuarioCuenta||''),
        contrasenaEntregada:String(valor('CONTRASENA_ENTREGADA')||cuenta.contrasenaCuenta||''),
        perfilEntregado:String(valor('PERFIL_ENTREGADO')||cuenta.perfil||''),
        pinEntregado:String(valor('PIN_ENTREGADO')||cuenta.pin||''),
        enlaceEntregado:String(valor('ENLACE_ENTREGADO')||''),
        mensajeEntrega:String(valor('MENSAJE_ENTREGA')||''),
        medioEntrega:String(valor('MEDIO_ENTREGA')||'WHATSAPP'),
        entregadoPor:String(valor('ENTREGADO_POR')||''),
        estado:String(valor('ESTADO')||'PENDIENTE'),
        notas:String(valor('NOTAS')||''),
        autorizadoPor:String(valor('AUTORIZADO_POR')||''),
        autorizadoEn:fechaHoraApi_(valor('AUTORIZADO_EN')),
        actualizadoEn:fechaHoraApi_(valor('ACTUALIZADO_EN'))
      };
    })
    .sort((a,b)=>String(b.actualizadoEn||b.fechaEntrega).localeCompare(String(a.actualizadoEn||a.fechaEntrega)));
}

function guardarEntregaMD20_(r){
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);

  try{
    const libro=md20LibroEstable_();
    const hoja=libro.getSheetByName('ENTREGAS');
    if(!hoja)throw new Error('Ejecuta primero prepararModuloEntregasMD20.');

    const ventaId=String(r.ventaId||'').trim();
    const venta=listarVentasMD20_().find(v=>String(v.id)===ventaId);
    if(!venta)throw new Error('No se encontró la venta.');

    const estado=String(r.estado||'PENDIENTE').trim().toUpperCase();
    const requierePago=['AUTORIZADA','ENVIANDO','ENVIADA','ENTREGADA'];

    if(requierePago.includes(estado)&&String(venta.estadoPago)!=='PAGADO'){
      throw new Error('La entrega no puede autorizarse porque la venta no está pagada.');
    }

    const encabezados=encabezadosEntregaMD20_(hoja);
    const col=n=>{
      const i=encabezados.indexOf(n);
      if(i<0)throw new Error('Falta la columna '+n+' en ENTREGAS.');
      return i+1;
    };

    const id=String(r.id||'').trim()||
      'ENT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();

    let fila=buscarFilaPorValorMD20_(hoja,col('ENTREGA_ID'),id);
    if(!fila)fila=primeraFilaLibreCanvaMD20_(hoja);

    const ahora=new Date();
    const asignar=(n,v)=>{
      const i=encabezados.indexOf(n);
      if(i>=0)hoja.getRange(fila,i+1).setValue(v);
    };

    asignar('ENTREGA_ID',id);
    asignar('VENTA_ID',ventaId);
    asignar('DETALLE_ID',String(r.detalleId||''));
    asignar('CLIENTE_ID',venta.clienteId||'');
    asignar('PRODUCTO_ID',venta.productoId||'');
    asignar('CUENTA_ID',String(r.cuentaId||'').trim());
    asignar('TIPO_ENTREGA',String(r.tipoEntrega||'ARCHIVO').toUpperCase());
    asignar('ARCHIVO_URL',String(r.archivoUrl||'').trim());
    asignar('USUARIO_ENTREGADO',String(r.usuarioEntregado||'').trim());
    asignar('CONTRASENA_ENTREGADA',String(r.contrasenaEntregada||'').trim());
    asignar('PERFIL_ENTREGADO',String(r.perfilEntregado||'').trim());
    asignar('PIN_ENTREGADO',String(r.pinEntregado||'').trim());
    asignar('ENLACE_ENTREGADO',String(r.enlaceEntregado||'').trim());
    asignar('MENSAJE_ENTREGA',String(r.mensajeEntrega||'').trim());
    asignar('MEDIO_ENTREGA',String(r.medioEntrega||'WHATSAPP').toUpperCase());
    asignar('ESTADO',estado);
    asignar('NOTAS',String(r.notas||'').trim());
    asignar('ACTUALIZADO_EN',ahora);

    if(estado==='AUTORIZADA'){
      asignar('AUTORIZADO_POR','ADMINISTRADOR');
      asignar('AUTORIZADO_EN',ahora);
    }

    if(['ENVIADA','ENTREGADA'].includes(estado)){
      asignar('FECHA_ENTREGA',ahora);
      asignar('ENTREGADO_POR','ADMINISTRADOR');
    }

    SpreadsheetApp.flush();

    actualizarVentaDesdeEntregaMD20_(ventaId,estado);

    if(String(r.cuentaId||'').trim()){
      actualizarInventarioDesdeEntregaMD20_(String(r.cuentaId).trim(),estado);
    }

    crearNotificacionEntregaMD20_(id,ventaId,estado);
    registrarLogVentaMD20_(
      'GUARDAR_ENTREGA',
      id,
      'Entrega guardada para '+venta.numeroVenta+' con estado '+estado+'.'
    );

    SpreadsheetApp.flush();
    return listarEntregasMD20_().find(e=>e.id===id);

  }finally{
    lock.releaseLock();
  }
}

function cambiarEstadoEntregaMD20_(entregaId,estado){
  estado=String(estado||'').trim().toUpperCase();
  const permitidos=['BLOQUEADA','PENDIENTE','AUTORIZADA','ENVIANDO','ENVIADA','ENTREGADA','ERROR','CANCELADA'];
  if(!permitidos.includes(estado))throw new Error('Estado de entrega no válido.');

  const entrega=listarEntregasMD20_().find(e=>e.id===String(entregaId||''));
  if(!entrega)throw new Error('No se encontró la entrega.');

  return guardarEntregaMD20_({
    ...entrega,
    estado:estado
  });
}

function sincronizarEntregasDesdeVentasMD20_(){
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName('ENTREGAS');
  if(!hoja)return;

  const ventas=listarVentasMD20_();
  const existentes={};

  if(hoja.getLastRow()>1){
    hoja.getRange(2,1,hoja.getLastRow()-1,2).getDisplayValues()
      .forEach(f=>{if(f[1])existentes[String(f[1])]=true;});
  }

  ventas.forEach(venta=>{
    if(existentes[String(venta.id)])return;

    const estado=String(venta.estadoPago)==='PAGADO'?'PENDIENTE':'BLOQUEADA';
    hoja.appendRow([
      'ENT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
      venta.id,'',venta.clienteId||'',venta.productoId||'','',
      '','ARCHIVO','','','','','','','',
      'WHATSAPP','',estado,
      'Entrega creada automáticamente desde la venta.','','',new Date()
    ]);
  });
}

function actualizarVentaDesdeEntregaMD20_(ventaId,estadoEntrega){
  const hoja=md20LibroEstable_().getSheetByName('VENTAS');
  if(!hoja)return;

  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());

  const colId=encabezados.indexOf('VENTA_ID')+1;
  const colEstado=encabezados.indexOf('ESTADO_ENTREGA')+1;
  const colActualizado=encabezados.indexOf('ACTUALIZADO_EN')+1;

  if(!colId||!colEstado)return;

  const fila=buscarFilaPorValorMD20_(hoja,colId,String(ventaId));
  if(!fila)return;

  const mapa={
    BLOQUEADA:'BLOQUEADA',
    PENDIENTE:'PENDIENTE',
    AUTORIZADA:'PREPARANDO',
    ENVIANDO:'PREPARANDO',
    ENVIADA:'ENTREGADO',
    ENTREGADA:'ENTREGADO',
    ERROR:'PENDIENTE',
    CANCELADA:'CANCELADO'
  };

  hoja.getRange(fila,colEstado).setValue(mapa[estadoEntrega]||'PENDIENTE');
  if(colActualizado)hoja.getRange(fila,colActualizado).setValue(new Date());
}

function actualizarInventarioDesdeEntregaMD20_(cuentaId,estadoEntrega){
  const hoja=md20LibroEstable_().getSheetByName('CUENTAS_DIGITALES');
  if(!hoja||hoja.getLastRow()<=1)return;

  const fila=buscarFilaPorValorMD20_(hoja,1,String(cuentaId));
  if(!fila)return;

  const total=Number(hoja.getRange(fila,12).getValue()||1);
  let disponibles=Number(hoja.getRange(fila,13).getValue()||0);

  if(['AUTORIZADA','ENVIANDO','ENVIADA','ENTREGADA'].includes(estadoEntrega)){
    const marca='ENTREGA:'+String(cuentaId);
    const notas=String(hoja.getRange(fila,19).getValue()||'');
    if(!notas.includes(marca)){
      disponibles=Math.max(0,disponibles-1);
      hoja.getRange(fila,13).setValue(disponibles);
      hoja.getRange(fila,19).setValue((notas?notas+'\n':'')+marca);
    }
    hoja.getRange(fila,18).setValue(disponibles>0?'DISPONIBLE':'ASIGNADA');
  }

  hoja.getRange(fila,21).setValue(new Date());
}

function crearNotificacionEntregaMD20_(entregaId,ventaId,estado){
  const hoja=md20LibroEstable_().getSheetByName('NOTIFICACIONES');
  if(!hoja)return;

  hoja.appendRow([
    'NOT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
    'ADMINISTRADOR','ENTREGAS','Entrega '+estado,
    'La entrega '+entregaId+' de la venta '+ventaId+' cambió a '+estado,
    'ENTREGAS',entregaId,
    estado==='ERROR'?'ALTA':'MEDIA',
    'NO',new Date(),'','ACTIVA'
  ]);
}



/**
 * Devuelve datos de entrega del producto para completar automáticamente
 * archivos, enlaces y tipo de entrega.
 */
function obtenerDatosProductoEntregaMD20_(productoId){
  const producto=listarProductosMD20_().find(
    p=>String(p.id)===String(productoId||'')
  );

  if(!producto){
    return {
      tipoEntrega:'ARCHIVO',
      archivoUrl:'',
      enlaceEntrega:'',
      imagenUrl:''
    };
  }

  const tipoProducto=String(
    producto.tipoProducto||
    producto.tipo||
    ''
  ).toUpperCase();

  const tipoEntregaOriginal=String(
    producto.tipoEntrega||
    ''
  ).toUpperCase();

  let tipoEntrega=tipoEntregaOriginal||'ARCHIVO';

  if(tipoProducto.includes('CURSO'))tipoEntrega='CURSO';
  if(tipoProducto.includes('STREAM')||tipoProducto.includes('CUENTA'))tipoEntrega='CUENTA';
  if(tipoProducto.includes('CANVA'))tipoEntrega='CANVA';

  const extras=obtenerExtrasProductoEntregaMD20_(productoId);

  return {
    tipoEntrega:tipoEntrega,

    // En la hoja PRODUCTOS el enlace está guardado como ARCHIVO_ID.
    archivoUrl:String(
      producto.archivoId||
      producto.ARCHIVO_ID||
      extras.archivoId||
      producto.archivoUrl||
      producto.urlArchivo||
      producto.enlaceDescarga||
      producto.linkDescarga||
      ''
    ),

    enlaceEntrega:String(
      producto.enlaceEntrega||
      producto.enlaceAcceso||
      producto.urlAcceso||
      producto.url||
      ''
    ),

    imagenUrl:String(
      producto.imagenUrl||
      producto.IMAGEN_URL||
      extras.imagenUrl||
      ''
    )
  };
}



/**
 * Lee ARCHIVO_ID e IMAGEN_URL directamente desde la hoja PRODUCTOS
 * usando los nombres de encabezado.
 */
function obtenerExtrasProductoEntregaMD20_(productoId){
  const hoja=md20LibroEstable_().getSheetByName('PRODUCTOS');
  if(!hoja||hoja.getLastRow()<=1){
    return {archivoId:'',imagenUrl:''};
  }

  const encabezados=hoja
    .getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const colId=encabezados.indexOf('PRODUCTO_ID');
  const colArchivo=encabezados.indexOf('ARCHIVO_ID');
  const colImagen=encabezados.indexOf('IMAGEN_URL');

  if(colId<0){
    return {archivoId:'',imagenUrl:''};
  }

  const datos=hoja
    .getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getDisplayValues();

  const fila=datos.find(f=>String(f[colId]||'')===String(productoId||''));

  if(!fila){
    return {archivoId:'',imagenUrl:''};
  }

  return {
    archivoId:colArchivo>=0?String(fila[colArchivo]||''):'',
    imagenUrl:colImagen>=0?String(fila[colImagen]||''):''
  };
}



/**
 * Obtiene directamente ARCHIVO_ID e IMAGEN_URL desde PRODUCTOS.
 * No depende de listarProductosMD20_.
 */
function obtenerDatosProductoEntregaDirectoMD20_(productoId){
  const hoja=md20LibroEstable_().getSheetByName('PRODUCTOS');

  if(!hoja||hoja.getLastRow()<=1){
    return {
      productoId:String(productoId||''),
      tipoEntrega:'ARCHIVO',
      archivoUrl:'',
      enlaceEntrega:'',
      imagenUrl:''
    };
  }

  const encabezados=hoja
    .getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const indice=nombre=>encabezados.indexOf(nombre);

  const colId=indice('PRODUCTO_ID');
  if(colId<0)throw new Error('Falta PRODUCTO_ID en la hoja PRODUCTOS.');

  const datos=hoja
    .getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getDisplayValues();

  const fila=datos.find(f=>String(f[colId]||'').trim()===String(productoId||'').trim());

  if(!fila){
    return {
      productoId:String(productoId||''),
      tipoEntrega:'ARCHIVO',
      archivoUrl:'',
      enlaceEntrega:'',
      imagenUrl:''
    };
  }

  const valor=nombre=>{
    const i=indice(nombre);
    return i>=0?String(fila[i]||'').trim():'';
  };

  const tipoProducto=(
    valor('TIPO_PRODUCTO')||
    valor('TIPO')||
    ''
  ).toUpperCase();

  let tipoEntrega=(
    valor('TIPO_ENTREGA')||
    'ARCHIVO'
  ).toUpperCase();

  if(tipoProducto.includes('CURSO'))tipoEntrega='CURSO';
  if(tipoProducto.includes('STREAM')||tipoProducto.includes('CUENTA'))tipoEntrega='CUENTA';
  if(tipoProducto.includes('CANVA'))tipoEntrega='CANVA';

  return {
    productoId:String(productoId||''),
    tipoEntrega:tipoEntrega,
    archivoUrl:valor('ARCHIVO_ID'),
    enlaceEntrega:
      valor('ENLACE_ENTREGA')||
      valor('ENLACE_ACCESO')||
      valor('URL_ACCESO')||
      valor('URL'),
    imagenUrl:valor('IMAGEN_URL')
  };
}



/**
 * Guarda en ENTREGAS el mensaje generado automáticamente al abrir WhatsApp.
 */
function guardarMensajeEntregaGeneradoMD20_(entregaId,mensajeEntrega){
  const hoja=md20LibroEstable_().getSheetByName('ENTREGAS');
  if(!hoja)throw new Error('No existe la pestaña ENTREGAS.');

  const encabezados=encabezadosEntregaMD20_(hoja);
  const colId=encabezados.indexOf('ENTREGA_ID')+1;
  const colMensaje=encabezados.indexOf('MENSAJE_ENTREGA')+1;
  const colActualizado=encabezados.indexOf('ACTUALIZADO_EN')+1;

  if(!colId||!colMensaje){
    throw new Error('Faltan ENTREGA_ID o MENSAJE_ENTREGA en ENTREGAS.');
  }

  const fila=buscarFilaPorValorMD20_(hoja,colId,String(entregaId||'').trim());
  if(!fila)throw new Error('No se encontró la entrega.');

  hoja.getRange(fila,colMensaje).setValue(String(mensajeEntrega||'').trim());

  if(colActualizado){
    hoja.getRange(fila,colActualizado).setValue(new Date());
  }

  SpreadsheetApp.flush();

  return listarEntregasMD20_().find(
    e=>String(e.id)===String(entregaId)
  );
}

/**
 * Configuración pública utilizada para construir mensajes de entrega.
 */
function obtenerConfiguracionEntregaMD20_(){
  const hoja=md20LibroEstable_().getSheetByName('CONFIGURACION');
  const predeterminado={grupoVipUrl:'https://chat.whatsapp.com/LQzH8tfVocr0GhQ33HPBDa?s=cl&p=a&ilr=1&amv=1'};

  if(!hoja||hoja.getLastRow()<=1)return predeterminado;

  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const colClave=encabezados.indexOf('CLAVE');
  const colValor=encabezados.indexOf('VALOR');

  if(colClave<0||colValor<0)return predeterminado;

  const datos=hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getDisplayValues();

  const fila=datos.find(f=>String(f[colClave]||'').trim().toUpperCase()==='GRUPO_VIP_URL');

  return {
    grupoVipUrl:fila&&fila[colValor]?String(fila[colValor]).trim():predeterminado.grupoVipUrl
  };
}

/**
 * Ejecutar una sola vez para registrar o actualizar el enlace VIP.
 */
function prepararConfiguracionGrupoVipMD20(){
  const hoja=md20LibroEstable_().getSheetByName('CONFIGURACION');
  if(!hoja)throw new Error('No existe la pestaña CONFIGURACION.');

  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const colClave=encabezados.indexOf('CLAVE')+1;
  const colValor=encabezados.indexOf('VALOR')+1;

  if(!colClave||!colValor)throw new Error('Faltan CLAVE o VALOR en CONFIGURACION.');

  let fila=buscarFilaPorValorMD20_(hoja,colClave,'GRUPO_VIP_URL');

  if(!fila){
    fila=primeraFilaLibreCanvaMD20_(hoja);
    hoja.getRange(fila,colClave).setValue('GRUPO_VIP_URL');
  }

  hoja.getRange(fila,colValor).setValue('https://chat.whatsapp.com/LQzH8tfVocr0GhQ33HPBDa?s=cl&p=a&ilr=1&amv=1');

  const colDescripcion=encabezados.indexOf('DESCRIPCION')+1;
  const colTipo=encabezados.indexOf('TIPO')+1;
  const colEditable=encabezados.indexOf('EDITABLE')+1;
  const colActualizado=encabezados.indexOf('ACTUALIZADO_EN')+1;

  if(colDescripcion)hoja.getRange(fila,colDescripcion).setValue('Enlace del grupo VIP incluido en los mensajes de cursos.');
  if(colTipo)hoja.getRange(fila,colTipo).setValue('URL');
  if(colEditable)hoja.getRange(fila,colEditable).setValue('SI');
  if(colActualizado)hoja.getRange(fila,colActualizado).setValue(new Date());

  SpreadsheetApp.flush();
}

/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — CATÁLOGO ADMINISTRATIVO
 * FASE 5 · PARTE 1
 *
 * Ejecutar una sola vez:
 * prepararModuloCatalogoMD20
 * =========================================================
 */

function prepararModuloCatalogoMD20(){
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName('PRODUCTOS');
  if(!hoja)throw new Error('No existe la pestaña PRODUCTOS.');

  const encabezadosNuevos=[
    'PUBLICAR_CATALOGO',
    'SLUG_PRODUCTO',
    'DESCRIPCION_CORTA',
    'DESCRIPCION_COMPLETA',
    'PRECIO_PUBLICO',
    'PRECIO_ANTERIOR',
    'OFERTA',
    'DESTACADO',
    'ORDEN_CATALOGO',
    'DISPONIBILIDAD',
    'ETIQUETAS_PUBLICAS',
    'VENDE_ADMIN',
    'VENDE_REVENDEDOR',
    'ACTUALIZADO_CATALOGO_EN'
  ];

  let encabezados=obtenerEncabezadosCatalogoMD20_(hoja);

  encabezadosNuevos.forEach(nombre=>{
    if(!encabezados.includes(nombre)){
      const columna=hoja.getLastColumn()+1;
      if(hoja.getMaxColumns()<columna){
        hoja.insertColumnAfter(hoja.getMaxColumns());
      }
      hoja.getRange(1,columna).setValue(nombre);
      encabezados.push(nombre);
    }
  });

  encabezados=obtenerEncabezadosCatalogoMD20_(hoja);
  const mapa=mapaEncabezadosCatalogoMD20_(encabezados);

  hoja.getRange(1,1,1,hoja.getLastColumn())
    .setBackground('#111114')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  const totalFilas=Math.max(hoja.getMaxRows()-1,1);

  aplicarValidacionCatalogoMD20_(hoja,mapa.PUBLICAR_CATALOGO,['SI','NO'],totalFilas);
  aplicarValidacionCatalogoMD20_(hoja,mapa.OFERTA,['SI','NO'],totalFilas);
  aplicarValidacionCatalogoMD20_(hoja,mapa.DESTACADO,['SI','NO'],totalFilas);
  aplicarValidacionCatalogoMD20_(hoja,mapa.DISPONIBILIDAD,['DISPONIBLE','POCOS_CUPOS','AGOTADO','PROXIMAMENTE'],totalFilas);
  aplicarValidacionCatalogoMD20_(hoja,mapa.VENDE_ADMIN,['SI','NO'],totalFilas);
  aplicarValidacionCatalogoMD20_(hoja,mapa.VENDE_REVENDEDOR,['SI','NO'],totalFilas);

  if(mapa.PRECIO_PUBLICO){
    hoja.getRange(2,mapa.PRECIO_PUBLICO,totalFilas,1).setNumberFormat('#,##0.00');
  }
  if(mapa.PRECIO_ANTERIOR){
    hoja.getRange(2,mapa.PRECIO_ANTERIOR,totalFilas,1).setNumberFormat('#,##0.00');
  }
  if(mapa.ORDEN_CATALOGO){
    hoja.getRange(2,mapa.ORDEN_CATALOGO,totalFilas,1).setNumberFormat('0');
  }
  if(mapa.ACTUALIZADO_CATALOGO_EN){
    hoja.getRange(2,mapa.ACTUALIZADO_CATALOGO_EN,totalFilas,1).setNumberFormat('dd/MM/yyyy HH:mm');
  }

  if(hoja.getLastRow()>1){
    const datos=hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn()).getValues();

    datos.forEach((fila,indice)=>{
      const numeroFila=indice+2;
      const productoId=valorFilaCatalogoMD20_(fila,mapa,'PRODUCTO_ID');
      if(!productoId)return;

      const nombre=valorFilaCatalogoMD20_(fila,mapa,'NOMBRE');
      const descripcion=valorFilaCatalogoMD20_(fila,mapa,'DESCRIPCION');
      const precioVenta=valorFilaCatalogoMD20_(fila,mapa,'PRECIO_VENTA');

      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.PUBLICAR_CATALOGO,'NO');
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.SLUG_PRODUCTO,crearSlugCatalogoMD20_(nombre));
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.DESCRIPCION_CORTA,descripcion);
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.DESCRIPCION_COMPLETA,descripcion);
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.PRECIO_PUBLICO,Number(precioVenta||0));
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.PRECIO_ANTERIOR,0);
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.OFERTA,'NO');
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.DESTACADO,'NO');
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.ORDEN_CATALOGO,indice+1);
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.DISPONIBILIDAD,'DISPONIBLE');
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.VENDE_ADMIN,'SI');
      colocarSiVacioCatalogoMD20_(hoja,numeroFila,mapa.VENDE_REVENDEDOR,'SI');
    });
  }

  SpreadsheetApp.flush();

  const resultado={
    ok:true,
    mensaje:'Catálogo preparado correctamente. Se agregaron o verificaron las columnas del catálogo en PRODUCTOS. Los productos existentes quedaron SIN PUBLICAR para evitar mostrarlos accidentalmente.'
  };

  console.log(resultado.mensaje);
  return resultado;
}

function aplicarValidacionCatalogoMD20_(hoja,columna,valores,totalFilas){
  if(!columna)return;
  const regla=SpreadsheetApp.newDataValidation()
    .requireValueInList(valores,true)
    .setAllowInvalid(false)
    .build();
  hoja.getRange(2,columna,totalFilas,1).setDataValidation(regla);
}

function colocarSiVacioCatalogoMD20_(hoja,fila,columna,valor){
  if(!columna)return;
  const celda=hoja.getRange(fila,columna);
  if(String(celda.getDisplayValue()||'').trim()===''){
    celda.setValue(valor);
  }
}

function obtenerEncabezadosCatalogoMD20_(hoja){
  return hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());
}

function mapaEncabezadosCatalogoMD20_(encabezados){
  const mapa={};
  encabezados.forEach((nombre,indice)=>mapa[nombre]=indice+1);
  return mapa;
}

function valorFilaCatalogoMD20_(fila,mapa,nombre){
  const columna=mapa[nombre];
  return columna?fila[columna-1]:'';
}

function textoFilaCatalogoMD20_(fila,mapa,nombre,defecto){
  const valor=valorFilaCatalogoMD20_(fila,mapa,nombre);
  const texto=String(valor==null?'':valor).trim();
  return texto||String(defecto||'');
}

function numeroFilaCatalogoMD20_(fila,mapa,nombre,defecto){
  const valor=Number(valorFilaCatalogoMD20_(fila,mapa,nombre));
  return Number.isFinite(valor)?valor:Number(defecto||0);
}

function fechaCatalogoApiMD20_(valor){
  if(!valor)return '';
  if(Object.prototype.toString.call(valor)==='[object Date]'&&!isNaN(valor)){
    return Utilities.formatDate(valor,Session.getScriptTimeZone()||'America/Bogota','yyyy-MM-dd HH:mm:ss');
  }
  return String(valor);
}

function crearSlugCatalogoMD20_(texto){
  return String(texto||'producto')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'')
    .slice(0,90)||'producto';
}

function normalizarSiNoCatalogoMD20_(valor,defecto){
  const texto=String(valor||defecto||'NO').trim().toUpperCase();
  return texto==='SI'?'SI':'NO';
}

function normalizarDisponibilidadCatalogoMD20_(valor){
  const permitido=['DISPONIBLE','POCOS_CUPOS','AGOTADO','PROXIMAMENTE'];
  const texto=String(valor||'DISPONIBLE').trim().toUpperCase();
  return permitido.includes(texto)?texto:'DISPONIBLE';
}

function listarCatalogoAdminMD20_(){
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName('PRODUCTOS');
  if(!hoja||hoja.getLastRow()<=1)return[];

  const encabezados=obtenerEncabezadosCatalogoMD20_(hoja);
  const mapa=mapaEncabezadosCatalogoMD20_(encabezados);
  const categorias={};
  listarCategoriasMD20_().forEach(c=>categorias[c.id]=c.nombre);

  return hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getValues()
    .filter(fila=>textoFilaCatalogoMD20_(fila,mapa,'PRODUCTO_ID','')!=='')
    .map(fila=>{
      const categoriaId=textoFilaCatalogoMD20_(fila,mapa,'CATEGORIA_ID','');
      const precioVenta=numeroFilaCatalogoMD20_(fila,mapa,'PRECIO_VENTA',0);
      const descripcion=textoFilaCatalogoMD20_(fila,mapa,'DESCRIPCION','');

      return {
        id:textoFilaCatalogoMD20_(fila,mapa,'PRODUCTO_ID',''),
        nombre:textoFilaCatalogoMD20_(fila,mapa,'NOMBRE',''),
        descripcion:descripcion,
        categoriaId:categoriaId,
        categoriaNombre:categorias[categoriaId]||categoriaId,
        tipoProducto:textoFilaCatalogoMD20_(fila,mapa,'TIPO_PRODUCTO','DIGITAL'),
        tipoEntrega:textoFilaCatalogoMD20_(fila,mapa,'TIPO_ENTREGA','ARCHIVO'),
        precioCompra:numeroFilaCatalogoMD20_(fila,mapa,'PRECIO_COMPRA',0),
        precioVenta:precioVenta,
        moneda:textoFilaCatalogoMD20_(fila,mapa,'MONEDA','USD'),
        duracionDias:numeroFilaCatalogoMD20_(fila,mapa,'DURACION_DIAS',0),
        stockMinimo:numeroFilaCatalogoMD20_(fila,mapa,'STOCK_MINIMO',0),
        controlarStock:textoFilaCatalogoMD20_(fila,mapa,'CONTROLAR_STOCK','NO'),
        archivoId:textoFilaCatalogoMD20_(fila,mapa,'ARCHIVO_ID',''),
        imagenUrl:textoFilaCatalogoMD20_(fila,mapa,'IMAGEN_URL',''),
        estado:textoFilaCatalogoMD20_(fila,mapa,'ESTADO','ACTIVO'),
        publicarCatalogo:textoFilaCatalogoMD20_(fila,mapa,'PUBLICAR_CATALOGO','NO'),
        slugProducto:textoFilaCatalogoMD20_(fila,mapa,'SLUG_PRODUCTO',crearSlugCatalogoMD20_(textoFilaCatalogoMD20_(fila,mapa,'NOMBRE',''))),
        descripcionCorta:textoFilaCatalogoMD20_(fila,mapa,'DESCRIPCION_CORTA',descripcion),
        descripcionCompleta:textoFilaCatalogoMD20_(fila,mapa,'DESCRIPCION_COMPLETA',descripcion),
        precioPublico:numeroFilaCatalogoMD20_(fila,mapa,'PRECIO_PUBLICO',precioVenta),
        precioAnterior:numeroFilaCatalogoMD20_(fila,mapa,'PRECIO_ANTERIOR',0),
        oferta:textoFilaCatalogoMD20_(fila,mapa,'OFERTA','NO'),
        destacado:textoFilaCatalogoMD20_(fila,mapa,'DESTACADO','NO'),
        ordenCatalogo:numeroFilaCatalogoMD20_(fila,mapa,'ORDEN_CATALOGO',999),
        disponibilidad:textoFilaCatalogoMD20_(fila,mapa,'DISPONIBILIDAD','DISPONIBLE'),
        etiquetasPublicas:textoFilaCatalogoMD20_(fila,mapa,'ETIQUETAS_PUBLICAS',''),
        vendeAdmin:textoFilaCatalogoMD20_(fila,mapa,'VENDE_ADMIN','SI'),
        vendeRevendedor:textoFilaCatalogoMD20_(fila,mapa,'VENDE_REVENDEDOR','SI'),
        actualizadoCatalogoEn:fechaCatalogoApiMD20_(valorFilaCatalogoMD20_(fila,mapa,'ACTUALIZADO_CATALOGO_EN'))
      };
    })
    .sort((a,b)=>Number(a.ordenCatalogo||999)-Number(b.ordenCatalogo||999)||a.nombre.localeCompare(b.nombre));
}

function listarCatalogoPublicoMD20_(canal){
  const referencia=String(canal||'ADMIN').trim().toUpperCase();
  const esAdministrador=!referencia||referencia==='ADMIN'||referencia==='ADMINISTRADOR';

  return listarCatalogoAdminMD20_()
    .filter(p=>{
      if(p.estado!=='ACTIVO'||p.publicarCatalogo!=='SI')return false;
      return esAdministrador?p.vendeAdmin==='SI':p.vendeRevendedor==='SI';
    })
    .map(p=>({
      id:p.id,
      nombre:p.nombre,
      slug:p.slugProducto,
      descripcionCorta:p.descripcionCorta,
      descripcionCompleta:p.descripcionCompleta,
      categoriaId:p.categoriaId,
      categoriaNombre:p.categoriaNombre,
      tipoProducto:p.tipoProducto,
      tipoEntrega:p.tipoEntrega,
      precio:p.precioPublico,
      precioAnterior:p.precioAnterior,
      moneda:p.moneda,
      duracionDias:p.duracionDias,
      imagenUrl:p.imagenUrl,
      oferta:p.oferta,
      destacado:p.destacado,
      orden:p.ordenCatalogo,
      disponibilidad:p.disponibilidad,
      etiquetas:p.etiquetasPublicas
    }));
}

function listarCategoriasCatalogoPublicoMD20_(productos){
  const registros=Array.isArray(productos)?productos:[];
  const ids=[...new Set(registros.map(p=>p.categoriaId).filter(Boolean))];
  const mapa={};
  listarCategoriasMD20_().forEach(c=>mapa[c.id]=c);

  return ids.map(id=>({
    id:id,
    nombre:mapa[id]?mapa[id].nombre:id,
    descripcion:mapa[id]?mapa[id].descripcion:'',
    icono:mapa[id]?mapa[id].icono:'',
    color:mapa[id]?mapa[id].color:'',
    cantidad:registros.filter(p=>p.categoriaId===id).length
  }));
}

function leerConfiguracionMD20_(){
  const resultado={};
  const hoja=md20LibroEstable_().getSheetByName('CONFIGURACION');
  if(!hoja||hoja.getLastRow()<=1)return resultado;

  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());
  const colClave=encabezados.indexOf('CLAVE');
  const colValor=encabezados.indexOf('VALOR');
  if(colClave<0||colValor<0)return resultado;

  hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getDisplayValues()
    .forEach(fila=>{
      const clave=String(fila[colClave]||'').trim().toUpperCase();
      if(clave)resultado[clave]=String(fila[colValor]||'').trim();
    });
  return resultado;
}

function guardarConfiguracionClaveMD20_(clave,valor,descripcion,tipo,editable){
  const hoja=md20LibroEstable_().getSheetByName('CONFIGURACION');
  if(!hoja)throw new Error('No existe la pestaña CONFIGURACION.');

  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());
  const columna=nombre=>encabezados.indexOf(nombre)+1;
  const colClave=columna('CLAVE');
  const colValor=columna('VALOR');
  if(!colClave||!colValor)throw new Error('CONFIGURACION debe tener CLAVE y VALOR.');

  let fila=buscarFilaPorValorMD20_(hoja,colClave,String(clave).toUpperCase());
  if(!fila){
    fila=primeraFilaLibreCanvaMD20_(hoja);
    hoja.getRange(fila,colClave).setValue(String(clave).toUpperCase());
  }
  hoja.getRange(fila,colValor).setValue(valor);
  if(columna('DESCRIPCION'))hoja.getRange(fila,columna('DESCRIPCION')).setValue(descripcion||'');
  if(columna('TIPO'))hoja.getRange(fila,columna('TIPO')).setValue(tipo||'TEXTO');
  if(columna('EDITABLE'))hoja.getRange(fila,columna('EDITABLE')).setValue(editable||'SI');
  if(columna('ACTUALIZADO_EN'))hoja.getRange(fila,columna('ACTUALIZADO_EN')).setValue(new Date());
}

function obtenerConfiguracionTiendaPublicaMD20_(){
  const valores=leerConfiguracionMD20_();
  const whatsapp=
    valores.WHATSAPP_PRINCIPAL||
    valores.WHATSAPP_SOPORTE||
    valores.TELEFONO_SOPORTE||
    valores.WHATSAPP||'';
  const tasa=Number(String(valores.TASA_DOLAR_BS||'0').replace(',','.'))||0;
  const mostrarBs=String(valores.MOSTRAR_PRECIO_BS||'SI').toUpperCase()!=='NO';

  return {
    nombreNegocio:valores.NOMBRE_NEGOCIO||'Mundo Digital 2.0',
    whatsapp:String(whatsapp).replace(/\D/g,''),
    correo:valores.CORREO_NEGOCIO||'',
    moneda:valores.MONEDA_PRINCIPAL||'USD',
    tasaBs:tasa,
    fechaTasa:valores.FECHA_TASA_DOLAR||'',
    mostrarPrecioBs:mostrarBs,
    maxComprobanteMb:Math.min(8,Math.max(1,Number(valores.MAX_COMPROBANTE_MB||5))),
    colores:{
      principal:valores.COLOR_PRINCIPAL||'#FF1744',
      secundario:valores.COLOR_SECUNDARIO||'#FF6D00',
      fondo:valores.COLOR_FONDO||'#08080A'
    }
  };
}

function prepararConfiguracionTiendaPublicaMD20(){
  guardarConfiguracionClaveMD20_('NOMBRE_NEGOCIO','Mundo Digital 2.0','Nombre público mostrado en la tienda.','TEXTO','SI');
  guardarConfiguracionClaveMD20_('WHATSAPP_PRINCIPAL',leerConfiguracionMD20_().WHATSAPP_PRINCIPAL||'','WhatsApp que recibe los pedidos.','TELEFONO','SI');
  guardarConfiguracionClaveMD20_('CORREO_NEGOCIO',leerConfiguracionMD20_().CORREO_NEGOCIO||'','Correo público de la tienda.','CORREO','SI');
  guardarConfiguracionClaveMD20_('MONEDA_PRINCIPAL','USD','Moneda principal del catálogo.','TEXTO','SI');
  guardarConfiguracionClaveMD20_('COLOR_PRINCIPAL','#FF1744','Color principal de la tienda.','COLOR','SI');
  guardarConfiguracionClaveMD20_('COLOR_SECUNDARIO','#FF6D00','Color secundario de la tienda.','COLOR','SI');
  guardarConfiguracionClaveMD20_('COLOR_FONDO','#08080A','Color de fondo de la tienda.','COLOR','SI');
  SpreadsheetApp.flush();
  return {ok:true,mensaje:'Configuración pública preparada.'};
}

function prepararPagosTiendaMD20(){
  prepararConfiguracionTiendaPublicaMD20();
  prepararCheckoutTiendaMD20();

  const valores=leerConfiguracionMD20_();
  let carpetaId=String(valores.CARPETA_COMPROBANTES_ID||'').trim();
  let carpeta=null;

  if(carpetaId){
    try{carpeta=DriveApp.getFolderById(carpetaId);}catch(error){carpeta=null;}
  }
  if(!carpeta){
    carpeta=DriveApp.createFolder('Mundo Digital 2.0 - Comprobantes de pago');
    carpetaId=carpeta.getId();
  }

  guardarConfiguracionClaveMD20_('TASA_DOLAR_BS',valores.TASA_DOLAR_BS||'0','Tasa manual usada para convertir USD a bolívares.','NUMERO','SI');
  guardarConfiguracionClaveMD20_('FECHA_TASA_DOLAR',valores.FECHA_TASA_DOLAR||'','Fecha y hora de la última actualización de la tasa.','FECHA_HORA','NO');
  guardarConfiguracionClaveMD20_('MOSTRAR_PRECIO_BS',valores.MOSTRAR_PRECIO_BS||'SI','Mostrar equivalencia en bolívares en la tienda.','SI_NO','SI');
  guardarConfiguracionClaveMD20_('MAX_COMPROBANTE_MB',valores.MAX_COMPROBANTE_MB||'5','Tamaño máximo del comprobante en MB.','NUMERO','SI');
  guardarConfiguracionClaveMD20_('CARPETA_COMPROBANTES_ID',carpetaId,'Carpeta privada de Drive para comprobantes.','ID_DRIVE','NO');
  SpreadsheetApp.flush();

  return {
    ok:true,
    mensaje:'Tasa, métodos y comprobantes preparados correctamente.',
    carpetaId:carpetaId,
    carpetaUrl:carpeta.getUrl()
  };
}

function obtenerConfiguracionPagosTiendaMD20_(){
  const tienda=obtenerConfiguracionTiendaPublicaMD20_();
  const valores=leerConfiguracionMD20_();
  let carpetaUrl='';
  if(valores.CARPETA_COMPROBANTES_ID){
    try{carpetaUrl=DriveApp.getFolderById(valores.CARPETA_COMPROBANTES_ID).getUrl();}catch(error){}
  }
  return {
    tasaBs:tienda.tasaBs,
    fechaTasa:tienda.fechaTasa,
    mostrarPrecioBs:tienda.mostrarPrecioBs?'SI':'NO',
    maxComprobanteMb:tienda.maxComprobanteMb,
    carpetaUrl:carpetaUrl,
    metodos:listarMetodosPagoDetalladosMD20_(false)
  };
}

function guardarConfiguracionPagosTiendaMD20_(registro){
  const tasa=Number(String(registro.tasaBs||'').replace(',','.'));
  if(!isFinite(tasa)||tasa<=0)throw new Error('La tasa del dólar debe ser mayor que cero.');
  const maxMb=Math.min(8,Math.max(1,Number(registro.maxComprobanteMb||5)));

  guardarConfiguracionClaveMD20_('TASA_DOLAR_BS',tasa,'Tasa manual usada para convertir USD a bolívares.','NUMERO','SI');
  guardarConfiguracionClaveMD20_('FECHA_TASA_DOLAR',Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'dd/MM/yyyy HH:mm'),'Fecha y hora de la última actualización de la tasa.','FECHA_HORA','NO');
  guardarConfiguracionClaveMD20_('MOSTRAR_PRECIO_BS',String(registro.mostrarPrecioBs||'SI').toUpperCase()==='NO'?'NO':'SI','Mostrar equivalencia en bolívares en la tienda.','SI_NO','SI');
  guardarConfiguracionClaveMD20_('MAX_COMPROBANTE_MB',maxMb,'Tamaño máximo del comprobante en MB.','NUMERO','SI');

  const hoja=md20LibroEstable_().getSheetByName('METODOS_PAGO');
  if(!hoja)throw new Error('No existe METODOS_PAGO.');
  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
  const col=nombre=>encabezados.indexOf(nombre)+1;

  (Array.isArray(registro.metodos)?registro.metodos:[]).forEach(metodo=>{
    const id=String(metodo.id||'').trim();
    if(!id)return;
    const fila=buscarFilaPorValorMD20_(hoja,col('METODO_PAGO_ID'),id);
    if(!fila)return;
    const asignar=(nombre,valor)=>{const c=col(nombre);if(c)hoja.getRange(fila,c).setValue(valor);};
    asignar('NOMBRE',String(metodo.nombre||'').trim());
    asignar('TIPO',String(metodo.tipo||'').trim().toUpperCase());
    asignar('MONEDA',String(metodo.moneda||'USD').trim().toUpperCase());
    asignar('TITULAR',String(metodo.titular||'').trim());
    asignar('DOCUMENTO',String(metodo.documento||'').trim());
    asignar('BANCO',String(metodo.banco||'').trim());
    asignar('NUMERO_CUENTA',String(metodo.numeroCuenta||'').trim());
    asignar('TELEFONO',String(metodo.telefono||'').trim());
    asignar('CORREO',String(metodo.correo||'').trim());
    asignar('DATOS_ADICIONALES',String(metodo.datosAdicionales||'').trim());
    asignar('ESTADO',String(metodo.estado||'ACTIVO').toUpperCase()==='INACTIVO'?'INACTIVO':'ACTIVO');
    asignar('ORDEN',Math.max(1,Number(metodo.orden||999)));
  });
  SpreadsheetApp.flush();
  return obtenerConfiguracionPagosTiendaMD20_();
}

/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — CHECKOUT PÚBLICO DE LA TIENDA
 * Ejecutar una sola vez: prepararCheckoutTiendaMD20
 * =========================================================
 */

const MD20_PEDIDOS_TIENDA={
  HOJA:'PEDIDOS_TIENDA',
  ENCABEZADOS:[
    'PEDIDO_ID','NUMERO_PEDIDO','TOKEN_PUBLICO','SOLICITUD_ID',
    'CLIENTE_ID','NOMBRE_CLIENTE','WHATSAPP','CORREO','PAIS',
    'VENDEDOR_ID','METODO_PAGO_ID','METODO_PAGO_NOMBRE',
    'SUBTOTAL','DESCUENTO','TOTAL','MONEDA',
    'ESTADO_PEDIDO','ESTADO_PAGO','ESTADO_ENTREGA',
    'VENTAS_IDS','PRODUCTOS_JSON','NOTAS_CLIENTE','ORIGEN',
    'CREADO_EN','ACTUALIZADO_EN','TASA_BS','TOTAL_BS',
    'REFERENCIA_PAGO','COMPROBANTE_URL','FECHA_COMPROBANTE'
  ]
};

function prepararCheckoutTiendaMD20(){
  const libro=md20LibroEstable_();
  let hoja=libro.getSheetByName(MD20_PEDIDOS_TIENDA.HOJA);

  if(!hoja){
    hoja=libro.insertSheet(MD20_PEDIDOS_TIENDA.HOJA);
  }

  const columnas=MD20_PEDIDOS_TIENDA.ENCABEZADOS.length;

  if(hoja.getMaxColumns()<columnas){
    hoja.insertColumnsAfter(
      hoja.getMaxColumns(),
      columnas-hoja.getMaxColumns()
    );
  }

  if(hoja.getMaxRows()<1000){
    hoja.insertRowsAfter(
      hoja.getMaxRows(),
      1000-hoja.getMaxRows()
    );
  }

  hoja
    .getRange(1,1,1,columnas)
    .setValues([MD20_PEDIDOS_TIENDA.ENCABEZADOS]);

  hoja.setFrozenRows(1);
  hoja.setFrozenColumns(2);
  hoja.setTabColor('#FF1744');
  hoja.setRowHeight(1,44);

  hoja
    .getRange(1,1,1,columnas)
    .setBackground('#101014')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(
      true,true,true,true,true,true,
      '#FF6D00',
      SpreadsheetApp.BorderStyle.SOLID_MEDIUM
    );

  const anchos=[
    150,180,330,210,150,220,180,240,140,160,170,220,
    130,120,130,100,160,150,160,300,380,300,150,170,170,
    120,140,180,330,180
  ];

  anchos.forEach((ancho,indice)=>{
    hoja.setColumnWidth(indice+1,ancho);
  });

  hoja
    .getRange(2,13,hoja.getMaxRows()-1,3)
    .setNumberFormat('#,##0.00');

  hoja
    .getRange(2,24,hoja.getMaxRows()-1,2)
    .setNumberFormat('dd/MM/yyyy HH:mm');

  hoja.getRange(2,26,hoja.getMaxRows()-1,2).setNumberFormat('#,##0.00');
  hoja.getRange(2,30,hoja.getMaxRows()-1,1).setNumberFormat('dd/MM/yyyy HH:mm');

  aplicarValidacionPedidoTiendaMD20_(
    hoja,
    17,
    ['PROCESANDO','PENDIENTE','CANCELADO','COMPLETADO','ERROR']
  );

  aplicarValidacionPedidoTiendaMD20_(
    hoja,
    18,
    ['PENDIENTE','EN_REVISION','CONFIRMADO','RECHAZADO','ANULADO']
  );

  aplicarValidacionPedidoTiendaMD20_(
    hoja,
    19,
    ['BLOQUEADA','PENDIENTE','PARCIAL','ENTREGADA','CANCELADA']
  );

  if(hoja.getFilter()){
    hoja.getFilter().remove();
  }

  hoja
    .getRange(1,1,hoja.getMaxRows(),columnas)
    .createFilter();

  SpreadsheetApp.flush();

  const mensaje=
    'Checkout preparado correctamente. Se creó o actualizó PEDIDOS_TIENDA.';

  console.log(mensaje);

  return {
    ok:true,
    mensaje:mensaje
  };
}

function aplicarValidacionPedidoTiendaMD20_(hoja,columna,valores){
  hoja
    .getRange(2,columna,hoja.getMaxRows()-1,1)
    .setDataValidation(
      SpreadsheetApp
        .newDataValidation()
        .requireValueInList(valores,true)
        .setAllowInvalid(false)
        .build()
    );
}

function listarMetodosPagoDetalladosMD20_(soloActivos){
  const hoja=md20LibroEstable_().getSheetByName('METODOS_PAGO');
  if(!hoja||hoja.getLastRow()<=1)return[];

  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const datos=hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getDisplayValues();

  const valor=(fila,nombre)=>{
    const i=encabezados.indexOf(nombre);
    return i>=0?String(fila[i]||'').trim():'';
  };

  return datos
    .filter(fila=>valor(fila,'METODO_PAGO_ID'))
    .map(fila=>({
      id:valor(fila,'METODO_PAGO_ID'),
      nombre:valor(fila,'NOMBRE'),
      tipo:valor(fila,'TIPO'),
      moneda:(valor(fila,'MONEDA')||'USD').toUpperCase(),
      titular:valor(fila,'TITULAR'),
      documento:valor(fila,'DOCUMENTO'),
      banco:valor(fila,'BANCO'),
      numeroCuenta:valor(fila,'NUMERO_CUENTA'),
      telefono:valor(fila,'TELEFONO'),
      correo:valor(fila,'CORREO'),
      datosAdicionales:valor(fila,'DATOS_ADICIONALES'),
      estado:(valor(fila,'ESTADO')||'ACTIVO').toUpperCase(),
      orden:Number(valor(fila,'ORDEN')||999)
    }))
    .filter(metodo=>!soloActivos||metodo.estado==='ACTIVO')
    .sort((a,b)=>a.orden-b.orden||a.nombre.localeCompare(b.nombre));
}

function listarMetodosPagoPublicosMD20_(){
  return listarMetodosPagoDetalladosMD20_(true).map(metodo=>({
    id:metodo.id,
    nombre:metodo.nombre,
    tipo:metodo.tipo,
    moneda:metodo.moneda,
    titular:metodo.titular,
    documento:metodo.documento,
    banco:metodo.banco,
    numeroCuenta:metodo.numeroCuenta,
    telefono:metodo.telefono,
    correo:metodo.correo,
    datosAdicionales:metodo.datosAdicionales
  }));
}

function registrarPedidoTiendaPublicaMD20_(registro){
  if(String(registro.sitioWeb||'').trim()){
    throw new Error('Solicitud no válida.');
  }

  const solicitudId=String(registro.solicitudId||'').trim();

  if(!solicitudId||solicitudId.length<12){
    throw new Error('No se pudo identificar la solicitud.');
  }

  const libro=md20LibroEstable_();
  const hojaPedidos=libro.getSheetByName(MD20_PEDIDOS_TIENDA.HOJA);

  if(!hojaPedidos){
    throw new Error(
      'Primero ejecuta prepararCheckoutTiendaMD20 en Apps Script.'
    );
  }

  const pedidoExistente=buscarPedidoPorSolicitudMD20_(
    hojaPedidos,
    solicitudId
  );

  if(pedidoExistente){
    return {
      ok:true,
      pedido:pedidoPublicoMD20_(pedidoExistente),
      repetido:true
    };
  }

  const nombre=String(registro.nombreCompleto||'').trim();
  const codigoPais=String(registro.codigoPais||'')
    .replace(/\D/g,'');
  const numeroLocal=String(registro.whatsapp||'')
    .replace(/\D/g,'');
  const correo=String(registro.correo||'')
    .trim()
    .toLowerCase();
  const pais=String(registro.pais||'').trim();
  const documento=String(registro.documento||'').trim();
  const notas=String(registro.notas||'').trim();
  const metodoPagoId=String(registro.metodoPagoId||'').trim();
  const aceptaTerminos=registro.aceptaTerminos===true||
    String(registro.aceptaTerminos||'').toUpperCase()==='SI';

  if(nombre.length<3){
    throw new Error('Escribe el nombre completo del comprador.');
  }

  if(!codigoPais){
    throw new Error('Escribe el código de país del WhatsApp.');
  }

  if(numeroLocal.length<7){
    throw new Error('Escribe un número de WhatsApp válido.');
  }

  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){
    throw new Error('Escribe un correo electrónico válido.');
  }

  if(!pais){
    throw new Error('Escribe el país del comprador.');
  }

  if(!aceptaTerminos){
    throw new Error('Debes aceptar el registro del pedido.');
  }

  const telefono=numeroLocal.startsWith(codigoPais)
    ? numeroLocal
    : codigoPais+numeroLocal;

  const cache=CacheService.getScriptCache();
  const cacheKey='MD20_CHECKOUT_'+telefono.slice(-12);

  if(cache.get(cacheKey)){
    throw new Error(
      'Espera unos segundos antes de crear otro pedido con este WhatsApp.'
    );
  }

  const metodos=listarMetodosPagoPublicosMD20_();
  const metodo=metodos.find(m=>m.id===metodoPagoId);

  if(!metodo){
    throw new Error('Selecciona un método de pago disponible.');
  }

  const vendedor=validarVendedorPedidoTiendaMD20_(
    registro.vendedor||'ADMIN'
  );

  const idsProductos=Array.isArray(registro.productos)
    ? [...new Set(
        registro.productos
          .map(id=>String(id||'').trim())
          .filter(Boolean)
      )]
    : [];

  if(!idsProductos.length){
    throw new Error('El pedido no contiene productos.');
  }

  if(idsProductos.length>20){
    throw new Error('El pedido contiene demasiados productos.');
  }

  const catalogo=listarCatalogoPublicoMD20_(vendedor);
  const mapaProductos={};

  catalogo.forEach(producto=>{
    mapaProductos[String(producto.id)]=producto;
  });

  const productos=idsProductos.map(id=>{
    const producto=mapaProductos[id];

    if(!producto){
      throw new Error(
        'Uno de los productos ya no está publicado o disponible.'
      );
    }

    const disponibilidad=String(
      producto.disponibilidad||'DISPONIBLE'
    ).toUpperCase();

    if(['AGOTADO','PROXIMAMENTE'].includes(disponibilidad)){
      throw new Error(
        producto.nombre+' no está disponible para comprar.'
      );
    }

    return producto;
  });

  const monedas=[
    ...new Set(
      productos.map(p=>String(p.moneda||'USD').toUpperCase())
    )
  ];

  if(monedas.length!==1){
    throw new Error(
      'No se pueden combinar productos de monedas diferentes.'
    );
  }

  const moneda=monedas[0]||'USD';
  const subtotal=productos.reduce(
    (total,producto)=>total+Number(producto.precio||0),
    0
  );
  const descuento=0;
  const total=Math.max(0,subtotal-descuento);
  const configuracionTienda=obtenerConfiguracionTiendaPublicaMD20_();
  const tasaBs=Number(configuracionTienda.tasaBs||0);
  const totalBs=moneda==='USD'&&tasaBs>0?total*tasaBs:(moneda==='VES'?total:0);

  const lock=LockService.getScriptLock();
  lock.waitLock(30000);

  try{
    const existenteDentroBloqueo=buscarPedidoPorSolicitudMD20_(
      hojaPedidos,
      solicitudId
    );

    if(existenteDentroBloqueo){
      return {
        ok:true,
        pedido:pedidoPublicoMD20_(existenteDentroBloqueo),
        repetido:true
      };
    }

    const cliente=crearOActualizarClientePedidoTiendaMD20_({
      nombreCompleto:nombre,
      telefono:telefono,
      codigoPais:'+'+codigoPais,
      correo:correo,
      documento:documento,
      pais:pais,
      notas:notas
    });

    const ahora=new Date();
    const pedidoId=
      'PED-'+Utilities.getUuid()
        .replace(/-/g,'')
        .slice(0,12)
        .toUpperCase();

    const numeroPedido=generarNumeroPedidoTiendaMD20_(
      hojaPedidos
    );

    const token=
      Utilities.getUuid().replace(/-/g,'')+
      Utilities.getUuid().replace(/-/g,'');

    const filaPedido=primeraFilaLibrePedidoTiendaMD20_(
      hojaPedidos
    );

    const productosResumen=productos.map(producto=>({
      id:String(producto.id),
      nombre:String(producto.nombre),
      precio:Number(producto.precio||0),
      moneda:String(producto.moneda||moneda),
      tipoEntrega:String(producto.tipoEntrega||'ARCHIVO')
    }));

    const filaInicial=[
      pedidoId,numeroPedido,token,solicitudId,
      cliente.id,nombre,telefono,correo,pais,
      vendedor,metodo.id,metodo.nombre,
      subtotal,descuento,total,moneda,
      'PROCESANDO','PENDIENTE','BLOQUEADA',
      '',JSON.stringify(productosResumen),notas,'TIENDA_WEB',
      ahora,ahora,tasaBs,totalBs,'','',''
    ];

    hojaPedidos
      .getRange(
        filaPedido,
        1,
        1,
        MD20_PEDIDOS_TIENDA.ENCABEZADOS.length
      )
      .setValues([filaInicial]);

    const ventas=[];

    try{
      productos.forEach(producto=>{
        ventas.push(
          crearVentaDesdePedidoTiendaMD20_({
            pedidoId:pedidoId,
            numeroPedido:numeroPedido,
            clienteId:cliente.id,
            producto:producto,
            metodoPagoId:metodo.id,
            metodoPagoMoneda:metodo.moneda,
            vendedor:vendedor,
            notas:notas,
            moneda:moneda,
            tasaBs:tasaBs
          })
        );
      });

      hojaPedidos
        .getRange(filaPedido,17)
        .setValue('PENDIENTE');

      hojaPedidos
        .getRange(filaPedido,20)
        .setValue(
          ventas.map(venta=>venta.id).join(',')
        );

      hojaPedidos
        .getRange(filaPedido,25)
        .setValue(new Date());

      SpreadsheetApp.flush();

      cache.put(cacheKey,'1',20);

      const pedido={
        pedidoId:pedidoId,
        numeroPedido:numeroPedido,
        token:token,
        clienteId:cliente.id,
        clienteNombre:nombre,
        whatsapp:telefono,
        correo:correo,
        pais:pais,
        vendedor:vendedor,
        metodoPagoId:metodo.id,
        metodoPagoNombre:metodo.nombre,
        subtotal:subtotal,
        descuento:descuento,
        total:total,
        moneda:moneda,
        tasaBs:tasaBs,
        totalBs:totalBs,
        estadoPedido:'PENDIENTE',
        estadoPago:'PENDIENTE',
        estadoEntrega:'BLOQUEADA',
        ventasIds:ventas.map(venta=>venta.id),
        ventasNumeros:ventas.map(venta=>venta.numeroVenta),
        productos:productosResumen,
        creadoEn:fechaHoraApi_(ahora)
      };

      return {
        ok:true,
        pedido:pedido,
        repetido:false
      };

    }catch(errorVentas){
      hojaPedidos
        .getRange(filaPedido,17)
        .setValue('ERROR');

      hojaPedidos
        .getRange(filaPedido,22)
        .setValue(
          [notas,'ERROR: '+errorVentas.message]
            .filter(Boolean)
            .join(' | ')
        );

      hojaPedidos
        .getRange(filaPedido,25)
        .setValue(new Date());

      SpreadsheetApp.flush();

      throw errorVentas;
    }

  }finally{
    lock.releaseLock();
  }
}

function crearOActualizarClientePedidoTiendaMD20_(datos){
  const telefono=String(datos.telefono||'').replace(/\D/g,'');
  const correo=String(datos.correo||'').trim().toLowerCase();

  const clientes=listarClientesMD20_();

  const clienteTelefono=clientes.find(
    cliente=>
      telefono&&
      String(cliente.telefono||'').replace(/\D/g,'')===telefono
  )||null;

  const clienteCorreo=clientes.find(
    cliente=>
      correo&&
      String(cliente.correo||'').trim().toLowerCase()===correo
  )||null;

  if(
    clienteTelefono&&
    clienteCorreo&&
    clienteTelefono.id!==clienteCorreo.id
  ){
    throw new Error(
      'El WhatsApp y el correo pertenecen a clientes diferentes. Comunícate con soporte.'
    );
  }

  const existente=clienteTelefono||clienteCorreo;

  const etiquetasExistentes=existente
    ? String(existente.etiquetas||'')
        .split(',')
        .map(x=>x.trim())
        .filter(Boolean)
    : [];

  if(!etiquetasExistentes.includes('CLIENTE_TIENDA')){
    etiquetasExistentes.push('CLIENTE_TIENDA');
  }

  const notasAnteriores=existente
    ? String(existente.notas||'').trim()
    : '';

  const notaNueva=String(datos.notas||'').trim();

  const notasCombinadas=[
    notasAnteriores,
    notaNueva
  ].filter(Boolean);

  return guardarClienteMD20_({
    id:existente?existente.id:'',
    nombreCompleto:datos.nombreCompleto,
    telefono:telefono,
    codigoPais:datos.codigoPais,
    correo:correo,
    documento:datos.documento||
      (existente?existente.documento:''),
    pais:datos.pais||
      (existente?existente.pais:''),
    ciudad:existente?existente.ciudad:'',
    direccion:existente?existente.direccion:'',
    fechaNacimiento:existente?existente.fechaNacimiento:'',
    origenCliente:existente&&existente.origenCliente
      ? existente.origenCliente
      : 'PAGINA_WEB',
    etiquetas:etiquetasExistentes.join(', '),
    notas:[...new Set(notasCombinadas)].join(' | '),
    estado:'ACTIVO'
  });
}

function crearVentaDesdePedidoTiendaMD20_(datos){
  const libro=md20LibroEstable_();
  const hojaVentas=libro.getSheetByName('VENTAS');
  const hojaDetalles=libro.getSheetByName('DETALLE_VENTAS');
  const hojaPagos=libro.getSheetByName('PAGOS');

  if(!hojaVentas||!hojaDetalles||!hojaPagos){
    throw new Error(
      'Las pestañas VENTAS, DETALLE_VENTAS y PAGOS no están preparadas.'
    );
  }

  const producto=datos.producto;
  const precio=Number(producto.precio||0);
  const ahora=new Date();

  const ventaId=
    'VEN-'+Utilities.getUuid()
      .replace(/-/g,'')
      .slice(0,10)
      .toUpperCase();

  const numeroVenta=generarNumeroVentaMD20_(hojaVentas);

  const detalleId=
    'DET-'+Utilities.getUuid()
      .replace(/-/g,'')
      .slice(0,10)
      .toUpperCase();

  const pagoId=
    'PAG-'+Utilities.getUuid()
      .replace(/-/g,'')
      .slice(0,10)
      .toUpperCase();

  const canal=datos.vendedor==='ADMIN'
    ? 'TIENDA_WEB'
    : 'TIENDA_REVENDEDOR';

  const notaVenta=[
    'PEDIDO: '+datos.numeroPedido,
    'PEDIDO_ID: '+datos.pedidoId,
    'VENDEDOR: '+datos.vendedor,
    datos.notas
  ].filter(Boolean).join(' | ');

  hojaVentas.appendRow([
    ventaId,
    numeroVenta,
    datos.clienteId,
    ahora,
    precio,
    0,
    precio,
    datos.moneda,
    0,
    precio,
    'PENDIENTE',
    'BLOQUEADA',
    datos.metodoPagoId,
    'TIENDA_PUBLICA',
    canal,
    notaVenta,
    ahora,
    ahora
  ]);

  hojaDetalles.appendRow([
    detalleId,
    ventaId,
    String(producto.id),
    '',
    '',
    String(producto.nombre),
    1,
    precio,
    0,
    precio,
    Number(producto.duracionDias||0),
    ahora,
    '',
    'PENDIENTE'
  ]);

  const monedaPago=String(datos.metodoPagoMoneda||datos.moneda||'USD').toUpperCase();
  const montoPago=monedaPago==='VES'&&String(datos.moneda).toUpperCase()==='USD'
    ? precio*Number(datos.tasaBs||0)
    : precio;

  hojaPagos.appendRow([
    pagoId,
    ventaId,
    datos.clienteId,
    ahora,
    montoPago,
    monedaPago,
    datos.metodoPagoId,
    '',
    '',
    '',
    '',
    'PENDIENTE',
    '',
    '',
    'Pago creado desde '+datos.numeroPedido+'.',
    ahora
  ]);

  registrarLogVentaMD20_(
    'CREAR_VENTA_TIENDA',
    ventaId,
    'Venta '+numeroVenta+
    ' creada desde el pedido '+datos.numeroPedido+'.'
  );

  return {
    id:ventaId,
    numeroVenta:numeroVenta,
    pagoId:pagoId,
    productoId:String(producto.id),
    total:precio
  };
}

function validarVendedorPedidoTiendaMD20_(valor){
  const vendedor=String(valor||'ADMIN').trim();

  if(
    !vendedor||
    ['ADMIN','ADMINISTRADOR'].includes(vendedor.toUpperCase())
  ){
    return 'ADMIN';
  }

  const hoja=SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('REVENDEDORES');

  if(!hoja||hoja.getLastRow()<=1){
    throw new Error('El vendedor indicado no está disponible.');
  }

  const encabezados=hoja
    .getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const colId=encabezados.indexOf('REGISTRO_ID');
  const colEstado=encabezados.indexOf('ESTADO');

  if(colId<0){
    throw new Error('No se pudo validar el vendedor.');
  }

  const fila=hoja
    .getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getDisplayValues()
    .find(f=>String(f[colId]||'').trim()===vendedor);

  if(!fila){
    throw new Error('El enlace del vendedor no es válido.');
  }

  if(
    colEstado>=0&&
    String(fila[colEstado]||'ACTIVO').toUpperCase()==='INACTIVO'
  ){
    throw new Error('El vendedor está inactivo.');
  }

  return vendedor;
}

function generarNumeroPedidoTiendaMD20_(hoja){
  const fecha=Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    'yyyyMMdd'
  );

  const prefijo='PED-'+fecha+'-';
  let secuencia=1;

  if(hoja.getLastRow()>1){
    const numeros=hoja
      .getRange(2,2,hoja.getLastRow()-1,1)
      .getDisplayValues()
      .flat()
      .filter(numero=>String(numero).startsWith(prefijo));

    secuencia=numeros.length+1;
  }

  return prefijo+String(secuencia).padStart(4,'0');
}

function primeraFilaLibrePedidoTiendaMD20_(hoja){
  const ids=hoja
    .getRange(2,1,hoja.getMaxRows()-1,1)
    .getDisplayValues()
    .flat();

  const indice=ids.findIndex(
    valor=>String(valor||'').trim()===''
  );

  if(indice>=0){
    return indice+2;
  }

  const maximo=hoja.getMaxRows();
  hoja.insertRowsAfter(maximo,100);
  return maximo+1;
}

function buscarPedidoPorSolicitudMD20_(hoja,solicitudId){
  if(!hoja||hoja.getLastRow()<=1||!solicitudId){
    return null;
  }

  const encabezados=hoja
    .getRange(1,1,1,hoja.getLastColumn())
    .getDisplayValues()[0]
    .map(v=>String(v||'').trim().toUpperCase());

  const colSolicitud=encabezados.indexOf('SOLICITUD_ID');

  if(colSolicitud<0){
    return null;
  }

  const filas=hoja
    .getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn())
    .getValues();

  const fila=filas.find(
    datos=>String(datos[colSolicitud]||'')===String(solicitudId)
  );

  return fila
    ? filaPedidoTiendaARegistroMD20_(fila,encabezados)
    : null;
}

function filaPedidoTiendaARegistroMD20_(fila,encabezados){
  const valor=nombre=>{
    const indice=encabezados.indexOf(nombre);
    return indice>=0?fila[indice]:'';
  };

  let productos=[];

  try{
    productos=JSON.parse(
      String(valor('PRODUCTOS_JSON')||'[]')
    );
  }catch(error){
    productos=[];
  }

  return {
    pedidoId:String(valor('PEDIDO_ID')||''),
    numeroPedido:String(valor('NUMERO_PEDIDO')||''),
    token:String(valor('TOKEN_PUBLICO')||''),
    clienteId:String(valor('CLIENTE_ID')||''),
    clienteNombre:String(valor('NOMBRE_CLIENTE')||''),
    whatsapp:String(valor('WHATSAPP')||''),
    correo:String(valor('CORREO')||''),
    pais:String(valor('PAIS')||''),
    vendedor:String(valor('VENDEDOR_ID')||'ADMIN'),
    metodoPagoId:String(valor('METODO_PAGO_ID')||''),
    metodoPagoNombre:String(valor('METODO_PAGO_NOMBRE')||''),
    subtotal:Number(valor('SUBTOTAL')||0),
    descuento:Number(valor('DESCUENTO')||0),
    total:Number(valor('TOTAL')||0),
    moneda:String(valor('MONEDA')||'USD'),
    estadoPedido:String(valor('ESTADO_PEDIDO')||'PENDIENTE'),
    estadoPago:String(valor('ESTADO_PAGO')||'PENDIENTE'),
    estadoEntrega:String(valor('ESTADO_ENTREGA')||'BLOQUEADA'),
    ventasIds:String(valor('VENTAS_IDS')||'')
      .split(',')
      .map(x=>x.trim())
      .filter(Boolean),
    productos:productos,
    creadoEn:fechaHoraApi_(valor('CREADO_EN')),
    tasaBs:Number(valor('TASA_BS')||0),
    totalBs:Number(valor('TOTAL_BS')||0),
    referenciaPago:String(valor('REFERENCIA_PAGO')||''),
    comprobanteUrl:String(valor('COMPROBANTE_URL')||''),
    fechaComprobante:fechaHoraApi_(valor('FECHA_COMPROBANTE'))
  };
}

function pedidoPublicoMD20_(pedido){
  return {
    numeroPedido:pedido.numeroPedido,
    token:pedido.token,
    clienteNombre:pedido.clienteNombre,
    vendedor:pedido.vendedor,
    metodoPagoId:pedido.metodoPagoId,
    metodoPagoNombre:pedido.metodoPagoNombre,
    subtotal:pedido.subtotal,
    descuento:pedido.descuento,
    total:pedido.total,
    moneda:pedido.moneda,
    tasaBs:pedido.tasaBs,
    totalBs:pedido.totalBs,
    referenciaPago:pedido.referenciaPago,
    comprobanteRegistrado:Boolean(pedido.comprobanteUrl),
    fechaComprobante:pedido.fechaComprobante,
    estadoPedido:pedido.estadoPedido,
    estadoPago:pedido.estadoPago,
    estadoEntrega:pedido.estadoEntrega,
    productos:pedido.productos,
    creadoEn:pedido.creadoEn
  };
}


function buscarPedidoPorTokenTiendaMD20_(token){
  const hoja=md20LibroEstable_().getSheetByName(MD20_PEDIDOS_TIENDA.HOJA);
  if(!hoja||hoja.getLastRow()<=1)return null;
  const encabezados=hoja.getRange(1,1,1,hoja.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
  const colToken=encabezados.indexOf('TOKEN_PUBLICO');
  if(colToken<0)return null;
  const filas=hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn()).getValues();
  const indice=filas.findIndex(fila=>String(fila[colToken]||'')===String(token||''));
  if(indice<0)return null;
  return {fila:indice+2,hoja:hoja,encabezados:encabezados,registro:filaPedidoTiendaARegistroMD20_(filas[indice],encabezados)};
}

function consultarPedidoTiendaPublicaMD20_(token){
  const limpio=String(token||'').trim();
  if(limpio.length<40)throw new Error('Token del pedido no válido.');
  const encontrado=buscarPedidoPorTokenTiendaMD20_(limpio);
  if(!encontrado)throw new Error('No se encontró el pedido.');
  return {ok:true,pedido:pedidoPublicoMD20_(encontrado.registro)};
}

function registrarPagoPedidoTiendaMD20_(registro){
  const token=String(registro.token||'').trim();
  const referencia=String(registro.referencia||'').trim();
  const bancoOrigen=String(registro.bancoOrigen||'').trim();
  const titular=String(registro.titular||'').trim();
  const fechaPago=convertirFecha_(registro.fechaPago)||new Date();
  const archivo=registro.archivo||{};

  if(token.length<40)throw new Error('Token del pedido no válido.');
  if(referencia.length<4)throw new Error('Escribe la referencia o número de operación.');
  if(!bancoOrigen)throw new Error('Escribe el banco o plataforma desde donde pagaste.');
  if(!titular)throw new Error('Escribe el nombre del titular que realizó el pago.');

  const encontrado=buscarPedidoPorTokenTiendaMD20_(token);
  if(!encontrado)throw new Error('No se encontró el pedido.');
  const pedido=encontrado.registro;
  if(pedido.estadoPago==='CONFIRMADO')throw new Error('Este pago ya fue confirmado.');

  const configuracion=obtenerConfiguracionTiendaPublicaMD20_();
  const maxBytes=configuracion.maxComprobanteMb*1024*1024;
  const mime=String(archivo.mimeType||'').toLowerCase();
  const permitidos=['image/jpeg','image/png','image/webp','application/pdf'];
  if(!permitidos.includes(mime))throw new Error('El comprobante debe ser JPG, PNG, WEBP o PDF.');
  const size=Number(archivo.size||0);
  if(size<=0||size>maxBytes)throw new Error('El comprobante supera el máximo de '+configuracion.maxComprobanteMb+' MB.');
  const base64=String(archivo.base64||'').trim();
  if(!base64)throw new Error('No se recibió el archivo del comprobante.');

  const valores=leerConfiguracionMD20_();
  const carpetaId=String(valores.CARPETA_COMPROBANTES_ID||'').trim();
  if(!carpetaId)throw new Error('Primero ejecuta prepararPagosTiendaMD20.');
  let carpeta;
  try{carpeta=DriveApp.getFolderById(carpetaId);}catch(error){throw new Error('No se pudo abrir la carpeta de comprobantes.');}

  const extension=mime==='application/pdf'?'pdf':(mime==='image/png'?'png':(mime==='image/webp'?'webp':'jpg'));
  const nombreSeguro=String(pedido.numeroPedido||'PEDIDO').replace(/[^A-Z0-9_-]/gi,'_');
  const blob=Utilities.newBlob(Utilities.base64Decode(base64),mime,nombreSeguro+'_COMPROBANTE.'+extension);
  const archivoDrive=carpeta.createFile(blob);
  archivoDrive.setDescription('Comprobante del pedido '+pedido.numeroPedido+' · Cliente '+pedido.clienteNombre);
  const url=archivoDrive.getUrl();

  const libro=md20LibroEstable_();
  const hojaPagos=libro.getSheetByName('PAGOS');
  const hojaVentas=libro.getSheetByName('VENTAS');
  if(!hojaPagos)throw new Error('No existe PAGOS.');

  const ventasIds=Array.isArray(pedido.ventasIds)?pedido.ventasIds:[];
  const encabezadosPagos=hojaPagos.getRange(1,1,1,hojaPagos.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
  const colPago=nombre=>encabezadosPagos.indexOf(nombre)+1;
  const notasPago='Comprobante enviado desde la tienda para '+pedido.numeroPedido+'.';

  ventasIds.forEach(ventaId=>{
    const fila=buscarFilaPorValorMD20_(hojaPagos,colPago('VENTA_ID'),ventaId);
    if(!fila)return;
    const poner=(nombre,valor)=>{const c=colPago(nombre);if(c)hojaPagos.getRange(fila,c).setValue(valor);};
    poner('FECHA_PAGO',fechaPago);
    poner('REFERENCIA',referencia);
    poner('BANCO_ORIGEN',bancoOrigen);
    poner('TITULAR',titular);
    poner('COMPROBANTE_URL',url);
    poner('ESTADO','EN_REVISION');
    poner('CONFIRMADO_POR','');
    poner('FECHA_CONFIRMACION','');
    poner('NOTAS',notasPago);
  });

  const colPedido=nombre=>encontrado.encabezados.indexOf(nombre)+1;
  const ponerPedido=(nombre,valor)=>{const c=colPedido(nombre);if(c)encontrado.hoja.getRange(encontrado.fila,c).setValue(valor);};
  ponerPedido('ESTADO_PAGO','EN_REVISION');
  ponerPedido('REFERENCIA_PAGO',referencia);
  ponerPedido('COMPROBANTE_URL',url);
  ponerPedido('FECHA_COMPROBANTE',new Date());
  ponerPedido('ACTUALIZADO_EN',new Date());

  crearNotificacionPagoTiendaMD20_(pedido,url,referencia,bancoOrigen);
  SpreadsheetApp.flush();

  const actualizado=buscarPedidoPorTokenTiendaMD20_(token);
  return {
    ok:true,
    mensaje:'Comprobante recibido correctamente. Tu pago está en revisión.',
    pedido:pedidoPublicoMD20_(actualizado.registro)
  };
}

function crearNotificacionPagoTiendaMD20_(pedido,url,referencia,bancoOrigen){
  const hoja=md20LibroEstable_().getSheetByName('NOTIFICACIONES');
  if(!hoja)return;
  hoja.appendRow([
    'NOT-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase(),
    'ADMINISTRADOR','PAGO_EN_REVISION','Nuevo pago por revisar',
    pedido.numeroPedido+' · '+pedido.clienteNombre+' · Referencia '+referencia+' · '+bancoOrigen,
    'PAGOS',pedido.pedidoId||pedido.numeroPedido,'ALTA','NO',new Date(),'','ACTIVA'
  ]);
}


function guardarCatalogoProductoMD20_(registro){
  const libro=md20LibroEstable_();
  const hoja=libro.getSheetByName('PRODUCTOS');
  if(!hoja)throw new Error('No existe la pestaña PRODUCTOS.');

  const obligatorios=[
    'PUBLICAR_CATALOGO','SLUG_PRODUCTO','DESCRIPCION_CORTA',
    'DESCRIPCION_COMPLETA','PRECIO_PUBLICO','PRECIO_ANTERIOR',
    'OFERTA','DESTACADO','ORDEN_CATALOGO','DISPONIBILIDAD',
    'ETIQUETAS_PUBLICAS','VENDE_ADMIN','VENDE_REVENDEDOR',
    'ACTUALIZADO_CATALOGO_EN'
  ];

  const encabezados=obtenerEncabezadosCatalogoMD20_(hoja);
  const faltantes=obligatorios.filter(nombre=>!encabezados.includes(nombre));
  if(faltantes.length){
    throw new Error(
      'Primero ejecuta prepararModuloCatalogoMD20. Faltan columnas: '+faltantes.join(', ')
    );
  }

  const mapa=mapaEncabezadosCatalogoMD20_(encabezados);
  const nombre=String(registro.nombre||'').trim();
  const categoriaId=String(registro.categoriaId||'').trim();
  const precioPublico=Number(registro.precioPublico||0);

  if(!nombre)throw new Error('El nombre del producto es obligatorio.');
  if(!categoriaId)throw new Error('La categoría es obligatoria.');
  if(!Number.isFinite(precioPublico)||precioPublico<0){
    throw new Error('El precio público no es válido.');
  }

  const productoId=String(registro.id||'').trim()||
    'PRO-'+Utilities.getUuid().replace(/-/g,'').slice(0,10).toUpperCase();

  let fila=buscarFilaProductoMD20_(hoja,productoId);
  if(!fila)fila=primeraFilaLibreProductoMD20_(hoja);

  const ahora=new Date();
  const creadoEn=mapa.CREADO_EN
    ? hoja.getRange(fila,mapa.CREADO_EN).getValue()||ahora
    : ahora;

  const descripcionCorta=String(registro.descripcionCorta||registro.descripcion||'').trim();
  const descripcionCompleta=String(registro.descripcionCompleta||descripcionCorta).trim();
  const slug=crearSlugCatalogoMD20_(registro.slugProducto||nombre);

  const valores={
    PRODUCTO_ID:productoId,
    NOMBRE:nombre,
    DESCRIPCION:descripcionCorta,
    CATEGORIA_ID:categoriaId,
    TIPO_PRODUCTO:String(registro.tipoProducto||'DIGITAL').trim().toUpperCase(),
    TIPO_ENTREGA:String(registro.tipoEntrega||'ARCHIVO').trim().toUpperCase(),
    PRECIO_COMPRA:Number(registro.precioCompra||0),
    PRECIO_VENTA:precioPublico,
    MONEDA:String(registro.moneda||'USD').trim().toUpperCase(),
    DURACION_DIAS:Number(registro.duracionDias||0),
    STOCK_MINIMO:Number(registro.stockMinimo||0),
    CONTROLAR_STOCK:normalizarSiNoCatalogoMD20_(registro.controlarStock,'NO'),
    ARCHIVO_ID:String(registro.archivoId||'').trim(),
    IMAGEN_URL:String(registro.imagenUrl||'').trim(),
    ESTADO:String(registro.estado||'ACTIVO').trim().toUpperCase(),
    CREADO_POR:'ADMINISTRADOR',
    CREADO_EN:creadoEn,
    ACTUALIZADO_EN:ahora,
    PUBLICAR_CATALOGO:normalizarSiNoCatalogoMD20_(registro.publicarCatalogo,'NO'),
    SLUG_PRODUCTO:slug,
    DESCRIPCION_CORTA:descripcionCorta,
    DESCRIPCION_COMPLETA:descripcionCompleta,
    PRECIO_PUBLICO:precioPublico,
    PRECIO_ANTERIOR:Number(registro.precioAnterior||0),
    OFERTA:normalizarSiNoCatalogoMD20_(registro.oferta,'NO'),
    DESTACADO:normalizarSiNoCatalogoMD20_(registro.destacado,'NO'),
    ORDEN_CATALOGO:Number(registro.ordenCatalogo||999),
    DISPONIBILIDAD:normalizarDisponibilidadCatalogoMD20_(registro.disponibilidad),
    ETIQUETAS_PUBLICAS:String(registro.etiquetasPublicas||'').trim(),
    VENDE_ADMIN:normalizarSiNoCatalogoMD20_(registro.vendeAdmin,'SI'),
    VENDE_REVENDEDOR:normalizarSiNoCatalogoMD20_(registro.vendeRevendedor,'SI'),
    ACTUALIZADO_CATALOGO_EN:ahora
  };

  Object.keys(valores).forEach(nombreColumna=>{
    const columna=mapa[nombreColumna];
    if(columna)hoja.getRange(fila,columna).setValue(valores[nombreColumna]);
  });

  if(mapa.PRECIO_COMPRA)hoja.getRange(fila,mapa.PRECIO_COMPRA).setNumberFormat('#,##0.00');
  if(mapa.PRECIO_VENTA)hoja.getRange(fila,mapa.PRECIO_VENTA).setNumberFormat('#,##0.00');
  if(mapa.PRECIO_PUBLICO)hoja.getRange(fila,mapa.PRECIO_PUBLICO).setNumberFormat('#,##0.00');
  if(mapa.PRECIO_ANTERIOR)hoja.getRange(fila,mapa.PRECIO_ANTERIOR).setNumberFormat('#,##0.00');
  if(mapa.ACTUALIZADO_EN)hoja.getRange(fila,mapa.ACTUALIZADO_EN).setNumberFormat('dd/MM/yyyy HH:mm');
  if(mapa.ACTUALIZADO_CATALOGO_EN)hoja.getRange(fila,mapa.ACTUALIZADO_CATALOGO_EN).setNumberFormat('dd/MM/yyyy HH:mm');

  SpreadsheetApp.flush();

  return listarCatalogoAdminMD20_().find(p=>p.id===productoId);
}

function cambiarPublicacionCatalogoMD20_(productoId,publicar){
  const hoja=md20LibroEstable_().getSheetByName('PRODUCTOS');
  if(!hoja)throw new Error('No existe la pestaña PRODUCTOS.');

  const encabezados=obtenerEncabezadosCatalogoMD20_(hoja);
  const mapa=mapaEncabezadosCatalogoMD20_(encabezados);
  if(!mapa.PUBLICAR_CATALOGO){
    throw new Error('Primero ejecuta prepararModuloCatalogoMD20.');
  }

  const fila=buscarFilaProductoMD20_(hoja,String(productoId||'').trim());
  if(!fila)throw new Error('No se encontró el producto.');

  const nuevoEstado=normalizarSiNoCatalogoMD20_(publicar,'NO');
  hoja.getRange(fila,mapa.PUBLICAR_CATALOGO).setValue(nuevoEstado);
  if(mapa.ACTUALIZADO_CATALOGO_EN){
    hoja.getRange(fila,mapa.ACTUALIZADO_CATALOGO_EN).setValue(new Date());
  }
  SpreadsheetApp.flush();

  return listarCatalogoAdminMD20_().find(p=>p.id===String(productoId));
}


/**
 * =========================================================
 * PARTE 5 — ALERTAS Y CONFIRMACIÓN ADMINISTRATIVA DE PAGOS
 * =========================================================
 */
function listarAlertasPagosTiendaMD20_(){
  const pagos=listarPagosMD20_().filter(p=>String(p.estado).toUpperCase()==='EN_REVISION');
  if(!pagos.length)return [];

  const libro=md20LibroEstable_();
  const hojaPedidos=libro.getSheetByName('PEDIDOS_TIENDA');
  const pedidos=[];
  if(hojaPedidos&&hojaPedidos.getLastRow()>1){
    const encabezados=hojaPedidos.getRange(1,1,1,hojaPedidos.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
    hojaPedidos.getRange(2,1,hojaPedidos.getLastRow()-1,hojaPedidos.getLastColumn()).getValues().forEach(fila=>{
      pedidos.push(filaPedidoTiendaARegistroMD20_(fila,encabezados));
    });
  }

  return pagos.map(pago=>{
    const pedido=pedidos.find(p=>Array.isArray(p.ventasIds)&&p.ventasIds.includes(pago.ventaId))||{};
    return {
      pagoId:pago.id,
      ventaId:pago.ventaId,
      numeroVenta:pago.numeroVenta,
      pedidoId:pedido.pedidoId||'',
      numeroPedido:pedido.numeroPedido||pago.numeroVenta||'',
      clienteId:pago.clienteId,
      clienteNombre:pago.clienteNombre,
      clienteTelefono:pago.clienteTelefono,
      correo:pedido.correo||'',
      productoNombre:pago.productoNombre,
      productos:Array.isArray(pedido.productos)?pedido.productos:[],
      monto:pago.monto,
      moneda:pago.moneda,
      totalPedido:Number(pedido.total||pago.monto||0),
      totalBs:Number(pedido.totalBs||0),
      tasaBs:Number(pedido.tasaBs||0),
      metodoPagoId:pago.metodoPagoId,
      metodoPagoNombre:pago.metodoPagoNombre,
      referencia:pago.referencia,
      bancoOrigen:pago.bancoOrigen,
      titular:pago.titular,
      comprobanteUrl:pago.comprobanteUrl,
      fechaPago:pago.fechaPago,
      creadoEn:pago.creadoEn,
      estado:pago.estado,
      vendedor:pedido.vendedor||'ADMIN'
    };
  }).sort((a,b)=>String(b.creadoEn).localeCompare(String(a.creadoEn)));
}

function resolverAlertaPagoTiendaMD20_(registro){
  const pagoId=String(registro.pagoId||'').trim();
  const decision=String(registro.decision||'').trim().toUpperCase();
  const motivo=String(registro.motivo||'').trim();
  const administrador=String(registro.administrador||'ADMINISTRADOR').trim()||'ADMINISTRADOR';

  if(!pagoId)throw new Error('Falta el pago que deseas procesar.');
  if(!['CONFIRMAR','RECHAZAR'].includes(decision))throw new Error('La decisión no es válida.');
  if(decision==='RECHAZAR'&&motivo.length<4)throw new Error('Escribe el motivo del rechazo.');

  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try{
    const libro=md20LibroEstable_();
    const hojaPagos=libro.getSheetByName('PAGOS');
    if(!hojaPagos)throw new Error('No existe PAGOS.');

    const headers=hojaPagos.getRange(1,1,1,hojaPagos.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
    const col=n=>headers.indexOf(n)+1;
    const fila=buscarFilaPorValorMD20_(hojaPagos,col('PAGO_ID'),pagoId);
    if(!fila)throw new Error('No se encontró el pago.');

    const estadoActual=String(hojaPagos.getRange(fila,col('ESTADO')).getValue()||'').toUpperCase();
    if(estadoActual!=='EN_REVISION')throw new Error('Este pago ya no está en revisión. Actualiza la página.');

    const ventaId=String(hojaPagos.getRange(fila,col('VENTA_ID')).getValue()||'').trim();
    const nuevoEstado=decision==='CONFIRMAR'?'CONFIRMADO':'RECHAZADO';
    hojaPagos.getRange(fila,col('ESTADO')).setValue(nuevoEstado);
    if(col('CONFIRMADO_POR'))hojaPagos.getRange(fila,col('CONFIRMADO_POR')).setValue(administrador);
    if(col('FECHA_CONFIRMACION'))hojaPagos.getRange(fila,col('FECHA_CONFIRMACION')).setValue(new Date());
    if(motivo&&col('NOTAS')){
      const anterior=String(hojaPagos.getRange(fila,col('NOTAS')).getValue()||'');
      hojaPagos.getRange(fila,col('NOTAS')).setValue([anterior,'Motivo: '+motivo].filter(Boolean).join(' | '));
    }
    SpreadsheetApp.flush();

    recalcularVentaPorPagosMD20_(ventaId);
    sincronizarPedidoRevisionPagoMD20_(ventaId,nuevoEstado,motivo);
    marcarNotificacionesPagoLeidasMD20_(pagoId,ventaId);
    crearNotificacionPagoMD20_(pagoId,ventaId,nuevoEstado);
    registrarLogVentaMD20_('RESOLVER_PAGO_TIENDA',pagoId,'Pago '+nuevoEstado+' por '+administrador+(motivo?' · '+motivo:''));
    SpreadsheetApp.flush();

    return {
      ok:true,
      mensaje:nuevoEstado==='CONFIRMADO'
        ? 'Pago confirmado. La venta quedó pagada y la entrega fue habilitada.'
        : 'Pago rechazado. La entrega continúa bloqueada.',
      estado:nuevoEstado,
      pago:listarPagosMD20_().find(p=>p.id===pagoId)||null
    };
  }finally{
    lock.releaseLock();
  }
}

function sincronizarPedidoRevisionPagoMD20_(ventaId,estadoPago,motivo){
  const hoja=md20LibroEstable_().getSheetByName('PEDIDOS_TIENDA');
  if(!hoja||hoja.getLastRow()<=1)return;
  const headers=hoja.getRange(1,1,1,hoja.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
  const c=n=>headers.indexOf(n)+1;
  const filas=hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn()).getValues();
  const indice=filas.findIndex(f=>String(c('VENTAS_IDS')?f[c('VENTAS_IDS')-1]:'').split(',').map(x=>x.trim()).includes(ventaId));
  if(indice<0)return;
  const fila=indice+2;
  const ventasIds=String(hoja.getRange(fila,c('VENTAS_IDS')).getValue()||'').split(',').map(x=>x.trim()).filter(Boolean);
  const pagos=listarPagosMD20_().filter(p=>ventasIds.includes(p.ventaId));
  const todosConfirmados=pagos.length>0&&pagos.every(p=>p.estado==='CONFIRMADO');
  const algunoRechazado=pagos.some(p=>p.estado==='RECHAZADO');

  if(c('ESTADO_PAGO'))hoja.getRange(fila,c('ESTADO_PAGO')).setValue(todosConfirmados?'CONFIRMADO':(algunoRechazado?'RECHAZADO':'EN_REVISION'));
  if(c('ESTADO_PEDIDO'))hoja.getRange(fila,c('ESTADO_PEDIDO')).setValue(todosConfirmados?'PAGADO':(algunoRechazado?'PENDIENTE':'PENDIENTE'));
  if(c('ESTADO_ENTREGA'))hoja.getRange(fila,c('ESTADO_ENTREGA')).setValue(todosConfirmados?'PENDIENTE':'BLOQUEADA');
  if(motivo&&c('NOTAS_CLIENTE')){
    const previo=String(hoja.getRange(fila,c('NOTAS_CLIENTE')).getValue()||'');
    hoja.getRange(fila,c('NOTAS_CLIENTE')).setValue([previo,'Pago rechazado: '+motivo].filter(Boolean).join(' | '));
  }
  if(c('ACTUALIZADO_EN'))hoja.getRange(fila,c('ACTUALIZADO_EN')).setValue(new Date());
}

function marcarNotificacionesPagoLeidasMD20_(pagoId,ventaId){
  const hoja=md20LibroEstable_().getSheetByName('NOTIFICACIONES');
  if(!hoja||hoja.getLastRow()<=1)return;
  const headers=hoja.getRange(1,1,1,hoja.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
  const iTipo=headers.indexOf('TIPO');
  const iEntidad=headers.indexOf('ENTIDAD_ID');
  const iLeida=headers.indexOf('LEIDA');
  const iFecha=headers.indexOf('FECHA_LECTURA');
  if(iLeida<0)return;
  const filas=hoja.getRange(2,1,hoja.getLastRow()-1,hoja.getLastColumn()).getValues();
  filas.forEach((f,index)=>{
    const tipo=iTipo>=0?String(f[iTipo]||''):'';
    const entidad=iEntidad>=0?String(f[iEntidad]||''):'';
    if(tipo==='PAGO_EN_REVISION'&&(entidad===pagoId||entidad===ventaId||!entidad)){
      hoja.getRange(index+2,iLeida+1).setValue('SI');
      if(iFecha>=0)hoja.getRange(index+2,iFecha+1).setValue(new Date());
    }
  });
}


/**
 * PRUEBA SEGURA. NO MODIFICA DATOS.
 * Confirma que la misma lógica usada por la web devuelve registros.
 */
function PROBAR_FASE5_FINAL_MD20(){
  const clientes = listarClientesMD20_();
  const productos = listarProductosMD20_();
  const categorias = listarCategoriasMD20_();
  const catalogo = listarCatalogoPublicoMD20_('ADMIN');

  const resultado = {
    ok:true,
    version:'FASE5-REPARACION-FINAL-1',
    spreadsheetId:md20LibroEstable_().getId(),
    clientesCantidad:clientes.length,
    productosCantidad:productos.length,
    categoriasCantidad:categorias.length,
    catalogoCantidad:catalogo.length,
    primerCliente:clientes.length ? clientes[0].id : '',
    primerProducto:productos.length ? productos[0].id : ''
  };

  console.log(JSON.stringify(resultado,null,2));
  return resultado;
}

/**
 * =========================================================
 * MUNDO DIGITAL 2.0 — NUEVOS MÓDULOS WEB V1
 * 1) Telegram Proveedores
 * 2) Centro de Publicidad (Drive + Sheets)
 * 3) Chat Admin ↔ Vendedor por token
 * =========================================================
 */
const MD20_NM = {
  TELEGRAM_HOJA: 'TELEGRAM_PROVEEDORES',
  PUBLICIDAD_HOJA: 'PUBLICIDAD',
  CHAT_ACCESOS_HOJA: 'CHAT_ACCESOS_VENDEDORES',
  CHAT_MENSAJES_HOJA: 'CHAT_MENSAJES',
  CARPETA_PUBLICIDAD_CFG: 'CARPETA_PUBLICIDAD_ID',
  CARPETA_PUBLICIDAD_NOMBRE: 'MUNDO DIGITAL 2.0 - PUBLICIDAD',
  MAX_IMAGEN_BYTES: 6 * 1024 * 1024
};

function PREPARAR_NUEVOS_MODULOS_MD20(){
  const libro = md20LibroEstable_();
  nmPrepararHoja_(libro, MD20_NM.TELEGRAM_HOJA, [
    'PROVEEDOR_TELEGRAM_ID','NOMBRE','TIPO','USUARIO_TELEGRAM','ENLACE_TELEGRAM','CATEGORIA','SERVICIO',
    'PRECIO_COMPRA','PRECIO_VENTA_VENDEDOR','GANANCIA','MONEDA','METODO_PAGO','NOTAS','ESTADO','CREADO_EN','ACTUALIZADO_EN'
  ], '#229ED9');
  nmPrepararHoja_(libro, MD20_NM.PUBLICIDAD_HOJA, [
    'PUBLICIDAD_ID','TITULO','CATEGORIA','PRODUCTO','PRECIO_TEXTO','COPY','IMAGEN_URL','IMAGEN_FILE_ID',
    'ETIQUETAS','ESTADO','CREADO_EN','ACTUALIZADO_EN'
  ], '#FF6D00');
  nmPrepararHoja_(libro, MD20_NM.CHAT_ACCESOS_HOJA, [
    'VENDEDOR_ID','NOMBRE','TOKEN','ESTADO','CREADO_EN','ACTUALIZADO_EN'
  ], '#7C4DFF');
  nmPrepararHoja_(libro, MD20_NM.CHAT_MENSAJES_HOJA, [
    'MENSAJE_ID','VENDEDOR_ID','REMITENTE','MENSAJE','LEIDO_ADMIN','LEIDO_VENDEDOR','CREADO_EN'
  ], '#25D47A');
  const carpeta = nmObtenerCarpetaPublicidad_();
  SpreadsheetApp.flush();
  return {
    ok:true,
    mensaje:'Nuevos módulos preparados correctamente.',
    hojas:[MD20_NM.TELEGRAM_HOJA,MD20_NM.PUBLICIDAD_HOJA,MD20_NM.CHAT_ACCESOS_HOJA,MD20_NM.CHAT_MENSAJES_HOJA],
    carpetaPublicidadId:carpeta.getId()
  };
}

function nmPrepararHoja_(libro,nombre,encabezados,color){
  let hoja = libro.getSheetByName(nombre);
  if(!hoja) hoja = libro.insertSheet(nombre);
  if(hoja.getMaxColumns() < encabezados.length) hoja.insertColumnsAfter(hoja.getMaxColumns(), encabezados.length-hoja.getMaxColumns());
  hoja.getRange(1,1,1,encabezados.length).setValues([encabezados]);
  hoja.setFrozenRows(1);
  hoja.getRange(1,1,1,encabezados.length)
    .setBackground(color).setFontColor('#ffffff').setFontWeight('bold')
    .setHorizontalAlignment('center');
  hoja.autoResizeColumns(1,encabezados.length);
  return hoja;
}

function nmHoja_(nombre){
  const hoja = md20LibroEstable_().getSheetByName(nombre);
  if(!hoja) throw new Error('Falta preparar la pestaña '+nombre+'. Ejecuta PREPARAR_NUEVOS_MODULOS_MD20 una sola vez.');
  return hoja;
}

function nmHeaders_(hoja){
  return hoja.getRange(1,1,1,hoja.getLastColumn()).getDisplayValues()[0].map(v=>String(v||'').trim().toUpperCase());
}

function nmFilaPorId_(hoja,columna,id){
  if(!id || hoja.getLastRow()<=1) return 0;
  const vals=hoja.getRange(2,columna,hoja.getLastRow()-1,1).getDisplayValues().flat();
  const i=vals.indexOf(String(id));
  return i<0?0:i+2;
}

function nmFechaHora_(v){
  if(!(v instanceof Date) || isNaN(v)) return '';
  return Utilities.formatDate(v,Session.getScriptTimeZone(),"yyyy-MM-dd'T'HH:mm:ss");
}

function nmId_(prefijo){
  return prefijo+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();
}

function nmTexto_(v){ return String(v==null?'':v).trim(); }

function nmObtenerCarpetaPublicidad_(){
  const libro=md20LibroEstable_();
  const cfg=libro.getSheetByName('CONFIGURACION');
  let id='';
  if(cfg&&cfg.getLastRow()>1){
    const filas=cfg.getRange(2,1,cfg.getLastRow()-1,2).getDisplayValues();
    const fila=filas.find(r=>String(r[0]||'').trim()===MD20_NM.CARPETA_PUBLICIDAD_CFG);
    if(fila) id=String(fila[1]||'').trim();
  }
  if(id){
    try{return DriveApp.getFolderById(id);}catch(_e){}
  }
  const carpeta=DriveApp.createFolder(MD20_NM.CARPETA_PUBLICIDAD_NOMBRE);
  if(cfg) guardarConfig_(cfg,MD20_NM.CARPETA_PUBLICIDAD_CFG,carpeta.getId(),'Carpeta de Drive usada por el Centro de Publicidad');
  return carpeta;
}

/* ================= TELEGRAM PROVEEDORES ================= */
function listarTelegramProveedoresMD20_(){
  const h=nmHoja_(MD20_NM.TELEGRAM_HOJA);
  if(h.getLastRow()<=1)return [];
  return h.getRange(2,1,h.getLastRow()-1,16).getValues().filter(r=>r[0]).map(r=>({
    id:String(r[0]),nombre:String(r[1]||''),tipo:String(r[2]||'BOT'),usuarioTelegram:String(r[3]||''),
    enlaceTelegram:String(r[4]||''),categoria:String(r[5]||''),servicio:String(r[6]||''),
    precioCompra:Number(r[7]||0),precioVentaVendedor:Number(r[8]||0),ganancia:Number(r[9]||0),
    moneda:String(r[10]||'USD'),metodoPago:String(r[11]||''),notas:String(r[12]||''),estado:String(r[13]||'ACTIVO'),
    creadoEn:nmFechaHora_(r[14]),actualizadoEn:nmFechaHora_(r[15])
  }));
}

function guardarTelegramProveedorMD20_(r){
  r=r||{};
  const nombre=nmTexto_(r.nombre),servicio=nmTexto_(r.servicio);
  if(!nombre)throw new Error('Escribe el nombre del proveedor.');
  if(!servicio)throw new Error('Escribe el servicio que compras.');
  let usuario=nmTexto_(r.usuarioTelegram).replace(/^@/,'');
  let enlace=nmTexto_(r.enlaceTelegram);
  if(!enlace&&usuario) enlace='https://t.me/'+usuario;
  if(enlace&&!/^https?:\/\//i.test(enlace)) enlace='https://'+enlace.replace(/^\/+/, '');
  if(!enlace)throw new Error('Agrega el enlace o usuario de Telegram.');
  const tipo=['BOT','CANAL','GRUPO'].includes(String(r.tipo||'').toUpperCase())?String(r.tipo).toUpperCase():'BOT';
  const costo=Math.max(0,Number(r.precioCompra||0));
  const venta=Math.max(0,Number(r.precioVentaVendedor||0));
  const h=nmHoja_(MD20_NM.TELEGRAM_HOJA),lock=LockService.getScriptLock(); lock.waitLock(30000);
  try{
    const id=nmTexto_(r.id)||nmId_('TGP');
    const fila=nmFilaPorId_(h,1,id),ahora=new Date();
    const creado=fila?h.getRange(fila,15).getValue()||ahora:ahora;
    const valores=[id,nombre,tipo,usuario,enlace,nmTexto_(r.categoria),servicio,costo,venta,venta-costo,nmTexto_(r.moneda)||'USD',nmTexto_(r.metodoPago),nmTexto_(r.notas),nmTexto_(r.estado)||'ACTIVO',creado,ahora];
    (fila?h.getRange(fila,1,1,16):h.getRange(h.getLastRow()+1,1,1,16)).setValues([valores]);
    SpreadsheetApp.flush();
    return listarTelegramProveedoresMD20_().find(x=>x.id===id);
  }finally{lock.releaseLock();}
}

function cambiarEstadoTelegramProveedorMD20_(id,estado){
  const h=nmHoja_(MD20_NM.TELEGRAM_HOJA),fila=nmFilaPorId_(h,1,id);
  if(!fila)throw new Error('Proveedor Telegram no encontrado.');
  const e=String(estado||'INACTIVO').toUpperCase()==='ACTIVO'?'ACTIVO':'INACTIVO';
  h.getRange(fila,14).setValue(e); h.getRange(fila,16).setValue(new Date());
  return {id:String(id),estado:e};
}

/* ================= CENTRO DE PUBLICIDAD ================= */
function listarPublicidadMD20_(){
  const h=nmHoja_(MD20_NM.PUBLICIDAD_HOJA);
  if(h.getLastRow()<=1)return [];
  return h.getRange(2,1,h.getLastRow()-1,12).getValues().filter(r=>r[0]).map(r=>({
    id:String(r[0]),titulo:String(r[1]||''),categoria:String(r[2]||''),producto:String(r[3]||''),
    precioTexto:String(r[4]||''),copy:String(r[5]||''),imagenUrl:String(r[6]||''),imagenFileId:String(r[7]||''),
    etiquetas:String(r[8]||''),estado:String(r[9]||'ACTIVO'),creadoEn:nmFechaHora_(r[10]),actualizadoEn:nmFechaHora_(r[11])
  }));
}

function guardarPublicidadMD20_(r){
  r=r||{};
  const titulo=nmTexto_(r.titulo),copy=nmTexto_(r.copy);
  if(!titulo)throw new Error('Escribe un título para la publicidad.');
  if(!copy)throw new Error('Escribe el copy de la publicidad.');
  const h=nmHoja_(MD20_NM.PUBLICIDAD_HOJA),lock=LockService.getScriptLock(); lock.waitLock(30000);
  try{
    const id=nmTexto_(r.id)||nmId_('PUB');
    const fila=nmFilaPorId_(h,1,id),ahora=new Date();
    const creado=fila?h.getRange(fila,11).getValue()||ahora:ahora;
    let imagenUrl=fila?String(h.getRange(fila,7).getValue()||''):'';
    let imagenFileId=fila?String(h.getRange(fila,8).getValue()||''):'';
    if(nmTexto_(r.imagenBase64)){
      const base64=String(r.imagenBase64).replace(/^data:[^;]+;base64,/, '');
      const bytes=Utilities.base64Decode(base64);
      if(bytes.length>MD20_NM.MAX_IMAGEN_BYTES)throw new Error('La imagen supera el máximo de 6 MB.');
      const tipo=nmTexto_(r.imagenMime)||'image/png';
      const nombre=nmTexto_(r.imagenNombre)||('publicidad-'+id+'.png');
      const archivo=nmObtenerCarpetaPublicidad_().createFile(Utilities.newBlob(bytes,tipo,nombre));
      archivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
      imagenFileId=archivo.getId();
      imagenUrl='https://drive.google.com/thumbnail?id='+imagenFileId+'&sz=w1600';
    }
    const valores=[id,titulo,nmTexto_(r.categoria),nmTexto_(r.producto),nmTexto_(r.precioTexto),copy,imagenUrl,imagenFileId,nmTexto_(r.etiquetas),nmTexto_(r.estado)||'ACTIVO',creado,ahora];
    (fila?h.getRange(fila,1,1,12):h.getRange(h.getLastRow()+1,1,1,12)).setValues([valores]);
    SpreadsheetApp.flush();
    return listarPublicidadMD20_().find(x=>x.id===id);
  }finally{lock.releaseLock();}
}

function cambiarEstadoPublicidadMD20_(id,estado){
  const h=nmHoja_(MD20_NM.PUBLICIDAD_HOJA),fila=nmFilaPorId_(h,1,id);
  if(!fila)throw new Error('Publicidad no encontrada.');
  const e=String(estado||'ARCHIVADA').toUpperCase()==='ACTIVO'?'ACTIVO':'ARCHIVADA';
  h.getRange(fila,10).setValue(e); h.getRange(fila,12).setValue(new Date());
  return {id:String(id),estado:e};
}

/* ================= CHAT ADMIN ↔ VENDEDOR ================= */
function listarChatsAdminMD20_(){
  const accesos=nmLeerAccesosChat_(),mensajes=nmLeerMensajesChat_();
  return accesos.filter(a=>a.estado==='ACTIVO').map(a=>{
    const ms=mensajes.filter(m=>m.vendedorId===a.vendedorId);
    const ultimo=ms.length?ms[ms.length-1]:null;
    return {
      vendedorId:a.vendedorId,nombre:a.nombre,token:a.token,estado:a.estado,
      noLeidos:ms.filter(m=>m.remitente==='VENDEDOR'&&m.leidoAdmin!=='SI').length,
      ultimoMensaje:ultimo?ultimo.mensaje:'',ultimoEn:ultimo?ultimo.creadoEn:'',ultimoRemitente:ultimo?ultimo.remitente:''
    };
  }).sort((a,b)=>String(b.ultimoEn).localeCompare(String(a.ultimoEn)));
}

function generarAccesoChatVendedorMD20_(r){
  r=r||{};
  const vendedorId=nmTexto_(r.vendedorId),nombre=nmTexto_(r.nombre)||vendedorId;
  if(!vendedorId)throw new Error('Escribe el ID del vendedor.');
  const h=nmHoja_(MD20_NM.CHAT_ACCESOS_HOJA),fila=nmFilaPorId_(h,1,vendedorId),ahora=new Date();
  let token=fila?String(h.getRange(fila,3).getValue()||''):'';
  if(!token||r.regenerar===true||String(r.regenerar).toUpperCase()==='SI')token=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'').slice(0,12);
  const creado=fila?h.getRange(fila,5).getValue()||ahora:ahora;
  const vals=[vendedorId,nombre,token,'ACTIVO',creado,ahora];
  (fila?h.getRange(fila,1,1,6):h.getRange(h.getLastRow()+1,1,1,6)).setValues([vals]);
  SpreadsheetApp.flush();
  return {vendedorId,nombre,token,estado:'ACTIVO'};
}

function cambiarEstadoAccesoChatVendedorMD20_(vendedorId,estado){
  const h=nmHoja_(MD20_NM.CHAT_ACCESOS_HOJA),fila=nmFilaPorId_(h,1,vendedorId);
  if(!fila)throw new Error('Acceso de chat no encontrado.');
  const e=String(estado||'INACTIVO').toUpperCase()==='ACTIVO'?'ACTIVO':'INACTIVO';
  h.getRange(fila,4).setValue(e);h.getRange(fila,6).setValue(new Date());
  return {vendedorId:String(vendedorId),estado:e};
}

function listarMensajesChatAdminMD20_(vendedorId){
  vendedorId=nmTexto_(vendedorId);
  if(!vendedorId)throw new Error('Falta el vendedor.');
  const h=nmHoja_(MD20_NM.CHAT_MENSAJES_HOJA),mensajes=nmLeerMensajesChat_().filter(m=>m.vendedorId===vendedorId);
  if(h.getLastRow()>1){
    const vals=h.getRange(2,1,h.getLastRow()-1,7).getValues();
    vals.forEach((r,i)=>{if(String(r[1])===vendedorId&&String(r[2])==='VENDEDOR'&&String(r[4])!=='SI')h.getRange(i+2,5).setValue('SI');});
  }
  return mensajes;
}

function enviarMensajeChatAdminMD20_(vendedorId,mensaje){
  vendedorId=nmTexto_(vendedorId); mensaje=nmTexto_(mensaje);
  if(!vendedorId)throw new Error('Falta el vendedor.');
  if(!mensaje)throw new Error('Escribe un mensaje.');
  if(mensaje.length>2000)throw new Error('El mensaje es demasiado largo.');
  const acceso=nmLeerAccesosChat_().find(a=>a.vendedorId===vendedorId&&a.estado==='ACTIVO');
  if(!acceso)throw new Error('Este vendedor no tiene un acceso de chat activo.');
  return nmGuardarMensajeChat_(vendedorId,'ADMIN',mensaje);
}

function consultarChatVendedorMD20_(token){
  token=nmTexto_(token);
  const acceso=nmLeerAccesosChat_().find(a=>a.token===token&&a.estado==='ACTIVO');
  if(!acceso)return {ok:false,mensaje:'El enlace de chat no es válido o está desactivado.'};
  const h=nmHoja_(MD20_NM.CHAT_MENSAJES_HOJA);
  if(h.getLastRow()>1){
    const vals=h.getRange(2,1,h.getLastRow()-1,7).getValues();
    vals.forEach((r,i)=>{if(String(r[1])===acceso.vendedorId&&String(r[2])==='ADMIN'&&String(r[5])!=='SI')h.getRange(i+2,6).setValue('SI');});
  }
  return {ok:true,vendedor:{id:acceso.vendedorId,nombre:acceso.nombre},mensajes:nmLeerMensajesChat_().filter(m=>m.vendedorId===acceso.vendedorId)};
}

function enviarMensajeChatVendedorMD20_(token,mensaje){
  token=nmTexto_(token); mensaje=nmTexto_(mensaje);
  const acceso=nmLeerAccesosChat_().find(a=>a.token===token&&a.estado==='ACTIVO');
  if(!acceso)throw new Error('El enlace de chat no es válido o está desactivado.');
  if(!mensaje)throw new Error('Escribe un mensaje.');
  if(mensaje.length>2000)throw new Error('El mensaje es demasiado largo.');
  return {ok:true,registro:nmGuardarMensajeChat_(acceso.vendedorId,'VENDEDOR',mensaje)};
}

function nmLeerAccesosChat_(){
  const h=nmHoja_(MD20_NM.CHAT_ACCESOS_HOJA);
  if(h.getLastRow()<=1)return [];
  return h.getRange(2,1,h.getLastRow()-1,6).getValues().filter(r=>r[0]).map(r=>({
    vendedorId:String(r[0]),nombre:String(r[1]||r[0]),token:String(r[2]||''),estado:String(r[3]||'ACTIVO'),creadoEn:nmFechaHora_(r[4]),actualizadoEn:nmFechaHora_(r[5])
  }));
}

function nmLeerMensajesChat_(){
  const h=nmHoja_(MD20_NM.CHAT_MENSAJES_HOJA);
  if(h.getLastRow()<=1)return [];
  return h.getRange(2,1,h.getLastRow()-1,7).getValues().filter(r=>r[0]).map(r=>({
    id:String(r[0]),vendedorId:String(r[1]),remitente:String(r[2]),mensaje:String(r[3]||''),
    leidoAdmin:String(r[4]||'NO'),leidoVendedor:String(r[5]||'NO'),creadoEn:nmFechaHora_(r[6])
  }));
}

function nmGuardarMensajeChat_(vendedorId,remitente,mensaje){
  const h=nmHoja_(MD20_NM.CHAT_MENSAJES_HOJA),ahora=new Date();
  const id=nmId_('MSG');
  const row=[id,vendedorId,remitente,mensaje,remitente==='ADMIN'?'SI':'NO',remitente==='VENDEDOR'?'SI':'NO',ahora];
  h.appendRow(row);SpreadsheetApp.flush();
  return {id,vendedorId,remitente,mensaje,leidoAdmin:row[4],leidoVendedor:row[5],creadoEn:nmFechaHora_(ahora)};
}
