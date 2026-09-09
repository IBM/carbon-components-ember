import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor, waitUntil, settled } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import DatePicker from 'carbon-components-ember/components/date-picker';

// flatpickr renders its calendar into `document.body`, outside the
// `#ember-testing` root that `find`/`click`/`waitFor`/`assert.dom` scope to
// by default (see the addon's `in-element portal test pattern` convention -
// same idea, just from a third-party library instead of `{{in-element}}`).
// These helpers go through the real `document` instead.
function flatpickrCalendar() {
  return document.querySelector<HTMLElement>('.flatpickr-calendar');
}

function flatpickrDay(ariaLabel: string) {
  return document.querySelector<HTMLElement>(
    `.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)[aria-label="${ariaLabel}"]`,
  );
}

async function openCalendar() {
  await click('input.cds--date-picker__input');
  await waitUntil(() => flatpickrCalendar()?.classList.contains('open'));
}

function ariaLabelFor(date: Date) {
  return `${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;
}

function mdyFor(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${date.getFullYear()}`;
}

module('Integration | Component | DatePicker', (hooks) => {
  setupRenderingTest(hooks);

  test('simple: renders a plain input with no calendar', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='simple' as |Input|>
          <Input @labelText='Date' @placeholder='mm/dd/yyyy' />
        </DatePicker>
      </template>,
    );

    assert.dom('.cds--date-picker--simple').exists();
    assert.dom('input.cds--date-picker__input').exists({ count: 1 });
    assert.dom('input.cds--date-picker__input').hasAttribute('placeholder', 'mm/dd/yyyy');
    assert.notOk(flatpickrCalendar(), 'no flatpickr calendar is created');
  });

  test('simple: seeds the input from @value', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='simple' @value='01/15/2024' as |Input|>
          <Input @labelText='Date' />
        </DatePicker>
      </template>,
    );

    assert.dom('input.cds--date-picker__input').hasValue('01/15/2024');
  });

  test('single: opens a calendar and selecting a day fills the field and calls onChange',
    async function (assert) {
      const jan15 = new Date(2024, 0, 15);
      let receivedDates: Date[] | undefined;
      let receivedDateStr: string | undefined;
      const handleChange = (dates: Date[], dateStr: string) => {
        receivedDates = dates;
        receivedDateStr = dateStr;
      };

      await render(
        <template>
          <DatePicker
            @datePickerType='single'
            @value={{jan15}}
            @onChange={{handleChange}}
            as |Input|
          >
            <Input @labelText='Date' />
          </DatePicker>
        </template>,
      );

      assert.dom('.cds--date-picker--single').exists();

      await openCalendar();
      await click(flatpickrDay('January 20, 2024')!);
      await settled();

      assert.dom('input.cds--date-picker__input').hasValue('01/20/2024');
      assert.strictEqual(receivedDateStr, '01/20/2024');
      assert.strictEqual(receivedDates?.length, 1);
    });

  test('single: the calendar stays interactive across two selections when @value is controlled',
    async function (assert) {
      const date = cell<Date | undefined>(new Date(2024, 0, 15));
      const handleChange = (dates: Date[]) => {
        date.current = dates[0];
      };

      await render(
        <template>
          <DatePicker
            @datePickerType='single'
            @value={{date.current}}
            @onChange={{handleChange}}
            as |Input|
          >
            <Input @labelText='Date' />
          </DatePicker>
        </template>,
      );

      await openCalendar();
      await click(flatpickrDay('January 20, 2024')!);
      await settled();
      assert.dom('input.cds--date-picker__input').hasValue('01/20/2024');

      // A second, independent selection must still work - if `@value`
      // changing had torn down and rebuilt the flatpickr instance, the
      // calendar re-opened here would be a fresh, disconnected instance.
      await openCalendar();
      await click(flatpickrDay('January 25, 2024')!);
      await settled();

      assert.dom('input.cds--date-picker__input').hasValue('01/25/2024');
    });

  test('range: renders two fields sharing one calendar and selecting a range fills both',
    async function (assert) {
      // No `@value` here (unlike the `single` tests above): seeding `@value`
      // with a single `Date` for a `range` picker pre-populates flatpickr's
      // internal `selectedDates` with one entry, which would make the very
      // first click below complete (and close) the range immediately. Since
      // there's no defaultDate to pin the visible month, the two days picked
      // here are relative to today's month/year instead of hardcoded.
      const now = new Date();
      const rangeStart = new Date(now.getFullYear(), now.getMonth(), 10);
      const rangeEnd = new Date(now.getFullYear(), now.getMonth(), 15);
      let receivedDates: Date[] | undefined;
      const handleChange = (dates: Date[]) => {
        receivedDates = dates;
      };

      await render(
        <template>
          <DatePicker @datePickerType='range' @onChange={{handleChange}} as |Input|>
            <Input @labelText='Start date' />
            <Input @labelText='End date' />
          </DatePicker>
        </template>,
      );

      assert.dom('.cds--date-picker--range').exists();
      assert.dom('input.cds--date-picker__input').exists({ count: 2 });

      await openCalendar();
      await click(flatpickrDay(ariaLabelFor(rangeStart))!);
      await click(flatpickrDay(ariaLabelFor(rangeEnd))!);
      await settled();

      const inputs = Array.from(
        document.querySelectorAll<HTMLInputElement>('input.cds--date-picker__input'),
      );
      assert.strictEqual(inputs[0]?.value, mdyFor(rangeStart));
      assert.strictEqual(inputs[1]?.value, mdyFor(rangeEnd));
      assert.strictEqual(receivedDates?.length, 2);
    });

  test('minDate disables earlier days in the calendar', async function (assert) {
    const jan15 = new Date(2024, 0, 15);
    const jan10 = new Date(2024, 0, 10);

    await render(
      <template>
        <DatePicker
          @datePickerType='single'
          @value={{jan15}}
          @minDate={{jan10}}
          as |Input|
        >
          <Input @labelText='Date' />
        </DatePicker>
      </template>,
    );

    await openCalendar();

    assert.dom(flatpickrDay('January 5, 2024')).hasClass('flatpickr-disabled');
    assert.dom(flatpickrDay('January 15, 2024')).doesNotHaveClass('flatpickr-disabled');
  });

  test('readOnly is passed down to the yielded DatePickerInput', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='single' @readOnly={{true}} as |Input|>
          <Input @labelText='Date' />
        </DatePicker>
      </template>,
    );

    assert.dom('input.cds--date-picker__input').hasAttribute('readonly');
  });

  test('destroys the flatpickr instance on teardown', async function (assert) {
    const show = cell(true);

    await render(
      <template>
        {{#if show.current}}
          <DatePicker @datePickerType='single' as |Input|>
            <Input @labelText='Date' />
          </DatePicker>
        {{/if}}
      </template>,
    );

    assert.ok(flatpickrCalendar(), 'the calendar is created on render');

    show.current = false;
    await settled();

    assert.notOk(flatpickrCalendar(), 'the calendar is removed on teardown');
  });

  test('DatePickerInput: shows the invalid state and message', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='single' as |Input|>
          <Input @labelText='Date' @invalid={{true}} @invalidText='Enter a valid date' />
        </DatePicker>
      </template>,
    );
    await waitFor('.cds--date-picker__icon--invalid');

    assert.dom('input.cds--date-picker__input').hasClass('cds--date-picker__input--invalid');
    assert.dom('.cds--date-picker__icon--invalid').exists();
    assert.dom('.cds--form-requirement').hasText('Enter a valid date');
  });

  test('DatePickerInput: shows the warn state and message when not invalid', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='single' as |Input|>
          <Input @labelText='Date' @warn={{true}} @warnText='Double check this date' />
        </DatePicker>
      </template>,
    );

    assert.dom('input.cds--date-picker__input').hasClass('cds--date-picker__input--warn');
    assert.dom('.cds--form-requirement').hasText('Double check this date');
  });

  test('DatePickerInput: shows the helper text when not invalid or warn', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='single' as |Input|>
          <Input @labelText='Date' @helperText='Format: mm/dd/yyyy' />
        </DatePicker>
      </template>,
    );

    assert.dom('.cds--form__helper-text').hasText('Format: mm/dd/yyyy');
  });

  test('DatePickerInput: renders a decorator', async function (assert) {
    const Badge = <template><span class='my-badge'>*</span></template>;

    await render(
      <template>
        <DatePicker @datePickerType='single' as |Input|>
          <Input @labelText='Date' @decorator={{Badge}} />
        </DatePicker>
      </template>,
    );

    assert.dom('.cds--date-picker-input__wrapper--decorator .my-badge').exists();
  });
});
