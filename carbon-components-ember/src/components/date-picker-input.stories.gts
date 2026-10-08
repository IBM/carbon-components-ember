import type { Decorator } from 'ember-storybook';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import DatePicker from './date-picker.gts';
import DatePickerInput from './date-picker-input.gts';

import type { DatePickerInputSignature } from './date-picker-input.gts';

type Args = DatePickerInputSignature['Args'];

// Carbon React has no stories of its own for DatePickerInput: it's a
// subcomponent of Components/DatePicker, so it's rendered inside one here.
// The `DatePickerInput` yielded by `DatePicker` has `@datePickerType` and
// `@readOnly` already bound, so those two controls are forwarded to the
// `DatePicker` instead.

// Leave room for the calendar dropdown.
const withRoom: Decorator = (Story, context) => <template>
  <div style="min-height: 22rem">
    <RenderStory @story={{Story}} @args={{context.args}} />
  </div>
</template>;

const meta = preview.type<{ args: Args }>().meta({
  title: 'Components/DatePicker/DatePickerInput',
  component: DatePickerInput,
  parameters: {
    docs: {
      description: {
        component:
          'The text `<input>` rendered for each field of a `DatePicker`: one for a `single` or `simple` picker, two (start and end) for a `range` picker. Render it through the `DatePicker` block, which yields it already wired to the picker; pass `@value` to the `DatePicker`, not to the input.',
      },
    },
  },
  decorators: [withRoom],
  argTypes: {
    datePickerType: {
      control: 'inline-radio',
      options: ['simple', 'single', 'range'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    labelText: 'Date Picker label',
    placeholder: 'mm/dd/yyyy',
    datePickerType: 'single',
    hideLabel: false,
    disabled: false,
    invalid: false,
    invalidText: 'A valid value is required',
    warn: false,
    warnText: 'Warning message that is really long can wrap to more lines',
    helperText: 'Optional helper text',
    onChange: fn(),
    onClick: fn(),
  },
  render: (args: Args) => <template>
    <DatePicker
      @datePickerType={{args.datePickerType}}
      @readOnly={{args.readOnly}}
      as |Input|
    >
      <Input
        @id={{args.id}}
        @labelText={{args.labelText}}
        @hideLabel={{args.hideLabel}}
        @placeholder={{args.placeholder}}
        @pattern={{args.pattern}}
        @type={{args.type}}
        @size={{args.size}}
        @disabled={{args.disabled}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        @helperText={{args.helperText}}
        @onChange={{args.onChange}}
        @onClick={{args.onClick}}
      />
    </DatePicker>
  </template>,
});

export const Default = meta.story();

Default.test(
  'renders a labelled field with its helper text',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByLabelText('Date Picker label');
    await expect(input).toHaveAttribute('placeholder', 'mm/dd/yyyy');
    await expect(input).toHaveAccessibleDescription('Optional helper text');

    await userEvent.click(input);
    await expect(args.onClick).toHaveBeenCalled();
  },
);
