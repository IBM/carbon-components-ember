import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  fillIn,
  click,
  find,
  settled,
  triggerEvent,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Search from '#src/components/search.gts';

module('Integration | Component | Search', (hooks) => {
  setupRenderingTest(hooks);

  test('should render a labelled search input', async function (assert) {
    await render(<template><Search @labelText="Search" /></template>);

    assert.dom('[role="search"].cds--search').exists();
    assert.dom('input.cds--search-input').exists();
    assert.dom('.cds--label').hasText('Search');
  });

  test('defaults to a type="search" input with a "Search" placeholder', async function (assert) {
    await render(<template><Search @labelText="Search" /></template>);

    assert.dom('input.cds--search-input').hasAttribute('type', 'search');
    assert.dom('input.cds--search-input').hasAttribute('placeholder', 'Search');
  });

  test('respects the placeholder argument', async function (assert) {
    await render(
      <template>
        <Search @labelText="Search" @placeholder="Find something" />
      </template>,
    );

    assert
      .dom('input.cds--search-input')
      .hasAttribute('placeholder', 'Find something');
  });

  test('respects the value argument', async function (assert) {
    await render(
      <template><Search @labelText="Search" @value="my search" /></template>,
    );

    assert.dom('input.cds--search-input').hasValue('my search');
  });

  test('respects the disabled argument', async function (assert) {
    await render(
      <template><Search @labelText="Search" @disabled={{true}} /></template>,
    );

    assert.dom('input.cds--search-input').isDisabled();
    assert.dom('.cds--search').hasClass('cds--search--disabled');
  });

  test('applies the size class', async function (assert) {
    await render(
      <template><Search @labelText="Search" @size="sm" /></template>,
    );

    assert.dom('.cds--search').hasClass('cds--search--sm');
  });

  test('calls onChange with the input event, as Carbon React does', async function (assert) {
    let received: (Event & { target: HTMLInputElement }) | undefined;
    const onChange = (event: Event & { target: HTMLInputElement }) => {
      received = event;
    };

    await render(
      <template>
        <Search @labelText="Search" @onChange={{onChange}} />
      </template>,
    );
    await fillIn('input.cds--search-input', 'carbon');

    assert.strictEqual(received?.type, 'input');
    assert.strictEqual(received?.target.value, 'carbon');
  });

  test('@defaultValue fills an uncontrolled field', async function (assert) {
    await render(
      <template>
        <Search @labelText="Search" @defaultValue="carbon" />
      </template>,
    );

    assert.dom('input.cds--search-input').hasValue('carbon');
    assert.dom('.cds--search-close').exists();
  });

  test('shows a clear button once there is input and clears it on click', async function (assert) {
    await render(
      <template><Search @labelText="Search" @value="abc" /></template>,
    );

    assert.dom('.cds--search-close').exists();
    await click('.cds--search-close');

    assert.dom('input.cds--search-input').hasValue('');
    assert.dom('.cds--search-close').doesNotExist();
  });

  test('calls onClear when the clear button is clicked', async function (assert) {
    let cleared = false;
    const onClear = () => {
      cleared = true;
    };

    await render(
      <template>
        <Search @labelText="Search" @value="abc" @onClear={{onClear}} />
      </template>,
    );
    await click('.cds--search-close');

    assert.true(cleared);
  });

  test('clicking the clear button calls onChange with the empty value, then onClear, and keeps focus in the field', async function (assert) {
    const calls: string[] = [];
    const onChange = (event: Event & { target: HTMLInputElement }) => {
      calls.push(`change:${event.target.value}`);
    };
    const onClear = () => {
      calls.push('clear');
    };

    await render(
      <template>
        <Search
          @labelText="Search"
          @value="abc"
          @onChange={{onChange}}
          @onClear={{onClear}}
        />
      </template>,
    );
    await click('.cds--search-close');

    assert.deepEqual(calls, ['change:', 'clear']);
    assert.dom('input.cds--search-input').isFocused();
  });

  test('Escape clears the field, and goes no further', async function (assert) {
    let cleared = false;
    const onClear = () => (cleared = true);
    let escapes = 0;
    const countEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') escapes++;
    };
    document.addEventListener('keydown', countEscape);

    try {
      await render(
        <template>
          <Search
            @labelText="Search"
            @defaultValue="abc"
            @onClear={{onClear}}
          />
        </template>,
      );
      await triggerKeyEvent('input.cds--search-input', 'keydown', 'Escape');
    } finally {
      document.removeEventListener('keydown', countEscape);
    }

    assert.dom('input.cds--search-input').hasValue('');
    assert.true(cleared);
    assert.strictEqual(escapes, 0, 'the event stops at the field');
  });

  test('does not call onChange twice when a change event follows an input event with the same value', async function (assert) {
    let calls = 0;
    const onChange = () => {
      calls++;
    };

    await render(
      <template>
        <Search @labelText="Search" @onChange={{onChange}} />
      </template>,
    );

    const input = find('input.cds--search-input') as HTMLInputElement;
    input.value = 'carbon';
    await triggerEvent(input, 'input');
    await triggerEvent(input, 'change');

    assert.strictEqual(calls, 1);
  });

  test('uses the closeButtonLabelText argument for the clear button', async function (assert) {
    await render(
      <template>
        <Search
          @labelText="Search"
          @value="abc"
          @closeButtonLabelText="Reset search"
        />
      </template>,
    );

    assert.dom('.cds--search-close').hasAttribute('aria-label', 'Reset search');
  });

  test('a press in the input activates it, and a press outside an empty search deactivates it', async function (assert) {
    await render(
      <template>
        <div id="outside">outside</div>
        <Search @expandable={{true}} @labelText="Search" />
      </template>,
    );

    await triggerEvent('.cds--search-input', 'mousedown');
    assert
      .dom('.cds--search')
      .hasClass(
        'cds--toolbar-search-container-active',
        'stays active after the press that activated it',
      );

    await triggerEvent('#outside', 'mousedown');
    assert
      .dom('.cds--search')
      .doesNotHaveClass('cds--toolbar-search-container-active');
  });

  test('stops listening on the document once it is torn down', async function (assert) {
    let listening = 0;
    // Only ever called with .apply(document, …).
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { addEventListener, removeEventListener } = document;
    document.addEventListener = (
      ...args: Parameters<typeof addEventListener>
    ) => {
      if (args[0] === 'mousedown') listening++;
      addEventListener.apply(document, args);
    };
    document.removeEventListener = (
      ...args: Parameters<typeof removeEventListener>
    ) => {
      if (args[0] === 'mousedown') listening--;
      removeEventListener.apply(document, args);
    };
    const show = tracked(true);

    try {
      await render(
        <template>
          {{#if show.value}}
            <Search @expandable={{true}} @labelText="Search" />
          {{/if}}
        </template>,
      );
      await triggerEvent('.cds--search-input', 'mousedown');
      assert.strictEqual(listening, 1);

      show.value = false;
      await settled();
      assert.strictEqual(listening, 0);
    } finally {
      document.addEventListener = addEventListener;
      document.removeEventListener = removeEventListener;
    }
  });

  test('attributes and {{on "click"}} go on the <input>, @className on the wrapper', async function (assert) {
    let clicks = 0;
    const onClick = () => clicks++;
    await render(
      <template>
        <Search
          @labelText="Search"
          @className="my-field"
          class="my-input"
          name="q"
          {{on "click" onClick}}
        />
      </template>,
    );

    assert.dom('.cds--search').hasClass('my-field');
    assert
      .dom('input.cds--search-input')
      .hasClass('my-input')
      .hasAttribute('name', 'q');
    await click('input.cds--search-input');
    assert.strictEqual(clicks, 1);
  });
});
