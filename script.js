/**
 * script.js - Lógica de Negocio, Controlador SPA, Validaciones Defensivas y UX de Alta Fidelidad
 * 
 * NOTA DE SEGURIDAD ARQUITECTÓNICA:
 * Todas las validaciones ejecutadas en este script son exclusivamente del lado del CLIENTE (Front-End)
 * para optimizar la experiencia de usuario (UX) y brindar retroalimentación visual inmediata.
 * En un entorno de producción profesional, ninguna validación de cliente reemplaza la seguridad del servidor;
 * la verificación de credenciales, unicidad de correos, existencia de usuarios y persistencia de datos
 * DEBE ser obligatoriamente validada y autorizada en el Back-End.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Módulo de Seguridad: Sanitización y Mitigación XSS (Cross-Site Scripting)
     ========================================================================== */
  /**
   * Convierte caracteres especiales en entidades HTML seguras para prevenir
   * inyecciones de código malicioso cuando se reflejan datos en el DOM.
   * @param {string} str - Cadena de entrada sin procesar
   * @returns {string} Cadena sanitizada
   */
  const escapeHTML = (str) => {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#2F;');
  };

  /* ==========================================================================
     2. Módulo de Notificaciones: Custom Toasts (Estilo Sonner / Clerk)
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  /**
   * Genera e inyecta dinámicamente una alerta flotante accesible en el DOM.
   * @param {string} title - Título del mensaje
   * @param {string} message - Cuerpo descriptivo del mensaje
   * @param {'success'|'error'|'warning'} type - Tipo semántico
   * @param {number} duration - Duración en milisegundos (default: 4000ms)
   */
  const showToast = (title, message, type = 'error', duration = 4000) => {
    if (!toastContainer) return;

    const safeTitle = escapeHTML(title);
    const safeMessage = escapeHTML(message);

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    let iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon" aria-hidden="true"></i>
      <div class="toast-body">
        <h4 class="toast-title">${safeTitle}</h4>
        <p class="toast-message">${safeMessage}</p>
      </div>
      <button type="button" class="toast-close-btn" aria-label="Cerrar notificación">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
      <div class="toast-progress">
        <div class="toast-progress-bar"></div>
      </div>
    `;

    // Cierre manual mediante botón
    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismissToast = () => {
      toast.classList.add('toast-closing');
      toast.addEventListener('animationend', () => {
        toast.remove();
      }, { once: true });
    };

    closeBtn.addEventListener('click', dismissToast);

    // Auto-cierre con temporizador
    const autoDismissTimer = setTimeout(() => {
      dismissToast();
    }, duration);

    // Pausar auto-cierre si el usuario inspecciona el toast con el cursor
    toast.addEventListener('mouseenter', () => clearTimeout(autoDismissTimer));
    toast.addEventListener('mouseleave', () => {
      setTimeout(dismissToast, 1500);
    });

    toastContainer.appendChild(toast);
  };

  /* ==========================================================================
     3. Módulo SPA: Enrutamiento Visual y Gestión de Segmented Tabs
     ========================================================================== */
  const spaTitle = document.getElementById('spa-title');
  const spaSubtitle = document.getElementById('spa-subtitle');
  const brandIcon = document.getElementById('brand-icon');
  const views = document.querySelectorAll('.form-view');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  const viewMetadata = {
    'view-login': {
      title: 'Iniciar Sesión',
      subtitle: 'Ingresa tus credenciales corporativas para acceder',
      iconClass: 'fa-solid fa-shield-halved',
      firstInputId: 'login-email',
      activeTab: 'tab-login'
    },
    'view-register': {
      title: 'Crear Cuenta Corporativa',
      subtitle: 'Completa los 5 campos obligatorios para registrarte',
      iconClass: 'fa-solid fa-user-plus',
      firstInputId: 'register-name',
      activeTab: 'tab-register'
    },
    'view-recovery': {
      title: 'Recuperar Contraseña',
      subtitle: 'Ingresa tu correo institucional para recibir el token de acceso',
      iconClass: 'fa-solid fa-key',
      firstInputId: 'recovery-email',
      activeTab: null
    }
  };

  /**
   * Alterna de manera fluida entre las vistas de la SPA sin recargar la página.
   * @param {string} targetViewId - Identificador del contenedor de vista destino
   */
  const switchView = (targetViewId) => {
    const targetView = document.getElementById(targetViewId);
    if (!targetView || !viewMetadata[targetViewId]) return;

    // Desactivar vista actual
    views.forEach(view => {
      view.classList.remove('active');
    });

    // Activar vista seleccionada
    targetView.classList.add('active');

    // Sincronizar pestañas segmentadas
    const meta = viewMetadata[targetViewId];
    if (tabLogin && tabRegister) {
      if (meta.activeTab === 'tab-login') {
        tabLogin.classList.add('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabRegister.classList.remove('active');
        tabRegister.setAttribute('aria-selected', 'false');
      } else if (meta.activeTab === 'tab-register') {
        tabRegister.classList.add('active');
        tabRegister.setAttribute('aria-selected', 'true');
        tabLogin.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'false');
      } else {
        tabLogin.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'false');
        tabRegister.classList.remove('active');
        tabRegister.setAttribute('aria-selected', 'false');
      }
    }

    // Actualizar encabezados contextuales
    if (spaTitle) spaTitle.textContent = meta.title;
    if (spaSubtitle) spaSubtitle.textContent = meta.subtitle;
    if (brandIcon) {
      brandIcon.className = meta.iconClass;
    }

    // A11y: Transferir foco al primer campo interactivo
    setTimeout(() => {
      const firstInput = document.getElementById(meta.firstInputId);
      if (firstInput) firstInput.focus();
    }, 120);
  };

  // Delegación de eventos para elementos con atributo data-navigate
  document.querySelectorAll('[data-navigate]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-navigate');
      switchView(targetId);
    });
  });

  /* ==========================================================================
     4. Módulo de Visibilidad de Contraseñas (Toggle Password)
     ========================================================================== */
  document.querySelectorAll('.btn-toggle-password').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', () => {
      const targetInputId = toggleBtn.getAttribute('data-target');
      const input = document.getElementById(targetInputId);
      if (!input) return;

      const icon = toggleBtn.querySelector('i');
      const isPassword = input.getAttribute('type') === 'password';

      if (isPassword) {
        input.setAttribute('type', 'text');
        toggleBtn.setAttribute('aria-label', 'Ocultar contraseña');
        if (icon) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      } else {
        input.setAttribute('type', 'password');
        toggleBtn.setAttribute('aria-label', 'Mostrar contraseña');
        if (icon) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });

  /* ==========================================================================
     5. Módulo de Fuerza de Contraseña Interactivo (Live UX Strength Meter)
     ========================================================================== */
  const registerPasswordInput = document.getElementById('register-password');
  const strengthProgress = document.getElementById('strength-progress');
  const ruleLength = document.getElementById('rule-length');
  const ruleLetter = document.getElementById('rule-letter');
  const ruleNumber = document.getElementById('rule-number');

  if (registerPasswordInput && strengthProgress) {
    registerPasswordInput.addEventListener('input', () => {
      const val = registerPasswordInput.value;
      const hasLength = val.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(val);
      const hasNumber = /[0-9]/.test(val);

      if (ruleLength) ruleLength.classList.toggle('valid', hasLength);
      if (ruleLetter) ruleLetter.classList.toggle('valid', hasLetter);
      if (ruleNumber) ruleNumber.classList.toggle('valid', hasNumber);

      const score = [hasLength, hasLetter, hasNumber].filter(Boolean).length;

      strengthProgress.className = 'strength-progress';
      if (val.length === 0) {
        strengthProgress.style.width = '0%';
      } else if (score === 1) {
        strengthProgress.classList.add('weak');
      } else if (score === 2) {
        strengthProgress.classList.add('medium');
      } else if (score === 3) {
        strengthProgress.classList.add('strong');
      }
    });
  }

  /* ==========================================================================
     6. Módulo de Validaciones Rigurosas (Reglas de Negocio Client-Side)
     ========================================================================== */
  const validationRules = {
    isValidEmail: (email) => {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      return emailRegex.test(email.trim());
    },
    isValidPassword: (password) => {
      if (password.length < 8) return false;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      return hasLetter && hasNumber;
    },
    isValidAge: (age) => {
      const num = parseInt(age, 10);
      return !isNaN(num) && num >= 14 && num <= 120;
    },
    isValidPhone: (phone) => {
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      return phoneRegex.test(phone.replace(/[\s-]/g, ''));
    },
    isValidName: (name) => {
      const trimmed = name.trim();
      return trimmed.length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);
    }
  };

  const setFieldValidationState = (input, isValid, errorMessage = '') => {
    const group = input.closest('.form-group');
    if (!group) return;

    const errorContainer = group.querySelector('.field-error-msg');
    const errorText = group.querySelector('.error-text');

    if (!isValid) {
      group.classList.add('has-error');
      group.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
      if (errorText) errorText.textContent = errorMessage;
      if (errorContainer) errorContainer.style.display = 'flex';
    } else {
      group.classList.remove('has-error');
      group.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
      if (errorText) errorText.textContent = '';
      if (errorContainer) errorContainer.style.display = 'none';
    }
  };

  const validateField = (input) => {
    const value = input.value;
    const name = input.name;
    const isRequired = input.hasAttribute('required');

    if (isRequired && (!value || value.trim() === '')) {
      return { isValid: false, error: 'Este campo es obligatorio' };
    }

    if (name === 'email') {
      if (!validationRules.isValidEmail(value)) {
        return { isValid: false, error: 'Formato de correo no válido (ej: usuario@empresa.com)' };
      }
    }

    if (name === 'password') {
      if (!validationRules.isValidPassword(value)) {
        return { isValid: false, error: 'Mínimo 8 caracteres, conteniendo al menos letras y números' };
      }
    }

    if (name === 'fullname') {
      if (!validationRules.isValidName(value)) {
        return { isValid: false, error: 'Ingresa al menos 3 caracteres alfabéticos válidos' };
      }
    }

    if (name === 'age') {
      if (!validationRules.isValidAge(value)) {
        return { isValid: false, error: 'La edad debe estar comprendida entre 14 y 120 años' };
      }
    }

    if (name === 'phone') {
      if (!validationRules.isValidPhone(value)) {
        return { isValid: false, error: 'Número telefónico no válido (entre 8 y 15 dígitos)' };
      }
    }

    return { isValid: true, error: '' };
  };

  // Enlazar eventos blur e input para feedback visual en tiempo real
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      const result = validateField(input);
      setFieldValidationState(input, result.isValid, result.error);
    });

    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        const result = validateField(input);
        if (result.isValid) {
          setFieldValidationState(input, true);
        }
      }
    });
  });

  /* ==========================================================================
     7. Controladores de Eventos Submit (Intercepción y Prevención por Defecto)
     ========================================================================== */

  // Formulario 1: Inicio de Sesión
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');

      const emailResult = validateField(emailInput);
      const passResult = validateField(passInput);

      setFieldValidationState(emailInput, emailResult.isValid, emailResult.error);
      setFieldValidationState(passInput, passResult.isValid, passResult.error);

      if (!emailResult.isValid || !passResult.isValid) {
        showToast('Error de Validación', 'Verifica los campos señalados antes de ingresar.', 'error');
        if (!emailResult.isValid) emailInput.focus();
        else passInput.focus();
        return;
      }

      const sanitizedEmail = escapeHTML(emailInput.value.trim());
      showToast('Autenticación Exitosa', `Sesión iniciada correctamente para: ${sanitizedEmail}`, 'success');
      formLogin.reset();
      document.querySelectorAll('#form-login .form-group').forEach(g => g.classList.remove('is-valid'));
    });
  }

  // Formulario 2: Registro de Usuario (Mínimo 5 campos)
  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('register-name');
      const emailInput = document.getElementById('register-email');
      const ageInput = document.getElementById('register-age');
      const phoneInput = document.getElementById('register-phone');
      const passInput = document.getElementById('register-password');

      const fields = [
        { el: nameInput, label: 'Nombres' },
        { el: emailInput, label: 'Correo' },
        { el: ageInput, label: 'Edad' },
        { el: phoneInput, label: 'Teléfono' },
        { el: passInput, label: 'Contraseña' }
      ];

      let hasError = false;
      let firstErrorField = null;

      fields.forEach(field => {
        const result = validateField(field.el);
        setFieldValidationState(field.el, result.isValid, result.error);
        if (!result.isValid) {
          hasError = true;
          if (!firstErrorField) firstErrorField = field.el;
        }
      });

      if (hasError) {
        showToast('Formulario Incompleto', 'Corrige los errores destacados en los 5 campos obligatorios.', 'error');
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      const safeName = escapeHTML(nameInput.value.trim());
      showToast('Cuenta Creada', `Bienvenido al sistema, ${safeName}. Ya puedes iniciar sesión.`, 'success');

      formRegister.reset();
      document.querySelectorAll('#form-register .form-group').forEach(g => g.classList.remove('is-valid'));
      if (strengthProgress) {
        strengthProgress.className = 'strength-progress';
        strengthProgress.style.width = '0%';
      }
      [ruleLength, ruleLetter, ruleNumber].forEach(r => r && r.classList.remove('valid'));

      setTimeout(() => {
        switchView('view-login');
      }, 1200);
    });
  }

  // Formulario 3: Recuperación de Contraseña
  const formRecovery = document.getElementById('form-recovery');
  if (formRecovery) {
    formRecovery.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('recovery-email');
      const result = validateField(emailInput);
      setFieldValidationState(emailInput, result.isValid, result.error);

      if (!result.isValid) {
        showToast('Error en Correo', result.error, 'error');
        emailInput.focus();
        return;
      }

      const safeEmail = escapeHTML(emailInput.value.trim());
      showToast('Instrucciones Emitidas', `Se ha generado un token de recuperación para: ${safeEmail}`, 'success');

      formRecovery.reset();
      document.querySelectorAll('#form-recovery .form-group').forEach(g => g.classList.remove('is-valid'));

      setTimeout(() => {
        switchView('view-login');
      }, 1800);
    });
  }

});
