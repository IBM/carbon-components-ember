import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor, within } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Select from './select.gts';

import type { Args as SelectArgs } from './select.gts';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry'];

// Carbon React parity gaps (Components/Select): React's Select wraps a
// native `<select>` of SelectItem/SelectItemGroup options; this Select is a
// custom listbox built on ember-power-select (see `SelectItem` and
// `SelectItemGroup` for the native option elements).
// - `Default` is `Single` here; the `Inline` story is supported.
// - `Skeleton`: there is no SelectSkeleton.
// - `withAILabel`: no `decorator`/`slug` arg.
// - No `invalid`/`invalidText`, `warn`/`warnText`, `readOnly`, `size` or
//   `hideLabel`; the label is `@title` (React's `labelText`).

// Select is generic over its option type, which signature inference can't
// follow, so declare the story's args explicitly.
const meta = preview
  .type<{
    args: Omit<SelectArgs<string>, 'multiple' | 'selected' | 'onSelect'> & {
      multiple?: boolean;
      onSelect: (selected: string | string[]) => void;
    };
  }>()
  .meta({
    title: 'Components/Select',
    component: Select,
    parameters: {
      docs: {
        description: {
          component:
            "A select lets the user pick one option (or several, with `@multiple`) from a dropdown list. Select is controlled: pass `@selected` and update it from `@onSelect`. Options can be any value; the block renders each one. The dropdown renders through ember-basic-dropdown's wormhole (`#ember-basic-dropdown-wormhole`) unless `@renderInPlace` is set.",
        },
      },
    },
    args: {
      options: FRUITS,
      placeholder: 'Choose a fruit',
      title: 'Fruit',
      onSelect: fn(),
    },
    // Select is controlled: keep the selection in story-local tracked state
    // and report every change to the `onSelect` action. Its signature has
    // separate single and `@multiple` modes, so each gets its own invocation.
    render: (args) => {
      const state = trackedObject<{ one?: string; many: string[] }>({
        many: [],
      });
      const selectOne = (selected: string) => {
        state.one = selected;
        args.onSelect(selected);
      };
      const selectMany = (selected: string[]) => {
        state.many = selected;
        args.onSelect(selected);
      };

      return <template>
        {{#if args.multiple}}
          <Select
            @options={{args.options}}
            @placeholder={{args.placeholder}}
            @title={{args.title}}
            @helperText={{args.helperText}}
            @disabled={{args.disabled}}
            @inline={{args.inline}}
            @searchEnabled={{args.searchEnabled}}
            @multiple={{true}}
            @selected={{state.many}}
            @onSelect={{selectMany}}
            as |option|
          >
            {{option}}
          </Select>
        {{else}}
          <Select
            @options={{args.options}}
            @placeholder={{args.placeholder}}
            @title={{args.title}}
            @helperText={{args.helperText}}
            @disabled={{args.disabled}}
            @inline={{args.inline}}
            @searchEnabled={{args.searchEnabled}}
            @selected={{state.one}}
            @onSelect={{selectOne}}
            as |option|
          >
            {{option}}
          </Select>
        {{/if}}
      </template>;
    },
  });

// The open dropdown renders into ember-basic-dropdown's wormhole, outside
// the story's canvas.
const wormhole = () =>
  within(document.getElementById('ember-basic-dropdown-wormhole')!);

export const Single = meta.story();

Single.test('selects an option', async ({ canvasElement, userEvent, args }) => {
  const trigger = canvasElement.querySelector<HTMLElement>(
    '.ember-power-select-trigger',
  )!;
  await userEvent.click(trigger);
  await userEvent.click(await wormhole().findByText('Cherry'));
  await expect(args.onSelect).toHaveBeenCalledWith('Cherry');
  await waitFor(() => expect(trigger).toHaveTextContent('Cherry'));
});

export const Multiple = meta.story({
  args: {
    multiple: true,
  },
});

Multiple.test(
  'selects several options',
  async ({ canvasElement, userEvent, args }) => {
    const trigger = () =>
      canvasElement.querySelector<HTMLElement>('.ember-power-select-trigger')!;
    await userEvent.click(trigger());
    await userEvent.click(await wormhole().findByText('Apple'));
    await expect(args.onSelect).toHaveBeenLastCalledWith(['Apple']);
    await userEvent.click(await wormhole().findByText('Durian'));
    await expect(args.onSelect).toHaveBeenLastCalledWith(['Apple', 'Durian']);

    // Close the list: ember-storybook doesn't tear down the previous story's
    // render, so a list left open in the wormhole leaks into the next story.
    await userEvent.click(trigger());
    await waitFor(() => expect(wormhole().queryByRole('listbox')).toBeNull());
  },
);

export const Inline = meta.story({
  args: {
    inline: true,
  },
});

export const Searchable = meta.story({
  args: {
    searchEnabled: true,
  },
});

export const WithHelperText = meta.story({
  args: {
    helperText: 'Pick the one you like best',
  },
});

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
});
