# 📦 Mi Envío Cargo Express — Sitio Web Corporativo

Sitio web estático para **Mi Envío Cargo Express**, empresa de courier y carga internacional con sede en Brooklyn, NY. Desarrollado con HTML, CSS vanilla y JavaScript modular, sin frameworks ni dependencias de build.

---

## 🗂️ Estructura del proyecto

```
envio/
├── index.html
├── css/
│   ├── base.css              # Variables globales, componentes y responsive
│   └── instagram.css         # Estilos del hero banner / carrusel
└── js/
    ├── i18n.js               # Módulo de internacionalización (ES / EN)
    ├── main.js               # Orquestador: AOS, menú móvil, selector de idioma
    ├── tracking.js           # Módulo de rastreo de paquetes
    ├── calculator.js         # Calculadora de flete interactiva
    ├── contact-form.js       # Formulario de contacto con validación y Formspree
    └── instagram-carousel.js # Hero banner full-width con carrusel automático
```

---

## ✨ Funcionalidades

| Módulo | Descripción |
|---|---|
| **Hero Banner** | Carrusel full-width de imágenes promocionales con autoplay, swipe táctil y barra de progreso |
| **Rastreo** | Simulación de rastreo por código (prefijo `ME-`) con estados y feedback visual |
| **Calculadora** | Estimado de flete por peso (lbs) para envío aéreo ($4.25/lb) y marítimo ($2.00/lb) |
| **Formulario** | Contacto con validación, integración a Formspree y feedback de éxito/error |
| **i18n** | Cambio dinámico ES ↔ EN con persistencia en `localStorage` |
| **Sucursales** | Cards animadas de las 3 oficinas: Brooklyn, Charlotte y Chicago |

---

## 🚀 Uso

No requiere instalación. Abre `index.html` directamente en el navegador o sírvelo con cualquier servidor estático:

```bash
# Con Python
python -m http.server 8080

# Con Node (npx)
npx serve .
```

---

## 🌐 Dependencias externas (CDN)

- [Font Awesome 6.4](https://fontawesome.com/) — íconos
- [AOS 2.3.1](https://michaeledits.com/aos/) — animaciones al hacer scroll
- [Google Fonts](https://fonts.google.com/) — Poppins (headings) y Rubik (body)
- [Formspree](https://formspree.io/) — backend del formulario de contacto

---

## 🌍 Internacionalización

El módulo `js/i18n.js` expone `window.i18n` con los métodos:

```js
window.i18n.getLang()        // Idioma activo ('es' | 'en')
window.i18n.t('key')         // Traducción por clave
window.i18n.setLang('en')    // Cambiar idioma (persiste en localStorage)
window.i18n.apply('en')      // Aplica traducciones al DOM
```

El cambio de idioma dispara el `CustomEvent` `'langchange'` que el carrusel escucha para actualizar sus etiquetas sin acoplamiento directo al header.

---

## 🎨 Paleta de colores

| Variable | Hex | Uso |
|---|---|---|
| `--color-primary` | `#0f172a` | Azul marino — fondos, header, footer |
| `--color-primary-light` | `#1e3a8a` | Azul corporativo — acentos |
| `--color-secondary` | `#ff6b00` | Naranja — botones CTA, bordes activos |

---

## 📍 Sucursales

- **Brooklyn, NY** — 4512 3rd Ave, Brooklyn, NY 11220 · (347) 495-1341
- **Charlotte, NC** — 3137 Amity Ct, Suite 300, Charlotte, NC 28215
- **Chicago, IL** — 3441 W 26th Street, Chicago, IL 60623

Horario general: Lun–Vie 9:00 AM–6:00 PM | Sáb 9:00 AM–2:00 PM

---

## 📱 Redes sociales

- Instagram: [@mienviocargoexpress](https://www.instagram.com/mienviocargoexpress/)
- Facebook: [@mienviocargoexpress](https://www.facebook.com/mienviocargoexpress/)

---

## 🔧 Configuración del formulario (Formspree)

El endpoint actual está en `js/contact-form.js`. Para cambiar el destino de los mensajes:

```js
// Busca esta línea y reemplaza el ID de Formspree
const response = await fetch('https://formspree.io/f/xeewekwa', { ... });
```

Crea tu propio endpoint gratuito en [formspree.io](https://formspree.io).

---

## 🧩 Notas de desarrollo

- El orden de carga de scripts en `index.html` es importante: `i18n.js` debe ir antes que `main.js` y `instagram-carousel.js`.
- El sistema de rastreo es una **simulación de demostración**. En producción, reemplazar el `setTimeout` en `tracking.js` por una llamada real a `/api/tracking`.
- Las tarifas de la calculadora están definidas como constantes en `calculator.js` (`TARIFAS`).