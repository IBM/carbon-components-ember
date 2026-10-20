import { defineConfig } from 'vite';
import { extensions, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const packageDir = dirname(fileURLToPath(import.meta.url));
const configDir = resolve(packageDir, '.storybook');

/**
 * Story screenshots (see .storybook/vitest.setup.ts), one folder per
 * component and one file per story, named for the platform that took them:
 * macOS renders fonts differently from CI's Linux.
 */
const screenshotDir = resolve(packageDir, '__screenshots__');
const screenshotSuffix = `-chromium-${process.platform}.png`;

/** The stories with a screenshot to compare with on this platform. */
function storiesWithScreenshots() {
  if (!existsSync(screenshotDir)) return [];
  return readdirSync(screenshotDir, { recursive: true })
    .filter((file) => file.endsWith(screenshotSuffix))
    .map((file) => file.slice(0, -screenshotSuffix.length));
}

/**
 * Carbon's stylesheet loads IBM Plex from IBM's CDN. A browser command the
 * story tests call first, so screenshots depend neither on the network nor
 * on what the CDN serves today: it serves the fonts from the `@ibm/plex-*`
 * packages @carbon/styles installs.
 */
const plexOnCdn =
  /^https:\/\/1\.www\.s81c\.com\/common\/carbon\/plex\/fonts\/IBM-Plex-([\w-]+)\/(fonts\/.+)$/;
const fromCarbon = createRequire(
  createRequire(import.meta.url).resolve('@carbon/styles/package.json'),
);
const servingPlex = new WeakSet();

async function servePlexLocally({ context }) {
  if (servingPlex.has(context)) return;
  servingPlex.add(context);
  await context.route(plexOnCdn, (route) => {
    const [, family, file] = plexOnCdn.exec(route.request().url());
    const plex = fromCarbon.resolve(
      `@ibm/plex-${family.toLowerCase()}/package.json`,
    );
    return route.fulfill({
      path: join(dirname(plex), file),
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  });
}

/**
 * Lets `assert.snapshot()` write style snapshots while running the tests
 * through `vite dev` (open /tests/?save-snapshots). `pnpm test` uses the
 * equivalent testem middleware instead.
 */
function snapshotWriter() {
  return {
    name: 'snapshot-writer',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'POST' || !req.url?.startsWith('/__snapshots__/')) {
          return next();
        }
        const file = resolve('tests', '.' + decodeURI(req.url));
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, body);
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

/**
 * Logs requests that fail or are cut off while the stories run, so a story
 * file that fails to load in CI ("Failed to fetch dynamically imported
 * module") shows whether the server answered with an error or the browser
 * gave up on it. Requests still in flight when a test's iframe closes, or
 * when the run ends, are logged too; look for the failing story's own
 * request, just before its failure.
 */
function logFailedRequests() {
  return {
    name: 'log-failed-requests',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const start = Date.now();
        let finished = false;
        const log = (outcome) =>
          console.error(
            `[requests] ${new Date().toISOString()} ${outcome} ${req.url} (${Date.now() - start}ms)`,
          );
        res.on('finish', () => {
          finished = true;
          if (res.statusCode >= 400) log(res.statusCode);
        });
        res.on('close', () => {
          if (!finished) log('cut off');
        });
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    ember(),
    babel({
      babelHelpers: 'inline',
      extensions,
    }),
    snapshotWriter(),
  ],
  build: {
    // This build only bundles the tests. Leave CSS unminified so style
    // snapshots compare Carbon's own CSS, not a minifier's rewrite of it
    // (Lightning CSS turns `background: none` into a 0px 0px position).
    cssMinify: false,
    rollupOptions: {
      input: {
        tests: 'tests/index.html',
      },
    },
  },
  // `pnpm test:storybook` runs every story (and its `play` function) as a
  // browser test. The QUnit suite still runs through testem (`pnpm test`).
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          logFailedRequests(),
          storybookTest({
            configDir,
            storybookScript: 'pnpm storybook --no-open',
          }),
        ],
        // Babel compiles TypeScript (and its decorators, e.g. @tracked).
        // @embroider/vite only turns Vite's oxc transform off when nothing has
        // configured it yet, but Vitest's own config hook runs first and sets
        // it. Drop once embroider-build/embroider#2826 is released.
        oxc: false,
        optimizeDeps: {
          // Scan every story up front, so dependencies aren't discovered
          // mid-run (Vite then reloads the page and the run breaks).
          entries: ['.storybook/preview.ts', 'src/**/*.stories.{gjs,gts}'],
          // Imports Vite would otherwise only discover mid-run and then reload
          // the tests for: the addons the CSF Next preview (imported by every
          // story) registers.
          include: [
            '@storybook/addon-a11y',
            // Loaded lazily by @storybook/addon-a11y.
            '@storybook/addon-a11y > axe-core',
            // Pulled in by the Ember app ember-storybook boots.
            'ember-page-title',
            'ember-page-title/services/page-title',
            '@storybook/addon-docs',
            '@storybook/addon-themes',
            '@storybook/addon-vitest',
          ],
        },
        test: {
          name: 'storybook',
          setupFiles: ['.storybook/vitest.setup.ts'],
          provide: {
            storyScreenshots: {
              stories: storiesWithScreenshots(),
              // Report differences without failing (CI does when a PR has
              // the `preview` label).
              report: process.env.STORY_SCREENSHOTS === 'report',
            },
          },
          browser: {
            enabled: true,
            // A cold run pre-bundles the whole Ember dependency graph before
            // the browser can connect, which takes longer than the default.
            connectTimeout: 180_000,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
            commands: { servePlexLocally },
            expect: {
              toMatchScreenshot: {
                resolveScreenshotPath: ({ arg, browserName, platform, ext }) =>
                  join(
                    screenshotDir,
                    `${arg}-${browserName}-${platform}${ext}`,
                  ),
              },
            },
          },
        },
      },
    ],
  },
});
