/**
 * MUNDO DIGITAL 2.0
 * Puente estable Telegram Vendedores
 *
 * Telegram -> Vercel -> Apps Script Vendedores
 *
 * Variables Vercel existentes:
 * - APPS_SCRIPT_VENDEDOR_URL
 * - MD20_VENDEDOR_BRIDGE_SECRET
 *
 * CAMBIO CLAVE:
 * Telegram recibe 200 inmediatamente.
 * La llamada lenta a Apps Script continúa con waitUntil().
 */

import { waitUntil } from '@vercel/functions';

async function enviarAAppsScript({
  appsScriptUrl,
  secret,
  update
}) {
  const target = new URL(appsScriptUrl);

  target.searchParams.set(
    'bridge_secret',
    secret
  );

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      45000
    );

  try {
    const response =
      await fetch(
        target.toString(),
        {
          method: 'POST',
          headers: {
            'content-type':
              'application/json; charset=utf-8'
          },
          body:
            JSON.stringify(update || {}),
          redirect: 'follow',
          signal:
            controller.signal
        }
      );

    const body =
      await response.text();

    if (!response.ok) {
      console.error(
        '[VENDEDOR] Apps Script respondió error:',
        response.status,
        body.slice(0, 1000)
      );

      return;
    }

    console.log(
      '[VENDEDOR] Update procesado correctamente por Apps Script'
    );

  } catch (error) {
    console.error(
      '[VENDEDOR] Error enviando update a Apps Script:',
      error &&
      error.name === 'AbortError'
        ? 'Timeout interno de 45 segundos'
        : error
    );

  } finally {
    clearTimeout(timeout);
  }
}


export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({
      ok: true,
      service:
        'Mundo Digital 2.0 - Telegram Vendedores Bridge',
      mode:
        'immediate-ack',
      version:
        'MD20-VENDEDOR-BRIDGE-STABLE-1'
    });
  }

  const appsScriptUrl =
    String(
      process.env.APPS_SCRIPT_VENDEDOR_URL ||
      ''
    ).trim();

  const expectedSecret =
    String(
      process.env.MD20_VENDEDOR_BRIDGE_SECRET ||
      ''
    ).trim();

  const receivedSecret =
    String(
      req.query &&
      req.query.secret
        ? req.query.secret
        : ''
    ).trim();

  if (
    !appsScriptUrl ||
    !expectedSecret
  ) {
    console.error(
      '[VENDEDOR] Variables de entorno incompletas'
    );

    return res.status(500).json({
      ok: false,
      error:
        'Bridge vendedores environment not configured'
    });
  }

  if (
    !receivedSecret ||
    receivedSecret !== expectedSecret
  ) {
    return res.status(401).json({
      ok: false,
      error:
        'Unauthorized'
    });
  }

  // Copiamos el update antes de terminar la respuesta.
  const update =
    req.body || {};

  // Vercel mantiene viva la función para esta Promise,
  // pero Telegram NO tiene que esperar a Apps Script.
  waitUntil(
    enviarAAppsScript({
      appsScriptUrl:
        appsScriptUrl,
      secret:
        expectedSecret,
      update:
        update
    })
  );

  // Respuesta inmediata a Telegram:
  return res.status(200).json({
    ok: true,
    accepted: true
  });
}
