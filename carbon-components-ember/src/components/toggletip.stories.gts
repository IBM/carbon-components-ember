import { expect, userEvent as globalUserEvent, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Link from './link.gts';
import Toggletip from './toggletip.gts';
import ToggletipActions from './toggletip/actions.gts';
import ToggletipLabel from './toggletip/label.gts';
import Information from './icons/information.ts';

import type { ToggletipComponentSignature } from './toggletip.gts';

// Parity gaps with Carbon React's Toggletip stories:
// - `ExperimentalAutoAlign`: no `autoAlign` (or `alignmentAxisOffset`) arg;
//   use `@align` to pick a static position instead.
// - The deprecated `alignDeprecated` values aren't accepted.

type StoryArgs = ToggletipComponentSignature['Args'] & {
  labelText: string;
  buttonLabel: string;
  bodyText: string;
  linkText: string;
  buttonText: string;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Toggletip',
  component: Toggletip,
  parameters: {
    docs: {
      description: {
        component:
          'A `Toggletip` is used to provide extra information about an element on the page. It renders a button that, when clicked, shows a popover with additional content. Unlike a `Tooltip`, its content can contain interactive elements like links and buttons, since it stays open until the user dismisses it (by clicking the button again, clicking outside, or pressing <kbd>Escape</kbd>).\n\n`Toggletip` yields a `Button` and `Content` component that coordinate the open/closed state and accessibility attributes between them. `ToggletipLabel` and `ToggletipActions` are standalone helpers for the label next to it and the actions row inside the content.',
      },
    },
  },
  args: {
    align: 'bottom',
    defaultOpen: false,
    labelText: 'Toggletip label',
    buttonLabel: 'Show information',
    bodyText:
      'Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.',
    linkText: 'Link action',
    buttonText: 'Button',
  },
  argTypes: {
    align: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
    },
  },
  render: (args: StoryArgs) => <template>
    <div style="display: flex; align-items: center; padding: 1rem 0 12rem">
      <ToggletipLabel>{{args.labelText}}</ToggletipLabel>
      <Toggletip @align={{args.align}} @defaultOpen={{args.defaultOpen}} as |t|>
        <t.Button @label={{args.buttonLabel}}>
          <Information />
        </t.Button>
        <t.Content>
          <p>{{args.bodyText}}</p>
          <ToggletipActions>
            <Link @href="#">{{args.linkText}}</Link>
            <Button @size="sm">{{args.buttonText}}</Button>
          </ToggletipActions>
        </t.Content>
      </Toggletip>
    </div>
  </template>,
});

export const Default = meta.story();

Default.test(
  'opens on click and closes on Escape or an outside click',
  async ({ canvas, canvasElement, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Show information' });
    const toggletip = canvasElement.querySelector('.cds--toggletip')!;
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(toggletip).toHaveClass('cds--toggletip--open');
    await expect(
      canvas.getByRole('button', { name: 'Button' }),
    ).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(button).toHaveAttribute('aria-expanded', 'false'),
    );

    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await globalUserEvent.click(document.body);
    await waitFor(() =>
      expect(button).toHaveAttribute('aria-expanded', 'false'),
    );
  },
);

// `@align` controls which side of the button the popover renders on.
export const Alignment = meta.story({
  args: {
    align: 'right',
    bodyText:
      'This toggletip is aligned to the right of its trigger button instead of the default bottom alignment.',
  },
});

// `@defaultOpen` only sets the initial state: the toggletip can still be
// toggled or dismissed afterwards.
export const DefaultOpen = meta.story({
  args: {
    defaultOpen: true,
  },
});

DefaultOpen.test(
  'starts open and can still be closed',
  async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Show information' });
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  },
);
