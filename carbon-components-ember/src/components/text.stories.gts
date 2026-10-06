import preview from '#storybook/preview.ts';
import LayoutDirection from './layout-direction.gts';
import Text from './text.gts';
import TextDirection from './text-direction.gts';

// Carbon React parity gaps:
// - `SetTextDirection`: Ember's TextDirection has no `getTextDirection`
//   callback, and Text doesn't read an enclosing TextDirection (it always
//   defaults to `dir="auto"`); TextDirection only sets a fixed or `auto`
//   `dir` on its wrapper. The story below shows that instead.
// - `UsageExamples`: depends on `Heading`, `ContentSwitcher`/`Switch` and
//   Dropdown's `itemToElement`, which the Ember addon doesn't have.

const meta = preview.meta({
  title: 'Preview/preview_Text',
  component: Text,
  parameters: {
    docs: {
      description: {
        component: `\`Text\` renders content wrapped in an element with the appropriate \`dir\` attribute set (\`auto\` by default), so that bidirectional text (mixing left-to-right and right-to-left scripts) is displayed and aligned correctly. Use \`@as\` to change the element (defaults to \`span\`).

\`TextDirection\` sets a text direction for all of the content rendered inside of it, which is useful for wrapping a subtree that should use a fixed or auto-detected direction.`,
      },
    },
  },
});

export const Default = meta.story({
  render: () => <template>
    <p>
      <Text>Hello world</Text>
    </p>
    <p>
      <Text>لكن لا بد أن أوضح لك أن كل</Text>
    </p>
  </template>,
});

export const LayoutAndText = meta.story({
  render: () => <template>
    <LayoutDirection @dir="ltr">
      <p>
        Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
        ratione nobis voluptatibus facilis nostrum, necessitatibus magnam Maxime
        esse consequatur nemo sit repellat Dignissimos rem nobis hic
        reprehenderit ducimus? Fuga voluptatem?
      </p>
      <LayoutDirection @dir="rtl">
        <Text @as="p">
          المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك
          التفاصيل لتكتشف حقيقة وأساس تلك السعادة البشرية، فلا أحد يرفض أو يكره
          أو يتجنب الشعور بالسعادة، ولكن بفضل هؤ.
        </Text>
      </LayoutDirection>
      <p>
        Ipsum ipsa repellat doloribus magni architecto totam Laborum maxime
        ratione nobis voluptatibus facilis nostrum, necessitatibus magnam Maxime
        esse consequatur nemo sit repellat Dignissimos rem nobis hic
        reprehenderit ducimus? Fuga voluptatem?
      </p>
    </LayoutDirection>
  </template>,
});

export const SetTextDirection = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          '`TextDirection` with a fixed `@dir` wraps a subtree in that direction.',
      },
    },
  },
  render: () => <template>
    <TextDirection @dir="rtl">
      <Text @as="p">
        المغلوطة حول استنكار النشوة وتمجيد الألم نشأت بالفعل، وسأعرض لك التفاصيل
        لتكتشف حقيقة وأساس تلك السعادة البشرية.
      </Text>
    </TextDirection>
  </template>,
});
