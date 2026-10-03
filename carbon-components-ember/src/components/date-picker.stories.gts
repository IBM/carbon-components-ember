import type { Decorator } from 'ember-storybook';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import DatePicker from './date-picker.gts';
import Layer from './layer.gts';

import type { DatePickerSignature } from './date-picker.gts';
import type { DatePickerInputSignature } from './date-picker-input.gts';

// Carbon React parity gaps (Components/DatePicker):
// - `Skeleton`: there is no DatePickerSkeleton.
// - `withAILabel`: DatePickerInput takes a `decorator` component, but there
//   is no AILabel component to pass to it yet (#406).
// - No `locale`, `inline`, `disable`/`enable` date lists or
//   `parseDate`/`invalidText` per-picker args.

type InputArgs = DatePickerInputSignature['Args'];

// The DatePickerInput args (label, placeholder, validation states, ...)
// are story-only: they're passed to the input(s) yielded by DatePicker.
// `render` is annotated so they are part of the inferred args.
type StoryArgs = DatePickerSignature['Args'] &
  Pick<
    InputArgs,
    | 'labelText'
    | 'placeholder'
    | 'size'
    | 'disabled'
    | 'invalid'
    | 'invalidText'
    | 'warn'
    | 'warnText'
    | 'helperText'
  >;

const isRange = (type: string | undefined) => type === 'range';

// Renders the story on the background and on two nested layers, like
// Carbon React's `WithLayer` story template.
const withLayer: Decorator = (Story, context) => <template>
  <div style="padding: 1rem">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
  <Layer @withBackground={{true}} style="padding: 1rem" as |NextLayer|>
    <RenderStory @story={{Story}} @args={{context.args}} />
    <NextLayer @withBackground={{true}} style="padding: 1rem; margin-top: 1rem">
      <RenderStory @story={{Story}} @args={{context.args}} />
    </NextLayer>
  </Layer>
</template>;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          "DatePicker lets a user pick a date, or a range of dates, from a calendar dropdown, or type one into a plain field. It wraps [flatpickr](https://flatpickr.js.org/) for the calendar and composes one or two `DatePickerInput` fields, yielded from the block, to render the field(s) themselves.\n\nThe calendar dropdown renders inside `DatePicker`'s own container by default, so it stays inside whatever root - shadow or document - the picker itself renders into. Pass a different element as `@appendTo` to redirect it elsewhere instead, e.g. to escape an `overflow: hidden` ancestor.",
      },
    },
  },
  argTypes: {
    datePickerType: {
      control: 'inline-radio',
      options: ['simple', 'single', 'range'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    datePickerType: 'single',
    labelText: 'Date Picker label',
    placeholder: 'mm/dd/yyyy',
    onChange: fn(),
  },
  // Leave room for the calendar dropdown.
  decorators: [
    (Story, context) => <template>
      <div style="min-height: 22rem">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    <DatePicker
      @datePickerType={{args.datePickerType}}
      @dateFormat={{args.dateFormat}}
      @value={{args.value}}
      @minDate={{args.minDate}}
      @maxDate={{args.maxDate}}
      @allowInput={{args.allowInput}}
      @closeOnSelect={{args.closeOnSelect}}
      @readOnly={{args.readOnly}}
      @short={{args.short}}
      @light={{args.light}}
      @onChange={{args.onChange}}
      @onOpen={{args.onOpen}}
      @onClose={{args.onClose}}
      as |Input|
    >
      <Input
        @labelText={{if
          (isRange args.datePickerType)
          "Start date"
          args.labelText
        }}
        @placeholder={{args.placeholder}}
        @size={{args.size}}
        @disabled={{args.disabled}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        @helperText={{args.helperText}}
      />
      {{#if (isRange args.datePickerType)}}
        <Input
          @labelText="End date"
          @placeholder={{args.placeholder}}
          @size={{args.size}}
          @disabled={{args.disabled}}
          @invalid={{args.invalid}}
          @invalidText={{args.invalidText}}
          @warn={{args.warn}}
          @warnText={{args.warnText}}
          @helperText={{args.helperText}}
        />
      {{/if}}
    </DatePicker>
  </template>,
});

export const Default = meta.story();

export const Simple = meta.story({
  args: {
    datePickerType: 'simple',
  },
  parameters: {
    docs: {
      description: {
        story: 'A plain text field with no calendar.',
      },
    },
  },
});

Simple.test('accepts typed dates', async ({ canvas, userEvent }) => {
  const input = canvas.getByLabelText('Date Picker label');
  await userEvent.type(input, '01/15/2024');
  await expect(input).toHaveValue('01/15/2024');
});

export const SingleWithCalendar = meta.story({
  args: {
    datePickerType: 'single',
    size: 'md',
  },
});

SingleWithCalendar.test(
  'picks a date from the calendar',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const input = canvas.getByLabelText('Date Picker label');
    await userEvent.click(input);

    const calendar = canvasElement.querySelector('.flatpickr-calendar')!;
    await expect(calendar).toHaveClass('open');

    const day = calendar.querySelector<HTMLElement>(
      '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)',
    )!;
    await userEvent.click(day);

    await expect(args.onChange).toHaveBeenCalled();
    await expect((input as HTMLInputElement).value).toMatch(
      /^\d\d\/01\/\d{4}$/,
    );
  },
);

export const RangeWithCalendar = meta.story({
  args: {
    datePickerType: 'range',
    size: 'md',
  },
});

RangeWithCalendar.test(
  'picks a start and an end date',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const start = canvas.getByLabelText('Start date');
    const end = canvas.getByLabelText('End date');
    await userEvent.click(start);

    // flatpickr redraws the days after each pick, so query them every time.
    const day = (n: number) =>
      canvasElement.querySelectorAll<HTMLElement>(
        '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)',
      )[n - 1]!;
    await userEvent.click(day(3));
    await userEvent.click(day(6));

    await expect(args.onChange).toHaveBeenLastCalledWith(
      [expect.any(Date), expect.any(Date)],
      expect.any(String),
      expect.anything(),
    );
    await expect((start as HTMLInputElement).value).toMatch(
      /^\d\d\/03\/\d{4}$/,
    );
    await expect((end as HTMLInputElement).value).toMatch(/^\d\d\/06\/\d{4}$/);
  },
);

export const SimpleWithLayer = Simple.extend({
  decorators: [withLayer],
});

export const SingleWithCalendarWithLayer = SingleWithCalendar.extend({
  decorators: [withLayer],
});

export const RangeWithCalendarWithLayer = RangeWithCalendar.extend({
  decorators: [withLayer],
});

export const CustomFormat = meta.story({
  args: {
    dateFormat: 'Y-m-d',
    labelText: 'Custom format (Y-m-d)',
    placeholder: 'yyyy-mm-dd',
  },
  parameters: {
    docs: {
      description: {
        story: '`@dateFormat` takes a flatpickr format string.',
      },
    },
  },
});

export const MinMaxDate = meta.story({
  args: {
    labelText: 'Min/max date',
    minDate: new Date(2024, 0, 10),
    maxDate: new Date(2024, 0, 20),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dates outside `@minDate`..`@maxDate` (here January 10-20, 2024) are disabled in the calendar.',
      },
    },
  },
});

export const ReadOnly = meta.story({
  args: {
    labelText: 'Read-only',
    readOnly: true,
    value: new Date(2024, 0, 15),
  },
});

ReadOnly.test('shows the value read-only', async ({ canvas }) => {
  const input = canvas.getByLabelText('Read-only');
  await expect(input).toHaveValue('01/15/2024');
  await expect(input).toHaveAttribute('readonly');
});

export const Invalid = meta.story({
  args: {
    labelText: 'Invalid',
    invalid: true,
    invalidText: 'A valid date is required',
  },
});

export const Warning = meta.story({
  args: {
    labelText: 'Warning',
    warn: true,
    warnText: 'Double check this date',
  },
});
