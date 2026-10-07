/**
 * L3_integration_tests.test.js
 * Capa 3: Pruebas de Integración (Interacción entre Lógica, Eventos y Estado)
 * Skills Asociadas: software-engineering | database-engineering (interacción de límites)
 */

const assert = require('assert');

// Mock del pipeline de recepción de formulario con preventDefault y validación
function handleFormSubmitPipeline(formData, rulesValidator) {
  let defaultPrevented = false;
  const mockEvent = {
    preventDefault: () => {
      defaultPrevented = true;
    }
  };

  mockEvent.preventDefault();

  const errors = {};
  for (const [key, value] of Object.entries(formData)) {
    if (rulesValidator[key]) {
      const valid = rulesValidator[key](value);
      if (!valid) {
        errors[key] = `Error en campo ${key}`;
      }
    }
  }

  const isFormValid = Object.keys(errors).length === 0;

  return {
    defaultPrevented,
    isFormValid,
    errors
  };
}

function runL3Tests() {
  console.log('--- Ejecutando L3: Pruebas de Integración (software-engineering) ---');

  const validators = {
    email: (val) => typeof val === 'string' && val.includes('@') && val.includes('.'),
    password: (val) => typeof val === 'string' && val.length >= 8,
    age: (val) => Number(val) >= 14 && Number(val) <= 120
  };

  // Test 3.1: Formulario con error previene recarga y genera mapa de errores
  const invalidData = {
    email: 'invalido',
    password: '123',
    age: 10
  };

  const invalidResult = handleFormSubmitPipeline(invalidData, validators);
  assert.strictEqual(invalidResult.defaultPrevented, true, 'Debe ejecutar preventDefault');
  assert.strictEqual(invalidResult.isFormValid, false, 'Formulario debe ser inválido');
  assert.strictEqual(Object.keys(invalidResult.errors).length, 3, 'Debe registrar 3 errores');
  console.log('  ✔ Pipeline previene submit nativo y colecta fallos de validación');

  // Test 3.2: Formulario válido previene recarga y pasa con éxito
  const validData = {
    email: 'contacto@ejemplo.com',
    password: 'PasswordSegura2026',
    age: 28
  };

  const validResult = handleFormSubmitPipeline(validData, validators);
  assert.strictEqual(validResult.defaultPrevented, true, 'Debe ejecutar preventDefault');
  assert.strictEqual(validResult.isFormValid, true, 'Formulario debe ser válido');
  assert.strictEqual(Object.keys(validResult.errors).length, 0);
  console.log('  ✔ Formulario válido atraviesa exitosamente el pipeline de integración');

  console.log('L3 Status: 100% OK\n');
}

module.exports = runL3Tests;
if (require.main === module) runL3Tests();
