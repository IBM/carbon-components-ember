import { trackedObject } from '@ember/reactive/collections';
import { RenderStory } from 'ember-storybook';
import { expect, fn, waitFor } from 'storybook/test';

import preview from '#storybook/preview.ts';
import Resizer from './resizer.gts';
import DragVertical from './icons/drag-vertical.ts';

import type { ResizerSignature } from './resizer.gts';
import style from 'ember-style-modifier';
import '#storybook/styles/resizer.css';

// Mirrors Carbon React's Resizer stories (`Utilities/Resizer`). The only
// gap: `With custom handles` ports two of React's seven handle styles (the
// drag icon and a static two-line grip); the other five are CSS-only
// variations of the same idea.

type StoryArgs = ResizerSignature['Args'];

const meta = preview.type<{ args: StoryArgs }>().meta({
  title: 'Utilities/Resizer',
  component: Resizer,
  parameters: {
    docs: {
      description: {
        component:
          "A draggable (and keyboard-operable) handle placed between two sibling elements. By default `Resizer` resizes its previous and next DOM siblings directly as it's dragged; pass `@onResize` to take full control instead (for example, to drive a CSS Grid's `grid-template-columns`). Any content passed to the default block is rendered inside the handle, which is useful for a custom drag icon.\n\nDrag the handle with a mouse, or focus it and use the arrow keys (hold <kbd>Shift</kbd> for larger steps, or press <kbd>Home</kbd>/<kbd>End</kbd> to jump to a boundary). Double-clicking the handle resets the siblings to the size they had when it was inserted.\n\nBy design, the resting handle is a subtle `border-subtle`-colored 4px bar, much more visible on hover/focus (`border-interactive`). Carbon's docs suggest enhancing the trigger cue with a pseudo-element or custom children if needed; every story here widens the hit area with an invisible `::before`.",
      },
    },
  },
  args: {
    orientation: 'horizontal' as StoryArgs['orientation'],
  },
  argTypes: {
    orientation: { control: false },
  },
  decorators: [
    (Story, context) => <template>
      <div class="resizer-story">
        <RenderStory @story={{Story}} @args={{context.args}} />
      </div>
    </template>,
  ],
});

// A panel followed by a horizontal Resizer: the panel's height follows its
// content, but can be resized freely.
export const SinglePanelNoBoundaries = meta.story({
  name: 'Single panel (no boundaries)',
  render: () => <template>
    <div class="resizer-story__frame">
      <div class="resizer-story__panel" data-test-panel>
        <h5>Single panel</h5>
        <p>Drag the handle below, or focus it and use the arrow keys.</p>
      </div>
      <Resizer @orientation="horizontal" />
    </div>
  </template>,
});

SinglePanelNoBoundaries.test(
  'resizes the previous sibling with the keyboard',
  async ({ canvas, canvasElement, userEvent }) => {
    const panel =
      canvasElement.querySelector<HTMLElement>('[data-test-panel]')!;
    const before = panel.getBoundingClientRect().height;
    canvas.getByRole('separator').focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(panel.getBoundingClientRect().height).toBeCloseTo(
      before + 5,
      0,
    );
    await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}');
    await expect(panel.getBoundingClientRect().height).toBeCloseTo(
      before + 30,
      0,
    );
  },
);

// `@onResizeEnd` is called once a resize interaction ends (mouse-up, or a
// debounced moment after the last key-driven resize) with the resizer's own
// element; useful for custom accessibility announcements.
export const SinglePanelBounded = meta.story({
  name: 'Single panel (bounded)',
  args: {
    orientation: 'horizontal',
    onResizeEnd: fn(),
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ lastHeight: 'initial' });
    const announce = (
      event: MouseEvent | KeyboardEvent,
      element: HTMLDivElement,
    ) => {
      const panel = element.previousElementSibling as HTMLElement | null;
      state.lastHeight = panel?.style.height || 'initial';
      args.onResizeEnd?.(event, element);
    };

    return <template>
      <div class="resizer-story__frame-fixed">
        <div class="resizer-story__body">
          <h5>Single panel (bounded)</h5>
          <p>Constrained within a 200px-tall container.</p>
        </div>
        <Resizer @orientation="horizontal" @onResizeEnd={{announce}} />
      </div>
      <p data-test-announcement>Last announced height:
        {{state.lastHeight}}</p>
    </template>;
  },
});

SinglePanelBounded.test(
  'announces the end of a keyboard resize',
  async ({ canvas, canvasElement, userEvent, args }) => {
    canvas.getByRole('separator').focus();
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(args.onResizeEnd).toHaveBeenCalledOnce());
    await expect(
      canvasElement.querySelector('[data-test-announcement]'),
    ).not.toHaveTextContent('initial');
  },
);

// A resizer also works on an absolutely-positioned panel sliding over other
// content.
export const SinglePanelOverlay = meta.story({
  name: 'Single panel (overlay)',
  render: () => <template>
    <div class="resizer-story__overlay-host">
      <div class="resizer-story__main">
        <h5>Main content</h5>
        <p>This stays fixed in the background while the overlay panel below is
          resized from its top edge.</p>
      </div>
      <div class="resizer-story__overlay">
        <Resizer @orientation="horizontal" />
        <div class="resizer-story__overlay-body">
          <h5>Overlay panel</h5>
          <p>Resize me from the top edge.</p>
        </div>
      </div>
    </div>
  </template>,
});

// Between two stacked panels, a horizontal Resizer grows one and shrinks the
// other.
export const TwoPanelsHorizontal = meta.story({
  name: 'Two panels (horizontal)',
  render: () => <template>
    <div class="resizer-story__vertical">
      <div class="resizer-story__pane">
        <h5>Top panel</h5>
      </div>
      <Resizer @orientation="horizontal" />
      <div class="resizer-story__pane">
        <h5>Bottom panel</h5>
      </div>
    </div>
  </template>,
});

// A vertical Resizer resizes side-by-side panels horizontally, a common
// shape for navigation-plus-content or editor-plus-preview layouts.
export const TwoPanelsVertical = meta.story({
  name: 'Two panels (vertical)',
  render: () => <template>
    <div class="resizer-story__horizontal">
      <div class="resizer-story__side-pane" data-test-left>
        <h5>Left panel</h5>
      </div>
      <Resizer @orientation="vertical" />
      <div class="resizer-story__side-pane">
        <h5>Right panel</h5>
      </div>
    </div>
  </template>,
});

TwoPanelsVertical.test(
  'arrow keys resize the panels and Home collapses the first',
  async ({ canvas, canvasElement, userEvent }) => {
    const left = canvasElement.querySelector<HTMLElement>('[data-test-left]')!;
    const before = left.getBoundingClientRect().width;
    canvas.getByRole('separator').focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(left.getBoundingClientRect().width).toBeCloseTo(before + 5, 0);
    await userEvent.keyboard('{Home}');
    await expect(left.getBoundingClientRect().width).toBeLessThan(before);
  },
);

// Horizontal and vertical resizers compose; each only ever affects its own
// previous/next DOM sibling.
export const FourPanels = meta.story({
  name: 'Four panels',
  render: () => <template>
    <div class="resizer-story__split">
      <div class="resizer-story__split-column">
        <div class="resizer-story__half-panel"><h5>Top left</h5></div>
        <Resizer @orientation="horizontal" />
        <div class="resizer-story__half-panel"><h5>Bottom left</h5></div>
      </div>
      <Resizer @orientation="vertical" />
      <div class="resizer-story__split-column">
        <div class="resizer-story__half-panel"><h5>Top right</h5></div>
        <Resizer @orientation="horizontal" />
        <div class="resizer-story__half-panel"><h5>Bottom right</h5></div>
      </div>
    </div>
  </template>,
});

// Passing `@onResize` opts out of the default sibling-resizing behavior: the
// resizer becomes fully controlled and the consumer decides what a `delta`
// means. This drives a CSS Grid's `grid-template-columns`, and
// `@onDoubleClick` resets it to an even split.
export const TwoPanelsVerticalGrid = meta.story({
  name: 'Two panels vertical (grid)',
  args: {
    orientation: 'vertical',
    onResize: fn(),
    onDoubleClick: fn(),
  },
  render: (args: StoryArgs) => {
    const state = trackedObject({ fraction: 0.5 });
    const onResize = (event: MouseEvent | KeyboardEvent, delta: number) => {
      state.fraction = Math.max(
        0.1,
        Math.min(0.9, state.fraction + delta / 600),
      );
      args.onResize?.(event, delta);
    };
    const reset = (event: MouseEvent) => {
      state.fraction = 0.5;
      args.onDoubleClick?.(event);
    };
    const gridStyle = (fraction: number) => ({
      display: 'grid',
      gridTemplateColumns: `${fraction}fr auto ${1 - fraction}fr`,
      width: '100%',
      maxWidth: '600px',
      height: '200px',
    });

    return <template>
      <div {{style (gridStyle state.fraction)}} data-test-grid>
        <div class="resizer-story__grid-pane">
          <h5>Left panel</h5>
        </div>
        <Resizer
          @orientation="vertical"
          @onResize={{onResize}}
          @onDoubleClick={{reset}}
        />
        <div class="resizer-story__grid-pane">
          <h5>Right panel</h5>
        </div>
      </div>
    </template>;
  },
});

TwoPanelsVerticalGrid.test(
  'reports deltas and resets on double-click',
  async ({ canvas, canvasElement, userEvent, args }) => {
    const grid = canvasElement.querySelector<HTMLElement>('[data-test-grid]')!;
    const separator = canvas.getByRole('separator');
    separator.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onResize).toHaveBeenCalledWith(expect.anything(), 5);
    await expect(grid.style.gridTemplateColumns).not.toBe('0.5fr auto 0.5fr');
    await userEvent.dblClick(separator);
    await expect(args.onDoubleClick).toHaveBeenCalled();
    await expect(grid.style.gridTemplateColumns).toBe('0.5fr auto 0.5fr');
  },
);

// Content passed to the default block renders inside the handle.
export const WithCustomHandles = meta.story({
  name: 'With custom handles',
  render: () => <template>
    <div class="resizer-story__examples">
      <div class="resizer-story__small-frame">
        <div class="resizer-story__panel">
          <p>This panel demonstrates a custom drag handle with an icon</p>
        </div>
        <Resizer @orientation="horizontal">
          <DragVertical @size="16" @svgClass="custom-drag-handler-1" />
        </Resizer>
      </div>
      <div class="resizer-story__small-frame">
        <div class="resizer-story__panel">
          <p>This panel demonstrates a custom drag handle with static divs</p>
        </div>
        <Resizer @orientation="horizontal">
          <div class="custom-drag-handler-4">
            <div></div>
            <div></div>
          </div>
        </Resizer>
      </div>
    </div>
  </template>,
});
