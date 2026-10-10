/**
 * L1_unit_tests.test.js
 * Capa 1: Pruebas Unitarias (Lógica Aislada y Funciones Puras)
 * Skill Asociada: software-engineering
 */

const assert = require('assert');

// 1. Funciones a verificar (aisladas de I/O)
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

function runL1Tests() {
  console.log('--- Ejecutando L1: Pruebas Unitarias (software-engineering) ---');

  // Test 1.1: escapeHTML mitiga caracteres XSS
  const dirty = '<script>alert("xss")</script>';
  const sanitized = escapeHTML(dirty);
  assert.strictEqual(sanitized, '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#2F;script&gt;', 'XSS no sanitizado correctamente');
  console.log('  ✔ escapeHTML sanitiza tags HTML y comillas');

  // Test 1.2: escapeHTML maneja tipos no-string de forma segura
  assert.strictEqual(escapeHTML(null), '', 'Null no devuelve string vacío');
  assert.strictEqual(escapeHTML(undefined), '', 'Undefined no devuelve string vacío');
  console.log('  ✔ escapeHTML es resiliente ante valores no-string');

  // Test 1.3: Validación de correos exclusivos para dominio @gmail.com
  assert.strictEqual(validationRules.isValidEmail('usuario@gmail.com'), true);
  assert.strictEqual(validationRules.isValidEmail('correo.valido+tag@gmail.com'), true);
  assert.strictEqual(validationRules.isValidEmail('usuario@dominio.com'), false, 'Solo debe aceptar @gmail.com');
  assert.strictEqual(validationRules.isValidEmail('usuario@hotmail.com'), false, 'Solo debe aceptar @gmail.com');
  assert.strictEqual(validationRules.isValidEmail('correo_sin_arroba.com'), false);
  assert.strictEqual(validationRules.isValidEmail('   '), false);
  console.log('  ✔ isValidEmail valida estrictamente el dominio @gmail.com');

  // Test 1.4: Validación de contraseña (mínimo 8 caracteres, alfabético + numérico)
  assert.strictEqual(validationRules.isValidPassword('Password123'), true);
  assert.strictEqual(validationRules.isValidPassword('pass1'), false, 'Menor a 8 caracteres debe fallar');
  assert.strictEqual(validationRules.isValidPassword('sololetrasletras'), false, 'Sin números debe fallar');
  assert.strictEqual(validationRules.isValidPassword('123456789'), false, 'Sin letras debe fallar');
  console.log('  ✔ isValidPassword valida longitud y requisitos de complejidad');

  // Test 1.5: Validación de edad en rango estricto (18 - 75)
  assert.strictEqual(validationRules.isValidAge(18), true);
  assert.strictEqual(validationRules.isValidAge(25), true);
  assert.strictEqual(validationRules.isValidAge(75), true);
  assert.strictEqual(validationRules.isValidAge(17), false, 'Menor a 18 debe fallar');
  assert.strictEqual(validationRules.isValidAge(76), false, 'Mayor a 75 debe fallar');
  assert.strictEqual(validationRules.isValidAge(-5), false);
  assert.strictEqual(validationRules.isValidAge('abc'), false);
  console.log('  ✔ isValidAge valida límites numéricos estrictos [18, 75]');

  // Test 1.6: Validación de teléfono (+593 y exactamente 9 dígitos, total 13 caracteres)
  assert.strictEqual(validationRules.isValidPhone('+593991234567'), true);
  assert.strictEqual(validationRules.isValidPhone('+593987654321'), true);
  assert.strictEqual(validationRules.isValidPhone('0991234567'), false, 'Sin +593 debe fallar');
  assert.strictEqual(validationRules.isValidPhone('+5939912345'), false, 'Menos de 9 dígitos tras +593 debe fallar');
  assert.strictEqual(validationRules.isValidPhone('+5939912345678'), false, 'Más de 9 dígitos debe fallar');
  assert.strictEqual(validationRules.isValidPhone('telefono123'), false);
  console.log('  ✔ isValidPhone valida prefijo +593 y exactamente 9 dígitos numéricos');

  // Test 1.7: Validación de nombres alfabéticos
  assert.strictEqual(validationRules.isValidName('Juan Pérez'), true);
  assert.strictEqual(validationRules.isValidName('María José Cañizares'), true);
  assert.strictEqual(validationRules.isValidName('Al'), false, 'Menor a 3 caracteres debe fallar');
  assert.strictEqual(validationRules.isValidName('Juan123'), false, 'Con números debe fallar');
  console.log('  ✔ isValidName admite tildes y eñes sin permitir dígitos');

  console.log('L1 Status: 100% OK\n');
}

module.exports = runL1Tests;
if (require.main === module) runL1Tests();
