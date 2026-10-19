import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  find,
  settled,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import Popover, { PopoverContent } from '#src/components/popover.gts';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import { nonce } from '../helpers';

module('Integration | Component | Popover', (hooks) => {
  setupRenderingTest(hooks);

  test('renders the container and content', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').exists();
    assert.dom('.cds--popover-container').hasClass('cds--popover--open');
    assert.dom('.cds--popover').exists();
    assert.dom('.cds--popover-content').hasText('Content');
    assert.dom('.cds--popover-caret').exists();
  });

  test('@open={{false}} does not add the open class', async function (assert) {
    await render(
      <template>
        <Popover @open={{false}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--open');
  });

  test('defaults to bottom alignment and caret enabled', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--bottom');
    assert.dom('.cds--popover-container').hasClass('cds--popover--caret');
    assert.dom('.cds--popover-container').hasClass('cds--popover--drop-shadow');
  });

  test('@align maps deprecated values to the new alignment classes', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @align="top-left">
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--top-start');
  });

  test('@caret={{false}} removes the caret class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @caret={{false}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--caret');
  });

  test('@dropShadow={{false}} removes the drop shadow class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @dropShadow={{false}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .doesNotHaveClass('cds--popover--drop-shadow');
  });

  test('@border adds the border class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @border={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--border');
  });

  test('@highContrast adds the high-contrast class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @highContrast={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .hasClass('cds--popover--high-contrast');
  });

  test('@backgroundToken="background" adds the background-token class', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @backgroundToken="background">
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert
      .dom('.cds--popover-container')
      .hasClass('cds--popover--background-token__background');
  });

  test('@isTabTip adds the tab-tip class and defaults to bottom-start alignment', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @isTabTip={{true}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('.cds--popover-container').hasClass('cds--popover--tab-tip');
    assert
      .dom('.cds--popover-container')
      .hasClass('cds--popover--bottom-start');
    assert.dom('button').hasClass('cds--popover--tab-tip__button');
  });

  test('@as renders a custom element type', async function (assert) {
    await render(
      <template>
        <Popover @open={{true}} @as="div">
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.dom('div.cds--popover-container').exists();
    assert.dom('span.cds--popover-container').doesNotExist();
  });

  test('clicking outside the popover calls onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <div id="outside">outside</div>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    assert.true(open.value);
    await click('#outside');
    assert.false(open.value);
  });

  test('clicking inside the popover content does not call onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    await click('.cds--popover-content');
    assert.true(open.value);
  });

  test('a drag from the content to outside does not call onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <div id="outside">outside</div>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    await triggerEvent('.cds--popover-content', 'pointerdown');
    await triggerEvent('#outside', 'click', { detail: 1 });
    assert.true(open.value);

    await triggerEvent('#outside', 'pointerdown');
    await triggerEvent('#outside', 'click', { detail: 1 });
    assert.false(open.value);
  });

  test('a keyboard click outside after a press inside calls onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <button type="button" id="outside">outside</button>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      </template>,
    );

    await triggerEvent('.cds--popover-content', 'pointerdown');
    await triggerEvent('#outside', 'click', { detail: 0 });
    assert.false(open.value);
  });

  test('pressing Escape while focus is inside the content calls onRequestClose', async function (assert) {
    const open = tracked(true);
    const onRequestClose = () => (open.value = false);

    await render(
      <template>
        <Popover @open={{open.value}} @onRequestClose={{onRequestClose}}>
          <button type="button">Trigger</button>
          <PopoverContent>
            <button type="button" id="inner">Inner</button>
          </PopoverContent>
        </Popover>
      </template>,
    );

    await triggerKeyEvent('#inner', 'keydown', 'Escape');
    assert.false(open.value);
  });

  test('listens on the document only while open with @onRequestClose', async function (assert) {
    const listening = new Map<string, number>();
    const count = (type: string) => listening.get(type) ?? 0;
    // Only ever called with .apply(document, …).
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { addEventListener, removeEventListener } = document;
    document.addEventListener = (
      ...args: Parameters<typeof addEventListener>
    ) => {
      listening.set(args[0], count(args[0]) + 1);
      addEventListener.apply(document, args);
    };
    document.removeEventListener = (
      ...args: Parameters<typeof removeEventListener>
    ) => {
      listening.set(args[0], count(args[0]) - 1);
      removeEventListener.apply(document, args);
    };

    const open = tracked(true);
    const onRequestClose = () => (open.value = false);
    const closable = tracked(false);

    try {
      await render(
        <template>
          <Popover
            @open={{open.value}}
            @onRequestClose={{if closable.value onRequestClose}}
          >
            <button type="button">Trigger</button>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </template>,
      );
      assert.strictEqual(count('keydown'), 0, 'no @onRequestClose');
      assert.strictEqual(count('click'), 0, 'no @onRequestClose');

      closable.value = true;
      await settled();
      assert.strictEqual(count('keydown'), 1);
      assert.strictEqual(count('click'), 1);

      open.value = false;
      await settled();
      assert.strictEqual(count('keydown'), 0, 'closed');
      assert.strictEqual(count('click'), 0, 'closed');
    } finally {
      document.addEventListener = addEventListener;
      document.removeEventListener = removeEventListener;
    }
  });

  module('floating mode (@autoAlign)', () => {
    test('adds the auto-align classes and puts the caret inside the content', async function (assert) {
      await render(
        <template>
          <Popover @open={{false}} @autoAlign={{true}}>
            <button type="button">Trigger</button>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </template>,
      );

      assert
        .dom('.cds--popover-container')
        .hasClass('cds--popover--auto-align')
        .hasClass('cds--autoalign');
      assert
        .dom('.cds--popover-content > .cds--popover-caret')
        .hasClass('cds--popover--auto-align');
      assert.dom('.cds--popover > .cds--popover-caret').doesNotExist();
    });

    test('renders the open content in the top layer, below the trigger', async function (assert) {
      await render(
        <template>
          <Popover @open={{true}} @autoAlign={{true}}>
            <button type="button">Trigger</button>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </template>,
      );

      const content = find('.cds--popover-content') as HTMLElement;
      const trigger = find('button')!;
      assert.true(content.matches(':popover-open'));
      assert.strictEqual(content.style.position, 'fixed');
      assert.dom('.cds--popover-container').hasClass('cds--popover--bottom');
      assert.true(
        content.getBoundingClientRect().top >
          trigger.getBoundingClientRect().bottom,
      );
      const caret = find(
        '.cds--popover-content > .cds--popover-caret',
      ) as HTMLElement;
      assert.strictEqual(caret.style.top, '-6px', 'caret sits on the top edge');
      assert.notStrictEqual(
        caret.style.left,
        '',
        'caret is centred by Floating UI',
      );
    });

    test('@alignmentAxisOffset shifts aligned placements', async function (assert) {
      await render(
        <template>
          {{! Wide enough that the caret fits without shifting the content }}
          <style nonce={{nonce}}>
            .offset-test__trigger {
              width: 12rem;
            }
          </style>
          <Popover
            @open={{true}}
            @align="bottom-start"
            @autoAlign={{true}}
            @alignmentAxisOffset={{20}}
          >
            <button class="offset-test__trigger" type="button">Trigger</button>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </template>,
      );

      const content = find('.cds--popover-content')!.getBoundingClientRect();
      const trigger = find('button')!.getBoundingClientRect();
      assert.strictEqual(Math.round(content.left - trigger.left), 20);
    });

    test('hides the content while the trigger is scrolled out of its scroll container', async function (assert) {
      await render(
        <template>
          <style nonce={{nonce}}>
            .hide-test__scroller {
              height: 4rem;
              overflow: auto;
            }
            .hide-test__spacer {
              height: 40rem;
            }
          </style>
          <div class="hide-test__scroller">
            <div class="hide-test__spacer"></div>
            <Popover @open={{true}} @autoAlign={{true}}>
              <button type="button">Trigger</button>
              <PopoverContent>Content</PopoverContent>
            </Popover>
          </div>
        </template>,
      );

      const trigger = find('button')!.getBoundingClientRect();
      const scroller = find('.hide-test__scroller')!.getBoundingClientRect();
      assert.true(trigger.top > scroller.bottom, 'clipped by the scroller');
      assert.true(trigger.bottom < window.innerHeight, 'inside the viewport');
      assert.strictEqual(
        (find('.cds--popover-content') as HTMLElement).style.visibility,
        'hidden',
      );
    });

    test('leaves the top layer when it closes', async function (assert) {
      const open = tracked(true);

      await render(
        <template>
          <Popover @open={{open.value}} @autoAlign={{true}}>
            <button type="button">Trigger</button>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </template>,
      );

      open.value = false;
      await settled();

      assert.dom('.cds--popover-content').doesNotHaveAttribute('popover');
      assert.strictEqual(
        (find('.cds--popover-content') as HTMLElement).style.position,
        '',
      );
    });

    test('flips to a side that fits within @autoAlignBoundary', async function (assert) {
      const boundary = tracked<HTMLElement | undefined>(undefined);
      const setBoundary = modifier((element: HTMLElement) => {
        boundary.value = element;
      });

      await render(
        <template>
          <style nonce={{nonce}}>
            .flip-test__boundary {
              width: 16rem;
              height: 20rem;
            }
            .flip-test__popover {
              display: block;
            }
            .flip-test__trigger {
              display: block;
              width: 100%;
              height: 2rem;
            }
            .flip-test__content {
              width: 4rem;
              height: 4rem;
            }
          </style>
          <div class="flip-test__boundary" {{setBoundary}}>
            {{#if boundary.value}}
              <Popover
                class="flip-test__popover"
                @open={{true}}
                @align="top"
                @autoAlign={{true}}
                @autoAlignBoundary={{boundary.value}}
              >
                <button
                  class="flip-test__trigger"
                  type="button"
                >Trigger</button>
                <PopoverContent class="flip-test__content">
                  Content
                </PopoverContent>
              </Popover>
            {{/if}}
          </div>
        </template>,
      );

      assert.dom('.cds--popover-container').hasClass('cds--popover--bottom');
    });

    test('connects content rendered after the popover', async function (assert) {
      const show = tracked(false);

      await render(
        <template>
          <Popover @open={{true}} @autoAlign={{true}}>
            <button type="button">Trigger</button>
            {{#if show.value}}
              <PopoverContent>Content</PopoverContent>
            {{/if}}
          </Popover>
        </template>,
      );

      show.value = true;
      await settled();

      const content = find('.cds--popover-content') as HTMLElement;
      assert.dom('.cds--popover-content > .cds--popover-caret').exists();
      assert.true(content.matches(':popover-open'));
      assert.strictEqual(content.style.position, 'fixed');
    });

    test('positions content that replaces the previous one while open', async function (assert) {
      const first = tracked(true);

      await render(
        <template>
          <Popover @open={{true}} @autoAlign={{true}}>
            <button type="button">Trigger</button>
            {{#if first.value}}
              <PopoverContent id="first">First</PopoverContent>
            {{else}}
              <PopoverContent id="second">Second</PopoverContent>
            {{/if}}
          </Popover>
        </template>,
      );

      first.value = false;
      await settled();

      const content = find('#second') as HTMLElement;
      assert.true(content.matches(':popover-open'));
      assert.strictEqual(content.style.position, 'fixed');
    });

    test('moves the caret back when @autoAlign is turned off', async function (assert) {
      const autoAlign = tracked(true);

      await render(
        <template>
          <Popover @open={{true}} @autoAlign={{autoAlign.value}}>
            <button type="button">Trigger</button>
            <PopoverContent>Content</PopoverContent>
          </Popover>
        </template>,
      );

      autoAlign.value = false;
      await settled();

      assert
        .dom('.cds--popover-container')
        .doesNotHaveClass('cds--popover--auto-align');
      assert.dom('.cds--popover > .cds--popover-caret').exists();
      assert.dom('.cds--popover-content').doesNotHaveAttribute('popover');
    });
  });
});
