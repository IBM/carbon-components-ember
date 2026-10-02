import { trackedObject } from '@ember/reactive/collections';
import { fn } from 'storybook/test';

import Select from './select.gts';

import type { Meta, StoryObj } from 'ember-storybook';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Durian', 'Elderberry'];

export default {
  title: 'Components/Select',
  component: Select,
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
} satisfies Meta;

export const Single: StoryObj = {};

export const Multiple: StoryObj = {
  args: {
    multiple: true,
  },
};

export const Searchable: StoryObj = {
  args: {
    searchEnabled: true,
  },
};

export const WithHelperText: StoryObj = {
  args: {
    helperText: 'Pick the one you like best',
  },
};

export const Disabled: StoryObj = {
  args: {
    disabled: true,
  },
};
