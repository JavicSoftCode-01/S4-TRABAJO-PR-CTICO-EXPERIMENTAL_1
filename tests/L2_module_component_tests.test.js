const assert = require('assert');

function createToastComponent(title, message, type = 'error') {
  const allowedTypes = ['success', 'error', 'warning'];
  const finalType = allowedTypes.includes(type) ? type : 'error';
  const role = finalType === 'error' ? 'alert' : 'status';
  const iconClass = finalType === 'success' ? 'fa-circle-check' : (finalType === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-exclamation');

  return {
    className: `toast toast-${finalType}`,
    role: role,
    iconClass: iconClass,
    title: title,
    message: message,
    hasCloseButton: true,
    hasProgressBar: true
  };
}

function togglePasswordState(currentType) {
  if (currentType === 'password') {
    return { newType: 'text', icon: 'fa-eye-slash', ariaLabel: 'Ocultar contraseña' };
  } else {
    return { newType: 'password', icon: 'fa-eye', ariaLabel: 'Mostrar contraseña' };
  }
}

function runL2Tests() {
  console.log('--- Ejecutando L2: Pruebas de Módulos / Componentes (software-engineering / frontend-design) ---');

  const errToast = createToastComponent('Error', 'Campo requerido', 'error');
  assert.strictEqual(errToast.className, 'toast toast-error');
  assert.strictEqual(errToast.role, 'alert');
  assert.strictEqual(errToast.iconClass, 'fa-circle-exclamation');
  assert.strictEqual(errToast.hasCloseButton, true);
  console.log('  ✔ Componente Toast Error genera atributos semánticos y role="alert"');

  const successToast = createToastComponent('Éxito', 'Operación completada', 'success');
  assert.strictEqual(successToast.className, 'toast toast-success');
  assert.strictEqual(successToast.role, 'status');
  assert.strictEqual(successToast.iconClass, 'fa-circle-check');
  console.log('  ✔ Componente Toast Éxito genera role="status" y clase de éxito');

  const toText = togglePasswordState('password');
  assert.strictEqual(toText.newType, 'text');
  assert.strictEqual(toText.icon, 'fa-eye-slash');
  assert.strictEqual(toText.ariaLabel, 'Ocultar contraseña');

  const toPassword = togglePasswordState('text');
  assert.strictEqual(toPassword.newType, 'password');
  assert.strictEqual(toPassword.icon, 'fa-eye');
  assert.strictEqual(toPassword.ariaLabel, 'Mostrar contraseña');
  console.log('  ✔ Componente Toggle Password alterna tipos de input y accesibilidad ARIA');

  console.log('L2 Status: 100% OK\n');
}

module.exports = runL2Tests;
if (require.main === module) runL2Tests();
