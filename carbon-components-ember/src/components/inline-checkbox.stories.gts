import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import InlineCheckbox from './inline-checkbox.gts';

// Carbon React has no stories for `InlineCheckbox`; it appears in its
// DataTable Selection stories as the checkbox in each selection cell, which
// `TableSelectAll` and `TableSelectRow` render. These stories are Ember-only.

const meta = preview.meta({
  title: 'Components/InlineCheckbox',
  component: InlineCheckbox,
  parameters: {
    docs: {
      description: {
        component: `\`InlineCheckbox\` is the checkbox in a table's selection cells, as Carbon React's. Its label is visually hidden, so \`@ariaLabel\` names it. It is controlled: pass \`@checked\` and update it from \`@onChange\`, which receives the new state, the \`id\` and the \`change\` event. \`@onClick\` receives the \`click\` event after an indeterminate checkbox is unchecked. \`...attributes\` go on the wrapping \`<div>\`.

\`\`\`gts
<InlineCheckbox @id="select-row" @name="select-row" @ariaLabel="Select row" @checked={{this.checked}} @onChange={{this.update}} />
\`\`\``,
      },
    },
  },
  args: {
    id: 'inline-checkbox',
    name: 'inline-checkbox',
    ariaLabel: 'Select row',
    checked: false,
    indeterminate: false,
    disabled: false,
    onChange: fn(),
  },
  render: (args) => {
    const state = trackedObject({ checked: args.checked });
    const onChange = (checked: boolean, id: string, event: Event) => {
      state.checked = checked;
      args.onChange?.(checked, id, event);
    };

    return <template>
      <InlineCheckbox
        @id={{args.id}}
        @name={{args.name}}
        @ariaLabel={{args.ariaLabel}}
        @checked={{state.checked}}
        @indeterminate={{args.indeterminate}}
        @disabled={{args.disabled}}
        @onChange={{onChange}}
      />
    </template>;
  },
});

export const Default = meta.story();

Default.test(
  'toggles and reports the checked state',
  async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Select row' });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      true,
      'inline-checkbox',
      expect.anything(),
    );
  },
);

export const Checked = meta.story({ args: { checked: true } });

export const Indeterminate = meta.story({ args: { indeterminate: true } });

Indeterminate.test('is mixed and unchecked', async ({ canvas }) => {
  const checkbox = canvas.getByRole('checkbox', { name: 'Select row' });
  await expect(checkbox).toBePartiallyChecked();
  await expect(checkbox).not.toBeChecked();
});

export const Disabled = meta.story({ args: { disabled: true } });
