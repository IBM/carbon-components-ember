/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported verbatim from `@carbon/ai-chat-components`'
 * `code-snippet/src/codemirror/language-utils.ts` (pure, no CodeMirror
 * import) - maps common language aliases to `@codemirror/language-data`'s
 * canonical names, and runs pattern/signature-based detection over code
 * content.
 */
import { detectLanguageFromSignatures } from './detect-language.ts';

const LANGUAGE_ALIASES: Record<string, string | undefined> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  node: 'JavaScript',
  nodejs: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  json: 'JSON',
  jsonld: 'JSON-LD',
  yaml: 'YAML',
  yml: 'YAML',
  html: 'HTML',
  htm: 'HTML',
  xml: 'XML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  less: 'LESS',
  markdown: 'Markdown',
  md: 'Markdown',
  diff: 'diff',
  patch: 'diff',
  shell: 'Shell',
  bash: 'Shell',
  sh: 'Shell',
  zsh: 'Shell',
  powershell: 'PowerShell',
  ps1: 'PowerShell',
  python: 'Python',
  py: 'Python',
  ruby: 'Ruby',
  rb: 'Ruby',
  go: 'Go',
  golang: 'Go',
  php: 'PHP',
  java: 'Java',
  c: 'C',
  'c++': 'C++',
  cpp: 'C++',
  'c#': 'C#',
  csharp: 'C#',
  cs: 'C#',
  graphql: 'GraphQL',
  gql: 'GraphQL',
};

const MARKDOWN_PATTERN =
  /(^|\n)#{1,6}\s|(^|\n)>|(^|\n)(?:-|\d+\.)\s|```|!\[[^\]]*\]\([^)]+\)/;
const DIFF_PATTERN = /(^|\n)(diff --|@@|\+\+\+|---|\+[^\n]*|-[^\n]*)/;
const SHELL_SHEBANG = /^#!\/bin\//;
const TYPESCRIPT_HINT_PATTERN =
  /\b(interface|type|enum)\s+\w+|\bimplements\s+[A-Z]|\breadonly\b|import\s+type\b|:\s*(?:string|number|boolean|unknown|any|void)(?=\s|,|;|\)|$)|<\w+\s*(?:extends\s+\w+)?\s*>/;

function looksLikeJSON(code: string): boolean {
  if (!code.trim().startsWith('{') && !code.trim().startsWith('[')) {
    return false;
  }
  try {
    JSON.parse(code);
    return true;
  } catch {
    return false;
  }
}

function resolvePatternLanguage(code: string): string | null {
  if (MARKDOWN_PATTERN.test(code)) {
    return 'Markdown';
  }
  if (DIFF_PATTERN.test(code)) {
    return 'diff';
  }
  if (SHELL_SHEBANG.test(code.trim())) {
    return 'Shell';
  }
  if (looksLikeJSON(code)) {
    return 'JSON';
  }
  return null;
}

function adjustDetectedLanguage(
  language: string | null,
  code: string
): string | null {
  if (
    (language === 'JavaScript' || language === 'CSS') &&
    TYPESCRIPT_HINT_PATTERN.test(code)
  ) {
    return 'TypeScript';
  }
  if (!language && TYPESCRIPT_HINT_PATTERN.test(code)) {
    return 'TypeScript';
  }
  return language;
}

function normalizeLanguageKey(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Maps common language name aliases/file-extension-style identifiers to
 * their canonical `@codemirror/language-data` name.
 */
export function mapLanguageName(
  name: string | null | undefined
): string | null {
  if (!name) {
    return null;
  }

  const normalized = normalizeLanguageKey(name);

  if (!normalized || normalized === 'unknown' || normalized === 'plaintext') {
    return null;
  }

  return LANGUAGE_ALIASES[normalized] ?? name;
}

/**
 * Detects the programming language from code content using pattern and signature matching:
 * pattern-based detection for Markdown/JSON/diff/shell first, then signature-based detection
 * across the common languages, then a TypeScript-specific hint pass to distinguish it from
 * plain JavaScript/CSS.
 */
export function detectLanguage(code: string): string | null {
  if (!code) {
    return null;
  }

  const trimmed = code.trim();

  if (!trimmed) {
    return null;
  }

  const patternMatch = resolvePatternLanguage(trimmed);
  if (patternMatch) {
    return patternMatch;
  }

  const mapped = mapLanguageName(detectLanguageFromSignatures(trimmed));
  return adjustDetectedLanguage(mapped, trimmed) ?? mapped ?? null;
}
