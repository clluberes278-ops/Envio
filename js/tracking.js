/**
 * js/tracking.js
 * Módulo de rastreo de paquetes.
 * Separado de main.js para responsabilidad única.
 *
 * MEJORAS vs versión anterior:
 *  - Disclaimer de "sistema de demostración" visible para el usuario
 *  - Manejo correcto de i18n usando window.i18n en vez de acceso directo al dict
 *  - Limpieza del input (leading/trailing spaces) antes de validar
 *  - Animación de entrada en el resultado
 *  - Sin duplicación de lógica de idioma
 */

document.addEventListener('DOMContentLoaded', () => {
  const trackingForm   = document.getElementById('tracking-form');
  const trackingInput  = document.getElementById('tracking-input');
  const trackingResult = document.getElementById('tracking-result');

  // Si alguno de los elementos no existe en la página, salir silenciosamente
  if (!trackingForm || !trackingInput || !trackingResult) return;

  trackingForm.addEventListener('submit', handleTrackingSubmit);

  function handleTrackingSubmit(e) {
    // Prevenir el comportamiento nativo del form (recarga de página)
    e.preventDefault();

    const code = trackingInput.value.trim().toUpperCase();
    const lang  = window.i18n ? window.i18n.getLang() : 'es';

    // Mostrar estado de carga
    showResult(`
      <p>
        <i class="fa-solid fa-spinner fa-spin"></i>
        ${window.i18n.t('tracking-searching', lang)} <strong>${escapeHtml(code)}</strong>...
      </p>
    `);

    // Simula latencia de red (800ms)
    // En producción: reemplazar por fetch('/api/tracking?code=' + code)
    setTimeout(() => {
      if (code.startsWith('ME-') && code.length >= 7) {
        showResult(buildFoundHtml(code, lang));
      } else {
        showResult(buildNotFoundHtml(lang));
      }
    }, 800);
  }

  // ─── Builders de HTML de resultado ────────────────────────────────────────

  function buildFoundHtml(code, lang) {
    const labelCode    = lang === 'es' ? 'Código'        : 'Code';
    const labelStatus  = lang === 'es' ? 'Estado Actual' : 'Current Status';
    const labelTransit = lang === 'es' ? 'EN TRÁNSITO'   : 'IN TRANSIT';

    return `
      <p style="color:#16a34a; font-weight:700; margin-bottom:8px;">
        <i class="fa-solid fa-circle-check"></i>
        ${window.i18n.t('tracking-found-title', lang)}
      </p>
      <p><strong>${labelCode}:</strong> ${escapeHtml(code)}</p>
      <p>
        <strong>${labelStatus}:</strong>
        <span style="background-color:var(--color-secondary);color:white;padding:2px 8px;
                     border-radius:4px;font-size:0.85rem;font-weight:bold;">
          ${labelTransit}
        </span>
      </p>
      <p style="margin-top:6px; font-size:0.9rem; color:var(--color-text-muted);">
        ${window.i18n.t('tracking-found-note', lang)}
      </p>
      <p style="margin-top:10px; font-size:0.8rem; color:var(--color-text-muted);
                border-top:1px solid #e2e8f0; padding-top:8px; opacity:0.75;">
        ${window.i18n.t('tracking-demo-note', lang)}
      </p>
    `;
  }

  function buildNotFoundHtml(lang) {
    return `
      <p style="color:#dc2626; font-weight:700;">
        <i class="fa-solid fa-circle-xmark"></i>
        ${window.i18n.t('tracking-notfound-title', lang)}
      </p>
      <p style="font-size:0.9rem; color:var(--color-text-muted); margin-top:4px;">
        ${window.i18n.t('tracking-notfound-note', lang)}
      </p>
    `;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * showResult(html)
   * Muestra la card de resultado con animación de entrada.
   */
  function showResult(html) {
    trackingResult.innerHTML = html;
    trackingResult.classList.remove('hidden');
    // Fuerza reflow para reiniciar la animación
    void trackingResult.offsetWidth;
    trackingResult.style.animation = 'fadeIn 0.3s ease-out forwards';
  }

  /**
   * escapeHtml(str)
   * Escapa caracteres especiales para evitar XSS al inyectar
   * el código del usuario en el HTML del resultado.
   */
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
