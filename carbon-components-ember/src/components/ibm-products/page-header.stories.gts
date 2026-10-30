import { fn as spy } from 'storybook/test';

import {
  BODY_TEXT,
  BeeIcon,
  BreadcrumbBeeIcon,
  LONG_TITLE,
  OverflowBreadcrumb,
  PAGE_HEADER_ARGS,
  PAGE_HEADER_ARG_TYPES,
  StoryTabs,
  StoryTallPanel,
  TAB_BAR_TAGS,
  breadcrumbPageActionItems,
  pageActionButtonItems,
  tagFor,
} from '#storybook/fixtures/page-header.gts';
import preview from '#storybook/preview.ts';
import Button from '../button.gts';
import Grid from '../grid.gts';
import Tag from '../tag.gts';
import PageHeader from './page-header.gts';

import type { PageHeaderStoryArgs } from '#storybook/fixtures/page-header.gts';
import '#storybook/styles/ibm-products/page-header.css';

// Mirrors Carbon for IBM Products' preview PageHeader stories. Parity gaps:
// - Tabs: this addon's Tabs renders its tab list with its panels, so the
//   stories show a tab list of empty tabs, with the tall page content below
//   it, where React wraps the header and its panels in one Tabs.
// - `TabBarWithTabsAndTags` has no UI Shell header above it, as React's does.
// - The tag overflow trigger is a Button: there is no OperationalTag yet.
// - The images are gradients: React's are photographs.
// - `TruncatedText` isn't ported, so the TitleBreadcrumb in `TabBarWithTabsAndTags`
//   and `Compact` is plain text, which the breadcrumb truncates itself.
// - The page actions' `pageActionButtonItems` are this file's own buttons.

type StoryArgs = PageHeaderStoryArgs & {
  onContentFullyCollapsed: (collapsed: boolean) => void;
  onTitleClipped: (clipped: boolean) => void;
  onContentActionsClipped: (clipped: boolean) => void;
};

const actions = pageActionButtonItems();
const breadcrumbActions = breadcrumbPageActionItems();

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'IBM Products/Preview/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "A page's heading, as Carbon for IBM Products' `preview__PageHeader`: breadcrumbs, title, actions and tabs that collapse and stick to the top of the page as it scrolls. Import it and its parts from `carbon-components-ember/ibm-products`. `PageHeader` yields its parts, bound to it: `BreadcrumbBar`, `BreadcrumbOverflow`, `BreadcrumbPageActions`, `Content`, `ContentPageActions`, `ContentText`, `HeroImage`, `ScrollButton`, `TabBar`, `TagOverflow` and `TitleBreadcrumb`. Where React takes a node as a prop (`contentActions`, `pageActions`, `contextualActions`, `tags`, `scroller`), a part takes a named block of that name; a block that takes a param is given the header's observer state, as React's function props are. The breadcrumb bar's `contentActions` and `pageActions` blocks also yield a `ContentPageActions` that knows it's in the bar: use it there, and it shows once the content's own actions scroll out of view. `BreadcrumbOverflow` yields a `BreadcrumbItem` and a `TitleBreadcrumb` to use for its breadcrumbs, and takes `@renderOverflowBreadcrumb`, a component that renders the breadcrumb for the hidden ones.",
      },
    },
  },
  args: {
    ...PAGE_HEADER_ARGS,
    onContentFullyCollapsed: spy(),
    onTitleClipped: spy(),
    onContentActionsClipped: spy(),
  },
  argTypes: {
    ...PAGE_HEADER_ARG_TYPES,
    onContentFullyCollapsed: { table: { category: 'story controls' } },
    onTitleClipped: { table: { category: 'story controls' } },
    onContentActionsClipped: { table: { category: 'story controls' } },
  },
  render: (args: StoryArgs) => <template>
    <PageHeader
      @fullWidthGrid={{args.fullWidthGrid}}
      @narrowGrid={{args.narrowGrid}}
      as |PageHeader|
    >
      <PageHeader.BreadcrumbBar
        @border={{args.border}}
        @pageActionsFlush={{args.pageActionsFlush}}
        @contentActionsFlush={{args.contentActionsFlush}}
        @renderIcon={{if args.renderBreadcrumbIcon BreadcrumbBeeIcon}}
      >
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem TitleBreadcrumb|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="/#">Breadcrumb 2</BreadcrumbItem>
            <BreadcrumbItem @href="/#">Breadcrumb 3</BreadcrumbItem>
            <TitleBreadcrumb data-fixed="true">{{args.title}}</TitleBreadcrumb>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:contentActions as |_state ContentPageActions|>
          <ContentPageActions @menuButtonLabel="Actions" @actions={{actions}} />
        </:contentActions>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.Content @title={{args.title}}>
        <:default>
          <PageHeader.ContentText @subtitle="Subtitle">
            {{BODY_TEXT}}
          </PageHeader.ContentText>
        </:default>
        <:pageActions>
          <PageHeader.ContentPageActions
            @menuButtonLabel="Actions"
            @actions={{actions}}
          />
        </:pageActions>
      </PageHeader.Content>
      <PageHeader.TabBar><StoryTabs /></PageHeader.TabBar>
    </PageHeader>
    <StoryTallPanel />
  </template>,
});

export const Default = meta.story({});

export const ContentWithIcon = meta.story({
  render: () => <template>
    <PageHeader as |PageHeader|>
      <PageHeader.BreadcrumbBar>
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.Content @title={{LONG_TITLE}} @renderIcon={{BeeIcon}}>
        <PageHeader.ContentText @subtitle="Subtitle">
          {{BODY_TEXT}}
        </PageHeader.ContentText>
      </PageHeader.Content>
    </PageHeader>
  </template>,
});

export const ContentWithContextualActions = meta.story({
  render: () => <template>
    <PageHeader as |PageHeader|>
      <PageHeader.BreadcrumbBar @renderIcon={{BreadcrumbBeeIcon}}>
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.Content @title={{LONG_TITLE}} @titleTruncate={{1}}>
        <:contextualActions>
          <Tag @type="blue" @size="lg">Tag</Tag>
        </:contextualActions>
        <:default>
          <PageHeader.ContentText @subtitle="Subtitle">
            {{BODY_TEXT}}
          </PageHeader.ContentText>
        </:default>
      </PageHeader.Content>
    </PageHeader>
  </template>,
});

export const ContentWithHeroImage = meta.story({
  render: () => <template>
    <PageHeader as |PageHeader|>
      <Grid @mode="css-grid" as |grid|>
        <grid.Column @lg={{8}} @md={{4}} @sm={{4}}>
          <PageHeader.BreadcrumbBar
            @border={{false}}
            @renderIcon={{BreadcrumbBeeIcon}}
          >
            <PageHeader.BreadcrumbOverflow
              @noTrailingSlash={{true}}
              @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
              as |BreadcrumbItem|
            >
              <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
              <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
            </PageHeader.BreadcrumbOverflow>
          </PageHeader.BreadcrumbBar>
          <PageHeader.Content @title={{LONG_TITLE}}>
            <PageHeader.ContentText @subtitle="Subtitle">
              {{BODY_TEXT}}
            </PageHeader.ContentText>
          </PageHeader.Content>
        </grid.Column>
        <grid.Column @lg={{8}} @md={{4}} @sm={{0}}>
          <PageHeader.HeroImage @objectFit="cover">
            <picture>
              <source
                srcset="ibm-products/page-header-2x1.svg"
                media="(min-width: 66rem)"
              />
              <source
                srcset="ibm-products/page-header-3x2.svg"
                media="(max-width: 66rem)"
              />
              <img
                class="ibm-products-page-header-story__hero"
                src="ibm-products/page-header-2x1.svg"
                alt="A gradient"
              />
            </picture>
          </PageHeader.HeroImage>
        </grid.Column>
      </Grid>
    </PageHeader>
  </template>,
});

export const ContentWithContextualActionsAndPageActions = meta.story({
  render: () => <template>
    <PageHeader as |PageHeader|>
      <PageHeader.BreadcrumbBar @renderIcon={{BreadcrumbBeeIcon}}>
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.Content @title={{LONG_TITLE}} @titleTruncate={{1}}>
        <:contextualActions>
          <Tag @type="blue" @size="lg">Tag</Tag>
        </:contextualActions>
        <:pageActions>
          <PageHeader.ContentPageActions
            @menuButtonLabel="Actions"
            @actions={{actions}}
          />
        </:pageActions>
        <:default>
          <PageHeader.ContentText @subtitle="Subtitle">
            {{BODY_TEXT}}
          </PageHeader.ContentText>
        </:default>
      </PageHeader.Content>
    </PageHeader>
  </template>,
});

export const TabBarWithTabsAndTags = meta.story({
  render: (args: StoryArgs) => <template>
    <div class="ibm-products-page-header-story__wrapper">
      <PageHeader as |PageHeader|>
        <PageHeader.BreadcrumbBar
          @border={{args.border}}
          @pageActionsFlush={{args.pageActionsFlush}}
          @contentActionsFlush={{args.contentActionsFlush}}
          @renderIcon={{if args.renderBreadcrumbIcon BreadcrumbBeeIcon}}
        >
          <:default>
            <PageHeader.BreadcrumbOverflow
              @noTrailingSlash={{true}}
              @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
              as |BreadcrumbItem TitleBreadcrumb|
            >
              <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
              <BreadcrumbItem @href="/#">Breadcrumb 2</BreadcrumbItem>
              <BreadcrumbItem @href="/#">Breadcrumb 3</BreadcrumbItem>
              <TitleBreadcrumb data-fixed="true">
                Virtual-Machine-DAL-really-long-title-example
              </TitleBreadcrumb>
            </PageHeader.BreadcrumbOverflow>
          </:default>
          <:contentActions as |_state ContentPageActions|>
            <ContentPageActions
              @menuButtonLabel="Actions"
              @actions={{actions}}
            />
          </:contentActions>
          <:pageActions>
            <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
          </:pageActions>
        </PageHeader.BreadcrumbBar>
        <PageHeader.Content @title={{args.title}}>
          <:pageActions>
            <PageHeader.ContentPageActions
              @menuButtonLabel="Actions"
              @actions={{actions}}
            />
          </:pageActions>
          <:default>
            <PageHeader.ContentText @subtitle="Subtitle">
              {{BODY_TEXT}}
            </PageHeader.ContentText>
          </:default>
        </PageHeader.Content>
        <PageHeader.TabBar>
          <:default><StoryTabs /></:default>
          <:tags>
            <PageHeader.TagOverflow>
              <:default>
                {{#each TAB_BAR_TAGS as |tag|}}
                  <Tag @id={{tag.id}} @type={{tag.type}}>{{tag.text}}</Tag>
                {{/each}}
              </:default>
              <:renderOverflowTag as |hidden toggle open triggerId|>
                <Button
                  id={{triggerId}}
                  @kind="ghost"
                  @size="sm"
                  aria-expanded={{if open "true" "false"}}
                  aria-label="Show {{hidden.length}} more tags"
                  {{on "click" toggle}}
                >+{{hidden.length}}</Button>
              </:renderOverflowTag>
              <:renderPopoverContent as |hidden|>
                {{#each hidden as |element|}}
                  {{#let (tagFor element) as |tag|}}
                    {{#if tag}}
                      <Tag @type={{tag.type}}>{{tag.text}}</Tag>
                    {{/if}}
                  {{/let}}
                {{/each}}
              </:renderPopoverContent>
            </PageHeader.TagOverflow>
          </:tags>
          <:scroller><PageHeader.ScrollButton /></:scroller>
        </PageHeader.TabBar>
      </PageHeader>
      <StoryTallPanel />
    </div>
  </template>,
});

export const Compact = meta.story({
  render: (args: StoryArgs) => <template>
    <PageHeader as |PageHeader|>
      <PageHeader.BreadcrumbBar
        @border={{args.border}}
        @pageActionsFlush={{args.pageActionsFlush}}
        @contentActionsFlush={{args.contentActionsFlush}}
        @renderIcon={{if args.renderBreadcrumbIcon BreadcrumbBeeIcon}}
      >
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem TitleBreadcrumb|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="/#">Breadcrumb 2</BreadcrumbItem>
            <BreadcrumbItem @href="/#">Breadcrumb 3</BreadcrumbItem>
            <TitleBreadcrumb data-fixed="true">
              Virtual-Machine-DAL-really-long-title-example
            </TitleBreadcrumb>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:contentActions as |_state ContentPageActions|>
          <ContentPageActions @menuButtonLabel="Actions" @actions={{actions}} />
        </:contentActions>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.TabBar>
        <:default><StoryTabs /></:default>
        <:tags>
          <PageHeader.TagOverflow>
            <:default>
              {{#each TAB_BAR_TAGS as |tag|}}
                <Tag @id={{tag.id}} @type={{tag.type}}>{{tag.text}}</Tag>
              {{/each}}
            </:default>
            <:renderOverflowTag as |hidden toggle open triggerId|>
              <Button
                id={{triggerId}}
                @kind="ghost"
                @size="sm"
                aria-expanded={{if open "true" "false"}}
                aria-label="Show {{hidden.length}} more tags"
                {{on "click" toggle}}
              >+{{hidden.length}}</Button>
            </:renderOverflowTag>
            <:renderPopoverContent as |hidden|>
              {{#each hidden as |element|}}
                {{#let (tagFor element) as |tag|}}
                  {{#if tag}}
                    <Tag @type={{tag.type}}>{{tag.text}}</Tag>
                  {{/if}}
                {{/let}}
              {{/each}}
            </:renderPopoverContent>
          </PageHeader.TagOverflow>
        </:tags>
      </PageHeader.TabBar>
    </PageHeader>
    <StoryTallPanel />
  </template>,
});

export const CustomRenderWithCallbacks = meta.story({
  render: (args: StoryArgs) => <template>
    <PageHeader
      @fullWidthGrid={{args.fullWidthGrid}}
      @narrowGrid={{args.narrowGrid}}
      @onContentFullyCollapsed={{args.onContentFullyCollapsed}}
      @onTitleClipped={{args.onTitleClipped}}
      @onContentActionsClipped={{args.onContentActionsClipped}}
      as |PageHeader|
    >
      <PageHeader.BreadcrumbBar
        @border={{args.border}}
        @contentActionsFlush={{args.contentActionsFlush}}
        @renderIcon={{if args.renderBreadcrumbIcon BreadcrumbBeeIcon}}
      >
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="#">Breadcrumb 2</BreadcrumbItem>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:contentActions as |state ContentPageActions|>
          {{#if state.contentActionsClipped}}
            <ContentPageActions
              @menuButtonLabel="Actions"
              @actions={{actions}}
            />
          {{/if}}
        </:contentActions>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.Content @title={{args.title}}>
        <:pageActions as |state|>
          {{#unless state.fullyCollapsed}}
            <PageHeader.ContentPageActions
              @menuButtonLabel="Actions"
              @actions={{actions}}
            />
          {{/unless}}
        </:pageActions>
        <:default>
          <PageHeader.ContentText @subtitle="Subtitle">
            {{BODY_TEXT}}
          </PageHeader.ContentText>
        </:default>
      </PageHeader.Content>
      <PageHeader.TabBar><StoryTabs /></PageHeader.TabBar>
    </PageHeader>
    <StoryTallPanel />
  </template>,
});

export const WithDisabledStickyTabBar = meta.story({
  render: (args: StoryArgs) => <template>
    <PageHeader
      @fullWidthGrid={{args.fullWidthGrid}}
      @narrowGrid={{args.narrowGrid}}
      as |PageHeader|
    >
      <PageHeader.BreadcrumbBar
        @border={{args.border}}
        @pageActionsFlush={{args.pageActionsFlush}}
        @contentActionsFlush={{args.contentActionsFlush}}
        @renderIcon={{if args.renderBreadcrumbIcon BreadcrumbBeeIcon}}
      >
        <:default>
          <PageHeader.BreadcrumbOverflow
            @noTrailingSlash={{true}}
            @renderOverflowBreadcrumb={{OverflowBreadcrumb}}
            as |BreadcrumbItem TitleBreadcrumb|
          >
            <BreadcrumbItem @href="/#">Breadcrumb 1</BreadcrumbItem>
            <BreadcrumbItem @href="/#">Breadcrumb 2</BreadcrumbItem>
            <BreadcrumbItem @href="/#">Breadcrumb 3</BreadcrumbItem>
            <TitleBreadcrumb data-fixed="true">{{args.title}}</TitleBreadcrumb>
          </PageHeader.BreadcrumbOverflow>
        </:default>
        <:contentActions as |_state ContentPageActions|>
          <ContentPageActions @menuButtonLabel="Actions" @actions={{actions}} />
        </:contentActions>
        <:pageActions>
          <PageHeader.BreadcrumbPageActions @actions={{breadcrumbActions}} />
        </:pageActions>
      </PageHeader.BreadcrumbBar>
      <PageHeader.Content @title={{args.title}}>
        <:pageActions>
          <PageHeader.ContentPageActions
            @menuButtonLabel="Actions"
            @actions={{actions}}
          />
        </:pageActions>
        <:default>
          <PageHeader.ContentText @subtitle="Subtitle">
            {{BODY_TEXT}}
          </PageHeader.ContentText>
        </:default>
      </PageHeader.Content>
      <PageHeader.TabBar @disableStickyTabBar={{true}}>
        <StoryTabs />
      </PageHeader.TabBar>
    </PageHeader>
    <StoryTallPanel />
  </template>,
});
