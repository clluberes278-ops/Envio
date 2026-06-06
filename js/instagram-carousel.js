/**
 * js/instagram-carousel.js
 * Hero banner full-width con imagenes promocionales.
 */

const INSTA_POSTS = [
  {
    src:   "img/ecuador-promo.jpg",
    label: { es: "Envios a Ecuador — Caja 18x18x28 sin limite de peso $375", en: "Shipping to Ecuador — Box 18x18x28 no weight limit $375" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "img/mexico-centroamerica.jpg",
    label: { es: "Envios a Mexico y Centroamerica", en: "Shipping to Mexico and Central America" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "img/ny-honduras.jpg",
    label: { es: "Envios desde Nueva York a Honduras", en: "Shipping from New York to Honduras" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "img/mexico-2cajas.jpg",
    label: { es: "2 cajas 22x22x22 a Mexico por $370", en: "2 boxes 22x22x22 to Mexico for $370" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "img/brooklyn-3x3.jpg",
    label: { es: "3x3 — 3 cajas 18x18x18 por $300 solo en Brooklyn", en: "3x3 — 3 boxes 18x18x18 for $300 Brooklyn only" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  },
  {
    src:   "img/promocion-mexico.jpg",
    label: { es: "Super promocion — caja 22x22x22 + 18x18x18 gratis", en: "Super promo — box 22x22x22 + 18x18x18 free" },
    href:  "https://www.instagram.com/mienviocargoexpress/"
  }
];

const AUTO_PLAY_INTERVAL  = 5000;
const TRANSITION_DURATION = 600;

let currentIndex    = 0;
let autoPlayTimer   = null;
let isTransitioning = false;

function buildBanner() {
  const container = document.getElementById("insta-hero-banner");
  if (!container) return;

  const currentLang = window.i18n ? window.i18n.getLang() : 'es';

  container.innerHTML = `
    <div class="ihb-slider" id="ihb-slider"
         aria-label="${currentLang === 'es' ? 'Anuncios Mi Envio Cargo Express' : 'Mi Envio Cargo Express Announcements'}"
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
            aria-label="Slide ${i + 1}"
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

function listenForLangChange() {
  document.addEventListener('langchange', (e) => {
    updateLabels(e.detail?.lang || 'es');
  });
}

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
  void bar.offsetWidth;
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", buildBanner);
} else {
  buildBanner();
}