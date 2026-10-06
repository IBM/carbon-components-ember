import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Link from './link.gts';
import Add from './icons/add.ts';
import ArrowRight from './icons/arrow-right.ts';

import type { LinkSignature } from './link.gts';

// Parity with Carbon React's Link stories (Default, Inline, PairedWithIcon)
// is complete. The extra Small/Large/Visited/Disabled stories cover the
// variants docs-app demoed.

type StoryArgs = LinkSignature['Args'] & { label: string };

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Link',
  component: Link,
  parameters: {
    docs: {
      description: {
        component:
          'Links are used as navigational elements. They may be used on their own, within a sentence or paragraph, or directly following the content they are relevant to.',
      },
    },
  },
  args: {
    href: '#',
    label: 'Link',
    onClick: fn(),
  },
  render: (args: StoryArgs) => <template>
    <Link
      @href={{args.href}}
      @size={{args.size}}
      @inline={{args.inline}}
      @visited={{args.visited}}
      @disabled={{args.disabled}}
      @target={{args.target}}
      @renderIcon={{args.renderIcon}}
      @onClick={{args.onClick}}
    >
      {{args.label}}
    </Link>
  </template>,
});

export const Default = meta.story();

Default.test(
  'calls onClick when clicked',
  async ({ canvas, canvasElement, userEvent, args }) => {
    // Keep the test page from following the link.
    canvasElement.addEventListener('click', (e) => e.preventDefault());
    await userEvent.click(canvas.getByRole('link', { name: 'Link' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
);

export const Inline = meta.story({
  args: {
    inline: true,
  },
  render: (args) => <template>
    <Link @href={{args.href}} @inline={{args.inline}}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </Link>
    <p>
      Ut facilisis semper lorem in aliquet. Aliquam accumsan ante justo, vitae
      fringilla eros vehicula id. Ut at enim quis libero pharetra ullamcorper.
      Maecenas feugiat sodales arcu ut porttitor. In blandit ultricies est.
      Vivamus risus massa, cursus eu tellus sed, sagittis commodo nunc.
      <Link @href={{args.href}} @inline={{args.inline}}>
        Maecenas nunc mauris, consequat quis mauris sit amet
      </Link>, finibus suscipit nunc. Phasellus ex quam, placerat quis tempus
      sit amet, pretium nec sem.
    </p>
  </template>,
});

export const PairedWithIcon = meta.story({
  args: {
    label: 'Carbon Docs',
    renderIcon: ArrowRight,
  },
});

export const WithAddIcon = meta.story({
  name: 'With icon (Add)',
  args: {
    label: 'Link with icon',
    renderIcon: Add,
  },
});

export const Small = meta.story({
  args: {
    label: 'Small link',
    size: 'sm',
  },
});

export const Large = meta.story({
  args: {
    label: 'Large link',
    size: 'lg',
  },
});

export const Visited = meta.story({
  args: {
    label: 'Visited link',
    visited: true,
  },
});

export const Disabled = meta.story({
  args: {
    label: 'Disabled link',
    disabled: true,
  },
  parameters: {
    a11y: {
      config: {
        // WCAG 1.4.3 exempts inactive components from contrast minimums.
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
});

Disabled.test(
  'does not call onClick and drops the href',
  async ({ canvas, userEvent, args }) => {
    const link = canvas.getByRole('link', { name: 'Disabled link' });
    await expect(link).not.toHaveAttribute('href');
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(link);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
);
