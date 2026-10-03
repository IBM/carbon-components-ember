import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import FormItem from './form-item.gts';
import FormLabel from './form-label.gts';

// FormLabel's `@id` is the `for` of its label, so it has to match the
// input's `id`; template-lint's no-duplicate-id counts `@id` as an id.
//
// Carbon React ships no FormItem stories (it's documented only as a building
// block of other controls), so these are the docs-app examples.
const meta = preview.meta({
  title: 'Components/FormItem',
  component: FormItem,
  parameters: {
    docs: {
      description: {
        component:
          '`FormItem` is a simple layout wrapper that provides consistent spacing between a form control and its label/helper text. It renders a `<div>` with the `cds--form-item` class around its contents and passes through any HTML attributes.',
      },
    },
  },
});

export const Default = meta.story({
  render: () => <template>
    <FormItem>
      <FormLabel @id="name-input">Name</FormLabel>
      {{! template-lint-disable no-duplicate-id }}
      <input id="name-input" class="cds--text-input" type="text" />
    </FormItem>
  </template>,
});

export const CustomAttributes = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Any HTML attributes, including `class`, passed to `FormItem` are applied to the rendered `<div>`.',
      },
    },
  },
  render: () => <template>
    <FormItem class="custom-form-item" data-test-form-item>
      <FormLabel @id="email-input">Email</FormLabel>
      {{! template-lint-disable no-duplicate-id }}
      <input id="email-input" class="cds--text-input" type="email" />
    </FormItem>
  </template>,
});

CustomAttributes.test(
  'passes attributes through to the wrapper',
  async ({ canvasElement }) => {
    const item = canvasElement.querySelector('[data-test-form-item]');
    await expect(item).toHaveClass('cds--form-item', 'custom-form-item');
  },
);
