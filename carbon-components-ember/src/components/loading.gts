import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export interface LoadingSignature {
  Args: {
    /** Whether the spinner spins. Defaults to `true`. */
    active?: boolean;
    small?: boolean;
    /** Whether it covers the page with an overlay. Defaults to `true`. */
    withOverlay?: boolean;
    /** Its accessible name. Defaults to `'loading'`. */
    description?: string;
  };
  Element: HTMLDivElement;
}

const isModalDialog = (element: Element) => {
  if (element.matches('[aria-modal="true"]')) return true;
  if (!(element instanceof HTMLDialogElement) || !element.open) return false;
  try {
    return element.matches(':modal');
  } catch {
    return true;
  }
};

// Whether the target sits in a modal opened over the overlay.
const isLayeredOnTop = (target: EventTarget | null, overlay: HTMLElement) => {
  if (!(target instanceof Element)) return false;
  for (let el: Element | null = target; el; el = el.parentElement) {
    if (isModalDialog(el)) return !el.contains(overlay);
  }
  return false;
};

const focusWithBorrowedTabIndex = (element: HTMLElement) => {
  if (element.hasAttribute('tabindex')) {
    element.focus();
    return;
  }
  element.setAttribute('tabindex', '-1');
  element.focus();
  if (document.activeElement === element) {
    element.addEventListener(
      'blur',
      () => element.removeAttribute('tabindex'),
      { once: true },
    );
  } else {
    element.removeAttribute('tabindex');
  }
};

const restoreFocus = (
  overlay: HTMLElement,
  previouslyFocused: HTMLElement | null,
) => {
  const { activeElement } = document;
  const focusLeft =
    !activeElement ||
    activeElement === document.body ||
    overlay.contains(activeElement);
  if (!focusLeft || !previouslyFocused?.isConnected) return;
  previouslyFocused.focus();
  if (document.activeElement === previouslyFocused) return;
  const fallback = previouslyFocused.parentElement;
  if (
    !fallback ||
    fallback === document.body ||
    fallback === document.documentElement
  ) {
    return;
  }
  focusWithBorrowedTabIndex(fallback);
};

// Carbon React's useFocusTrap: keeps focus on the active overlay, unless a
// modal opens over it, and gives it back when the overlay goes.
const trapFocus = modifier((overlay: HTMLElement, [active]: [boolean]) => {
  if (!active) return;
  const previouslyFocused =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
  if (
    document.activeElement === document.body &&
    !isLayeredOnTop(previouslyFocused, overlay)
  ) {
    overlay.focus();
  }
  let reclaiming = false;
  const reclaimFocus = () => {
    if (reclaiming) return;
    reclaiming = true;
    try {
      overlay.focus();
    } finally {
      reclaiming = false;
    }
  };
  const handleFocusIn = (event: FocusEvent) => {
    const { target } = event;
    if (!(target instanceof Node) || overlay.contains(target)) return;
    if (isLayeredOnTop(target, overlay)) return;
    reclaimFocus();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    if (isLayeredOnTop(event.target, overlay)) return;
    event.preventDefault();
    reclaimFocus();
  };
  document.addEventListener('focusin', handleFocusIn, true);
  document.addEventListener('keydown', handleKeyDown, true);
  return () => {
    document.removeEventListener('focusin', handleFocusIn, true);
    document.removeEventListener('keydown', handleKeyDown, true);
    restoreFocus(overlay, previouslyFocused);
  };
});

export default class Loading extends Component<LoadingSignature> {
  get active() {
    return this.args.active ?? true;
  }

  get withOverlay() {
    return this.args.withOverlay ?? true;
  }

  get description() {
    return this.args.description ?? 'loading';
  }

  <template>
    {{#if this.withOverlay}}
      <div
        class="cds--loading-overlay
          {{unless this.active 'cds--loading-overlay--stop'}}"
        role="presentation"
      >
        <div
          role={{if this.active "dialog"}}
          aria-label={{if this.active this.description}}
          tabindex={{if this.active "-1"}}
          {{trapFocus this.active}}
        >
          <div
            aria-atomic="true"
            aria-live={{if this.active "assertive" "off"}}
            class="cds--loading
              {{if @small 'cds--loading--small'}}
              {{unless this.active 'cds--loading--stop'}}"
            ...attributes
          >
            <svg
              class="cds--loading__svg"
              viewBox="0 0 100 100"
              role="img"
              aria-label={{this.description}}
            >
              <title>{{this.description}}</title>
              {{#if @small}}
                <circle
                  class="cds--loading__background"
                  cx="50%"
                  cy="50%"
                  r="42"
                />
              {{/if}}
              <circle
                class="cds--loading__stroke"
                cx="50%"
                cy="50%"
                r={{if @small "42" "44"}}
              />
            </svg>
          </div>
        </div>
      </div>
    {{else}}
      <div
        aria-atomic="true"
        aria-live={{if this.active "assertive" "off"}}
        class="cds--loading
          {{if @small 'cds--loading--small'}}
          {{unless this.active 'cds--loading--stop'}}"
        ...attributes
      >
        <svg
          class="cds--loading__svg"
          viewBox="0 0 100 100"
          role="img"
          aria-label={{this.description}}
        >
          <title>{{this.description}}</title>
          {{#if @small}}
            <circle class="cds--loading__background" cx="50%" cy="50%" r="42" />
          {{/if}}
          <circle
            class="cds--loading__stroke"
            cx="50%"
            cy="50%"
            r={{if @small "42" "44"}}
          />
        </svg>
      </div>
    {{/if}}
  </template>
}
