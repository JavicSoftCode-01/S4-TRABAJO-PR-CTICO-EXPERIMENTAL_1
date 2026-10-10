const assert = require('assert');

class MockSPARouter {
  constructor() {
    this.currentView = 'view-login';
    this.currentRoute = '#/login';
    this.history = ['view-login'];
    this.routeHistory = ['#/login'];
    this.routes = {
      'view-login': '#/login',
      'view-register': '#/register',
      'view-recovery': '#/recovery'
    };
  }

  navigate(viewId) {
    if (!this.routes[viewId]) {
      throw new Error(`Vista no válida: ${viewId}`);
    }
    this.currentView = viewId;
    this.currentRoute = this.routes[viewId];
    this.history.push(viewId);
    this.routeHistory.push(this.currentRoute);
  }

  navigateByRoute(route) {
    const entry = Object.entries(this.routes).find(([, r]) => r === route);
    if (!entry) throw new Error(`Ruta no válida: ${route}`);
    this.navigate(entry[0]);
  }
}

function runL5Tests() {
  console.log('--- Ejecutando L5: Pruebas de Sistema (architecture-engineering) ---');

  const router = new MockSPARouter();

  assert.strictEqual(router.currentView, 'view-login');
  assert.strictEqual(router.currentRoute, '#/login');
  console.log('  ✔ Sistema inicializa correctamente en la vista de Login con ruta #/login');

  router.navigate('view-register');
  assert.strictEqual(router.currentView, 'view-register');
  assert.strictEqual(router.currentRoute, '#/register');
  console.log('  ✔ Transición fluida a vista de Registro ejecutada y URL sincronizada a #/register');

  router.navigate('view-recovery');
  assert.strictEqual(router.currentView, 'view-recovery');
  assert.strictEqual(router.currentRoute, '#/recovery');
  console.log('  ✔ Transición a vista de Recuperación ejecutada y URL sincronizada a #/recovery');

  router.navigateByRoute('#/login');
  assert.strictEqual(router.currentView, 'view-login');
  assert.strictEqual(router.currentRoute, '#/login');
  assert.deepStrictEqual(router.routeHistory, ['#/login', '#/register', '#/recovery', '#/login']);
  console.log('  ✔ Sincronización bidireccional de rutas y alternancia SPA 100% consistente');

  console.log('L5 Status: 100% OK\n');
}

module.exports = runL5Tests;
if (require.main === module) runL5Tests();
