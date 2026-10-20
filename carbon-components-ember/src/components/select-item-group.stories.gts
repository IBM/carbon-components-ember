import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Select from './select.gts';
import SelectItemGroup from './select-item-group.gts';

// Carbon React has no stories of its own for SelectItemGroup: it's a
// subcomponent of Components/Select.

const meta = preview.meta({
  title: 'Components/SelectItemGroup',
  component: SelectItemGroup,
  parameters: {
    docs: {
      description: {
        component:
          '`SelectItemGroup` renders a native `<optgroup>` element, which groups related `SelectItem`s inside a `Select`.',
      },
    },
  },
  args: {
    label: 'Group 1',
  },
  render: (args) => <template>
    <Select as |SelectItem|>
      <SelectItemGroup @label={{args.label}} @disabled={{args.disabled}}>
        <SelectItem @value="option-1" @text="Option 1" />
        <SelectItem @value="option-2" @text="Option 2" />
      </SelectItemGroup>
      <SelectItemGroup @label="Group 2" @disabled={{true}}>
        <SelectItem @value="option-3" @text="Option 3" />
        <SelectItem @value="option-4" @text="Option 4" />
      </SelectItemGroup>
    </Select>
  </template>,
});

export const Default = meta.story();

Default.test('groups the options', async ({ canvas, userEvent }) => {
  await expect(canvas.getByRole('group', { name: 'Group 1' })).toBeEnabled();
  await expect(canvas.getByRole('group', { name: 'Group 2' })).toBeDisabled();

  const select = canvas.getByRole('combobox', { name: 'Select' });
  await userEvent.selectOptions(select, 'Option 2');
  await expect(select).toHaveValue('option-2');
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});
