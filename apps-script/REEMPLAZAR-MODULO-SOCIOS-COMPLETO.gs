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
  const libro = SpreadsheetApp.getActiveSpreadsheet();
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
  const props = PropertiesService.getScriptProperties();
  let key = props.getProperty('MD20_API_KEY_SOCIOS');
  if (!key) {
    key = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('MD20_API_KEY_SOCIOS', key);
  }
  return key;
}

/** API WEB */
function doGet(e) {
  try {
    validarClaveApi_(e && e.parameter ? e.parameter.claveApi : '');
    const accion = String(e.parameter.action || '');
    const tipo = validarTipoSocio_(e.parameter.tipo);
    if (accion === 'listarSocios') return respuestaJson_({ ok: true, registros: listarSocios_(tipo) });
    return respuestaJson_({ ok: false, mensaje: 'Acción GET no reconocida.' });
  } catch (error) {
    return respuestaJson_({ ok: false, mensaje: error.message || 'Error inesperado.' });
  }
}

function doPost(e) {
  try {
    const cuerpo = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    validarClaveApi_(cuerpo.claveApi);
    const tipo = validarTipoSocio_(cuerpo.tipo);
    if (cuerpo.action === 'guardarSocio') {
      return respuestaJson_({ ok: true, registro: guardarSocio_(tipo, cuerpo.registro || {}) });
    }
    if (cuerpo.action === 'desactivarSocio') {
      desactivarSocio_(tipo, cuerpo.id);
      return respuestaJson_({ ok: true });
    }
    return respuestaJson_({ ok: false, mensaje: 'Acción POST no reconocida.' });
  } catch (error) {
    return respuestaJson_({ ok: false, mensaje: error.message || 'Error inesperado.' });
  }
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
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MD20_SOCIOS.HOJAS[tipo]);
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
  const libro = SpreadsheetApp.getActiveSpreadsheet();
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
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MD20_SOCIOS.HOJAS[tipo]);
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
  const libro = SpreadsheetApp.getActiveSpreadsheet();
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
