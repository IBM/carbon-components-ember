import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Checkbox from './checkbox.gts';

// Carbon React parity gaps (Components/Checkbox):
// - `Default` / `Horizontal`: there is no CheckboxGroup (legend, helper
//   text, orientation, invalid/warn states for a set of checkboxes).
// - `Skeleton`: there is no CheckboxSkeleton.
// - `withAILabel`: no `decorator`/`slot` arg.
// - Checkbox itself has no `helperText`, `invalid`/`invalidText`,
//   `warn`/`warnText` or `hideLabel` args; its label is `@label` (or the
//   block) rather than `labelText`.
const meta = preview.meta({
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Checkboxes are used when there are multiple items to select in a list. Users can select zero, one, or any number of items.\n\nCheckbox is controlled: pass `@checked` and update it from `@onChange`, which receives the new checked state.',
      },
    },
  },
  args: {
    label: 'Checkbox label',
    checked: false,
    onChange: fn(),
  },
  // Keep the checked state in story-local tracked state, seeded from the
  // `checked` arg, and report every change to the `onChange` action.
  render: (args) => {
    const state = trackedObject({ checked: args.checked });
    const onChange = (checked: boolean) => {
      state.checked = checked;
      args.onChange?.(checked);
    };

    return <template>
      <Checkbox
        @name={{args.name}}
        @label={{args.label}}
        @checked={{state.checked}}
        @indeterminate={{args.indeterminate}}
        @disabled={{args.disabled}}
        @readonly={{args.readonly}}
        @onChange={{onChange}}
      />
    </template>;
  },
});

export const Single = meta.story();

Single.test(
  'toggles and reports the checked state',
  async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox label' });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(true);

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(false);
  },
);

export const Indeterminate = meta.story({
  args: {
    indeterminate: true,
  },
});

export const Disabled = meta.story({
  args: {
    label: 'disabled',
    checked: true,
    disabled: true,
  },
});

export const DisabledUnchecked = meta.story({
  args: {
    label: 'disabled and not checked',
    disabled: true,
  },
});

DisabledUnchecked.test('cannot be checked', async ({ canvas }) => {
  await expect(
    canvas.getByRole('checkbox', { name: 'disabled and not checked' }),
  ).toBeDisabled();
});

export const LabelInBlock = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Instead of `@label`, the label can be passed as the block, which allows markup.',
      },
    },
  },
  render: (args) => {
    const state = trackedObject({ checked: args.checked });
    const onChange = (checked: boolean) => {
      state.checked = checked;
      args.onChange?.(checked);
    };

    return <template>
      <Checkbox @checked={{state.checked}} @onChange={{onChange}}>
        Label in
        <strong>block</strong>
      </Checkbox>
      <p>checked: {{state.checked}}</p>
    </template>;
  },
});

LabelInBlock.test(
  'uses the block as the label',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Label in block' }),
    );
    await expect(canvas.getByText('checked: true')).toBeInTheDocument();
  },
);
