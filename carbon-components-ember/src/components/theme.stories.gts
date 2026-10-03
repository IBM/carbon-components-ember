import { htmlSafe } from '@ember/template';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import Stack from './stack.gts';
import Theme from './theme.gts';

import type { TOC } from '@ember/component/template-only';

// Carbon React parity gaps:
// - `usePrefersDarkScheme`: Ember has no `usePrefersDarkScheme()` hook.
// - `useTheme` outside of a `<Theme>`: Ember has no ambient theme context
//   (the global theme comes from Carbon's theme classes, here the toolbar's
//   theme switcher), so only content inside a `<Theme>` can read its theme.
//   The story's first section uses a `<Theme>` with the `theme` arg instead.
// - React's `GlobalTheme` subcomponent has no Ember equivalent.

// Carbon React's `Theme-story.scss` classes.
const sectionStyle = htmlSafe(
  'padding: 1rem; background: var(--cds-background); color: var(--cds-text-primary);',
);
const headerStyle = htmlSafe('margin-block-end: 1rem;');
const layerContentStyle = htmlSafe(
  'padding: 1rem; background: var(--cds-layer); color: var(--cds-text-primary);',
);

const THEMES = ['white', 'g10', 'g90', 'g100'] as const;

// Carbon React's `WithLayer` storybook template: the content on the
// background, then on two nested layers.
const WithLayerTemplate: TOC<{ Blocks: { default: [] } }> = <template>
  {{yield}}
  <Layer @withBackground={{true}} as |L|>
    {{yield}}
    <L @withBackground={{true}}>
      {{yield}}
    </L>
  </Layer>
</template>;

const meta = preview.meta({
  title: 'Components/Theme',
  component: Theme,
  parameters: {
    docs: {
      description: {
        component: `The Theme component applies one of the Carbon themes (\`white\`, \`g10\`, \`g90\`, \`g100\`) to a section of your page. It renders a wrapper element with the corresponding Carbon zone class, which re-emits the theme's CSS custom properties scoped to that element — everything inside picks up the selected theme's tokens.

The block receives \`theme\` and \`isDark\` so nested content can react to the active theme, mirroring React's \`useTheme\` hook. (The page-wide theme of these stories comes from the toolbar's theme switcher.)`,
      },
    },
  },
  args: {
    theme: 'g10',
  },
  render: () => <template>
    {{#each THEMES as |theme|}}
      <Theme @theme={{theme}}>
        <section style={{sectionStyle}}>{{theme}}</section>
      </Theme>
    {{/each}}
  </template>,
});

export const Default = meta.story();

Default.test('applies the theme zone classes', async ({ canvas }) => {
  for (const theme of THEMES) {
    await expect(canvas.getByText(theme).parentElement).toHaveClass(
      `cds--${theme}`,
    );
  }
});

export const UseTheme = meta.story({
  name: 'useTheme',
  parameters: {
    docs: {
      description: {
        story:
          "The block's `theme` and `isDark` reveal the active theme, like React's `useTheme` hook.",
      },
    },
  },
  render: (args) => <template>
    <div>
      <Theme @theme={{args.theme}} as |ctx|>
        <section style={{sectionStyle}}>
          <p>
            useTheme reveals... { theme: '{{ctx.theme}}', isDark: '{{ctx.isDark}}'}
          </p>
        </section>
      </Theme>
      <Theme @theme="g100" as |ctx|>
        <section style={{sectionStyle}}>
          <p>
            useTheme reveals... { theme: '{{ctx.theme}}', isDark: '{{ctx.isDark}}'}
          </p>
        </section>
      </Theme>
    </div>
  </template>,
});

UseTheme.test('yields the active theme', async ({ canvas }) => {
  await expect(
    canvas.getByText("useTheme reveals... { theme: 'g10', isDark: 'false'}"),
  ).toBeInTheDocument();
  await expect(
    canvas.getByText("useTheme reveals... { theme: 'g100', isDark: 'true'}"),
  ).toBeInTheDocument();
});

export const WithLayer = meta.story({
  render: () => <template>
    <Stack @gap={{7}}>
      {{#each THEMES as |theme|}}
        <Theme @theme={{theme}}>
          <article style={{sectionStyle}}>
            <header style={{headerStyle}}>{{theme}} theme</header>
            <WithLayerTemplate>
              <div style={{layerContentStyle}}>Content</div>
            </WithLayerTemplate>
          </article>
        </Theme>
      {{/each}}
    </Stack>
  </template>,
});
