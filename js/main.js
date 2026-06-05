/**
 * js/main.js  (REFACTORIZADO)
 * Orquestador principal del sitio.
 *
 * ANTES: ~280 líneas con tracking + calculadora + i18n + menú + año + ads mezclados.
 * AHORA: ~80 líneas que solo inicializa y delega en módulos especializados:
 *
 *   js/i18n.js          → traducciones (window.i18n)
 *   js/tracking.js      → lógica de rastreo
 *   js/calculator.js    → calculadora de flete
 *   js/contact-form.js  → formulario de contacto con submit real
 *
 * Este archivo solo maneja:
 *   1. AOS (librería de scroll animations)
 *   2. Menú móvil hamburger
 *   3. Selector de idioma
 *   4. Año del footer
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 0. INICIALIZAR TRADUCCIONES ─────────────────────────────────────────
  // window.i18n lo provee js/i18n.js (cargado antes en el HTML)
  if (window.i18n) {
    window.i18n.apply(window.i18n.getLang());
  }

  // ─── 1. AOS — Animate On Scroll ──────────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,          // Ligeramente más rápido (era 800)
      easing:   'ease-out-cubic',
      once:     true,         // Solo anima una vez por elemento
      offset:   100,          // Más responsivo (era 120)
    });
  }

  // ─── 2. MENÚ MÓVIL ───────────────────────────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mainMenu   = document.getElementById('main-menu');

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Cierra el menú al hacer clic en un enlace interno
    mainMenu.querySelectorAll('.header__menu-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 992) closeMobileMenu();
      });
    });

    // Cierra el menú al hacer resize a desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) closeMobileMenu();
    });
  }

  function toggleMobileMenu() {
    const isHidden = mainMenu.classList.contains('hidden');
    isHidden ? openMobileMenu() : closeMobileMenu();
  }

  function openMobileMenu() {
    mainMenu.classList.remove('hidden');
    Object.assign(mainMenu.style, {
      display:         'flex',
      flexDirection:   'column',
      position:        'absolute',
      top:             '100%',
      left:            '0',
      width:           '100%',
      backgroundColor: 'var(--color-primary)',
      padding:         '20px',
      boxShadow:       'var(--shadow-lg)',
      borderBottom:    '4px solid var(--color-secondary)',
      animation:       'fadeInDown 0.3s ease-out forwards',
      zIndex:          '999',
    });
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mainMenu.classList.add('hidden');
    mainMenu.removeAttribute('style');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // ─── 3. SELECTOR DE IDIOMA ───────────────────────────────────────────────
  const langToggle = document.getElementById('language-toggle');
  if (langToggle && window.i18n) {
    // Sincronizar el <select> con el idioma activo
    langToggle.value = window.i18n.getLang();

    langToggle.addEventListener('change', (e) => {
      window.i18n.setLang(e.target.value);
      // window.i18n.setLang() dispara el CustomEvent 'langchange'
      // que instagram-carousel.js ya escucha para actualizar sus labels
    });
  }

  // ─── 4. AÑO DEL FOOTER ───────────────────────────────────────────────────
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});
