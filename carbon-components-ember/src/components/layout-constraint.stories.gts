import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layout, { LayoutConstraint } from './layout.gts';
import TextInput from './text-input.gts';

// Carbon React has no stories of its own for LayoutConstraint: it's the
// `WithLayoutConstraint` story of Preview/preview__Layout. Here it's
// rendered inside a `Layout`, so the constraint visibly overrides the
// surrounding layout context.

const meta = preview.meta({
  title: 'Preview/preview__Layout/LayoutConstraint',
  component: LayoutConstraint,
  parameters: {
    docs: {
      description: {
        component:
          'Applies layout constraints to its children that might differ from their own preference or from the surrounding `Layout` context. The constraints for each group (`@size` and `@density`) are passed as an object with any of the keys `min`, `default` and `max`, e.g. `{{hash default="sm" min="sm" max="lg"}}`.',
      },
    },
  },
  argTypes: {
    as: { control: 'text' },
    size: { control: 'object' },
    density: { control: 'object' },
  },
  args: {
    size: { default: 'sm', min: 'sm', max: 'lg' },
  },
  render: (args) => <template>
    <Layout @size="xl">
      <TextInput @labelText="Outside of LayoutConstraint" @placeholder="xl" />
      <br />
      <LayoutConstraint
        @as={{args.as}}
        @size={{args.size}}
        @density={{args.density}}
      >
        <TextInput
          @labelText="Inside of LayoutConstraint"
          @placeholder="Placeholder"
        />
      </LayoutConstraint>
    </Layout>
  </template>,
});

export const Default = meta.story();

Default.test('applies the constraint classes', async ({ canvas }) => {
  const input = canvas.getByLabelText('Inside of LayoutConstraint');
  const constraint = input.closest('.cds--layout-constraint--size__max-lg');
  await expect(constraint).not.toBeNull();
  await expect(constraint).toHaveClass(
    'cds--layout-constraint--size__default-sm',
    'cds--layout-constraint--size__min-sm',
  );
});
