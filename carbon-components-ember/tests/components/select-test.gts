import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, select, settled, tab } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import Select from '#src/components/select.gts';
import SelectItemGroup from '#src/components/select-item-group.gts';

const SELECT = 'select';

function spy<T>() {
  const calls: T[] = [];
  return { calls, call: (value: T) => void calls.push(value) };
}

// Records the select's value with each @onChange call: the event's target is
// the live select, so its value is read when the call happens.
function valueSpy() {
  const calls: string[] = [];
  return {
    calls,
    call: (event: Event & { target: HTMLSelectElement }) =>
      void calls.push(event.target.value),
  };
}

// Whether a cancelable event dispatched on the select had its default
// action prevented.
function prevented(event: Event) {
  find(SELECT)!.dispatchEvent(event);
  return event.defaultPrevented;
}

const keyDown = (key: string) =>
  new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

module('Integration | Component | Select', function (hooks) {
  setupRenderingTest(hooks);

  module('renders as expected - Component API', function () {
    test('should render the correct elements by default', async function (assert) {
      await render(<template><Select @id="select" /></template>);

      assert.dom('label').hasText('Select');
      assert.dom('label').doesNotHaveClass('cds--visually-hidden');
      assert.dom('label').hasAttribute('for', 'select');
    });

    test('should render the correct classname', async function (assert) {
      await render(<template><Select @id="select" /></template>);

      assert.dom(SELECT).hasClass('cds--select-input');
    });

    test('should spread extra attributes on the select', async function (assert) {
      await render(
        <template><Select @id="select" data-test-id="test-id" /></template>,
      );

      assert.dom(SELECT).hasAttribute('data-test-id', 'test-id');
    });

    test('should render children as expected', async function (assert) {
      await render(
        <template>
          <Select @id="select" as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" />
          </Select>
        </template>,
      );

      assert.dom('option').hasText('Option 1');
      assert.dom('option').hasClass('cds--select-option');
    });

    test('should support a custom @className on the outermost element', async function (assert) {
      await render(
        <template><Select @id="select" @className="custom-class" /></template>,
      );

      assert.dom('.cds--form-item').hasClass('custom-class');
      assert.dom(SELECT).doesNotHaveClass('custom-class');
    });

    test('should respect @defaultValue', async function (assert) {
      await render(
        <template>
          <Select @id="select" @defaultValue="option-2" as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" />
            <SelectItem @value="option-2" @text="Option 2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasValue('option-2');
      assert.dom('option[value="option-2"]').hasAttribute('selected');
    });

    test('should show the first option text as title', async function (assert) {
      await render(
        <template>
          <Select @id="select" as |SelectItem|>
            <SelectItem @text="Option 1" @value="option-1" />
            <SelectItem @text="Option 2" @value="option-2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasAttribute('title', 'Option 1');
    });

    test('should show the selected option text as title when @defaultValue is provided', async function (assert) {
      await render(
        <template>
          <Select @id="select" @defaultValue="option-2" as |SelectItem|>
            <SelectItem @text="Option 1" @value="option-1" />
            <SelectItem @text="Option 2" @value="option-2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasAttribute('title', 'Option 2');
    });

    test('should show the selected option text as title when @value is provided', async function (assert) {
      await render(
        <template>
          <Select @id="select" @value="option-2" as |SelectItem|>
            <SelectItem @text="Option 1" @value="option-1" />
            <SelectItem @text="Option 2" @value="option-2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasAttribute('title', 'Option 2');
    });

    test('should prioritize a title attribute over @value', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @value="option-2"
            title="Custom Title"
            as |SelectItem|
          >
            <SelectItem @text="Option 1" @value="option-1" />
            <SelectItem @text="Option 2" @value="option-2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasAttribute('title', 'Custom Title');
    });

    test('should update the title when the selection changes', async function (assert) {
      await render(
        <template>
          <Select @id="select" as |SelectItem|>
            <SelectItem @text="Option 1" @value="option-1" />
            <SelectItem @text="Option 2" @value="option-2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasAttribute('title', 'Option 1');
      await select(SELECT, 'option-2');
      assert.dom(SELECT).hasAttribute('title', 'Option 2');
    });

    test('should respect @disabled', async function (assert) {
      await render(
        <template><Select @id="select" @disabled={{true}} /></template>,
      );

      assert.dom(SELECT).isDisabled();
      assert.dom('.cds--select').hasClass('cds--select--disabled');
      assert.dom('label').hasClass('cds--label--disabled');
    });

    test('should not render helper text when @helperText is not provided', async function (assert) {
      await render(<template><Select @id="select" /></template>);

      assert.dom('.cds--form__helper-text').doesNotExist();
      assert.dom(SELECT).doesNotHaveAttribute('aria-describedby');
    });

    test('should render helper text, which describes the select', async function (assert) {
      await render(
        <template>
          <Select @id="select" @helperText="Some helper text" />
        </template>,
      );

      assert
        .dom('.cds--form__helper-text')
        .hasText('Some helper text')
        .hasAttribute('id', 'select-helper-text');
      assert.dom(SELECT).hasAttribute('aria-describedby', 'select-helper-text');
    });

    test('should render the helper text "0"', async function (assert) {
      await render(
        <template><Select @id="select" @helperText="0" /></template>,
      );

      assert.dom('.cds--form__helper-text').hasText('0');
    });

    test('should not render helper text, or set aria-describedby, when @helperText is empty', async function (assert) {
      await render(<template><Select @id="select" @helperText="" /></template>);

      assert.dom('.cds--form__helper-text').doesNotExist();
      assert.dom(SELECT).doesNotHaveAttribute('aria-describedby');
    });

    test('should respect @hideLabel', async function (assert) {
      await render(
        <template><Select @id="select" @hideLabel={{true}} /></template>,
      );

      assert.dom('label').hasText('Select');
      assert.dom('label').hasClass('cds--visually-hidden');
    });

    test('should respect @id', async function (assert) {
      await render(<template><Select @id="select" /></template>);

      assert.dom(SELECT).hasAttribute('id', 'select');
    });

    test('should give the select an id of its own without @id', async function (assert) {
      await render(<template><Select /></template>);

      const id = find(SELECT)!.id;
      assert.ok(id, 'the select has an id');
      assert.dom('label').hasAttribute('for', id);
    });

    test('should respect @inline', async function (assert) {
      await render(
        <template><Select @id="select" @inline={{true}} /></template>,
      );

      assert.dom('.cds--select').hasClass('cds--select--inline');
      assert
        .dom(
          '.cds--select-input--inline__wrapper > .cds--select-input__wrapper',
        )
        .exists();
    });

    test('should not render an inline wrapper by default', async function (assert) {
      await render(<template><Select @id="select" /></template>);

      assert.dom('.cds--select-input--inline__wrapper').doesNotExist();
      assert.dom('.cds--select > .cds--select-input__wrapper').exists();
    });

    test('should respect @invalid', async function (assert) {
      await render(
        <template><Select @id="select" @invalid={{true}} /></template>,
      );

      assert.dom('.cds--select').hasClass('cds--select--invalid');
      assert.dom(SELECT).hasAttribute('aria-invalid', 'true');
      assert
        .dom('.cds--select-input__wrapper')
        .hasAttribute('data-invalid', 'true');
      assert.dom('.cds--select__invalid-icon').exists();
    });

    test('should respect @invalidText, which replaces the helper text', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @invalid={{true}}
            @invalidText="This is an error message"
            @helperText="Some helper text"
          />
        </template>,
      );

      assert
        .dom('.cds--form-requirement')
        .hasText('This is an error message')
        .hasAttribute('id', 'select-error-msg');
      assert.dom(SELECT).hasAttribute('aria-describedby', 'select-error-msg');
      assert.dom('.cds--form__helper-text').doesNotExist();
    });

    test('inline, the invalid text shows in the wrapper and the helper text follows', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @inline={{true}}
            @invalid={{true}}
            @invalidText="This is an error message"
            @helperText="Some helper text"
          />
        </template>,
      );

      assert
        .dom('.cds--select-input--inline__wrapper > .cds--form-requirement')
        .hasText('This is an error message');
      assert
        .dom('.cds--select > .cds--form__helper-text')
        .hasText('Some helper text');
    });

    test('inline, the helper text does not describe the select', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @inline={{true}}
            @helperText="Some helper text"
          />
        </template>,
      );

      assert.dom('.cds--form__helper-text').exists();
      assert.dom(SELECT).doesNotHaveAttribute('aria-describedby');
    });

    test('should respect @labelText', async function (assert) {
      await render(
        <template><Select @id="select" @labelText="Fruit" /></template>,
      );

      assert.dom('label').hasText('Fruit').hasClass('cds--label');
    });

    test('should respect @noLabel', async function (assert) {
      await render(
        <template><Select @id="select" @noLabel={{true}} /></template>,
      );

      assert.dom('label').doesNotExist();
    });

    test('should respect @readOnly', async function (assert) {
      const onChange = valueSpy();
      const onClick = spy<Event>();

      await render(
        <template>
          <Select
            @id="select"
            @labelText="Select label"
            @readOnly={{true}}
            @onChange={{onChange.call}}
            {{on "click" onClick.call}}
            as |SelectItem|
          >
            <SelectItem @text="Choose an option" @value="placeholder-item" />
            <SelectItem @text="Option 1" @value="option-1" />
            <SelectItem @text="Option 2" @value="option-2" />
          </Select>
        </template>,
      );

      // Click events still fire.
      await click(SELECT);
      assert.strictEqual(onClick.calls.length, 1);
      assert.dom(SELECT).hasAttribute('aria-readonly', 'true');
      assert.dom(SELECT).isNotDisabled();
      assert.dom('.cds--select').hasClass('cds--select--readonly');

      // Pressing it focuses it without opening it.
      document.body.focus();
      assert.true(
        prevented(
          new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
        ),
      );
      assert.dom(SELECT).isFocused();

      // Keys that would open it or change the selection do nothing.
      assert.true(prevented(keyDown('ArrowDown')));
      assert.true(prevented(keyDown('ArrowUp')));
      assert.true(prevented(keyDown(' ')));
      assert.false(prevented(keyDown('Tab')));
      assert.deepEqual(onChange.calls, []);
    });

    test('should not prevent the mouse or keys when not read-only', async function (assert) {
      await render(
        <template>
          <Select @id="select" as |SelectItem|>
            <SelectItem @text="Option 1" @value="option-1" />
          </Select>
        </template>,
      );

      assert.false(
        prevented(
          new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
        ),
      );
      assert.false(prevented(keyDown('ArrowDown')));
    });

    test('should respect @size', async function (assert) {
      await render(<template><Select @id="select" @size="sm" /></template>);

      assert.dom('.cds--select').hasClass('cds--select--sm');
      assert.dom('.cds--select').hasClass('cds--layout--size-sm');
    });

    test('should respect @warn', async function (assert) {
      await render(
        <template>
          <Select @id="select" @warn={{true}} @warnText="Warning" />
        </template>,
      );

      assert.dom('.cds--select').hasClass('cds--select--warning');
      assert
        .dom('.cds--select__invalid-icon')
        .hasClass('cds--select__invalid-icon--warning');
    });

    test('should respect @warnText, which describes the select', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @warn={{true}}
            @warnText="This is a warning message"
          />
        </template>,
      );

      assert
        .dom('.cds--form-requirement')
        .hasText('This is a warning message')
        .hasAttribute('id', 'select-warn-msg');
      assert.dom(SELECT).hasAttribute('aria-describedby', 'select-warn-msg');
    });

    test('invalid wins over warn', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @invalid={{true}}
            @invalidText="Error"
            @warn={{true}}
            @warnText="Warning"
          />
        </template>,
      );

      assert.dom('.cds--select').doesNotHaveClass('cds--select--warning');
      assert.dom('.cds--form-requirement').hasText('Error');
    });

    test('should respect the decorator block', async function (assert) {
      await render(
        <template>
          <Select @id="select">
            <:decorator as |AILabel|><AILabel /></:decorator>
          </Select>
        </template>,
      );

      assert.dom('.cds--select').hasClass('cds--select--decorator');
      assert
        .dom(
          '.cds--select-input__wrapper > .cds--select__inner-wrapper--decorator .cds--ai-label',
        )
        .exists();
      assert
        .dom('.cds--ai-label__button')
        .hasClass('cds--ai-label__button--mini');
    });

    test('inline, the decorator is not rendered', async function (assert) {
      await render(
        <template>
          <Select @id="select" @inline={{true}}>
            <:decorator as |AILabel|><AILabel /></:decorator>
          </Select>
        </template>,
      );

      assert.dom('.cds--select__inner-wrapper--decorator').doesNotExist();
    });

    test('should not display the invalid message if disabled', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @disabled={{true}}
            @invalid={{true}}
            @invalidText="This is an error message"
          />
        </template>,
      );

      assert.dom('.cds--form-requirement').doesNotExist();
    });

    test('should not display the invalid message if read-only', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @readOnly={{true}}
            @invalid={{true}}
            @invalidText="This is an error message"
          />
        </template>,
      );

      assert.dom('.cds--form-requirement').doesNotExist();
    });

    test('should not display the warning message if disabled', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @disabled={{true}}
            @warn={{true}}
            @warnText="This is a warning message"
          />
        </template>,
      );

      assert.dom('.cds--form-requirement').doesNotExist();
    });

    test('should not display the warning message if read-only', async function (assert) {
      await render(
        <template>
          <Select
            @id="select"
            @readOnly={{true}}
            @warn={{true}}
            @warnText="This is a warning message"
          />
        </template>,
      );

      assert.dom('.cds--form-requirement').doesNotExist();
    });

    test('should not display warning styles if disabled', async function (assert) {
      await render(
        <template>
          <Select @id="select" @disabled={{true}} @warn={{true}} />
        </template>,
      );

      assert.dom('.cds--select').doesNotHaveClass('cds--select--warning');
    });

    test('should not display warning styles if read-only', async function (assert) {
      await render(
        <template>
          <Select @id="select" @readOnly={{true}} @warn={{true}} />
        </template>,
      );

      assert.dom('.cds--select').doesNotHaveClass('cds--select--warning');
    });

    test('read-only wins over disabled', async function (assert) {
      await render(
        <template>
          <Select @id="select" @readOnly={{true}} @disabled={{true}} />
        </template>,
      );

      assert.dom(SELECT).isNotDisabled();
      assert.dom('.cds--select').doesNotHaveClass('cds--select--disabled');
    });
  });

  module('behaves as expected', function () {
    test('should call @onChange with the change event', async function (assert) {
      const onChange = valueSpy();

      await render(
        <template>
          <Select @id="select" @onChange={{onChange.call}} as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" />
            <SelectItem @value="option-2" @text="Option 2" />
          </Select>
        </template>,
      );

      assert.deepEqual(onChange.calls, []);
      await select(SELECT, 'option-2');
      await select(SELECT, 'option-1');
      assert.deepEqual(onChange.calls, ['option-2', 'option-1']);
    });

    test('should call a click handler', async function (assert) {
      const onClick = spy<Event>();

      await render(
        <template>
          <Select @id="select" {{on "click" onClick.call}} as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" />
          </Select>
        </template>,
      );

      await click(SELECT);
      assert.strictEqual(onClick.calls.length, 1);
    });

    test('should receive focus when tab is pressed', async function (assert) {
      await render(
        <template>
          <Select @id="select" as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" />
          </Select>
        </template>,
      );

      await tab();
      assert.dom(SELECT).isFocused();
    });

    test('should not receive focus when disabled', async function (assert) {
      await render(
        <template>
          <Select @id="select" @disabled={{true}} as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" />
          </Select>
          <button type="button" data-test-next>Next</button>
        </template>,
      );

      await tab();
      assert.dom('[data-test-next]').isFocused();
    });

    test('should not set aria-invalid if disabled', async function (assert) {
      await render(
        <template>
          <Select @id="select" @disabled={{true}} @invalid={{true}} />
        </template>,
      );

      assert.dom(SELECT).doesNotHaveAttribute('aria-invalid');
    });

    test('should not set aria-invalid if read-only', async function (assert) {
      await render(
        <template>
          <Select @id="select" @readOnly={{true}} @invalid={{true}} />
        </template>,
      );

      assert.dom(SELECT).doesNotHaveAttribute('aria-invalid');
    });

    test('renders grouped options', async function (assert) {
      await render(
        <template>
          <Select @id="select" @defaultValue="option-3" as |SelectItem|>
            <SelectItemGroup @label="Group 1">
              <SelectItem @value="option-1" @text="Option 1" />
            </SelectItemGroup>
            <SelectItemGroup @label="Group 2">
              <SelectItem @value="option-3" @text="Option 3" />
            </SelectItemGroup>
          </Select>
        </template>,
      );

      assert.dom('optgroup').exists({ count: 2 });
      assert.dom(SELECT).hasValue('option-3');
      assert.dom(SELECT).hasAttribute('title', 'Option 3');
    });

    test('@value follows its argument, numbers included', async function (assert) {
      const value = tracked(2);

      await render(
        <template>
          <Select @id="select" @value={{value.value}} as |SelectItem|>
            <SelectItem @value={{1}} @text="One" />
            <SelectItem @value={{2}} @text="Two" />
            <SelectItem @value={{3}} @text="Three" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasValue('2');
      value.value = 3;
      await settled();
      assert.dom(SELECT).hasValue('3');
      assert.dom(SELECT).hasAttribute('title', 'Three');
    });

    test('a change @onChange passes back to @value sticks', async function (assert) {
      const value = tracked('option-1');
      const onChange = (event: Event & { target: HTMLSelectElement }) =>
        (value.value = event.target.value);

      await render(
        <template>
          <Select
            @id="select"
            @value={{value.value}}
            @onChange={{onChange}}
            as |SelectItem|
          >
            <SelectItem @value="option-1" @text="Option 1" />
            <SelectItem @value="option-2" @text="Option 2" />
          </Select>
        </template>,
      );

      await select(SELECT, 'option-2');
      assert.dom(SELECT).hasValue('option-2');
      assert.strictEqual(value.value, 'option-2');
    });

    test('a change @onChange does not pass back to @value is undone', async function (assert) {
      const onChange = valueSpy();

      await render(
        <template>
          <Select
            @id="select"
            @value="option-1"
            @onChange={{onChange.call}}
            as |SelectItem|
          >
            <SelectItem @value="option-1" @text="Option 1" />
            <SelectItem @value="option-2" @text="Option 2" />
          </Select>
        </template>,
      );

      await select(SELECT, 'option-2');
      assert.deepEqual(onChange.calls, ['option-2']);
      assert.dom(SELECT).hasValue('option-1');
      assert.dom(SELECT).hasAttribute('title', 'Option 1');
    });

    test('a @value no option has selects the first enabled option', async function (assert) {
      await render(
        <template>
          <Select @id="select" @value="missing" as |SelectItem|>
            <SelectItem @value="option-1" @text="Option 1" @disabled={{true}} />
            <SelectItem @value="option-2" @text="Option 2" />
          </Select>
        </template>,
      );

      assert.dom(SELECT).hasValue('option-2');
    });

    test('a form reset goes back to @defaultValue', async function (assert) {
      await render(
        <template>
          <form>
            <Select
              @id="select"
              @defaultValue="option-2"
              name="fruit"
              as |SelectItem|
            >
              <SelectItem @value="option-1" @text="Option 1" />
              <SelectItem @value="option-2" @text="Option 2" />
            </Select>
          </form>
        </template>,
      );

      await select(SELECT, 'option-1');
      find('form')!.reset();
      assert.dom(SELECT).hasValue('option-2');
      assert.dom(SELECT).hasAttribute('name', 'fruit');
    });

    test('@value selects options that render later', async function (assert) {
      const options = tracked<{ value: string; text: string }[]>([]);

      await render(
        <template>
          <Select @id="select" @value="option-2" as |SelectItem|>
            {{#each options.value as |option|}}
              <SelectItem @value={{option.value}} @text={{option.text}} />
            {{/each}}
          </Select>
        </template>,
      );

      options.value = [
        { value: 'option-1', text: 'Option 1' },
        { value: 'option-2', text: 'Option 2' },
      ];
      await settled();
      assert.dom(SELECT).hasValue('option-2');
      assert.dom(SELECT).hasAttribute('title', 'Option 2');
    });

    test('@value stays selected when its options are replaced', async function (assert) {
      const options = tracked([
        { value: 'option-1', text: 'Option 1' },
        { value: 'option-2', text: 'Option 2' },
      ]);

      await render(
        <template>
          <Select @id="select" @value="option-2" as |SelectItem|>
            {{#each options.value as |option|}}
              <SelectItem @value={{option.value}} @text={{option.text}} />
            {{/each}}
          </Select>
        </template>,
      );

      options.value = options.value.map((option) => ({ ...option }));
      await settled();
      assert.dom(SELECT).hasValue('option-2');
    });

    test('@value follows an option whose value changes in place', async function (assert) {
      const options = tracked(['option-1', 'option-2']);

      await render(
        <template>
          <Select @id="select" @value="option-2" as |SelectItem|>
            {{#each options.value key="@index" as |option|}}
              <SelectItem @value={{option}} @text={{option}} />
            {{/each}}
          </Select>
        </template>,
      );

      // The same two <option>s, with new values: the second stays selected
      // until the Select selects @value again.
      options.value = ['option-2', 'option-3'];
      await settled();
      assert.dom(SELECT).hasValue('option-2');
    });

    test('a new <select> after @inline changes gets @defaultValue', async function (assert) {
      const inline = tracked(false);

      await render(
        <template>
          <Select
            @id="select"
            @defaultValue="option-2"
            @inline={{inline.value}}
            as |SelectItem|
          >
            <SelectItem @value="option-1" @text="Option 1" />
            <SelectItem @value="option-2" @text="Option 2" />
          </Select>
        </template>,
      );

      inline.value = true;
      await settled();
      assert.dom('.cds--select-input--inline__wrapper').exists();
      assert.dom(SELECT).hasValue('option-2');
    });
  });
});
