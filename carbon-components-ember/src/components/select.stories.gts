import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import { withLayer } from '#storybook/decorators.gts';
import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Select from './select.gts';
import SelectItem from './select-item.gts';
import SelectItemGroup from './select-item-group.gts';
import SelectSkeleton from './select-skeleton.gts';

import type { SelectSignature } from './select.gts';
import '#storybook/styles/select.css';

// Carbon React parity gaps (Components/Select): none.

type StoryArgs = SelectSignature['Args'];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Select',
  component: Select,
  subcomponents: { SelectItem, SelectItemGroup, SelectSkeleton },
  parameters: {
    docs: {
      description: {
        component:
          "`Select` is a native `<select>` styled as a Carbon field. Its options are the `SelectItem` it yields (`as |SelectItem|`), optionally grouped in `SelectItemGroup`s; the yielded one keeps `@value` selected as the options change. Attributes on the component, such as `name` or `required`, go to the `<select>`; `@className` styles the field's wrapper.\n\nCarbon recommends an empty option, selected by default: make the first `SelectItem` one with an empty `@value`. Without one, the first option is selected, or the one whose value is `@defaultValue`. Pass `@value` instead to control the selection: the select shows it, and goes back to it after a change that `@onChange` doesn't pass back.",
      },
    },
    controls: {
      include: [
        'disabled',
        'helperText',
        'hideLabel',
        'inline',
        'invalid',
        'invalidText',
        'labelText',
        'onChange',
        'readOnly',
        'size',
        'warn',
        'warnText',
      ],
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: {
    disabled: false,
    helperText: 'Select the region where your resources will be hosted.',
    hideLabel: false,
    inline: false,
    invalid: false,
    invalidText: 'Select a deployment region.',
    labelText: 'Deployment region',
    readOnly: false,
    size: 'md',
    warn: false,
    warnText: 'This region has limited availability.',
    onChange: fn(),
  },
  decorators: [
    (Story, context) => <template>
      <div class="select-story__container">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
  render: (args: StoryArgs) => <template>
    <Select
      @labelText={{args.labelText}}
      @helperText={{args.helperText}}
      @disabled={{args.disabled}}
      @inline={{args.inline}}
      @hideLabel={{args.hideLabel}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @readOnly={{args.readOnly}}
      @size={{args.size}}
      @onChange={{args.onChange}}
      as |SelectItem|
    >
      <SelectItem @value="" @text="Choose a region" />
      <SelectItem @value="us-south" @text="Dallas (us-south)" />
      <SelectItem @value="us-east" @text="Washington, DC (us-east)" />
      <SelectItem @value="eu-de" @text="Frankfurt (eu-de)" />
      <SelectItem @value="au-syd" @text="Sydney (au-syd)" />
    </Select>
  </template>,
});

export const Default = meta.story();

Default.test(
  'selects an option, and titles the select with it',
  async ({ canvas, userEvent, args }) => {
    const select = canvas.getByRole('combobox', { name: 'Deployment region' });
    await expect(select).toHaveAccessibleDescription(
      'Select the region where your resources will be hosted.',
    );

    await userEvent.selectOptions(select, 'Frankfurt (eu-de)');
    await expect(args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: select }),
    );
    await expect(select).toHaveValue('eu-de');
    await expect(select).toHaveAttribute('title', 'Frankfurt (eu-de)');
  },
);

export const Inline = meta.story({
  args: {
    inline: true,
  },
});

Inline.test(
  'shows the field beside its label',
  async ({ canvas, canvasElement }) => {
    const select = canvas.getByRole('combobox', { name: 'Deployment region' });
    const label = canvasElement.querySelector('.cds--label')!;
    const labelBox = label.getBoundingClientRect();
    const selectBox = select.getBoundingClientRect();
    await expect(labelBox.right).toBeLessThanOrEqual(selectBox.left);
    await expect(labelBox.top).toBeLessThan(selectBox.bottom);
    await expect(labelBox.bottom).toBeGreaterThan(selectBox.top);
  },
);

export const Skeleton = meta.story({
  args: {
    hideLabel: false,
  },
  parameters: {
    controls: { include: ['hideLabel'] },
    docs: {
      description: {
        story:
          '`SelectSkeleton` stands in for the component while its content loads.',
      },
    },
  },
  render: (args: StoryArgs) => <template>
    <SelectSkeleton @hideLabel={{args.hideLabel}} />
  </template>,
});

export const WithLayer = Default.extend({ decorators: [withLayer] });

export const WithAILabel = meta.story({
  render: (args: StoryArgs) => <template>
    <Select
      @labelText={{args.labelText}}
      @helperText={{args.helperText}}
      @disabled={{args.disabled}}
      @inline={{args.inline}}
      @hideLabel={{args.hideLabel}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      @readOnly={{args.readOnly}}
      @size={{args.size}}
      @onChange={{args.onChange}}
    >
      <:default as |SelectItem|>
        <SelectItem @value="" @text="Choose a region" />
        <SelectItem @value="us-south" @text="Dallas (us-south)" />
        <SelectItem @value="us-east" @text="Washington, DC (us-east)" />
        <SelectItem @value="eu-de" @text="Frankfurt (eu-de)" />
        <SelectItem @value="au-syd" @text="Sydney (au-syd)" />
      </:default>
      <:decorator as |AILabel|>
        <AILabel @align="bottom-end" as |label|>
          <label.Content><AIExplanation /></label.Content>
        </AILabel>
      </:decorator>
    </Select>
  </template>,
});

WithAILabel.test(
  'shows the AI label inside the field, ahead of the chevron',
  async ({ canvas, canvasElement }) => {
    const select = canvas.getByRole('combobox', { name: 'Deployment region' });
    const aiLabel = canvasElement.querySelector('.cds--ai-label__button')!;
    const chevron = canvasElement.querySelector('.cds--select__arrow')!;
    const selectBox = select.getBoundingClientRect();
    const aiLabelBox = aiLabel.getBoundingClientRect();
    await expect(aiLabelBox.left).toBeGreaterThan(selectBox.left);
    await expect(aiLabelBox.right).toBeLessThanOrEqual(
      chevron.getBoundingClientRect().left,
    );
    await expect(aiLabelBox.top).toBeGreaterThanOrEqual(selectBox.top);
    await expect(aiLabelBox.bottom).toBeLessThanOrEqual(selectBox.bottom);
  },
);
