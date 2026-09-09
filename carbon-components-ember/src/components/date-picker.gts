/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier as eModifier } from 'ember-modifier';
import type Owner from '@ember/owner';
import type { WithBoundArgs } from '@glint/template';
import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';
import type {
  DateOption,
  Options as FlatpickrOptions,
} from 'flatpickr/dist/types/options';
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';
import DatePickerInput from './date-picker-input.gts';

export type DatePickerType = 'simple' | 'single' | 'range';
export type DatePickerValue = DateOption | DateOption[];
export type DatePickerChangeHandler = (
  selectedDates: Date[],
  dateStr: string,
  instance: FlatpickrInstance,
) => void;

export interface DatePickerSignature {
  Element: HTMLDivElement;
  Args: {
    /**
     * `simple` renders a plain text field with no calendar. `single` and
     * `range` render a calendar dropdown (backed by flatpickr), for one
     * date or two (start/end) respectively.
     */
    datePickerType?: DatePickerType;
    /**
     * A flatpickr format string controlling how dates are displayed and
     * parsed.
     */
    dateFormat?: string;
    /**
     * The date (or, for `range`, the `[start, end]` dates) to seed the
     * field(s) with. Uncontrolled: flatpickr owns the field's value after
     * that - update it imperatively through `@onChange`, there is no
     * `@onChange`-driven re-render of the calendar itself. Accepts anything
     * flatpickr's own `defaultDate`/`setDate` accept (a `Date`, a
     * date string, a timestamp, or - for `range` - an array of two).
     */
    value?: DatePickerValue;
    /**
     * The minimum selectable date.
     */
    minDate?: DateOption;
    /**
     * The maximum selectable date.
     */
    maxDate?: DateOption;
    /**
     * Flatpickr prop passthrough: whether the field(s) can be edited by
     * typing directly, in addition to picking from the calendar.
     */
    allowInput?: boolean;
    /**
     * Whether the calendar dropdown closes as soon as a date is picked.
     */
    closeOnSelect?: boolean;
    /**
     * Whether the field(s) are read-only. A read-only picker has no
     * calendar and cannot be typed into.
     */
    readOnly?: boolean;
    /**
     * Renders the compact/short variant.
     */
    short?: boolean;
    /**
     * @deprecated Use `Layer` to place the picker on a different background
     * instead.
     */
    light?: boolean;
    /**
     * Called whenever the selection changes.
     */
    onChange?: DatePickerChangeHandler;
    /**
     * Called when the calendar dropdown opens.
     */
    onOpen?: DatePickerChangeHandler;
    /**
     * Called when the calendar dropdown closes.
     */
    onClose?: DatePickerChangeHandler;
  };
  Blocks: {
    /**
     * Yields `DatePickerInput`, pre-bound to this picker's `@datePickerType`
     * and `@readOnly`. Render one for `simple`/`single`, two (start, then
     * end) for `range`.
     */
    default: [WithBoundArgs<typeof DatePickerInput, 'datePickerType' | 'readOnly'>];
  };
}

// Mirrors Carbon React's `updateClassNames`: flatpickr's calendar markup
// only carries its own `flatpickr-*` classes, but `@carbon/styles` themes
// the calendar through `cds--date-picker__*` classes layered on top. This
// has to re-run on every `onReady`/`onMonthChange`/`onYearChange`/
// `onValueUpdate`, since paging the calendar creates new day nodes that
// never picked up the `cds--` classes otherwise.
function addCarbonCalendarClasses(instance: FlatpickrInstance) {
  const { calendarContainer, days } = instance;
  if (!calendarContainer || !days) return;
  calendarContainer.classList.add('cds--date-picker__calendar');
  calendarContainer
    .querySelector('.flatpickr-month')
    ?.classList.add('cds--date-picker__month');
  calendarContainer
    .querySelector('.flatpickr-weekdays')
    ?.classList.add('cds--date-picker__weekdays');
  calendarContainer
    .querySelector('.flatpickr-days')
    ?.classList.add('cds--date-picker__days');
  calendarContainer
    .querySelectorAll('.flatpickr-weekday')
    .forEach((weekday) => weekday.classList.add('cds--date-picker__weekday'));
  days
    .querySelectorAll('.flatpickr-day')
    .forEach((day) => day.classList.add('cds--date-picker__day'));
}

/**
 * `DatePicker` wraps [flatpickr](https://flatpickr.js.org/) to provide a
 * `simple` (plain text field), `single` (one field plus a calendar), or
 * `range` (two fields sharing one calendar) date field. It never touches
 * `document`/`window` outside of the modifier below, so it's inert during
 * SSR/fastboot - the flatpickr instance is only ever created once the
 * picker's element is actually in the DOM, and torn down through the same
 * modifier's cleanup when it's removed.
 *
 * ```gjs
 * import { DatePicker } from 'carbon-components-ember/components';
 *
 * <template>
 *   <DatePicker @datePickerType='single' @onChange={{this.handleChange}} as |Input|>
 *     <Input @labelText='Date' @placeholder='mm/dd/yyyy' />
 *   </DatePicker>
 * </template>
 * ```
 */
export default class DatePicker extends Component<DatePickerSignature> {
  // Plain instance state, not `@tracked` - both live only inside the two
  // modifiers below and are never read from the template.
  calendar: FlatpickrInstance | null = null;
  initialValue: DatePickerSignature['Args']['value'];

  constructor(owner: Owner, args: DatePickerSignature['Args']) {
    super(owner, args);
    // Captured once, non-reactively (mirrors `defaultValue` seeding
    // elsewhere in this addon) - `attachFlatpickr` below intentionally
    // does not track `@value` itself. Live updates flow through
    // `syncValue` instead, so that changing `@value` sets the date on the
    // existing flatpickr instance rather than tearing down and rebuilding
    // it mid-interaction (see the `syncValue` doc comment).
    this.initialValue = args.value;
  }

  get datePickerType(): DatePickerType {
    return this.args.datePickerType ?? 'simple';
  }

  get dateFormat() {
    return this.args.dateFormat ?? 'm/d/Y';
  }

  get allowInput() {
    return this.args.allowInput ?? true;
  }

  get closeOnSelect() {
    return this.args.closeOnSelect ?? true;
  }

  get readOnly() {
    return !!this.args.readOnly;
  }

  get datePickerClasses() {
    const classes = ['cds--date-picker', `cds--date-picker--${this.datePickerType}`];
    if (this.args.short) classes.push('cds--date-picker--short');
    if (this.args.light) classes.push('cds--date-picker--light');
    return classes.join(' ');
  }

  @action
  handleChange(selectedDates: Date[], dateStr: string, instance: FlatpickrInstance) {
    if (this.readOnly) return;
    this.args.onChange?.(selectedDates, dateStr, instance);
  }

  // Constructs the flatpickr instance once its two (or one, for
  // `single`/`simple`) `DatePickerInput`s are in the DOM, and destroys it on
  // teardown or whenever one of these named args changes identity - all
  // structural flatpickr config that's cheap to fully rebuild on change,
  // unlike `@value` (see `syncValue`).
  attachFlatpickr = eModifier<{
    Element: HTMLDivElement;
    Args: {
      Named: {
        datePickerType: DatePickerType;
        dateFormat: string;
        minDate?: DateOption;
        maxDate?: DateOption;
        allowInput: boolean;
        readOnly: boolean;
        closeOnSelect: boolean;
      };
    };
  }>(
    (
      element,
      _positional,
      { datePickerType, dateFormat, minDate, maxDate, allowInput, readOnly, closeOnSelect },
    ) => {
      const inputs = element.querySelectorAll<HTMLInputElement>(
        '.cds--date-picker__input',
      );
      const start = inputs[0];

      if (datePickerType !== 'single' && datePickerType !== 'range') {
        // `simple` has no calendar - flatpickr never gets involved, but the
        // field still gets seeded with `@value` the same way an
        // uncontrolled `<input>` would.
        if (start && this.initialValue !== undefined) {
          start.value = Array.isArray(this.initialValue)
            ? String(this.initialValue[0] ?? '')
            : String(this.initialValue);
        }
        return;
      }

      const end = datePickerType === 'range' ? inputs[1] : undefined;
      if (!start) return;

      const config: Partial<FlatpickrOptions> = {
        mode: datePickerType,
        dateFormat,
        defaultDate: this.initialValue,
        allowInput,
        minDate,
        maxDate,
        closeOnSelect,
        clickOpens: !readOnly,
        noCalendar: readOnly,
        disableMobile: true,
        plugins: end ? [rangePlugin({ input: end })] : [],
        onChange: (selectedDates, dateStr, instance) =>
          this.handleChange(selectedDates, dateStr, instance),
        onOpen: (selectedDates, dateStr, instance) => {
          addCarbonCalendarClasses(instance);
          this.args.onOpen?.(selectedDates, dateStr, instance);
        },
        onClose: (selectedDates, dateStr, instance) => {
          this.args.onClose?.(selectedDates, dateStr, instance);
        },
        onReady: (_selectedDates, _dateStr, instance) =>
          addCarbonCalendarClasses(instance),
        onMonthChange: (_selectedDates, _dateStr, instance) =>
          addCarbonCalendarClasses(instance),
        onYearChange: (_selectedDates, _dateStr, instance) =>
          addCarbonCalendarClasses(instance),
        onValueUpdate: (_selectedDates, _dateStr, instance) =>
          addCarbonCalendarClasses(instance),
      };

      const instance = flatpickr(start, config);
      this.calendar = instance;

      return () => {
        instance.destroy();
        this.calendar = null;
      };
    },
  );

  // Syncs a controlled `@value` onto the live flatpickr instance without
  // rebuilding it (`attachFlatpickr` above deliberately never reads
  // `@value` for that reason). Tracks `@value` only, so a consumer wiring
  // `@value={{this.date}}` + `@onChange={{this.setDate}}` doesn't get the
  // calendar torn down mid-selection every time their own `onChange`
  // writes the new date back.
  syncValue = eModifier<{
    Element: HTMLDivElement;
    Args: { Positional: [DatePickerSignature['Args']['value']] };
  }>((_element, [value]) => {
    this.calendar?.setDate(value ?? [], false);
  });

  <template>
    <div class='cds--form-item' ...attributes>
      <div
        class={{this.datePickerClasses}}
        {{this.attachFlatpickr
          datePickerType=this.datePickerType
          dateFormat=this.dateFormat
          minDate=@minDate
          maxDate=@maxDate
          allowInput=this.allowInput
          readOnly=this.readOnly
          closeOnSelect=this.closeOnSelect
        }}
        {{this.syncValue @value}}
      >
        {{yield
          (component
            DatePickerInput
            datePickerType=this.datePickerType
            readOnly=this.readOnly
          )
        }}
      </div>
    </div>
  </template>
}
