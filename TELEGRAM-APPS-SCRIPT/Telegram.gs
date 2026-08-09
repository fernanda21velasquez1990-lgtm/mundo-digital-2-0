
/**
 * ============================================================
 * MUNDO DIGITAL 2.0 — TELEGRAM UNIFICADO
 * ============================================================
 *
 * UN SOLO ARCHIVO para:
 * - Bot de revendedores
 * - Bot del administrador
 * - Webhooks
 * - Vinculaciones
 * - Seguridad / update_id
 * - Registros
 * - Consultas directas a Google Sheets
 *
 * IMPORTANTE:
 * Este archivo pertenece al proyecto INDEPENDIENTE:
 * "Mundo Digital 2.0 - Telegram"
 *
 * NO reemplaza ni modifica el Codigo.gs original de la plataforma.
 */

const MD20_TG = {
  SPREADSHEET_ID: '1FQyMHtJOnOomg1BPDZKUHxyMbyfjlkCOZJWvuL12zeY',

  PROP: {
    TOKEN_ADMIN: 'MD20_TG_TOKEN_ADMIN',
    TOKEN_REVENDEDORES: 'MD20_TG_TOKEN_REVENDEDORES',
    SECRETO_ADMIN: 'MD20_TG_SECRETO_ADMIN',
    SECRETO_REVENDEDORES: 'MD20_TG_SECRETO_REVENDEDORES',
    WEB_APP_URL: 'MD20_TG_WEB_APP_URL',
    CHAT_ADMIN: 'MD20_TG_CHAT_ADMIN',
    PANEL_KEY: 'MD20_TG_PANEL_KEY'
  },

  HOJAS: {
    CONFIG: 'CONFIG_TELEGRAM',
    USUARIOS: 'TELEGRAM_USUARIOS',
    CODIGOS: 'TELEGRAM_CODIGOS',
    LOGS: 'TELEGRAM_LOGS',
    REVENDEDORES: 'REVENDEDORES',
    CLIENTES: 'CLIENTES',
    VENTAS: 'VENTAS',
    PAGOS: 'PAGOS',
    PEDIDOS: 'PEDIDOS_TIENDA',
    ENTREGAS: 'ENTREGAS',
    CATALOGO: 'CATALOGO',
    INVENTARIO: 'INVENTARIO'
  }
};

/* ============================================================
 * 1. CONFIGURACIÓN INICIAL
 * ============================================================ */

/**
 * EJECUTAR UNA SOLA VEZ AL PRINCIPIO.
 * Crea las hojas de Telegram sin borrar información existente.
 */
function prepararTelegramUnificadoMD20() {
  const ss = md20TgSs_();

  md20TgPrepararHoja_(ss, MD20_TG.HOJAS.CONFIG, [
    'CLAVE','VALOR','DESCRIPCION','ACTUALIZADO_EN'
  ]);

  md20TgPrepararHoja_(ss, MD20_TG.HOJAS.USUARIOS, [
    'VINCULACION_ID','TIPO_USUARIO','USUARIO_ID','CHAT_ID',
    'USERNAME_TELEGRAM','NOMBRE_TELEGRAM','ESTADO',
    'FECHA_VINCULACION','ULTIMA_INTERACCION','CREADO_EN','ACTUALIZADO_EN'
  ]);

  md20TgPrepararHoja_(ss, MD20_TG.HOJAS.CODIGOS, [
    'CODIGO_ID','CODIGO','TIPO_USUARIO','USUARIO_ID','ESTADO',
    'FECHA_CREACION','FECHA_VENCIMIENTO','FECHA_USO',
    'CHAT_ID_USADO','CREADO_POR'
  ]);

  md20TgPrepararHoja_(ss, MD20_TG.HOJAS.LOGS, [
    'LOG_ID','FECHA','BOT','UPDATE_ID','CHAT_ID','TIPO_USUARIO',
    'USUARIO_ID','COMANDO','RESULTADO','DETALLE'
  ]);

  md20TgSetConfigHoja_('NOMBRE_PROYECTO','Mundo Digital 2.0 - Telegram','Proyecto independiente');
  md20TgSetConfigHoja_('MINUTOS_VIGENCIA_CODIGO','30','Vigencia de códigos de vinculación');
  md20TgSetConfigHoja_('ESTADO_PROYECTO','INSTALADO','Estado del módulo');

  md20TgCrearSecretoSiNoExiste_('ADMIN');
  md20TgCrearSecretoSiNoExiste_('REVENDEDORES');
  md20TgCrearClavePanelSiNoExiste_();

  return {
    ok: true,
    mensaje: 'Telegram unificado preparado correctamente.'
  };
}

/**
 * CONFIGURACIÓN ÚNICA.
 *
 * 1) Pega TEMPORALMENTE el token nuevo de revendedores.
 * 2) Cuando tengas el bot admin, pega también su token.
 * 3) Pega la URL /exec de la implementación ACTIVA.
 * 4) Ejecuta esta función.
 * 5) Después vuelve a borrar los tokens de estas líneas y guarda.
 */
function CONFIGURAR_TELEGRAM_MD20() {
  const TOKEN_REVENDEDORES = 'PEGA_AQUI_TOKEN_REVENDEDORES';
  const TOKEN_ADMIN = '';
  const WEB_APP_URL = 'PEGA_AQUI_URL_EXEC_ACTIVA';

  if (
    !TOKEN_REVENDEDORES ||
    TOKEN_REVENDEDORES === 'PEGA_AQUI_TOKEN_REVENDEDORES'
  ) {
    throw new Error('Pega temporalmente el token NUEVO del bot de revendedores.');
  }

  if (
    !WEB_APP_URL ||
    WEB_APP_URL === 'PEGA_AQUI_URL_EXEC_ACTIVA' ||
    !/\/exec(?:\?|$)/.test(WEB_APP_URL)
  ) {
    throw new Error('Pega la URL /exec de la implementación ACTIVA.');
  }

  md20TgGuardarToken_('REVENDEDORES', TOKEN_REVENDEDORES);

  if (TOKEN_ADMIN) {
    md20TgGuardarToken_('ADMIN', TOKEN_ADMIN);
  }

  md20TgPropSet_(MD20_TG.PROP.WEB_APP_URL, WEB_APP_URL.split('?')[0]);

  const botRev = md20TgGetMe_('REVENDEDORES');
  const botAdmin = TOKEN_ADMIN ? md20TgGetMe_('ADMIN') : null;

  return {
    ok: true,
    mensaje: 'Configuración guardada.',
    revendedores: botRev,
    administrador: botAdmin,
    webAppUrl: WEB_APP_URL.split('?')[0]
  };
}

/**
 * Comprueba que la configuración guardada sigue funcionando.
 */
function probarConfiguracionTelegramMD20() {
  const url = md20TgWebAppUrl_();
  const rev = md20TgGetMe_('REVENDEDORES');

  let admin = null;
  try { admin = md20TgGetMe_('ADMIN'); } catch (e) {}

  const r = {
    ok: true,
    webAppUrl: url,
    revendedores: rev,
    administrador: admin
  };

  console.log(JSON.stringify(r, null, 2));
  return r;
}

/* ============================================================
 * 2. WEB APP / ROUTER
 * ============================================================ */

function doGet(e) {
  const p = (e && e.parameter) || {};
  const action = String(p.action || '').trim();

  try {
    if (action === 'estado') {
      return md20TgJson_({
        ok: true,
        proyecto: 'Mundo Digital 2.0 - Telegram',
        estado: 'ACTIVO',
        fecha: new Date()
      });
    }

    if (action === 'listarRevendedoresTelegram') {
      md20TgValidarPanel_(p.clave);

      return md20TgJson_({
        ok: true,
        registros: md20TgListarRevendedoresPanel_()
      });
    }

    if (action === 'generarCodigoRevendedorTelegram') {
      md20TgValidarPanel_(p.clave);

      const revendedorId = String(
        p.revendedorId || ''
      ).trim();

      const resultado = md20TgGenerarCodigo_(
        'REVENDEDOR',
        revendedorId,
        'PANEL'
      );

      return md20TgJson_({
        ok: true,
        registro: resultado
      });
    }

    return md20TgJson_({
      ok: true,
      proyecto: 'Mundo Digital 2.0 - Telegram',
      estado: 'Aplicación web activa',
      fecha: new Date()
    });

  } catch (error) {
    return md20TgJson_({
      ok: false,
      mensaje: md20TgError_(error)
    });
  }
}

function md20TgCrearClavePanelSiNoExiste_() {
  let clave = md20TgPropGet_(MD20_TG.PROP.PANEL_KEY);

  if (!clave) {
    clave = Utilities
      .getUuid()
      .replace(/-/g, '')
      .slice(0, 32);

    md20TgPropSet_(
      MD20_TG.PROP.PANEL_KEY,
      clave
    );
  }

  return clave;
}

function md20TgValidarPanel_(claveRecibida) {
  const esperada = md20TgCrearClavePanelSiNoExiste_();
  const recibida = String(claveRecibida || '').trim();

  if (!recibida || recibida !== esperada) {
    throw new Error('Clave del panel Telegram inválida.');
  }

  return true;
}

function mostrarClavePanelTelegramMD20() {
  const clave = md20TgCrearClavePanelSiNoExiste_();

  const resultado = {
    ok: true,
    clavePanel: clave,
    webAppUrl: md20TgWebAppUrl_()
  };

  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

  return resultado;
}

function md20TgListarRevendedoresPanel_() {
  const registros = md20TgLeerHoja_(
    MD20_TG.HOJAS.REVENDEDORES
  );

  const usuarios = md20TgLeerUsuarios_();

  return registros.map((r, indice) => {
    const id = String(
      md20TgValor_(
        r,
        [
          'REGISTRO_ID',
          'REVENDEDOR_ID',
          'ID_REVENDEDOR',
          'SOCIO_ID',
          'VENDEDOR_ID',
          'ID'
        ]
      ) || ''
    ).trim();

    const nombre = [
      md20TgValor_(r, ['NOMBRE','NOMBRES']),
      md20TgValor_(r, ['APELLIDO','APELLIDOS'])
    ].filter(Boolean).join(' ').trim() || id || ('Revendedor '+(indice+1));

    const whatsapp = String(
      md20TgValor_(r, ['WHATSAPP','TELEFONO','CELULAR']) || ''
    ).trim();

    const vinc = usuarios.find(u =>
      u.tipoUsuario === 'REVENDEDOR' &&
      u.usuarioId === id &&
      u.estado === 'VINCULADO'
    ) || null;

    return {
      revendedorId: id,
      nombre: nombre,
      whatsapp: whatsapp,
      telegramEstado: vinc ? 'VINCULADO' : 'PENDIENTE',
      telegramUsername: vinc ? vinc.username : '',
      chatId: vinc ? vinc.chatId : ''
    };
  }).filter(r => r.revendedorId);
}

function doPost(e) {
  let tipo = '';
  let updateId = '';
  let chatId = '';
  let texto = '';

  try {
    const p = (e && e.parameter) || {};
    const bot = String(p.bot || '').toLowerCase();

    if (bot === 'admin') tipo = 'ADMIN';
    if (bot === 'revendedores' || bot === 'revendedor') tipo = 'REVENDEDORES';

    if (!tipo) return md20TgText_('OK');

    if (!md20TgValidarSecreto_(tipo, p.secreto)) {
      md20TgLog_({
        bot: tipo,
        comando: 'SECRETO_INVALIDO',
        resultado: 'RECHAZADO',
        detalle: 'Secreto del webhook incorrecto.'
      });
      return md20TgText_('OK');
    }

    const raw = String(
      e && e.postData && e.postData.contents
        ? e.postData.contents
        : ''
    );

    if (!raw) return md20TgText_('OK');

    const update = JSON.parse(raw);
    updateId = String(update.update_id || '');

    if (!md20TgAceptarUpdate_(tipo, updateId)) {
      return md20TgText_('OK');
    }

    const msg = update.message;
    if (!msg || !msg.chat) return md20TgText_('OK');

    chatId = String(msg.chat.id || '');
    texto = String(msg.text || '');

    if (tipo === 'REVENDEDORES') {
      md20TgProcesarRevendedor_(msg, updateId);
    } else {
      md20TgProcesarAdmin_(msg, updateId);
    }

  } catch (error) {
    md20TgLog_({
      bot: tipo || 'ROUTER',
      updateId: updateId,
      chatId: chatId,
      comando: texto || 'doPost',
      resultado: 'ERROR',
      detalle: md20TgError_(error)
    });
  }

  // SIEMPRE OK para impedir reintentos/ciclos.
  return md20TgText_('OK');
}

/* ============================================================
 * 3. WEBHOOKS
 * ============================================================ */

/**
 * Ejecuta esta función después de publicar una Nueva versión.
 * Instala SOLO el bot de revendedores.
 */
function instalarWebhookRevendedoresMD20() {
  return md20TgInstalarWebhook_('REVENDEDORES');
}

/**
 * Ejecutar cuando ya esté configurado el token del bot administrador.
 */
function instalarWebhookAdministradorMD20() {
  return md20TgInstalarWebhook_('ADMIN');
}

function diagnosticarTelegramRevendedoresMD20() {
  return md20TgDiagnostico_('REVENDEDORES');
}

function diagnosticarTelegramAdministradorMD20() {
  return md20TgDiagnostico_('ADMIN');
}

function detenerWebhookRevendedoresMD20() {
  return md20TgDetenerWebhook_('REVENDEDORES');
}

function detenerWebhookAdministradorMD20() {
  return md20TgDetenerWebhook_('ADMIN');
}

function md20TgInstalarWebhook_(tipo) {
  const bot = md20TgGetMe_(tipo);
  const url = md20TgConstruirWebhookUrl_(tipo);

  md20TgApi_(tipo, 'deleteWebhook', {
    drop_pending_updates: true
  });

  Utilities.sleep(800);
  md20TgLimpiarUpdate_(tipo);

  md20TgApi_(tipo, 'setWebhook', {
    url: url,
    allowed_updates: ['message'],
    drop_pending_updates: true
  });

  Utilities.sleep(600);

  const info = md20TgApi_(tipo, 'getWebhookInfo', {});

  if (String(info.url || '') !== url) {
    throw new Error('Telegram no guardó la URL correcta del webhook.');
  }

  md20TgLog_({
    bot: tipo,
    comando: 'INSTALAR_WEBHOOK',
    resultado: 'OK',
    detalle: 'Webhook instalado para @' + bot.username
  });

  const r = {
    ok: true,
    mensaje: 'Webhook instalado correctamente.',
    bot: bot,
    url: info.url,
    pendientes: Number(info.pending_update_count || 0),
    ultimoError: String(info.last_error_message || '')
  };

  console.log(JSON.stringify(r, null, 2));
  return r;
}

function md20TgDiagnostico_(tipo) {
  const esperada = md20TgConstruirWebhookUrl_(tipo);
  const info = md20TgApi_(tipo, 'getWebhookInfo', {});

  const r = {
    ok: true,
    tipoBot: tipo,
    coincide: String(info.url || '') === esperada,
    urlEsperada: esperada,
    urlTelegram: String(info.url || ''),
    actualizacionesPendientes: Number(info.pending_update_count || 0),
    ultimoErrorMensaje: String(info.last_error_message || ''),
    actualizacionesPermitidas: info.allowed_updates || []
  };

  console.log(JSON.stringify(r, null, 2));
  return r;
}

function md20TgDetenerWebhook_(tipo) {
  md20TgApi_(tipo, 'deleteWebhook', {
    drop_pending_updates: true
  });
  md20TgLimpiarUpdate_(tipo);
  return { ok: true, mensaje: 'Webhook detenido y cola eliminada.' };
}

/* ============================================================
 * 4. BOT DE REVENDEDORES
 * ============================================================ */

function md20TgProcesarRevendedor_(msg, updateId) {
  const chatId = String(msg.chat.id || '');
  const comando = md20TgNormalizarRev_(msg.text);

  try {
    if (comando === '/start') {
      const vinc = md20TgVincPorChat_(chatId);

      if (vinc && vinc.tipoUsuario === 'REVENDEDOR') {
        md20TgEnviarMenuRev_(chatId,
          '👋 Bienvenido nuevamente.\n\nTu cuenta ya está vinculada.'
        );
      } else {
        md20TgEnviar_('REVENDEDORES', chatId,
          '👋 Bienvenido al bot de revendedores de Mundo Digital 2.0.\n\n' +
          'Para vincular tu cuenta usa:\n/vincular CODIGO'
        );
      }

      md20TgLogOk_('REVENDEDORES', updateId, chatId, 'REVENDEDOR', '', '/start', 'Inicio enviado.');
      return;
    }

    if (comando.indexOf('/vincular ') === 0) {
      const codigo = String(comando.split(/\s+/)[1] || '').toUpperCase();

      const ya = md20TgVincPorChat_(chatId);
      if (ya && ya.tipoUsuario === 'REVENDEDOR') {
        md20TgEnviarMenuRev_(chatId,
          '✅ Esta cuenta ya está vinculada.\n\nRevendedor ID: ' + ya.usuarioId
        );
        return;
      }

      const vinc = md20TgUsarCodigo_(codigo, chatId, msg.from || {}, 'REVENDEDOR');

      md20TgEnviarMenuRev_(chatId,
        '✅ Telegram vinculado correctamente.\n\nRevendedor ID: ' +
        vinc.usuarioId
      );

      md20TgLogOk_('REVENDEDORES', updateId, chatId, 'REVENDEDOR', vinc.usuarioId, '/vincular', 'Revendedor vinculado.');
      return;
    }

    const vinc = md20TgVincPorChat_(chatId);

    if (!vinc || vinc.tipoUsuario !== 'REVENDEDOR') {
      md20TgEnviar_('REVENDEDORES', chatId,
        '🔒 Tu Telegram no está vinculado.\n\nUsa:\n/vincular CODIGO'
      );
      return;
    }

    md20TgActualizarInteraccion_(vinc.fila);

    let respuesta = '';

    if (comando === '/resumen') respuesta = md20TgTextoResumenRev_(vinc.usuarioId);
    else if (comando === '/tienda') respuesta = md20TgTextoTiendaRev_(vinc.usuarioId);
    else if (comando === '/ventas') respuesta = md20TgTextoVentasRev_(vinc.usuarioId);
    else if (comando === '/pagos') respuesta = md20TgTextoPagosRev_(vinc.usuarioId);
    else if (comando === '/clientes') respuesta = md20TgTextoClientesRev_(vinc.usuarioId);
    else if (comando === '/ganancias') respuesta = md20TgTextoGananciasRev_(vinc.usuarioId);
    else if (comando === '/diamantes') respuesta = '💎 MIS DIAMANTES\n\nTodavía no hay movimientos de diamantes registrados.';
    else if (comando === '/soporte') respuesta = '🆘 SOPORTE\n\nComunícate con el administrador de Mundo Digital 2.0.';
    else respuesta = 'Selecciona una opción del menú.';

    md20TgEnviarMenuRev_(chatId, respuesta);
    md20TgLogOk_('REVENDEDORES', updateId, chatId, 'REVENDEDOR', vinc.usuarioId, comando, 'Opción enviada.');

  } catch (error) {
    md20TgLog_({
      bot: 'REVENDEDORES',
      updateId: updateId,
      chatId: chatId,
      tipoUsuario: 'REVENDEDOR',
      comando: comando,
      resultado: 'ERROR',
      detalle: md20TgError_(error)
    });

    try {
      md20TgEnviarMenuRev_(chatId,
        '⚠️ Esta opción presentó un error. El detalle quedó guardado en TELEGRAM_LOGS.'
      );
    } catch (_) {}
  }
}

function md20TgNormalizarRev_(texto) {
  const s = md20TgNormalizarTexto_(texto);

  if (s.indexOf('/vincular ') === 0) {
    return '/vincular ' + String(s.split(/\s+/)[1] || '').toUpperCase();
  }

  if (s === '/start' || s === 'start') return '/start';
  if (s.includes('mi resumen') || s === '/resumen' || s === 'resumen' || s === '/menu' || s === 'menu') return '/resumen';
  if (s.includes('mi tienda') || s === '/tienda') return '/tienda';
  if (s.includes('mis ventas') || s === '/ventas') return '/ventas';
  if (s.includes('mis pagos') || s === '/pagos') return '/pagos';
  if (s.includes('mis clientes') || s === '/clientes') return '/clientes';
  if (s.includes('mis ganancias') || s === '/ganancias') return '/ganancias';
  if (s.includes('mis diamantes') || s === '/diamantes') return '/diamantes';
  if (s.includes('soporte') || s === '/soporte' || s === '/ayuda') return '/soporte';

  return s;
}

function md20TgMenuRev_() {
  return {
    keyboard: [
      [{text:'🏠 Mi resumen'}, {text:'🏪 Mi tienda'}],
      [{text:'🛒 Mis ventas'}, {text:'💳 Mis pagos'}],
      [{text:'👥 Mis clientes'}, {text:'💰 Mis ganancias'}],
      [{text:'💎 Mis diamantes'}, {text:'🆘 Soporte'}]
    ],
    resize_keyboard: true,
    is_persistent: true,
    input_field_placeholder: 'Elige una opción de Mundo Digital'
  };
}

function md20TgEnviarMenuRev_(chatId, texto) {
  return md20TgEnviar_('REVENDEDORES', chatId, texto, {
    reply_markup: md20TgMenuRev_()
  });
}

/**
 * Genera un código para un revendedor.
 * Ejemplo:
 * generarCodigoRevendedorTelegramMD20('REV-XXXXX')
 */
function generarCodigoRevendedorTelegramMD20(revendedorId) {
  const r = md20TgGenerarCodigo_('REVENDEDOR', String(revendedorId || '').trim(), 'ADMIN');
  console.log(JSON.stringify(r, null, 2));
  return r;
}

/* ============================================================
 * 5. BOT ADMINISTRADOR
 * ============================================================ */

function md20TgProcesarAdmin_(msg, updateId) {
  const chatId = String(msg.chat.id || '');
  const comando = md20TgNormalizarAdmin_(msg.text);

  try {
    if (comando === '/start') {
      const vinc = md20TgVincPorChat_(chatId);

      if (vinc && vinc.tipoUsuario === 'ADMIN') {
        md20TgEnviarMenuAdmin_(chatId, '👋 Bienvenido nuevamente al panel administrador.');
      } else {
        md20TgEnviar_('ADMIN', chatId,
          '👋 Bienvenido al bot administrador de Mundo Digital 2.0.\n\n' +
          'Para vincular usa:\n/vincular CODIGO'
        );
      }
      return;
    }

    if (comando.indexOf('/vincular ') === 0) {
      const codigo = String(comando.split(/\s+/)[1] || '').toUpperCase();

      const ya = md20TgVincPorChat_(chatId);
      if (ya && ya.tipoUsuario === 'ADMIN') {
        md20TgEnviarMenuAdmin_(chatId, '✅ Esta cuenta ya está vinculada como administrador.');
        return;
      }

      const vinc = md20TgUsarCodigo_(codigo, chatId, msg.from || {}, 'ADMIN');
      md20TgPropSet_(MD20_TG.PROP.CHAT_ADMIN, chatId);

      md20TgEnviarMenuAdmin_(chatId,
        '✅ Administrador vinculado correctamente.\n\nID: ' + vinc.usuarioId
      );
      return;
    }

    const vinc = md20TgVincPorChat_(chatId);

    if (!vinc || vinc.tipoUsuario !== 'ADMIN') {
      md20TgEnviar_('ADMIN', chatId,
        '🔒 Esta cuenta no está vinculada como administrador.'
      );
      return;
    }

    md20TgActualizarInteraccion_(vinc.fila);

    let respuesta = '';

    if (comando === '/resumen') respuesta = md20TgTextoResumenAdmin_();
    else if (comando === '/pagos') respuesta = md20TgTextoPagosAdmin_();
    else if (comando === '/ventas') respuesta = md20TgTextoVentasAdmin_();
    else if (comando === '/clientes') respuesta = md20TgTextoClientesAdmin_();
    else if (comando === '/revendedores') respuesta = md20TgTextoRevendedoresAdmin_();
    else if (comando === '/entregas') respuesta = md20TgTextoEntregasAdmin_();
    else if (comando === '/soporte') respuesta = '🆘 SOPORTE ADMIN\n\nLos errores se guardan en TELEGRAM_LOGS.';
    else respuesta = 'Selecciona una opción del menú.';

    md20TgEnviarMenuAdmin_(chatId, respuesta);

  } catch (error) {
    md20TgLog_({
      bot: 'ADMIN',
      updateId: updateId,
      chatId: chatId,
      tipoUsuario: 'ADMIN',
      comando: comando,
      resultado: 'ERROR',
      detalle: md20TgError_(error)
    });

    try {
      md20TgEnviarMenuAdmin_(chatId,
        '⚠️ Esta opción presentó un error. Revisa TELEGRAM_LOGS.'
      );
    } catch (_) {}
  }
}

function md20TgNormalizarAdmin_(texto) {
  const s = md20TgNormalizarTexto_(texto);

  if (s.indexOf('/vincular ') === 0) {
    return '/vincular ' + String(s.split(/\s+/)[1] || '').toUpperCase();
  }

  if (s === '/start' || s === 'start') return '/start';
  if (s.includes('resumen general') || s === '/resumen' || s === '/menu' || s === 'menu') return '/resumen';
  if (s.includes('pagos pendientes') || s === '/pagos') return '/pagos';
  if (s.includes('ventas') || s === '/ventas') return '/ventas';
  if (s.includes('clientes') || s === '/clientes') return '/clientes';
  if (s.includes('revendedores') || s === '/revendedores') return '/revendedores';
  if (s.includes('entregas') || s === '/entregas') return '/entregas';
  if (s.includes('soporte') || s === '/soporte') return '/soporte';

  return s;
}

function md20TgMenuAdmin_() {
  return {
    keyboard: [
      [{text:'🏠 Resumen general'}, {text:'💳 Pagos pendientes'}],
      [{text:'🛒 Ventas'}, {text:'📦 Entregas'}],
      [{text:'👥 Clientes'}, {text:'🧑‍💼 Revendedores'}],
      [{text:'🆘 Soporte'}]
    ],
    resize_keyboard: true,
    is_persistent: true,
    input_field_placeholder: 'Elige una opción administrativa'
  };
}

function md20TgEnviarMenuAdmin_(chatId, texto) {
  return md20TgEnviar_('ADMIN', chatId, texto, {
    reply_markup: md20TgMenuAdmin_()
  });
}

function generarCodigoAdministradorTelegramMD20() {
  const r = md20TgGenerarCodigo_('ADMIN', 'ADMIN-PRINCIPAL', 'SISTEMA');
  console.log(JSON.stringify(r, null, 2));
  return r;
}

/* ============================================================
 * 6. VINCULACIONES
 * ============================================================ */

function md20TgGenerarCodigo_(tipoUsuario, usuarioId, creadoPor) {
  const tipo = String(tipoUsuario || '').toUpperCase();
  const id = String(usuarioId || '').trim();

  if (!id) throw new Error('Falta USUARIO_ID.');

  if (tipo === 'REVENDEDOR') {
    const rev = md20TgBuscarRevendedor_(id);
    if (!rev) throw new Error('No se encontró el revendedor: ' + id);
  }

  const ss = md20TgSs_();
  const sh = ss.getSheetByName(MD20_TG.HOJAS.CODIGOS);
  md20TgCancelarCodigos_(tipo, id);

  const codigo = md20TgCodigoUnico_();
  const ahora = new Date();
  const vence = new Date(ahora.getTime() + 30 * 60000);

  sh.appendRow([
    'TCOD-' + Utilities.getUuid().replace(/-/g,'').slice(0,14).toUpperCase(),
    codigo,
    tipo,
    id,
    'PENDIENTE',
    ahora,
    vence,
    '',
    '',
    creadoPor || 'SISTEMA'
  ]);

  return {
    ok: true,
    codigo: codigo,
    comando: '/vincular ' + codigo,
    tipoUsuario: tipo,
    usuarioId: id,
    fechaVencimiento: vence
  };
}

function md20TgUsarCodigo_(codigo, chatId, from, tipoEsperado) {
  const registro = md20TgBuscarCodigoVigente_(codigo);

  if (!registro) {
    const ya = md20TgVincPorChat_(chatId);
    if (ya && ya.tipoUsuario === tipoEsperado) return ya;
    throw new Error('El código no existe, venció o ya fue utilizado.');
  }

  if (registro.tipoUsuario !== tipoEsperado) {
    throw new Error('Este código pertenece a otro tipo de usuario.');
  }

  const otra = md20TgVincPorChat_(chatId);
  if (otra && (otra.tipoUsuario !== registro.tipoUsuario || otra.usuarioId !== registro.usuarioId)) {
    throw new Error('Este Telegram ya está vinculado con otro usuario.');
  }

  const ss = md20TgSs_();
  const shU = ss.getSheetByName(MD20_TG.HOJAS.USUARIOS);
  const shC = ss.getSheetByName(MD20_TG.HOJAS.CODIGOS);

  const existente = md20TgVincUsuario_(registro.tipoUsuario, registro.usuarioId);
  const ahora = new Date();
  const nombre = [from.first_name || '', from.last_name || ''].filter(Boolean).join(' ').trim();
  const username = String(from.username || '');

  const fila = [
    existente ? existente.vinculacionId : 'TVIN-' + Utilities.getUuid().replace(/-/g,'').slice(0,14).toUpperCase(),
    registro.tipoUsuario,
    registro.usuarioId,
    String(chatId),
    username,
    nombre,
    'VINCULADO',
    ahora,
    ahora,
    existente ? existente.creadoEn || ahora : ahora,
    ahora
  ];

  let filaUsuario = 0;

  if (existente) {
    filaUsuario = existente.fila;
    shU.getRange(existente.fila, 1, 1, 11).setValues([fila]);
  } else {
    shU.appendRow(fila);
    filaUsuario = shU.getLastRow();
  }

  shC.getRange(registro.fila, 5).setValue('UTILIZADO');
  shC.getRange(registro.fila, 8).setValue(ahora);
  shC.getRange(registro.fila, 9).setValue(String(chatId));

  SpreadsheetApp.flush();

  return {
    fila: filaUsuario,
    vinculacionId: fila[0],
    tipoUsuario: registro.tipoUsuario,
    usuarioId: registro.usuarioId,
    chatId: String(chatId),
    estado: 'VINCULADO',
    creadoEn: fila[9]
  };
}

function md20TgVincPorChat_(chatId) {
  return md20TgLeerUsuarios_().find(r =>
    r.chatId === String(chatId) && r.estado === 'VINCULADO'
  ) || null;
}

function md20TgVincUsuario_(tipo, usuarioId) {
  return md20TgLeerUsuarios_().find(r =>
    r.tipoUsuario === String(tipo).toUpperCase() &&
    r.usuarioId === String(usuarioId)
  ) || null;
}

function md20TgLeerUsuarios_() {
  const sh = md20TgSs_().getSheetByName(MD20_TG.HOJAS.USUARIOS);
  if (!sh || sh.getLastRow() <= 1) return [];

  return sh.getRange(2,1,sh.getLastRow()-1,11).getValues().map((f,i)=>({
    fila: i+2,
    vinculacionId: String(f[0]||''),
    tipoUsuario: String(f[1]||'').toUpperCase(),
    usuarioId: String(f[2]||''),
    chatId: String(f[3]||''),
    username: String(f[4]||''),
    nombre: String(f[5]||''),
    estado: String(f[6]||'').toUpperCase(),
    fechaVinculacion: f[7]||'',
    ultimaInteraccion: f[8]||'',
    creadoEn: f[9]||'',
    actualizadoEn: f[10]||''
  })).filter(r=>r.vinculacionId);
}

function md20TgActualizarInteraccion_(fila) {
  const sh = md20TgSs_().getSheetByName(MD20_TG.HOJAS.USUARIOS);
  if (!sh || !fila) return;
  sh.getRange(Number(fila),9).setValue(new Date());
  sh.getRange(Number(fila),11).setValue(new Date());
}

function md20TgBuscarCodigoVigente_(codigo) {
  const sh = md20TgSs_().getSheetByName(MD20_TG.HOJAS.CODIGOS);
  if (!sh || sh.getLastRow() <= 1) return null;

  const ahora = Date.now();
  const buscado = String(codigo||'').toUpperCase();

  return sh.getRange(2,1,sh.getLastRow()-1,10).getValues().map((f,i)=>({
    fila:i+2,
    codigoId:String(f[0]||''),
    codigo:String(f[1]||'').toUpperCase(),
    tipoUsuario:String(f[2]||'').toUpperCase(),
    usuarioId:String(f[3]||''),
    estado:String(f[4]||'').toUpperCase(),
    fechaCreacion:f[5]||'',
    fechaVencimiento:f[6]||''
  })).find(r =>
    r.codigo === buscado &&
    r.estado === 'PENDIENTE' &&
    r.fechaVencimiento &&
    new Date(r.fechaVencimiento).getTime() > ahora
  ) || null;
}

function md20TgCancelarCodigos_(tipo, usuarioId) {
  const sh = md20TgSs_().getSheetByName(MD20_TG.HOJAS.CODIGOS);
  if (!sh || sh.getLastRow() <= 1) return;

  const data = sh.getRange(2,1,sh.getLastRow()-1,10).getValues();
  data.forEach((f,i)=>{
    if (
      String(f[2]||'').toUpperCase() === String(tipo).toUpperCase() &&
      String(f[3]||'') === String(usuarioId) &&
      String(f[4]||'').toUpperCase() === 'PENDIENTE'
    ) {
      sh.getRange(i+2,5).setValue('CANCELADO');
    }
  });
}

function md20TgCodigoUnico_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let intento=0; intento<50; intento++) {
    let c='';
    for (let i=0;i<6;i++) c += chars[Math.floor(Math.random()*chars.length)];
    if (!md20TgExisteCodigo_(c)) return c;
  }
  throw new Error('No se pudo generar un código único.');
}

function md20TgExisteCodigo_(codigo) {
  const sh = md20TgSs_().getSheetByName(MD20_TG.HOJAS.CODIGOS);
  if (!sh || sh.getLastRow()<=1) return false;
  return sh.getRange(2,2,sh.getLastRow()-1,1).getDisplayValues().flat()
    .some(v=>String(v).toUpperCase()===String(codigo).toUpperCase());
}

/* ============================================================
 * 7. CONSULTAS DIRECTAS A SHEETS
 * ============================================================ */

function md20TgTextoResumenRev_(id) {
  const rev = md20TgBuscarRevendedor_(id);
  if (!rev) throw new Error('Revendedor no encontrado.');

  const ventas = md20TgVentasRev_(id);
  const pagadas = ventas.filter(md20TgVentaPagada_);
  const clientes = md20TgClientesDesdeVentas_(ventas);
  const total = pagadas.reduce((s,v)=>s+md20TgNumero_(md20TgValor_(v,['TOTAL','MONTO','PRECIO_FINAL'])),0);

  return [
    '🏠 MI RESUMEN','',
    'Revendedor: '+rev.nombre,
    'ID: '+id,
    'Estado: '+rev.estado,
    'Tienda: '+rev.tienda,
    '',
    'Ventas registradas: '+ventas.length,
    'Ventas pagadas: '+pagadas.length,
    'Clientes: '+clientes.length,
    'Total confirmado: '+total.toFixed(2)+' USD'
  ].join('\n');
}

function md20TgTextoTiendaRev_(id) {
  const rev = md20TgBuscarRevendedor_(id);
  const productos = md20TgLeerHoja_(MD20_TG.HOJAS.CATALOGO).filter(md20TgProductoActivo_);

  return [
    '🏪 MI TIENDA','',
    'Estado: '+(rev ? rev.tienda : 'ACTIVA'),
    'Revendedor ID: '+id,
    'Productos disponibles: '+productos.length,
    '',
    'Enlace:',
    'tienda.html?vendedor='+id
  ].join('\n');
}

function md20TgTextoVentasRev_(id) {
  const ventas = md20TgVentasRev_(id).slice(-8).reverse();
  if (!ventas.length) return '🛒 MIS VENTAS\n\nTodavía no tienes ventas registradas.';

  const out=['🛒 MIS VENTAS',''];
  ventas.forEach((v,i)=>{
    out.push((i+1)+'. '+md20TgTexto_(md20TgValor_(v,['NUMERO_VENTA','VENTA_ID','ID_VENTA','ID'])||'Venta'));
    out.push('Cliente: '+md20TgTexto_(md20TgValor_(v,['CLIENTE','NOMBRE_CLIENTE','CLIENTE_NOMBRE'])||'Cliente'));
    out.push('Total: '+md20TgNumero_(md20TgValor_(v,['TOTAL','MONTO','PRECIO_FINAL'])).toFixed(2)+' '+md20TgTexto_(md20TgValor_(v,['MONEDA'])||'USD'));
    out.push('Estado: '+md20TgTexto_(md20TgValor_(v,['ESTADO_PAGO','ESTADO'])||'PENDIENTE'));
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoPagosRev_(id) {
  const ventas = md20TgVentasRev_(id);
  const ids = new Set();

  ventas.forEach(v=>{
    ['VENTA_ID','ID_VENTA','NUMERO_VENTA','ID'].forEach(k=>{
      const x=md20TgValor_(v,[k]); if(x) ids.add(String(x));
    });
  });

  const pagos = md20TgLeerHoja_(MD20_TG.HOJAS.PAGOS).filter(p=>{
    const d=String(md20TgValor_(p,['REGISTRO_ID','REVENDEDOR_ID','VENDEDOR_ID','ID_REVENDEDOR'])||'');
    const venta=String(md20TgValor_(p,['VENTA_ID','ID_VENTA','NUMERO_VENTA'])||'');
    return d===id || ids.has(venta);
  }).slice(-8).reverse();

  if(!pagos.length) return '💳 MIS PAGOS\n\nTodavía no hay pagos asociados con tus ventas.';

  const out=['💳 MIS PAGOS',''];
  pagos.forEach((p,i)=>{
    out.push((i+1)+'. '+md20TgNumero_(md20TgValor_(p,['MONTO','TOTAL'])).toFixed(2)+' '+md20TgTexto_(md20TgValor_(p,['MONEDA'])||'USD'));
    out.push('Método: '+md20TgTexto_(md20TgValor_(p,['METODO_PAGO','METODO','FORMA_PAGO'])||'No registrado'));
    out.push('Estado: '+md20TgTexto_(md20TgValor_(p,['ESTADO','ESTADO_PAGO'])||'PENDIENTE'));
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoClientesRev_(id) {
  const clientes = md20TgClientesDesdeVentas_(md20TgVentasRev_(id)).slice(0,10);
  if(!clientes.length) return '👥 MIS CLIENTES\n\nTodavía no tienes clientes registrados.';

  const out=['👥 MIS CLIENTES',''];
  clientes.forEach((c,i)=>{
    out.push((i+1)+'. '+c.nombre);
    if(c.telefono) out.push('WhatsApp: '+c.telefono);
    out.push('Compras: '+c.compras);
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoGananciasRev_(id) {
  const ventas=md20TgVentasRev_(id);
  const pagadas=ventas.filter(md20TgVentaPagada_);
  const total=pagadas.reduce((s,v)=>s+md20TgNumero_(md20TgValor_(v,['TOTAL','MONTO','PRECIO_FINAL'])),0);

  return [
    '💰 MIS GANANCIAS','',
    'Ventas confirmadas: '+pagadas.length,
    'Total vendido: '+total.toFixed(2)+' USD',
    '',
    'La ganancia neta se conectará con las reglas de comisión del revendedor.'
  ].join('\n');
}

function md20TgTextoResumenAdmin_() {
  const ventas=md20TgLeerHoja_(MD20_TG.HOJAS.VENTAS);
  const pagos=md20TgLeerHoja_(MD20_TG.HOJAS.PAGOS);
  const clientes=md20TgLeerHoja_(MD20_TG.HOJAS.CLIENTES);
  const revs=md20TgLeerHoja_(MD20_TG.HOJAS.REVENDEDORES);
  const pedidos=md20TgLeerHoja_(MD20_TG.HOJAS.PEDIDOS);
  const pagadas=ventas.filter(md20TgVentaPagada_);
  const pendientes=pagos.filter(p=>['PENDIENTE','EN_REVISION','REVISION'].includes(String(md20TgValor_(p,['ESTADO','ESTADO_PAGO'])||'').toUpperCase()));
  const total=pagadas.reduce((s,v)=>s+md20TgNumero_(md20TgValor_(v,['TOTAL','MONTO','PRECIO_FINAL'])),0);

  return [
    '🏠 RESUMEN GENERAL','',
    'Revendedores: '+revs.length,
    'Clientes: '+clientes.length,
    'Ventas: '+ventas.length,
    'Ventas pagadas: '+pagadas.length,
    'Pagos pendientes: '+pendientes.length,
    'Pedidos web: '+pedidos.length,
    'Total confirmado: '+total.toFixed(2)+' USD'
  ].join('\n');
}

function md20TgTextoPagosAdmin_() {
  const pagos=md20TgLeerHoja_(MD20_TG.HOJAS.PAGOS)
    .filter(p=>['PENDIENTE','EN_REVISION','REVISION'].includes(String(md20TgValor_(p,['ESTADO','ESTADO_PAGO'])||'').toUpperCase()))
    .slice(-10).reverse();

  if(!pagos.length) return '💳 PAGOS PENDIENTES\n\nNo hay pagos pendientes.';

  const out=['💳 PAGOS PENDIENTES',''];
  pagos.forEach((p,i)=>{
    out.push((i+1)+'. '+md20TgNumero_(md20TgValor_(p,['MONTO','TOTAL'])).toFixed(2)+' '+md20TgTexto_(md20TgValor_(p,['MONEDA'])||'USD'));
    out.push('Cliente: '+md20TgTexto_(md20TgValor_(p,['CLIENTE','NOMBRE_CLIENTE'])||'Cliente'));
    out.push('Método: '+md20TgTexto_(md20TgValor_(p,['METODO_PAGO','METODO'])||'No registrado'));
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoVentasAdmin_() {
  const ventas=md20TgLeerHoja_(MD20_TG.HOJAS.VENTAS).slice(-10).reverse();
  if(!ventas.length) return '🛒 VENTAS\n\nNo hay ventas registradas.';
  const out=['🛒 ÚLTIMAS VENTAS',''];
  ventas.forEach((v,i)=>{
    out.push((i+1)+'. '+md20TgTexto_(md20TgValor_(v,['NUMERO_VENTA','VENTA_ID','ID'])||'Venta'));
    out.push('Cliente: '+md20TgTexto_(md20TgValor_(v,['CLIENTE','NOMBRE_CLIENTE'])||'Cliente'));
    out.push('Total: '+md20TgNumero_(md20TgValor_(v,['TOTAL','MONTO'])).toFixed(2)+' '+md20TgTexto_(md20TgValor_(v,['MONEDA'])||'USD'));
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoClientesAdmin_() {
  const clientes=md20TgLeerHoja_(MD20_TG.HOJAS.CLIENTES).slice(-10).reverse();
  if(!clientes.length) return '👥 CLIENTES\n\nNo hay clientes registrados.';
  const out=['👥 ÚLTIMOS CLIENTES',''];
  clientes.forEach((c,i)=>{
    out.push((i+1)+'. '+md20TgTexto_(md20TgValor_(c,['NOMBRE','NOMBRE_CLIENTE'])||'Cliente'));
    const tel=md20TgTexto_(md20TgValor_(c,['WHATSAPP','TELEFONO','CELULAR'])||'');
    if(tel) out.push('WhatsApp: '+tel);
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoRevendedoresAdmin_() {
  const revs=md20TgLeerHoja_(MD20_TG.HOJAS.REVENDEDORES).slice(0,15);
  if(!revs.length) return '🧑‍💼 REVENDEDORES\n\nNo hay revendedores.';
  const out=['🧑‍💼 REVENDEDORES',''];
  revs.forEach((r,i)=>{
    out.push((i+1)+'. '+md20TgTexto_(md20TgValor_(r,['NOMBRE'])||'')+' '+md20TgTexto_(md20TgValor_(r,['APELLIDO'])||''));
    out.push('Estado: '+md20TgTexto_(md20TgValor_(r,['ESTADO'])||'ACTIVO'));
    out.push('');
  });
  return out.join('\n');
}

function md20TgTextoEntregasAdmin_() {
  const entregas=md20TgLeerHoja_(MD20_TG.HOJAS.ENTREGAS).slice(-10).reverse();
  if(!entregas.length) return '📦 ENTREGAS\n\nNo hay entregas registradas.';
  const out=['📦 ÚLTIMAS ENTREGAS',''];
  entregas.forEach((e,i)=>{
    out.push((i+1)+'. '+md20TgTexto_(md20TgValor_(e,['VENTA_ID','NUMERO_VENTA','ID'])||'Entrega'));
    out.push('Estado: '+md20TgTexto_(md20TgValor_(e,['ESTADO','ESTADO_ENTREGA'])||'PENDIENTE'));
    out.push('');
  });
  return out.join('\n');
}

function md20TgBuscarRevendedor_(id) {
  const r=md20TgLeerHoja_(MD20_TG.HOJAS.REVENDEDORES).find(x=>
    String(md20TgValor_(x,['REGISTRO_ID','REVENDEDOR_ID','ID_REVENDEDOR','SOCIO_ID','VENDEDOR_ID','ID'])||'')===String(id)
  );
  if(!r) return null;

  const nombre=[
    md20TgValor_(r,['NOMBRE','NOMBRES']),
    md20TgValor_(r,['APELLIDO','APELLIDOS'])
  ].filter(Boolean).join(' ').trim() || String(id);

  const estado=String(md20TgValor_(r,['ESTADO','ACTIVO'])||'ACTIVO');
  const tiendaRaw=String(md20TgValor_(r,['TIENDA_ACTIVA','ESTADO_TIENDA'])||'SI').toUpperCase();

  return {
    nombre:nombre,
    estado:estado,
    tienda:['NO','APAGADA','INACTIVA','DESACTIVADA'].includes(tiendaRaw)?'APAGADA':'ACTIVA'
  };
}

function md20TgVentasRev_(id) {
  return md20TgLeerHoja_(MD20_TG.HOJAS.VENTAS).filter(v=>{
    const d=String(md20TgValor_(v,['REGISTRO_ID','REVENDEDOR_ID','VENDEDOR_ID','ID_REVENDEDOR','REFERENCIA_VENDEDOR','SOCIO_ID'])||'');
    if(d===String(id)) return true;
    const notas=String(md20TgValor_(v,['NOTAS','OBSERVACIONES','DETALLE'])||'');
    return notas.includes(String(id));
  });
}

function md20TgVentaPagada_(v) {
  return ['PAGADO','CONFIRMADO','APROBADO','COMPLETADO'].includes(
    String(md20TgValor_(v,['ESTADO_PAGO','PAGO_ESTADO','ESTADO'])||'').toUpperCase()
  );
}

function md20TgClientesDesdeVentas_(ventas) {
  const mapa={};

  (ventas||[]).forEach(v=>{
    const id=String(md20TgValor_(v,['CLIENTE_ID','ID_CLIENTE','WHATSAPP','TELEFONO'])||'');
    const nombre=md20TgTexto_(md20TgValor_(v,['CLIENTE','NOMBRE_CLIENTE','CLIENTE_NOMBRE'])||'Cliente');
    const telefono=md20TgTexto_(md20TgValor_(v,['WHATSAPP','TELEFONO','CLIENTE_TELEFONO'])||'');
    const k=id||telefono||nombre;

    if(!mapa[k]) mapa[k]={nombre:nombre,telefono:telefono,compras:0};
    mapa[k].compras++;
  });

  return Object.values(mapa).sort((a,b)=>b.compras-a.compras);
}

function md20TgProductoActivo_(p) {
  const e=String(md20TgValor_(p,['ESTADO','ACTIVO','PUBLICADO'])||'').toUpperCase();
  return !e || ['ACTIVO','SI','SÍ','PUBLICADO','DISPONIBLE'].includes(e);
}

/* ============================================================
 * 8. API TELEGRAM
 * ============================================================ */

function md20TgGuardarToken_(tipo, token) {
  const t=String(tipo).toUpperCase();
  const limpio=String(token||'').trim();

  if(!/^\d+:[A-Za-z0-9_-]{20,}$/.test(limpio)) {
    throw new Error('Formato de token inválido.');
  }

  const prop=t==='ADMIN'?MD20_TG.PROP.TOKEN_ADMIN:MD20_TG.PROP.TOKEN_REVENDEDORES;
  md20TgPropSet_(prop, limpio);

  try {
    return md20TgGetMe_(t);
  } catch(error) {
    PropertiesService.getScriptProperties().deleteProperty(prop);
    throw error;
  }
}

function md20TgToken_(tipo) {
  const t=String(tipo).toUpperCase();
  const prop=t==='ADMIN'?MD20_TG.PROP.TOKEN_ADMIN:MD20_TG.PROP.TOKEN_REVENDEDORES;
  const token=md20TgPropGet_(prop);
  if(!token) throw new Error('Token del bot '+t+' no configurado.');
  return token;
}

function md20TgApi_(tipo, metodo, parametros) {
  const token=md20TgToken_(tipo);
  const respuesta=UrlFetchApp.fetch(
    'https://api.telegram.org/bot'+token+'/'+metodo,
    {
      method:'post',
      contentType:'application/json',
      payload:JSON.stringify(parametros||{}),
      muteHttpExceptions:true
    }
  );

  const http=respuesta.getResponseCode();
  let data={};

  try { data=JSON.parse(respuesta.getContentText()||'{}'); }
  catch(e) { throw new Error('Telegram devolvió una respuesta inválida.'); }

  if(http<200 || http>=300 || !data.ok) {
    throw new Error(data.description||('Telegram HTTP '+http));
  }

  return data.result;
}

function md20TgGetMe_(tipo) {
  const r=md20TgApi_(tipo,'getMe',{});
  return {
    id:String(r.id||''),
    nombre:String(r.first_name||''),
    username:String(r.username||'')
  };
}

function md20TgEnviar_(tipo, chatId, texto, extra) {
  return md20TgApi_(tipo,'sendMessage',Object.assign({
    chat_id:String(chatId),
    text:String(texto||''),
    disable_web_page_preview:true
  },extra||{}));
}

/* ============================================================
 * 9. SEGURIDAD
 * ============================================================ */

function md20TgCrearSecretoSiNoExiste_(tipo) {
  const prop=String(tipo).toUpperCase()==='ADMIN'
    ?MD20_TG.PROP.SECRETO_ADMIN
    :MD20_TG.PROP.SECRETO_REVENDEDORES;

  let secreto=md20TgPropGet_(prop);

  if(!secreto) {
    secreto=Utilities.getUuid().replace(/-/g,'').slice(0,28);
    md20TgPropSet_(prop,secreto);
  }

  return secreto;
}

function md20TgValidarSecreto_(tipo, recibido) {
  const esperado=md20TgCrearSecretoSiNoExiste_(tipo);
  return Boolean(recibido) && String(recibido)===esperado;
}

function md20TgConstruirWebhookUrl_(tipo) {
  const base=md20TgWebAppUrl_();
  const t=String(tipo).toUpperCase();
  const bot=t==='ADMIN'?'admin':'revendedores';
  const secreto=md20TgCrearSecretoSiNoExiste_(t);

  return base+'?bot='+encodeURIComponent(bot)+'&secreto='+encodeURIComponent(secreto);
}

function md20TgAceptarUpdate_(tipo, updateId) {
  const id=Number(updateId||0);
  if(!id) return true;

  const t=String(tipo).toUpperCase();
  const cache=CacheService.getScriptCache();
  const ck='MD20_TG_UPD_'+t+'_'+id;

  if(cache.get(ck)) return false;

  const lock=LockService.getScriptLock();
  if(!lock.tryLock(8000)) return false;

  try {
    const props=PropertiesService.getScriptProperties();
    const key='MD20_TG_LAST_UPDATE_'+t;
    const ultimo=Number(props.getProperty(key)||0);

    if(id<=ultimo) {
      cache.put(ck,'1',21600);
      return false;
    }

    props.setProperty(key,String(id));
    cache.put(ck,'1',21600);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function md20TgLimpiarUpdate_(tipo) {
  PropertiesService.getScriptProperties()
    .deleteProperty('MD20_TG_LAST_UPDATE_'+String(tipo).toUpperCase());
}

/* ============================================================
 * 10. LOGS
 * ============================================================ */

function md20TgLog_(d) {
  try {
    const sh=md20TgSs_().getSheetByName(MD20_TG.HOJAS.LOGS);
    if(!sh) return;

    sh.appendRow([
      'TLOG-'+Utilities.getUuid().replace(/-/g,'').slice(0,14).toUpperCase(),
      new Date(),
      String(d.bot||''),
      String(d.updateId||''),
      String(d.chatId||''),
      String(d.tipoUsuario||''),
      String(d.usuarioId||''),
      String(d.comando||''),
      String(d.resultado||''),
      String(d.detalle||'').slice(0,3000)
    ]);
  } catch(e) {
    console.error('LOG: '+md20TgError_(e));
  }
}

function md20TgLogOk_(bot,updateId,chatId,tipoUsuario,usuarioId,comando,detalle) {
  md20TgLog_({
    bot:bot,
    updateId:updateId,
    chatId:chatId,
    tipoUsuario:tipoUsuario,
    usuarioId:usuarioId,
    comando:comando,
    resultado:'OK',
    detalle:detalle
  });
}

/* ============================================================
 * 11. UTILIDADES
 * ============================================================ */

function md20TgSs_() {
  return SpreadsheetApp.openById(MD20_TG.SPREADSHEET_ID);
}

function md20TgPrepararHoja_(ss,nombre,encabezados) {
  let sh=ss.getSheetByName(nombre);
  if(!sh) sh=ss.insertSheet(nombre);

  if(sh.getMaxColumns()<encabezados.length) {
    sh.insertColumnsAfter(sh.getMaxColumns(),encabezados.length-sh.getMaxColumns());
  }

  if(sh.getLastRow()===0 || sh.getRange(1,1,1,encabezados.length).getDisplayValues()[0].every(v=>!String(v).trim())) {
    sh.getRange(1,1,1,encabezados.length).setValues([encabezados]);
  }

  sh.setFrozenRows(1);
  sh.getRange(1,1,1,encabezados.length).setFontWeight('bold');
}

function md20TgSetConfigHoja_(clave,valor,descripcion) {
  const sh=md20TgSs_().getSheetByName(MD20_TG.HOJAS.CONFIG);
  if(!sh) return;

  const last=sh.getLastRow();
  let fila=0;

  if(last>1) {
    const vals=sh.getRange(2,1,last-1,1).getDisplayValues().flat();
    const i=vals.findIndex(v=>String(v).toUpperCase()===String(clave).toUpperCase());
    if(i>=0) fila=i+2;
  }

  if(fila) {
    sh.getRange(fila,2,1,3).setValues([[valor,descripcion,new Date()]]);
  } else {
    sh.appendRow([clave,valor,descripcion,new Date()]);
  }
}

function md20TgPropGet_(k) {
  return String(PropertiesService.getScriptProperties().getProperty(k)||'').trim();
}

function md20TgPropSet_(k,v) {
  PropertiesService.getScriptProperties().setProperty(String(k),String(v||'').trim());
}

function md20TgWebAppUrl_() {
  const url=md20TgPropGet_(MD20_TG.PROP.WEB_APP_URL);
  if(!url) throw new Error('WEB_APP_URL no configurada. Ejecuta CONFIGURAR_TELEGRAM_MD20.');
  return url.replace(/\?.*$/,'').replace(/\/dev$/,'/exec');
}

function md20TgLeerHoja_(nombre) {
  const sh=md20TgSs_().getSheetByName(nombre);
  if(!sh || sh.getLastRow()<=1 || sh.getLastColumn()<=0) return [];

  const headers=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0]
    .map(md20TgHeader_);

  return sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues().map((f,i)=>{
    const o={_FILA:i+2};
    headers.forEach((h,j)=>{if(h)o[h]=f[j];});
    return o;
  });
}

function md20TgHeader_(v) {
  return String(v||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .trim().toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}

function md20TgValor_(registro,nombres) {
  for(let i=0;i<nombres.length;i++) {
    const k=md20TgHeader_(nombres[i]);
    if(registro && Object.prototype.hasOwnProperty.call(registro,k)) {
      const v=registro[k];
      if(v!=='' && v!==null && v!==undefined) return v;
    }
  }
  return '';
}

function md20TgNumero_(valor) {
  if(typeof valor==='number') return Number.isFinite(valor)?valor:0;

  let s=String(valor||'').trim().replace(/\s/g,'');
  if(!s) return 0;

  if(s.includes(',') && s.includes('.')) {
    if(s.lastIndexOf(',')>s.lastIndexOf('.')) s=s.replace(/\./g,'').replace(',','.');
    else s=s.replace(/,/g,'');
  } else if(s.includes(',')) {
    s=s.replace(',','.');
  }

  const n=Number(s.replace(/[^0-9.-]/g,''));
  return Number.isFinite(n)?n:0;
}

function md20TgTexto_(v) {
  return String(v===null||v===undefined?'':v)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'')
    .trim().slice(0,600);
}

function md20TgNormalizarTexto_(texto) {
  return String(texto||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[\uFE0E\uFE0F]/g,'')
    .replace(/\s+/g,' ')
    .trim().toLowerCase();
}

function md20TgError_(error) {
  return String(
    error && (error.stack || error.message)
      ? (error.stack || error.message)
      : error || 'Error desconocido'
  ).slice(0,3000);
}

function md20TgText_(texto) {
  return ContentService.createTextOutput(String(texto||'OK'))
    .setMimeType(ContentService.MimeType.TEXT);
}

function md20TgJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj,null,2))
    .setMimeType(ContentService.MimeType.JSON);
}
