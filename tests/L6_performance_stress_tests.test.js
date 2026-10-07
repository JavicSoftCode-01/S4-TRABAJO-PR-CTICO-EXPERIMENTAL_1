/**
 * L6_performance_stress_tests.test.js
 * Capa 6: Pruebas de Rendimiento, Estrés y Benchmarks No Funcionales
 * Skills Asociadas: architecture-engineering | database-engineering (optimización de recursos)
 */

const assert = require('assert');

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

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function runL6Tests() {
  console.log('--- Ejecutando L6: Pruebas de Rendimiento y Estrés (architecture / performance) ---');

  const iterations = 50000;

  // Test 6.1: Benchmark de escapeHTML bajo estrés
  const startEscape = performance.now();
  for (let i = 0; i < iterations; i++) {
    escapeHTML('<div class="test" onclick="alert(1)">Hola & Adiós</div>');
  }
  const endEscape = performance.now();
  const escapeDuration = endEscape - startEscape;
  console.log(`  ✔ escapeHTML ejecutó ${iterations} llamadas en ${escapeDuration.toFixed(2)} ms (${(escapeDuration / iterations * 1000).toFixed(4)} µs/op)`);
  assert.ok(escapeDuration < 500, 'El escape XSS debe procesar 50k iteraciones en menos de 500ms');

  // Test 6.2: Benchmark de Regex de Correo Electrónico
  const testEmails = [
    'usuario.valido@empresa.com.ec',
    'correo_invalido_sin_arroba',
    'otro.mas+alias@dominio-complejo.org'
  ];

  const startRegex = performance.now();
  for (let i = 0; i < iterations; i++) {
    emailRegex.test(testEmails[i % testEmails.length]);
  }
  const endRegex = performance.now();
  const regexDuration = endRegex - startRegex;
  console.log(`  ✔ Regex de Email ejecutó ${iterations} evaluaciones en ${regexDuration.toFixed(2)} ms (${(regexDuration / iterations * 1000).toFixed(4)} µs/op)`);
  assert.ok(regexDuration < 500, 'La validación por regex debe procesar 50k operaciones en menos de 500ms');

  console.log('L6 Status: 100% OK\n');
}

module.exports = runL6Tests;
if (require.main === module) runL6Tests();
