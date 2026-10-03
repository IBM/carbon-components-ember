import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, findAll, render } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import { clickTrigger } from 'ember-power-select/test-support/helpers';
import Select from '#src/components/select.gts';

const OPTIONS = ['Apple', 'Banana', 'Cherry'];

function optionTexts() {
  return findAll('.ember-power-select-option').map((el) =>
    el.textContent.trim(),
  );
}

function tagLabels() {
  return findAll('.cds--multi-select .cds--tag__label').map((el) =>
    el.textContent.trim(),
  );
}

module('Integration | Component | Select', function (hooks) {
  setupRenderingTest(hooks);

  module('single', function () {
    test('shows the placeholder until something is selected', async function (assert) {
      await render(
        <template>
          <Select @options={{OPTIONS}} @placeholder="Choose a fruit" />
        </template>,
      );

      assert
        .dom('.cds--list-box__field .cds--list-box__label')
        .hasText('Choose a fruit');
      assert
        .dom('.ember-power-select-option')
        .doesNotExist('closed by default');
    });

    test('opens to list every option', async function (assert) {
      await render(<template><Select @options={{OPTIONS}} /></template>);

      await clickTrigger();

      assert.deepEqual(optionTexts(), OPTIONS);
      assert
        .dom('.cds--list-box__menu')
        .exists('options render in the Carbon menu');
    });

    test('choosing an option calls @onSelect with it and shows it in the trigger', async function (assert) {
      class State {
        @tracked selected?: string;
      }
      const state = new State();
      const selections: string[] = [];
      const onSelect = (value: string) => {
        selections.push(value);
        state.selected = value;
      };

      await render(
        <template>
          <Select
            @options={{OPTIONS}}
            @selected={{state.selected}}
            @onSelect={{onSelect}}
          />
        </template>,
      );

      await clickTrigger();
      await click(findAll('.ember-power-select-option')[1]!);

      assert.deepEqual(selections, ['Banana']);
      assert.dom('.cds--multi-select .cds--list-box__label').hasText('Banana');
      assert
        .dom('.ember-power-select-option')
        .doesNotExist('closes after choosing');
    });
  });

  module('multiple', function () {
    test('renders a checkbox per option, checked for the selected ones', async function (assert) {
      const selected = ['Cherry'];
      await render(
        <template>
          <Select
            @options={{OPTIONS}}
            @selected={{selected}}
            @multiple={{true}}
          />
        </template>,
      );

      await clickTrigger();

      assert.deepEqual(optionTexts(), OPTIONS);
      // A drawn checkbox (as in Carbon React's MultiSelect): the option
      // itself is what's selected, so it holds no real checkbox input.
      assert
        .dom('.ember-power-select-option input[type="checkbox"]')
        .doesNotExist();
      const checkboxes = findAll(
        '.ember-power-select-option .cds--checkbox-label',
      );
      assert.deepEqual(
        checkboxes.map((box) =>
          box.getAttribute('data-contained-checkbox-state'),
        ),
        ['false', 'false', 'true'],
      );
      const options = findAll('.ember-power-select-option');
      assert.deepEqual(
        options.map((option) => option.getAttribute('aria-selected')),
        ['false', 'false', 'true'],
      );
    });

    test('choosing options adds them, keeps the menu open and renders a tag each', async function (assert) {
      class State {
        @tracked selected: string[] = [];
      }
      const state = new State();
      const selections: string[][] = [];
      const added: string[] = [];
      const onSelect = (value: string[]) => {
        selections.push(value);
        state.selected = value;
      };
      const addItem = (item: string) => added.push(item);

      await render(
        <template>
          <Select
            @options={{OPTIONS}}
            @selected={{state.selected}}
            @multiple={{true}}
            @onSelect={{onSelect}}
            @addItem={{addItem}}
          />
        </template>,
      );

      await clickTrigger();
      await click(findAll('.ember-power-select-option')[0]!);
      await click(findAll('.ember-power-select-option')[2]!);

      assert.deepEqual(selections, [['Apple'], ['Apple', 'Cherry']]);
      assert.deepEqual(added, ['Apple', 'Cherry']);
      assert.deepEqual(tagLabels(), ['Apple', 'Cherry']);
      assert
        .dom('.ember-power-select-option')
        .exists({ count: 3 }, 'stays open');
    });

    test("clicking a tag's close button removes that item", async function (assert) {
      class State {
        @tracked selected = ['Apple', 'Banana'];
      }
      const state = new State();
      const removed: string[] = [];
      const onSelect = (value: string[]) => (state.selected = value);
      const removeItem = (item: string) => removed.push(item);

      await render(
        <template>
          <Select
            @options={{OPTIONS}}
            @selected={{state.selected}}
            @multiple={{true}}
            @onSelect={{onSelect}}
            @removeItem={{removeItem}}
          />
        </template>,
      );

      assert.deepEqual(tagLabels(), ['Apple', 'Banana']);

      await click(find('.cds--multi-select .cds--tag__close-icon')!);

      assert.deepEqual(removed, ['Apple']);
      assert.deepEqual(state.selected, ['Banana']);
      assert.deepEqual(tagLabels(), ['Banana']);
    });

    test('@showNumber shows a count instead of one tag per item', async function (assert) {
      const selected = ['Apple', 'Banana'];
      await render(
        <template>
          <Select
            @options={{OPTIONS}}
            @selected={{selected}}
            @multiple={{true}}
            @showNumber={{true}}
          />
        </template>,
      );

      assert.deepEqual(tagLabels(), ['2']);
    });
  });

  module('accessibility', function () {
    test('@title labels the combobox and its options, @helperText describes it', async function (assert) {
      await render(
        <template>
          <Select @options={{OPTIONS}} @title="Fruit" @helperText="Pick one" />
        </template>,
      );

      const label = find('.cds--label')!;
      const helper = find('.cds--form__helper-text')!;
      assert.dom(label).hasText('Fruit');
      assert.dom(helper).hasText('Pick one');
      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('role', 'combobox')
        .hasAttribute('aria-labelledby', label.id)
        .hasAttribute('aria-describedby', helper.id);

      await clickTrigger();
      assert
        .dom('.ember-power-select-options')
        .hasAttribute('aria-labelledby', label.id);
    });

    test('without @title the placeholder names the combobox', async function (assert) {
      await render(
        <template>
          <Select @options={{OPTIONS}} @placeholder="Choose a fruit" />
        </template>,
      );

      assert
        .dom('.ember-power-select-trigger')
        .hasAttribute('aria-label', 'Choose a fruit')
        .doesNotHaveAttribute('aria-labelledby');
    });

    test('the trigger is the only focusable element', async function (assert) {
      await render(
        <template>
          <Select @options={{OPTIONS}} @placeholder="Choose a fruit" />
        </template>,
      );

      assert.dom('.ember-power-select-trigger').hasAttribute('tabindex', '0');
      assert.dom('.ember-power-select-trigger [tabindex]').doesNotExist();
      assert.dom('.ember-power-select-trigger button').doesNotExist();
    });
  });
});
