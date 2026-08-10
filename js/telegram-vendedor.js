/**
 * MUNDO DIGITAL 2.0
 * Puente independiente Telegram Vendedores
 *
 * Telegram
 *   -> /api/telegram-vendedor
 *   -> Apps Script: Mundo Digital 2.0 - Telegram Vendedores
 *
 * Variables privadas Vercel:
 *   APPS_SCRIPT_VENDEDOR_URL
 *   MD20_VENDEDOR_BRIDGE_SECRET
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      service: 'Mundo Digital 2.0 - Telegram Vendedores Bridge'
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
      'Faltan variables APPS_SCRIPT_VENDEDOR_URL o MD20_VENDEDOR_BRIDGE_SECRET'
    );

    return res.status(500).json({
      ok: false,
      error: 'Bridge vendedor no configurado'
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

    const response = await fetch(
      target.toString(),
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(req.body || {}),
        redirect: 'follow'
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(
        'Apps Script Vendedor respondió:',
        response.status,
        text.slice(0, 1000)
      );
    }

    // Telegram debe recibir 200 para que no reintente en bucle.
    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error(
      'Error puente Telegram Vendedor:',
      error
    );

    return res.status(200).json({
      ok: false,
      handled: true
    });
  }
}
