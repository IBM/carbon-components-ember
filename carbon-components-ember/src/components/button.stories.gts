import { expect, fn as spy } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import type { ButtonSignature } from './button.gts';
import ButtonSkeleton from './button-skeleton.gts';
import Add from './icons/add.ts';
import '#storybook/styles/button.css';

// Carbon React parity gaps (Components/Button):
// - `IconButtonWithBadge`: no `IconButton` with a `badgeCount` yet (#454).
// - `Radius`: no corner-radius tokens.

type StoryArgs = ButtonSignature['Args'] & {
  /** Story-only: the button's label. */
  label?: string;
  /** Story-only: called on click, through `{{on "click"}}`. */
  onClick: () => void;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Buttons are used to initialize an action. Pick the emphasis with `@kind` and the size with `@size`. Handle clicks with `{{on "click"}}`, and make a submit button with `type="submit"`, as on a native `<button>`. With `@href` it renders a link styled as a button, and with `@route` (plus `@models` and `@query`) Ember\'s `LinkTo` to one of the app\'s routes.\n\nWith `@hasIconOnly`, it shows only its icon, in a tooltip naming it with `@iconDescription`. For a loading state, show an `InlineLoading` in its place while the work runs, as InlineLoading\'s UX example does.',
      },
    },
  },
  argTypes: {
    kind: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'ghost',
        'danger',
        'danger--primary',
        'danger--tertiary',
        'danger--ghost',
      ],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  args: {
    label: 'Button',
    onClick: spy(),
  },
  render: (args) => <template>
    <Button
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @isExpressive={{args.isExpressive}}
      @dangerDescription={{args.dangerDescription}}
      {{on "click" args.onClick}}
    >
      {{args.label}}
    </Button>
  </template>,
});

export const Default = meta.story({
  args: {
    kind: 'primary',
  },
});

Default.test('calls onClick', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Button' }));
  await expect(args.onClick).toHaveBeenCalledOnce();
});

export const Secondary = meta.story({
  args: {
    kind: 'secondary',
  },
});

export const Tertiary = meta.story({
  args: {
    kind: 'tertiary',
  },
});

export const Danger = meta.story({
  args: {
    kind: 'danger',
    label: 'Delete',
    dangerDescription: 'Deletes the project',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`@dangerDescription` tells assistive technology what the button does. A danger button runs its click handler right away; ask for confirmation there if the action needs it.',
      },
    },
  },
});

Danger.test('describes what it does', async ({ canvas, userEvent, args }) => {
  // Its name includes the visually hidden description, as in Carbon React.
  const button = canvas.getByRole('button', { name: /Delete$/ });
  await expect(button).toHaveAccessibleDescription('Deletes the project');
  await userEvent.click(button);
  await expect(args.onClick).toHaveBeenCalledOnce();
});

export const DangerTertiary = meta.story({
  args: {
    kind: 'danger--tertiary',
    label: 'Tertiary danger button',
  },
});

export const DangerGhost = meta.story({
  args: {
    kind: 'danger--ghost',
    label: 'Ghost danger button',
  },
});

export const Ghost = meta.story({
  args: {
    kind: 'ghost',
  },
});

export const IconButton = meta.story({
  args: {
    kind: 'primary',
    iconDescription: 'Icon Description',
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `@hasIconOnly`, the button shows only `@renderIcon`, in a tooltip that names it with `@iconDescription`. `@tooltipPosition` and `@tooltipAlignment` place the tooltip.',
      },
    },
  },
  render: (args) => <template>
    <Button
      @kind={{args.kind}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @hasIconOnly={{true}}
      @renderIcon={{Add}}
      @iconDescription={{args.iconDescription}}
      @tooltipPosition={{args.tooltipPosition}}
      @tooltipAlignment={{args.tooltipAlignment}}
      {{on "click" args.onClick}}
    />
  </template>,
});

IconButton.test(
  'is named by its iconDescription',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Icon Description' }),
    );
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
);

export const WithIcon = meta.story({
  parameters: {
    docs: {
      description: {
        story: '`@renderIcon` shows an icon after the label.',
      },
    },
  },
  render: (args) => <template>
    <Button
      @kind={{args.kind}}
      @size={{args.size}}
      @renderIcon={{Add}}
      {{on "click" args.onClick}}
    >
      {{args.label}}
    </Button>
  </template>,
});

export const Link = meta.story({
  args: {
    href: 'https://carbondesignsystem.com/components/button/usage/',
    label: 'Button usage',
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `@href`, the button is a link. With `@disabled` as well, it renders a disabled `<button>` instead.',
      },
    },
  },
  render: (args) => <template>
    <Button
      @kind={{args.kind}}
      @size={{args.size}}
      @href={{args.href}}
      @disabled={{args.disabled}}
    >
      {{args.label}}
    </Button>
  </template>,
});

export const Sizes = meta.story({
  render: (args) => <template>
    <div class="button-story__stack">
      <Button @size="xs" {{on "click" args.onClick}}>Extra small</Button>
      <Button @size="sm" {{on "click" args.onClick}}>Small</Button>
      <Button @size="md" {{on "click" args.onClick}}>Medium</Button>
      <Button @size="lg" {{on "click" args.onClick}}>Large</Button>
      <Button @size="xl" {{on "click" args.onClick}}>Extra large</Button>
      <Button @size="2xl" {{on "click" args.onClick}}>2XL</Button>
    </div>
  </template>,
});

export const Disabled = Default.extend({
  args: {
    disabled: true,
  },
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`ButtonSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template><ButtonSkeleton /></template>,
});
