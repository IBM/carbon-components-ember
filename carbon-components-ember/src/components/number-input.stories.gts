import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import NumberInput from './number-input.gts';

import type { NumberInputSignature } from './number-input.gts';

// Carbon React parity gaps (Components/NumberInput):
// - `WithTypeOfText` / `WithTypeOfTextControlled` /
//   `WithTypeOfCustomValidation`: no `type="text"` mode, so no `locale`,
//   `formatOptions`, `inputMode` or custom `validate`.
// - `Skeleton`: there is no NumberInputSkeleton.
// - No `disableWheel` or `translateWithId`.

type Args = NumberInputSignature['Args'];

const meta = preview.meta({
  title: 'Components/NumberInput',
  component: NumberInput,
  parameters: {
    docs: {
      description: {
        component:
          'NumberInput allows the user to enter a number, and to increment/decrement the value using stepper buttons.\n\nPass `@defaultValue` for an uncontrolled input, or `@value` with `@onChange` to control it; `@onChange` receives the new value, the event and the stepper direction.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    label: 'NumberInput label',
    helperText: 'Optional helper text.',
    min: -100000000,
    max: 100000000,
    step: 1,
    onChange: fn(),
  },
});

export const Default = meta.story({
  args: {
    value: 50,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A controlled input: the story keeps `@value` in tracked state and updates it from `@onChange`.',
      },
    },
  },
  render: (args: Args) => {
    const state = trackedObject<{ value?: number | '' }>({
      value: args.value,
    });
    const onChange = (
      value: number | '',
      event: Event,
      direction: 'up' | 'down',
    ) => {
      state.value = value;
      args.onChange?.(value, event, direction);
    };

    return <template>
      <NumberInput
        @label={{args.label}}
        @helperText={{args.helperText}}
        @min={{args.min}}
        @max={{args.max}}
        @step={{args.step}}
        @size={{args.size}}
        @hideLabel={{args.hideLabel}}
        @hideSteppers={{args.hideSteppers}}
        @allowEmpty={{args.allowEmpty}}
        @disabled={{args.disabled}}
        @readOnly={{args.readOnly}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        @value={{state.value}}
        @onChange={{onChange}}
      />
      <p style="margin-top: 1rem">value: {{state.value}}</p>
    </template>;
  },
});

Default.test(
  'steps the value up and down',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('spinbutton', { name: 'NumberInput label' });
    await expect(input).toHaveValue(50);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Increment number' }),
    );
    await expect(input).toHaveValue(51);
    await expect(args.onChange).toHaveBeenLastCalledWith(
      51,
      expect.anything(),
      'up',
    );

    await userEvent.click(
      canvas.getByRole('button', { name: 'Decrement number' }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Decrement number' }),
    );
    await expect(input).toHaveValue(49);
    await expect(canvas.getByText('value: 49')).toBeInTheDocument();
  },
);

Default.test('accepts typed numbers', async ({ canvas, userEvent, args }) => {
  const input = canvas.getByRole('spinbutton', { name: 'NumberInput label' });
  await userEvent.clear(input);
  await userEvent.type(input, '42');
  await expect(input).toHaveValue(42);
  await expect(args.onChange).toHaveBeenLastCalledWith(
    42,
    expect.anything(),
    expect.anything(),
  );
});

export const Uncontrolled = meta.story({
  args: {
    label: 'Quantity',
    helperText: 'Optional',
  },
});

export const Small = meta.story({
  args: {
    label: 'Small',
    size: 'sm',
  },
});

export const Large = meta.story({
  args: {
    label: 'Large',
    size: 'lg',
  },
});

export const MinMax = meta.story({
  args: {
    label: 'Min/max',
    min: 0,
    max: 10,
    defaultValue: 5,
    helperText: 'Between 0 and 10',
  },
});

MinMax.test('stops at the max', async ({ canvas, userEvent }) => {
  const input = canvas.getByRole('spinbutton', { name: 'Min/max' });
  const increment = canvas.getByRole('button', { name: 'Increment number' });
  for (let i = 0; i < 7; i++) {
    await userEvent.click(increment);
  }
  await expect(input).toHaveValue(10);
});

export const Step = meta.story({
  args: {
    label: 'Step by 5',
    step: 5,
    defaultValue: 10,
  },
});

export const WithoutSteppers = meta.story({
  args: {
    label: 'Without steppers',
    hideSteppers: true,
  },
});

export const Invalid = meta.story({
  args: {
    label: 'Invalid',
    defaultValue: 20,
    max: 10,
    invalidText: 'Value must be 10 or less',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A value outside `@min`..`@max` shows `@invalidText`, as does `@invalid={{true}}`.',
      },
    },
  },
});

Invalid.test('shows the invalid text', async ({ canvas }) => {
  await expect(canvas.getByText('Value must be 10 or less')).toBeVisible();
});

export const Warning = meta.story({
  args: {
    label: 'Warning',
    warn: true,
    warnText: 'This value may cause issues',
  },
});

export const Disabled = meta.story({
  args: {
    label: 'Disabled',
    disabled: true,
    defaultValue: 42,
  },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums;
        // axe can't tell the disabled field's helper text is inactive.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

export const ReadOnly = meta.story({
  args: {
    label: 'Read-only',
    readOnly: true,
    defaultValue: 42,
  },
});

export const WithAILabel = meta.story({
  args: {
    defaultValue: 50,
    invalidText: 'Number is not valid',
  },
  render: (args: Args) => <template>
    <NumberInput
      @label={{args.label}}
      @hideLabel={{args.hideLabel}}
      @defaultValue={{args.defaultValue}}
      @helperText={{args.helperText}}
      @min={{args.min}}
      @max={{args.max}}
      @step={{args.step}}
      @size={{args.size}}
      @hideSteppers={{args.hideSteppers}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @light={{args.light}}
      @onChange={{args.onChange}}
    >
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </NumberInput>
  </template>,
});
