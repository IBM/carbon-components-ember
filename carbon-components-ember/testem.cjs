'use strict';

const { mkdirSync, writeFileSync } = require('node:fs');
const { dirname, join } = require('node:path');
const { chromium } = require('playwright-chromium');

/**
 * Lets `assert.snapshot()` (tests/setup-snapshot.ts) write new or updated
 * style snapshots back into tests/__snapshots__.
 */
function snapshotWriter(app) {
  app.post(/^\/__snapshots__\//, (req, res) => {
    const file = join(__dirname, 'tests', decodeURI(req.path));
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, body);
      res.sendStatus(204);
    });
  });
}

const testPage = process.env.UPDATE_SNAPSHOTS
  ? 'tests/index.html?hidepassed&save-snapshots'
  : 'tests/index.html?hidepassed';

if (typeof module !== 'undefined') {
  module.exports = {
    test_page: testPage,
    cwd: 'dist-tests',
    disable_watching: true,
    launch_in_ci: ['Chrome'],
    launch_in_dev: ['Chrome'],
    // Style snapshots depend on the exact browser build, so run against
    // Playwright's pinned Chromium instead of whatever Chrome is installed.
    browser_paths: {
      Chrome: chromium.executablePath(),
    },
    middleware: [snapshotWriter],
    browser_start_timeout: 120,
    browser_args: {
      Chrome: {
        ci: [
          // --no-sandbox is needed when running Chrome inside a container
          process.env.CI ? '--no-sandbox' : null,
          '--headless=new',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--mute-audio',
          '--remote-debugging-port=0',
          '--window-size=1440,900',
          // Matches what Playwright passes by default, and what the style
          // snapshots were recorded with: Linux draws classic scrollbars,
          // which would otherwise eat 15px of the (50%-zoomed) test container.
          '--hide-scrollbars',
        ].filter(Boolean),
      },
    },
  };
}
