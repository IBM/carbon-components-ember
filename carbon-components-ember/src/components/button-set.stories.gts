import { fn as spy } from 'storybook/test';
import style from 'ember-style-modifier';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import ButtonSet from './button-set.gts';

import type { ButtonSignature } from './button.gts';
import type { ButtonSetSignature } from './button-set.gts';
import '#storybook/styles/button-set.css';

// Mirrors Carbon React's `Components/Button/Set Of Buttons` stories,
// including the hidden fluid ones its screenshots cover. Parity gap: the
// buttons keep the order they're written in, so where React's narrow fluid
// sets stack with the primary button on top, ours keep it at the bottom.

type Kind = ButtonSignature['Args']['kind'];

const SETS: Record<string, { label: string; kind: Kind }[]> = {
  'One button': [{ label: 'Primary', kind: 'primary' }],
  'A danger button': [{ label: 'Danger', kind: 'danger' }],
  'A ghost button': [{ label: 'Ghost', kind: 'ghost' }],
  'Two buttons': [
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Primary', kind: 'primary' },
  ],
  'Two buttons with one ghost': [
    { label: 'Ghost', kind: 'ghost' },
    { label: 'Primary', kind: 'primary' },
  ],
  'Three buttons': [
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Secondary 2', kind: 'secondary' },
    { label: 'Primary', kind: 'primary' },
  ],
  'Three buttons with one ghost': [
    { label: 'Ghost', kind: 'ghost' },
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Primary', kind: 'primary' },
  ],
  'Three buttons with one danger': [
    { label: 'Ghost', kind: 'ghost' },
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Danger', kind: 'danger' },
  ],
  'Four buttons': [
    { label: 'Tertiary', kind: 'tertiary' },
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Secondary 2', kind: 'secondary' },
    { label: 'Primary', kind: 'primary' },
  ],
  'Four buttons with one ghost': [
    { label: 'Ghost', kind: 'ghost' },
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Secondary 2', kind: 'secondary' },
    { label: 'Primary', kind: 'primary' },
  ],
  'Four buttons with danger ghost': [
    { label: 'Danger-ghost', kind: 'danger--ghost' },
    { label: 'Secondary', kind: 'secondary' },
    { label: 'Secondary 2', kind: 'secondary' },
    { label: 'Danger', kind: 'danger' },
  ],
};

type StoryArgs = ButtonSetSignature['Args'] & {
  buttons: string;
  containerWidth: number;
  containerVisible: boolean;
  onClick: (event: MouseEvent) => void;
};

const buttonsFor = (name: string) => SETS[name] ?? [];

const widthStyle = (width: number) => ({ 'inline-size': `${width}px` });

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Button/Set Of Buttons',
  component: ButtonSet,
  parameters: {
    docs: {
      description: {
        component:
          "Buttons side by side, flush against each other, or stacked with `@stacked`. With `@fluid`, the set grows with its container, up to a width set by the number of buttons, and stacks the buttons when the container is too narrow for them. The buttons keep the order they're written in: list the primary button last side by side, and first with `@stacked`. Unlike Carbon React's, a fluid set doesn't sort them by kind, so when it stacks the primary button stays at the bottom instead of moving to the top.",
      },
    },
  },
  args: {
    buttons: 'Two buttons',
    containerWidth: 600,
    containerVisible: false,
    onClick: spy(),
  },
  argTypes: {
    buttons: {
      control: 'select',
      options: Object.keys(SETS),
      description: 'The number and kinds of buttons in the set',
      table: { category: 'story controls' },
    },
    containerWidth: {
      control: { type: 'range', min: 280, max: 1200, step: 1 },
      description: "The width of the set's container",
      if: { arg: 'fluid', truthy: true },
      table: { category: 'story controls' },
    },
    containerVisible: {
      description: "Shows the set's container as a layer",
      if: { arg: 'fluid', truthy: true },
      table: { category: 'story controls' },
    },
    onClick: { table: { category: 'story controls' } },
  },
  render: (args: StoryArgs) => <template>
    <div
      class="button-set-story__frame
        {{if args.containerVisible 'button-set-story__frame--visible'}}"
      {{style (widthStyle args.containerWidth)}}
    >
      <ButtonSet @fluid={{args.fluid}} @stacked={{args.stacked}}>
        {{#each (buttonsFor args.buttons) as |button|}}
          <Button @kind={{button.kind}} {{on "click" args.onClick}}>
            {{button.label}}
          </Button>
        {{/each}}
      </ButtonSet>
    </div>
  </template>,
});

export const Default = meta.story({});

export const Fluid = meta.story({
  args: { fluid: true, buttons: 'Three buttons with one danger' },
});

// Hidden, for screenshots, as in Carbon React. Each is a literal
// meta.story() call, which is what Storybook indexes.
const hidden = { tags: ['!dev', '!autodocs'] };

export const FluidOneWide = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'One button', containerWidth: 800 },
});

export const FluidOneWideGhost = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'A ghost button', containerWidth: 800 },
});

export const FluidOneNarrow = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'One button', containerWidth: 280 },
});

export const FluidTwoWide = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'Two buttons', containerWidth: 800 },
});

export const FluidTwoWideGhost = meta.story({
  ...hidden,
  args: {
    fluid: true,
    buttons: 'Two buttons with one ghost',
    containerWidth: 800,
  },
});

export const FluidTwoNarrow = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'Two buttons', containerWidth: 320 },
});

export const FluidThreeWide = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'Three buttons', containerWidth: 800 },
});

export const FluidThreeWideGhost = meta.story({
  ...hidden,
  args: {
    fluid: true,
    buttons: 'Three buttons with one ghost',
    containerWidth: 800,
  },
});

export const FluidThreeNarrow = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'Three buttons', containerWidth: 500 },
});

export const FluidFourWide = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'Four buttons', containerWidth: 1000 },
});

export const FluidFourWideGhost = meta.story({
  ...hidden,
  args: {
    fluid: true,
    buttons: 'Four buttons with one ghost',
    containerWidth: 1000,
  },
});

export const FluidFourNarrow = meta.story({
  ...hidden,
  args: { fluid: true, buttons: 'Four buttons', containerWidth: 600 },
});
