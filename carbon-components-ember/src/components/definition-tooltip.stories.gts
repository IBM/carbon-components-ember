import { RenderStory } from 'ember-storybook';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import DefinitionTooltip from './definition-tooltip.gts';
import { PopoverAlignments } from './popover.gts';

import type { DefinitionTooltipSignature } from './definition-tooltip.gts';
import '#storybook/styles/definition-tooltip.css';

// Parity gap with Carbon React's DefinitionTooltip stories: one `align`
// control lists the deprecated values too, where React has a second one.

const meta = preview.type<{ args: DefinitionTooltipSignature['Args'] }>().meta({
  title: 'Components/DefinitionTooltip',
  component: DefinitionTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A `DefinitionTooltip` explains a term in running text, such as an abbreviation or a date with its full timestamp. The term, the block, is underlined with dots and shows `@definition` in a tooltip on a click, on focus or, with `@openOnHover`, on hover; the `<:definition>` block takes markup instead. Attributes go on the term’s button, as in Carbon React; `@className` styles the popover around it.',
      },
    },
  },
  args: {
    align: 'bottom-start',
    defaultOpen: false,
    definition:
      'Uniform Resource Locator; the address of a resource (such as a document or website) on the Internet.',
    openOnHover: true,
  },
  argTypes: {
    align: { control: 'select', options: PopoverAlignments },
    autoAlign: { control: 'boolean' },
  },
  decorators: [
    (Story, context) => <template>
      <div class="definition-tooltip-story__frame">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

export const Default = meta.story({
  render: (args) => <template>
    <p class="definition-tooltip-story__text">
      Custom domains direct requests for your apps in this Cloud Foundry
      organization to a
      <DefinitionTooltip
        @align={{args.align}}
        @autoAlign={{args.autoAlign}}
        @defaultOpen={{args.defaultOpen}}
        @definition={{args.definition}}
        @openOnHover={{args.openOnHover}}
      >URL</DefinitionTooltip>
      that you own. A custom domain can be a shared domain, a shared subdomain,
      or a shared domain and host.
    </p>
  </template>,
});

Default.test(
  'a press shows the definition',
  async ({ canvas, canvasElement, userEvent }) => {
    const term = canvas.getByRole('button', { name: 'URL' });
    await expect(term).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(term);

    await expect(term).toHaveAttribute('aria-expanded', 'true');
    await expect(
      canvasElement.querySelector('.cds--popover-container'),
    ).toHaveClass('cds--popover--open');
  },
);

export const WithLargeText = meta.story({
  render: (args) => <template>
    <p class="definition-tooltip-story__text">
      Custom domains direct requests for your apps in this Cloud Foundry
      organization to a
      <DefinitionTooltip
        @align={{args.align}}
        @autoAlign={{args.autoAlign}}
        @defaultOpen={{args.defaultOpen}}
        @definition={{args.definition}}
        @openOnHover={{args.openOnHover}}
      >URL that you own. A custom domain can be a shared domain,</DefinitionTooltip>
      a shared subdomain, or a shared domain and host.
    </p>
  </template>,
});
