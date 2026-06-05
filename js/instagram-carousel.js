/**
 * js/instagram-carousel.js  (MEJORADO)
 * Hero banner full-width con las imágenes de Instagram.
 *
 * BUGS CORREGIDOS vs versión anterior:
 *  1. Entrada de Colombia tenía `label: "Envios para Colombia"` (string plano)
 *     en vez de `label: {es: "...", en: "..."}` — causaba `undefined` en inglés.
 *     → Todas las entradas ahora usan el objeto `{es, en}` consistentemente.
 *
 *  2. El carousel escuchaba el cambio de idioma vía `langToggle.addEventListener('change',...)`
 *     acoplándolo directamente al select del header. Ahora escucha el CustomEvent
 *     'langchange' que dispara `window.i18n.setLang()` — desacoplado.
 *
 *  3. Acceso directo a `localStorage.getItem('site-lang')` reemplazado por
 *     `window.i18n.getLang()` para consistencia de idioma.
 */

// ─── DATOS ──────────────────────────────────────────────────────────────────
// REGLA: Todas las entradas DEBEN tener `label` como objeto {es, en}.
// Si solo tienes un idioma, repite el texto: {es: "Texto", en: "Texto"}.
const INSTA_POSTS = [
  {
    src:   "{css,js}/insta1.png",
    label: { es: "Envíos para México",      en: "Shipping to Mexico" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "{css,js}/insta2.png",
    label: { es: "Envíos para Honduras",    en: "Shipping to Honduras" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "{css,js}/NY-HOND.JPG",
    label: { es: "Envíos desde New York",   en: "Shipping from New York" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "{css,js}/promocion-envioMX.jpg",
    label: { es: "Envíos para El Salvador", en: "Shipping to El Salvador" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "{css,js}/insta5.png",
    label: { es: "Envíos para Guatemala",   en: "Shipping to Guatemala" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "{css,js}/colombia-promo.png",
    // BUG CORREGIDO: antes era `label: "Envios para Colombia"` (string plano)
    label: { es: "Envíos para Colombia",    en: "Shipping to Colombia" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  }
];

// ─── CONSTANTES ──────────────────────────────────────────────────────────────
const AUTO_PLAY_INTERVAL  = 5000;  // ms entre slides
const TRANSITION_DURATION = 600;   // ms — debe coincidir con CSS

// ─── ESTADO INTERNO ──────────────────────────────────────────────────────────
let currentIndex    = 0;
let autoPlayTimer   = null;
let isTransitioning = false;

// ─── CONSTRUCCIÓN DEL HTML ────────────────────────────────────────────────────
function buildBanner() {
  const container = document.getElementById("insta-hero-banner");
  if (!container) return;

  // Idioma inicial desde window.i18n (corregido: antes era localStorage directo)
  const currentLang = window.i18n ? window.i18n.getLang() : 'es';

  container.innerHTML = `
    <div class="ihb-slider" id="ihb-slider"
         aria-label="${currentLang === 'es' ? 'Anuncios Mi Envío Cargo Express' : 'Mi Envío Cargo Express Announcements'}"
         role="region">

      <div class="ihb-track" id="ihb-track">
        ${INSTA_POSTS.map((post, i) => {
          const text = post.label[currentLang] || post.label['es'];
          return `
            <a
              class="ihb-slide ${i === 0 ? 'ihb-slide--active' : ''}"
              href="${post.href}"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="${text}"
              data-index="${i}"
              tabindex="${i === 0 ? '0' : '-1'}"
            >
              <div class="ihb-slide__bg" style="background-image: url('${post.src}')"></div>
              <img
                src="${post.src}"
                alt="${text}"
                class="ihb-slide__img"
                loading="${i === 0 ? 'eager' : 'lazy'}"
                draggable="false"
              />
              <div class="ihb-slide__overlay">
                <span class="ihb-slide__label" data-insta-idx="${i}">${text}</span>
              </div>
            </a>
          `;
        }).join("")}
      </div>

      <button class="ihb-arrow ihb-arrow--prev" id="ihb-prev" aria-label="${currentLang === 'es' ? 'Slide anterior' : 'Previous slide'}" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <button class="ihb-arrow ihb-arrow--next" id="ihb-next" aria-label="${currentLang === 'es' ? 'Siguiente slide' : 'Next slide'}" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <div class="ihb-dots" id="ihb-dots" role="tablist"
           aria-label="${currentLang === 'es' ? 'Navegar slides' : 'Navigate slides'}">
        ${INSTA_POSTS.map((_, i) => `
          <button
            class="ihb-dot ${i === 0 ? 'ihb-dot--active' : ''}"
            data-index="${i}"
            role="tab"
            aria-selected="${i === 0 ? 'true' : 'false'}"
            aria-label="${currentLang === 'es' ? 'Slide' : 'Slide'} ${i + 1}"
            type="button"
          ></button>
        `).join("")}
      </div>

      <div class="ihb-progress" id="ihb-progress">
        <div class="ihb-progress__bar" id="ihb-progress-bar"></div>
      </div>
    </div>
  `;

  attachEvents();
  startAutoPlay();
  listenForLangChange();
}

// ─── ESCUCHA DE CAMBIO DE IDIOMA (desacoplado) ──────────────────────────────
/**
 * listenForLangChange()
 * En vez de acoplarse al <select> directamente, escucha el CustomEvent 'langchange'
 * que dispara window.i18n.setLang(). Esto desacopla el carrusel del header.
 */
function listenForLangChange() {
  document.addEventListener('langchange', (e) => {
    const newLang = e.detail?.lang || 'es';
    updateLabels(newLang);
  });
}

/**
 * updateLabels(lang)
 * Actualiza los textos visibles y atributos de accesibilidad del carrusel.
 */
function updateLabels(lang) {
  document.querySelectorAll('.ihb-slide__label').forEach(span => {
    const idx = parseInt(span.getAttribute('data-insta-idx'), 10);
    if (!isNaN(idx) && INSTA_POSTS[idx]) {
      span.textContent = INSTA_POSTS[idx].label[lang] || INSTA_POSTS[idx].label['es'];
    }
  });

  document.querySelectorAll('.ihb-slide').forEach(slide => {
    const idx = parseInt(slide.getAttribute('data-index'), 10);
    if (!isNaN(idx) && INSTA_POSTS[idx]) {
      const text = INSTA_POSTS[idx].label[lang] || INSTA_POSTS[idx].label['es'];
      slide.setAttribute('aria-label', text);
      const img = slide.querySelector('.ihb-slide__img');
      if (img) img.alt = text;
    }
  });
}

// ─── NAVEGACIÓN ───────────────────────────────────────────────────────────────
function goTo(index) {
  if (isTransitioning) return;
  if (index === currentIndex) return;

  const total = INSTA_POSTS.length;
  const next  = ((index % total) + total) % total;

  isTransitioning = true;

  const slides = document.querySelectorAll(".ihb-slide");
  const dots   = document.querySelectorAll(".ihb-dot");

  slides[currentIndex].classList.remove("ihb-slide--active");
  slides[currentIndex].setAttribute("tabindex", "-1");
  dots[currentIndex].classList.remove("ihb-dot--active");
  dots[currentIndex].setAttribute("aria-selected", "false");

  currentIndex = next;

  slides[currentIndex].classList.add("ihb-slide--active");
  slides[currentIndex].setAttribute("tabindex", "0");
  dots[currentIndex].classList.add("ihb-dot--active");
  dots[currentIndex].setAttribute("aria-selected", "true");

  resetProgressBar();
  setTimeout(() => { isTransitioning = false; }, TRANSITION_DURATION);
}

function goNext() { goTo(currentIndex + 1); }
function goPrev() { goTo(currentIndex - 1); }

// ─── AUTO-PLAY ────────────────────────────────────────────────────────────────
function startAutoPlay() {
  stopAutoPlay();
  autoPlayTimer = setInterval(goNext, AUTO_PLAY_INTERVAL);
  animateProgressBar();
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

function resetProgressBar() {
  const bar = document.getElementById("ihb-progress-bar");
  if (!bar) return;
  bar.classList.remove("ihb-progress__bar--running");
  void bar.offsetWidth; // Fuerza reflow
  bar.classList.add("ihb-progress__bar--running");
}

function animateProgressBar() {
  const bar = document.getElementById("ihb-progress-bar");
  if (bar) bar.classList.add("ihb-progress__bar--running");
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// ─── EVENTOS ─────────────────────────────────────────────────────────────────
function attachEvents() {
  const slider        = document.getElementById("ihb-slider");
  const prevBtn       = document.getElementById("ihb-prev");
  const nextBtn       = document.getElementById("ihb-next");
  const dotsContainer = document.getElementById("ihb-dots");

  if (!slider || !prevBtn || !nextBtn || !dotsContainer) return;

  prevBtn.addEventListener("click", (e) => { e.preventDefault(); goPrev(); restartAutoPlay(); });
  nextBtn.addEventListener("click", (e) => { e.preventDefault(); goNext(); restartAutoPlay(); });

  dotsContainer.addEventListener("click", (e) => {
    const dot = e.target.closest(".ihb-dot");
    if (!dot) return;
    goTo(parseInt(dot.dataset.index, 10));
    restartAutoPlay();
  });

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);
  slider.addEventListener("focusin",    stopAutoPlay);
  slider.addEventListener("focusout",   (e) => {
    if (!slider.contains(e.relatedTarget)) startAutoPlay();
  });

  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  { goPrev(); restartAutoPlay(); }
    if (e.key === "ArrowRight") { goNext(); restartAutoPlay(); }
  });

  // Swipe táctil
  let touchStartX = 0;
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
    stopAutoPlay();
  }, { passive: true });

  slider.addEventListener("touchend", (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) delta > 0 ? goNext() : goPrev();
    startAutoPlay();
  }, { passive: true });
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", buildBanner);
} else {
  buildBanner();
}
