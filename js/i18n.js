/**
 * js/i18n.js
 * Módulo de internacionalización (ES / EN).
 * Separado de main.js para mantener responsabilidades únicas.
 *
 * USO:
 *   import { applyTranslations, getCurrentLang } from './i18n.js';
 *   — o simplemente incluir antes de main.js con <script src="js/i18n.js">
 *
 * EXPORTS (en window.i18n para compatibilidad con scripts no-module):
 *   window.i18n.apply(lang)        → aplica todas las traducciones al DOM
 *   window.i18n.getLang()          → devuelve el idioma activo ('es' | 'en')
 *   window.i18n.t(key)             → devuelve la traducción de una key
 *   window.i18n.setLang(lang)      → persiste y aplica un nuevo idioma
 */

// ─── DICCIONARIO ──────────────────────────────────────────────────────────────
// Definido fuera de cualquier función para no recrearse en cada llamada.
const DICT = {
  es: {
    // Navegación
    "menu-como":          "¿Cómo funciona?",
    "menu-calc":          "Calculadora",
    "menu-serv":          "Servicios",
    "menu-suc":           "Sucursales",

    // Hero
    "hero-badge":         "Envíos rápidos y seguros",
    "hero-title":         "Tus compras del mundo en tus manos",
    "hero-desc":          "Trae tus paquetes desde Estados Unidos y el mundo con la tarifa más competitiva, seguridad garantizada y atención personalizada.",

    // Tracking
    "tracking-title":         "Rastrea tu Paquete",
    "tracking-placeholder":   "Ej: ME-10245",
    "tracking-search":        "Buscar",
    "tracking-searching":     "Buscando guía comercial",
    "tracking-found-title":   "¡Paquete Encontrado!",
    "tracking-found-note":    "El paquete salió de nuestro almacén en Miami y se encuentra en vuelo hacia Santo Domingo, RD.",
    "tracking-notfound-title":"No se encontró el número de guía",
    "tracking-notfound-note": "Asegúrate de que empiece con el prefijo corporativo, por ejemplo: ME-10245.",
    "tracking-demo-note":     "⚠️ Sistema de demostración — los resultados son simulados.",

    // Calculadora
    "calc-title":         "Calcula el costo de tu envío",
    "calc-subtitle":      "Evita sorpresas. Con nuestra calculadora interactiva puedes estimar el costo del flete de tus paquetes según su peso en libras.",
    "calc-note-strong":   "Nota:",
    "calc-note":          "Esta tarifa es un estimado basado en el transporte aéreo regular. No incluye impuestos aduanales para artículos mayores a US$200.",
    "calc-tipo-label":    "Tipo de Envío",
    "calc-peso-label":    "Peso en Libras (Lbs)",
    "calc-tipo-aereo":    "Aéreo Regular (Courier)",
    "calc-tipo-maritimo": "Carga Marítima",
    "calc-button":        "Calcular Tarifa",
    "calc-result-label":  "Total Estimado Flete:",
    "calc-breakdown":     "Desglose:",
    "invalid-weight":     "Por favor, introduce un peso válido mayor a 0.",

    // Pasos
    "steps-title":        "Traer tus paquetes es así de fácil",
    "steps-subtitle":     "Sigue estos tres sencillos pasos para empezar a recibir tus compras en República Dominicana.",
    "step1-title":        "Regístrate Gratis",
    "step1-desc":         "Crea tu cuenta en minutos para obtener tu código de cliente único y nuestra dirección de almacén en Miami.",
    "step2-title":        "Compra en Línea",
    "step2-desc":         "Compra en Amazon, eBay o tu tienda favorita y usa tu dirección de Miami junto a tu código de cliente al hacer el checkout.",
    "step3-title":        "Recibe y Disfruta",
    "step3-desc":         "Te notificaremos cuando tus paquetes lleguen. Retíralos en nuestra sucursal o solicita nuestro servicio a domicilio.",
    "steps-cta":          "¿Listo para comenzar? Regístrate ahora y obtén tu dirección en Miami",
    "steps-signup-btn":   "Registrarse Gratis",

    // Servicios
    "serv-title":         "Soluciones Logísticas a tu Medida",
    "serv-subtitle":      "Ofrecemos una variedad de servicios de transporte adaptados a tus necesidades personales o comerciales.",
    "serv-c1-title":      "Courier Aéreo",
    "serv-c1-desc":       "Tus compras personales de internet traídas de forma rápida, eficiente y segura directo desde Miami.",
    "serv-c2-title":      "Carga Marítima",
    "serv-c2-desc":       "La opción ideal y más económica para mercancías de gran volumen, cajas pesadas y mudanzas.",
    "serv-c3-title":      "Logística Empresarial",
    "serv-c3-desc":       "Manejo de carga comercial, asesoría aduanal corporativa y distribución eficiente para tu negocio.",

    // Sucursales
    "suc-title":          "Nuestras Oficinas",
    "suc-subtitle":       "Nuestra sede central de recepción en Estados Unidos y puntos de entrega.",
    "suc-schedule":       "Horario:",
    "suc-days":           "Lun–Vie 9:00 AM–6:00 PM | Sáb 9:00 AM–2:00 PM",

    // Formulario
    "form-title":         "Escríbenos",
    "form-name":          "Tu Nombre",
    "form-name-ph":       "Nombre completo",
    "form-email":         "Tu Correo",
    "form-email-ph":      "correo@ejemplo.com",
    "form-msg":           "Mensaje",
    "form-msg-ph":        "¿En qué podemos ayudarte respecto a tus paquetes?",
    "form-btn":           "Enviar Mensaje",
    "form-success":       "✅ ¡Mensaje enviado! Te contactaremos pronto.",
    "form-error":         "❌ Ocurrió un error. Por favor intenta de nuevo.",

    // Footer
    "footer-desc":        "Tu aliado estratégico en transporte de carga y courier internacional. Llevamos confianza a cada destino.",
    "footer-links":       "Enlaces",
    "footer-social":      "Síguenos en Redes",
    "footer-social-desc": "Mantente al tanto de ofertas, estados de vuelos y novedades de aduanas.",
    "footer-rights":      "Todos los derechos reservados.",
  },

  en: {
    // Navegación
    "menu-como":          "How it works?",
    "menu-calc":          "Calculator",
    "menu-serv":          "Services",
    "menu-suc":           "Branches",

    // Hero
    "hero-badge":         "Fast and secure shipping",
    "hero-title":         "Your purchases from around the world at your doorstep",
    "hero-desc":          "Bring your packages from the US and the world with the most competitive rate, guaranteed security, and personalized service.",

    // Tracking
    "tracking-title":         "Track Your Package",
    "tracking-placeholder":   "Ex: ME-10245",
    "tracking-search":        "Search",
    "tracking-searching":     "Searching for tracking",
    "tracking-found-title":   "Package Found!",
    "tracking-found-note":    "The package left our Miami warehouse and is currently en route to Santo Domingo, DR.",
    "tracking-notfound-title":"Tracking number not found",
    "tracking-notfound-note": "Make sure it starts with the corporate prefix, for example: ME-10245.",
    "tracking-demo-note":     "⚠️ Demo system — results are simulated.",

    // Calculadora
    "calc-title":         "Estimate your shipping cost",
    "calc-subtitle":      "Avoid surprises. Use our interactive calculator to estimate freight cost based on package weight in pounds.",
    "calc-note-strong":   "Note:",
    "calc-note":          "This rate is an estimate based on regular air transport. Customs taxes are not included for items over US$200.",
    "calc-tipo-label":    "Shipping Type",
    "calc-peso-label":    "Weight in Pounds (Lbs)",
    "calc-tipo-aereo":    "Air Shipping (Courier)",
    "calc-tipo-maritimo": "Sea Freight",
    "calc-button":        "Calculate Rate",
    "calc-result-label":  "Estimated Shipping Cost:",
    "calc-breakdown":     "Breakdown:",
    "invalid-weight":     "Please enter a valid weight greater than 0.",

    // Pasos
    "steps-title":        "Getting your packages is this easy",
    "steps-subtitle":     "Follow these three simple steps to start receiving your purchases in the Dominican Republic.",
    "step1-title":        "Sign Up Free",
    "step1-desc":         "Create your account in minutes to get your unique customer code and our warehouse address in Miami.",
    "step2-title":        "Shop Online",
    "step2-desc":         "Shop on Amazon, eBay or your favorite store and use your Miami address with your customer code at checkout.",
    "step3-title":        "Receive and Enjoy",
    "step3-desc":         "We'll notify you when your packages arrive. Pick them up at our branch or request our home delivery service.",
    "steps-cta":          "Ready to get started? Sign up now and get your Miami address",
    "steps-signup-btn":   "Sign Up Free",

    // Servicios
    "serv-title":         "Tailored Logistics Solutions",
    "serv-subtitle":      "We offer a variety of transport services adapted to your personal or commercial needs.",
    "serv-c1-title":      "Air Courier",
    "serv-c1-desc":       "Your personal internet purchases brought quickly, efficiently, and safely straight from Miami.",
    "serv-c2-title":      "Sea Freight",
    "serv-c2-desc":       "The ideal and most economical option for large volume cargo, heavy boxes, and moving.",
    "serv-c3-title":      "Business Logistics",
    "serv-c3-desc":       "Commercial cargo management, corporate customs advice, and efficient distribution for your business.",

    // Sucursales
    "suc-title":          "Our Offices",
    "suc-subtitle":       "Our main reception headquarters in the United States and delivery points.",
    "suc-schedule":       "Schedule:",
    "suc-days":           "Mon–Fri 9:00 AM–6:00 PM | Sat 9:00 AM–2:00 PM",

    // Formulario
    "form-title":         "Write Us",
    "form-name":          "Your Name",
    "form-name-ph":       "Full name",
    "form-email":         "Your Email",
    "form-email-ph":      "email@example.com",
    "form-msg":           "Message",
    "form-msg-ph":        "How can we help you regarding your packages?",
    "form-btn":           "Send Message",
    "form-success":       "✅ Message sent! We'll be in touch soon.",
    "form-error":         "❌ An error occurred. Please try again.",

    // Footer
    "footer-desc":        "Your strategic partner in cargo transport and international courier. We bring trust to every destination.",
    "footer-links":       "Links",
    "footer-social":      "Follow Us",
    "footer-social-desc": "Stay updated on offers, flight statuses, and customs news.",
    "footer-rights":      "All rights reserved.",
  }
};

// ─── MÓDULO i18n ──────────────────────────────────────────────────────────────
const i18n = (() => {
  /**
   * getLang()
   * Determina el idioma activo con orden de prioridad:
   *   1. localStorage (preferencia guardada del usuario)
   *   2. navigator.language (idioma del navegador)
   *   3. 'es' como fallback por defecto
   */
  function getLang() {
    const saved = localStorage.getItem('site-lang');
    if (saved && DICT[saved]) return saved;

    const browserLang = (navigator.language || '').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';

    return 'es';
  }

  /**
   * t(key, lang?)
   * Devuelve la traducción de una key.
   * Si no se especifica lang, usa el idioma activo.
   * Si la key no existe, devuelve la key misma (fail-safe visible en dev).
   */
  function t(key, lang) {
    const activeLang = lang || getLang();
    return (DICT[activeLang] && DICT[activeLang][key]) || key;
  }

  /**
   * apply(lang)
   * Recorre el DOM y aplica todas las traducciones:
   *   - [data-i18n]             → textContent
   *   - [data-i18n-placeholder] → placeholder
   *   - [data-i18n-option]      → textContent de <option>
   * También actualiza el atributo lang del <html>.
   */
  function apply(lang) {
    const activeLang = lang || getLang();

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = DICT[activeLang]?.[key];
      if (translation) el.textContent = translation;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = DICT[activeLang]?.[key];
      if (translation) el.placeholder = translation;
    });

    document.querySelectorAll('[data-i18n-option]').forEach(opt => {
      const key = opt.getAttribute('data-i18n-option');
      const translation = DICT[activeLang]?.[key];
      if (translation) opt.textContent = translation;
    });

    document.documentElement.lang = activeLang;
  }

  /**
   * setLang(lang)
   * Persiste el idioma en localStorage y aplica las traducciones.
   * Dispara un CustomEvent 'langchange' para que otros módulos reaccionen
   * (p.ej. instagram-carousel.js).
   */
  function setLang(lang) {
    if (!DICT[lang]) {
      console.warn(`[i18n] Idioma "${lang}" no encontrado en el diccionario.`);
      return;
    }
    localStorage.setItem('site-lang', lang);
    apply(lang);

    // Notifica al resto de los módulos del cambio de idioma
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  return { getLang, t, apply, setLang };
})();

// Expone en window para que los otros scripts lo consuman sin módulos ES
window.i18n = i18n;
