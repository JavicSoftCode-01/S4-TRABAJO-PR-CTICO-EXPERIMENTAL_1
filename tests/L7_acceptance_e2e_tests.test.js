const assert = require('assert');
const fs = require('fs');
const path = require('path');

function runL7Tests() {
  console.log('--- Ejecutando L7: Pruebas de Aceptación y Accesibilidad (frontend-design / A11y) ---');

  const htmlPath = path.join(__dirname, '..', 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  assert.ok(htmlContent.includes('class="skip-link"'), 'Falta skip-link accesible');
  assert.ok(htmlContent.includes('href="#main-content"'), 'Skip-link no apunta al id principal');
  console.log('  ✔ Enlace de salto (Skip-link) presente y correctamente vinculado');

  assert.ok(htmlContent.includes('aria-live="polite"'), 'Falta región aria-live="polite" para toasts');
  assert.ok(htmlContent.includes('aria-atomic="true"'), 'Falta aria-atomic="true" en contenedor de alertas');
  console.log('  ✔ Región flotante de alertas configurada con atributos ARIA para lectores de pantalla');

  assert.ok(htmlContent.includes('id="view-login"'), 'Falta vista view-login');
  assert.ok(htmlContent.includes('id="view-register"'), 'Falta vista view-register');
  assert.ok(htmlContent.includes('id="view-recovery"'), 'Falta vista view-recovery');
  console.log('  ✔ Tres vistas SPA declaradas (Login, Register, Recovery)');

  const requiredInputs = [
    { id: 'register-name', type: 'text' },
    { id: 'register-email', type: 'email' },
    { id: 'register-age', type: 'number' },
    { id: 'register-phone', type: 'tel' },
    { id: 'register-password', type: 'password' },
    { id: 'register-confirm-password', type: 'password' }
  ];

  requiredInputs.forEach(({ id, type }) => {
    assert.ok(htmlContent.includes(`id="${id}"`), `Falta input #${id} en registro`);
    assert.ok(htmlContent.includes(`type="${type}"`), `Input #${id} debe ser de tipo ${type}`);
    assert.ok(htmlContent.includes(`for="${id}"`), `Falta <label for="${id}"> para accesibilidad`);
  });
  assert.ok(htmlContent.includes('id="register-age"') && htmlContent.includes('min="18"') && htmlContent.includes('max="75"'), 'Faltan restricciones min 18 max 75 en edad');
  assert.ok(htmlContent.includes('id="register-phone"') && htmlContent.includes('maxlength="13"'), 'Falta maxlength="13" en teléfono');
  console.log('  ✔ Formulario de Registro cuenta con los campos exigidos, límites numéricos [18, 75] y restricciones de longitud estrictas');

  assert.ok(htmlContent.includes('href="root.css"'), 'Falta enlace a root.css');
  assert.ok(htmlContent.includes('href="main.css"'), 'Falta enlace a main.css');
  assert.ok(htmlContent.includes('src="script.js"'), 'Falta enlace a script.js');
  console.log('  ✔ Arquitectura modular de archivos cargada correctamente en index.html');

  console.log('L7 Status: 100% OK\n');
}

module.exports = runL7Tests;
if (require.main === module) runL7Tests();
