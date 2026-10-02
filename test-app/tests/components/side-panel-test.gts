import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, waitUntil, find } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import SidePanel from 'carbon-components-ember/components/side-panel';
import type {
  SidePanelAction,
  SidePanelActionToolbarButton,
} from 'carbon-components-ember/components/side-panel';
import { Add } from 'carbon-components-ember/icons';

module('Integration | Component | SidePanel', (hooks) => {
  setupRenderingTest(hooks);

  test('renders nothing when closed', async function (assert) {
    await render(
      <template>
        <SidePanel @open={{false}} @size='md' @title='Panel title' />
      </template>,
    );

    assert.dom('.cds--side-panel').doesNotExist();
  });

  test('renders the title, subtitle and label when open', async function (assert) {
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @title='Panel title'
          @subtitle='Panel subtitle'
          @labelText='Panel label'
        />
      </template>,
    );

    assert.dom('.cds--side-panel').exists();
    assert.dom('.cds--side-panel__title-text').hasText('Panel title');
    assert.dom('.cds--side-panel__subtitle-text').hasText('Panel subtitle');
    assert.dom('.cds--side-panel__label-text').hasText('Panel label');
  });

  test('applies the size and placement classes', async function (assert) {
    await render(
      <template>
        <SidePanel @open={{true}} @size='lg' @placement='left' />
      </template>,
    );

    assert.dom('.cds--side-panel').hasClass('cds--side-panel--lg');
    assert.dom('.cds--side-panel').hasClass('cds--side-panel--left-placement');
  });

  test('defaults to the right placement', async function (assert) {
    await render(<template><SidePanel @open={{true}} @size='md' /></template>);

    assert
      .dom('.cds--side-panel')
      .hasClass('cds--side-panel--right-placement');
  });

  test('calls onRequestClose when the close button is clicked', async function (assert) {
    const closed = cell(false);
    const onRequestClose = () => (closed.current = true);
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @title='Panel title'
          @onRequestClose={{onRequestClose}}
        />
      </template>,
    );

    await click('.cds--side-panel__close-button');

    assert.true(closed.current);
  });

  test('hides the close button when @hideCloseButton is set', async function (assert) {
    await render(
      <template>
        <SidePanel @open={{true}} @size='md' @hideCloseButton={{true}} />
      </template>,
    );

    assert.dom('.cds--side-panel__close-button').doesNotExist();
  });

  test('calls onRequestClose on Escape', async function (assert) {
    const closed = cell(false);
    const onRequestClose = () => (closed.current = true);
    await render(
      <template>
        <SidePanel @open={{true}} @size='md' @onRequestClose={{onRequestClose}} />
      </template>,
    );

    await triggerKeyEvent('.cds--side-panel', 'keydown', 'Escape');

    assert.true(closed.current);
  });

  test('does not close on Escape when @slideIn is set', async function (assert) {
    const closed = cell(false);
    const onRequestClose = () => (closed.current = true);
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @slideIn={{true}}
          @selectorPageContent='#page-content'
          @onRequestClose={{onRequestClose}}
        />
        <div id='page-content'></div>
      </template>,
    );

    await triggerKeyEvent('.cds--side-panel', 'keydown', 'Escape');

    assert.false(closed.current);
    assert.dom('.cds--side-panel').hasClass('cds--side-panel--slide-in');
  });

  test('shows a back button and calls onNavigationBack when currentStep is greater than 0', async function (assert) {
    const backClicked = cell(false);
    const onNavigationBack = () => (backClicked.current = true);
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @currentStep={{1}}
          @onNavigationBack={{onNavigationBack}}
        />
      </template>,
    );

    assert.dom('.cds--side-panel__navigation-back-button').exists();
    await click('.cds--side-panel__navigation-back-button');
    assert.true(backClicked.current);
  });

  test('does not show a back button when currentStep is 0', async function (assert) {
    await render(<template><SidePanel @open={{true}} @size='md' /></template>);

    assert.dom('.cds--side-panel__navigation-back-button').doesNotExist();
  });

  test('renders footer actions and calls their onClick handlers', async function (assert) {
    const clicked = cell('');
    const actions: SidePanelAction[] = [
      { label: 'Cancel', kind: 'secondary', onClick: () => (clicked.current = 'cancel') },
      { label: 'Submit', kind: 'primary', onClick: () => (clicked.current = 'submit') },
    ];
    await render(
      <template><SidePanel @open={{true}} @size='md' @actions={{actions}} /></template>,
    );

    assert.dom('.cds--action-set button').exists({ count: 2 });

    await click('.cds--btn--primary.cds--action-set__action-button');
    assert.strictEqual(clicked.current, 'submit');
  });

  test('does not render a footer when there are no actions', async function (assert) {
    await render(<template><SidePanel @open={{true}} @size='md' /></template>);

    assert.dom('.cds--action-set').doesNotExist();
  });

  test('renders action toolbar buttons', async function (assert) {
    const clicked = cell(false);
    const actionToolbarButtons: SidePanelActionToolbarButton[] = [
      {
        label: 'Settings',
        hasIconOnly: true,
        renderIcon: Add,
        onClick: () => (clicked.current = true),
      },
    ];
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @title='Panel title'
          @actionToolbarButtons={{actionToolbarButtons}}
        />
      </template>,
    );

    assert.dom('.cds--side-panel__action-toolbar button').exists({ count: 1 });
    await waitUntil(() => find('.cds--side-panel__action-toolbar svg'));
    await click('.cds--side-panel__action-toolbar button');
    assert.true(clicked.current);
  });

  test('renders an overlay and closes on outside click', async function (assert) {
    const closed = cell(false);
    const onRequestClose = () => (closed.current = true);
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @includeOverlay={{true}}
          @onRequestClose={{onRequestClose}}
        />
      </template>,
    );

    assert.dom('.cds--side-panel__overlay').exists();
    await click('.cds--side-panel__overlay');
    assert.true(closed.current);
  });

  test('does not close on outside click when preventCloseOnClickOutside is set', async function (assert) {
    const closed = cell(false);
    const onRequestClose = () => (closed.current = true);
    await render(
      <template>
        <SidePanel
          @open={{true}}
          @size='md'
          @includeOverlay={{true}}
          @preventCloseOnClickOutside={{true}}
          @onRequestClose={{onRequestClose}}
        />
      </template>,
    );

    await click('.cds--side-panel__overlay');
    assert.false(closed.current);
  });

  test('renders a decorator component', async function (assert) {
    await render(
      <template><SidePanel @open={{true}} @size='md' @decorator={{Add}} /></template>,
    );

    assert.dom('.cds--side-panel--has-decorator').exists();
    await waitUntil(() => find('.cds--side-panel__decorator-and-close svg'));
    assert.dom('.cds--side-panel__decorator-and-close svg').exists();
  });

  test('applies the condensed actions class', async function (assert) {
    await render(
      <template>
        <SidePanel @open={{true}} @size='md' @condensedActions={{true}} />
      </template>,
    );

    assert
      .dom('.cds--side-panel')
      .hasClass('cds--side-panel--condensed-actions');
  });

  test('renders custom subtitle content via the subtitle block', async function (assert) {
    await render(
      <template>
        <SidePanel @open={{true}} @size='md' @title='Panel title'>
          <:subtitle>Custom <strong>subtitle</strong></:subtitle>
          <:default>Body content</:default>
        </SidePanel>
      </template>,
    );

    assert
      .dom('.cds--side-panel__subtitle-text')
      .hasText('Custom subtitle');
    assert.dom('.cds--side-panel__inner-content').hasText('Body content');
  });

  test('renders a resizer handle when @resizable is set', async function (assert) {
    await render(
      <template><SidePanel @open={{true}} @size='md' @resizable={{true}} /></template>,
    );

    assert.dom('.cds--side-panel').hasClass('cds--side-panel--resizable');
    assert.dom('.cds--side-panel__resizer').exists();
  });
});
