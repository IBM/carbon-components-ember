import { trackedObject } from '@ember/reactive/collections';
import { expect, fn, waitFor, within } from 'storybook/test';

import { ExplainedLabel } from '#storybook/fixtures/ai-label.gts';
import preview from '#storybook/preview.ts';
import Button from './button.gts';
import Checkbox from './checkbox.gts';
import ComboBox from './combo-box.gts';
import ComposedModal from './composed-modal.gts';
import DatePicker from './date-picker.gts';
import DatePickerSkeleton from './date-picker-skeleton.gts';
import Dropdown from './dropdown.gts';
import DropdownSkeleton from './dropdown-skeleton.gts';
import FileUploader from './file-uploader.gts';
import FilterableMultiSelect from './filterable-multi-select.gts';
import Form from './form.gts';
import FormGroup from './form-group.gts';
import MultiSelect from './multi-select.gts';
import NumberInput from './number-input.gts';
import NumberInputSkeleton from './number-input-skeleton.gts';
import PasswordInput from './password-input.gts';
import RadioButtonGroup from './radio-button/radio-button-group.gts';
import Search from './search.gts';
import SearchSkeleton from './search-skeleton.gts';
import Select from './select.gts';
import SelectSkeleton from './select-skeleton.gts';
import Stack from './stack.gts';
import TextArea from './text-area.gts';
import TextAreaSkeleton from './text-area-skeleton.gts';
import TextInput from './text-input.gts';
import TextInputSkeleton from './text-input-skeleton.gts';
import '#storybook/styles/form.css';

import type { TOC } from '@ember/component/template-only';
import type { WithBoundArgs } from '@glint/template';
import type AILabel from './ai-label.gts';

type Size = 'xs' | 'sm' | 'md' | 'lg';

type StoryArgs = {
  className?: string;
  skeleton?: boolean;
  showInModal?: boolean;
  size?: Size;
  aiLabel?: boolean;
  revertActive?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  invalidText?: string;
  warn?: boolean;
  warnText?: string;
  onSubmit?: (event: SubmitEvent) => void;
};

// Mirrors Carbon React's `Components/Form` stories (`Default`, `With AI
// Label`) and their demo form. Parity gaps:
// - TextInput has no `xs` size, so `xs` gives it `sm`. React gives it `xs`;
//   the list boxes get `sm`, as in React.
// - RadioButtonGroup has no `helperText`, so "Who can see and access this
//   project." is left out.
// - React's `role="button"` on the FileUploader's root is left out (see below).
// - React's `AILabel` in `Dropdown` etc. uses `align="bottom-left"`; it's
//   `bottom-start` here, the same placement.

const ITEMS = [
  {
    id: 'option-0',
    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
  },
  { id: 'option-1', text: 'Option 1' },
  { id: 'option-2', text: 'Option 2' },
  { id: 'option-3', text: 'Option 3 - a disabled item', disabled: true },
  { id: 'option-4', text: 'Option 4' },
  { id: 'option-5', text: 'Option 5' },
];

const ACCEPT = ['.pdf', '.png', '.jpg', '.fig', '.sketch'];
const noop = () => {};

const WORKSPACE = ITEMS[1];
const PROJECT_TYPE = ITEMS[2];

const itemText = (item: { text: string } | null | undefined) =>
  item ? item.text : '';

const PASSWORD_PATTERN = '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}';
const PASSWORD_INVALID_TEXT =
  'Your password must be at least 6 characters as well as contain at least one uppercase, one lowercase, and one number.';

// React clamps `xs`, which only TextInput, Select and Search have, to `sm`.
const listBoxSize = (size?: Size) => (size === 'xs' ? 'sm' : size);
// TextInput has no `xs` here yet.
const inputSize = listBoxSize;

// The AI label React's demo attaches to every control.
const DecoratorLabel: TOC<{
  Args: {
    AILabel: WithBoundArgs<typeof AILabel, 'size'>;
    revertActive?: boolean;
  };
}> = <template>
  <@AILabel @align="bottom-start" @revertActive={{@revertActive}} as |label|>
    <ExplainedLabel @label={{label}} />
  </@AILabel>
</template>;

// The form's controls, as React's `FormDemo` renders them. A control gets
// `<:decorator>` only while `@aiLabel` is on, so none leaves room for a label
// that isn't there.
const Fields: TOC<{
  Args: { args: StoryArgs; closeModal?: () => void };
}> = <template>
  {{#let (listBoxSize @args.size) (inputSize @args.size) as |lbSize inSize|}}
    <Stack @gap={{5}}>
      <Search
        @id="search-members"
        @labelText="Search members"
        @placeholder="e.g. Jane Smith"
        @size={{@args.size}}
        @disabled={{@args.disabled}}
      />

      <div class="form-story__row">
        <div class="form-story__col">
          {{#if @args.aiLabel}}
            <TextInput
              @id="project-name"
              @labelText="Project name"
              @helperText="Short, descriptive project name."
              @placeholder="e.g. Carbon Design System"
              @size={{inSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            >
              <:decorator as |AILabel|>
                <DecoratorLabel
                  @AILabel={{AILabel}}
                  @revertActive={{@args.revertActive}}
                />
              </:decorator>
            </TextInput>
          {{else}}
            <TextInput
              @id="project-name"
              @labelText="Project name"
              @helperText="Short, descriptive project name."
              @placeholder="e.g. Carbon Design System"
              @size={{inSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            />
          {{/if}}
        </div>
        <div class="form-story__col">
          {{#if @args.aiLabel}}
            <TextInput
              @id="project-id"
              @labelText="Project ID"
              @helperText="Lowercase letters, numbers, hyphens only."
              @placeholder="e.g. carbon-design-system"
              @size={{inSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            >
              <:decorator as |AILabel|>
                <DecoratorLabel
                  @AILabel={{AILabel}}
                  @revertActive={{@args.revertActive}}
                />
              </:decorator>
            </TextInput>
          {{else}}
            <TextInput
              @id="project-id"
              @labelText="Project ID"
              @helperText="Lowercase letters, numbers, hyphens only."
              @placeholder="e.g. carbon-design-system"
              @size={{inSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            />
          {{/if}}
        </div>
      </div>

      <div class="form-story__row">
        <div class="form-story__col">
          {{#if @args.aiLabel}}
            <Dropdown
              @id="workspace"
              @titleText="Workspace"
              @helperText="Workspace this project belongs to."
              @initialSelectedItem={{WORKSPACE}}
              @label="Select workspace"
              @items={{ITEMS}}
              @itemToString={{itemText}}
              @size={{lbSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            >
              <:decorator as |AILabel|>
                <DecoratorLabel
                  @AILabel={{AILabel}}
                  @revertActive={{@args.revertActive}}
                />
              </:decorator>
            </Dropdown>
          {{else}}
            <Dropdown
              @id="workspace"
              @titleText="Workspace"
              @helperText="Workspace this project belongs to."
              @initialSelectedItem={{WORKSPACE}}
              @label="Select workspace"
              @items={{ITEMS}}
              @itemToString={{itemText}}
              @size={{lbSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            />
          {{/if}}
        </div>
        <div class="form-story__col">
          {{#if @args.aiLabel}}
            <ComboBox
              @id="project-lead"
              @items={{ITEMS}}
              @itemToString={{itemText}}
              @titleText="Project lead"
              @helperText="Start typing to find a team member."
              @placeholder="Search members..."
              @size={{lbSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            >
              <:decorator as |AILabel|>
                <DecoratorLabel
                  @AILabel={{AILabel}}
                  @revertActive={{@args.revertActive}}
                />
              </:decorator>
            </ComboBox>
          {{else}}
            <ComboBox
              @id="project-lead"
              @items={{ITEMS}}
              @itemToString={{itemText}}
              @titleText="Project lead"
              @helperText="Start typing to find a team member."
              @placeholder="Search members..."
              @size={{lbSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            />
          {{/if}}
        </div>
      </div>

      {{#if @args.aiLabel}}
        <MultiSelect
          @id="team-members"
          @titleText="Team members"
          @label="Select members"
          @helperText="Everyone who will have access."
          @items={{ITEMS}}
          @itemToString={{itemText}}
          @selectionFeedback="top-after-reopen"
          @size={{lbSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        >
          <:decorator as |AILabel|>
            <DecoratorLabel
              @AILabel={{AILabel}}
              @revertActive={{@args.revertActive}}
            />
          </:decorator>
        </MultiSelect>
      {{else}}
        <MultiSelect
          @id="team-members"
          @titleText="Team members"
          @label="Select members"
          @helperText="Everyone who will have access."
          @items={{ITEMS}}
          @itemToString={{itemText}}
          @selectionFeedback="top-after-reopen"
          @size={{lbSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        />
      {{/if}}

      <div class="form-story__row form-story__row--dates">
        <div class="form-story__date-range">
          <DatePicker
            @datePickerType="range"
            @readOnly={{@args.readOnly}}
            as |Input|
          >
            {{#if @args.aiLabel}}
              <Input
                @id="start-date"
                @placeholder="mm/dd/yyyy"
                @labelText="Start date"
                @helperText="Active work begins."
                @size={{inSize}}
                @disabled={{@args.disabled}}
                @invalid={{@args.invalid}}
                @invalidText={{@args.invalidText}}
                @warn={{@args.warn}}
                @warnText={{@args.warnText}}
              >
                <:decorator as |AILabel|>
                  <DecoratorLabel
                    @AILabel={{AILabel}}
                    @revertActive={{@args.revertActive}}
                  />
                </:decorator>
              </Input>
              <Input
                @id="end-date"
                @placeholder="mm/dd/yyyy"
                @labelText="End date"
                @helperText="Active work ends."
                @size={{inSize}}
                @disabled={{@args.disabled}}
                @invalid={{@args.invalid}}
                @invalidText={{@args.invalidText}}
                @warn={{@args.warn}}
                @warnText={{@args.warnText}}
              >
                <:decorator as |AILabel|>
                  <DecoratorLabel
                    @AILabel={{AILabel}}
                    @revertActive={{@args.revertActive}}
                  />
                </:decorator>
              </Input>
            {{else}}
              <Input
                @id="start-date"
                @placeholder="mm/dd/yyyy"
                @labelText="Start date"
                @helperText="Active work begins."
                @size={{inSize}}
                @disabled={{@args.disabled}}
                @invalid={{@args.invalid}}
                @invalidText={{@args.invalidText}}
                @warn={{@args.warn}}
                @warnText={{@args.warnText}}
              />
              <Input
                @id="end-date"
                @placeholder="mm/dd/yyyy"
                @labelText="End date"
                @helperText="Active work ends."
                @size={{inSize}}
                @disabled={{@args.disabled}}
                @invalid={{@args.invalid}}
                @invalidText={{@args.invalidText}}
                @warn={{@args.warn}}
                @warnText={{@args.warnText}}
              />
            {{/if}}
          </DatePicker>
        </div>
        <div class="form-story__date-simple">
          <DatePicker
            @datePickerType="simple"
            @readOnly={{@args.readOnly}}
            as |Input|
          >
            {{#if @args.aiLabel}}
              <Input
                @id="deadline"
                @placeholder="mm/dd/yyyy"
                @labelText="Deadline"
                @helperText="Final delivery date."
                @size={{inSize}}
                @disabled={{@args.disabled}}
                @invalid={{@args.invalid}}
                @invalidText={{@args.invalidText}}
                @warn={{@args.warn}}
                @warnText={{@args.warnText}}
              >
                <:decorator as |AILabel|>
                  <DecoratorLabel
                    @AILabel={{AILabel}}
                    @revertActive={{@args.revertActive}}
                  />
                </:decorator>
              </Input>
            {{else}}
              <Input
                @id="deadline"
                @placeholder="mm/dd/yyyy"
                @labelText="Deadline"
                @helperText="Final delivery date."
                @size={{inSize}}
                @disabled={{@args.disabled}}
                @invalid={{@args.invalid}}
                @invalidText={{@args.invalidText}}
                @warn={{@args.warn}}
                @warnText={{@args.warnText}}
              />
            {{/if}}
          </DatePicker>
        </div>
      </div>

      <div class="form-story__row">
        <div class="form-story__col">
          {{#if @args.aiLabel}}
            <NumberInput
              @id="budget"
              @label="Budget"
              @helperText="Total allocated budget."
              @min={{0}}
              @max={{10000000}}
              @defaultValue={{5000}}
              @step={{500}}
              @iconDescription="Adjust budget"
              @size={{lbSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            >
              <:decorator as |AILabel|>
                <DecoratorLabel
                  @AILabel={{AILabel}}
                  @revertActive={{@args.revertActive}}
                />
              </:decorator>
            </NumberInput>
          {{else}}
            <NumberInput
              @id="budget"
              @label="Budget"
              @helperText="Total allocated budget."
              @min={{0}}
              @max={{10000000}}
              @defaultValue={{5000}}
              @step={{500}}
              @iconDescription="Adjust budget"
              @size={{lbSize}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            />
          {{/if}}
        </div>
        <div class="form-story__col">
          {{#if @args.aiLabel}}
            <Select
              @id="currency"
              @labelText="Currency"
              @helperText="Currency for the budget above."
              @defaultValue="usd"
              @size={{@args.size}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
            >
              <:default as |SelectItem|>
                <SelectItem @value="usd" @text="USD – US Dollar" />
                <SelectItem @value="eur" @text="EUR – Euro" />
                <SelectItem @value="gbp" @text="GBP – British Pound" />
                <SelectItem @value="jpy" @text="JPY – Japanese Yen" />
              </:default>
              <:decorator as |AILabel|>
                <DecoratorLabel
                  @AILabel={{AILabel}}
                  @revertActive={{@args.revertActive}}
                />
              </:decorator>
            </Select>
          {{else}}
            <Select
              @id="currency"
              @labelText="Currency"
              @helperText="Currency for the budget above."
              @defaultValue="usd"
              @size={{@args.size}}
              @disabled={{@args.disabled}}
              @readOnly={{@args.readOnly}}
              @invalid={{@args.invalid}}
              @invalidText={{@args.invalidText}}
              @warn={{@args.warn}}
              @warnText={{@args.warnText}}
              as |SelectItem|
            >
              <SelectItem @value="usd" @text="USD – US Dollar" />
              <SelectItem @value="eur" @text="EUR – Euro" />
              <SelectItem @value="gbp" @text="GBP – British Pound" />
              <SelectItem @value="jpy" @text="JPY – Japanese Yen" />
            </Select>
          {{/if}}
        </div>
      </div>

      <RadioButtonGroup
        @name="project-visibility"
        @defaultSelected="private"
        @legendText="Visibility"
        @disabled={{@args.disabled}}
        @readOnly={{@args.readOnly}}
        as |Radio|
      >
        <Radio
          @value="private"
          @id="vis-private"
          @labelText="Private – only invited members"
        />
        <Radio
          @value="internal"
          @id="vis-internal"
          @labelText="Internal – everyone in the org"
        />
        <Radio
          @value="public"
          @id="vis-public"
          @labelText="Public – anyone with the link"
        />
      </RadioButtonGroup>

      {{#if @args.aiLabel}}
        <Dropdown
          @id="project-type"
          @titleText="Project type"
          @helperText="Methodology used for this project."
          @initialSelectedItem={{PROJECT_TYPE}}
          @label="Select type"
          @items={{ITEMS}}
          @itemToString={{itemText}}
          @size={{lbSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        >
          <:decorator as |AILabel|>
            <DecoratorLabel
              @AILabel={{AILabel}}
              @revertActive={{@args.revertActive}}
            />
          </:decorator>
        </Dropdown>
        <FilterableMultiSelect
          @id="tags"
          @titleText="Tags"
          @helperText="Labels to categorise and filter this project."
          @placeholder="Filter"
          @items={{ITEMS}}
          @itemToString={{itemText}}
          @selectionFeedback="top-after-reopen"
          @size={{lbSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        >
          <:decorator as |AILabel|>
            <DecoratorLabel
              @AILabel={{AILabel}}
              @revertActive={{@args.revertActive}}
            />
          </:decorator>
        </FilterableMultiSelect>
      {{else}}
        <Dropdown
          @id="project-type"
          @titleText="Project type"
          @helperText="Methodology used for this project."
          @initialSelectedItem={{PROJECT_TYPE}}
          @label="Select type"
          @items={{ITEMS}}
          @itemToString={{itemText}}
          @size={{lbSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        />
        <FilterableMultiSelect
          @id="tags"
          @titleText="Tags"
          @helperText="Labels to categorise and filter this project."
          @placeholder="Filter"
          @items={{ITEMS}}
          @itemToString={{itemText}}
          @selectionFeedback="top-after-reopen"
          @size={{lbSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        />
      {{/if}}

      <FormGroup @legendText="Features">
        <Checkbox
          @id="feat-issues"
          @labelText="Issue tracking"
          @defaultChecked={{true}}
          @disabled={{@args.disabled}}
        />
        <Checkbox
          @id="feat-wiki"
          @labelText="Wiki"
          @defaultChecked={{true}}
          @disabled={{@args.disabled}}
        />
        <Checkbox
          @id="feat-ci"
          @labelText="CI / CD pipeline"
          @disabled={{@args.disabled}}
        />
        <Checkbox
          @id="feat-releases"
          @labelText="Releases"
          @disabled={{@args.disabled}}
        />
      </FormGroup>

      {{#if @args.aiLabel}}
        <TextArea
          @id="project-description"
          @labelText="Description"
          @helperText="Goals and scope of this project."
          @placeholder="What is this project about?"
          @rows={{4}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        >
          <:decorator as |AILabel|>
            <DecoratorLabel
              @AILabel={{AILabel}}
              @revertActive={{@args.revertActive}}
            />
          </:decorator>
        </TextArea>
        <TextInput
          @id="repo-url"
          @labelText="Repository URL"
          @helperText="Link to an existing Git repository."
          @placeholder="https://github.com/org/repo"
          @size={{inSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        >
          <:decorator as |AILabel|>
            <DecoratorLabel
              @AILabel={{AILabel}}
              @revertActive={{@args.revertActive}}
            />
          </:decorator>
        </TextInput>
      {{else}}
        <TextArea
          @id="project-description"
          @labelText="Description"
          @helperText="Goals and scope of this project."
          @placeholder="What is this project about?"
          @rows={{4}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        />
        <TextInput
          @id="repo-url"
          @labelText="Repository URL"
          @helperText="Link to an existing Git repository."
          @placeholder="https://github.com/org/repo"
          @size={{inSize}}
          @disabled={{@args.disabled}}
          @readOnly={{@args.readOnly}}
          @invalid={{@args.invalid}}
          @invalidText={{@args.invalidText}}
          @warn={{@args.warn}}
          @warnText={{@args.warnText}}
        />
      {{/if}}

      <PasswordInput
        @id="repo-password"
        @labelText="Password"
        @helperText="Must be at least 6 characters and include an uppercase letter, a lowercase letter, and a number."
        @placeholder="Enter password"
        @size={{@args.size}}
        @disabled={{@args.disabled}}
        @readOnly={{@args.readOnly}}
        @invalid={{@args.invalid}}
        @invalidText={{PASSWORD_INVALID_TEXT}}
        @warn={{@args.warn}}
        @warnText={{@args.warnText}}
        required
        pattern={{PASSWORD_PATTERN}}
      />

      <FormGroup @legendText="Project assets">
        <FileUploader
          @labelDescription="Max 25 MB per file."
          @buttonLabel="Add files"
          @buttonKind="primary"
          @size="md"
          @filenameStatus="edit"
          @accept={{ACCEPT}}
          @multiple={{true}}
          @disabled={{@args.disabled}}
          @iconDescription="Remove file"
          @name=""
          id="file-assets"
        />
      </FormGroup>

      <Button type="submit" {{on "click" (if @closeModal @closeModal noop)}}>
        Create project
      </Button>
    </Stack>
  {{/let}}
</template>;

// What React's demo shows in place of the controls while `skeleton` is on.
const SkeletonFields: TOC<object> = <template>
  <Stack @gap={{5}}>
    <SearchSkeleton />
    <div class="form-story__row">
      <div class="form-story__col"><TextInputSkeleton
          id="skeleton-project-name"
        /></div>
      <div class="form-story__col"><TextInputSkeleton
          id="skeleton-project-id"
        /></div>
    </div>
    <div class="form-story__row">
      <div class="form-story__col"><DropdownSkeleton /></div>
      <div class="form-story__col"><DropdownSkeleton /></div>
    </div>
    <DropdownSkeleton />
    <div class="form-story__row form-story__row--dates">
      <div class="form-story__date-range"><DatePickerSkeleton
          @range={{true}}
        /></div>
      <div class="form-story__date-simple"><DatePickerSkeleton /></div>
    </div>
    <div class="form-story__row">
      <div class="form-story__col"><NumberInputSkeleton /></div>
      <div class="form-story__col"><SelectSkeleton
          id="skeleton-currency"
        /></div>
    </div>
    <DropdownSkeleton />
    <DropdownSkeleton />
    <TextAreaSkeleton />
    <div class="form-story__row">
      <div class="form-story__col"><TextInputSkeleton
          id="skeleton-repo"
        /></div>
      <div class="form-story__col"><TextInputSkeleton
          id="skeleton-password"
        /></div>
    </div>
  </Stack>
</template>;

const renderForm = (args: StoryArgs) => {
  const state = trackedObject({ open: false });
  const open = () => {
    state.open = true;
  };
  const close = () => {
    state.open = false;
  };
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    args.onSubmit?.(event);
  };

  return <template>
    {{#if args.showInModal}}
      <Button {{on "click" open}}>Open form</Button>
      <ComposedModal
        @open={{state.open}}
        @onClose={{close}}
        as |ModalHeader ModalBody ModalFooter|
      >
        <ModalHeader @title="Create project" />
        <ModalBody @hasScrollingContent={{true}}>
          <div class="form-story__modal-body">
            <Form
              aria-label="new project setup"
              class={{args.className}}
              {{on "submit" submit}}
            >
              {{#if args.skeleton}}
                <SkeletonFields />
              {{else}}
                <Fields @args={{args}} @closeModal={{close}} />
              {{/if}}
            </Form>
          </div>
        </ModalBody>
        <ModalFooter
          @primaryButtonText="Create project"
          @secondaryButtonText="Cancel"
          @onRequestClose={{close}}
          @onRequestSubmit={{close}}
        />
      </ComposedModal>
    {{else}}
      <div class="form-story__shell">
        <Form
          aria-label="new project setup"
          class={{args.className}}
          {{on "submit" submit}}
        >
          {{#if args.skeleton}}
            <SkeletonFields />
          {{else}}
            <Fields @args={{args}} />
          {{/if}}
        </Form>
      </div>
    {{/if}}
  </template>;
};

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Components/Form',
  component: Form,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: '640px' },
      description: {
        component:
          '`Form` renders a `<form class="cds--form">` around its contents. Any attributes go to the `<form>`, so handle submission with `{{on "submit"}}` and name it with `aria-label`. Build the form from the field components, such as `TextInput` and `Select`, and group related ones in a `FormGroup`.',
      },
    },
  },
  args: {
    className: 'some-class',
    skeleton: false,
    aiLabel: false,
    revertActive: false,
    showInModal: false,
    size: 'md',
    disabled: false,
    readOnly: false,
    invalid: false,
    invalidText: 'Error message.',
    warn: false,
    warnText: 'Warning message.',
    onSubmit: fn(),
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Specify a custom className to be applied to the form',
    },
    onSubmit: { action: 'onSubmit' },
    skeleton: {
      control: 'boolean',
      description: 'Render all form inputs as skeleton loaders simultaneously',
    },
    aiLabel: {
      control: 'boolean',
      description: 'Attach an AI Label decorator to all inputs that support it',
      table: { category: 'AILabel' },
    },
    revertActive: { control: 'boolean', table: { category: 'AILabel' } },
    showInModal: {
      control: 'boolean',
      description:
        'Render the entire form inside a ComposedModal with a trigger button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description:
        'Size of all form inputs. xs is supported by TextInput, Select and Search; other components clamp to sm.',
    },
    disabled: {
      control: 'boolean',
      description: 'Specify whether the form inputs should be disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Specify whether the form inputs should be read-only',
    },
    invalid: {
      control: 'boolean',
      description: 'Specify whether the form inputs are in an invalid state',
    },
    invalidText: {
      control: 'text',
      description: 'Provide the text for the invalid state',
    },
    warn: {
      control: 'boolean',
      description: 'Specify whether the form inputs should display a warning',
    },
    warnText: {
      control: 'text',
      description: 'Provide the text for the warning state',
    },
  },
  render: renderForm,
});

export const Default = meta.story();

Default.test('renders a labelled form', async ({ canvas }) => {
  const form = canvas.getByRole('form', { name: 'new project setup' });
  await expect(form).toHaveClass('cds--form', 'some-class');
  await expect(
    canvas.getByRole('textbox', { name: 'Project name' }),
  ).toBeVisible();
});

Default.test(
  'submits through its own handler',
  async ({ args, canvas, userEvent }) => {
    // The password is required, so the browser holds back an empty form.
    await userEvent.type(canvas.getByLabelText('Password'), 'Abcdef1');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Create project' }),
    );
    await expect(args.onSubmit).toHaveBeenCalled();
  },
);

Default.test('keeps the default-checked boxes checked', async ({ canvas }) => {
  await expect(canvas.getByLabelText('Issue tracking')).toBeChecked();
  await expect(canvas.getByLabelText('CI / CD pipeline')).not.toBeChecked();
});

Default.test(
  'renders no AI label or decorator wrapper',
  async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.cds--ai-label')).toBeNull();
    await expect(
      canvasElement.querySelector('[class*="--decorator"]'),
    ).toBeNull();
  },
);

export const WithAILabel = meta.story({
  name: 'With AI Label',
  args: { aiLabel: true },
  argTypes: { size: { table: { disable: true } } },
  // React forces `md`.
  render: (args: StoryArgs) => renderForm({ ...args, size: 'md' }),
});

WithAILabel.test(
  'puts an AI label on the 14 decorated controls',
  async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('.cds--ai-label')).toHaveLength(
      14,
    );
  },
);

export const Skeleton = meta.story({
  args: { skeleton: true },
});

Skeleton.test(
  'renders the skeletons in place of the controls',
  async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('textbox')).toBeNull();
    await expect(
      canvasElement.querySelectorAll('.cds--skeleton').length,
    ).toBeGreaterThan(10);
    await expect(
      canvasElement.querySelector('#skeleton-project-name'),
    ).toBeInTheDocument();
  },
);

export const ShowInModal = meta.story({
  name: 'Show in Modal',
  args: { showInModal: true },
});

ShowInModal.test(
  'opens the form in a modal that Create project closes',
  async ({ canvas, canvasElement, userEvent }) => {
    const dialog = canvasElement.querySelector('dialog') as HTMLDialogElement;
    await expect(dialog.open).toBe(false);
    await userEvent.click(canvas.getByRole('button', { name: 'Open form' }));
    await expect(dialog.open).toBe(true);
    // The modal fades in, so wait until it shows.
    await waitFor(() =>
      expect(
        within(dialog).getByRole('textbox', { name: 'Project name' }),
      ).toBeVisible(),
    );
    await userEvent.click(
      within(dialog.querySelector('form') as HTMLFormElement).getByRole(
        'button',
        {
          name: 'Create project',
        },
      ),
    );
    await expect(dialog.open).toBe(false);
  },
);
