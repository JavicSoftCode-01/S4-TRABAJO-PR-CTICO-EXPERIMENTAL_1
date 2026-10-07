/**
 * L7_acceptance_e2e_tests.test.js
 * Capa 7: Pruebas de Aceptación, Criterios WCAG y Estructura DOM/E2E
 * Skills Asociadas: frontend-design-engineering | requirements-quality-engineering
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

function runL7Tests() {
  console.log('--- Ejecutando L7: Pruebas de Aceptación y Accesibilidad (frontend-design / A11y) ---');

  const htmlPath = path.join(__dirname, '..', 'index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Test 7.1: Presencia del Skip-link accesible
  assert.ok(htmlContent.includes('class="skip-link"'), 'Falta skip-link accesible');
  assert.ok(htmlContent.includes('href="#main-content"'), 'Skip-link no apunta al id principal');
  console.log('  ✔ Enlace de salto (Skip-link) presente y correctamente vinculado');

  // Test 7.2: Contenedor Toast accesible con aria-live="polite"
  assert.ok(htmlContent.includes('aria-live="polite"'), 'Falta región aria-live="polite" para toasts');
  assert.ok(htmlContent.includes('aria-atomic="true"'), 'Falta aria-atomic="true" en contenedor de alertas');
  console.log('  ✔ Región flotante de alertas configurada con atributos ARIA para lectores de pantalla');

  // Test 7.3: Presencia de las 3 vistas requeridas en la SPA
  assert.ok(htmlContent.includes('id="view-login"'), 'Falta vista view-login');
  assert.ok(htmlContent.includes('id="view-register"'), 'Falta vista view-register');
  assert.ok(htmlContent.includes('id="view-recovery"'), 'Falta vista view-recovery');
  console.log('  ✔ Tres vistas SPA declaradas (Login, Register, Recovery)');

  // Test 7.4: Mínimo 5 campos en el formulario de Registro con tipos adecuados
  const requiredInputs = [
    { id: 'register-name', type: 'text' },
    { id: 'register-email', type: 'email' },
    { id: 'register-age', type: 'number' },
    { id: 'register-phone', type: 'tel' },
    { id: 'register-password', type: 'password' }
  ];

  requiredInputs.forEach(({ id, type }) => {
    assert.ok(htmlContent.includes(`id="${id}"`), `Falta input #${id} en registro`);
    assert.ok(htmlContent.includes(`type="${type}"`), `Input #${id} debe ser de tipo ${type}`);
    assert.ok(htmlContent.includes(`for="${id}"`), `Falta <label for="${id}"> para accesibilidad`);
  });
  console.log('  ✔ Formulario de Registro cuenta con los 5 campos exigidos y etiquetas <label for> estrictas');

  // Test 7.5: Enlace de hojas de estilo modulares (root.css y main.css)
  assert.ok(htmlContent.includes('href="root.css"'), 'Falta enlace a root.css');
  assert.ok(htmlContent.includes('href="main.css"'), 'Falta enlace a main.css');
  assert.ok(htmlContent.includes('src="script.js"'), 'Falta enlace a script.js');
  console.log('  ✔ Arquitectura modular de archivos cargada correctamente en index.html');

  console.log('L7 Status: 100% OK\n');
}

module.exports = runL7Tests;
if (require.main === module) runL7Tests();
