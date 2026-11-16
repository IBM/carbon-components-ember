import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  click,
  find,
  render,
  rerender,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import InlineCheckbox from '#src/components/inline-checkbox.gts';

class State {
  @tracked indeterminate = true;
}

module('Integration | Component | InlineCheckbox', (hooks) => {
  setupRenderingTest(hooks);

  test('it renders a checkbox named by a hidden label, and passes attributes to its root', async function (assert) {
    await render(
      <template>
        <InlineCheckbox
          @id="c1"
          @name="n1"
          @ariaLabel="Select row"
          @title="Pick it"
          data-test-root
        />
      </template>,
    );

    assert.dom('[data-test-root]').hasClass('cds--checkbox--inline');
    assert.dom('input').hasAttribute('id', 'c1').hasAttribute('name', 'n1');
    assert.dom('input').hasClass('cds--checkbox').isNotChecked();
    assert
      .dom('label')
      .hasAttribute('for', 'c1')
      .hasAttribute('title', 'Pick it');
    assert.dom('label .cds--visually-hidden').hasText('Select row');
  });

  test('checked and disabled set the input', async function (assert) {
    await render(
      <template>
        <InlineCheckbox
          @id="c1"
          @name="n1"
          @ariaLabel="Select row"
          @checked={{true}}
          @disabled={{true}}
        />
      </template>,
    );

    assert.dom('input').isChecked().isDisabled();
  });

  test('indeterminate sets the property, unchecks the input and follows the arg', async function (assert) {
    const state = new State();
    await render(
      <template>
        <InlineCheckbox
          @id="c1"
          @name="n1"
          @ariaLabel="Select all"
          @checked={{true}}
          @indeterminate={{state.indeterminate}}
        />
      </template>,
    );

    const input = find('input') as HTMLInputElement;
    assert.true(input.indeterminate);
    assert.false(input.checked, 'indeterminate wins over checked');

    state.indeterminate = false;
    await rerender();

    assert.false(input.indeterminate);
    assert.true(input.checked);
  });

  test('a click on an indeterminate input unchecks it before onClick runs', async function (assert) {
    let checkedInClick: boolean | undefined;
    const onClick = (event: MouseEvent) => {
      checkedInClick = (event.target as HTMLInputElement).checked;
    };
    await render(
      <template>
        <InlineCheckbox
          @id="c1"
          @name="n1"
          @ariaLabel="Select all"
          @indeterminate={{true}}
          @onClick={{onClick}}
        />
      </template>,
    );

    await click('input');

    assert.false(checkedInClick);
  });

  test('onChange gets the checked state, the id and the event', async function (assert) {
    const calls: [boolean, string, string][] = [];
    const onChange = (checked: boolean, id: string, event: Event) => {
      calls.push([checked, id, event.type]);
    };
    await render(
      <template>
        <InlineCheckbox
          @id="c1"
          @name="n1"
          @ariaLabel="Select row"
          @onChange={{onChange}}
        />
      </template>,
    );

    await click('input');

    assert.deepEqual(calls, [[true, 'c1', 'change']]);
  });

  test('a click on the label reaches onClick but not the ancestors', async function (assert) {
    let outer = 0;
    let clicks = 0;
    const onOuter = () => outer++;
    const onClick = () => clicks++;
    await render(
      <template>
        {{! eslint-disable-next-line ember/template-no-invalid-interactive }}
        <div {{on "click" onOuter}}>
          <InlineCheckbox
            @id="c1"
            @name="n1"
            @ariaLabel="Select row"
            @onClick={{onClick}}
          />
        </div>
      </template>,
    );

    await click('label');

    assert.strictEqual(clicks, 1, 'the label clicks the input');
    assert.strictEqual(
      outer,
      1,
      'only the input click bubbles, as the label stops its own',
    );
  });

  test('keydown on the input reaches a listener on the root', async function (assert) {
    let key: string | undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      key = event.key;
    };
    await render(
      <template>
        <InlineCheckbox
          @id="c1"
          @name="n1"
          @ariaLabel="Select row"
          {{on "keydown" onKeyDown}}
        />
      </template>,
    );

    await triggerKeyEvent('input', 'keydown', 'Enter');

    assert.strictEqual(key, 'Enter');
  });
});
