import { RenderStory } from 'ember-storybook';
import { expect, fn } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Add from './icons/add.ts';

// Carbon React parity gaps (Components/Button):
// - `DangerTertiary` / `DangerGhost`: `@tertiary`/`@ghost` override
//   `@type`, so a danger button can't also be tertiary or ghost.
// - `Radius`: no corner-radius tokens.
// - `IconButtonWithBadge`: no `badgeCount`.
// - `Skeleton`: there is no ButtonSkeleton.
// - No `renderIcon` (an icon next to the label), `href` (rendering as a
//   link), `iconDescription`/tooltip for icon-only buttons (use
//   `aria-label`) or `2xl` size.
// - A danger button always asks for confirmation in a modal before running
//   `@onClick` (React's `dangerDescription` is only an assistive label).

const meta = preview.meta({
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Buttons are used to initialize an action. Pick the emphasis with `@type` (`primary`, `secondary` or `danger`), `@tertiary` or `@ghost`, and the size with `@size`.\n\nIf `@onClick` returns a promise, the button disables itself and shows a loading indicator until the promise settles. A `danger` button asks for confirmation in a modal (with `@confirmText` as its body, or a custom `@confirmDialog`) before running `@onClick`; the modal renders into the `carbon.dialog-manager` service's destination element (`#carbon-components-dialog-id`), which the app has to provide.",
      },
    },
  },
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'danger'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
  },
  args: {
    label: 'Button',
    onClick: fn(),
  },
  render: (args) => <template>
    <Button
      @type={{args.type}}
      @size={{args.size}}
      @tertiary={{args.tertiary}}
      @ghost={{args.ghost}}
      @disabled={{args.disabled}}
      @loading={{args.loading}}
      @confirmText={{args.confirmText}}
      @onClick={{args.onClick}}
    >
      {{args.label}}
    </Button>
  </template>,
});

export const Default = meta.story({
  args: {
    type: 'primary',
  },
});

Default.test('calls onClick', async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Button' }));
  await expect(args.onClick).toHaveBeenCalledOnce();
});

export const Secondary = meta.story({
  args: {
    type: 'secondary',
  },
});

export const Tertiary = meta.story({
  args: {
    tertiary: true,
  },
});

export const Ghost = meta.story({
  args: {
    ghost: true,
  },
});

export const Danger = meta.story({
  args: {
    type: 'danger',
    label: 'Delete',
    confirmText: 'Do you really want to delete this?',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A danger button runs `@onClick` only after the user confirms in a modal showing `@confirmText`.',
      },
    },
  },
  // The confirmation modal renders into the dialog manager's destination
  // element, which an app adds to its application template.
  decorators: [
    (Story, context) => <template>
      <RenderStory @story={{Story}} @args={{context.args}} />
      <div id="carbon-components-dialog-id"></div>
    </template>,
  ],
});

Danger.test(
  'asks for confirmation before calling onClick',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Delete' }));
    await expect(
      await canvas.findByText('Do you really want to delete this?'),
    ).toBeInTheDocument();
    await expect(args.onClick).not.toHaveBeenCalled();

    // The dialog's accept button, named by its text.
    await userEvent.click(canvas.getByRole('button', { name: 'Okay' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
);

export const Small = meta.story({
  args: {
    type: 'secondary',
    size: 'sm',
    label: 'Secondary small button',
  },
});

export const Sizes = meta.story({
  render: (args) => <template>
    <div style="display: flex; flex-direction: column; gap: 1rem">
      <Button @size="sm" @onClick={{args.onClick}}>Small</Button>
      <Button @size="md" @onClick={{args.onClick}}>Medium</Button>
      <Button @size="lg" @onClick={{args.onClick}}>Large</Button>
      <Button @size="xl" @onClick={{args.onClick}}>Extra large</Button>
    </div>
  </template>,
});

export const IconButton = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'With `@iconOnly`, pass the icon as the block and give the button an accessible name with `aria-label`.',
      },
    },
  },
  render: (args) => <template>
    <Button
      @iconOnly={{true}}
      @type={{args.type}}
      @size={{args.size}}
      @disabled={{args.disabled}}
      @onClick={{args.onClick}}
      aria-label="Add item"
    >
      <Add @size="16" @svgClass="cds--btn__icon" />
    </Button>
  </template>,
});

IconButton.test(
  'is named by its aria-label',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add item' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
);

export const Loading = Default.extend({
  args: {
    loading: true,
  },
});

export const PromiseLoading = meta.story({
  args: {
    size: 'xl',
    label: 'Button with loading indicator if onClick returns a promise',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `@onClick` returns a promise, the button shows a loading indicator and is disabled until it settles.',
      },
    },
  },
  render: (args) => {
    const onClick = () => {
      void args.onClick?.();
      return new Promise<void>((resolve) => setTimeout(resolve, 1000));
    };

    return <template>
      <Button @size={{args.size}} @onClick={{onClick}}>
        {{args.label}}
      </Button>
    </template>;
  },
});

PromiseLoading.test(
  'is busy until the promise settles',
  async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
    await expect(button).toBeDisabled();
    await expect(button.querySelector('.cds--inline-loading')).not.toBeNull();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    await expect(button).toBeEnabled();
  },
);

export const Disabled = Default.extend({
  args: {
    disabled: true,
  },
});
