import { htmlSafe } from '@ember/template';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';

import type { LayerSignature } from './layer.gts';

// Carbon React parity gaps:
// - `useLayer` story: Ember has no `useLayer()` hook (nor ambient
//   `LayerContext`), and Layer doesn't yield its own level, so content can't
//   read the current layer level.

// Carbon React's `.example-layer-test-component` story styles.
const layerStyle = htmlSafe(
  'padding: 1rem; background: var(--cds-layer); color: var(--cds-text-primary);',
);
const noBackgroundStyle = htmlSafe(
  'padding: 1rem; color: var(--cds-text-primary);',
);

// `label` isn't one of Layer's args: it's the text rendered on each layer.
const meta = preview
  .type<{ args: LayerSignature['Args'] & { label: string } }>()
  .meta({
    title: 'Components/Layer',
    component: Layer,
    parameters: {
      controls: { include: ['label'] },
      docs: {
        description: {
          component: `The \`Layer\` component renders content on a specific Carbon layer. Each layer has a set of token values associated with it, which other components (like \`Tile\`) key off of to determine their own background. You can use these tokens directly, or use contextual tokens from Carbon's styles package like \`$layer\` or \`$field\`.

\`Layer\`s can be nested up to three levels deep; past that, the level stays clamped at the third level. Ember has no equivalent of React's ambient \`LayerContext\`, so a bare \`<Layer>\` always renders as the first level of nesting; to nest \`Layer\`s more than one level deep, use the component yielded to the block, which is pre-bound to the correct next level:

\`\`\`hbs
<Layer as |L|>
  ...
  <L>...</L>
</Layer>
\`\`\``,
        },
      },
    },
    args: {
      label: 'Workspace settings',
    },
    argTypes: {
      label: { control: { type: 'text' } },
    },
    render: (args) => <template>
      <div style={{layerStyle}}>{{args.label}}</div>
      <Layer as |L|>
        <div style={{layerStyle}}>{{args.label}}</div>
        <L>
          <div style={{layerStyle}}>{{args.label}}</div>
        </L>
      </Layer>
    </template>,
  });

export const Default = meta.story();

export const WithBackground = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Passing `@withBackground` applies a background color using the layer's background token, so you don't need to set one manually.",
      },
    },
  },
  render: (args) => <template>
    <div style={{noBackgroundStyle}}>{{args.label}}</div>
    <Layer @withBackground={{true}} as |L|>
      <div style={{noBackgroundStyle}}>{{args.label}}</div>
      <L @withBackground={{true}}>
        <div style={{noBackgroundStyle}}>{{args.label}}</div>
      </L>
    </Layer>
  </template>,
});

export const CustomLevel = meta.story({
  args: {
    level: 2,
  },
  argTypes: {
    level: { control: { type: 'select' }, options: [0, 1, 2] },
  },
  parameters: {
    controls: { include: ['label', 'level'] },
    docs: {
      description: {
        story: 'Override the rendered level with `@level` (`0`, `1`, or `2`).',
      },
    },
  },
  render: (args) => <template>
    <Layer @level={{args.level}}>
      <div style={{layerStyle}}>{{args.label}}</div>
    </Layer>
  </template>,
});

export const ResetLevel = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'A nested `Layer` can use `@level` to reset back to the first layer regardless of nesting.',
      },
    },
  },
  render: (args) => <template>
    <Layer as |L|>
      <div style={{layerStyle}}>{{args.label}} (layer two)</div>
      <L @level={{0}}>
        <div style={{layerStyle}}>{{args.label}} (reset to layer one)</div>
      </L>
    </Layer>
  </template>,
});
