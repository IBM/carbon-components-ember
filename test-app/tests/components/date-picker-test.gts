import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor, waitUntil, settled } from '@ember/test-helpers';
import { cell } from 'ember-resources';
import DatePicker from 'carbon-components-ember/components/date-picker';
import * as carbonStyle from '@carbon/styles/css/styles.css?inline';
import { waitForAnimationFrame } from '../helpers';

// `DatePicker` defaults flatpickr's calendar to append inside its own
// container (so it can't escape a shadow root - see `appendTo`'s doc
// comment on the component), but that's still a sibling subtree flatpickr
// manages itself outside Ember's render tree, and an explicit `@appendTo`
// can redirect it anywhere, including straight to `document.body` (see the
// addon's `in-element portal test pattern` convention - same idea, just
// from a third-party library instead of `{{in-element}}`). These helpers go
// through the real `document` instead of relying on `assert.dom`'s default
// `#ember-testing`-scoped context.
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

  test('simple: formats a Date @value through @dateFormat instead of stringifying it raw',
    async function (assert) {
      const jan15 = new Date(2024, 0, 15);

      await render(
        <template>
          <DatePicker @datePickerType='simple' @value={{jan15}} as |Input|>
            <Input @labelText='Date' />
          </DatePicker>
        </template>,
      );

      assert.dom('input.cds--date-picker__input').hasValue('01/15/2024');
    });

  test('simple: re-syncs the input when a controlled @value changes after mount',
    async function (assert) {
      const jan15 = new Date(2024, 0, 15);
      const value = cell<Date>(jan15);

      await render(
        <template>
          <DatePicker @datePickerType='simple' @value={{value.current}} as |Input|>
            <Input @labelText='Date' />
          </DatePicker>
        </template>,
      );

      assert.dom('input.cds--date-picker__input').hasValue('01/15/2024');

      // `simple` mode never has a flatpickr instance, so this must write
      // through to the raw `<input>` directly (`syncValue`'s no-calendar
      // branch) - there is no `minDate`/`allowInput`/etc. change here to
      // trigger `attachFlatpickr`'s rebuild path instead.
      value.current = new Date(2024, 0, 20);
      await settled();

      assert.dom('input.cds--date-picker__input').hasValue('01/20/2024');
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

  test('single: prev/next month arrows render a properly-sized 16px chevron icon',
    async function (assert) {
      await render(
        <template>
          <DatePicker @datePickerType='single' as |Input|>
            <Input @labelText='Date' />
          </DatePicker>
        </template>,
      );

      await openCalendar();

      const prevSvg = document.querySelector('.flatpickr-prev-month svg');
      const nextSvg = document.querySelector('.flatpickr-next-month svg');

      assert.strictEqual(prevSvg?.getAttribute('width'), '16', 'prev arrow svg has an explicit width');
      assert.strictEqual(prevSvg?.getAttribute('height'), '16', 'prev arrow svg has an explicit height');
      assert.strictEqual(nextSvg?.getAttribute('width'), '16', 'next arrow svg has an explicit width');
      assert.strictEqual(nextSvg?.getAttribute('height'), '16', 'next arrow svg has an explicit height');
    });

  test('single: without @appendTo, the calendar dropdown defaults into the picker\'s own container instead of document.body',
    async function (assert) {
      await render(
        <template>
          <DatePicker @datePickerType='single' as |Input|>
            <Input @labelText='Date' />
          </DatePicker>
        </template>,
      );

      await openCalendar();

      assert.strictEqual(
        flatpickrCalendar()?.parentElement,
        document.querySelector('.cds--form-item'),
        "the calendar defaults into the picker's own .cds--form-item container, so it stays inside whatever root (shadow or document) the picker itself renders into",
      );
      assert.notStrictEqual(
        flatpickrCalendar()?.parentElement,
        document.body,
        'the calendar is not appended directly to document.body by default',
      );
    });

  test('single: @appendTo redirects the calendar dropdown into a custom root instead of document.body',
    async function (assert) {
      const container = document.createElement('div');
      document.body.appendChild(container);

      try {
        await render(
          <template>
            <DatePicker @datePickerType='single' @appendTo={{container}} as |Input|>
              <Input @labelText='Date' />
            </DatePicker>
          </template>,
        );

        await openCalendar();

        assert.strictEqual(
          flatpickrCalendar()?.parentElement,
          container,
          'the calendar is appended into @appendTo, not document.body directly',
        );
      } finally {
        container.remove();
      }
    });

  test('single: the calendar dropdown lands next to its input even when @appendTo sits under a position:relative ancestor',
    async function (assert) {
      // flatpickr's own positioning assumes the calendar's containing
      // block sits at the document origin (true for its own default of
      // appending straight to `document.body`) - a `position: relative`
      // ancestor between `@appendTo` and `<body>`, offset from the
      // document origin, is exactly what used to detach the calendar from
      // its input (see `positionCalendarWithinAppendTo`'s doc comment).
      // `.flatpickr-calendar`'s `position: absolute` only comes from real
      // `@carbon/styles` CSS (flatpickr's own stylesheet is never
      // imported), which test-app's dev-mode build doesn't reliably load
      // for a component under test - inject it directly so this test
      // actually exercises real layout instead of the browser's static
      // default.
      const ancestor = document.createElement('div');
      ancestor.style.position = 'relative';
      ancestor.style.marginTop = '500px';
      ancestor.style.marginLeft = '300px';
      document.body.appendChild(ancestor);

      const container = document.createElement('div');
      ancestor.appendChild(container);

      try {
        await render(
          <template>
            <style>{{carbonStyle.default}}</style>
            <DatePicker @datePickerType='single' @appendTo={{container}} as |Input|>
              <Input @labelText='Date' />
            </DatePicker>
          </template>,
        );
        await waitForAnimationFrame();

        await openCalendar();

        const inputRect = document
          .querySelector('input.cds--date-picker__input')!
          .getBoundingClientRect();
        const calendarRect = flatpickrCalendar()!.getBoundingClientRect();

        assert.ok(
          Math.abs(calendarRect.left - inputRect.left) < 5,
          `calendar left (${calendarRect.left}) is close to input left (${inputRect.left})`,
        );
        assert.ok(
          Math.abs(calendarRect.top - inputRect.bottom) < 10,
          `calendar top (${calendarRect.top}) is close to input bottom (${inputRect.bottom})`,
        );
      } finally {
        ancestor.remove();
      }
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

  test('range: a controlled @value update after mount syncs both fields',
    async function (assert) {
      // Regression test: flatpickr's `setDate(dates, false)` (used by
      // `syncValue` to re-sync a controlled `@value` without rebuilding the
      // calendar) only writes the *start* input directly - the stock
      // `rangePlugin` only ever writes the *end* input from inside its own
      // `onValueUpdate` handler, which flatpickr skips firing when
      // `triggerChange` is falsy. Without `syncValue`'s own end-input write,
      // the end field would keep showing the initial value below.
      const initial = new Date(2024, 0, 10);
      const initialEnd = new Date(2024, 0, 15);
      const value = cell<Date[]>([initial, initialEnd]);

      await render(
        <template>
          <DatePicker @datePickerType='range' @value={{value.current}} as |Input|>
            <Input @labelText='Start date' />
            <Input @labelText='End date' />
          </DatePicker>
        </template>,
      );

      const inputs = () =>
        Array.from(
          document.querySelectorAll<HTMLInputElement>('input.cds--date-picker__input'),
        );

      assert.strictEqual(inputs()[0]?.value, mdyFor(initial));
      assert.strictEqual(inputs()[1]?.value, mdyFor(initialEnd));

      const newStart = new Date(2024, 1, 5);
      const newEnd = new Date(2024, 1, 10);
      value.current = [newStart, newEnd];
      await settled();

      assert.strictEqual(inputs()[0]?.value, mdyFor(newStart));
      assert.strictEqual(
        inputs()[1]?.value,
        mdyFor(newEnd),
        'the end field is re-synced too, not left showing the initial value',
      );
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

  test('single: changing minDate after a selection preserves the current value instead of reverting to the initial @value',
    async function (assert) {
      const jan15 = new Date(2024, 0, 15);
      const minDate = cell(new Date(2024, 0, 1));

      await render(
        <template>
          <DatePicker
            @datePickerType='single'
            @value={{jan15}}
            @minDate={{minDate.current}}
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

      // `minDate` is one of `attachFlatpickr`'s tracked args, so changing it
      // tears down and rebuilds the flatpickr instance - the rebuild must
      // reseed from the user's current selection, not the original `@value`
      // the picker was constructed with.
      minDate.current = new Date(2024, 0, 2);
      await settled();

      assert.dom('input.cds--date-picker__input').hasValue('01/20/2024');
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

  test('DatePickerInput: shows the plain calendar icon instead of invalid/warn when disabled', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='single' as |Input|>
          <Input
            @labelText='Date'
            @disabled={{true}}
            @invalid={{true}}
            @invalidText='Enter a valid date'
          />
        </DatePicker>
      </template>,
    );

    assert.dom('.cds--date-picker__icon--invalid').doesNotExist();
    assert.dom('.cds--date-picker__icon').exists();
  });

  test('DatePickerInput: shows the plain calendar icon instead of invalid/warn when readOnly', async function (assert) {
    await render(
      <template>
        <DatePicker @datePickerType='single' as |Input|>
          <Input
            @labelText='Date'
            @readOnly={{true}}
            @warn={{true}}
            @warnText='Double check this date'
          />
        </DatePicker>
      </template>,
    );

    assert.dom('.cds--date-picker__icon--warn').doesNotExist();
    assert.dom('.cds--date-picker__icon').exists();
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
