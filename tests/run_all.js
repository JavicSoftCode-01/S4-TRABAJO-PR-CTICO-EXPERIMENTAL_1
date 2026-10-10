const runL1 = require('./L1_unit_tests.test.js');
const runL2 = require('./L2_module_component_tests.test.js');
const runL3 = require('./L3_integration_tests.test.js');
const runL4 = require('./L4_contract_api_tests.test.js');
const runL5 = require('./L5_system_tests.test.js');
const runL6 = require('./L6_performance_stress_tests.test.js');
const runL7 = require('./L7_acceptance_e2e_tests.test.js');

console.log('================================================================');
console.log('INICIANDO VERIFICACIÓN DE LAS 7 CAPAS DE PRUEBAS DE INGENIERÍA');
console.log('================================================================\n');

try {
  runL1();
  runL2();
  runL3();
  runL4();
  runL5();
  runL6();
  runL7();

  console.log('================================================================');
  console.log('RESULTADO FINAL: TODAS LAS 7 CAPAS COMPLETADAS - 100% OK (GREEN)');
  console.log('================================================================');
} catch (error) {
  console.error('\n❌ FALLO EN LA SUITE DE PRUEBAS:');
  console.error(error);
  process.exit(1);
}
