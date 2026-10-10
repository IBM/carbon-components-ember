import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Breadcrumbs from './breadcrumbs.gts';
import BreadcrumbSkeleton from './breadcrumb-skeleton.gts';

// Carbon React parity gaps (Components/Breadcrumb):
// - Crumbs are plain strings that report clicks through `@onSelect`; there
//   is no BreadcrumbItem with its own `href`, so items can't be real links.
// - `BreadcrumbWithOverflowMenu` / `...SizeSmall`: no overflow menu and no
//   `size` arg.
// - `noTrailingSlash` is always on.
const meta = preview.meta({
  title: 'Components/Breadcrumb',
  component: Breadcrumbs,
  parameters: {
    docs: {
      description: {
        component:
          'The breadcrumb is a secondary navigation pattern that helps a user understand the hierarchy among levels and navigate back through them.',
      },
    },
  },
  args: {
    crumbs: ['Breadcrumb 1', 'Breadcrumb 2', 'Breadcrumb 3'],
    onSelect: fn(),
  },
});

export const Default = meta.story();

Default.test(
  'reports the clicked crumb through onSelect',
  async ({ canvas, canvasElement, userEvent, args }) => {
    // Crumbs are `href="#"` links that don't prevent their default action;
    // keep the click from navigating the test page.
    canvasElement.addEventListener('click', (event) => event.preventDefault());
    await userEvent.click(canvas.getByRole('link', { name: 'Breadcrumb 2' }));
    await expect(args.onSelect).toHaveBeenCalledWith('Breadcrumb 2');
  },
);

export const CurrentPage = meta.story({
  args: {
    current: 'Breadcrumb 3',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The crumb matching `@current` is marked as the current page (`aria-current`).',
      },
    },
  },
});

CurrentPage.test('marks the current crumb', async ({ canvas }) => {
  await expect(
    canvas.getByRole('link', { name: 'Breadcrumb 3' }),
  ).toHaveAttribute('aria-current', 'true');
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`BreadcrumbSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template><BreadcrumbSkeleton /></template>,
});
