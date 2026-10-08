import { expect, fn } from 'storybook/test';
import BookmarkSvg from '@carbon/icons/es/bookmark/32';

import preview from '#storybook/preview.ts';
import Icon, { registerIcon } from './icon.gts';
import * as Icons from '../icons.ts';

import type { IconSignature } from './icon.gts';

// Carbon React has no `Icon` component story to mirror (React consumes
// `@carbon/icons-react` components directly). The equivalents here are the
// generated icon components exported from `carbon-components-ember/icons`
// (each one is an `Icon` with its SVG lazily imported per size), plus the
// base `Icon` for SVGs registered by name. Not demoed: `@danger`, which
// opens a confirmation dialog through the `carbon.dialog-manager` service and
// needs an app-level dialog outlet.

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
          component: `\`Icon\` renders a Carbon SVG icon. Use the generated icon components from \`carbon-components-ember/icons\` (e.g. \`<Bookmark @size={{16}} />\`), which load the SVG for the requested size on demand, or register an SVG from \`@carbon/icons\` with \`registerIcon(name, svg)\` and render it with \`<Icon @icon="name" />\`.

Passing \`@onClick\` renders the icon inside a ghost button and shows a loading state while the (optionally async) handler runs.`,
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
          'Every icon in `@carbon/icons` is also exported as its own component from `carbon-components-ember/icons`; `@size` picks the 16, 20, 24 or 32px artwork.',
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

export const Clickable = meta.story({
  args: {
    onClick: fn(),
  },
  render: (args) => <template>
    <Icons.Task @onClick={{args.onClick}} @iconDescription="Add task" />
  </template>,
});

Clickable.test(
  'calls onClick when the icon button is pressed',
  async ({ canvas, userEvent, args }) => {
    const button = await canvas.findByRole('button', { name: 'Add task' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
);

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
      description:
        'Render at most this many icons (each one lazily loads its SVG)',
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
      <ul
        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr)); gap: 1rem; list-style: none; padding: 0;"
      >
        {{#each shown as |entry|}}
          <li
            style="display: flex; flex-direction: column; align-items: center; gap: .5rem; text-align: center;"
          >
            <entry.component @size={{args.size}} />
            <code style="font-size: .75rem; word-break: break-all;">
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

// Only the listing is asserted: each icon's SVG is a lazy `import()`. The
// SVGs render in Storybook itself, but under the Vitest runner the icon
// doesn't reliably re-render once its import resolves.
GalleryFiltered.test(
  'lists the icons matching the filter',
  async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByText('Bookmark')).toBeVisible();
    await expect(canvas.getByText('BookmarkAdd')).toBeVisible();
    await expect(canvas.getByText('BookmarkFilled')).toBeVisible();
    await expect(
      canvas.getByText(/Showing 3 of 3 matching icons/),
    ).toBeVisible();
  },
);
