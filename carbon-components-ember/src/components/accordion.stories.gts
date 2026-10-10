import { expect } from 'storybook/test';

import { withLayer } from '#storybook/decorators.gts';
import preview from '#storybook/preview.ts';
import Accordion from './accordion.gts';
import AccordionSkeleton from './accordion-skeleton.gts';

// Carbon React parity gaps (Components/Accordion):
// - `Controlled`: AccordionItem has no `onHeadingClick` callback, so the
//   open state can't be driven from outside per item.
// - Accordion has no `size`, `isFlush` or `ordered` args; AccordionItem's
//   `title` is a string only (React accepts a node) and its `isDisabled`
//   arg is accepted but not rendered.
// - Only one item can be open at a time (React lets every item toggle on
//   its own), unless `@open` opens all of them.
const meta = preview.meta({
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component:
          'An accordion component is an element that organizes content into collapsible sections, enabling users to expand or collapse them for efficient information presentation and navigation.\n\nThe yielded `Item` is already bound to its accordion: pass each one a `@title` and its content as the block.',
      },
    },
  },
  args: {
    align: 'end',
    disabled: false,
    open: false,
  },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'end'] },
  },
  render: (args) => <template>
    <Accordion
      @align={{args.align}}
      @disabled={{args.disabled}}
      @open={{args.open}}
      as |Item|
    >
      <Item @title="Choose your plan">
        <p>
          Compare plan features and select the option that best matches your
          team's expected usage.
        </p>
      </Item>
      <Item @title="Add team members">
        <p>
          Invite collaborators by email and assign their workspace roles before
          launch.
        </p>
      </Item>
      <Item @title="Set payment details">
        <p>
          Add billing information and choose whether to receive invoices by
          email.
        </p>
      </Item>
      <Item @title="Review and confirm">
        <p>
          Check your setup summary, then confirm to create the workspace for
          your team.
        </p>
      </Item>
    </Accordion>
  </template>,
});

export const Default = meta.story();

Default.test(
  'expands and collapses an item from its heading',
  async ({ canvas, userEvent }) => {
    const heading = canvas.getByRole('button', { name: 'Choose your plan' });
    await expect(heading).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(heading);
    await expect(heading).toHaveAttribute('aria-expanded', 'true');

    // Opening another item closes the first one.
    const other = canvas.getByRole('button', { name: 'Add team members' });
    await userEvent.click(other);
    await expect(other).toHaveAttribute('aria-expanded', 'true');
    await expect(heading).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(other);
    await expect(other).toHaveAttribute('aria-expanded', 'false');
  },
);

export const AlignStart = meta.story({
  args: {
    align: 'start',
  },
  parameters: {
    docs: {
      description: {
        story: '`@align="start"` puts the chevron before the title.',
      },
    },
  },
});

export const AllOpen = meta.story({
  args: {
    open: true,
  },
  parameters: {
    docs: {
      description: {
        story: '`@open={{true}}` expands every item.',
      },
    },
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});

Disabled.test('disables every heading', async ({ canvas }) => {
  for (const heading of canvas.getAllByRole('button')) {
    await expect(heading).toBeDisabled();
    await expect(heading).toHaveAttribute('aria-expanded', 'false');
  }
});

export const WithLayer = Default.extend({ decorators: [withLayer] });

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`AccordionSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments.',
      },
    },
  },
  render: () => <template>
    <div style="width: 500px">
      <AccordionSkeleton @open={{true}} @count={{4}} />
    </div>
  </template>,
});
