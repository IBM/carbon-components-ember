import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import CheckboxGroup from './checkbox-group.gts';

// Carbon React's CheckboxGroup stories (Default, Horizontal, withAILabel) are
// on Components/Checkbox, as RadioButtonGroup's are on Components/RadioButton.
// This page is Ember's own, for what React has no story for.

const meta = preview.meta({
  title: 'Components/Checkbox/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    docs: {
      description: {
        component:
          "A `<fieldset>` that groups `Checkbox`es under a legend (`@legendText`, with `@legendId` for the fieldset to be labelled by), with `@helperText`, or `@invalidText` and `@warnText` for `@invalid` and `@warn`. It yields a `Checkbox` already given the group's `@invalid`, `@readOnly`, `@warn` and `@disabled`; a `Checkbox` that is passed its own keeps it, except that a disabled group's fieldset disables them all. `@orientation` is `vertical` or `horizontal`. The `decorator` block yields an `AILabel` for the legend.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    disabled: false,
    helperText: 'Helper text goes here',
    invalid: false,
    invalidText: 'Invalid message goes here',
    legendText: 'Group label',
    orientation: 'vertical',
    readOnly: false,
    warn: false,
    warnText: 'Warning message goes here',
  },
  render: (args) => <template>
    <CheckboxGroup
      @legendText={{args.legendText}}
      @orientation={{args.orientation}}
      @disabled={{args.disabled}}
      @readOnly={{if args.readOnly true}}
      @helperText={{args.helperText}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      as |Checkbox|
    >
      <Checkbox @id="checkbox-label-1" @labelText="Checkbox label" />
      <Checkbox @id="checkbox-label-2" @labelText="Checkbox label" />
    </CheckboxGroup>
  </template>,
});

export const Invalid = meta.story({
  args: { legendText: 'Group label', invalid: true },
});

Invalid.test(
  'shows its message instead of the helper and marks its checkboxes invalid',
  async ({ canvas }) => {
    await expect(canvas.getByText('Invalid message goes here')).toBeVisible();
    await expect(canvas.queryByText('Helper text goes here')).toBeNull();
    for (const checkbox of canvas.getAllByRole('checkbox')) {
      await expect(checkbox).toHaveAttribute('data-invalid', 'true');
    }
  },
);
