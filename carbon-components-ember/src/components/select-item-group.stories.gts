import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import SelectItem from './select-item.gts';
import SelectItemGroup from './select-item-group.gts';

// Carbon React has no stories of its own for SelectItemGroup: it's a
// subcomponent of Components/Select, a native `<select>`. This addon's
// Select is a custom listbox, so SelectItemGroup is shown inside a plain
// native `<select>` here.

const meta = preview.meta({
  title: 'Components/SelectItemGroup',
  component: SelectItemGroup,
  parameters: {
    docs: {
      description: {
        component:
          '`SelectItemGroup` renders a native `<optgroup>` element, used to group related `<option>` elements (or `SelectItem`s) together inside a native `<select>`.',
      },
    },
  },
  args: {
    label: 'Group 1',
  },
  render: (args) => <template>
    <div class="cds--form-item">
      <div class="cds--select">
        <label for="select-item-group-story" class="cds--label">Select</label>
        <div class="cds--select-input__wrapper">
          <select id="select-item-group-story" class="cds--select-input">
            <SelectItemGroup @label={{args.label}} @disabled={{args.disabled}}>
              <option value="option-1">Option 1</option>
              <option value="option-2">Option 2</option>
            </SelectItemGroup>
            <SelectItemGroup @label="Group 2" @disabled={{true}}>
              <SelectItem @value="option-3" @text="Option 3" />
              <SelectItem @value="option-4" @text="Option 4" />
            </SelectItemGroup>
          </select>
        </div>
      </div>
    </div>
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
