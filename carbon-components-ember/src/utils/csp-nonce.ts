/**
 * The page's CSP nonce, for `<style>` elements the addon's dependencies inject
 * at runtime. Apps render it as `<meta property="csp-nonce" nonce="…">`, the
 * tag Vite's `html.cspNonce` emits. Browsers hide the attribute's value, so
 * this reads the `nonce` property.
 */
export function cspNonce(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[property="csp-nonce"]',
  );
  return meta?.nonce || undefined;
}
