import { t as _16_default } from "./16-B21MLVSB.js";
import { A as syntaxHighlighting, F as Decoration, H as drawSelection, L as EditorView, P as tags, R as ViewPlugin, X as keymap, Z as lineNumbers, a as LanguageDescription, dt as EditorState, f as defaultHighlightStyle, g as foldGutter, gt as RangeSetBuilder, lt as Compartment, t as HighlightStyle, v as foldKeymap, w as indentOnInput } from "./dist-CI_ns6W5.js";
import { t as languages$1 } from "./dist-DESnepKB.js";
import { n as defaultKeymap, t as lintKeymap } from "./dist-Z-lgxSeg.js";
import { i as closeBracketsKeymap, r as closeBrackets } from "./dist-4SiNbISa.js";
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/languages.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
/**
* Upstream (`@carbon/ai-chat-components`) vendors its own fork of
* `@codemirror/language-data` (`code-snippet/src/codemirror/language-data.ts`,
* ~1,250 lines) purely to drop one entry ("Brainfuck" - an esoteric
* language whose name reads as profanity, undesirable in a chat UI) from
* the descriptor list. That's the *only* difference from the real package
* (diffed directly against the real npm build) - every `LanguageDescription`
* entry's own `load()` already does its own `import('@codemirror/lang-*')`,
* so the fork buys no lazy-loading behavior the real package doesn't
* already have. This port uses the real, unforked `@codemirror/language-data`
* and reproduces the one-entry filter here instead of vendoring the fork,
* so the 23 `@codemirror/lang-*` + `@codemirror/legacy-modes` packages stay
* ordinary transitive dependencies (see `@codemirror/language-data`'s own
* `package.json`) rather than code this addon has to keep in sync with
* upstream by hand.
*/
var languages = languages$1.filter((language) => language.name !== "Brainfuck");
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/detect-language.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
/**
* Ported verbatim from `@carbon/ai-chat-components`'
* `code-snippet/src/codemirror/detect-language.ts` - pure pattern matching,
* no CodeMirror/Lit dependency.
*
* Signatures are evaluated in order and the first match wins, so they run from most to least
* distinctive. Each pattern is chosen to be unambiguous on its own rather than merely suggestive -
* ordering resolves the remaining overlap (a Python `def` ends in a colon, a Ruby one does not).
*
* Names match the language names used by `@codemirror/language-data` so callers can hand the result
* straight to `LanguageDescription.matchLanguageName`.
*/
var SIGNATURES = [
	{
		language: "PHP",
		pattern: /<\?php\b|<\?=/
	},
	{
		language: "HTML",
		pattern: /<!DOCTYPE\s+html|<html\b/i
	},
	{
		language: "Go",
		pattern: /^\s*package\s+\w+\s*$|^\s*func\s+\w*\s*\(|:=/m
	},
	{
		language: "Java",
		pattern: /\bpublic\s+(?:final\s+|abstract\s+)?class\s+\w+|public\s+static\s+void\s+main\s*\(|\bSystem\.(?:out|err)\.print/
	},
	{
		language: "C++",
		pattern: /#include\s*<(?:iostream|vector|string|map)>|\bstd::\w+|\busing\s+namespace\s+\w+|\b(?:cout|cin|endl)\b|\bnullptr\b/
	},
	{
		language: "C",
		pattern: /#include\s*<\w+\.h>|\b(?:printf|scanf|malloc|free)\s*\(|\bint\s+main\s*\(/
	},
	{
		language: "Python",
		pattern: /^\s*(?:def|class)\s+\w+[^\n]*:\s*$|^\s*(?:from\s+[\w.]+\s+import\b|import\s+\w+\s*$)|^\s*if\s+__name__\s*==/m
	},
	{
		language: "Ruby",
		pattern: /^\s*(?:puts|require(?:_relative)?)\s+['"]?|\bdo\s*\|[^|]*\||^\s*end\s*$|\bdef\s+\w+[^\n(]*$|\belsif\b|\bnil\b/m
	},
	{
		language: "TypeScript",
		pattern: /^\s*(?:export\s+)?(?:interface|type|enum)\s+\w+|\bimplements\s+[A-Z]|\breadonly\b|\bimport\s+type\b|:\s*(?:string|number|boolean|unknown|any|void)\b/m
	},
	{
		language: "JavaScript",
		pattern: /\b(?:const|let|var)\s+[\w$]+\s*=|\bfunction\*?\s*[\w$]*\s*\(|=>|\bconsole\.\w+\s*\(|\b(?:import|export)\b[^\n]*\bfrom\b|\b(?:null|undefined)\b/
	},
	{
		language: "CSS",
		pattern: /@media\b|@import\b|[.#]?[\w-]+\s*\{[^}]*[\w-]+\s*:[^}]+;/
	},
	{
		language: "HTML",
		pattern: /<(?:head|body|div|span|p|a|ul|ol|li|table|tr|td|form|input|button|script|style|link|meta|img|h[1-6])\b[^>]*>/i
	}
];
/**
* Detects a programming language from a code snippet, returning null when nothing matches
* confidently enough.
*/
function detectLanguageFromSignatures(code) {
	return SIGNATURES.find(({ pattern }) => pattern.test(code))?.language ?? null;
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/language-utils.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
var LANGUAGE_ALIASES = {
	javascript: "JavaScript",
	js: "JavaScript",
	node: "JavaScript",
	nodejs: "JavaScript",
	typescript: "TypeScript",
	ts: "TypeScript",
	jsx: "JSX",
	tsx: "TSX",
	json: "JSON",
	jsonld: "JSON-LD",
	yaml: "YAML",
	yml: "YAML",
	html: "HTML",
	htm: "HTML",
	xml: "XML",
	css: "CSS",
	scss: "SCSS",
	sass: "Sass",
	less: "LESS",
	markdown: "Markdown",
	md: "Markdown",
	diff: "diff",
	patch: "diff",
	shell: "Shell",
	bash: "Shell",
	sh: "Shell",
	zsh: "Shell",
	powershell: "PowerShell",
	ps1: "PowerShell",
	python: "Python",
	py: "Python",
	ruby: "Ruby",
	rb: "Ruby",
	go: "Go",
	golang: "Go",
	php: "PHP",
	java: "Java",
	c: "C",
	"c++": "C++",
	cpp: "C++",
	"c#": "C#",
	csharp: "C#",
	cs: "C#",
	graphql: "GraphQL",
	gql: "GraphQL"
};
var MARKDOWN_PATTERN = /(^|\n)#{1,6}\s|(^|\n)>|(^|\n)(?:-|\d+\.)\s|```|!\[[^\]]*\]\([^)]+\)/;
var DIFF_PATTERN = /(^|\n)(diff --|@@|\+\+\+|---|\+[^\n]*|-[^\n]*)/;
var SHELL_SHEBANG = /^#!\/bin\//;
var TYPESCRIPT_HINT_PATTERN = /\b(interface|type|enum)\s+\w+|\bimplements\s+[A-Z]|\breadonly\b|import\s+type\b|:\s*(?:string|number|boolean|unknown|any|void)(?=\s|,|;|\)|$)|<\w+\s*(?:extends\s+\w+)?\s*>/;
function looksLikeJSON(code) {
	if (!code.trim().startsWith("{") && !code.trim().startsWith("[")) return false;
	try {
		JSON.parse(code);
		return true;
	} catch {
		return false;
	}
}
function resolvePatternLanguage(code) {
	if (MARKDOWN_PATTERN.test(code)) return "Markdown";
	if (DIFF_PATTERN.test(code)) return "diff";
	if (SHELL_SHEBANG.test(code.trim())) return "Shell";
	if (looksLikeJSON(code)) return "JSON";
	return null;
}
function adjustDetectedLanguage(language, code) {
	if ((language === "JavaScript" || language === "CSS") && TYPESCRIPT_HINT_PATTERN.test(code)) return "TypeScript";
	if (!language && TYPESCRIPT_HINT_PATTERN.test(code)) return "TypeScript";
	return language;
}
function normalizeLanguageKey(name) {
	return name.trim().toLowerCase();
}
/**
* Maps common language name aliases/file-extension-style identifiers to
* their canonical `@codemirror/language-data` name.
*/
function mapLanguageName(name) {
	if (!name) return null;
	const normalized = normalizeLanguageKey(name);
	if (!normalized || normalized === "unknown" || normalized === "plaintext") return null;
	return LANGUAGE_ALIASES[normalized] ?? name;
}
/**
* Detects the programming language from code content using pattern and signature matching:
* pattern-based detection for Markdown/JSON/diff/shell first, then signature-based detection
* across the common languages, then a TypeScript-specific hint pass to distinguish it from
* plain JavaScript/CSS.
*/
function detectLanguage(code) {
	if (!code) return null;
	const trimmed = code.trim();
	if (!trimmed) return null;
	const patternMatch = resolvePatternLanguage(trimmed);
	if (patternMatch) return patternMatch;
	const mapped = mapLanguageName(detectLanguageFromSignatures(trimmed));
	return adjustDetectedLanguage(mapped, trimmed) ?? mapped ?? null;
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/language-controller.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
function loadLanguageSupport(langDesc) {
	return langDesc.load();
}
var LanguageController = class {
	pendingLanguageLoad = null;
	languageDetectionTimeout = null;
	highlightingDetectionTimeout = null;
	editableLanguageDetectionTimeout = null;
	canDetectForHighlighting = true;
	constructor(config) {
		this.config = config;
	}
	async resolveLanguageSupport() {
		const languageAttr = this.config.getLanguageAttribute();
		const content = this.config.getContent();
		const isHighlightEnabled = this.config.isHighlightEnabled();
		const currentDetectedLanguage = this.config.getDetectedLanguage();
		let languageToUse = languageAttr ? mapLanguageName(languageAttr) ?? languageAttr : "";
		if (!languageToUse && content) {
			const trimmed = content.trim();
			if (trimmed) languageToUse = detectLanguage(trimmed) ?? "";
		}
		if (!languageToUse && this.config.getDefaultLanguage()) {
			if (!content.trim()) languageToUse = this.config.getDefaultLanguage();
		}
		if (!languageToUse) {
			this.config.updateState({
				detectedLanguage: null,
				lockLabel: false
			});
			return null;
		}
		const langDesc = LanguageDescription.matchLanguageName(languages, languageToUse, true);
		const detectedLanguage = langDesc ? languageToUse : null;
		if (detectedLanguage !== currentDetectedLanguage) this.config.updateState({
			detectedLanguage,
			lockLabel: Boolean(languageAttr && detectedLanguage)
		});
		if (!isHighlightEnabled || !langDesc) return null;
		try {
			return await loadLanguageSupport(langDesc);
		} catch {
			console.warn(`Failed to load language support for "${languageToUse}"`);
			return null;
		}
	}
	handleStreamingLanguageDetection() {
		if (this.config.getLanguageAttribute()) return;
		const trimmed = this.config.getContent().trim();
		if (!trimmed) return;
		if (!this.config.isLanguageLabelLocked() && this.config.isHighlightEnabled() && this.canDetectForHighlighting) {
			const detected = detectLanguage(trimmed);
			if (detected) {
				const langDesc = LanguageDescription.matchLanguageName(languages, detected, true);
				if (langDesc && !this.pendingLanguageLoad) {
					this.pendingLanguageLoad = loadLanguageSupport(langDesc).then((support) => {
						const view = this.config.getEditorView();
						if (!view) return;
						view.dispatch({ effects: this.config.getLanguageCompartment().reconfigure([support]) });
					}).catch(() => {
						console.warn(`Failed to load language support for "${detected}"`);
					}).finally(() => {
						this.pendingLanguageLoad = null;
					});
					this.canDetectForHighlighting = false;
					this.scheduleHighlightingDetectionReset();
				}
			}
		}
		this.clearLanguageDetectionTimeout();
		if (!this.config.isLanguageLabelLocked()) this.languageDetectionTimeout = window.setTimeout(() => {
			this.languageDetectionTimeout = null;
			this.lockDetectedLanguageFromContent();
		}, 200);
	}
	detectLanguageForEditable(content) {
		if (this.config.getLanguageAttribute()) return;
		const trimmed = content.trim();
		if (!trimmed) {
			this.config.updateState({
				detectedLanguage: null,
				lockLabel: false
			});
			return;
		}
		this.clearEditableDetectionTimeout();
		this.editableLanguageDetectionTimeout = window.setTimeout(() => {
			this.editableLanguageDetectionTimeout = null;
			const detected = detectLanguage(trimmed);
			if (!detected) return;
			const langDesc = LanguageDescription.matchLanguageName(languages, detected, true);
			if (!langDesc) return;
			this.config.updateState({
				detectedLanguage: detected,
				lockLabel: true
			});
			if (this.config.isHighlightEnabled() && !this.pendingLanguageLoad) this.pendingLanguageLoad = loadLanguageSupport(langDesc).then((support) => {
				const view = this.config.getEditorView();
				if (!view) return;
				view.dispatch({ effects: this.config.getLanguageCompartment().reconfigure([support]) });
			}).catch(() => {
				console.warn(`Failed to load language support for "${detected}"`);
			}).finally(() => {
				this.pendingLanguageLoad = null;
			});
		}, 200);
	}
	reset() {
		this.disposeTimers();
		this.pendingLanguageLoad = null;
		this.canDetectForHighlighting = true;
		this.config.updateState({
			detectedLanguage: null,
			lockLabel: false
		});
	}
	dispose() {
		this.disposeTimers();
		this.pendingLanguageLoad = null;
	}
	lockDetectedLanguageFromContent() {
		if (this.config.getLanguageAttribute() || this.config.isLanguageLabelLocked()) return;
		const trimmed = this.config.getContent().trim();
		if (!trimmed) return;
		const detected = detectLanguage(trimmed);
		if (!detected) return;
		this.config.updateState({
			detectedLanguage: detected,
			lockLabel: true
		});
	}
	scheduleHighlightingDetectionReset() {
		this.clearHighlightingDetectionTimeout();
		this.highlightingDetectionTimeout = window.setTimeout(() => {
			this.canDetectForHighlighting = true;
			this.highlightingDetectionTimeout = null;
		}, 200);
	}
	clearLanguageDetectionTimeout() {
		if (this.languageDetectionTimeout !== null) {
			window.clearTimeout(this.languageDetectionTimeout);
			this.languageDetectionTimeout = null;
		}
	}
	clearHighlightingDetectionTimeout() {
		if (this.highlightingDetectionTimeout !== null) {
			window.clearTimeout(this.highlightingDetectionTimeout);
			this.highlightingDetectionTimeout = null;
		}
	}
	clearEditableDetectionTimeout() {
		if (this.editableLanguageDetectionTimeout !== null) {
			window.clearTimeout(this.editableLanguageDetectionTimeout);
			this.editableLanguageDetectionTimeout = null;
		}
	}
	disposeTimers() {
		this.clearLanguageDetectionTimeout();
		this.clearHighlightingDetectionTimeout();
		this.clearEditableDetectionTimeout();
	}
};
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/content-sync.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
/**
* Ported from `@carbon/ai-chat-components`'
* `code-snippet/src/codemirror/content-sync.ts` - throttled, diff-based
* content application (append-only and prefix-shrink fast paths, full
* replace otherwise) so streaming a growing/shrinking string into the
* editor doesn't reset the whole doc (and scroll position/selection) on
* every token. The only real change from upstream: a small local
* leading+trailing throttle instead of `lodash-es/throttle`, since this
* addon has no existing `lodash-es` dependency and the behavior needed
* (invoke immediately, then at most once more per interval with the
* latest args) is a dozen lines.
*/
function throttle(fn, ms) {
	let timer = null;
	let pendingValue = null;
	let lastRun = 0;
	function invoke(value) {
		lastRun = Date.now();
		pendingValue = null;
		fn(value);
	}
	function run(value) {
		const remaining = ms - (Date.now() - lastRun);
		if (remaining <= 0) {
			if (timer !== null) {
				window.clearTimeout(timer);
				timer = null;
			}
			invoke(value);
			return;
		}
		pendingValue = value;
		if (timer === null) timer = window.setTimeout(() => {
			timer = null;
			if (pendingValue !== null) invoke(pendingValue);
		}, remaining);
	}
	function cancel() {
		if (timer !== null) {
			window.clearTimeout(timer);
			timer = null;
		}
		pendingValue = null;
	}
	return {
		run,
		cancel
	};
}
function createContentSync({ getEditorView, onAfterApply, throttleMs = 200 }) {
	const throttled = throttle((content) => {
		const view = getEditorView();
		if (!view) return;
		const current = view.state.doc.toString();
		if (content === current) return;
		if (content.startsWith(current)) {
			const appended = content.slice(current.length);
			if (!appended.length) return;
			view.dispatch({ changes: {
				from: current.length,
				to: current.length,
				insert: appended
			} });
		} else if (current.startsWith(content)) view.dispatch({ changes: {
			from: content.length,
			to: current.length,
			insert: ""
		} });
		else view.dispatch({ changes: {
			from: 0,
			to: current.length,
			insert: content
		} });
		if (onAfterApply) requestAnimationFrame(() => {
			onAfterApply();
		});
	}, throttleMs);
	return {
		update: (content) => throttled.run(content),
		cancel: () => throttled.cancel()
	};
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/theme.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
/**
* Makes `.cm-scroller` keyboard focusable (tabindex 0 instead of -1), fixing
* the "scrollable-region-focusable" accessibility violation.
*/
function makeScrollerFocusable() {
	return ViewPlugin.fromClass(class {
		constructor(view) {
			this.updateScrollerTabIndex(view);
		}
		update(update) {
			this.updateScrollerTabIndex(update.view);
		}
		updateScrollerTabIndex(view) {
			const scroller = view.scrollDOM;
			if (scroller && scroller.getAttribute("tabindex") === "-1") scroller.setAttribute("tabindex", "0");
		}
	});
}
/**
* A CodeMirror theme built from Carbon CSS custom properties, so the editor
* automatically adapts to Carbon's light/dark themes.
*/
function createCarbonTheme() {
	return EditorView.theme({
		".cm-editor": {
			background: "var(--cds-layer, #ffffff)",
			color: "var(--cds-text-primary, #161616)"
		},
		".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--cds-text-primary, #161616)" },
		".cm-gutters": {
			backgroundColor: "var(--cds-chat-shell-background, #ffffff)",
			color: "var(--cds-text-helper, #6f6f6f)",
			border: "none"
		},
		".cm-gutterElement .cm-lineNumbers": { textAlign: "end" },
		".cm-foldGutter": { paddingInlineEnd: "0.25rem" },
		".cm-content": {
			flexBasis: "0 !important",
			caretColor: "var(--cds-text-primary, #161616)"
		},
		".cm-scroller": {
			fontFamily: "var(--cds-code-01-font-family, 'IBM Plex Mono', monospace)",
			fontSize: "var(--cds-code-01-font-size, 0.875rem)",
			fontWeight: "var(--cds-code-01-font-weight, 400)",
			letterSpacing: "var(--cds-code-01-letter-spacing, 0.16px)",
			lineHeight: "var(--cds-code-01-line-height, 1.5)",
			maxBlockSize: "var(--cds-snippet-max-height, 16rem)",
			minBlockSize: "var(--cds-snippet-min-height, auto)"
		},
		".cm-foldGutter .cm-gutterElement": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "16px"
		},
		".cm-foldGutter svg": {
			width: "12px",
			height: "12px",
			cursor: "pointer",
			transition: "transform 0.11s cubic-bezier(0.2, 0, 0.38, 0.9)",
			fill: "var(--cds-icon-primary, #161616)"
		},
		".cm-foldGutter svg[aria-expanded='true']": { transform: "rotate(0deg)" },
		".cm-foldGutter svg[aria-expanded='false']": { transform: "rotate(-90deg)" },
		".cm-foldGutter svg:focus": { outline: "2px solid var(--cds-focus, #0f62fe)" },
		".cm-searchMatch": { backgroundColor: "var(--cds-highlight, #d0e2ff)" },
		".cm-searchMatch-selected": { backgroundColor: "var(--cds-highlight, #d0e2ff)" },
		".cm-selectionBackground": { backgroundColor: "var(--cds-highlight, #d0e2ff)" },
		".cm-selectionMatch": { backgroundColor: "var(--cds-highlight, #d0e2ff)" },
		"&.cm-focused .cm-selectionBackground": { backgroundColor: "var(--cds-highlight, #d0e2ff) !important" },
		"&.cm-focused .cm-selectionMatch": { backgroundColor: "var(--cds-highlight, #d0e2ff) !important" },
		".cm-content ::selection": { backgroundColor: "var(--cds-highlight, #d0e2ff) !important" },
		"&.cm-focused .cm-content ::selection": { backgroundColor: "var(--cds-highlight, #d0e2ff) !important" }
	});
}
/**
* Syntax highlighting built entirely from `--cds-syntax-*` custom
* properties (emitted per-theme in `code-snippet.scss`), so highlight
* colors follow Carbon's light/dark theme automatically. Fallback values
* mirror VSCode Light defaults.
*/
function createCarbonHighlightStyle() {
	return syntaxHighlighting(carbonHighlightStyle);
}
var TAG_REGISTRY = tags;
var toVarName = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Za-z])([0-9])/g, "$1-$2").toLowerCase();
var colorVar = (token) => `var(--cds-syntax-${token}, var(--cds-text-primary, #161616))`;
var resolveTag = (tagName) => TAG_REGISTRY[tagName];
var BASE_TAG_NAMES = [
	"comment",
	"lineComment",
	"blockComment",
	"docComment",
	"name",
	"variableName",
	"typeName",
	"tagName",
	"propertyName",
	"attributeName",
	"className",
	"labelName",
	"namespace",
	"macroName",
	"literal",
	"string",
	"docString",
	"character",
	"attributeValue",
	"number",
	"integer",
	"float",
	"bool",
	"regexp",
	"escape",
	"color",
	"url",
	"keyword",
	"self",
	"null",
	"atom",
	"unit",
	"modifier",
	"operatorKeyword",
	"controlKeyword",
	"definitionKeyword",
	"moduleKeyword",
	"operator",
	"derefOperator",
	"arithmeticOperator",
	"logicOperator",
	"bitwiseOperator",
	"compareOperator",
	"updateOperator",
	"definitionOperator",
	"typeOperator",
	"controlOperator",
	"punctuation",
	"separator",
	"bracket",
	"angleBracket",
	"squareBracket",
	"paren",
	"brace",
	"content",
	"heading",
	"heading1",
	"heading2",
	"heading3",
	"heading4",
	"heading5",
	"heading6",
	"contentSeparator",
	"list",
	"quote",
	"emphasis",
	"strong",
	"link",
	"monospace",
	"strikethrough",
	"invalid",
	"meta",
	"documentMeta",
	"annotation",
	"processingInstruction"
];
var manualConfigs = [
	...[
		"heading",
		"heading1",
		"heading2",
		"heading3",
		"heading4",
		"heading5",
		"heading6"
	].map((tagName) => ({
		tagName,
		style: {
			fontWeight: "bold",
			textDecoration: "underline"
		}
	})),
	{
		tagName: "link",
		style: { textDecoration: "underline" }
	},
	{
		tagName: "emphasis",
		style: { fontStyle: "italic" }
	},
	{
		tagName: "strong",
		style: { fontWeight: "bold" }
	},
	{
		tagName: "strikethrough",
		style: { textDecoration: "line-through" }
	}
];
var MANUAL_TAG_NAMES = new Set(manualConfigs.map(({ tagName }) => tagName));
var manualTokenStyles = manualConfigs.map(({ tagName, style }) => {
	const tag = resolveTag(tagName);
	if (!tag) return null;
	return {
		tag,
		color: colorVar(toVarName(tagName)),
		...style
	};
}).filter((style) => Boolean(style));
var autoTagStyles = BASE_TAG_NAMES.filter((tagName) => !MANUAL_TAG_NAMES.has(tagName)).map((tagName) => {
	const tag = resolveTag(tagName);
	if (!tag) return null;
	return {
		tag,
		color: colorVar(toVarName(tagName))
	};
}).filter((style) => Boolean(style));
var modifierTokenStyles = [
	{
		tag: tags.definition(tags.variableName),
		color: colorVar("definition")
	},
	{
		tag: tags.definition(tags.propertyName),
		color: colorVar("definition")
	},
	{
		tag: tags.definition(tags.typeName),
		color: colorVar("definition")
	},
	{
		tag: tags.definition(tags.className),
		color: colorVar("definition")
	},
	{
		tag: tags.constant(tags.variableName),
		color: colorVar("constant")
	},
	{
		tag: tags.constant(tags.propertyName),
		color: colorVar("constant")
	},
	{
		tag: tags.constant(tags.typeName),
		color: colorVar("constant")
	},
	{
		tag: tags.function(tags.variableName),
		color: colorVar("function")
	},
	{
		tag: tags.function(tags.propertyName),
		color: colorVar("function")
	},
	{
		tag: tags.function(tags.typeName),
		color: colorVar("function")
	},
	{
		tag: tags.standard(tags.variableName),
		color: colorVar("standard")
	},
	{
		tag: tags.standard(tags.propertyName),
		color: colorVar("standard")
	},
	{
		tag: tags.local(tags.variableName),
		color: colorVar("local")
	},
	{
		tag: tags.local(tags.propertyName),
		color: colorVar("local")
	},
	{
		tag: tags.special(tags.variableName),
		color: colorVar("special")
	},
	{
		tag: tags.special(tags.propertyName),
		color: colorVar("special")
	},
	{
		tag: tags.special(tags.string),
		color: colorVar("special-string")
	}
];
var carbonHighlightStyle = HighlightStyle.define([
	...modifierTokenStyles,
	...manualTokenStyles,
	...autoTagStyles
]);
//#endregion
//#region ../node_modules/.pnpm/@carbon+icon-helpers@10.82.0/node_modules/@carbon/icon-helpers/es/index.js
/**
* Copyright IBM Corp. 2018, 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
var defaultAttributes = {
	focusable: "false",
	preserveAspectRatio: "xMidYMid meet"
};
/**
* Get supplementary HTML attributes for a given <svg> element based on existing
* attributes.
*/
function getAttributes({ width, height, viewBox = `0 0 ${width} ${height}`, ...attributes } = {}) {
	const { tabindex, ...rest } = attributes;
	const iconAttributes = {
		...defaultAttributes,
		...rest,
		width,
		height,
		viewBox
	};
	if (iconAttributes["aria-label"] || iconAttributes["aria-labelledby"]) {
		iconAttributes.role = "img";
		if (tabindex !== void 0 && tabindex !== null) {
			iconAttributes.focusable = "true";
			iconAttributes.tabindex = tabindex;
		}
	} else iconAttributes["aria-hidden"] = true;
	return iconAttributes;
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/marker-utils.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
/**
* This addon's own generated `types/carbon-icons.d.ts` (consumed by its
* per-icon Ember components under `src/components/icons/`) declares
* `content` as a single `{ elem, attrs }` object, not the array real
* `@carbon/icons` metadata actually ships (most icons, including this one,
* have one `<path>`, but the shape is still an array) - that ambient type
* has never been exercised against `.content` before since the generated
* icon components never read it. Cast to the real runtime shape instead of
* fighting the (untyped) `@carbon/icon-helpers` package + the addon's own
* simplified ambient declaration.
*/
var ChevronDown16 = _16_default;
/**
* Returns a `markerDOM` function for `foldGutter()` that renders Carbon's
* chevron icon as the fold indicator, with accessibility attributes and
* keyboard support (paired with `carbonFoldMarkerKeyHandler()`).
*/
function createCarbonFoldMarker(options = {}) {
	const { collapseLabel = "Collapse code block", expandLabel = "Expand code block" } = options;
	return (open) => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const attrs = getAttributes(ChevronDown16.attrs);
		Object.entries(attrs).forEach(([key, value]) => {
			if (value !== void 0 && value !== "undefined" && value !== null && String(value) !== "undefined") svg.setAttribute(key, String(value));
		});
		ChevronDown16.content.forEach((item) => {
			if (item.elem === "path") {
				const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				Object.entries(item.attrs).forEach(([key, value]) => {
					path.setAttribute(key, String(value));
				});
				svg.appendChild(path);
			}
		});
		svg.setAttribute("role", "button");
		svg.setAttribute("aria-label", open ? collapseLabel : expandLabel);
		svg.setAttribute("aria-expanded", String(open));
		return svg;
	};
}
/**
* Keyboard handler enabling Enter/Space to toggle a fold marker created by
* `createCarbonFoldMarker()` (Tab focuses it; CodeMirror's own gutter click
* handling only listens for mouse events).
*/
function carbonFoldMarkerKeyHandler() {
	return EditorView.domEventHandlers({ keydown(event) {
		const target = event.target;
		if (target.tagName === "svg" && target.getAttribute("role") === "button" && target.hasAttribute("aria-expanded") && (event.key === "Enter" || event.key === " ")) {
			event.preventDefault();
			const mouseEvent = new MouseEvent("mousedown", {
				bubbles: true,
				cancelable: true
			});
			target.dispatchEvent(mouseEvent);
			return true;
		}
		return false;
	} });
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/diff-decorator.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
var insertedLineDeco = Decoration.line({ class: "cm-diff-line-inserted" });
var deletedLineDeco = Decoration.line({ class: "cm-diff-line-deleted" });
function createDiffDecorator() {
	return ViewPlugin.fromClass(class {
		decorations;
		constructor(view) {
			this.decorations = this.buildDecorations(view);
		}
		update(update) {
			if (update.docChanged || update.viewportChanged) this.decorations = this.buildDecorations(update.view);
		}
		buildDecorations(view) {
			const builder = new RangeSetBuilder();
			for (const { from, to } of view.visibleRanges) for (let pos = from; pos <= to;) {
				const line = view.state.doc.lineAt(pos);
				const text = line.text;
				if (text.startsWith("+") && !text.startsWith("+++")) builder.add(line.from, line.from, insertedLineDeco);
				else if (text.startsWith("-") && !text.startsWith("---")) builder.add(line.from, line.from, deletedLineDeco);
				pos = line.to + 1;
			}
			return builder.finish();
		}
	}, { decorations: (v) => v.decorations });
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/base-setup.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
function baseCodeMirrorSetup(options = {}) {
	const { foldCollapseLabel = "Collapse code block", foldExpandLabel = "Expand code block", enableDiffDecorator = false, hideLineNumbers = false, hideFold = false } = options;
	return [
		...hideLineNumbers ? [] : [lineNumbers()],
		...hideFold ? [] : [carbonFoldMarkerKeyHandler(), foldGutter({ markerDOM: createCarbonFoldMarker({
			collapseLabel: foldCollapseLabel,
			expandLabel: foldExpandLabel
		}) })],
		drawSelection(),
		indentOnInput(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
		createCarbonHighlightStyle(),
		closeBrackets(),
		keymap.of([
			...closeBracketsKeymap,
			...defaultKeymap,
			...hideFold ? [] : foldKeymap,
			...lintKeymap
		]),
		...enableDiffDecorator ? [createDiffDecorator()] : []
	];
}
//#endregion
//#region ../carbon-components-ember/dist/components/ai-chat/-code-snippet/editor-manager.js
/**
* Copyright IBM Corp. 2026
*
* This source code is licensed under the Apache-2.0 license found in the
* LICENSE file in the root directory of this source tree.
*/
var emptyLanguageExtensions = [];
function createEditorView({ container, doc, languageSupport, languageCompartment, readOnlyCompartment, wrapCompartment, contentAttributesCompartment, editable, disabled, ariaLabel, detectedLanguage, onDocChanged, setupOptions }) {
	const languageExtensions = languageSupport ? [languageSupport] : emptyLanguageExtensions;
	const readOnlyExtensions = [EditorState.readOnly.of(!editable || disabled), EditorView.editable.of(editable && !disabled)];
	const contentAttributesExtensions = EditorView.contentAttributes.of({ "aria-label": ariaLabel });
	const wrapTheme = createCarbonTheme();
	const isDiffLanguage = detectedLanguage === "diff";
	const state = EditorState.create({
		doc,
		extensions: [
			baseCodeMirrorSetup({
				...setupOptions,
				enableDiffDecorator: isDiffLanguage
			}),
			languageCompartment.of(languageExtensions),
			readOnlyCompartment.of(readOnlyExtensions),
			wrapCompartment.of(wrapTheme),
			contentAttributesCompartment.of(contentAttributesExtensions),
			makeScrollerFocusable(),
			EditorView.updateListener.of((update) => {
				if (update.docChanged && onDocChanged) onDocChanged({
					content: update.state.doc.toString(),
					lineCount: update.state.doc.lines
				});
			})
		]
	});
	return new EditorView({
		state,
		parent: container
	});
}
function applyLanguageSupport(view, languageCompartment, support) {
	if (!view) return;
	const extensions = support ? [support] : emptyLanguageExtensions;
	view.dispatch({ effects: languageCompartment.reconfigure(extensions) });
}
function updateReadOnlyConfiguration(view, readOnlyCompartment, { editable, disabled }) {
	if (!view) return;
	view.dispatch({ effects: readOnlyCompartment.reconfigure([EditorState.readOnly.of(!editable || disabled), EditorView.editable.of(editable && !disabled)]) });
}
function updateContentAttributes(view, contentAttributesCompartment, ariaLabel) {
	if (!view) return;
	view.dispatch({ effects: contentAttributesCompartment.reconfigure(EditorView.contentAttributes.of({ "aria-label": ariaLabel })) });
}
//#endregion
export { Compartment, EditorView, LanguageController, applyLanguageSupport, createContentSync, createEditorView, updateContentAttributes, updateReadOnlyConfiguration };
