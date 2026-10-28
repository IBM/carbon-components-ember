import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, focus, render, triggerKeyEvent } from '@ember/test-helpers';
import MenuButton from '#src/components/menu-button.gts';
import { waitForAnimationFrame } from '../helpers';

module('Integration | Component | MenuButton', (hooks) => {
  setupRenderingTest(hooks);

  // The menu renders into `@menuTarget`, here a container outside the
  // rendering root, as menu-test.gts explains.
  hooks.beforeEach(function (this: { container: HTMLElement }) {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
  });

  hooks.afterEach(function (this: { container: HTMLElement }) {
    this.container.remove();
  });

  test('it opens its menu below the button, as wide as the button', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <MenuButton
          @label="Actions"
          @menuTarget={{target}}
          class="extra"
          as |MenuItem|
        >
          <MenuItem @label="First action" />
          <MenuItem @label="Second action" />
        </MenuButton>
      </template>,
    );

    assert.dom('.cds--menu-button__container').hasClass('extra');
    assert
      .dom('button.cds--menu-button__trigger')
      .hasClass('cds--btn--primary')
      .hasClass('cds--btn--lg')
      .hasAttribute('aria-haspopup', 'true')
      .hasAttribute('aria-expanded', 'false')
      .hasText('Actions');
    assert.dom('[role="menu"]', target).doesNotExist();

    await click('.cds--menu-button__trigger');
    await waitForAnimationFrame();

    const menu = target.querySelector<HTMLElement>('[role="menu"]')!;
    const trigger = document.querySelector('.cds--menu-button__trigger')!;
    assert
      .dom(menu)
      .hasAttribute('aria-label', 'Actions')
      .hasClass('cds--menu-button__bottom')
      .hasClass('cds--autoalign')
      .hasClass('cds--menu--lg');
    assert
      .dom('.cds--menu-button__trigger')
      .hasClass('cds--menu-button__trigger--open')
      .hasAttribute('aria-expanded', 'true')
      .hasAttribute('aria-controls', menu.id);
    assert
      .dom('.cds--menu-button__container')
      .hasAttribute('aria-owns', menu.id);

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    assert.strictEqual(
      Math.round(menuRect.top),
      Math.round(triggerRect.bottom),
    );
    assert.strictEqual(menu.style.width, `${triggerRect.width}px`);

    await click('.cds--menu-button__trigger');
    assert.dom('[role="menu"]', target).doesNotExist('the button closes it');
  });

  test('choosing an item closes the menu', async function (this: {
    container: HTMLElement;
  }, assert) {
    let chosen = 0;
    const choose = () => chosen++;
    const target = this.container;
    await render(
      <template>
        <MenuButton @label="Actions" @menuTarget={{target}} as |MenuItem|>
          <MenuItem @label="First action" @onClick={{choose}} />
        </MenuButton>
      </template>,
    );

    await click('.cds--menu-button__trigger');
    await waitForAnimationFrame();
    await click(target.querySelector('.cds--menu-item')!);

    assert.strictEqual(chosen, 1);
    assert.dom('[role="menu"]', target).doesNotExist();
  });

  test('opened from the keyboard, Escape closes it and focuses the button', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <MenuButton @label="Actions" @menuTarget={{target}} as |MenuItem|>
          <MenuItem @label="First action" />
        </MenuButton>
      </template>,
    );

    await focus('.cds--menu-button__trigger');
    await click('.cds--menu-button__trigger');
    await waitForAnimationFrame();
    assert.dom('.cds--menu-item', target).isFocused();

    await triggerKeyEvent(
      target.querySelector('[role="menu"]')!,
      'keydown',
      'Escape',
    );
    assert.dom('[role="menu"]', target).doesNotExist();
    assert.dom('.cds--menu-button__trigger').isFocused();
  });

  test('@kind, @size, @disabled and @menuAlignment', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <MenuButton
          @label="Actions"
          @kind="ghost"
          @size="sm"
          @menuAlignment="top-end"
          @menuTarget={{target}}
          as |MenuItem|
        >
          <MenuItem @label="First action" />
        </MenuButton>
        <MenuButton
          @label="Disabled"
          @disabled={{true}}
          id="disabled"
          as |MenuItem|
        >
          <MenuItem @label="First action" />
        </MenuButton>
      </template>,
    );

    assert
      .dom('.cds--menu-button__trigger')
      .hasClass('cds--btn--ghost')
      .hasClass('cds--btn--sm');
    assert.dom('#disabled .cds--menu-button__trigger').isDisabled();

    await click('.cds--menu-button__trigger');
    await waitForAnimationFrame();
    assert
      .dom('[role="menu"]', target)
      .hasClass('cds--menu-button__top-end')
      .hasClass('cds--menu--box-shadow-top')
      .hasClass('cds--menu--sm');
  });

  test('it opens above the button with a top alignment, and forwards @tabIndex', async function (this: {
    container: HTMLElement;
  }, assert) {
    const target = this.container;
    await render(
      <template>
        <div id="low">
          <MenuButton
            @label="Actions"
            @menuAlignment="top"
            @menuTarget={{target}}
            @tabIndex={{-1}}
            as |MenuItem|
          >
            <MenuItem @label="First action" />
          </MenuButton>
        </div>
      </template>,
    );

    assert.dom('.cds--menu-button__trigger').hasAttribute('tabindex', '-1');

    // Room above the button, so the menu doesn't flip below it.
    (document.querySelector('#low') as HTMLElement).style.paddingBlockStart =
      '400px';
    await click('.cds--menu-button__trigger');
    await waitForAnimationFrame();
    const menu = target.querySelector('[role="menu"]')!;
    const trigger = document.querySelector('.cds--menu-button__trigger')!;
    assert.strictEqual(
      Math.round(menu.getBoundingClientRect().bottom),
      Math.round(trigger.getBoundingClientRect().top),
    );
  });
});
