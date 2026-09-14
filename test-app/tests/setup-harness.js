import { autoRegister } from 'js-reporters';
import QUnit from 'qunit';

export function setupQunit() {
  const runnerFailedTests = [];
  if (hasFlag('ci')) {
    const runner = autoRegister();
    const tap = QUnit.reporters.tap;
    tap.init(runner, { log: console.info });
    runner.on('testEnd', (test) => {
      if (test.status !== 'passed' && test.status !== 'skipped') {
        runnerFailedTests.push(`${test.status}: ${test.fullName.join(' > ')}`);
      }
    });
    runner.on('error', (error) => {
      runnerFailedTests.push(`GLOBAL ERROR: ${String(error && error.message || error)}`);
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

  const failedTests = [];
  QUnit.testDone((details) => {
    if (details.failed > 0) {
      failedTests.push(`${details.module} > ${details.name}`);
    }
  });

  QUnit.done((details) => {
    console.log(JSON.stringify({ ...details, type: '[HARNESS] done' }));
    console.log(
      JSON.stringify({
        failedTests,
        runnerFailedTests,
        type: '[HARNESS] failed-tests',
      }),
    );
  });
}

function hasFlag(flag) {
  let location = typeof window !== 'undefined' && window.location;
  return location && new RegExp(`[?&]${flag}`).test(location.search);
}
