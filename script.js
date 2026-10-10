'use strict';

document.addEventListener('DOMContentLoaded', () => {

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

  const toastContainer = document.getElementById('toast-container');

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

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismissToast = () => {
      toast.classList.add('toast-closing');
      toast.addEventListener('animationend', () => {
        toast.remove();
      }, { once: true });
    };

    closeBtn.addEventListener('click', dismissToast);

    const autoDismissTimer = setTimeout(() => {
      dismissToast();
    }, duration);

    toast.addEventListener('mouseenter', () => clearTimeout(autoDismissTimer));
    toast.addEventListener('mouseleave', () => {
      setTimeout(dismissToast, 1500);
    });

    toastContainer.appendChild(toast);
  };

  const spaTitle = document.getElementById('spa-title');
  const spaSubtitle = document.getElementById('spa-subtitle');
  const brandIcon = document.getElementById('brand-icon');
  const views = document.querySelectorAll('.form-view');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  const formSubmitTracker = {
    'form-login': false,
    'form-register': false,
    'form-recovery': false
  };

  const viewMetadata = {
    'view-login': {
      title: 'Iniciar Sesión',
      subtitle: 'Ingresa tus credenciales corporativas para acceder',
      iconClass: 'fa-solid fa-shield-halved',
      formId: 'form-login',
      activeTab: 'tab-login',
      route: '#/login'
    },
    'view-register': {
      title: 'Crear Cuenta Corporativa',
      subtitle: 'Completa los campos requeridos para registrarte',
      iconClass: 'fa-solid fa-user-plus',
      formId: 'form-register',
      activeTab: 'tab-register',
      route: '#/register'
    },
    'view-recovery': {
      title: 'Recuperar Contraseña',
      subtitle: 'Ingresa tu correo @gmail.com para recibir el token de acceso',
      iconClass: 'fa-solid fa-key',
      formId: 'form-recovery',
      activeTab: null,
      route: '#/recovery'
    }
  };

  const routeToViewId = {
    '#/login': 'view-login',
    '#/register': 'view-register',
    '#/recovery': 'view-recovery',
    '#login': 'view-login',
    '#register': 'view-register',
    '#recovery': 'view-recovery'
  };

  const clearAllValidationStates = () => {
    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error', 'is-valid');
      const input = group.querySelector('.form-input');
      if (input) input.setAttribute('aria-invalid', 'false');
      const errorContainer = group.querySelector('.field-error-msg');
      if (errorContainer) errorContainer.style.display = 'none';
      const errorText = group.querySelector('.error-text');
      if (errorText) errorText.textContent = '';
    });
  };

  const switchView = (targetViewId, updateHistory = true) => {
    const targetView = document.getElementById(targetViewId);
    if (!targetView || !viewMetadata[targetViewId]) return;

    clearAllValidationStates();

    views.forEach(view => {
      view.classList.remove('active');
    });

    targetView.classList.add('active');

    const authCardSplit = document.querySelector('.auth-card-split');
    if (authCardSplit) {
      authCardSplit.classList.remove('mode-login', 'mode-register', 'mode-recovery');
      if (targetViewId === 'view-login') {
        authCardSplit.classList.add('mode-login');
      } else if (targetViewId === 'view-register') {
        authCardSplit.classList.add('mode-register');
      } else if (targetViewId === 'view-recovery') {
        authCardSplit.classList.add('mode-recovery');
      }
    }

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

    if (spaTitle) spaTitle.textContent = meta.title;
    if (spaSubtitle) spaSubtitle.textContent = meta.subtitle;
    if (brandIcon) {
      brandIcon.className = meta.iconClass;
    }

    if (updateHistory && meta.route) {
      if (window.location.hash !== meta.route) {
        history.pushState({ view: targetViewId }, '', meta.route);
      }
    }
  };

  const handleRouting = () => {
    const rawHash = (window.location.hash || '').toLowerCase();
    const targetViewId = routeToViewId[rawHash] || 'view-login';
    switchView(targetViewId, false);
    const canonicalRoute = viewMetadata[targetViewId].route;
    if (window.location.hash !== canonicalRoute) {
      history.replaceState({ view: targetViewId }, '', canonicalRoute);
    }
  };

  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('popstate', handleRouting);

  handleRouting();

  document.querySelectorAll('[data-navigate]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.getAttribute('data-navigate');
      switchView(targetId, true);
    });
  });

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

      const confirmInput = document.getElementById('register-confirm-password');
      if (confirmInput && confirmInput.value.trim().length > 0) {
        const confirmResult = validateField(confirmInput);
        setFieldValidationState(confirmInput, confirmResult.isValid, confirmResult.error);
      }
    });
  }

  const validationRules = {
    isValidEmail: (email) => {
      const trimmed = (email || '').trim();
      const gmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/i;
      return gmailRegex.test(trimmed);
    },
    isValidPassword: (password) => {
      if (!password || password.length < 8) return false;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      return hasLetter && hasNumber;
    },
    isValidAge: (age) => {
      const num = parseInt(age, 10);
      return !isNaN(num) && num >= 18 && num <= 75;
    },
    isValidPhone: (phone) => {
      const cleaned = (phone || '').trim().replace(/\s+/g, '');
      const phoneRegex = /^\+593[0-9]{9}$/;
      return phoneRegex.test(cleaned);
    },
    isValidName: (name) => {
      const trimmed = (name || '').trim();
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

  const clearFieldValidationState = (input) => {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error', 'is-valid');
    input.setAttribute('aria-invalid', 'false');
    const errorContainer = group.querySelector('.field-error-msg');
    if (errorContainer) errorContainer.style.display = 'none';
    const errorText = group.querySelector('.error-text');
    if (errorText) errorText.textContent = '';
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
        return { isValid: false, error: 'Formato no válido. Debe pertenecer al dominio @gmail.com (ej: usuario@gmail.com)' };
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
        return { isValid: false, error: 'La edad debe estar comprendida entre 18 y 75 años' };
      }
    }

    if (name === 'phone') {
      if (!validationRules.isValidPhone(value)) {
        return { isValid: false, error: 'Debe iniciar con +593 seguido de exactamente 9 dígitos numéricos (ej: +593991234567)' };
      }
    }

    if (name === 'confirmPassword') {
      const origPass = document.getElementById('register-password');
      if (origPass && value !== origPass.value) {
        return { isValid: false, error: 'Las contraseñas no coinciden' };
      }
    }

    return { isValid: true, error: '' };
  };

  const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
  phoneInputs.forEach(phoneInput => {
    phoneInput.addEventListener('keydown', (e) => {
      
      if (
        ['Backspace', 'Tab', 'Enter', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
        (e.ctrlKey || e.metaKey)
      ) {
        return;
      }

      if (e.key === '+') {
        if ((phoneInput.value.length === 0 || phoneInput.selectionStart === 0) && !phoneInput.value.includes('+')) {
          return;
        }
        e.preventDefault();
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        if (phoneInput.value.length >= 13 && phoneInput.selectionStart === phoneInput.selectionEnd) {
          e.preventDefault();
        }
        return;
      }

      e.preventDefault();
    });

    phoneInput.addEventListener('input', () => {
      const raw = phoneInput.value;
      const hasPlus = raw.startsWith('+');
      const digitsOnly = raw.replace(/\D/g, '');
      let sanitized = (hasPlus ? '+' : '') + digitsOnly;
      if (sanitized.length > 13) {
        sanitized = sanitized.slice(0, 13);
      }
      if (phoneInput.value !== sanitized) {
        phoneInput.value = sanitized;
      }
    });
  });

  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      const form = input.closest('form');
      const formId = form ? form.id : '';
      const hasBeenSubmitted = formSubmitTracker[formId];
      const trimmedVal = input.value.trim();

      if (trimmedVal === '') {
        if (!hasBeenSubmitted) {
          clearFieldValidationState(input);
          return;
        }
      }

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

  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      formSubmitTracker['form-login'] = true;

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
      formSubmitTracker['form-login'] = false;
      clearAllValidationStates();
    });
  }

  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      formSubmitTracker['form-register'] = true;

      const nameInput = document.getElementById('register-name');
      const emailInput = document.getElementById('register-email');
      const ageInput = document.getElementById('register-age');
      const phoneInput = document.getElementById('register-phone');
      const passInput = document.getElementById('register-password');
      const confirmPassInput = document.getElementById('register-confirm-password');

      const fields = [
        { el: nameInput, label: 'Nombres' },
        { el: emailInput, label: 'Correo' },
        { el: ageInput, label: 'Edad' },
        { el: phoneInput, label: 'Teléfono' },
        { el: passInput, label: 'Contraseña' },
        { el: confirmPassInput, label: 'Confirmar Contraseña' }
      ];

      let hasError = false;
      let firstErrorField = null;

      fields.forEach(field => {
        if (!field.el) return;
        const result = validateField(field.el);
        setFieldValidationState(field.el, result.isValid, result.error);
        if (!result.isValid) {
          hasError = true;
          if (!firstErrorField) firstErrorField = field.el;
        }
      });

      if (hasError) {
        showToast('Formulario Incompleto', 'Corrige los errores destacados en los campos del registro.', 'error');
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      const safeName = escapeHTML(nameInput.value.trim());
      showToast('Cuenta Creada', `Bienvenido al sistema, ${safeName}. Ya puedes iniciar sesión.`, 'success');

      formRegister.reset();
      formSubmitTracker['form-register'] = false;
      clearAllValidationStates();
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

  const formRecovery = document.getElementById('form-recovery');
  if (formRecovery) {
    formRecovery.addEventListener('submit', (e) => {
      e.preventDefault();
      formSubmitTracker['form-recovery'] = true;

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
      formSubmitTracker['form-recovery'] = false;
      clearAllValidationStates();

      setTimeout(() => {
        switchView('view-login');
      }, 1800);
    });
  }

});
