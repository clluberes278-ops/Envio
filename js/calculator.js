/**
 * js/calculator.js
 * Módulo de calculadora de flete.
 * Separado de main.js para responsabilidad única.
 *
 * MEJORAS vs versión anterior:
 *  - Muestra el desglose del cálculo (peso × tarifa = total)
 *  - Indica claramente qué NO está incluido (ITBIS, aduanas)
 *  - Validación con feedback visual en el input (border rojo) en lugar de alert()
 *  - Usa window.i18n en vez de acceso directo al dict
 */

document.addEventListener('DOMContentLoaded', () => {
  const btnCalcular   = document.getElementById('btn-calcular');
  const inputPeso     = document.getElementById('calc-peso');
  const selectTipo    = document.getElementById('calc-tipo');
  const labelTotal    = document.getElementById('calc-total');
  const calcResultBox = document.getElementById('calc-result');
  const calcBreakdown = document.getElementById('calc-breakdown');

  // Si alguno de los elementos no existe, salir silenciosamente
  if (!btnCalcular || !inputPeso || !selectTipo || !labelTotal || !calcResultBox) return;

  // Tarifas por modalidad (USD por libra)
  const TARIFAS = {
    aereo:    4.25,
    maritimo: 2.00
  };

  btnCalcular.addEventListener('click', handleCalculate);

  // También calcular cuando cambia el tipo de envío o el peso (UX mejorada)
  selectTipo.addEventListener('change', () => {
    if (!calcResultBox.classList.contains('hidden')) handleCalculate();
  });

  inputPeso.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCalculate();
  });

  function handleCalculate() {
    const lang   = window.i18n ? window.i18n.getLang() : 'es';
    const peso   = parseFloat(inputPeso.value);
    const tipo   = selectTipo.value;

    // ── Validación con feedback visual ──────────────────────────────────────
    if (isNaN(peso) || peso <= 0) {
      // Borde rojo temporal en el input — no alert()
      inputPeso.style.borderColor = '#dc2626';
      inputPeso.style.boxShadow   = '0 0 0 4px rgba(220,38,38,0.1)';
      inputPeso.focus();

      // Restaura el estilo después de 2 segundos
      setTimeout(() => {
        inputPeso.style.borderColor = '';
        inputPeso.style.boxShadow   = '';
      }, 2000);

      return;
    }

    // ── Cálculo ──────────────────────────────────────────────────────────────
    const tarifa = TARIFAS[tipo] ?? TARIFAS.aereo;
    const total  = peso * tarifa;

    // ── Construir textos de desglose ─────────────────────────────────────────
    const pesoLabel   = peso === 1 ? '1 lb' : `${peso} lbs`;
    const tarifaLabel = `$${tarifa.toFixed(2)}/lb`;
    const notaLabel   = lang === 'es'
      ? '* No incluye ITBIS ni impuestos aduanales.'
      : '* Does not include taxes or customs duties.';

    // ── Mostrar resultado ────────────────────────────────────────────────────
    calcResultBox.classList.remove('hidden');
    calcResultBox.style.animation = 'fadeInDown 0.5s ease-out forwards';

    // Animación de "número cambiando"
    labelTotal.style.transform = 'scale(1.1)';
    labelTotal.style.color     = 'var(--color-primary-light)';

    setTimeout(() => {
      labelTotal.textContent     = `USD $${total.toFixed(2)}`;
      labelTotal.style.transform = 'scale(1)';
      labelTotal.style.color     = 'var(--color-secondary)';
    }, 150);

    // Inyectar el desglose si existe el elemento en el DOM
    if (calcBreakdown) {
      calcBreakdown.innerHTML = `
        <small style="display:block; margin-top:8px; color:var(--color-text-muted); font-size:0.82rem;">
          ${pesoLabel} × ${tarifaLabel} = <strong>USD $${total.toFixed(2)}</strong>
          <br>${notaLabel}
        </small>
      `;
    }
  }
});
