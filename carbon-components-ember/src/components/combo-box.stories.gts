import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import { tracked } from '@glimmer/tracking';
import { withLayer } from '#storybook/decorators.gts';
import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import ComboBox from './combo-box.gts';

import type { ComboBoxChange, ComboBoxSignature } from './combo-box.gts';
import '#storybook/styles/combo-box.css';

// Carbon React parity gaps (Components/ComboBox):
// - No `translateWithId` or `downshiftActions`, and no `downshiftProps`, as
//   it isn't built on downshift; a block renders each item instead of
//   `itemToElement`, and attributes on the component go to the input
//   instead of `inputProps`.
// - Escape on a closed field clears it, as in React, but here it also
//   calls `@onChange`.

interface Item {
  id: string;
  text: string;
  disabled?: boolean;
}

// Some stories list plain strings, as Carbon React's do.
type StoryItem = Item | string;

const items: StoryItem[] = [
  {
    id: 'option-0',
    text: 'An example option that is really long to show what should be done to handle long text',
  },
  { id: 'option-1', text: 'Option 1' },
  { id: 'option-2', text: 'Option 2' },
  { id: 'option-3', text: 'Option 3', disabled: true },
  { id: 'option-4', text: 'Option 4' },
  { id: 'option-5', text: 'Option 5' },
];

const itemToString = (item: StoryItem) =>
  typeof item === 'string' ? item : item.text;

// ComboBox is generic over its item type, which signature inference can't
// follow, so declare the story's args explicitly.
type StoryArgs = ComboBoxSignature<StoryItem>['Args'];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/ComboBox',
  component: ComboBox,
  parameters: {
    a11y: {
      // WCAG 1.4.3 exempts inactive components from contrast minimums; axe
      // can't tell a disabled item is inactive.
      context: { exclude: ['.cds--list-box__menu-item[disabled]'] },
    },
    docs: {
      description: {
        component:
          "`ComboBox` is a text input with a listbox of items: typing narrows the choice, or with `@allowCustomValue`, sets a value of its own. Like Carbon React's, it's built on the ListBox parts and follows downshift's keyboard model: focus stays in the input while the arrow keys move the highlight, and Enter or Tab chooses the highlighted item.\n\nItems can be any value: `@itemToString` turns one into its text (by default, a string or number item itself, or an object's string `label`), and an item with `disabled: true` can't be chosen. Every item is listed whatever was typed, unless `@shouldFilterItem` or `@typeahead` filters them. Attributes on the component, such as `name`, `aria-label` or `class`, go to the input.",
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    direction: { control: 'inline-radio', options: ['top', 'bottom'] },
  },
  args: {
    titleText: 'Label',
    helperText: 'Helper text',
    invalidText: 'Error message goes here',
    warnText: 'Warning message goes here',
    items,
    itemToString,
    onChange: fn(),
    onToggleClick: fn(),
  },
  // Leave room for the open menu.
  decorators: [
    (Story, context) => <template>
      <div class="combo-box-story__container">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    <ComboBox
      @titleText={{args.titleText}}
      @helperText={{args.helperText}}
      @placeholder={{args.placeholder}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @allowCustomValue={{args.allowCustomValue}}
      @typeahead={{args.typeahead}}
      @autoAlign={{args.autoAlign}}
      @direction={{args.direction}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @readOnly={{args.readOnly}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @onChange={{args.onChange}}
      @onToggleClick={{args.onToggleClick}}
    />
  </template>,
});

export const Default = meta.story();

Default.test(
  'filters nothing, and chooses the item clicked',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Label' });
    await userEvent.type(input, 'Option');
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('option')).toHaveLength(6);

    await userEvent.click(canvas.getByRole('option', { name: 'Option 2' }));
    await expect(args.onChange).toHaveBeenCalledWith({
      selectedItem: items[2],
    });
    await expect(input).toHaveValue('Option 2');
  },
);

Default.test(
  'can be used with the keyboard',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Label' });
    input.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenCalledWith({
      selectedItem: items[1],
    });
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
);

export const AllowCustomValue = meta.story({
  args: {
    allowCustomValue: true,
    items: ['Apple', 'Orange', 'Banana', 'Pineapple', 'Raspberry', 'Lime'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `@allowCustomValue`, text that matches no item stays when the field loses focus, and `@onChange` reports it as the `selectedItem`. Here `@shouldFilterItem` lists only the items that contain the text.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const shouldFilterItem = ({
      item,
      itemToString: toString,
      inputValue,
    }: {
      item: StoryItem;
      itemToString: (item: StoryItem) => string;
      inputValue: string;
    }) => toString(item).toLowerCase().includes(inputValue.toLowerCase());

    return <template>
      <ComboBox
        @titleText={{args.titleText}}
        @helperText={{args.helperText}}
        @items={{args.items}}
        @itemToString={{args.itemToString}}
        @allowCustomValue={{args.allowCustomValue}}
        @shouldFilterItem={{shouldFilterItem}}
        @onChange={{args.onChange}}
      />
    </template>;
  },
});

AllowCustomValue.test(
  'keeps text that matches no item',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Label' });
    await userEvent.type(input, 'Kiwi');
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
    await userEvent.tab();
    await expect(input).toHaveValue('Kiwi');
    await expect(args.onChange).toHaveBeenCalledWith({
      selectedItem: 'Kiwi',
      inputValue: 'Kiwi',
    });
  },
);

export const AutocompleteWithTypeahead = meta.story({
  args: {
    typeahead: true,
    items: [
      'Apple',
      'Apricot',
      'Avocado',
      'Banana',
      'Blackberry',
      'Blueberry',
      'Cantaloupe',
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Experimental:** with `@typeahead`, the menu lists only the items starting with the text typed, and the first one completes it; Tab accepts the completion.',
      },
    },
  },
});

AutocompleteWithTypeahead.test(
  'completes the text, and Tab accepts it',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole<HTMLInputElement>('combobox', {
      name: 'Label',
    });
    await userEvent.type(input, 'Bl');
    await expect(canvas.getAllByRole('option')).toHaveLength(2);
    await expect(input.value).toBe('Blackberry');
    await userEvent.tab();
    await expect(args.onChange).toHaveBeenCalledWith({
      selectedItem: 'Blackberry',
    });
  },
);

export const ExperimentalAutoAlign = meta.story({
  args: {
    autoAlign: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          '**Experimental:** with `@autoAlign`, Floating UI positions the menu: it opens above the field when there is no room below, and hides when the field scrolls out of view. Scroll the field towards the bottom of the viewport and open it.',
      },
    },
  },
  decorators: [
    (Story, context) => <template>
      <div class="combo-box-story__auto-align">
        <div class="combo-box-story__spacer-above"></div>
        <RenderStory @story={{Story}} @args={{context.args}} />
        <div class="combo-box-story__spacer-below"></div>
      </div>
    </template>,
  ],
});

ExperimentalAutoAlign.test(
  'positions the open menu as wide as the field',
  async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Label' }));
    const menu = canvasElement.querySelector<HTMLElement>(
      '.cds--list-box__menu',
    )!;
    const field = canvasElement.querySelector('.cds--combo-box')!;
    await waitFor(() => expect(menu.style.position).toBe('fixed'));
    await expect(menu.style.width).toBe(`${field.clientWidth}px`);
  },
);

export const WithLayer = Default.extend({ decorators: [withLayer] });

export const WithAILabel = meta.story({
  render: (args: StoryArgs) => <template>
    <ComboBox
      @titleText={{args.titleText}}
      @helperText={{args.helperText}}
      @items={{args.items}}
      @itemToString={{args.itemToString}}
      @onChange={{args.onChange}}
    >
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </ComboBox>
  </template>,
});

export const Controlled = meta.story({
  args: {
    items: [
      { id: 'option-1', text: 'Option 1' },
      { id: 'option-2', text: 'Option 2' },
      { id: 'option-3', text: 'Option 3' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pass `@selectedItem` to control the selection yourself, and update it from `@onChange`. `@onChange` also reports a change you make from outside, as in Carbon React. `@initialSelectedItem` seeds the selection for the uncontrolled case instead.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const [first, second, third] = args.items;
    const selected = tracked<StoryItem | null>(first ?? null);
    const onChange = (data: ComboBoxChange<StoryItem>) => {
      selected.value = data.selectedItem;
      args.onChange?.(data);
    };
    const choose = (item: StoryItem | null | undefined) => () => {
      selected.value = item ?? null;
    };

    return <template>
      <ComboBox
        @titleText={{args.titleText}}
        @helperText={{args.helperText}}
        @items={{args.items}}
        @itemToString={{args.itemToString}}
        @selectedItem={{selected.value}}
        @onChange={{onChange}}
      />
      <div class="combo-box-story__controls">
        <Button {{on "click" (choose null)}}>Clear</Button>
        <Button {{on "click" (choose first)}}>Option 1</Button>
        <Button {{on "click" (choose second)}}>Option 2</Button>
        <Button {{on "click" (choose third)}}>Option 3</Button>
      </div>
    </template>;
  },
});

Controlled.test(
  'reflects a selection made from outside',
  async ({ canvas, userEvent, args }) => {
    const input = canvas.getByRole('combobox', { name: 'Label' });
    await expect(input).toHaveValue('Option 1');
    await userEvent.click(canvas.getByRole('button', { name: 'Option 3' }));
    await waitFor(() => expect(input).toHaveValue('Option 3'));
    await waitFor(() =>
      expect(args.onChange).toHaveBeenCalledWith({
        selectedItem: args.items[2],
        inputValue: 'Option 3',
      }),
    );
  },
);
