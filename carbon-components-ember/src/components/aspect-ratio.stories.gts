import preview from '#storybook/preview.ts';
import AspectRatio from './aspect-ratio.gts';
import Grid from './grid.gts';

import type { AspectRatioSignature } from './aspect-ratio.gts';
import '#storybook/styles/aspect-ratio.css';

// Parity gaps with Carbon React's AspectRatio stories: none. React's story
// also spreads its args onto the `Grid`; here only `@ratio` is a control.

const meta = preview.type<{ args: AspectRatioSignature['Args'] }>().meta({
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    docs: {
      description: {
        component:
          "Keeps its content at a fixed width to height ratio, whatever its width. Set the ratio with `@ratio` (`1x1` by default) and the element with `@as`. In a `Grid` column, the ratio follows the column's width.",
      },
    },
  },
  args: {
    ratio: '1x1',
  },
  argTypes: {
    ratio: {
      control: 'select',
      options: ['16x9', '9x16', '2x1', '1x2', '4x3', '3x4', '1x1'],
    },
    as: { control: false },
  },
});

export const Default = meta.story({
  render: (args: AspectRatioSignature['Args']) => <template>
    <div class="aspect-ratio-story__frame">
      <Grid @mode="css-grid" as |g|>
        <g.Column @sm={{1}} @md={{2}} @lg={{4}}>
          <AspectRatio @ratio={{args.ratio}}>Content</AspectRatio>
        </g.Column>
        <g.Column @sm={{1}} @md={{2}} @lg={{4}}>
          <AspectRatio @ratio={{args.ratio}}>Content</AspectRatio>
        </g.Column>
        <g.Column @sm={{1}} @md={{2}} @lg={{4}}>
          <AspectRatio @ratio={{args.ratio}}>Content</AspectRatio>
        </g.Column>
        <g.Column @sm={{1}} @md={{2}} @lg={{4}}>
          <AspectRatio @ratio={{args.ratio}}>Content</AspectRatio>
        </g.Column>
      </Grid>
    </div>
  </template>,
});
