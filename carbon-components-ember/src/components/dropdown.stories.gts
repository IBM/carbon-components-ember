import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import { withLayer } from '#storybook/decorators.gts';
import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Dropdown from './dropdown.gts';

import type { DropdownSignature } from './dropdown.gts';

// Carbon React parity gaps (Components/Dropdown):
// - Items can't be disabled (React's `Option 3` is `disabled: true`).
// - `ExperimentalAutoAlign`: no `autoAlign`; the menu opens downwards or,
//   with `@direction="top"`, upwards.
// - `Skeleton`: there is no DropdownSkeleton.
// - No `renderSelectedItem`, `translateWithId` or `downshiftProps`; a block
//   can render each item instead.

interface Item {
  text: string;
}

const items: Item[] = [
  { text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.' },
  { text: 'Option 1' },
  { text: 'Option 2' },
  { text: 'Option 3' },
  { text: 'Option 4' },
  { text: 'Option 5' },
  { text: 'Option 6' },
  { text: 'Option 7' },
  { text: 'Option 8' },
];

const itemToString = (item: Item) => item.text;

// Dropdown is generic over its item type, which signature inference can't
// follow, so declare the story's args explicitly.
type StoryArgs = DropdownSignature<Item>['Args'];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component:
          "`Dropdown` is a single-select field that opens a listbox of items on click. It renders Carbon's `ListBox` markup directly - the menu is a plain descendant of the field, positioned with Carbon's own CSS - and manages its own open/highlight state internally.\n\nItems can be any value: `@itemToString` turns one into its label (the default is `String(item)`), or a block can render each item.",
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'inline-radio', options: ['default', 'inline'] },
    direction: { control: 'inline-radio', options: ['top', 'bottom'] },
  },
  args: {
    titleText: 'Label',
    helperText: 'Helper text',
    label: 'Choose an option',
    items,
    itemToString,
    onChange: fn(),
  },
  // Leave room for the open menu.
  decorators: [
    (Story, context) => <template>
      <div style="width: 400px; min-height: 20rem">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    <Dropdown
      @titleText={{args.titleText}}
      @label={{args.label}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @initialSelectedItem={{args.initialSelectedItem}}
      @helperText={{args.helperText}}
      @hideLabel={{args.hideLabel}}
      @size={{args.size}}
      @type={{args.type}}
      @direction={{args.direction}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @onChange={{args.onChange}}
    />
  </template>,
});

export const Default = meta.story();

Default.test(
  'selects an item from the menu',
  async ({ canvas, userEvent, args }) => {
    const combobox = canvas.getByRole('combobox', { name: /Label/ });
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(combobox);
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(canvas.getByRole('option', { name: 'Option 2' }));
    await expect(args.onChange).toHaveBeenCalledWith({
      selectedItem: items[2],
    });
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
    await expect(combobox).toHaveTextContent('Option 2');
  },
);

Default.test(
  'can be used with the keyboard',
  async ({ canvas, userEvent, args }) => {
    const combobox = canvas.getByRole('combobox', { name: /Label/ });
    combobox.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(combobox).toHaveAttribute('aria-expanded', 'false');
  },
);

export const Inline = meta.story({
  args: {
    type: 'inline',
  },
});

export const InlineWithLayer = Inline.extend({
  decorators: [withLayer],
});

export const Controlled = meta.story({
  args: {
    items: [{ text: 'Option 1' }, { text: 'Option 2' }, { text: 'Option 3' }],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pass `@selectedItem` to control the selection yourself; pair it with `@onChange` to react to the user picking a new item. `@initialSelectedItem` seeds the selection for the uncontrolled case instead.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject<{ selected: Item | null }>({
      selected: args.items[1] ?? null,
    });
    const onChange = (data: { selectedItem: Item | null }) => {
      state.selected = data.selectedItem;
      args.onChange?.(data);
    };

    return <template>
      <Dropdown
        @titleText={{args.titleText}}
        @label={{args.label}}
        @items={{args.items}}
        @itemToString={{args.itemToString}}
        @selectedItem={{state.selected}}
        @onChange={{onChange}}
      />
      <p style="margin-top: 1rem">Selected: {{state.selected.text}}</p>
    </template>;
  },
});

Controlled.test(
  'reflects the selection from outside',
  async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Selected: Option 2')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('combobox', { name: /Label/ }));
    await userEvent.click(canvas.getByRole('option', { name: 'Option 3' }));
    await expect(canvas.getByText('Selected: Option 3')).toBeInTheDocument();
  },
);

export const InitialSelectedItem = meta.story({
  args: {
    initialSelectedItem: items[1],
  },
});

export const Invalid = meta.story({
  args: {
    invalid: true,
    invalidText: 'This field requires a selection',
  },
});

export const Warning = meta.story({
  args: {
    warn: true,
    warnText: 'This selection may need review',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
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

export const WithAILabel = meta.story({
  render: (args: StoryArgs) => <template>
    <Dropdown
      @titleText={{args.titleText}}
      @label={{args.label}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @onChange={{args.onChange}}
    >
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </Dropdown>
  </template>,
});

export const WithLayer = Default.extend({ decorators: [withLayer] });
