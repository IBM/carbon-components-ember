import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Toggle from './toggle.gts';

// Carbon React parity gaps (Components/Toggle):
// - The label is `@name`; there is no `labelText`/`hideLabel`, and the
//   state text is always "On"/"Off" (no `labelA`/`labelB`).
// - `WithAccessibleLabels`: Toggle doesn't spread `...attributes`, so it
//   can't be labelled with `aria-labelledby`, and there's no `hideLabel`.
// - `Skeleton`: there is no ToggleSkeleton.
// - React's `toggled`/`defaultToggled` + `onToggle` are a single controlled
//   `@value` + `@onChange` here; there is no uncontrolled mode.
const meta = preview.meta({
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component:
          'A toggle is used to quickly switch between two possible states.\n\nToggle is controlled: pass `@value` and update it from `@onChange`, which receives the new value. `@name` is the visible label.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: {
    name: 'Label',
    value: true,
    onChange: fn(),
  },
  // Keep the value in story-local tracked state, seeded from the `value`
  // arg, and report every change to the `onChange` action.
  render: (args) => {
    const state = trackedObject({ value: args.value });
    const onChange = (value: boolean) => {
      state.value = value;
      args.onChange?.(value);
    };

    return <template>
      <Toggle
        @name={{args.name}}
        @size={{args.size}}
        @disabled={{args.disabled}}
        @readonly={{args.readonly}}
        @value={{state.value}}
        @onChange={{onChange}}
      />
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'switches state and reports it through onChange',
  async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole('switch', { name: 'Label' });
    await expect(toggle).toBeChecked();

    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
    await expect(canvas.getByText('Off')).toBeInTheDocument();

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(true);
  },
);

export const SmallToggle = meta.story({
  args: {
    size: 'sm',
  },
});

export const Off = meta.story({
  args: {
    name: 'toggle is off',
    value: false,
  },
});

export const Disabled = meta.story({
  args: {
    name: 'toggle is disabled',
    value: false,
    disabled: true,
  },
});

export const ReadOnly = meta.story({
  args: {
    name: 'toggle is readonly',
    value: false,
    readonly: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A read-only toggle ignores clicks and never calls `@onChange`.',
      },
    },
  },
});

ReadOnly.test('ignores clicks', async ({ canvas, userEvent, args }) => {
  const toggle = canvas.getByRole('switch', { name: 'toggle is readonly' });
  await userEvent.click(toggle);
  await expect(toggle).not.toBeChecked();
  await expect(args.onChange).not.toHaveBeenCalled();
});
