import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  focus,
  render,
  rerender,
  settled,
  triggerKeyEvent,
  waitUntil,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { modifier } from 'ember-modifier';
import SidePanel from '#src/components/side-panel.gts';
import Close from '#src/components/icons/close.ts';

const PANEL = 'aside.cds--side-panel';

function spy<T = Event>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

// The panel has arrived once its entrance animation is done.
const arrived = () =>
  waitUntil(
    () =>
      find(PANEL)
        ?.getAnimations()
        .every((animation) => animation.playState === 'finished'),
    { timeout: 3000 },
  );

const capture = modifier(
  (element: HTMLElement, [state]: [{ launcher: HTMLElement | null }]) => {
    state.launcher = element;
  },
);

const LINES = Array.from({ length: 200 }, (_, i) => i);

class State {
  @tracked open = true;
  @tracked step = 0;
  @tracked show = true;
  @tracked launcher: HTMLElement | null = null;
}

module('Integration | Component | SidePanel', function (hooks) {
  setupRenderingTest(hooks);

  module('renders as expected', function () {
    test('it puts class and other attributes on the aside, named by the title', async function (assert) {
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Incident management"
            class="custom"
            data-test-panel
          >
            Content
          </SidePanel>
        </template>,
      );

      assert
        .dom(PANEL)
        .hasClass('custom')
        .hasClass('cds--side-panel--md')
        .hasClass('cds--side-panel--right-placement')
        .hasClass('cds--side-panel--open')
        .hasAttribute('data-test-panel')
        .hasAttribute('aria-label', 'Incident management');
      assert.dom('.cds--side-panel__title-text').hasText('Incident management');
      assert.dom('.cds--side-panel__inner-content').hasText('Content');
    });

    test('it renders nothing while closed', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{false}} @title="Title">Content</SidePanel>
        </template>,
      );

      assert.dom(PANEL).doesNotExist();
    });

    test('it takes @size and @placement', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @size="xl" @placement="left" />
        </template>,
      );

      assert
        .dom(PANEL)
        .hasClass('cds--side-panel--xl')
        .hasClass('cds--side-panel--left-placement');
    });

    test('it shows the label, subtitle and a subtitle block', async function (assert) {
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @labelText="Label"
            @subtitle="Subtitle"
          />
        </template>,
      );

      assert.dom('.cds--side-panel__label-text').hasText('Label');
      assert.dom('.cds--side-panel__subtitle-text').hasText('Subtitle');
      assert
        .dom('.cds--side-panel__title')
        .doesNotHaveClass('cds--side-panel__title--no-label');

      await render(
        <template>
          <SidePanel @open={{true}} @title="Title">
            <:subtitle>Some <strong>markup</strong></:subtitle>
          </SidePanel>
        </template>,
      );

      assert.dom('.cds--side-panel__subtitle-text strong').hasText('markup');
      assert.dom('.cds--side-panel__label-text').doesNotExist();
      assert
        .dom('.cds--side-panel__title')
        .hasClass('cds--side-panel__title--no-label');
    });

    test('it yields an AI label to the decorator block', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title">
            <:decorator as |AILabel|>
              <AILabel @aiText="AI" />
            </:decorator>
          </SidePanel>
        </template>,
      );

      assert.dom(PANEL).hasClass('cds--side-panel--has-decorator');
      assert
        .dom('.cds--side-panel__decorator-and-close .cds--ai-label')
        .exists();
    });

    test('it names the close button, and can hide it', async function (assert) {
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @closeIconDescription="Dismiss"
          />
        </template>,
      );

      assert.dom('.cds--side-panel__close-button').exists();
      assert.dom(PANEL).includesText('Dismiss');

      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @hideCloseButton={{true}} />
        </template>,
      );

      assert.dom('.cds--side-panel__close-button').doesNotExist();
    });

    test('it has the condensed class on the panel and the actions', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @condensedActions={{true}} />
        </template>,
      );

      assert.dom(PANEL).hasClass('cds--side-panel--condensed-actions');
      assert
        .dom('.cds--side-panel__actions-container')
        .hasClass('cds--side-panel__actions-container--condensed');
    });
  });

  module('closing', function () {
    test('the close button asks to close', async function (assert) {
      const close = spy();
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @onRequestClose={{close.call}}
          />
        </template>,
      );

      await click('.cds--side-panel__close-button');

      assert.strictEqual(close.calls.length, 1);
    });

    test('Escape asks to close once, from anywhere', async function (assert) {
      const close = spy();
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @onRequestClose={{close.call}}
          >
            <button type="button" class="inside">Inside</button>
          </SidePanel>
        </template>,
      );

      await triggerKeyEvent('.inside', 'keydown', 'Escape');
      assert.strictEqual(close.calls.length, 1);

      await triggerKeyEvent(document.body, 'keydown', 'Escape');
      assert.strictEqual(close.calls.length, 2);
    });

    test('a slide-in panel ignores Escape', async function (assert) {
      const close = spy();
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @slideIn={{true}}
            @onRequestClose={{close.call}}
          />
        </template>,
      );

      await triggerKeyEvent(PANEL, 'keydown', 'Escape');

      assert.strictEqual(close.calls.length, 0);
    });

    test('it leaves the DOM after its exit animation, calling @onUnmount', async function (assert) {
      const state = new State();
      const unmounted = spy<void>();
      await render(
        <template>
          <SidePanel
            @open={{state.open}}
            @title="Title"
            @onUnmount={{unmounted.call}}
          />
        </template>,
      );
      await arrived();

      state.open = false;
      await rerender();
      assert.dom(PANEL).hasClass('cds--side-panel--closing');

      await settled();
      assert.dom(PANEL).doesNotExist();
      assert.strictEqual(unmounted.calls.length, 1);

      state.open = true;
      await settled();
      assert.dom(PANEL).hasClass('cds--side-panel--open');
    });
  });

  module('overlay', function () {
    test('it has none unless @includeOverlay', async function (assert) {
      await render(<template><SidePanel @open={{true}} /></template>);

      assert.dom('.cds--side-panel__overlay').doesNotExist();
      assert.dom(PANEL).doesNotHaveClass('cds--side-panel--has-overlay');
    });

    test('a click on the overlay asks to close, and locks the page scroll', async function (assert) {
      const close = spy();
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @includeOverlay={{true}}
            @onRequestClose={{close.call}}
          />
        </template>,
      );

      assert.dom(PANEL).hasClass('cds--side-panel--has-overlay');
      assert.strictEqual(document.body.style.overflow, 'hidden');

      await click('.cds--side-panel__overlay');
      assert.strictEqual(close.calls.length, 1);

      await click(PANEL);
      assert.strictEqual(
        close.calls.length,
        1,
        'a click in the panel is not one outside',
      );
    });

    test('@preventCloseOnClickOutside keeps the overlay from closing it', async function (assert) {
      const close = spy();
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @includeOverlay={{true}}
            @preventCloseOnClickOutside={{true}}
            @onRequestClose={{close.call}}
          />
        </template>,
      );

      await click('.cds--side-panel__overlay');

      assert.strictEqual(close.calls.length, 0);
    });

    test('the page scrolls again once the overlay is gone', async function (assert) {
      const state = new State();
      await render(
        <template>
          <SidePanel @open={{state.open}} @includeOverlay={{true}} />
        </template>,
      );
      assert.strictEqual(document.body.style.overflow, 'hidden');

      state.open = false;
      await settled();
      assert.strictEqual(document.body.style.overflow, '');
    });
  });

  module('focus', function () {
    test('it focuses the first element that takes focus once it has arrived', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title">
            <input class="field" />
          </SidePanel>
        </template>,
      );

      await waitUntil(() => document.activeElement?.closest(PANEL), {
        timeout: 3000,
      });
      assert.dom('.cds--side-panel__close-button').isFocused();
    });

    test('@selectorPrimaryFocus picks the element to focus', async function (assert) {
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @selectorPrimaryFocus="#primary"
          >
            <input id="other" />
            <input id="primary" />
          </SidePanel>
        </template>,
      );

      await waitUntil(() => document.activeElement?.id === 'primary', {
        timeout: 3000,
      });
      assert.dom('#primary').isFocused();
    });

    test('a slide-in panel does not take focus', async function (assert) {
      await render(
        <template>
          <button type="button" id="before">Before</button>
          <SidePanel @open={{true}} @title="Title" @slideIn={{true}} />
        </template>,
      );
      await focus('#before');
      await arrived();

      assert.dom('#before').isFocused();
    });

    test('Tab goes around the panel', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @hideCloseButton={{true}}>
            <button type="button" id="first">First</button>
            <button type="button" id="last">Last</button>
          </SidePanel>
        </template>,
      );

      await focus('#last');
      const forward = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true,
      });
      find('#last')!.dispatchEvent(forward);
      assert.true(forward.defaultPrevented);
      assert.dom('#first').isFocused();

      const backward = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      find('#first')!.dispatchEvent(backward);
      assert.true(backward.defaultPrevented);
      assert.dom('#last').isFocused();
    });

    test('focus returns to @launcherButtonRef when it closes', async function (assert) {
      const state = new State();
      await render(
        <template>
          <button type="button" id="launcher" {{capture state}}>Open</button>
          <SidePanel
            @open={{state.open}}
            @title="Title"
            @launcherButtonRef={{state.launcher}}
          />
        </template>,
      );
      await arrived();
      assert.dom('#launcher').isNotFocused();

      state.open = false;
      await settled();

      assert.dom('#launcher').isFocused();
    });
  });

  module('presence', function () {
    test('a re-opened panel takes focus only once it has arrived', async function (assert) {
      const state = new State();
      await render(
        <template>
          <SidePanel @open={{state.open}} @title="Title">
            <input id="field" />
          </SidePanel>
        </template>,
      );
      await arrived();
      await waitUntil(() => find(PANEL)?.contains(document.activeElement));

      state.open = false;
      await settled();
      assert.dom(PANEL).doesNotExist();
      (document.activeElement as HTMLElement | null)?.blur();

      state.open = true;
      await rerender();
      assert.false(
        Boolean(find(PANEL)?.contains(document.activeElement)),
        'focus waits for the entrance',
      );
      await waitUntil(() => find(PANEL)?.contains(document.activeElement), {
        timeout: 3000,
      });
      assert.dom(PANEL).hasClass('cds--side-panel--open');
    });

    test('opening it again during the exit keeps it, without @onUnmount', async function (assert) {
      const state = new State();
      const unmounted = spy<void>();
      await render(
        <template>
          <SidePanel
            @open={{state.open}}
            @title="Title"
            @onUnmount={{unmounted.call}}
          />
        </template>,
      );
      await arrived();

      state.open = false;
      await rerender();
      state.open = true;
      await settled();

      assert.dom(PANEL).hasClass('cds--side-panel--open');
      assert.strictEqual(unmounted.calls.length, 0);
    });

    test('destroying it during the exit is fine', async function (assert) {
      const state = new State();
      const unmounted = spy<void>();
      await render(
        <template>
          {{#if state.show}}
            <SidePanel
              @open={{state.open}}
              @title="Title"
              @onUnmount={{unmounted.call}}
            />
          {{/if}}
        </template>,
      );
      await arrived();

      state.open = false;
      await rerender();
      state.show = false;
      await settled();

      assert.dom(PANEL).doesNotExist();
      assert.strictEqual(unmounted.calls.length, 0);
    });
  });

  module('naming', function () {
    test("a caller's aria-label names a panel without a title", async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} aria-label="Caller label" />
        </template>,
      );

      assert.dom(PANEL).hasAttribute('aria-label', 'Caller label');
    });

    test('the title wins over a caller aria-label', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" aria-label="Caller label" />
        </template>,
      );

      assert.dom(PANEL).hasAttribute('aria-label', 'Title');
    });

    test('@labelText without a @title shows no label', async function (assert) {
      await render(
        <template><SidePanel @open={{true}} @labelText="Label" /></template>,
      );

      assert.dom('.cds--side-panel__label-text').doesNotExist();
    });
  });

  module('title animation', function () {
    test('scrolling the content collapses the label', async function (assert) {
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @labelText="Label"
            @subtitle="Subtitle"
          >
            {{#each LINES as |line|}}<p>Line {{line}}</p>{{/each}}
          </SidePanel>
        </template>,
      );
      const panel = find(PANEL) as HTMLElement;
      await arrived();
      const content = find('.cds--side-panel__inner-content') as HTMLElement;
      await waitUntil(
        () =>
          panel.style.getPropertyValue(
            '--cds--side-panel--scroll-animation-distance',
          ) !== '',
        { timeout: 3000 },
      );
      const label = find('.cds--side-panel__label-text') as HTMLElement;

      content.scrollTop = 10000;
      content.dispatchEvent(new Event('scroll'));

      assert.strictEqual(
        panel.style.getPropertyValue(
          '--cds--side-panel--scroll-animation-progress',
        ),
        '1',
      );
      assert.true(parseFloat(label.style.marginTop) < 0);
      assert.strictEqual(getComputedStyle(label).opacity, '0');
    });
  });

  module('steps', function () {
    test('a later step has a back button, which calls @onNavigationBack', async function (assert) {
      const back = spy();
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @currentStep={{1}}
            @navigationBackIconDescription="Previous"
            @onNavigationBack={{back.call}}
          />
        </template>,
      );

      assert
        .dom('.cds--side-panel__header')
        .hasClass('cds--side-panel__header--on-detail-step');
      await click('.cds--side-panel__navigation-back-button');

      assert.strictEqual(back.calls.length, 1);
    });

    test('the first step has no back button', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @currentStep={{0}} />
        </template>,
      );

      assert.dom('.cds--side-panel__navigation-back-button').doesNotExist();
    });

    test('the content scrolls back to the top on a new step', async function (assert) {
      const state = new State();
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @currentStep={{state.step}}>
            <div class="tall">Tall</div>
          </SidePanel>
        </template>,
      );
      const content = find('.cds--side-panel__inner-content')!;
      content.scrollTop = 40;

      state.step = 1;
      await settled();

      assert.strictEqual(content.scrollTop, 0);
    });
  });

  module('actions', function () {
    test('it renders a button per action, which calls its onClick', async function (assert) {
      const submit = spy();
      const cancel = spy();
      const actions = [
        { label: 'Cancel', kind: 'secondary' as const, onClick: cancel.call },
        { label: 'Submit', onClick: submit.call },
      ];
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @actions={{actions}} />
        </template>,
      );

      const buttons = document.querySelectorAll(
        '.cds--side-panel__actions-container button',
      );
      assert.strictEqual(buttons.length, 2);
      assert
        .dom('.cds--side-panel__actions-container')
        .hasClass('cds--action-set--row-double')
        .hasClass('cds--action-set--md');
      // Secondary first, primary last.
      assert.dom(buttons[0]).hasText('Cancel');
      assert.dom(buttons[1]).hasText('Submit');

      await click(buttons[1]!);
      assert.strictEqual(submit.calls.length, 1);
      assert.strictEqual(cancel.calls.length, 0);
    });

    test('three actions stack, primary first', async function (assert) {
      const actions = [
        { label: 'Ghost', kind: 'ghost' as const },
        { label: 'Secondary', kind: 'secondary' as const },
        { label: 'Primary' },
      ];
      await render(
        <template><SidePanel @open={{true}} @actions={{actions}} /></template>,
      );

      assert
        .dom('.cds--side-panel__actions-container')
        .hasClass('cds--action-set--stacking')
        .hasClass('cds--btn-set--stacked');
      const buttons = document.querySelectorAll(
        '.cds--side-panel__actions-container button',
      );
      assert.dom(buttons[0]).hasText('Primary');
      assert.dom(buttons[2]).hasText('Ghost');
    });

    test('a loading or disabled action is disabled', async function (assert) {
      const actions = [
        { label: 'Loading', loading: true },
        { label: 'Disabled', disabled: true, kind: 'secondary' as const },
      ];
      await render(
        <template><SidePanel @open={{true}} @actions={{actions}} /></template>,
      );

      assert.dom('.cds--action-set__action-button').exists({ count: 2 });
      for (const button of document.querySelectorAll(
        '.cds--action-set__action-button',
      )) {
        assert.dom(button).isDisabled();
      }
      assert.dom('.cds--inline-loading').exists();
    });

    test('it renders the action toolbar buttons', async function (assert) {
      const copy = spy();
      const buttons = [
        { label: 'Copy', leading: true, renderIcon: Close, onClick: copy.call },
        { label: 'Settings', hasIconOnly: true, renderIcon: Close },
      ];
      await render(
        <template>
          <SidePanel
            @open={{true}}
            @title="Title"
            @actionToolbarButtons={{buttons}}
          />
        </template>,
      );

      assert
        .dom('.cds--side-panel__action-toolbar-button')
        .exists({ count: 2 });
      assert
        .dom('.cds--side-panel__action-toolbar-leading-button')
        .hasText('Copy');
      await click('.cds--side-panel__action-toolbar-leading-button');
      assert.strictEqual(copy.calls.length, 1);
    });
  });

  module('slide in', function () {
    test('it makes room in the page content, and gives it back', async function (assert) {
      const state = new State();
      await render(
        <template>
          <div id="page-content">Page</div>
          <SidePanel
            @open={{state.open}}
            @slideIn={{true}}
            @selectorPageContent="#page-content"
            @size="lg"
          />
        </template>,
      );
      const page = find('#page-content') as HTMLElement;

      assert.dom(PANEL).hasClass('cds--side-panel--slide-in');
      assert.strictEqual(page.style.marginInlineEnd, '40rem');
      assert.strictEqual(page.style.inlineSize, 'auto');

      state.open = false;
      await settled();
      assert.strictEqual(page.style.marginInlineEnd, '0px');
    });

    test('a left panel makes room at the start', async function (assert) {
      await render(
        <template>
          <div id="page-content">Page</div>
          <SidePanel
            @open={{true}}
            @slideIn={{true}}
            @placement="left"
            @selectorPageContent="#page-content"
          />
        </template>,
      );

      assert.strictEqual(
        (find('#page-content') as HTMLElement).style.marginInlineStart,
        '30rem',
      );
    });
  });

  module('resizable', function () {
    test('it has a resizer on wide screens', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @resizable={{true}} />
        </template>,
      );

      if (window.innerWidth <= 768) {
        assert.dom('.cds--side-panel__resizer').doesNotExist();
        return;
      }
      assert.dom(PANEL).hasClass('cds--side-panel--resizable');
      assert
        .dom('.cds--side-panel__resizer')
        .hasAttribute('role', 'separator')
        .hasAttribute('aria-orientation', 'vertical')
        .hasAttribute('aria-valuemax', '75');
      await waitUntil(
        () =>
          find('.cds--side-panel__resizer')?.getAttribute('aria-valuenow') !==
          '0',
      );
      assert
        .dom('.cds--side-panel__resizer')
        .hasAttribute('aria-label', /^side panel is covering \d+% of screen$/);
    });

    test('it has no resizer unless @resizable, nor when it slides in', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @slideIn={{true}} @resizable={{true}} />
          <SidePanel @open={{true}} id="plain" />
        </template>,
      );

      assert.dom('.cds--side-panel__resizer').doesNotExist();
    });

    test('the keyboard resizes it, Home and End to the extremes', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @resizable={{true}} />
        </template>,
      );
      if (window.innerWidth <= 768) {
        assert.expect(0);
        return;
      }
      const panel = find(PANEL) as HTMLElement;
      await arrived();
      const initial = panel.clientWidth;

      await triggerKeyEvent(
        '.cds--side-panel__resizer',
        'keydown',
        'ArrowLeft',
      );
      const widened = panel.style.getPropertyValue(
        '--cds-side-panel-modified-size',
      );
      assert.true(
        parseFloat(widened) > initial,
        `a right panel grows with ArrowLeft (${widened} > ${initial})`,
      );

      await triggerKeyEvent('.cds--side-panel__resizer', 'keydown', 'Home');
      assert.strictEqual(
        panel.style.getPropertyValue('--cds-side-panel-modified-size'),
        '75vw',
      );

      await triggerKeyEvent('.cds--side-panel__resizer', 'keydown', 'End');
      assert.strictEqual(
        panel.style.getPropertyValue('--cds-side-panel-modified-size'),
        '16rem',
      );
    });

    test('dragging the handle resizes it', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @resizable={{true}} />
        </template>,
      );
      if (window.innerWidth <= 768) {
        assert.expect(0);
        return;
      }
      const panel = find(PANEL) as HTMLElement;
      await arrived();
      const initial = panel.clientWidth;
      const handle = find('.cds--side-panel__resizer') as HTMLElement;
      const mouse = (type: string, clientX: number) =>
        new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX,
        });

      handle.dispatchEvent(mouse('mousedown', 500));
      window.dispatchEvent(mouse('mousemove', 450));
      assert.true(panel.style.transition.startsWith('none'));
      assert.true(
        parseFloat(
          panel.style.getPropertyValue('--cds-side-panel-modified-size'),
        ) > initial,
        'a right panel grows as the handle moves left',
      );
      window.dispatchEvent(mouse('mouseup', 450));

      assert.strictEqual(panel.style.transition, '');
    });

    test('a double click goes back to the size', async function (assert) {
      await render(
        <template>
          <SidePanel @open={{true}} @title="Title" @resizable={{true}} />
        </template>,
      );
      if (window.innerWidth <= 768) {
        assert.expect(0);
        return;
      }
      const panel = find(PANEL) as HTMLElement;
      await triggerKeyEvent('.cds--side-panel__resizer', 'keydown', 'Home');
      assert.strictEqual(
        panel.style.getPropertyValue('--cds-side-panel-modified-size'),
        '75vw',
      );

      find('.cds--side-panel__resizer')!.dispatchEvent(
        new MouseEvent('dblclick', { bubbles: true, cancelable: true }),
      );

      assert.strictEqual(
        panel.style.getPropertyValue('--cds-side-panel-modified-size'),
        '',
      );
    });
  });
});
