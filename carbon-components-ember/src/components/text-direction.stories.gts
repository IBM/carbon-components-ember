import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Text from './text.gts';
import TextDirection from './text-direction.gts';

// Carbon React parity gap (see Preview/preview_Text): Ember's TextDirection
// has no `getTextDirection` callback; it only sets a fixed or `auto` `dir`
// on its wrapper element.

const meta = preview.meta({
  title: 'Preview/preview_Text/TextDirection',
  component: TextDirection,
  parameters: {
    docs: {
      description: {
        component:
          'Sets a text direction (`@dir`: `ltr`, `rtl`, or `auto`, the default) for all of the content rendered inside of it, by wrapping it in an element (`@as`, a `div` by default) with that `dir`. Useful for a subtree of `Text` that should use a fixed or auto-detected direction.',
      },
    },
  },
  argTypes: {
    dir: { control: 'inline-radio', options: ['ltr', 'rtl', 'auto'] },
    as: { control: 'text' },
  },
  args: {
    dir: 'rtl',
  },
  render: (args) => <template>
    <TextDirection @as={{args.as}} @dir={{args.dir}}>
      <Text @as="p">
        المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل
        لتكتشف حقيقة وأساس تلك السعادة البشرية.
      </Text>
      <Text @as="p">Hello world</Text>
    </TextDirection>
  </template>,
});

export const Default = meta.story();

Default.test('sets the direction of its subtree', async ({ canvas }) => {
  const paragraph = canvas.getByText('Hello world');
  await expect(paragraph.parentElement).toHaveAttribute('dir', 'rtl');
});
