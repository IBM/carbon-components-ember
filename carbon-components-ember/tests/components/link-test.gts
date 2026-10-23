import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import Link from '#src/components/link.gts';
import { Add } from '#src/icons.ts';
import { setupRoutes } from '../helpers';

module('Integration | Component | Link', (hooks) => {
  setupRenderingTest(hooks);

  test('should render an anchor with an href', async function (assert) {
    await render(
      <template>
        <Link @href="/foo">Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').exists();
    assert.dom('a.cds--link').hasAttribute('href', '/foo');
    assert.dom('a.cds--link').hasText('Link text');
  });

  test('should apply the inline class', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @inline={{true}}>Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').hasClass('cds--link--inline');
  });

  test('should apply the visited class', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @visited={{true}}>Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').hasClass('cds--link--visited');
  });

  test('should apply the size class', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @size="lg">Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').hasClass('cds--link--lg');
  });

  test('should render the disabled state without an href', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @disabled={{true}}>Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').hasClass('cds--link--disabled');
    assert.dom('a.cds--link').doesNotHaveAttribute('href');
    assert.dom('a.cds--link').hasAttribute('role', 'link');
    assert.dom('a.cds--link').hasAttribute('aria-disabled', 'true');
  });

  test('should add rel=noopener when target is _blank', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @target="_blank">Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').hasAttribute('rel', 'noopener');
  });

  test('should call onClick when clicked', async function (assert) {
    let called = false;
    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      called = true;
    };

    await render(
      <template>
        <Link @href="/foo" @onClick={{onClick}}>Link text</Link>
      </template>,
    );
    await click('a.cds--link');

    assert.true(called);
  });

  test('should not call onClick when disabled', async function (assert) {
    let called = false;
    const onClick = () => (called = true);

    await render(
      <template>
        <Link @href="/foo" @disabled={{true}} @onClick={{onClick}}>Link text</Link>
      </template>,
    );
    await click('a.cds--link');

    assert.false(called);
  });

  test('should render a renderIcon component', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @renderIcon={{Add}}>Link text</Link>
      </template>,
    );

    assert.dom('a.cds--link').hasClass('cds--link--icon');
    assert
      .dom('.cds--link__icon svg')
      .hasAttribute('width', '16', 'drawn at 16px, as Carbon React');
  });

  test('should not render the icon wrapper when inline', async function (assert) {
    await render(
      <template>
        <Link @href="/foo" @inline={{true}} @renderIcon={{Add}}>Link text</Link>
      </template>,
    );

    assert.dom('.cds--link__icon').doesNotExist();
  });

  test('should render as a different element when @as is provided', async function (assert) {
    await render(
      <template>
        <Link @as="span">Link text</Link>
      </template>,
    );

    assert.dom('span.cds--link').exists();
  });

  module('with @route', function (hooks) {
    setupRoutes(hooks);

    test('links to the route, and navigates there with the router', async function (assert) {
      const models = ['42'];
      const query = { tab: 'profile' };
      await render(
        <template>
          <Link @route="user" @models={{models}} @query={{query}}>Ada</Link>
          <Link @route="settings" id="settings">Settings</Link>
        </template>,
      );
      assert.dom('a.cds--link').hasAttribute('href', '/users/42?tab=profile');
      assert.dom('#settings').doesNotHaveClass('active');

      await click('#settings');
      const router = this.owner.lookup('service:router');
      assert.strictEqual(router.currentURL, '/settings');
      assert.dom('#settings').hasClass('active');
    });

    test('a click handler can cancel the navigation, as in React Router', async function (assert) {
      const cancel = (event: MouseEvent) => event.preventDefault();
      await render(
        <template>
          <Link @route="settings" @onClick={{cancel}}>Settings</Link>
        </template>,
      );
      await click('a.cds--link');
      const router = this.owner.lookup('service:router');
      assert.notStrictEqual(router.currentRouteName, 'settings');
    });

    test('a disabled one is no link', async function (assert) {
      await render(
        <template>
          <Link @route="settings" @disabled={{true}}>Settings</Link>
        </template>,
      );
      assert
        .dom('.cds--link')
        .doesNotHaveAttribute('href')
        .hasAttribute('aria-disabled', 'true');
    });
  });
});
