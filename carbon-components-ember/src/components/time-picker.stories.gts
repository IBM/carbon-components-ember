import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import TimePicker from './time-picker.gts';
import TimePickerSelect from './time-picker/time-picker-select.gts';

import type { Signature } from './time-picker.gts';

type Args = Signature['Args'];

// Carbon React parity: Components/TimePicker only has a `Default` story,
// mirrored here (React fills TimePickerSelect with SelectItems; plain
// `<option>`s work the same). No gaps in the story's args.

const meta = preview.meta({
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    docs: {
      description: {
        component:
          '`TimePicker` renders a text `<input>` for entering a time, optionally paired with one or more `TimePickerSelect` components (e.g. for AM/PM and time zone) rendered next to it, passed as the block.\n\nPass `@defaultValue` for an uncontrolled field, or `@value` with `@onChange` to make the `<input>` fully controlled.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    labelText: 'Select a time',
    disabled: false,
    hideLabel: false,
    invalid: false,
    warning: false,
    onChange: fn(),
  },
  render: (args: Args) => <template>
    <TimePicker
      @labelText={{args.labelText}}
      @hideLabel={{args.hideLabel}}
      @value={{args.value}}
      @defaultValue={{args.defaultValue}}
      @placeholder={{args.placeholder}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warning={{args.warning}}
      @warningText={{args.warningText}}
      @onChange={{args.onChange}}
    >
      <TimePickerSelect @disabled={{args.disabled}}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </TimePickerSelect>
      <TimePickerSelect @disabled={{args.disabled}}>
        <option value="Time zone 1">Time zone 1</option>
        <option value="Time zone 2">Time zone 2</option>
      </TimePickerSelect>
    </TimePicker>
  </template>,
});

export const Default = meta.story();

Default.test(
  'accepts a typed time and a period',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Select a time' });
    await userEvent.type(input, '11:30');
    await expect(input).toHaveValue('11:30');
    await expect(args.onChange).toHaveBeenLastCalledWith(
      '11:30',
      expect.anything(),
    );

    const [period] = canvas.getAllByRole('combobox');
    await userEvent.selectOptions(period!, 'PM');
    await expect(period).toHaveValue('PM');
  },
);

export const Controlled = meta.story({
  args: {
    value: '11:00',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Passing `@value` alongside `@onChange` makes the `<input>` fully controlled.',
      },
    },
  },
  render: (args: Args) => {
    const state = trackedObject({ value: args.value });
    const onChange = (value: string, event: Event) => {
      state.value = value;
      args.onChange?.(value, event);
    };

    return <template>
      <TimePicker
        @labelText={{args.labelText}}
        @value={{state.value}}
        @onChange={{onChange}}
      />
      <p>value: {{state.value}}</p>
    </template>;
  },
});

Controlled.test('reflects the typed value', async ({ canvas, userEvent }) => {
  const input = canvas.getByRole('textbox', { name: 'Select a time' });
  await userEvent.clear(input);
  await userEvent.type(input, '09:15');
  await expect(canvas.getByText('value: 09:15')).toBeInTheDocument();
});

export const Sizes = meta.story({
  parameters: {
    docs: {
      description: {
        story: '`@size` accepts `sm`, `md` (the default), or `lg`.',
      },
    },
  },
  render: () => <template>
    <TimePicker @labelText="Small" @size="sm" />
    <br />
    <TimePicker @labelText="Medium" @size="md" />
    <br />
    <TimePicker @labelText="Large" @size="lg" />
  </template>,
});

export const Invalid = meta.story({
  args: {
    invalid: true,
    invalidText: 'Enter a valid time',
  },
});

export const Warning = meta.story({
  args: {
    warning: true,
    warningText: 'This value may cause issues',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
    value: '11:00',
  },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums;
        // axe can't tell the disabled field's texts are inactive.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

export const ReadOnly = meta.story({
  args: {
    readOnly: true,
    value: '11:00',
  },
  render: (args: Args) => <template>
    <TimePicker
      @labelText={{args.labelText}}
      @readOnly={{args.readOnly}}
      @value={{args.value}}
    />
  </template>,
});

ReadOnly.test('cannot be typed into', async ({ canvas, userEvent }) => {
  const input = canvas.getByRole('textbox', { name: 'Select a time' });
  await userEvent.type(input, '2');
  await expect(input).toHaveValue('11:00');
});

export const HiddenLabel = meta.story({
  args: {
    hideLabel: true,
  },
});

HiddenLabel.test('keeps the accessible name', async ({ canvas }) => {
  await expect(
    canvas.getByRole('textbox', { name: 'Select a time' }),
  ).toBeInTheDocument();
});
