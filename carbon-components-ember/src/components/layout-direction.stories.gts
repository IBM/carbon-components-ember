import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import LayoutDirection from './layout-direction.gts';

import type { LayoutDirectionType } from './layout-direction.gts';

// Carbon React has no LayoutDirection stories file (only Text's
// `LayoutAndText` story uses it), so these stories port the docs-app page;
// the title follows the Storybook path Carbon's docs link to.

const meta = preview.meta({
  title: 'Components/LayoutDirection',
  component: LayoutDirection,
  parameters: {
    docs: {
      description: {
        component: `The \`LayoutDirection\` component sets the reading direction (\`ltr\` or \`rtl\`) for a part of the page. It renders a wrapper element with a \`dir\` attribute, which the browser natively cascades to descendant elements. \`LayoutDirection\` components can be nested to override the direction for a specific section of content.

The block receives \`dir\` and \`isRTL\` so nested content can react to the active direction, mirroring React's \`useLayoutDirection\` hook.`,
      },
    },
  },
  // Typed as the union, not widened to `string`, so stories don't have to
  // repeat the required `dir`.
  args: {
    dir: 'rtl' as LayoutDirectionType,
  },
  argTypes: {
    dir: { control: { type: 'radio' }, options: ['ltr', 'rtl'] },
    as: { control: { type: 'text' } },
  },
  render: (args) => <template>
    <LayoutDirection @dir={{args.dir}} @as={{args.as}}>
      <p>مرحبا بالعالم</p>
    </LayoutDirection>
  </template>,
});

export const Default = meta.story();

Default.test('sets the dir attribute', async ({ canvas }) => {
  await expect(canvas.getByText('مرحبا بالعالم').parentElement).toHaveAttribute(
    'dir',
    'rtl',
  );
});

export const CustomElement = meta.story({
  args: {
    as: 'span',
    dir: 'ltr',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `@as` to change the element type used to render the wrapper (defaults to `div`).',
      },
    },
  },
  render: (args) => <template>
    <LayoutDirection @dir={{args.dir}} @as={{args.as}}>
      Hello world
    </LayoutDirection>
  </template>,
});

export const Nested = meta.story({
  args: {
    dir: 'ltr',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Nest `LayoutDirection` components to switch direction for part of a larger, oppositely-directioned block of content.',
      },
    },
  },
  render: (args) => <template>
    <LayoutDirection @dir={{args.dir}} @as={{args.as}}>
      <p>
        Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
        ratione nobis voluptatibus facilis nostrum.
      </p>
      <LayoutDirection @dir="rtl">
        <p>
          المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
          التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية.
        </p>
      </LayoutDirection>
      <p>
        Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
        ratione nobis voluptatibus facilis nostrum.
      </p>
    </LayoutDirection>
  </template>,
});

export const ReadingTheCurrentDirection = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The block's `dir` and `isRTL` reflect the active direction, like React's `useLayoutDirection` hook.",
      },
    },
  },
  render: (args) => <template>
    <LayoutDirection @dir={{args.dir}} @as={{args.as}} as |ctx|>
      <p>Current direction: {{ctx.dir}} ({{if ctx.isRTL "RTL" "LTR"}})</p>
    </LayoutDirection>
  </template>,
});

ReadingTheCurrentDirection.test(
  'yields the active direction',
  async ({ canvas }) => {
    await expect(
      canvas.getByText('Current direction: rtl (RTL)'),
    ).toBeInTheDocument();
  },
);
