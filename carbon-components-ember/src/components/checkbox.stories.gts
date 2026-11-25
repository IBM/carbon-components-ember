import { trackedObject } from '@ember/reactive/collections';
import { expect, fn } from 'storybook/test';

import { AIExplanation } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Checkbox from './checkbox.gts';
import CheckboxGroup from './checkbox-group.gts';
import CheckboxSkeleton from './checkbox-skeleton.gts';

import type { CheckboxSignature } from './checkbox.gts';
import type { CheckboxGroupSignature } from './checkbox-group.gts';
import '#storybook/styles/checkbox.css';

// The group stories take CheckboxGroup's args, the others Checkbox's.
type StoryArgs = CheckboxSignature['Args'] &
  Partial<CheckboxGroupSignature['Args']>;

// The legend is the group's only required argument, which the Checkbox stories don't set.
const legend = (args: StoryArgs) => args.legendText ?? '';

const groupArgs = {
  disabled: false,
  helperText: 'Helper text goes here',
  invalid: false,
  invalidText: 'Invalid message goes here',
  legendText: 'Group label',
  orientation: 'vertical',
  readOnly: false,
  warn: false,
  warnText: 'Warning message goes here',
} as const;

const groupControls = {
  controls: {
    include: [
      'disabled',
      'helperText',
      'invalid',
      'invalidText',
      'legendText',
      'orientation',
      'readOnly',
      'warn',
      'warnText',
    ],
  },
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Checkbox',
  component: Checkbox,
  subcomponents: { CheckboxGroup, CheckboxSkeleton },
  parameters: {
    docs: {
      description: {
        component:
          "Checkboxes are used when there are multiple items to select in a list. Users can select zero, one, or any number of items.\n\nA `CheckboxGroup` groups them under a legend (`@legendText`), with `@helperText`, or `@invalidText` and `@warnText` for `@invalid` and `@warn`. It yields a `Checkbox` already given the group's `@invalid`, `@readOnly`, `@warn` and `@disabled`; a `Checkbox` that is passed its own keeps it, except that a disabled group's fieldset disables them all. `@orientation` is `vertical` or `horizontal`.\n\n`@onChange` receives the `change` event and `{ checked, id }`, as in Carbon React. Pass `@checked` and update it from there, or `@defaultChecked` to leave the state to the checkbox. `@helperText`, `@invalid` and `@warn` show a message under it.",
      },
    },
  },
  args: {
    labelText: 'Checkbox label',
    helperText: 'Helper text',
    invalidText: 'Invalid message goes here',
    warnText: 'Warning message goes here',
    checked: false,
    onChange: fn(),
  },
  // Keep the checked state in story-local tracked state, seeded from the
  // `checked` arg, and report every change to the `onChange` action.
  render: (args) => {
    const state = trackedObject({ checked: args.checked });
    const onChange = (
      event: Event & { target: HTMLInputElement },
      change: { checked: boolean; id: string },
    ) => {
      state.checked = change.checked;
      args.onChange?.(event, change);
    };

    return <template>
      <Checkbox
        @labelText={{args.labelText}}
        @checked={{state.checked}}
        @indeterminate={{args.indeterminate}}
        @disabled={{args.disabled}}
        @readOnly={{args.readOnly}}
        @helperText={{args.helperText}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        @hideLabel={{args.hideLabel}}
        @title={{args.title}}
        @onChange={{onChange}}
      />
    </template>;
  },
});

export const Default = meta.story({
  args: groupArgs,
  parameters: groupControls,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  render: (args) => <template>
    <CheckboxGroup
      @legendText={{legend args}}
      @orientation={{args.orientation}}
      @disabled={{args.disabled}}
      {{! React sets aria-readonly on the fieldset, which axe rejects: pass it only when on. }}
      @readOnly={{if args.readOnly true}}
      @helperText={{args.helperText}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      as |Checkbox|
    >
      <Checkbox @id="checkbox-label-1" @labelText="Checkbox label" />
      <Checkbox @id="checkbox-label-2" @labelText="Checkbox label" />
    </CheckboxGroup>
  </template>,
});

Default.test('groups the checkboxes under the legend', async ({ canvas }) => {
  await expect(
    canvas.getByRole('group', { name: 'Group label' }),
  ).toBeVisible();
  await expect(canvas.getAllByRole('checkbox')).toHaveLength(2);
});

export const Horizontal = meta.story({
  args: { ...groupArgs, orientation: 'horizontal' },
  parameters: groupControls,
  argTypes: { orientation: { table: { readonly: true } } },
  render: (args) => <template>
    <CheckboxGroup
      @legendText={{legend args}}
      @orientation={{args.orientation}}
      @disabled={{args.disabled}}
      @readOnly={{if args.readOnly true}}
      @helperText={{args.helperText}}
      @invalid={{args.invalid}}
      @invalidText={{args.invalidText}}
      @warn={{args.warn}}
      @warnText={{args.warnText}}
      as |Checkbox|
    >
      <Checkbox @id="checkbox-label-1" @labelText="Checkbox label" />
      <Checkbox @id="checkbox-label-2" @labelText="Checkbox label" />
      <Checkbox @id="checkbox-label-3" @labelText="Checkbox label" />
    </CheckboxGroup>
  </template>,
});

Horizontal.test('lays the checkboxes out in a row', async ({ canvas }) => {
  await expect(canvas.getByRole('group')).toHaveClass(
    'cds--checkbox-group--horizontal',
  );
});

export const Single = meta.story();

Single.test(
  'toggles and reports the checked state',
  async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: 'Checkbox label' });
    await expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ checked: true }),
    );

    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onChange).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ checked: false }),
    );
  },
);

export const Indeterminate = meta.story({
  args: {
    indeterminate: true,
  },
});

export const Disabled = meta.story({
  args: {
    labelText: 'disabled',
    checked: true,
    disabled: true,
  },
});

export const DisabledUnchecked = meta.story({
  args: {
    labelText: 'disabled and not checked',
    disabled: true,
  },
});

DisabledUnchecked.test('cannot be checked', async ({ canvas }) => {
  await expect(
    canvas.getByRole('checkbox', { name: 'disabled and not checked' }),
  ).toBeDisabled();
});

export const LabelInBlock = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          'Instead of `@labelText`, the label can be passed as the block, which allows markup.',
      },
    },
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ checked: args.checked });
    const onChange = (
      event: Event & { target: HTMLInputElement },
      change: { checked: boolean; id: string },
    ) => {
      state.checked = change.checked;
      args.onChange?.(event, change);
    };

    return <template>
      <Checkbox @checked={{state.checked}} @onChange={{onChange}}>
        Label in
        <strong>block</strong>
      </Checkbox>
      <p>checked: {{state.checked}}</p>
    </template>;
  },
});

LabelInBlock.test(
  'uses the block as the label',
  async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Label in block' }),
    );
    await expect(canvas.getByText('checked: true')).toBeInTheDocument();
  },
);

// Carbon React's story, with the AI label on the group, then on checkboxes.
export const WithAILabel = meta.story({
  args: { ...groupArgs, helperText: '', legendText: 'Group Label' },
  parameters: groupControls,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
  render: (args) => <template>
    <div class="checkbox-story__stack">
      <CheckboxGroup
        @legendText={{legend args}}
        @orientation={{args.orientation}}
        @disabled={{args.disabled}}
        @readOnly={{if args.readOnly true}}
        @helperText={{args.helperText}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
      >
        <:decorator as |AILabel|>
          <AILabel @align="bottom-start" as |label|>
            <label.Content><AIExplanation /></label.Content>
          </AILabel>
        </:decorator>
        <:default as |Checkbox|>
          <Checkbox @id="checkbox-label-1" @labelText="Checkbox label" />
          <Checkbox @id="checkbox-label-2" @labelText="Checkbox label" />
          <Checkbox @id="checkbox-label-3" @labelText="Checkbox label" />
        </:default>
      </CheckboxGroup>
      <CheckboxGroup
        @legendText={{legend args}}
        @orientation={{args.orientation}}
        @disabled={{args.disabled}}
        @readOnly={{if args.readOnly true}}
        @helperText={{args.helperText}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        as |Checkbox|
      >
        <Checkbox @id="checkbox-label-4" @labelText="Checkbox label">
          <:decorator as |AILabel|>
            <AILabel @align="bottom-start" as |label|>
              <label.Content><AIExplanation /></label.Content>
            </AILabel>
          </:decorator>
        </Checkbox>
        <Checkbox @id="checkbox-label-5" @labelText="Checkbox label">
          <:decorator as |AILabel|>
            <AILabel @align="bottom-start" as |label|>
              <label.Content><AIExplanation /></label.Content>
            </AILabel>
          </:decorator>
        </Checkbox>
        <Checkbox @id="checkbox-label-6" @labelText="Checkbox label" />
      </CheckboxGroup>
      <CheckboxGroup
        @legendText={{legend args}}
        @orientation={{args.orientation}}
        @disabled={{args.disabled}}
        @readOnly={{if args.readOnly true}}
        @helperText={{args.helperText}}
        @invalid={{args.invalid}}
        @invalidText={{args.invalidText}}
        @warn={{args.warn}}
        @warnText={{args.warnText}}
        as |Checkbox|
      >
        <Checkbox @id="checkbox-label-7" @labelText="Checkbox label">
          <:decorator as |AILabel|>
            <AILabel @kind="inline" @size="md" @align="bottom-start" as |label|>
              <label.Content><AIExplanation /></label.Content>
            </AILabel>
          </:decorator>
        </Checkbox>
        <Checkbox @id="checkbox-label-8" @labelText="Checkbox label">
          <:decorator as |AILabel|>
            <AILabel @kind="inline" @size="md" @align="bottom-start" as |label|>
              <label.Content><AIExplanation /></label.Content>
            </AILabel>
          </:decorator>
        </Checkbox>
        <Checkbox @id="checkbox-label-9" @labelText="Checkbox label" />
      </CheckboxGroup>
    </div>
  </template>,
});

WithAILabel.test(
  'renders the AI label on the group',
  async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '.cds--checkbox-group-inner--decorator .cds--ai-label',
      ),
    ).not.toBeNull();
  },
);

export const Skeleton = meta.story({
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`CheckboxSkeleton` stands in for the component while its content loads.',
      },
    },
  },
  render: () => <template><CheckboxSkeleton /></template>,
});
