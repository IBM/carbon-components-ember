/**
 * Replaces `navigator.clipboard` for each test with one that records what's
 * written, or rejects like a denied permission when `denied` is set.
 */
export function setupClipboard(hooks: NestedHooks) {
  const clipboard = { copied: [] as string[], denied: false };

  hooks.beforeEach(() => {
    clipboard.copied = [];
    clipboard.denied = false;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          if (clipboard.denied) {
            return Promise.reject(
              new DOMException('Write permission denied.', 'NotAllowedError'),
            );
          }
          clipboard.copied.push(text);
          return Promise.resolve();
        },
      },
    });
  });

  hooks.afterEach(() => {
    // Uncovers the real one on Navigator.prototype.
    delete (navigator as { clipboard?: Clipboard }).clipboard;
  });

  return clipboard;
}
