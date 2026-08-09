
/**
 * MUNDO DIGITAL 2.0
 * Puente Telegram Admin: Telegram -> Vercel -> Apps Script
 *
 * Variables de entorno Vercel:
 * - APPS_SCRIPT_ADMIN_URL
 * - MD20_ADMIN_BRIDGE_SECRET
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      service: 'Mundo Digital 2.0 - Telegram Admin Bridge'
    });
  }

  const appsScriptUrl = String(
    process.env.APPS_SCRIPT_ADMIN_URL || ''
  ).trim();

  const expectedSecret = String(
    process.env.MD20_ADMIN_BRIDGE_SECRET || ''
  ).trim();

  const receivedSecret = String(
    req.query && req.query.secret
      ? req.query.secret
      : ''
  ).trim();

  if (!appsScriptUrl || !expectedSecret) {
    return res.status(500).json({
      ok: false,
      error: 'Bridge environment not configured'
    });
  }

  if (!receivedSecret || receivedSecret !== expectedSecret) {
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

    // Telegram necesita un 200 del puente.
    // El contenido de Apps Script no necesita reenviarse a Telegram.
    const body = await response.text();

    if (!response.ok) {
      console.error(
        'Apps Script bridge error',
        response.status,
        body.slice(0, 1000)
      );
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    console.error(
      'Telegram admin bridge error:',
      error
    );

    // Evitamos que Telegram reintente el mismo update en bucle.
    return res.status(200).json({
      ok: false,
      handled: true
    });
  }
}
