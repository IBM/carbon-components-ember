import { hash } from '@ember/helper';
import { htmlSafe } from '@ember/template';

import preview from '#storybook/preview.ts';
import Accordion from './accordion.gts';
import Button from './button.gts';
import Layout, { LayoutConstraint } from './layout.gts';
import Stack from './stack.gts';
import Tag from './tag.gts';
import TextInput from './text-input.gts';

import type { TOC } from '@ember/component/template-only';

// Carbon React parity gaps: none (Carbon React's `HStack`/`VStack` in the
// demo become `Stack @orientation`).

const alignEnd = htmlSafe('display: flex; align-items: flex-end;');

// Carbon React's `Demo`: components at their default and small sizes, so the
// effect of the surrounding layout context is visible.
const Demo: TOC<{ Element: null }> = <template>
  <Stack @gap={{6}}>
    <Stack @orientation="horizontal">
      <TextInput @labelText="<TextInput />" @placeholder="Placeholder" />
      <div style={{alignEnd}}>
        <Button>&lt;Button /&gt;</Button>
      </div>
      <div style={{alignEnd}}>
        <Tag @type="gray">&lt;Tag /&gt;</Tag>
      </div>
      <TextInput
        @labelText='<TextInput size="sm" />'
        @size="sm"
        @placeholder="Placeholder"
      />
      <div style={{alignEnd}}>
        <Button @size="sm">&lt;Button size="sm" /&gt;</Button>
      </div>
      <div style={{alignEnd}}>
        <Tag @type="gray" @size="sm">&lt;Tag size="sm" /&gt;</Tag>
      </div>
    </Stack>
    <Accordion as |Item|>
      <Item @title="<AccordionItem />">Content</Item>
    </Accordion>
  </Stack>
</template>;

const meta = preview.meta({
  title: 'Preview/preview__Layout',
  component: Layout,
  subcomponents: { LayoutConstraint },
  parameters: {
    controls: { include: ['density', 'size'] },
    docs: {
      description: {
        component: `The \`Layout\` component provides a way to set layout contexts for specific parts of an application. It uses Carbon's experimental \`layout\` Sass module to control layout-related settings like size and density for all components rendered within it that support these options.

All children components that support it will react to the \`@size\` and \`@density\` you pass to \`Layout\`. Note that not all components support the entire spectrum of options available; in these cases a component will typically cap out at the maximum or minimum size it supports. If a component is outside of a layout context, or \`@size\` / \`@density\` isn't set, it falls back to its default rendering.`,
      },
    },
  },
  args: {
    density: 'normal',
    size: 'md',
  },
  argTypes: {
    density: {
      control: 'radio',
      description:
        'Specify the density of components within the layout context.',
      options: ['condensed', 'normal'],
    },
    size: {
      control: 'select',
      description: 'Specify the size of components within the layout context.',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  render: (args) => <template>
    <Stack @gap={{10}}>
      <h1>Layout demo</h1>
      <div>
        <h2>Outside of &lt;Layout&gt;</h2>
        <br />
        <Demo />
      </div>
      <div>
        <h2>Inside of &lt;Layout&gt;</h2>
        <br />
        <Layout @size={{args.size}} @density={{args.density}}>
          <Demo />
        </Layout>
      </div>
    </Stack>
  </template>,
});

export const Default = meta.story();

export const SmallCondensed = meta.story({
  args: {
    size: 'sm',
    density: 'condensed',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Components inside a `Layout` with `@size="sm"` and `@density="condensed"` render small and condensed.',
      },
    },
  },
  render: (args) => <template>
    <Layout @size={{args.size}} @density={{args.density}}>
      <TextInput @labelText="Label" @placeholder="Placeholder" />
    </Layout>
  </template>,
});

export const WithLayoutConstraint = meta.story({
  parameters: {
    controls: { include: [] },
    docs: {
      description: {
        story:
          'To apply specific constraints to children components that might differ from their own preference, use the `LayoutConstraint` utility component. The constraints for a group (`@size` and `@density`) are passed as an object with any of these keys: `min`, `default`, `max`.',
      },
    },
  },
  render: () => <template>
    <LayoutConstraint @size={{hash default="sm" min="sm" max="lg"}}>
      <TextInput @labelText="Label" @placeholder="Placeholder" />
    </LayoutConstraint>
  </template>,
});
