import child from 'child_process';
import { resolve } from 'path';
import { chromium } from 'playwright-chromium';

const __root = process.cwd();

async function run() {
  console.log('[ci] starting');

  await /** @type {Promise<void>} */ (
    new Promise((fulfill) => {
      const runvite = child.fork(
        resolve(__root, 'node_modules', 'vite', 'bin', 'vite.js'),
        ['--port', '60173', '--no-open'],
        {
          stdio: 'pipe',
        },
      );

      process.on('exit', () => runvite.kill());

      runvite.stderr.on('data', (data) => {
        console.log('stderr', String(data));
      });

      runvite.stdout.on('data', (data) => {
        const chunk = String(data);
        if (chunk.includes('Local') && chunk.includes('60173')) {
          fulfill(1);
        }
      });

      console.log('[ci] spawning');
    })
  );

  console.log('[ci] spawned');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('[ci] playwright launched');

  const result = await /** @type {Promise<void>} */ (
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (fulfill) => {
      const page = await browser.newPage();

      page.on('pageerror', (msg) => {
        console.error(msg);
        fulfill(1);
      });

      page.on('console', (msg) => {
        const text = msg.text();
        if (text.includes('HARNESS') && text.startsWith('{')) {
          try {
            const parsed = JSON.parse(text);
            if (parsed.type === '[HARNESS] done') {
              console.log('[HARNESS] summary:', parsed);
              return fulfill(parsed.failed > 0 ? 1 : 0);
            }
          } catch (e) {
            console.log(e);
          }
        }
        if (msg.type() === 'error' || text.includes('failed:') || text.startsWith('# module:') || text.startsWith('not ok')) {
          console.log(text);
        }
      });

      let params = '';
      if (process.argv.includes('update-snapshots')) {
        params = '&save-snapshots';
      }
      for (let i = 2; i < process.argv.length; i++) {
        if (process.argv[i] === '--filter' && process.argv[i + 1]) {
          params += `&filter=${encodeURIComponent(process.argv[i + 1])}`;
          i++;
        }
      }
      console.log('[ci] navigating to url with params:', params);
      // Test completion is signaled by the '[HARNESS] done' console message
      // above, not by this navigation. Vite's first compile of the test
      // bundle (incl. vendor.css) can take well over a minute in CI, so
      // waiting for the 'load' event here can time out long before the
      // harness is actually done; only wait for navigation to commit.
      await page.goto('http://localhost:60173/tests/?hidepassed&ci' + params, {
        waitUntil: 'commit',
      });
    })
  );

  await browser.close();

  process.exit(result);
}

run();