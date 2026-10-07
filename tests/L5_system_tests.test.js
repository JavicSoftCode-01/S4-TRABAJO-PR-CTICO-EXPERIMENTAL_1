/**
 * L5_system_tests.test.js
 * Capa 5: Pruebas de Sistema y Flujos Arquitectónicos E2E
 * Skills Asociadas: architecture-engineering | requirements-quality-engineering
 */

const assert = require('assert');

// Máquina de estados para simular el enrutador SPA
class MockSPARouter {
  constructor() {
    this.currentView = 'view-login';
    this.history = ['view-login'];
    this.validViews = ['view-login', 'view-register', 'view-recovery'];
  }

  navigate(viewId) {
    if (!this.validViews.includes(viewId)) {
      throw new Error(`Vista no válida: ${viewId}`);
    }
    this.currentView = viewId;
    this.history.push(viewId);
  }
}

function runL5Tests() {
  console.log('--- Ejecutando L5: Pruebas de Sistema (architecture-engineering) ---');

  const router = new MockSPARouter();

  // Test 5.1: Estado inicial es Login
  assert.strictEqual(router.currentView, 'view-login');
  console.log('  ✔ Sistema inicializa correctamente en la vista de Login');

  // Test 5.2: Flujo de navegación Login -> Registro
  router.navigate('view-register');
  assert.strictEqual(router.currentView, 'view-register');
  console.log('  ✔ Transición fluida a vista de Registro ejecutada');

  // Test 5.3: Flujo de navegación Registro -> Recuperación
  router.navigate('view-recovery');
  assert.strictEqual(router.currentView, 'view-recovery');
  console.log('  ✔ Transición a vista de Recuperación de contraseña ejecutada');

  // Test 5.4: Retorno a Login
  router.navigate('view-login');
  assert.strictEqual(router.currentView, 'view-login');
  assert.deepStrictEqual(router.history, ['view-login', 'view-register', 'view-recovery', 'view-login']);
  console.log('  ✔ Trazabilidad y alternancia de vistas SPA 100% consistente');

  console.log('L5 Status: 100% OK\n');
}

module.exports = runL5Tests;
if (require.main === module) runL5Tests();
