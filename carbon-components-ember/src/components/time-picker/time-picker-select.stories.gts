import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import TimePicker from '../time-picker.gts';
import TimePickerSelect from './time-picker-select.gts';

// Carbon React has no stories of its own for TimePickerSelect: it's a
// subcomponent of Components/TimePicker, so it's rendered inside one here,
// next to a second (fixed) time zone select.

const meta = preview.meta({
  title: 'Components/TimePicker/TimePickerSelect',
  component: TimePickerSelect,
  parameters: {
    docs: {
      description: {
        component:
          'A compact native `<select>` rendered next to the `TimePicker` field, e.g. for AM/PM or a time zone. Pass it, filled with `<option>`s, as the `TimePicker` block. Pass `@defaultValue` for an uncontrolled select, or `@value` with `@onChange` to control it.',
      },
    },
  },
  args: {
    ariaLabel: 'Period',
    defaultValue: 'AM',
    disabled: false,
    onChange: fn(),
  },
  render: (args) => <template>
    <TimePicker @labelText="Select a time">
      <TimePickerSelect
        @id={{args.id}}
        @ariaLabel={{args.ariaLabel}}
        @defaultValue={{args.defaultValue}}
        @value={{args.value}}
        @disabled={{args.disabled}}
        @onChange={{args.onChange}}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </TimePickerSelect>
      <TimePickerSelect @ariaLabel="Time zone">
        <option value="Time zone 1">Time zone 1</option>
        <option value="Time zone 2">Time zone 2</option>
      </TimePickerSelect>
    </TimePicker>
  </template>,
});

export const Default = meta.story();

Default.test(
  'reports the picked option',
  async ({ canvas, userEvent, args }) => {
    const select = canvas.getByRole('combobox', { name: 'Period' });
    await expect(select).toHaveValue('AM');

    await userEvent.selectOptions(select, 'PM');
    await expect(select).toHaveValue('PM');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      'PM',
      expect.anything(),
    );
  },
);
