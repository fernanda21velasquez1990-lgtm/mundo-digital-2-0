/**
 * MUNDO DIGITAL 2.0
 * PUENTE TELEGRAM VENDEDORES — VERSION ESTABLE
 *
 * Telegram -> Vercel -> Apps Script Vendedores -> Telegram
 *
 * Variables de entorno existentes en Vercel:
 * - APPS_SCRIPT_VENDEDOR_URL
 * - MD20_VENDEDOR_BRIDGE_SECRET
 *
 * IMPORTANTE:
 * - No usa waitUntil()
 * - No usa @vercel/functions
 * - No necesita package.json especial
 * - Sigue redirecciones de Apps Script
 */

module.exports = async function handler(req, res) {
  // Prueba rápida desde navegador.
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      service: 'Mundo Digital 2.0 - Telegram Vendedores Bridge',
      mode: 'stable-sync',
      version: 'MD20-VENDEDOR-BRIDGE-ROLLBACK-1'
    });
  }

  const appsScriptUrl = String(
    process.env.APPS_SCRIPT_VENDEDOR_URL || ''
  ).trim();

  const expectedSecret = String(
    process.env.MD20_VENDEDOR_BRIDGE_SECRET || ''
  ).trim();

  const receivedSecret = String(
    req.query && req.query.secret
      ? req.query.secret
      : ''
  ).trim();

  if (!appsScriptUrl || !expectedSecret) {
    console.error(
      '[VENDEDOR] Faltan variables de entorno del puente.'
    );

    return res.status(500).json({
      ok: false,
      error: 'Bridge vendedores environment not configured'
    });
  }

  if (
    !receivedSecret ||
    receivedSecret !== expectedSecret
  ) {
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized'
    });
  }

  try {
    const target = new URL(appsScriptUrl);

    target.searchParams.set(
      'bridge_secret',
      expectedSecret
    );

    const body =
      typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body || {});

    const response = await fetch(
      target.toString(),
      {
        method: 'POST',
        headers: {
          'content-type':
            'application/json; charset=utf-8'
        },
        body: body,
        redirect: 'follow'
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(
        '[VENDEDOR] Apps Script devolvio error:',
        response.status,
        text.slice(0, 1000)
      );

      // Telegram debe recibir 200 para evitar reintentos duplicados.
      return res.status(200).json({
        ok: false,
        accepted: true,
        upstream_status: response.status
      });
    }

    console.log(
      '[VENDEDOR] Update procesado correctamente.'
    );

    return res.status(200).json({
      ok: true,
      accepted: true
    });

  } catch (error) {
    console.error(
      '[VENDEDOR] Error del puente:',
      error && error.message
        ? error.message
        : error
    );

    // Evita que Telegram repita indefinidamente el mismo update.
    return res.status(200).json({
      ok: false,
      accepted: true,
      bridge_error: true
    });
  }
};
