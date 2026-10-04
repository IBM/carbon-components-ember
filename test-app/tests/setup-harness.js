import { autoRegister } from 'js-reporters';
import QUnit from 'qunit';

export function setupQunit() {
  if (hasFlag('ci')) {
    QUnit.testDone((details) => {
      if (details.failed > 0) {
        console.error(`not ok ${details.module} > ${details.name}`);
        details.assertions.forEach((assertion) => {
          if (!assertion.result) {
            console.error(`  ${assertion.message || 'Assertion failed'}`);
            if (assertion.actual !== undefined || assertion.expected !== undefined) {
              console.error(`    actual: ${JSON.stringify(assertion.actual)}`);
              console.error(`    expected: ${JSON.stringify(assertion.expected)}`);
            }
          }
        });
      }
    });

    QUnit.config.urlConfig.push({
      id: 'smoke_tests',
      label: 'Enable Smoke Tests',
      tooltip: 'Enable Smoke Tests',
    });

    QUnit.config.urlConfig.push({
      id: 'ci',
      label: 'Enable CI Mode',
      tooltip:
        'CI mode makes tests run faster by sacrificing UI responsiveness',
    });

    console.log(`[HARNESS] ci=${hasFlag('ci')}`);
  }

  QUnit.done((details) => {
    console.log(JSON.stringify({ ...details, type: '[HARNESS] done' }));
  });
}

function hasFlag(flag) {
  let location = typeof window !== 'undefined' && window.location;
  return location && new RegExp(`[?&]${flag}`).test(location.search);
}
