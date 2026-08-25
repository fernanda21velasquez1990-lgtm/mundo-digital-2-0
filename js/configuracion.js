/**
 * MUNDO DIGITAL 2.0
 * Conexión con Google Apps Script + preferencias visuales globales.
 *
 * FASE 4G:
 * - Tamaño de letra configurable.
 * - Tipo de letra configurable.
 * - Emojis opcionales.
 * - Preferencias sincronizadas desde CONFIGURACION (Google Sheets).
 */
window.MUNDO_DIGITAL_CONFIG = {
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzlbNSOhEnIMk2kC9kg4yw1NdEtU9He_X0sAzb4-w7EWMVAF4EAU9_8327Zs45czbCM/exec",
  API_KEY_SOCIOS: "c6beff9d014d4e9d840f4d8f86a39680d18092ef5e1c4891abda044336002241",
  DIAS_ALERTA_VENCIMIENTO: 3
};

(function () {
  "use strict";

  const paginaActual = String(location.pathname || "")
    .split("/")
    .pop()
    .replace(/\.html$/i, "")
    .trim()
    .toLowerCase();
  const paginasNoAdmin = new Set(["", "index", "tienda", "mi-cuenta", "vendedor-dashboard", "chat-vendedor"]);
  const ES_PANEL_ADMIN = !paginasNoAdmin.has(paginaActual);

  const STORAGE_KEY = "MD20_PREFERENCIAS_VISUALES_V1";
  const DEFAULTS = {
    tamano: "GRANDE",
    fuente: "SISTEMA",
    emojis: "SI",
    emoji: "✨"
  };

  const ESCALAS = {
    COMPACTO: 0.90,
    NORMAL: 1,
    GRANDE: 1.28,
    MUY_GRANDE: 1.48
  };

  const FUENTES = {
    SISTEMA: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    ARIAL: 'Arial, Helvetica, sans-serif',
    VERDANA: 'Verdana, Geneva, sans-serif',
    TREBUCHET: '"Trebuchet MS", Arial, sans-serif',
    GEORGIA: 'Georgia, "Times New Roman", serif'
  };

  function normalizar(prefs) {
    const p = Object.assign({}, DEFAULTS, prefs || {});
    p.tamano = Object.prototype.hasOwnProperty.call(ESCALAS, String(p.tamano || "").toUpperCase())
      ? String(p.tamano).toUpperCase()
      : DEFAULTS.tamano;
    p.fuente = Object.prototype.hasOwnProperty.call(FUENTES, String(p.fuente || "").toUpperCase())
      ? String(p.fuente).toUpperCase()
      : DEFAULTS.fuente;
    p.emojis = String(p.emojis || "SI").toUpperCase() === "NO" ? "NO" : "SI";
    p.emoji = String(p.emoji ?? DEFAULTS.emoji).trim().slice(0, 8);
    return p;
  }

  function leerLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return normalizar(raw ? JSON.parse(raw) : DEFAULTS);
    } catch (_) {
      return normalizar(DEFAULTS);
    }
  }

  function guardarLocal(prefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizar(prefs)));
    } catch (_) {}
  }

  function decorarTitulo(prefs) {
    if (!document.body) return;
    document.querySelectorAll(".ui-page-emoji").forEach(el => el.remove());

    const p = normalizar(prefs);
    if (p.emojis !== "SI" || !p.emoji) return;

    const titulo = document.querySelector(".barra-superior .cabecera-izquierda h1");
    if (!titulo) return;

    const span = document.createElement("span");
    span.className = "ui-page-emoji";
    span.setAttribute("aria-hidden", "true");
    span.textContent = p.emoji;
    titulo.prepend(span);
  }

  function aplicar(prefs, persistir = true) {
    const p = normalizar(prefs);
    const html = document.documentElement;

    html.dataset.uiSize = p.tamano;
    html.dataset.uiFont = p.fuente;
    html.dataset.uiEmojis = p.emojis;
    html.style.setProperty("--ui-font-scale", String(ESCALAS[p.tamano] || 1));
    html.style.setProperty("--ui-font-family", FUENTES[p.fuente] || FUENTES.SISTEMA);

    if (persistir) guardarLocal(p);

    if (document.body) {
      decorarTitulo(p);
    } else {
      document.addEventListener("DOMContentLoaded", () => decorarTitulo(p), { once: true });
    }
    return p;
  }

  function preferenciasDesdeRegistros(registros) {
    const mapa = {};
    (Array.isArray(registros) ? registros : []).forEach(r => {
      mapa[String(r.clave || "").trim().toUpperCase()] = String(r.valor ?? "").trim();
    });
    return normalizar({
      tamano: mapa.TAMANO_LETRA_PANEL || DEFAULTS.tamano,
      fuente: mapa.TIPO_LETRA_PANEL || DEFAULTS.fuente,
      emojis: mapa.MOSTRAR_EMOJIS_PANEL || DEFAULTS.emojis,
      emoji: Object.prototype.hasOwnProperty.call(mapa, "EMOJI_PANEL") ? mapa.EMOJI_PANEL : DEFAULTS.emoji
    });
  }

  async function sincronizar() {
    const cfg = window.MUNDO_DIGITAL_CONFIG || {};
    if (!cfg.APPS_SCRIPT_URL || !cfg.API_KEY_SOCIOS) return aplicar(leerLocal(), false);

    try {
      const url = new URL(cfg.APPS_SCRIPT_URL);
      url.searchParams.set("action", "listarConfiguracionAdminMD20");
      url.searchParams.set("claveApi", cfg.API_KEY_SOCIOS);

      const respuesta = await fetch(url.toString(), {
        method: "GET",
        redirect: "follow",
        cache: "no-store"
      });
      const datos = await respuesta.json();
      if (!datos || !datos.ok) throw new Error(datos?.mensaje || "No se pudo cargar la apariencia.");

      return aplicar(preferenciasDesdeRegistros(datos.registros || []), true);
    } catch (_) {
      return aplicar(leerLocal(), false);
    }
  }

  if (ES_PANEL_ADMIN) {
    aplicar(leerLocal(), false);
  }

  window.MD20UI = {
    defaults: Object.assign({}, DEFAULTS),
    escalas: Object.assign({}, ESCALAS),
    fuentes: Object.assign({}, FUENTES),
    leerLocal,
    aplicar,
    sincronizar,
    preferenciasDesdeRegistros
  };

  if (ES_PANEL_ADMIN) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", sincronizar, { once: true });
    } else {
      sincronizar();
    }
  }
})();
