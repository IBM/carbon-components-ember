import { module, test } from 'qunit';
import { setupApplicationTest, setupRenderingTest } from 'ember-qunit';
import { click, find, render } from '@ember/test-helpers';
import EmptyState from '#src/components/ibm-products/empty-state.gts';
import NoDataEmptyState from '#src/components/ibm-products/no-data-empty-state.gts';
import { setupRoutes, visitWith } from '../../helpers';

module('Integration | Component | IBM Products | EmptyState', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders its title, subtitle and image', async function (assert) {
    await render(
      <template>
        <EmptyState
          class="extra"
          @title="No assets"
          @subtitle="Upload one to start"
          @illustration="empty.svg"
          @illustrationDescription="An empty box"
          @illustrationPosition="left"
        />
      </template>,
    );

    assert
      .dom('.c4p--empty-state')
      .hasClass('extra')
      .hasClass('c4p--empty-state-position--left');
    assert
      .dom('img.c4p--empty-state__illustration')
      .hasAttribute('src', 'empty.svg')
      .hasAttribute('alt', 'An empty box')
      .hasClass('c4p--empty-state__illustration--lg');
    assert.dom('section h2.c4p--empty-state__header').hasText('No assets');
    assert.dom('.c4p--empty-state__subtitle').hasText('Upload one to start');
  });

  test('its action and link show once they have somewhere to go', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    const upload = { text: 'Upload', onClick };
    const textOnly = { text: 'Upload' };
    const link = { text: 'Learn more', href: '/docs' };

    await render(
      <template>
        <EmptyState @title="No assets" @action={{textOnly}} />
      </template>,
    );
    assert.dom('.c4p--empty-state__action-button').doesNotExist();

    await render(
      <template>
        <EmptyState @title="No assets" @action={{upload}} @link={{link}} />
      </template>,
    );
    assert
      .dom('button.c4p--empty-state__action-button')
      .hasClass('cds--btn--tertiary')
      .hasClass('cds--btn--sm')
      .hasText('Upload');
    await click('.c4p--empty-state__action-button');
    assert.strictEqual(clicks, 1);
    assert
      .dom('a.c4p--empty-state__link')
      .hasAttribute('href', '/docs')
      .hasText('Learn more');
  });

  test('a subtitle block, a heading level, and a link that can open elsewhere', async function (assert) {
    const docs = { text: 'Docs', href: '/docs', target: '_blank' };
    const nowhere = { text: 'Nowhere' };
    const disabledAction = {
      text: 'Upload',
      onClick: () => {},
      disabled: true,
    };
    await render(
      <template>
        <EmptyState
          @title="No assets"
          @subtitle="Ignored"
          @headingAs="h1"
          @link={{docs}}
          @action={{disabledAction}}
        >
          <:subtitle>Read the <a href="/guide" id="guide">guide</a></:subtitle>
        </EmptyState>
        <EmptyState @title="No link" @link={{nowhere}} id="nowhere" />
      </template>,
    );

    assert.dom('h1.c4p--empty-state__header').hasText('No assets');
    assert.dom('.c4p--empty-state__subtitle').hasText('Read the guide');
    assert.dom('.c4p--empty-state__subtitle #guide').exists();
    assert
      .dom('a.c4p--empty-state__link')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'noopener');
    assert.dom('.c4p--empty-state__action-button').isDisabled();
    assert.dom('#nowhere .c4p--empty-state__link').doesNotExist();
    assert.dom('#nowhere .c4p--empty-state__subtitle').doesNotExist();
  });

  test("Carbon for IBM Products' styles load with it", async function (assert) {
    await render(<template><EmptyState @title="No assets" /></template>);

    assert.strictEqual(
      getComputedStyle(find('.c4p--empty-state')!).display,
      'flex',
    );
  });

  test('a variant draws its illustration in the theme and size asked for', async function (assert) {
    await render(
      <template>
        <NoDataEmptyState
          @title="No data"
          @illustrationTheme="dark"
          @size="sm"
        />
      </template>,
    );

    assert
      .dom('.c4p--empty-state')
      .hasClass('c4p--empty-state-type--noData')
      .hasClass('c4p--empty-state-position--top');
    assert
      .dom('svg.c4p--empty-state__illustration-noData')
      .hasClass('c4p--empty-state__illustration--sm');
    assert.dom('svg title').hasText('No data');
    assert.dom('linearGradient[id^="prefix__a_dark_"]').exists();
    assert.dom('.c4p--empty-state__header--small').hasText('No data');
  });
});

module(
  'Integration | Component | IBM Products | EmptyState > with @route',
  function (hooks) {
    setupApplicationTest(hooks);
    setupRoutes(hooks);

    test('its action and link can go to a route', async function (assert) {
      const toSettings = { text: 'Settings', route: 'settings' };
      const link = { text: 'Ada', route: 'user', models: ['42'] };
      await visitWith(
        this,
        <template>
          <EmptyState
            @title="No assets"
            @action={{toSettings}}
            @link={{link}}
          />
        </template>,
      );

      assert.dom('a.c4p--empty-state__link').hasAttribute('href', '/users/42');
      await click('.c4p--empty-state__action-button');
      const router = this.owner.lookup('service:router');
      assert.strictEqual(router.currentURL, '/settings');
    });

    test('its action and link can go to an external route', async function (assert) {
      const toSettings = { text: 'Settings', externalRoute: 'settings' };
      const link = { text: 'Ada', externalRoute: 'user', models: ['42'] };
      await visitWith(
        this,
        <template>
          <EmptyState
            @title="No assets"
            @action={{toSettings}}
            @link={{link}}
          />
        </template>,
      );

      assert.dom('a.c4p--empty-state__link').hasAttribute('href', '/users/42');
      assert
        .dom('a.c4p--empty-state__action-button')
        .hasAttribute('href', '/settings');
    });
  },
);
