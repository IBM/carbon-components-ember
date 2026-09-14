import { P as PluginKey, E as Extension, s as src_default$1, u as unregisterSuggestionCommand, r as registerSuggestionCommand, N as Node, S as Suggestion, a as Node$1, c as createInlineMarkdownSpec, m as mergeAttributes, b as Plugin, i as isHostOrigin } from './origin-meta-MpHKo21i.js';
import { bQ as dispatchTriggerChange, _ as _defineProperty, bR as resetTriggerChangeState } from './main-AW15VTPa.js';

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/carbon-autocomplete.ts`,
 * unchanged in substance. Wraps `@tiptap/suggestion` directly (no `Mention`
 * node) — selection inserts plain text rather than a schema node. Activates
 * whenever the input has any non-empty trailing word.
 */

/**
 * A trigger character that autocomplete stands down for, so a co-installed
 * mention or command picker wins while its trigger is active.
 */

function carbonAutocomplete(config, excludeTriggers = []) {
  const pluginKey = new PluginKey('carbonAutocompleteSuggestion');
  return Extension.create({
    name: 'carbonAutocomplete',
    addProseMirrorPlugins() {
      const editor = this.editor;
      let lastQuery = null;
      return [src_default$1({
        editor,
        char: '',
        pluginKey,
        allowedPrefixes: null,
        findSuggestionMatch: ({
          $position
        }) => {
          const text = $position.parent.textBetween(0, $position.parentOffset, '\n', '\0');
          if (!text || text.length === 0) {
            return null;
          }
          const trailing = /\S+$/.exec(text);
          if (!trailing) {
            return null;
          }
          const query = trailing[0];
          for (const excluded of excludeTriggers) {
            if (!query.startsWith(excluded.char)) {
              continue;
            }
            if (excluded.position === 'anywhere') {
              return null;
            }
            if (text === query) {
              return null;
            }
          }
          const matchStart = $position.start() + $position.parentOffset - query.length;
          return {
            range: {
              from: matchStart,
              to: $position.start() + $position.parentOffset
            },
            query,
            text: query
          };
        },
        items: ({
          query
        }) => resolveItems$1(config, query),
        command: ({
          editor: ed,
          range,
          props
        }) => {
          const item = props;
          const insertText = item.value ?? item.label;
          ed.chain().focus().insertContentAt(range, [{
            type: 'text',
            text: insertText
          }]).run();
          config.onSelect?.(item);
        },
        render: () => ({
          onStart: props => {
            registerSuggestionCommand(props.editor, pluginKey, props.command);
            lastQuery = props.query;
            dispatchTriggerChange(props.editor, {
              type: 'autocomplete',
              query: props.query,
              triggerOffset: props.range.from
            });
          },
          onUpdate: props => {
            registerSuggestionCommand(props.editor, pluginKey, props.command);
            if (props.query === lastQuery) {
              return;
            }
            lastQuery = props.query;
            dispatchTriggerChange(props.editor, {
              type: 'autocomplete',
              query: props.query,
              triggerOffset: props.range.from
            });
          },
          onExit: props => {
            lastQuery = null;
            unregisterSuggestionCommand(props.editor, pluginKey);
            dispatchTriggerChange(props.editor, null);
          },
          onKeyDown: () => false
        })
      })];
    }
  });
}
async function resolveItems$1(config, query) {
  const minQueryLength = config.minQueryLength ?? 0;
  if (query.length < minQueryLength) {
    return [];
  }
  if (typeof config.items === 'function') {
    return Promise.resolve(config.items(query));
  }
  if (!query) {
    return config.items;
  }
  const lower = query.toLowerCase();
  return config.items.filter(item => item.label.toLowerCase().includes(lower));
}

//#region src/utils/get-default-suggestion-attributes.ts
/**
* Returns the suggestion options for a trigger of the Mention extension. These
* options are used to create a `Suggestion` ProseMirror plugin. Each plugin lets
* you define a different trigger that opens the Mention menu. For example,
* you can define a `@` trigger to mention users and a `#` trigger to mention
* tags.
*
* @param param0 The configured options for the suggestion
* @returns
*/
function getSuggestionOptions({
  editor: tiptapEditor,
  overrideSuggestionOptions,
  extensionName,
  char = "@"
}) {
  return {
    editor: tiptapEditor,
    char,
    pluginKey: new PluginKey(),
    command: ({
      editor,
      range,
      props
    }) => {
      var _nodeAfter$text, _editor$view$dom$owne;
      const nodeAfter = editor.view.state.selection.$to.nodeAfter;
      if (nodeAfter === null || nodeAfter === void 0 || (_nodeAfter$text = nodeAfter.text) === null || _nodeAfter$text === void 0 ? void 0 : _nodeAfter$text.startsWith(" ")) range.to += 1;
      editor.chain().focus().insertContentAt(range, [{
        type: extensionName,
        attrs: {
          ...props,
          mentionSuggestionChar: char
        }
      }, {
        type: "text",
        text: " "
      }]).run();
      (_editor$view$dom$owne = editor.view.dom.ownerDocument.defaultView) === null || _editor$view$dom$owne === void 0 || (_editor$view$dom$owne = _editor$view$dom$owne.getSelection()) === null || _editor$view$dom$owne === void 0 || _editor$view$dom$owne.collapseToEnd();
    },
    allow: ({
      state,
      range
    }) => {
      const $from = state.doc.resolve(range.from);
      const type = state.schema.nodes[extensionName];
      return !!$from.parent.type.contentMatch.matchType(type);
    },
    ...overrideSuggestionOptions
  };
}
//#endregion
//#region src/mention.ts
/**
* Returns the suggestions for the mention extension.
*
* @param options The extension options
* @returns the suggestions
*/
function getSuggestions(options) {
  return (options.options.suggestions.length ? options.options.suggestions : [options.options.suggestion]).map(suggestion => getSuggestionOptions({
    editor: options.editor,
    overrideSuggestionOptions: suggestion,
    extensionName: options.name,
    char: suggestion.char
  }));
}
/**
* Returns the suggestion options of the mention that has a given character trigger. If not
* found, it returns the first suggestion.
*
* @param options The extension options
* @param char The character that triggers the mention
* @returns The suggestion options
*/
function getSuggestionFromChar(options, char) {
  const suggestions = getSuggestions(options);
  const suggestion = suggestions.find(s => s.char === char);
  if (suggestion) return suggestion;
  if (suggestions.length) return suggestions[0];
  return null;
}
/**
* This extension allows you to insert mentions into the editor.
* @see https://www.tiptap.dev/api/extensions/mention
*/
const Mention = Node.create({
  name: "mention",
  priority: 101,
  addOptions() {
    return {
      HTMLAttributes: {},
      renderText({
        node,
        suggestion
      }) {
        var _suggestion$char, _node$attrs$label;
        return `${(_suggestion$char = suggestion === null || suggestion === void 0 ? void 0 : suggestion.char) !== null && _suggestion$char !== void 0 ? _suggestion$char : "@"}${(_node$attrs$label = node.attrs.label) !== null && _node$attrs$label !== void 0 ? _node$attrs$label : node.attrs.id}`;
      },
      deleteTriggerWithBackspace: false,
      renderHTML({
        options,
        node,
        suggestion
      }) {
        var _suggestion$char2, _node$attrs$label2;
        return ["span", mergeAttributes(this.HTMLAttributes, options.HTMLAttributes), `${(_suggestion$char2 = suggestion === null || suggestion === void 0 ? void 0 : suggestion.char) !== null && _suggestion$char2 !== void 0 ? _suggestion$char2 : "@"}${(_node$attrs$label2 = node.attrs.label) !== null && _node$attrs$label2 !== void 0 ? _node$attrs$label2 : node.attrs.id}`];
      },
      suggestions: [],
      suggestion: {}
    };
  },
  group: "inline",
  inline: true,
  selectable: false,
  atom: true,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute("data-id"),
        renderHTML: attributes => {
          if (!attributes.id) return {};
          return {
            "data-id": attributes.id
          };
        }
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute("data-label"),
        renderHTML: attributes => {
          if (!attributes.label) return {};
          return {
            "data-label": attributes.label
          };
        }
      },
      mentionSuggestionChar: {
        default: "@",
        parseHTML: element => element.getAttribute("data-mention-suggestion-char"),
        renderHTML: attributes => {
          return {
            "data-mention-suggestion-char": attributes.mentionSuggestionChar
          };
        }
      }
    };
  },
  parseHTML() {
    return [{
      tag: `span[data-type="${this.name}"]`
    }];
  },
  renderHTML({
    node,
    HTMLAttributes
  }) {
    const suggestion = getSuggestionFromChar(this, node.attrs.mentionSuggestionChar);
    if (this.options.renderLabel !== void 0) {
      console.warn("renderLabel is deprecated use renderText and renderHTML instead");
      return ["span", mergeAttributes({
        "data-type": this.name
      }, this.options.HTMLAttributes, HTMLAttributes), this.options.renderLabel({
        options: this.options,
        node,
        suggestion
      })];
    }
    const mergedOptions = {
      ...this.options
    };
    mergedOptions.HTMLAttributes = mergeAttributes({
      "data-type": this.name
    }, this.options.HTMLAttributes, HTMLAttributes);
    const html = this.options.renderHTML({
      options: mergedOptions,
      node,
      suggestion
    });
    if (typeof html === "string") return ["span", mergeAttributes({
      "data-type": this.name
    }, this.options.HTMLAttributes, HTMLAttributes), html];
    return html;
  },
  ...createInlineMarkdownSpec({
    nodeName: "mention",
    name: "@",
    selfClosing: true,
    allowedAttributes: ["id", "label", {
      name: "mentionSuggestionChar",
      skipIfDefault: "@"
    }],
    parseAttributes: attrString => {
      const attrs = {};
      const regex = /(?:^|\s)(\w+)=(?:"([^"]*)"|'([^']*)')/g;
      let match = regex.exec(attrString);
      while (match !== null) {
        const [, key, doubleQuoted, singleQuoted] = match;
        attrs[key === "char" ? "mentionSuggestionChar" : key] = doubleQuoted !== null && doubleQuoted !== void 0 ? doubleQuoted : singleQuoted;
        match = regex.exec(attrString);
      }
      return attrs;
    },
    serializeAttributes: attrs => {
      return Object.entries(attrs).filter(([, value]) => value !== void 0 && value !== null).map(([key, value]) => {
        return `${key === "mentionSuggestionChar" ? "char" : key}="${value}"`;
      }).join(" ");
    }
  }),
  renderText({
    node
  }) {
    const args = {
      options: this.options,
      node,
      suggestion: getSuggestionFromChar(this, node.attrs.mentionSuggestionChar)
    };
    if (this.options.renderLabel !== void 0) {
      console.warn("renderLabel is deprecated use renderText and renderHTML instead");
      return this.options.renderLabel(args);
    }
    return this.options.renderText(args);
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({
        tr,
        state
      }) => {
        let isMention = false;
        const {
          selection
        } = state;
        const {
          empty,
          anchor
        } = selection;
        if (!empty) return false;
        let mentionNode = new Node$1();
        let mentionPos = 0;
        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isMention = true;
            mentionNode = node;
            mentionPos = pos;
            return false;
          }
        });
        if (isMention) tr.insertText(this.options.deleteTriggerWithBackspace ? "" : mentionNode.attrs.mentionSuggestionChar, mentionPos, mentionPos + mentionNode.nodeSize);
        return isMention;
      })
    };
  },
  addProseMirrorPlugins() {
    return getSuggestions(this).map(Suggestion);
  }
});
//#endregion
//#region src/index.ts
var src_default = Mention;

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/token-node-view.ts` +
 * `tiptap/render-token-chip.ts`, cut to the default-chip path only. Upstream
 * also accepts a `renderCustomToken` that returns an `HTMLElement`/
 * `ReactNode`, bridged into the page's light DOM via a shadow-DOM portal
 * handshake (`render-in-light-dom.ts`) so a React-rendered chip can escape
 * the chat's shadow root and pick up the page's stylesheet. This addon
 * renders in light DOM already (no shadow root to escape), but a Tiptap
 * `NodeView`'s `dom` must exist synchronously when ProseMirror constructs
 * it — there's no way to synchronously render a Glimmer component into it,
 * so a `renderCustomToken`-equivalent needs its own `{{in-element}}`-driven
 * design, not a port of upstream's portal. Left as a documented gap, not a
 * silently-ignored arg: this port doesn't accept a custom-chip callback at
 * all.
 */

function createDefaultChip(attrs) {
  const chip = document.createElement('span');
  const label = typeof attrs.label === 'string' ? attrs.label : null;
  const value = typeof attrs.value === 'string' ? attrs.value : null;
  const trigger = typeof attrs.trigger === 'string' ? attrs.trigger : '';
  chip.textContent = `${trigger}${label || value || ''}`;
  return chip;
}
function renderTokenChip(attrs, type) {
  const value = typeof attrs.value === 'string' ? attrs.value : null;
  const label = typeof attrs.label === 'string' ? attrs.label : null;
  const dom = document.createElement('span');
  dom.setAttribute('contenteditable', 'false');
  dom.setAttribute('data-token-type', type);
  dom.setAttribute('data-raw-value', value ?? label ?? '');
  dom.className = 'cds-aichat--token';
  dom.appendChild(createDefaultChip(attrs));
  return dom;
}

/** Tiptap's `NodeView` for inline tokens (mentions, commands). */
class CarbonTokenNodeView {
  constructor(node) {
    _defineProperty(this, "dom", void 0);
    this.dom = renderTokenChip(node.attrs, node.type.name);
  }
  stopEvent() {
    return true;
  }
  ignoreMutation() {
    return true;
  }

  /** Atomic: PM does not track interior content. */
  get contentDOM() {
    return null;
  }
}

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/carbon-mention.ts`.
 * `carbonMention` and `carbonCommand` factories, wrapping
 * `@tiptap/extension-mention` with carbon-specific: chip rendering via
 * `CarbonTokenNodeView` (default chip only — see `token-chip.ts`), extra
 * schema attrs (`value`, `data`, `trigger`) layered on `Mention`'s default
 * `id`/`label`, direct `cds-aichat-trigger-change` dispatch from the
 * suggestion-render lifecycle, and an `onRemove` callback fired when a user
 * edit deletes a token node. Cut from upstream: the `renderCustomToken`
 * option (see `token-chip.ts`'s doc comment) and `mentionSuggestionChar`'s
 * separate schema attr (upstream's own `trigger` attr already carries this,
 * once `showTriggerInChip` resolves it — keeping both was redundant).
 *
 * Each chat supports one mention trigger and one command trigger, because
 * Tiptap resolves extensions by name. `carbonCommand` defaults
 * `showTriggerInChip` to on, `carbonMention` to off — either default can be
 * overridden per-config or per-item (`SuggestionItem.showTriggerInChip`
 * wins when set).
 *
 * Importing this module (directly, or via `build-extensions.ts`) pulls in a
 * real `@tiptap/extension-mention` — do this only from a lazily-loaded
 * module (e.g. behind a dynamic `import()`, the same way `rich-controller.ts`
 * itself is reached), never from `PromptLine.gts` or the components barrel,
 * or Tiptap lands in the main bundle for every consumer. See AGENTS.md.
 */

function buildTriggerExtension(config, build) {
  const name = build.defaultName;
  const pluginKey = new PluginKey(`${build.defaultPluginKeyName}_${name}`);
  return src_default.extend({
    name,
    addAttributes() {
      const parent = this.parent?.() ?? {};
      return {
        ...parent,
        value: {
          default: null
        },
        data: {
          default: null
        },
        trigger: {
          default: null
        }
      };
    },
    addNodeView() {
      return ({
        node
      }) => new CarbonTokenNodeView(node);
    },
    addProseMirrorPlugins() {
      const parentPlugins = this.parent?.() ?? [];
      const onRemove = config.onRemove;
      if (!onRemove) {
        return parentPlugins;
      }

      // Fire `onRemove` once per token node of this type that leaves the doc
      // via a USER edit. `appendTransaction` records whether the batch was
      // host-origin; the view's `update` runs the diff after state is
      // applied, so host callbacks never re-enter `dispatch`. Host-origin
      // batches (a controlled `@content` sync, `clearContent()`,
      // `insertContent()`) are skipped, symmetric with `onSelect` firing
      // only on user popup selection.
      let lastBatchIsHost = false;
      const removalPlugin = new Plugin({
        key: new PluginKey(`${name}_removal`),
        appendTransaction(transactions) {
          lastBatchIsHost = transactions.some(tr => isHostOrigin(tr));
          return null;
        },
        view: () => ({
          update(view, prevState) {
            if (view.state.doc === prevState.doc || lastBatchIsHost) {
              return;
            }
            const removed = diffRemovedTokens(prevState.doc, view.state.doc, name);
            for (const item of removed) {
              onRemove(item);
            }
          }
        })
      });
      return [...parentPlugins, removalPlugin];
    }
  }).configure({
    HTMLAttributes: {
      'data-token-type': name
    },
    suggestion: {
      char: config.trigger,
      pluginKey,
      startOfLine: config.triggerPosition === 'start',
      items: ({
        query
      }) => resolveItems(config, query),
      command: ({
        editor,
        range,
        props
      }) => {
        const item = props;
        editor.chain().focus().insertContentAt(range, [{
          type: name,
          attrs: {
            id: item.id,
            label: item.label,
            value: item.value ?? item.label,
            trigger: resolveShowTriggerInChip(item, config, build.defaultName === 'command') ? config.trigger : null,
            data: stripPresentationFields(item)
          }
        }, {
          type: 'text',
          text: ' '
        }]).run();
        config.onSelect?.(item);
      },
      render: () => {
        let lastQuery = null;
        return {
          onStart: props => {
            registerSuggestionCommand(props.editor, pluginKey, props.command);
            emitTrigger(props.editor, name, props.query, props.range, () => {
              lastQuery = props.query;
            });
          },
          onUpdate: props => {
            registerSuggestionCommand(props.editor, pluginKey, props.command);
            if (props.query === lastQuery) {
              return;
            }
            lastQuery = props.query;
            emitTrigger(props.editor, name, props.query, props.range);
          },
          onExit: props => {
            lastQuery = null;
            unregisterSuggestionCommand(props.editor, pluginKey);
            dispatchTriggerChange(props.editor, null);
          },
          onKeyDown: () => false
        };
      }
    }
  });
}
function emitTrigger(editor, type, query, range, postEmit) {
  dispatchTriggerChange(editor, {
    type,
    query,
    triggerOffset: range.from
  });
  postEmit?.();
}

/**
 * Collect the attrs of every node named `name` in `doc`, grouped by id and
 * kept in document order, so a multiset diff can tell which specific node
 * instances were removed (duplicate chips with the same id are tracked by
 * count, not collapsed).
 */
function collectTokenAttrsById(doc, name) {
  const byId = new Map();
  doc.descendants(node => {
    if (node.type.name !== name) {
      return;
    }
    const attrs = node.attrs;
    const id = String(attrs['id']);
    const bucket = byId.get(id);
    if (bucket) {
      bucket.push(attrs);
    } else {
      byId.set(id, [attrs]);
    }
  });
  return byId;
}

/** Reconstruct a {@link SuggestionItem} from a removed token node's attrs. */
function attrsToItem(attrs) {
  const data = attrs['data'] ?? {};
  return {
    ...data,
    id: String(attrs['id']),
    label: attrs['label'],
    value: attrs['value'] ?? undefined
  };
}

/** Diff token nodes named `name` between `before` and `after`, returning reconstructed items for each removed node instance. */
function diffRemovedTokens(before, after, name) {
  const beforeById = collectTokenAttrsById(before, name);
  const afterById = collectTokenAttrsById(after, name);
  const removed = [];
  for (const [id, beforeAttrs] of beforeById) {
    const afterCount = afterById.get(id)?.length ?? 0;
    for (let i = afterCount; i < beforeAttrs.length; i += 1) {
      removed.push(attrsToItem(beforeAttrs[i]));
    }
  }
  return removed;
}
async function resolveItems(config, query) {
  const minQueryLength = config.minQueryLength ?? 0;
  if (query.length < minQueryLength) {
    return [];
  }
  if (typeof config.items === 'function') {
    return Promise.resolve(config.items(query));
  }
  if (!query) {
    return config.items;
  }
  const lower = query.toLowerCase();
  return config.items.filter(item => item.label.toLowerCase().includes(lower));
}

/**
 * Resolve whether a selected item's chip should be prefixed with the
 * trigger character: the item's own `showTriggerInChip` wins when set, then
 * the config's, then the command/mention default.
 */
function resolveShowTriggerInChip(item, config, isCommand) {
  return item.showTriggerInChip ?? config.showTriggerInChip ?? isCommand;
}
const PRESENTATION_FIELDS = new Set(['id', 'label', 'value', 'avatar', 'description', 'disabled', 'showTriggerInChip']);
function stripPresentationFields(item) {
  return Object.fromEntries(Object.entries(item).filter(([key]) => !PRESENTATION_FIELDS.has(key)));
}
function carbonMention(config) {
  return buildTriggerExtension(config, {
    defaultName: 'mention',
    defaultPluginKeyName: 'carbonMentionSuggestion'
  });
}
function carbonCommand(config) {
  return buildTriggerExtension(config, {
    defaultName: 'command',
    defaultPluginKeyName: 'carbonCommandSuggestion'
  });
}

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/carbon-starter-trigger.ts`.
 * Watches the editor's empty + focused + editable state and emits
 * `cds-aichat-trigger-change` with `type: 'starter'`. Cut from upstream:
 * `readStarterStorage`/`writeStarterStorage`, which exist there only to
 * patch a live editor's storage in place so a starter-only config change
 * doesn't recreate the editor (upstream's own extension-equivalence check —
 * not ported here, see `build-extensions.ts`). This port's `@extensions`
 * contract is already "a fresh array rebuilds the editor, so memoize it" —
 * changing the starters list is just another instance of that, not a new
 * gap. Selecting a starter has no schema-node insertion step upstream
 * either: a host reads the item off its own config and calls `insertContent`
 * + `onSendIntent` directly (see `PromptLine`'s class doc), so there's no
 * `command` for `active-suggestion.ts` to capture here.
 */
function carbonStarterTrigger(initialItems, initialIsOn = true) {
  return Extension.create({
    name: 'carbonStarterTrigger',
    addStorage() {
      return {
        items: initialItems,
        isOn: initialIsOn
      };
    },
    onUpdate() {
      maybeEmit(this.editor);
    },
    onTransaction() {
      if (this.editor.isFocused) {
        maybeEmit(this.editor);
      }
    },
    onFocus({
      editor
    }) {
      maybeEmit(editor);
    },
    onBlur({
      editor
    }) {
      // Clear coalescing state on blur so the next focus can re-emit the
      // starter trigger even if the detail hasn't changed.
      resetTriggerChangeState(editor);
    }
  });
}
function maybeEmit(editor) {
  const storage = editor.storage['carbonStarterTrigger'];
  const isActive = storage?.isOn !== false && (storage?.items.length ?? 0) > 0 && editor.isEditable && editor.isFocused && editor.isEmpty;
  if (!isActive) {
    dispatchTriggerChange(editor, null);
    return;
  }
  dispatchTriggerChange(editor, {
    type: 'starter',
    query: '',
    triggerOffset: 0
  });
}

/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Ported from `@carbon/ai-chat-components`' `tiptap/build-extensions.ts`.
 * Pure convenience helper: translates the four suggestion configs into a
 * `PromptLine`-compatible `@extensions` array. Cut from upstream: the
 * `tagExtensionSource`/equivalence-check tagging (`extension-equivalence.ts`,
 * not ported — this port's existing `@extensions` contract is already
 * "compared by reference, memoize it," so there's nothing extra to
 * reconcile). Enter-to-send is **not** included here — `PromptLine` bakes
 * `carbonChatEnter` into its own base bundle already.
 *
 * Leave a field out of `configs` to leave its extension out. Reached only
 * through a dynamic `import()` — see `carbon-mention.ts`'s class doc for why
 * this must never be statically imported from `PromptLine.gts` or the
 * components barrel.
 */

function buildCarbonExtensions(configs) {
  const out = [];
  if (configs.mention) {
    out.push(carbonMention(configs.mention));
  }
  if (configs.command) {
    out.push(carbonCommand(configs.command));
  }
  if (configs.autocomplete) {
    const excludeTriggers = [];
    if (configs.mention) {
      excludeTriggers.push({
        char: configs.mention.trigger,
        position: configs.mention.triggerPosition === 'start' ? 'start' : 'anywhere'
      });
    }
    if (configs.command) {
      excludeTriggers.push({
        char: configs.command.trigger,
        position: configs.command.triggerPosition === 'start' ? 'start' : 'anywhere'
      });
    }
    out.push(carbonAutocomplete(configs.autocomplete, excludeTriggers));
  }
  if (configs.starters) {
    out.push(carbonStarterTrigger(configs.starters.items, configs.starters.isOn));
  }
  return out;
}

export { buildCarbonExtensions as b };
