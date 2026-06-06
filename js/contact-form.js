/**
 * js/contact-form.js
 * Módulo del formulario de contacto con Formspree.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contacto__form');
  if (!form) return;

  form.addEventListener('submit', handleContactSubmit);

  async function handleContactSubmit(e) {
    e.preventDefault();

    const lang = window.i18n ? window.i18n.getLang() : 'es';

    const nameInput    = form.querySelector('input[type="text"]');
    const emailInput   = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');
    const submitBtn    = form.querySelector('button[type="submit"]');

    // Validación
    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
      highlightEmptyFields([nameInput, emailInput, messageInput]);
      return;
    }

    if (!isValidEmail(emailInput.value)) {
      setFieldError(emailInput);
      return;
    }

    // Estado de "enviando"
    const originalText    = submitBtn.textContent;
    submitBtn.disabled    = true;
    submitBtn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...';
    submitBtn.style.opacity = '0.7';

    try {
      const response = await fetch('https://formspree.io/f/xeewekwa', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:    nameInput.value.trim(),
          email:   emailInput.value.trim(),
          message: messageInput.value.trim()
        })
      });

      if (!response.ok) throw new Error('Formspree error');

      form.reset();
      showFeedback(form, window.i18n.t('form-success', lang), 'success');

    } catch (err) {
      console.error('[contact-form] Error al enviar:', err);
      showFeedback(form, window.i18n.t('form-error', lang), 'error');

    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function highlightEmptyFields(fields) {
    fields.forEach(field => {
      if (field && !field.value.trim()) setFieldError(field);
    });
    fields.find(f => f && !f.value.trim())?.focus();
  }

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

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function showFeedback(form, message, type) {
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

    setTimeout(() => {
      div.style.opacity    = '0';
      div.style.transition = 'opacity 0.4s ease';
      setTimeout(() => div.remove(), 400);
    }, 5000);
  }
});