import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';
import { on } from '@ember/modifier';
import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Download from '../icons/download.ts';
import Share from '../icons/share.ts';
import AiChatCard from './card.gts';
import AiChatCodeSnippet from './code-snippet.gts';

// Loads CodeMirror up front so Vite pre-bundles its dependencies when it
// collects this file; under vitest, discovering them mid-run from the
// component's lazy `import()` stalls the import. Apps still load it lazily.
import './-code-snippet/codemirror-runtime.ts';

import type Owner from '@ember/owner';
import type { Args as CodeSnippetArgs } from './code-snippet.gts';
import type { ToolbarAction } from './toolbar.gts';

// Mirrors `@carbon/ai-chat-components`' `Components/Code snippet` stories
// (code-snippet/__stories__/code-snippet.stories.js).
//
// Parity gaps:
// - `AiChatCodeSnippet` has no `decorator` (AI label) or `fixed-actions`
//   slots, so `WithHeaderSlotsFilled` only shows the overflowing `actions`.
// - Upstream sets `data-rounded` on the snippet inside a card; the
//   rounded-modifiers mixins aren't ported.

// upstream code-snippet/__stories__/sample-code.js
const multilineCode = `/**
 * Carbon highlight showcase: control keywords, types, literals, doc comments, and more.
 * Designers can compare against https://carbondesignsystem.com
 */
import type { PaletteDefinition } from "./tokens";
import { readFile } from "fs/promises";

/**
 * Custom decorator to exercise meta/annotation styling.
 */
function Showcase(): ClassDecorator {
  return (target) => Reflect.defineMetadata?.("showcase", true, target);
}

type Nullable<T> = T | null | undefined;

interface TokenSwatch {
  readonly name: string;
  readonly hex: string;
  emphasis?: "strong" | "emphasis" | "strikethrough";
  notes?: string;
}

enum TokenGroup {
  Keyword = "keyword",
  Variable = "variable",
  String = "string",
  Number = "number",
  Comment = "comment",
}

namespace Guides {
  export const headings = [
    "# Heading One",
    "## Heading Two",
    "### Heading Three",
    "#### Heading Four",
    "##### Heading Five",
    "###### Heading Six",
  ] as const;

  export const markdown = [
    "- Bullet item",
    "1. Ordered item",
    "---",
    "~~Strikethrough~~ remains supported.",
  ];
}

@Showcase()
export class TokenShowcase<T extends TokenSwatch> {
  static readonly version = "1.0.0";
  static readonly palette: Record<TokenGroup, string> = {
    [TokenGroup.Keyword]: "--cds-syntax-keyword",
    [TokenGroup.Variable]: "--cds-syntax-variable",
    [TokenGroup.String]: "--cds-syntax-string",
    [TokenGroup.Number]: "--cds-syntax-number",
    [TokenGroup.Comment]: "--cds-syntax-comment",
  };

  #pattern = /--cds-syntax-[a-z-]+/g;
  #cache = new Map<string, T>();
  private url = new URL("https://carbon.design/components/code-snippet");
  private pending: Nullable<Promise<void>> = null;

  constructor(private readonly theme: PaletteDefinition, private mutable = false) {
    if (mutable && theme.allowOverrides === false) {
      throw new Error("Mutable showcase requires override permission.");
    }
  }

  /* multi-line
     comment demonstrating block syntax */

  async hydrate(path: string): Promise<void> {
    const file = await readFile(path, { encoding: "utf-8" });
    const matches = file.match(this.#pattern) ?? [];
    matches.forEach((token, index) => {
      const swatch = {
        name: token,
        hex: this.theme.tokens[token] ?? "#000000",
        notes: Guides.headings[index % Guides.headings.length],
      } as T;
      this.#cache.set(token, swatch);
    });
  }

  annotate(entry: T): void {
    const local = { ...entry, local: true } as T & { local: boolean };
    this.#cache.set(entry.name, local);
  }

  resolve(name: string): Nullable<T> {
    if (!this.#cache.has(name)) {
      return null;
    }
    const result = this.#cache.get(name) ?? null;
    return result && { ...result };
  }

  renderMarkdown(): string {
    const parts = [...Guides.headings, ...Guides.markdown];
    return parts.join("\\n");
  }

  toJSON(): Record<string, unknown> {
    return {
      url: this.url.href,
      version: TokenShowcase.version,
      mutable: this.mutable,
      tokens: Array.from(this.#cache.keys()),
      palette: TokenShowcase.palette,
    };
  }

  get summary(): string {
    return "Loaded " + this.#cache.size + " tokens for " + this.theme.name +  " " + this.theme.revision;
  }
}

// trailing comment with TODO inside to exercise single-line states
`;

// upstream code-snippet.stories.js `sqlCode`
const sqlCode = `-- Order Analytics Report
-- Analyzes purchasing patterns and outstanding orders

WITH customer_orders AS (
  SELECT
    c.customer_id,
    c.customer_name,
    c.email,
    c.region,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.order_date) as last_order_date
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  WHERE o.order_status IN ('pending', 'processing', 'shipped')
    AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
  GROUP BY c.customer_id, c.customer_name, c.email, c.region
),
product_performance AS (
  SELECT
    p.product_id,
    p.product_name,
    p.category,
    COUNT(DISTINCT oi.order_id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.quantity * oi.unit_price) as total_revenue,
    AVG(oi.unit_price) as avg_selling_price
  FROM products p
  INNER JOIN order_items oi ON p.product_id = oi.product_id
  INNER JOIN orders o ON oi.order_id = o.order_id
  WHERE o.order_status != 'cancelled'
    AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
  GROUP BY p.product_id, p.product_name, p.category
),
inventory_status AS (
  SELECT
    i.product_id,
    i.warehouse_location,
    i.quantity_on_hand,
    i.reorder_level,
    i.reorder_quantity,
    CASE
      WHEN i.quantity_on_hand <= i.reorder_level THEN 'Low Stock'
      WHEN i.quantity_on_hand <= (i.reorder_level * 1.5) THEN 'Medium Stock'
      ELSE 'Adequate Stock'
    END as stock_status
  FROM inventory i
)

SELECT
  co.customer_name,
  co.email,
  co.region,
  co.total_orders,
  co.total_spent,
  co.avg_order_value,
  co.last_order_date,
  pp.product_name,
  pp.category,
  pp.times_ordered,
  pp.total_quantity_sold,
  pp.total_revenue,
  ist.warehouse_location,
  ist.quantity_on_hand,
  ist.stock_status
FROM customer_orders co
CROSS JOIN product_performance pp
LEFT JOIN inventory_status ist ON pp.product_id = ist.product_id
WHERE co.total_orders > 0
  AND pp.total_revenue > 1000
ORDER BY co.total_spent DESC, pp.total_revenue DESC
LIMIT 100;`;

const SAMPLE = `function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}
`;

const DIFF = `--- a/greet.js
+++ b/greet.js
@@ -1,3 +1,3 @@
 function greet(name) {
-  console.log('Hi ' + name);
+  console.log(\`Hello, \${name}!\`);
 }
`;

const MANY_LINES = Array.from(
  { length: 40 },
  (_, i) => `line ${i + 1} = ${i};`,
).join('\n');

type StoryArgs = CodeSnippetArgs & {
  /** Story-only: wrap the snippet in a flush `AiChatCard`. */
  useCard?: boolean;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'AI Chat/Code snippet',
  component: AiChatCodeSnippet,
  parameters: {
    // Known violations in the components (tracked as bugs):
    // - AiChatCodeSnippet: `aria-prohibited-attr` (aria-label on its
    //   role-less `.cds-aichat-snippet-container` div).
    // - Tooltip around the icon-only copy button: `aria-prohibited-attr`
    //   (aria-labelledby on its role-less trigger span) and `button-name`.
    a11y: { test: 'todo' },
    docs: {
      description: {
        component: `\`AiChatCodeSnippet\` is a CodeMirror 6 powered code display/editor: syntax
highlighting, line folding, and a collapse/expand affordance for long
snippets. Exported as \`AiChatCodeSnippet\` (an existing Carbon React
\`CodeSnippet\` already occupies the plain name). \`@code\` is the sole content
source — pass a plain string (update it however you like, e.g. token by
token while streaming a response) and the editor stays in sync via a
throttled diff, not a full reset, so scroll position and selection survive.

CodeMirror itself, and each individual language grammar, is dynamically
imported the first time a snippet actually renders — a page with no
\`AiChatCodeSnippet\` on it never downloads any of this.`,
      },
    },
  },
  args: {
    code: multilineCode,
    useCard: true,
    highlight: false,
    editable: false,
    disabled: false,
    hideCopyButton: false,
    hideLineNumbers: false,
    hideFold: false,
    maxCollapsedNumberOfRows: 15,
    showMoreText: 'Show more',
    showLessText: 'Show less',
    onChange: fn(),
  },
  render: (args: StoryArgs) => <template>
    {{#if args.useCard}}
      <AiChatCard @isFlush={{true}}>
        <:body>
          <AiChatCodeSnippet
            @code={{args.code}}
            @language={{args.language}}
            @editable={{args.editable}}
            @highlight={{args.highlight}}
            @disabled={{args.disabled}}
            @hideCopyButton={{args.hideCopyButton}}
            @hideHeader={{args.hideHeader}}
            @hideLineNumbers={{args.hideLineNumbers}}
            @hideFold={{args.hideFold}}
            @maxCollapsedNumberOfRows={{args.maxCollapsedNumberOfRows}}
            @maxExpandedNumberOfRows={{args.maxExpandedNumberOfRows}}
            @minCollapsedNumberOfRows={{args.minCollapsedNumberOfRows}}
            @minExpandedNumberOfRows={{args.minExpandedNumberOfRows}}
            @showMoreText={{args.showMoreText}}
            @showLessText={{args.showLessText}}
            @copyButtonTooltipContent={{args.copyButtonTooltipContent}}
            @actions={{args.actions}}
            @overflow={{args.overflow}}
            @onChange={{args.onChange}}
          />
        </:body>
      </AiChatCard>
    {{else}}
      <AiChatCodeSnippet
        @code={{args.code}}
        @language={{args.language}}
        @editable={{args.editable}}
        @highlight={{args.highlight}}
        @disabled={{args.disabled}}
        @hideCopyButton={{args.hideCopyButton}}
        @hideHeader={{args.hideHeader}}
        @hideLineNumbers={{args.hideLineNumbers}}
        @hideFold={{args.hideFold}}
        @maxCollapsedNumberOfRows={{args.maxCollapsedNumberOfRows}}
        @maxExpandedNumberOfRows={{args.maxExpandedNumberOfRows}}
        @minCollapsedNumberOfRows={{args.minCollapsedNumberOfRows}}
        @minExpandedNumberOfRows={{args.minExpandedNumberOfRows}}
        @showMoreText={{args.showMoreText}}
        @showLessText={{args.showLessText}}
        @copyButtonTooltipContent={{args.copyButtonTooltipContent}}
        @actions={{args.actions}}
        @overflow={{args.overflow}}
        @onChange={{args.onChange}}
      />
    {{/if}}
  </template>,
});

export const Default = meta.story();

/** Streams `multilineCode` into `@code` one character every 20ms. */
class StreamedCode extends Component<{
  Blocks: { default: [code: string, restart: () => void] };
}> {
  @tracked code = '';
  interval?: ReturnType<typeof setInterval>;

  constructor(owner: Owner, args: object) {
    super(owner, args);
    this.restart();
    registerDestructor(this, () => clearInterval(this.interval));
  }

  restart = () => {
    clearInterval(this.interval);
    let index = 0;
    this.code = '';
    this.interval = setInterval(() => {
      if (index < multilineCode.length) {
        this.code += multilineCode[index];
        index++;
      } else {
        clearInterval(this.interval);
      }
    }, 20);
  };

  <template>{{yield this.code this.restart}}</template>
}

export const Streaming = meta.story({
  args: {
    highlight: true,
  },
  render: (args: StoryArgs) => <template>
    <StreamedCode as |code restart|>
      <button
        type="button"
        class="cds--btn cds--btn--secondary cds--btn--sm"
        style="margin-block-end: 1rem;"
        {{on "click" restart}}
      >Restart Streaming</button>
      {{#if args.useCard}}
        <AiChatCard @isFlush={{true}}>
          <:body>
            <AiChatCodeSnippet
              @code={{code}}
              @language={{args.language}}
              @editable={{args.editable}}
              @highlight={{args.highlight}}
              @disabled={{args.disabled}}
              @hideCopyButton={{args.hideCopyButton}}
            />
          </:body>
        </AiChatCard>
      {{else}}
        <AiChatCodeSnippet
          @code={{code}}
          @language={{args.language}}
          @editable={{args.editable}}
          @highlight={{args.highlight}}
          @disabled={{args.disabled}}
          @hideCopyButton={{args.hideCopyButton}}
        />
      {{/if}}
    </StreamedCode>
  </template>,
});

const HEADER_ACTIONS: ToolbarAction[] = [
  { text: 'Download', icon: Download },
  { text: 'Share', icon: Share },
];

export const WithHeaderSlotsFilled = meta.story({
  args: {
    highlight: true,
    overflow: true,
    actions: HEADER_ACTIONS,
  },
});

export const FullHeightMode = meta.story({
  args: {
    code: sqlCode,
    language: 'sql',
    useCard: false,
    highlight: true,
    editable: true,
    maxCollapsedNumberOfRows: 0,
    maxExpandedNumberOfRows: 0,
  },
  decorators: [
    (Story, context) => <template>
      <div
        style="height: 500px; display: flex; flex-direction: column; border: 1px solid #ccc; padding: 1rem;"
      >
        <h3 style="margin: 0 0 1rem 0;">SQL Editor (Full-Height Mode)</h3>
        <p style="margin: 0 0 1rem 0;">
          When both max-collapsed-number-of-rows and max-expanded-number-of-rows
          are set to 0, the component fills its container's height with a
          scrollbar. Perfect for edit mode scenarios.
        </p>
        <div style="flex: 1; min-height: 0;">
          <RenderStory @story={{Story}} @args={{context.args}} />
        </div>
      </div>
    </template>,
  ],
});

export const LanguageDetection = meta.story({
  args: {
    code: SAMPLE,
    language: 'javascript',
    highlight: true,
    detectLanguage: true,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The docs-app introductory demo: a highlighted JavaScript snippet.',
      },
    },
  },
});

export const Editable = meta.story({
  args: {
    code: 'def greet(name):\n    print(f"Hello, {name}!")\n',
    editable: true,
    highlight: true,
    detectLanguage: true,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story: `Setting \`@editable={{true}}\` turns the snippet into a live editor.
\`@onChange\` fires with the new content on every edit, and language
detection re-runs as you type when no explicit \`@language\` is set.`,
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ code: args.code ?? '' });
    const onChange = (value: string) => {
      state.code = value;
      args.onChange?.(value);
    };

    return <template>
      <AiChatCodeSnippet
        @code={{state.code}}
        @editable={{args.editable}}
        @highlight={{args.highlight}}
        @detectLanguage={{args.detectLanguage}}
        @onChange={{onChange}}
      />
    </template>;
  },
});

Editable.test(
  'reports edits through @onChange',
  async ({ canvasElement, userEvent, args }) => {
    // CodeMirror is loaded lazily on first render.
    const editor = await waitFor(
      () => {
        const content = canvasElement.querySelector<HTMLElement>('.cm-content');
        if (!content) throw new Error('CodeMirror has not rendered yet');
        return content;
      },
      { timeout: 10_000 },
    );
    await userEvent.type(editor, '#done');
    await waitFor(() =>
      expect(args.onChange).toHaveBeenLastCalledWith(
        expect.stringContaining('#done'),
      ),
    );
  },
);

export const CollapsingLongSnippets = meta.story({
  args: {
    code: MANY_LINES,
    language: 'javascript',
    highlight: true,
    maxCollapsedNumberOfRows: 6,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story: `\`@maxCollapsedNumberOfRows\` (default \`15\`) caps the collapsed height; once
content exceeds it a "Show more"/"Show less" control appears.
\`@maxCollapsedNumberOfRows={{0}}\` together with \`@maxExpandedNumberOfRows={{0}}\`
switches to fill-container mode instead (see **Full Height Mode**), where the
snippet fills its host's height with its own scrollbar and no expand
affordance.`,
      },
    },
  },
});

CollapsingLongSnippets.test(
  'expands and collapses',
  async ({ canvas, userEvent }) => {
    // CodeMirror is loaded lazily on first render.
    await userEvent.click(
      await canvas.findByRole(
        'button',
        { name: /Show more/ },
        { timeout: 10_000 },
      ),
    );
    await userEvent.click(
      await canvas.findByRole('button', { name: /Show less/ }),
    );
    await expect(
      await canvas.findByRole('button', { name: /Show more/ }),
    ).toBeVisible();
  },
);

export const DiffLanguage = meta.story({
  args: {
    code: DIFF,
    language: 'diff',
    highlight: true,
    detectLanguage: true,
    useCard: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The `diff` language additionally colors inserted/deleted lines.',
      },
    },
  },
});
