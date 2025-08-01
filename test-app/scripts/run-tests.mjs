import child from 'child_process';
import { resolve } from 'path';
import PCR from 'puppeteer-chromium-resolver';

const __root = process.cwd();

async function run() {
  const { puppeteer, executablePath } = await PCR({
    revision: 1466950
  });
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
        console.log('stdout', chunk);
        if (chunk.includes('Local') && chunk.includes('60173')) {
          fulfill(1);
        }
      });

      console.log('[ci] spawning');
    })
  );

  console.log('[ci] spawned');

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('[ci] puppeteer launched');

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
        const location = msg.location();
        if (text.includes('HARNESS')) {
          try {
            const parsed = JSON.parse(text);
            if (parsed.type === '[HARNESS] done') {
              return fulfill(parsed.failed > 0 ? 1 : 0);
            }
          } catch (e) {
            console.log(e);
          }
        }
        if (location.url?.includes(`/qunit.js`)) {
          console.log(text);
        } else {
          console.debug(text);
        }
      });

      let params = '';
      if (process.argv[2] === 'update-snapshots') {
        params = '&save-snapshots';
      }
      await page.goto('http://localhost:60173/tests/?hidepassed&ci' + params);
    })
  );

  await browser.close();

  process.exit(result);
}

run();
