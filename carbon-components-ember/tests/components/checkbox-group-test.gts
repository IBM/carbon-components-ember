import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import CheckboxGroup from '#src/components/checkbox-group.gts';

module('Integration | Component | CheckboxGroup', (hooks) => {
  setupRenderingTest(hooks);

  test('renders a fieldset with a legend and its checkboxes', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group label" as |Checkbox|>
          <Checkbox @labelText="One" />
          <Checkbox @labelText="Two" />
        </CheckboxGroup>
      </template>,
    );

    assert.dom('fieldset.cds--checkbox-group').exists();
    assert.dom('fieldset > legend.cds--label').hasText('Group label');
    assert.dom('input.cds--checkbox').exists({ count: 2 });
    assert.dom('fieldset').doesNotHaveClass('cds--checkbox-group--horizontal');
  });

  test('labels the fieldset by its legend id', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group" @legendId="legend-1" />
      </template>,
    );

    assert.dom('fieldset').hasAttribute('aria-labelledby', 'legend-1');
    assert.dom('legend').hasAttribute('id', 'legend-1');
  });

  test('takes a horizontal orientation, and attributes', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          @legendText="Group"
          @orientation="horizontal"
          class="mine"
          data-test="x"
        />
      </template>,
    );

    assert
      .dom('fieldset')
      .hasClass('cds--checkbox-group--horizontal')
      .hasClass('mine')
      .hasAttribute('data-test', 'x');
  });

  test('shows the helper text and points aria-describedby at it', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group" @helperText="Help" />
      </template>,
    );

    const helper = document.querySelector('.cds--form__helper-text')!;
    assert.strictEqual(helper.textContent, 'Help');
    assert.dom('fieldset').hasAttribute('aria-describedby', helper.id);
  });

  test('invalid shows its text instead of the helper, and passes invalid to its checkboxes', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          @legendText="Group"
          @helperText="Help"
          @invalid={{true}}
          @invalidText="Bad"
          as |Checkbox|
        >
          <Checkbox @labelText="One" />
          <Checkbox @labelText="Two" @invalid={{false}} />
        </CheckboxGroup>
      </template>,
    );

    assert
      .dom('fieldset')
      .hasClass('cds--checkbox-group--invalid')
      .hasAttribute('data-invalid', 'true')
      .doesNotHaveAttribute('aria-describedby');
    assert
      .dom('.cds--checkbox-group__validation-msg .cds--form-requirement')
      .hasText('Bad');
    assert.dom('.cds--form__helper-text').doesNotExist();
    assert
      .dom('.cds--checkbox-wrapper--invalid')
      .exists({ count: 1 }, 'a checkbox with its own @invalid keeps it');
  });

  test('warn shows its text and passes warn to its checkboxes', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          @legendText="Group"
          @warn={{true}}
          @warnText="Careful"
          as |Checkbox|
        >
          <Checkbox @labelText="One" />
        </CheckboxGroup>
      </template>,
    );

    assert.dom('fieldset').hasClass('cds--checkbox-group--warning');
    assert
      .dom('.cds--checkbox-group__validation-msg .cds--form-requirement')
      .hasText('Careful');
    assert.dom('.cds--checkbox-wrapper--warning').exists();
  });

  test('read-only sets aria-readonly and makes its checkboxes read-only', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group" @readOnly={{true}} as |Checkbox|>
          <Checkbox @labelText="One" />
        </CheckboxGroup>
      </template>,
    );

    assert
      .dom('fieldset')
      .hasClass('cds--checkbox-group--readonly')
      .hasAttribute('aria-readonly', 'true');
    assert.dom('input.cds--checkbox').hasAttribute('aria-readonly', 'true');
  });

  test('disabled disables the fieldset, which disables its checkboxes', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group" @disabled={{true}} as |Checkbox|>
          <Checkbox @id="a" @labelText="One" />
          <Checkbox @id="b" @labelText="Two" @disabled={{false}} />
        </CheckboxGroup>
      </template>,
    );

    assert.dom('fieldset').isDisabled().hasAttribute('aria-disabled', 'true');
    assert.dom('#a').isDisabled();
    assert.dom('#b').doesNotHaveAttribute('disabled');
    assert.true(
      document.querySelector('#b')!.matches(':disabled'),
      'its fieldset still disables it',
    );
  });

  test('an explicit false renders aria-readonly and aria-disabled, undefined renders neither', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          id="off"
          @legendText="Group"
          @readOnly={{false}}
          @disabled={{false}}
        />
        <CheckboxGroup id="unset" @legendText="Group" />
      </template>,
    );

    assert
      .dom('#off')
      .hasAttribute('aria-readonly', 'false')
      .hasAttribute('aria-disabled', 'false')
      .doesNotHaveClass('cds--checkbox-group--readonly');
    assert
      .dom('#unset')
      .doesNotHaveAttribute('aria-readonly')
      .doesNotHaveAttribute('aria-disabled');
  });

  test('a caller aria-labelledby overrides the one from the legend id', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          @legendText="Group"
          @legendId="legend-1"
          aria-labelledby="other"
        />
      </template>,
    );

    assert.dom('fieldset').hasAttribute('aria-labelledby', 'other');
    assert.dom('legend').hasAttribute('id', 'legend-1');
  });

  test('the legend takes the id a caller aria-labelledby points at', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group" aria-labelledby="mine" />
      </template>,
    );

    assert.dom('fieldset').hasAttribute('aria-labelledby', 'mine');
    assert.dom('legend').hasAttribute('id', 'mine');
  });

  test('warn hides the helper text', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          @legendText="Group"
          @helperText="Help"
          @warn={{true}}
          @warnText="Careful"
        />
      </template>,
    );

    assert.dom('.cds--form__helper-text').doesNotExist();
    assert.dom('fieldset').doesNotHaveAttribute('aria-describedby');
  });

  test('read-only and disabled suppress invalid and warn on the group and its checkboxes', async function (assert) {
    await render(
      <template>
        <CheckboxGroup
          id="ro"
          @legendText="Group"
          @readOnly={{true}}
          @invalid={{true}}
          @invalidText="Bad"
          @warn={{true}}
          @warnText="Careful"
          as |Checkbox|
        >
          <Checkbox @labelText="One" />
        </CheckboxGroup>
        <CheckboxGroup
          id="dis"
          @legendText="Group"
          @disabled={{true}}
          @invalid={{true}}
          @invalidText="Bad"
          @warn={{true}}
          @warnText="Careful"
          as |Checkbox|
        >
          <Checkbox @labelText="One" />
        </CheckboxGroup>
      </template>,
    );

    for (const id of ['#ro', '#dis']) {
      assert
        .dom(id)
        .doesNotHaveClass('cds--checkbox-group--invalid')
        .doesNotHaveClass('cds--checkbox-group--warning')
        .doesNotHaveAttribute('data-invalid');
    }
    assert.dom('.cds--form-requirement').doesNotExist();
    assert.dom('.cds--checkbox-wrapper--invalid').doesNotExist();
    assert.dom('.cds--checkbox-wrapper--warning').doesNotExist();
  });

  test('a checkbox with its own warn or readOnly keeps it', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group" as |Checkbox|>
          <Checkbox @id="w" @labelText="One" @warn={{true}} @warnText="Hm" />
          <Checkbox @id="r" @labelText="Two" @readOnly={{true}} />
          <Checkbox @id="n" @labelText="Three" />
        </CheckboxGroup>
      </template>,
    );

    assert.dom('.cds--checkbox-wrapper--warning').exists({ count: 1 });
    assert.dom('.cds--checkbox-wrapper--warning input').hasAttribute('id', 'w');
    assert.dom('#r').hasAttribute('aria-readonly', 'true');
    assert.dom('#n').doesNotHaveAttribute('aria-readonly');
  });

  test('the decorator block yields a mini AI label', async function (assert) {
    await render(
      <template>
        <CheckboxGroup @legendText="Group">
          <:decorator as |AILabel|><AILabel /></:decorator>
        </CheckboxGroup>
      </template>,
    );

    assert.dom('fieldset').hasClass('cds--checkbox-group--decorator');
    assert
      .dom('.cds--checkbox-group-inner--decorator .cds--ai-label__button--mini')
      .exists();
  });
});
