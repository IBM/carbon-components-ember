import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FormLabel from './form-label.gts';
import Toggletip from './toggletip.gts';
import { Information } from '../icons.ts';

import type { FormLabelSignature } from './form-label.gts';
import type { ToggletipAlignment } from './toggletip.gts';

// Mirrors Carbon React's `Components/FormLabel` stories (`Default`,
// `WithToggletip`). `label` (the yielded text) and `align` (the Toggletip's
// alignment) are story-only args. Parity gaps: none in FormLabel itself; the
// React `WithToggletip` story's accessibility note is an
// `ActionableNotification`, which this addon doesn't have, so the note lives
// in the story description instead.
const meta = preview
  .type<{
    args: FormLabelSignature['Args'] & {
      label: string;
      align?: ToggletipAlignment;
    };
  }>()
  .meta({
    title: 'Components/FormLabel',
    component: FormLabel,
    parameters: {
      docs: {
        description: {
          component:
            '`FormLabel` renders a standalone `<label>` element styled to match the rest of the Carbon form controls. It is useful when you need a label that is not already built into a form control, such as when labeling a custom or composite widget.',
        },
      },
    },
    args: {
      label: 'Form label',
    },
    render: (args) => <template>
      <FormLabel @id={{args.id}}>{{args.label}}</FormLabel>
    </template>,
  });

export const Default = meta.story();

export const WithToggletip = meta.story({
  args: {
    label: 'Form label with Toggletip',
    align: 'bottom',
  },
  parameters: {
    docs: {
      description: {
        story:
          'It is not recommended to include interactive items, such as links or tooltips, inside a form label for accessibility reasons (see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#accessibility_concerns) and [CSS-Tricks](https://css-tricks.com/html-inputs-and-labels-a-love-story/#aa-dont-put-interactive-elements-inside-labels)). Instead, place a `Toggletip` (or `Tooltip`) as a sibling of the `FormLabel`.',
      },
    },
  },
  render: (args) => <template>
    <div style="display: flex; align-items: center; gap: 0.25rem">
      <FormLabel @id={{args.id}}>{{args.label}}</FormLabel>
      <Toggletip @align={{args.align}} as |t|>
        <t.Button @label="Show information">
          <Information />
        </t.Button>
        <t.Content>
          This can be used to provide more information about a field.
        </t.Content>
      </Toggletip>
    </div>
  </template>,
});

WithToggletip.test(
  'opens the toggletip next to the label',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show information' }),
    );
    await expect(
      canvas.getByText(
        'This can be used to provide more information about a field.',
      ),
    ).toBeVisible();
  },
);

export const AssociatedWithInput = meta.story({
  args: {
    id: 'my-input',
    label: 'Name',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pass `@id` to associate the label with a form control via the `for` attribute.',
      },
    },
  },
  // FormLabel's `@id` is the `for` of its label, so it has to match the
  // input's `id`; template-lint's no-duplicate-id counts `@id` as an id.
  render: (args) => <template>
    <FormLabel @id={{args.id}}>{{args.label}}</FormLabel>
    {{! template-lint-disable no-duplicate-id }}
    <input id={{args.id}} class="cds--text-input" type="text" />
  </template>,
});

AssociatedWithInput.test(
  'names the input it is associated with',
  async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Name' })).toBeVisible();
  },
);
