/**
 * L4_contract_api_tests.test.js
 * Capa 4: Pruebas de Contratos de Interfaz y Esquemas DTO/API
 * Skills Asociadas: software-engineering | requirements-quality-engineering
 */

const assert = require('assert');

// Validación de esquemas DTO esperados por el contrato del sistema
function validateRegistrationDTO(payload) {
  const requiredKeys = ['fullname', 'email', 'age', 'phone', 'password'];
  for (const key of requiredKeys) {
    if (!(key in payload)) {
      return { valid: false, missing: key };
    }
  }

  if (typeof payload.fullname !== 'string' || payload.fullname.length < 3) return { valid: false, field: 'fullname' };
  if (typeof payload.email !== 'string' || !payload.email.includes('@')) return { valid: false, field: 'email' };
  if (typeof payload.age !== 'number' || payload.age < 14 || payload.age > 120) return { valid: false, field: 'age' };
  if (typeof payload.phone !== 'string' || payload.phone.length < 8) return { valid: false, field: 'phone' };
  if (typeof payload.password !== 'string' || payload.password.length < 8) return { valid: false, field: 'password' };

  return { valid: true };
}

function runL4Tests() {
  console.log('--- Ejecutando L4: Pruebas de Contratos y Esquemas de API (software-eng / requirements) ---');

  // Test 4.1: Contrato completo con los 5 campos mínimos de registro
  const validPayload = {
    fullname: 'Carlos Andrés Mendoza',
    email: 'carlos.mendoza@universidad.edu.ec',
    age: 22,
    phone: '0987654321',
    password: 'PasswordRobusta2026'
  };

  const resultOk = validateRegistrationDTO(validPayload);
  assert.strictEqual(resultOk.valid, true, 'El DTO válido debe ser aceptado por el contrato');
  console.log('  ✔ Contrato DTO de Registro acepta los 5 campos requeridos con tipos correctos');

  // Test 4.2: DTO incompleto (ausencia de teléfono)
  const incompletePayload = {
    fullname: 'Carlos Andrés Mendoza',
    email: 'carlos.mendoza@universidad.edu.ec',
    age: 22,
    password: 'PasswordRobusta2026'
  };

  const resultMissing = validateRegistrationDTO(incompletePayload);
  assert.strictEqual(resultMissing.valid, false);
  assert.strictEqual(resultMissing.missing, 'phone');
  console.log('  ✔ Contrato detecta y rechaza la omisión de cualquier campo obligatorio');

  console.log('L4 Status: 100% OK\n');
}

module.exports = runL4Tests;
if (require.main === module) runL4Tests();
