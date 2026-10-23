import { expect } from 'storybook/test';
import BookmarkSvg from '@carbon/icons/es/bookmark/32';

import preview from '#storybook/preview.ts';
import Icon, { registerIcon } from './icon.gts';
// eslint-disable-next-line no-restricted-imports -- the gallery story lists every icon
import * as Icons from '../icons.ts';

import type { IconSignature } from './icon.gts';
import '#storybook/styles/icon.css';

// Carbon React has no `Icon` component story to mirror (React consumes
// `@carbon/icons-react` components directly). The equivalents here are the
// generated icon components exported from `carbon-components-ember/icons`,
// plus the base `Icon` for SVGs registered by name.

registerIcon('bookmark', BookmarkSvg);

const ICONS = Object.entries(
  Icons as unknown as Record<string, typeof Icon>,
).map(([name, component]) => ({ name, component }));

const meta = preview
  .type<{ args: IconSignature['Args'] & { filter?: string; limit?: number } }>()
  .meta({
    title: 'Components/Icon',
    component: Icon,
    parameters: {
      docs: {
        description: {
          component: `\`Icon\` renders a Carbon SVG icon. Use the generated icon components from \`carbon-components-ember/icons\` (e.g. \`<Bookmark />\`), which are 16px unless given \`@size\`, as in \`@carbon/icons-react\`, or register an SVG from \`@carbon/icons\` with \`registerIcon(name, svg)\` and render it with \`<Icon @icon="name" />\`.`,
        },
      },
    },
    args: {
      icon: 'bookmark',
    },
  });

export const Default = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "An SVG from `@carbon/icons` registered with `registerIcon('bookmark', Bookmark32)` and rendered by name.",
      },
    },
  },
});

Default.test('renders the registered SVG', async ({ canvasElement }) => {
  const svg = canvasElement.querySelector('svg');
  await expect(svg).not.toBeNull();
  await expect(svg).toHaveAttribute('aria-hidden', 'true');
});

export const IconComponents = meta.story({
  args: { size: 32 },
  parameters: {
    docs: {
      description: {
        story:
          'Every icon in `@carbon/icons` is also exported as its own component from `carbon-components-ember/icons`. `@size` defaults to 16; a size the icon has no artwork for scales its 32px drawing, as in `@carbon/icons-react`.',
      },
    },
  },
  render: (args) => <template>
    <Icons.Bookmark @size={{args.size}} />
    <Icons.Task @size={{args.size}} />
    <Icons.Information @size={{args.size}} />
  </template>,
});

export const Sizes = meta.story({
  render: () => <template>
    <Icons.Bookmark @size={{16}} />
    <Icons.Bookmark @size={{20}} />
    <Icons.Bookmark @size={{24}} />
    <Icons.Bookmark @size={{32}} />
  </template>,
});

export const Loading = meta.story({
  args: { loading: true },
});

export const Gallery = meta.story({
  args: {
    filter: '',
    size: 32,
    limit: 200,
  },
  argTypes: {
    filter: { control: 'text', description: 'Filter icons by name' },
    limit: {
      control: { type: 'number', min: 1 },
      description: 'Render at most this many icons',
    },
    size: { control: 'select', options: [16, 20, 24, 32] },
  },
  parameters: {
    controls: { include: ['filter', 'size', 'limit'] },
    docs: {
      description: {
        story: `Every generated icon component exported from \`carbon-components-ember/icons\` (${ICONS.length} in total). Use the filter control to search by name.`,
      },
    },
  },
  render: (args) => {
    const term = (args.filter ?? '').trim().toLowerCase();
    const matching = ICONS.filter(({ name }) =>
      name.toLowerCase().includes(term),
    );
    const shown = matching.slice(0, args.limit ?? 200);

    return <template>
      <p class="cds--label">
        Showing
        {{shown.length}}
        of
        {{matching.length}}
        matching icons ({{ICONS.length}}
        total)
      </p>
      <ul class="icon-story__list">
        {{#each shown as |entry|}}
          <li class="icon-story__item">
            <entry.component @size={{args.size}} />
            <code class="icon-story__code">
              {{entry.name}}
            </code>
          </li>
        {{/each}}
      </ul>
    </template>;
  },
});

export const GalleryFiltered = Gallery.extend({
  args: { filter: 'bookmark' },
});

GalleryFiltered.test(
  'lists the icons matching the filter',
  async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvasElement.querySelectorAll('svg')).toHaveLength(3);
    await expect(canvas.getByText('Bookmark')).toBeVisible();
    await expect(canvas.getByText('BookmarkAdd')).toBeVisible();
    await expect(canvas.getByText('BookmarkFilled')).toBeVisible();
    await expect(
      canvas.getByText(/Showing 3 of 3 matching icons/),
    ).toBeVisible();
  },
);
