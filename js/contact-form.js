/**
 * js/contact-form.js
 * Módulo del formulario de contacto.
 *
 * PROBLEMA CORREGIDO:
 *   La versión anterior usaba un <form> HTML sin preventDefault(),
 *   lo que causaba recarga de página al hacer submit — el mensaje
 *   nunca se enviaba y no había feedback para el usuario.
 *
 * SOLUCIÓN:
 *   - preventDefault() en el submit
 *   - Validación de campos antes de enviar
 *   - Feedback visual de éxito/error al usuario
 *   - Estado de "enviando..." durante el proceso
 *   - Listo para conectar a un backend real (Formspree, EmailJS, etc.)
 *
 * PARA CONECTAR A UN BACKEND REAL:
 *   Busca el comentario "TODO: REEMPLAZAR" y sigue las instrucciones.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contacto__form');
  if (!form) return;

  form.addEventListener('submit', handleContactSubmit);

  async function handleContactSubmit(e) {
    // ① Prevenir la recarga nativa del navegador — este era el bug principal
    e.preventDefault();

    const lang = window.i18n ? window.i18n.getLang() : 'es';

    // ② Recoger valores de los campos
    const nameInput    = form.querySelector('input[type="text"]');
    const emailInput   = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');
    const submitBtn    = form.querySelector('button[type="submit"]');

    // ③ Validación básica
    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
      highlightEmptyFields([nameInput, emailInput, messageInput]);
      return;
    }

    if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput);
      return;
    }

    // ④ Estado de "enviando"
    const originalText = submitBtn.textContent;
    submitBtn.disabled    = true;
    submitBtn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...';
    submitBtn.style.opacity = '0.7';

    try {
      const response = await fetch('https://formspree.io/f/xeewekwa', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim()
      })
    });

    if (!response.ok) throw new Error('Formspree error');

      // Simulación de envío (2 segundos) — REMOVER cuando conectes el backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // ⑤ Éxito: limpiar formulario y mostrar mensaje
      form.reset();
      showFeedback(form, window.i18n.t('form-success', lang), 'success');

    } catch (err) {
      console.error('[contact-form] Error al enviar:', err);
      showFeedback(form, window.i18n.t('form-error', lang), 'error');

    } finally {
      // ⑥ Restaurar el botón siempre, sin importar si hubo error
      submitBtn.disabled    = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * highlightEmptyFields(fields)
   * Resalta en rojo los campos que están vacíos.
   */
  function highlightEmptyFields(fields) {
    fields.forEach(field => {
      if (field && !field.value.trim()) {
        setFieldError(field);
      }
    });
    // Hace foco en el primer campo vacío
    const first = fields.find(f => f && !f.value.trim());
    first?.focus();
  }

  /**
   * setFieldError(field)
   * Aplica estilo de error al campo y lo limpia al corregirlo.
   */
  function setFieldError(field) {
    field.style.borderColor = '#dc2626';
    field.style.boxShadow   = '0 0 0 4px rgba(220,38,38,0.1)';

    const cleanup = () => {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
      field.removeEventListener('input', cleanup);
    };
    field.addEventListener('input', cleanup);
  }

  /**
   * isValidEmail(email)
   * Valida formato de email con regex estándar.
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /**
   * showFeedback(form, message, type)
   * Muestra un mensaje de éxito o error debajo del formulario.
   * Se elimina automáticamente después de 5 segundos.
   */
  function showFeedback(form, message, type) {
    // Remover feedback previo si existe
    form.parentNode.querySelector('.contact-feedback')?.remove();

    const div = document.createElement('div');
    div.className = 'contact-feedback';
    div.textContent = message;
    div.style.cssText = `
      margin-top: 16px;
      padding: 14px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      animation: fadeInDown 0.4s ease-out forwards;
      ${type === 'success'
        ? 'background:#dcfce7; color:#16a34a; border-left:4px solid #16a34a;'
        : 'background:#fee2e2; color:#dc2626; border-left:4px solid #dc2626;'
      }
    `;

    form.insertAdjacentElement('afterend', div);

    // Auto-remover tras 5 segundos
    setTimeout(() => {
      div.style.opacity = '0';
      div.style.transition = 'opacity 0.4s ease';
      setTimeout(() => div.remove(), 400);
    }, 5000);
  }
});
