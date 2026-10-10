const assert = require('assert');

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
    email: (val) => typeof val === 'string' && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@gmail\.com$/i.test(val.trim()),
    password: (val) => typeof val === 'string' && val.length >= 8,
    age: (val) => Number(val) >= 18 && Number(val) <= 75,
    phone: (val) => typeof val === 'string' && /^\+593[0-9]{9}$/.test(val.trim())
  };

  const invalidData = {
    email: 'invalido@otrodominio.com',
    password: '123',
    age: 15,
    phone: '0991234567'
  };

  const invalidResult = handleFormSubmitPipeline(invalidData, validators);
  assert.strictEqual(invalidResult.defaultPrevented, true, 'Debe ejecutar preventDefault');
  assert.strictEqual(invalidResult.isFormValid, false, 'Formulario debe ser inválido');
  assert.strictEqual(Object.keys(invalidResult.errors).length, 4, 'Debe registrar 4 errores');
  console.log('  ✔ Pipeline previene submit nativo y colecta fallos de validación');

  const validData = {
    email: 'contacto.empresa@gmail.com',
    password: 'PasswordSegura2026',
    age: 28,
    phone: '+593991234567'
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
