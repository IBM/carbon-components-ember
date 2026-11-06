import Component from '@glimmer/component';
import { service } from '@ember/service';
import { expect } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Layer from './layer.gts';
import Stack from './stack.gts';
import Theme from './theme.gts';

import type { TOC } from '@ember/component/template-only';
import type ThemeService from '../services/theme.ts';
import type { CarbonTheme } from '../utils/theme.ts';
import '#storybook/styles/theme.css';

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

// Carbon React's `ThemeText`, given what `useTheme` returns.
const ThemeText: TOC<{
  Args: { theme: CarbonTheme; isDark: boolean };
  Blocks: { default: [] };
}> = <template>
  <p>{{yield}}
    useTheme reveals... { theme: '{{@theme}}', isDark: '{{@isDark}}'}</p>
</template>;

// `useTheme` outside a `Theme`: the app's theme, from the service.
class GlobalThemeText extends Component {
  @service('carbon.theme') declare globalTheme: ThemeService;

  <template>
    <ThemeText
      @isDark={{this.globalTheme.isDark}}
      @theme={{this.globalTheme.theme}}
    />
  </template>
}

// Carbon React's `usePrefersDarkScheme` story: four themes, chosen by the
// system's colour scheme.
class PrefersDarkSchemeThemes extends Component {
  @service('carbon.theme') declare globalTheme: ThemeService;

  get prefersDark() {
    return this.globalTheme.prefersDarkScheme;
  }

  get themes(): Record<'theme1' | 'theme2' | 'theme3' | 'theme4', CarbonTheme> {
    const dark = this.prefersDark;
    return {
      theme1: dark ? 'g100' : 'white',
      theme2: dark ? 'white' : 'g100',
      theme3: dark ? 'g90' : 'g10',
      theme4: dark ? 'g10' : 'g90',
    };
  }

  <template>
    {{#let this.themes as |themes|}}
      <Theme @theme={{themes.theme1}} as |t|>
        <section class="theme-story__section">
          <ThemeText @isDark={{t.isDark}} @theme={{t.theme}}>
            usePrefersDarkScheme() is '{{this.prefersDark}}'. Theme set to '{{t.theme}}'.
          </ThemeText>
        </section>
        <Theme @theme={{themes.theme2}} as |t|>
          <section class="theme-story__section">
            <ThemeText @isDark={{t.isDark}} @theme={{t.theme}}>
              usePrefersDarkScheme() is '{{this.prefersDark}}'. An alternative
              theme set of '{{t.theme}}'.
            </ThemeText>
          </section>
        </Theme>
        <Theme @theme={{themes.theme3}} as |t|>
          <section class="theme-story__section">
            <ThemeText @isDark={{t.isDark}} @theme={{t.theme}}>
              usePrefersDarkScheme() is '{{this.prefersDark}}'. Theme set to '{{t.theme}}'.
            </ThemeText>
          </section>
        </Theme>
        <Theme @theme={{themes.theme4}} as |t|>
          <section class="theme-story__section">
            <ThemeText @isDark={{t.isDark}} @theme={{t.theme}}>
              usePrefersDarkScheme() is '{{this.prefersDark}}'. An alternative
              theme set of '{{t.theme}}'.
            </ThemeText>
          </section>
        </Theme>
      </Theme>
    {{/let}}
  </template>
}

const meta = preview.meta({
  title: 'Components/Theme',
  component: Theme,
  parameters: {
    docs: {
      description: {
        component: `The Theme component applies one of the Carbon themes (\`white\`, \`g10\`, \`g90\`, \`g100\`) to a section of your page. It renders a wrapper element with the corresponding Carbon zone class, which re-emits the theme's CSS custom properties scoped to that element — everything inside picks up the selected theme's tokens. Without \`@theme\` it keeps the theme around it.

The app's own theme, Carbon React's \`GlobalTheme\`, is the \`carbon.theme\` service. Carbon defines its tokens only under a theme's class, so set the service's \`theme\` when the app starts, in the application route: it puts that class on \`<html>\`, and moves it when the theme changes. \`followSystemScheme({ light: 'white', dark: 'g100' })\` follows the system's colour scheme until a theme is set, and \`prefersDarkScheme\` is React's \`usePrefersDarkScheme\`.

The block receives \`theme\` and \`isDark\`, like React's \`useTheme\` hook; outside a \`Theme\`, the service has them. (These stories' app theme is the toolbar's.)`,
      },
    },
  },
  args: {
    theme: 'g10',
  },
  render: () => <template>
    {{#each THEMES as |theme|}}
      <Theme @theme={{theme}}>
        <section class="theme-story__section">{{theme}}</section>
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
          "A `Theme`'s block receives its `theme` and `isDark`, like React's `useTheme` hook; outside a `Theme`, the `carbon.theme` service has the app's.",
      },
    },
  },
  render: () => <template>
    <div>
      <section class="theme-story__section">
        <GlobalThemeText />
      </section>
      <Theme @theme="g100" as |t|>
        <section class="theme-story__section">
          <ThemeText @isDark={{t.isDark}} @theme={{t.theme}} />
        </section>
      </Theme>
    </div>
  </template>,
});

UseTheme.test("reveals the app's theme and a zone's", async ({ canvas }) => {
  await expect(
    canvas.getByText("useTheme reveals... { theme: 'white', isDark: 'false'}"),
  ).toBeInTheDocument();
  await expect(
    canvas.getByText("useTheme reveals... { theme: 'g100', isDark: 'true'}"),
  ).toBeInTheDocument();
});

export const UsePrefersDarkScheme = meta.story({
  name: 'usePrefersDarkScheme',
  parameters: {
    docs: {
      description: {
        story:
          "The `carbon.theme` service's `prefersDarkScheme` follows the system's colour scheme, like React's `usePrefersDarkScheme` hook; these themes follow it.",
      },
    },
  },
  render: () => <template><PrefersDarkSchemeThemes /></template>,
});

UsePrefersDarkScheme.test(
  "picks the themes from the system's colour scheme",
  async ({ canvas }) => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    await expect(
      canvas.getByText(
        `usePrefersDarkScheme() is '${dark}'. Theme set to '${dark ? 'g100' : 'white'}'.`,
        { exact: false },
      ),
    ).toBeInTheDocument();
  },
);

export const WithLayer = meta.story({
  render: () => <template>
    <Stack @gap={{7}}>
      {{#each THEMES as |theme|}}
        <Theme @theme={{theme}}>
          <article class="theme-story__section">
            <header class="theme-story__header">{{theme}} theme</header>
            <WithLayerTemplate>
              <div class="theme-story__layer-content">Content</div>
            </WithLayerTemplate>
          </article>
        </Theme>
      {{/each}}
    </Stack>
  </template>,
});
