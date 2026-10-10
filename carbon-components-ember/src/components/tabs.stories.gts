import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Button from './button.gts';
import TabContent from './tab-content.gts';
import Tabs from './tabs.gts';
import TabsSkeleton from './tabs-skeleton.gts';
import Activity from './icons/activity.ts';
import CloudMonitoring from './icons/cloud-monitoring.ts';
import Dashboard from './icons/dashboard.ts';
import IbmWatsonDiscovery from './icons/ibm-watson-discovery.ts';
import Settings from './icons/settings.ts';
import Star from './icons/star.ts';
import UserAvatar from './icons/user-avatar.ts';

import type { TabsSignature } from './tabs.gts';
import type Icon from './icon.gts';

// Parity gaps with Carbon React's Tabs stories:
// - `IconOnly` / `Icon20Only` (+ their visual snapshots): no IconTab /
//   `iconSize`.
// - `Vertical`: no TabsVertical / TabListVertical.
// - No `scrollDebounceWait`, `scrollIntoView` or `left/rightOverflowButtonProps`
//   args, and the selected tab is chosen by title (`@selectedTab`) rather than
//   `selectedIndex`.
// - React's TabList/Tab/TabPanels/TabPanel split is a single TabPane here:
//   each yielded TabPane is both the tab and its panel.
// - Nothing is selected initially unless a TabPane sets `@isDefault` (React
//   selects the first tab), so the stories mark their first tab.

type TabDef = {
  title: string;
  disabled?: boolean;
  icon?: typeof Icon;
  secondaryLabel?: string;
};

type StoryArgs = TabsSignature['Args'] & { tabs: TabDef[] };

const DEFAULT_TABS: TabDef[] = [
  { title: 'Dashboard' },
  { title: 'Monitoring' },
  { title: 'Activity' },
  { title: 'Settings' },
];

const isFirst = (index: number) => index === 0;

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "`Tabs` yields a bound `TabPane` component for each tab; its block is the tab's panel. The active tab can be uncontrolled (the first enabled tab, or the one with `@isDefault`) or controlled with `@selectedTab` / `@tabSelected`.",
      },
    },
  },
  args: {
    tabs: DEFAULT_TABS,
    contained: false,
    activation: 'automatic',
    tabSelected: fn(),
  },
  argTypes: {
    activation: { control: 'select', options: ['automatic', 'manual'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args: StoryArgs) => <template>
    <Tabs
      @contained={{args.contained}}
      @size={{args.size}}
      @fullWidth={{args.fullWidth}}
      @activation={{args.activation}}
      @ariaLabel={{args.ariaLabel}}
      @tabSelected={{args.tabSelected}}
      as |TabPane|
    >
      {{#each args.tabs as |tab index|}}
        <TabPane
          @title={{tab.title}}
          @disabled={{tab.disabled}}
          @renderIcon={{tab.icon}}
          @secondaryLabel={{tab.secondaryLabel}}
          @isDefault={{isFirst index}}
        >
          Tab Panel
          {{index}}
        </TabPane>
      {{/each}}
    </Tabs>
  </template>,
});

export const Default = meta.story();

Default.test(
  'selects a tab on click and shows its panel',
  async ({ canvas, userEvent, args }) => {
    // Tabs register with Tabs on the next runloop, so wait for them.
    await expect(await canvas.findByRole('tabpanel')).toHaveTextContent(
      'Tab Panel 0',
    );
    await userEvent.click(canvas.getByRole('tab', { name: 'Monitoring' }));
    await expect(args.tabSelected).toHaveBeenCalledWith('Monitoring');
    await expect(
      canvas.getByRole('tab', { name: 'Monitoring' }),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Tab Panel 1');
  },
);

Default.test(
  'arrow keys move the selection (automatic activation)',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('tab', { name: 'Dashboard' }),
    );
    await userEvent.keyboard('{ArrowRight}');
    await expect(
      canvas.getByRole('tab', { name: 'Monitoring' }),
    ).toHaveAttribute('aria-selected', 'true');
  },
);

const ALL_TABS: TabDef[] = [
  { title: 'Dashboard' },
  { title: 'Monitoring' },
  { title: 'Activity' },
  { title: 'Analyze' },
  { title: 'Settings', disabled: true },
];

const ICON_TABS: TabDef[] = [
  { title: 'Dashboard', icon: Dashboard },
  { title: 'Monitoring', icon: CloudMonitoring },
  { title: 'Activity', icon: Activity },
  { title: 'Analyze', icon: IbmWatsonDiscovery },
  { title: 'Settings', icon: Settings, disabled: true },
];

const SECONDARY_LABEL_TABS: TabDef[] = [
  { title: 'Engage', secondaryLabel: '(21/25)' },
  { title: 'Analyze', secondaryLabel: '(12/16)' },
  { title: 'Remediate', secondaryLabel: '(0/7)' },
  { title: 'Assets', secondaryLabel: '(4/12)' },
  { title: 'Monitoring', secondaryLabel: '(0/10)', disabled: true },
];

// Tabs renders each tab's close button next to it inside role="tablist",
// as @carbon/react does (checked by the DOM-parity tests). The selected
// dismissable tab's close button is exposed to assistive technology there,
// which axe reports as a tablist owning a non-tab (aria-required-children).
// That's Carbon React's own markup, kept for parity: only that rule is off.
const DISMISSABLE_A11Y = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

// Removing a tab is up to the consumer: `@onTabCloseRequest` receives the
// closed tab's title, and the story filters it out of its list.
function dismissableRender(initial: TabDef[]) {
  return (args: StoryArgs) => {
    const state = trackedObject({ tabs: initial });
    const close = (title: string) => {
      state.tabs = state.tabs.filter((t) => t.title !== title);
      args.onTabCloseRequest?.(title);
    };
    const reset = () => {
      state.tabs = initial;
    };

    return <template>
      <Button style="margin-bottom: 3rem" @onClick={{reset}}>Reset</Button>
      <Tabs
        @dismissable={{true}}
        @contained={{args.contained}}
        @size={{args.size}}
        @onTabCloseRequest={{close}}
        as |TabPane|
      >
        {{#each state.tabs as |tab index|}}
          <TabPane
            @title={{tab.title}}
            @disabled={{tab.disabled}}
            @renderIcon={{tab.icon}}
            @isDefault={{isFirst index}}
          >
            {{tab.title}}
          </TabPane>
        {{/each}}
      </Tabs>
    </template>;
  };
}

const DISMISSABLE_TABS: TabDef[] = [
  { title: 'Dashboard' },
  { title: 'Monitoring' },
  { title: 'Activity' },
  { title: 'Settings', disabled: true },
];

export const Dismissable = meta.story({
  parameters: DISMISSABLE_A11Y,
  args: {
    onTabCloseRequest: fn(),
  },
  render: dismissableRender(DISMISSABLE_TABS),
});

Dismissable.test(
  'closing a tab removes it',
  async ({ canvas, userEvent, args }) => {
    await userEvent.click(await canvas.findByTitle('Remove Monitoring tab'));
    await expect(args.onTabCloseRequest).toHaveBeenCalledWith('Monitoring');
    await waitFor(() =>
      expect(canvas.queryByRole('tab', { name: 'Monitoring' })).toBeNull(),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(
      await canvas.findByRole('tab', { name: 'Monitoring' }),
    ).toBeInTheDocument();
  },
);

Dismissable.test(
  'Delete closes the focused tab',
  async ({ canvas, userEvent, args }) => {
    const tab = await canvas.findByRole('tab', { name: 'Monitoring' });
    tab.focus();
    await userEvent.keyboard('{Delete}');
    await expect(args.onTabCloseRequest).toHaveBeenCalledWith('Monitoring');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
  },
);

export const DismissableContained = meta.story({
  parameters: DISMISSABLE_A11Y,
  args: {
    contained: true,
    onTabCloseRequest: fn(),
  },
  render: dismissableRender(DISMISSABLE_TABS),
});

export const DismissableWithIcons = meta.story({
  parameters: DISMISSABLE_A11Y,
  args: {
    onTabCloseRequest: fn(),
  },
  render: dismissableRender([
    { title: 'Dashboard', icon: Dashboard },
    { title: 'Monitoring', icon: CloudMonitoring },
    { title: 'Activity', icon: Activity },
    { title: 'Settings', icon: Settings, disabled: true },
  ]),
});

export const WithIcons = meta.story({
  args: {
    tabs: ICON_TABS,
    activation: 'manual',
  },
});

// With manual activation the arrow keys only move focus; Enter or Space
// selects the focused tab.
export const Manual = meta.story({
  args: {
    tabs: ALL_TABS,
    activation: 'manual',
  },
});

Manual.test(
  'arrow keys move focus but Enter selects',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('tab', { name: 'Dashboard' }),
    );
    await userEvent.keyboard('{ArrowRight}');
    const monitoring = canvas.getByRole('tab', { name: 'Monitoring' });
    await expect(monitoring).toHaveFocus();
    await expect(monitoring).toHaveAttribute('aria-selected', 'false');
    await userEvent.keyboard('{Enter}');
    await expect(monitoring).toHaveAttribute('aria-selected', 'true');
  },
);

export const Contained = meta.story({
  args: {
    tabs: ALL_TABS,
    contained: true,
  },
});

export const ContainedWithIcons = meta.story({
  args: {
    tabs: ICON_TABS,
    contained: true,
  },
});

// `@secondaryLabel` (contained only) adds a subtitle to the tab.
export const ContainedWithSecondaryLabels = meta.story({
  args: {
    tabs: SECONDARY_LABEL_TABS,
    contained: true,
  },
});

export const ContainedWithSecondaryLabelsAndIcons = meta.story({
  args: {
    contained: true,
    tabs: [
      { title: 'Engage', secondaryLabel: '(21/25)', icon: Dashboard },
      { title: 'Analyze', secondaryLabel: '(12/16)', icon: CloudMonitoring },
      { title: 'Remediate', secondaryLabel: '(0/7)', icon: Activity },
      { title: 'Assets', secondaryLabel: '(4/12)', icon: IbmWatsonDiscovery },
      {
        title: 'Monitoring',
        secondaryLabel: '(0/10)',
        icon: Settings,
        disabled: true,
      },
    ],
  },
});

// `@fullWidth` (contained only) stretches the tabs to fill the available
// width in equal shares.
export const ContainedFullWidth = meta.story({
  args: {
    contained: true,
    fullWidth: true,
    tabs: [
      { title: 'TLS' },
      { title: 'Origin' },
      { title: 'Rate limiting', disabled: true },
      { title: 'WAF' },
      { title: 'IP Firewall' },
      { title: 'Firewall rules' },
      { title: 'Range' },
      { title: 'Mutual TLS' },
    ],
  },
});

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`TabsSkeleton` stands in for the component while its content loads. Its own page has controls for its arguments. `<Tabs @loading={{true}} />` renders the same placeholder.',
      },
    },
  },
  render: () => <template><TabsSkeleton /></template>,
});

// `@size` accepts `sm` and `md` for line tabs; `lg` only takes effect when
// `@contained` is set.
export const Sizes = meta.story({
  render: () => <template>
    <Tabs @size="sm" as |TabPane|>
      <TabPane @title="Tab Label 1" @isDefault={{true}}>Content 1</TabPane>
      <TabPane @title="Tab Label 2">Content 2</TabPane>
    </Tabs>
    <br />
    <Tabs @contained={{true}} @size="lg" as |TabPane|>
      <TabPane @title="Tab Label 1" @isDefault={{true}}>Content 1</TabPane>
      <TabPane @title="Tab Label 2">Content 2</TabPane>
    </Tabs>
  </template>,
});

export const WithRenderIcon = meta.story({
  name: 'With icons (renderIcon)',
  args: {
    tabs: [
      { title: 'Tab Label 1', icon: Star },
      { title: 'Tab Label 2', icon: UserAvatar },
    ],
  },
});

// Controlled: the selected tab's title lives in local state, passed back as
// `@selectedTab` and updated from `@tabSelected`.
export const Controlled = meta.story({
  render: (args: StoryArgs) => {
    const state = trackedObject({ selected: 'Tab Label 1' });
    const select = (title: string) => {
      state.selected = title;
      args.tabSelected?.(title);
    };

    return <template>
      <Tabs
        @selectedTab={{state.selected}}
        @tabSelected={{select}}
        as |TabPane|
      >
        <TabPane @title="Tab Label 1">selected: {{state.selected}}</TabPane>
        <TabPane @title="Tab Label 2" @disabled={{true}}>
          selected:
          {{state.selected}}
        </TabPane>
        <TabPane @title="Tab Label 4 with a very long long label">
          selected:
          {{state.selected}}
        </TabPane>
      </Tabs>
    </template>;
  },
});

Controlled.test(
  'reports the selection and follows @selectedTab',
  async ({ canvas, userEvent, args }) => {
    const tab = await canvas.findByRole('tab', {
      name: 'Tab Label 4 with a very long long label',
    });
    await userEvent.click(tab);
    await expect(args.tabSelected).toHaveBeenCalledWith(
      'Tab Label 4 with a very long long label',
    );
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'selected: Tab Label 4 with a very long long label',
    );
  },
);

// `TabContent` is a standalone panel for when tab selection is managed
// outside of `Tabs`, such as a custom tab list.
export const StandaloneTabContent = meta.story({
  name: 'TabContent',
  render: () => {
    const state = trackedObject({ selected: 'a' });
    const isSelected = (value: string) => state.selected === value;
    const selectA = () => {
      state.selected = 'a';
    };
    const selectB = () => {
      state.selected = 'b';
    };

    return <template>
      <Button @type="secondary" @onClick={{selectA}}>Show A</Button>
      <Button @type="secondary" @onClick={{selectB}}>Show B</Button>
      <TabContent @selected={{isSelected "a"}}>Content A</TabContent>
      <TabContent @selected={{isSelected "b"}}>Content B</TabContent>
    </template>;
  },
});

StandaloneTabContent.test(
  'shows only the selected content',
  async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Content A')).toBeVisible();
    await expect(canvas.queryByText('Content B')).not.toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show B' }));
    await expect(canvas.getByText('Content B')).toBeVisible();
    await expect(canvas.queryByText('Content A')).not.toBeVisible();
  },
);
