/**
 * The button with this accessible name: its `aria-label`, the text of the
 * elements its `aria-labelledby` names (an icon-only Button's tooltip), or
 * its own text.
 */
export function findButton(name: string): HTMLButtonElement {
  const nameOf = (button: HTMLButtonElement) => {
    const label = button.getAttribute('aria-label');
    if (label) return label;
    const labelledBy = button.getAttribute('aria-labelledby');
    if (labelledBy) {
      return labelledBy
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? '')
        .join(' ');
    }
    return button.textContent?.trim() ?? '';
  };
  const button = [
    ...document.querySelectorAll<HTMLButtonElement>('#ember-testing button'),
  ].find((candidate) => nameOf(candidate) === name);
  if (!button) throw new Error(`No button named "${name}"`);
  return button;
}
