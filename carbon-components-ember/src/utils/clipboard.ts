/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * An element's text to copy: a form control's value, or its text content
 * without the visually hidden parts.
 */
export function textOf(element: Element): string {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return element.value;
  }
  const clone = element.cloneNode(true) as Element;
  for (const hidden of clone.querySelectorAll('.cds--visually-hidden')) {
    hidden.remove();
  }
  return clone.textContent ?? '';
}

function copyWithExecCommand(text: string, from?: Element): boolean {
  const active = document.activeElement;
  const selection = document.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0) : undefined;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  // Outside an open modal dialog, it couldn't take focus.
  (from?.closest('dialog') ?? document.body).append(textarea);
  textarea.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    // select() moved focus to the textarea.
    if (active instanceof HTMLElement || active instanceof SVGElement) {
      active.focus({ preventScroll: true });
    }
    if (range) {
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
}

/**
 * Writes `text` to the clipboard, for a click on `from`. The Clipboard API
 * is missing outside secure contexts and rejects where the permission is
 * denied (an Electron app's permission handler, for one), so both fall back
 * to `execCommand('copy')`. Rejects with the Clipboard API's error when that
 * fails too.
 */
export async function writeToClipboard(
  text: string,
  from?: Element,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    if (!copyWithExecCommand(text, from)) throw error;
  }
}
