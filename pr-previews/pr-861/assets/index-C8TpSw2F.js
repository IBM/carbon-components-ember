import { a2 as Transaction, a3 as Text, O as StateEffect, g as syntaxTree, w as indentUnit, Z as Annotation, h as EditorSelection, a4 as Decoration, K as StateField, e as EditorView, u as Prec, v as keymap, _ as MapMode, a5 as WidgetType, Q as Facet, $ as RangeValue, b as LRParser, s as styleTags, t as tags, p as parseMixed, E as ExternalTokenizer, C as ContextTracker, L as LanguageSupport, a as LRLanguage, i as indentNodeProp, d as foldNodeProp, z as EditorState } from './index-Do7mdVNL.js';
import { c as css, h as htmlCompletionSource, b as html, a as cssLanguage } from './index-DIczsbTV.js';
import { p as parser$2, a as javascript, t as typescriptLanguage, j as javascriptLanguage } from './index-B39lEP9I.js';

/**
An instance of this is passed to completion source functions.
*/
class CompletionContext {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(
  /**
  The editor state that the completion happens in.
  */
  state,
  /**
  The position at which the completion is happening.
  */
  pos,
  /**
  Indicates whether completion was activated explicitly, or
  implicitly by typing. The usual way to respond to this is to
  only return completions when either there is part of a
  completable entity before the cursor, or `explicit` is true.
  */
  explicit,
  /**
  The editor view. May be undefined if the context was created
  in a situation where there is no such view available, such as
  in synchronous updates via
  [`CompletionResult.update`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.update)
  or when called by test code.
  */
  view) {
    this.state = state;
    this.pos = pos;
    this.explicit = explicit;
    this.view = view;
    /**
    @internal
    */
    this.abortListeners = [];
    /**
    @internal
    */
    this.abortOnDocChange = false;
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(types) {
    let token = syntaxTree(this.state).resolveInner(this.pos, -1);
    while (token && types.indexOf(token.name) < 0) token = token.parent;
    return token ? {
      from: token.from,
      to: this.pos,
      text: this.state.sliceDoc(token.from, this.pos),
      type: token.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(expr) {
    let line = this.state.doc.lineAt(this.pos);
    let start = Math.max(line.from, this.pos - 250);
    let str = line.text.slice(start - line.from, this.pos - line.from);
    let found = str.search(ensureAnchor(expr));
    return found < 0 ? null : {
      from: start + found,
      to: this.pos,
      text: str.slice(found)
    };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  
  By default, running queries will not be aborted for regular
  typing or backspacing, on the assumption that they are likely to
  return a result with a
  [`validFor`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.validFor) field that
  allows the result to be used after all. Passing `onDocChange:
  true` will cause this query to be aborted for any document
  change.
  */
  addEventListener(type, listener, options) {
    if (type == "abort" && this.abortListeners) {
      this.abortListeners.push(listener);
      if (options && options.onDocChange) this.abortOnDocChange = true;
    }
  }
}
// Make sure the given regexp has a $ at its end and, if `start` is
// true, a ^ at its start.
function ensureAnchor(expr, start) {
  var _a;
  let {
    source
  } = expr;
  let addEnd = source[source.length - 1] != "$";
  if (!addEnd) return expr;
  return new RegExp(`${""}(?:${source})${addEnd ? "$" : ""}`, (_a = expr.flags) !== null && _a !== void 0 ? _a : expr.ignoreCase ? "i" : "");
}
/**
This annotation is added to transactions that are produced by
picking a completion.
*/
const pickedCompletion = /*@__PURE__*/Annotation.define();
const baseTheme = /*@__PURE__*/EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: `${400 /* Info.Width */}px`,
    boxSizing: "border-box",
    whiteSpace: "pre-line"
  },
  ".cm-completionInfo.cm-completionInfo-left": {
    right: "100%"
  },
  ".cm-completionInfo.cm-completionInfo-right": {
    left: "100%"
  },
  ".cm-completionInfo.cm-completionInfo-left-narrow": {
    right: `${30 /* Info.Margin */}px`
  },
  ".cm-completionInfo.cm-completionInfo-right-narrow": {
    left: `${30 /* Info.Margin */}px`
  },
  "&light .cm-snippetField": {
    backgroundColor: "#00000022"
  },
  "&dark .cm-snippetField": {
    backgroundColor: "#ffffff22"
  },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": {
      content: "'ƒ'"
    }
  },
  ".cm-completionIcon-class": {
    "&:after": {
      content: "'○'"
    }
  },
  ".cm-completionIcon-interface": {
    "&:after": {
      content: "'◌'"
    }
  },
  ".cm-completionIcon-variable": {
    "&:after": {
      content: "'𝑥'"
    }
  },
  ".cm-completionIcon-constant": {
    "&:after": {
      content: "'𝐶'"
    }
  },
  ".cm-completionIcon-type": {
    "&:after": {
      content: "'𝑡'"
    }
  },
  ".cm-completionIcon-enum": {
    "&:after": {
      content: "'∪'"
    }
  },
  ".cm-completionIcon-property": {
    "&:after": {
      content: "'□'"
    }
  },
  ".cm-completionIcon-keyword": {
    "&:after": {
      content: "'🔑\uFE0E'"
    } // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": {
      content: "'▢'"
    }
  },
  ".cm-completionIcon-text": {
    "&:after": {
      content: "'abc'",
      fontSize: "50%",
      verticalAlign: "middle"
    }
  }
});
class FieldPos {
  constructor(field, line, from, to) {
    this.field = field;
    this.line = line;
    this.from = from;
    this.to = to;
  }
}
class FieldRange {
  constructor(field, from, to) {
    this.field = field;
    this.from = from;
    this.to = to;
  }
  map(changes) {
    let from = changes.mapPos(this.from, -1, MapMode.TrackDel);
    let to = changes.mapPos(this.to, 1, MapMode.TrackDel);
    return from == null || to == null ? null : new FieldRange(this.field, from, to);
  }
}
class Snippet {
  constructor(lines, fieldPositions) {
    this.lines = lines;
    this.fieldPositions = fieldPositions;
  }
  instantiate(state, pos) {
    let text = [],
      lineStart = [pos];
    let lineObj = state.doc.lineAt(pos),
      baseIndent = /^\s*/.exec(lineObj.text)[0];
    for (let line of this.lines) {
      if (text.length) {
        let indent = baseIndent,
          tabs = /^\t*/.exec(line)[0].length;
        for (let i = 0; i < tabs; i++) indent += state.facet(indentUnit);
        lineStart.push(pos + indent.length - tabs);
        line = indent + line.slice(tabs);
      }
      text.push(line);
      pos += line.length + 1;
    }
    let ranges = this.fieldPositions.map(pos => new FieldRange(pos.field, lineStart[pos.line] + pos.from, lineStart[pos.line] + pos.to));
    return {
      text,
      ranges
    };
  }
  static parse(template) {
    let fields = [];
    let lines = [],
      positions = [],
      m;
    for (let line of template.split(/\r\n?|\n/)) {
      while (m = /[#$]\{(?:(\d+)(?::([^{}]*))?|((?:\\[{}]|[^{}])*))\}/.exec(line)) {
        let seq = m[1] ? +m[1] : null,
          rawName = m[2] || m[3] || "",
          found = -1;
        let name = rawName.replace(/\\[{}]/g, m => m[1]);
        for (let i = 0; i < fields.length; i++) {
          if (seq != null ? fields[i].seq == seq : name ? fields[i].name == name : false) found = i;
        }
        if (found < 0) {
          let i = 0;
          while (i < fields.length && (seq == null || fields[i].seq != null && fields[i].seq < seq)) i++;
          fields.splice(i, 0, {
            seq,
            name
          });
          found = i;
          for (let pos of positions) if (pos.field >= found) pos.field++;
        }
        for (let pos of positions) if (pos.line == lines.length && pos.from > m.index) {
          let snip = m[2] ? 3 + (m[1] || "").length : 2;
          pos.from -= snip;
          pos.to -= snip;
        }
        positions.push(new FieldPos(found, lines.length, m.index, m.index + name.length));
        line = line.slice(0, m.index) + rawName + line.slice(m.index + m[0].length);
      }
      line = line.replace(/\\([{}])/g, (_, brace, index) => {
        for (let pos of positions) if (pos.line == lines.length && pos.from > index) {
          pos.from--;
          pos.to--;
        }
        return brace;
      });
      lines.push(line);
    }
    return new Snippet(lines, positions);
  }
}
let fieldMarker = /*@__PURE__*/Decoration.widget({
  widget: /*@__PURE__*/new class extends WidgetType {
    toDOM() {
      let span = document.createElement("span");
      span.className = "cm-snippetFieldPosition";
      return span;
    }
    ignoreEvent() {
      return false;
    }
  }()
});
let fieldRange = /*@__PURE__*/Decoration.mark({
  class: "cm-snippetField"
});
class ActiveSnippet {
  constructor(ranges, active) {
    this.ranges = ranges;
    this.active = active;
    this.deco = Decoration.set(ranges.map(r => (r.from == r.to ? fieldMarker : fieldRange).range(r.from, r.to)), true);
  }
  map(changes) {
    let ranges = [];
    for (let r of this.ranges) {
      let mapped = r.map(changes);
      if (!mapped) return null;
      ranges.push(mapped);
    }
    return new ActiveSnippet(ranges, this.active);
  }
  selectionInsideField(sel) {
    return sel.ranges.every(range => this.ranges.some(r => r.field == this.active && r.from <= range.from && r.to >= range.to));
  }
}
const setActive = /*@__PURE__*/StateEffect.define({
  map(value, changes) {
    return value && value.map(changes);
  }
});
const moveToField = /*@__PURE__*/StateEffect.define();
const snippetState = /*@__PURE__*/StateField.define({
  create() {
    return null;
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(setActive)) return effect.value;
      if (effect.is(moveToField) && value) return new ActiveSnippet(value.ranges, effect.value);
    }
    if (value && tr.docChanged) value = value.map(tr.changes);
    if (value && tr.selection && !value.selectionInsideField(tr.selection)) value = null;
    return value;
  },
  provide: f => EditorView.decorations.from(f, val => val ? val.deco : Decoration.none)
});
function fieldSelection(ranges, field) {
  return EditorSelection.create(ranges.filter(r => r.field == field).map(r => EditorSelection.range(r.from, r.to)));
}
/**
Convert a snippet template to a function that can
[apply](https://codemirror.net/6/docs/ref/#autocomplete.Completion.apply) it. Snippets are written
using syntax like this:

    "for (let ${index} = 0; ${index} < ${end}; ${index}++) {\n\t${}\n}"

Each `${}` placeholder (you may also use `#{}`) indicates a field
that the user can fill in. Its name, if any, will be the default
content for the field.

When the snippet is activated by calling the returned function,
the code is inserted at the given position. Newlines in the
template are indented by the indentation of the start line, plus
one [indent unit](https://codemirror.net/6/docs/ref/#language.indentUnit) per tab character after
the newline.

On activation, (all instances of) the first field are selected.
The user can move between fields with Tab and Shift-Tab as long as
the fields are active. Moving to the last field or moving the
cursor out of the current field deactivates the fields.

The order of fields defaults to textual order, but you can add
numbers to placeholders (`${1}` or `${1:defaultText}`) to provide
a custom order.

To include a literal `{` or `}` in your template, put a backslash
in front of it. This will be removed and the brace will not be
interpreted as indicating a placeholder.
*/
function snippet(template) {
  let snippet = Snippet.parse(template);
  return (editor, completion, from, to) => {
    let {
      text,
      ranges
    } = snippet.instantiate(editor.state, from);
    let {
      main
    } = editor.state.selection;
    let spec = {
      changes: {
        from,
        to: to == main.from ? main.to : to,
        insert: Text.of(text)
      },
      scrollIntoView: true,
      annotations: completion ? [pickedCompletion.of(completion), Transaction.userEvent.of("input.complete")] : undefined
    };
    if (ranges.length) spec.selection = fieldSelection(ranges, 0);
    if (ranges.some(r => r.field > 0)) {
      let active = new ActiveSnippet(ranges, 0);
      let effects = spec.effects = [setActive.of(active)];
      if (editor.state.field(snippetState, false) === undefined) effects.push(StateEffect.appendConfig.of([snippetState, addSnippetKeymap, snippetPointerHandler, baseTheme]));
    }
    editor.dispatch(editor.state.update(spec));
  };
}
function moveField(dir) {
  return ({
    state,
    dispatch
  }) => {
    let active = state.field(snippetState, false);
    if (!active || dir < 0 && active.active == 0) return false;
    let next = active.active + dir,
      last = dir > 0 && !active.ranges.some(r => r.field == next + dir);
    dispatch(state.update({
      selection: fieldSelection(active.ranges, next),
      effects: setActive.of(last ? null : new ActiveSnippet(active.ranges, next)),
      scrollIntoView: true
    }));
    return true;
  };
}
/**
A command that clears the active snippet, if any.
*/
const clearSnippet = ({
  state,
  dispatch
}) => {
  let active = state.field(snippetState, false);
  if (!active) return false;
  dispatch(state.update({
    effects: setActive.of(null)
  }));
  return true;
};
/**
Move to the next snippet field, if available.
*/
const nextSnippetField = /*@__PURE__*/moveField(1);
/**
Move to the previous snippet field, if available.
*/
const prevSnippetField = /*@__PURE__*/moveField(-1);
const defaultSnippetKeymap = [{
  key: "Tab",
  run: nextSnippetField,
  shift: prevSnippetField
}, {
  key: "Escape",
  run: clearSnippet
}];
/**
A facet that can be used to configure the key bindings used by
snippets. The default binds Tab to
[`nextSnippetField`](https://codemirror.net/6/docs/ref/#autocomplete.nextSnippetField), Shift-Tab to
[`prevSnippetField`](https://codemirror.net/6/docs/ref/#autocomplete.prevSnippetField), and Escape
to [`clearSnippet`](https://codemirror.net/6/docs/ref/#autocomplete.clearSnippet).
*/
const snippetKeymap = /*@__PURE__*/Facet.define({
  combine(maps) {
    return maps.length ? maps[0] : defaultSnippetKeymap;
  }
});
const addSnippetKeymap = /*@__PURE__*/Prec.highest(/*@__PURE__*/keymap.compute([snippetKeymap], state => state.facet(snippetKeymap)));
/**
Create a completion from a snippet. Returns an object with the
properties from `completion`, plus an `apply` function that
applies the snippet.
*/
function snippetCompletion(template, completion) {
  return {
    ...completion,
    apply: snippet(template)
  };
}
const snippetPointerHandler = /*@__PURE__*/EditorView.domEventHandlers({
  mousedown(event, view) {
    let active = view.state.field(snippetState, false),
      pos;
    if (!active || (pos = view.posAtCoords({
      x: event.clientX,
      y: event.clientY
    })) == null) return false;
    let match = active.ranges.find(r => r.from <= pos && r.to >= pos);
    if (!match || match.field == active.active) return false;
    view.dispatch({
      selection: fieldSelection(active.ranges, match.field),
      effects: setActive.of(active.ranges.some(r => r.field > match.field) ? new ActiveSnippet(active.ranges, match.field) : null),
      scrollIntoView: true
    });
    return true;
  }
});
const closedBracket = /*@__PURE__*/new class extends RangeValue {}();
closedBracket.startSide = 1;
closedBracket.endSide = -1;

const expressionHighlighting = styleTags({
  'AtKeyword import charset namespace keyframes media supports': tags.definitionKeyword,
  NumberLiteral: tags.number,
  KeywordQuery: tags.keyword,
  VariableName: tags.variableName,
  '( )': tags.paren,
  '[ ]': tags.squareBracket,
  '{ }': tags.brace,
  // TODO
  Argument: tags.propertyName,
  yield: tags.operatorKeyword,
  outlet: tags.operatorKeyword,
  component: tags.function(tags.definitionKeyword),
  modifier: tags.function(tags.definitionKeyword),
  helper: tags.function(tags.definitionKeyword),
  hash: tags.function(tags.definitionKeyword),
  array: tags.function(tags.definitionKeyword),
  on: tags.function(tags.definitionKeyword),
  concat: tags.function(tags.operatorKeyword)
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const spec_identifier$1 = {
  __proto__: null,
  this: 24,
  as: 26,
  if: 28,
  unless: 30,
  else: 32,
  let: 34,
  and: 36,
  or: 38,
  not: 40,
  eq: 42,
  neq: 44,
  "not-eq": 46,
  gt: 48,
  gte: 50,
  lt: 52,
  lte: 54,
  array: 56,
  concat: 58,
  hash: 60,
  each: 62,
  "each-in": 64,
  on: 66,
  modifier: 68,
  component: 70,
  helper: 72,
  "in-element": 74,
  debugger: 76,
  yield: 78,
  outlet: 80
};
const parser$1 = LRParser.deserialize({
  version: 14,
  states: "%WQVOPOOO%xQPO'#C_O&SOPO'#CdO&XOQO'#CeO&aOSO'#CeOOOO'#C^'#C^OOOO'#DV'#DVQVOPOOOOOO'#Dc'#DcOOOO,58y,58yO&iQPO,58yO&tQPO,58yOOOO,59O,59OOOOO'#DW'#DWO&|OQO'#CfOOOO,59P,59PO'UOPO,59POOOO'#DX'#DXO'ZOSO'#CgO'cOPO,59POOOO-E7T-E7TOVQPO1G.eOOOO1G.e1G.eO'hQPO1G.eOOOO-E7U-E7UOOOO1G.k1G.kOOOO-E7V-E7VO'mQPO7+$POVQPO7+$POOOO<<Gk<<GkO'rQPO<<GkOOOOAN=VAN=V",
  stateData: "'z~O!OOS~OSPOTTOVTO[WO]WO^WO_WO`WOaWObWOcWOdWOeWOfWOgWOhWOiWOjWOkWOlWOmWOnWOoWOpWOqWOrWOsWOtWOuWOvWOwWOxWO!PTO!QQO!RRO!TSO~OSPOTTOVTO[WO]WO^WO_WO`WOaWObWOcWOdWOeWOfWOgWOhWOiWOjWOkWOlWOmWOnWOoWOpWOqWOrWOsWOtWOuWOvWOwWOxWO!QQO!RRO!TSO~OUXO!PYO~P#iO!P[O~O!R_O!S]O~O!T_O!UaO~OTeOUQX!PQX~OUfO!PgO~O!S]O!RYX~O!RiO~O!UaO!TZX~O!TiO~OTlO~OUmO~OUoO~O!S!U~",
  goto: "#V!WPP!X!fPPPP!f!f!m!pPPPPPPPPPPPPPPPPPPPPPPPPPPPPP!s!y#PPPPPPPPPP!fSUOVQZPQkeRnlZTOPVelR`RRcSQVORdVQ^RRh^QbSRjb",
  nodeNames: "⚠ Expression SExpression CallExpression ( Is ) Pipe Argument String AttributeValueContent AttributeValueContent this as if unless else let and or not eq neq not-eq gt gte lt lte array concat hash each each-in on modifier component helper in-element debugger yield outlet",
  maxTerm: 53,
  nodeProps: [["closedBy", 4, "("], ["openedBy", 6, ")"]],
  propSources: [expressionHighlighting],
  skippedNodes: [0],
  repeatNodeCount: 3,
  tokenData: "'`VRuOX#fX^#m^p#fpq#mqr#frs%Zsv#fwx%bxy%iyz%rz!_#f!_!`%{!`!b#f!b!c&U!c!}&_!}#T#f#T#o&_#p#q'P#q#y#f#y#z#m#z$f#f$f$g#m$g#BY#f#BY#BZ#m#BZ$IS#f$IS$I_#m$I_$I|#f$I|$JO#m$JO$JT#f$JT$JU#m$JU$KV#f$KV$KW#m$KW&FU#f&FU&FV#m&FV;'S#f;'S;=`'Y<%lO#fU#mO!SQ!USV#vY!OP!SQ!USX^$fpq$f#y#z$f$f$g$f#BY#BZ$f$IS$I_$f$I|$JO$f$JT$JU$f$KV$KW$f&FU&FV$fP$kY!OPX^$fpq$f#y#z$f$f$g$f#BY#BZ$f$IS$I_$f$I|$JO$f$JT$JU$f$KV$KW$f&FU&FV$fV%bO!RR!USV%iO!TT!SQV%rOSP!SQ!USV%{OUP!SQ!USV&UOTP!SQ!USV&_O!QP!SQ!USV&hR!PP!SQ!US!Q![&q!c!}&q#T#o&qP&vR!PP!Q![&q!c!}&q#T#o&qV'YOVP!SQ!USU']P;=`<%l#f",
  tokenizers: [0, 1, 2],
  topRules: {
    "Expression": [0, 1]
  },
  specialized: [{
    term: 47,
    get: value => spec_identifier$1[value] || -1
  }],
  tokenPrec: 315
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const scriptText = 141,
  StartCloseScriptTag = 1,
  styleText = 142,
  StartCloseStyleTag = 2,
  textareaText = 143,
  StartCloseTextareaTag = 3,
  StartTag = 4,
  StartScriptTag = 5,
  StartStyleTag = 6,
  StartTextareaTag = 7,
  StartSelfClosingTag = 8,
  StartCloseTag = 9,
  MismatchedStartCloseTag = 11,
  missingCloseTag = 144,
  IncompleteCloseTag = 12,
  commentContent$1 = 145,
  moustacheCommentContent$1 = 146,
  longMoustacheCommentContent$1 = 147,
  LongExpression = 13,
  ShortExpression = 14,
  Element = 63,
  ScriptText = 106,
  StyleText = 109,
  TextareaText = 112,
  OpenTag = 114;
const selfClosers = {
  area: true,
  base: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
  menuitem: true
};
const implicitlyClosed = {
  dd: true,
  li: true,
  optgroup: true,
  option: true,
  p: true,
  rp: true,
  rt: true,
  tbody: true,
  td: true,
  tfoot: true,
  th: true,
  tr: true
};
const closeOnOpen = {
  dd: {
    dd: true,
    dt: true
  },
  dt: {
    dd: true,
    dt: true
  },
  li: {
    li: true
  },
  option: {
    option: true,
    optgroup: true
  },
  optgroup: {
    optgroup: true
  },
  p: {
    address: true,
    article: true,
    aside: true,
    blockquote: true,
    dir: true,
    div: true,
    dl: true,
    fieldset: true,
    footer: true,
    form: true,
    h1: true,
    h2: true,
    h3: true,
    h4: true,
    h5: true,
    h6: true,
    header: true,
    hgroup: true,
    hr: true,
    menu: true,
    nav: true,
    ol: true,
    p: true,
    pre: true,
    section: true,
    table: true,
    ul: true
  },
  rp: {
    rp: true,
    rt: true
  },
  rt: {
    rp: true,
    rt: true
  },
  tbody: {
    tbody: true,
    tfoot: true
  },
  td: {
    td: true,
    th: true
  },
  tfoot: {
    tbody: true
  },
  th: {
    td: true,
    th: true
  },
  thead: {
    tbody: true,
    tfoot: true
  },
  tr: {
    tr: true
  }
};
function nameChar(ch) {
  return ch == 45 || ch == 46 || ch == 58 || ch >= 65 && ch <= 90 || ch == 95 || ch >= 97 && ch <= 122 || ch >= 161;
}
function isSpace(ch) {
  return ch == 9 || ch == 10 || ch == 13 || ch == 32;
}
let cachedName = null,
  cachedInput = null,
  cachedPos = 0;
function tagNameAfter(input, offset) {
  let pos = input.pos + offset;
  if (cachedPos == pos && cachedInput == input) return cachedName;
  let next = input.peek(offset);
  while (isSpace(next)) next = input.peek(++offset);
  let name = '';
  for (;;) {
    if (!nameChar(next)) break;
    name += String.fromCharCode(next);
    next = input.peek(++offset);
  }

  // Undefined to signal there's a <? or <!, null for just missing
  cachedInput = input;
  cachedPos = pos;
  return cachedName = name ? name.toLowerCase() : next == question || next == bang ? undefined : null;
}
const lessThan = 60,
  greaterThan$1 = 62,
  slash$1 = 47,
  question = 63,
  bang = 33;
// dash = 45;

function ElementContext(name, parent) {
  this.name = name;
  this.parent = parent;
  this.hash = parent ? parent.hash : 0;
  for (let i = 0; i < name.length; i++) this.hash += (this.hash << 4) + name.charCodeAt(i) + (name.charCodeAt(i) << 8);
}
const startTagTerms = [StartTag, StartSelfClosingTag, StartScriptTag, StartStyleTag, StartTextareaTag];
const elementContext = /*@__PURE__*/new ContextTracker({
  start: null,
  shift(context, term, stack, input) {
    return startTagTerms.indexOf(term) > -1 ? new ElementContext(tagNameAfter(input, 1) || '', context) : context;
  },
  reduce(context, term) {
    return term == Element && context ? context.parent : context;
  },
  reuse(context, node, stack, input) {
    let type = node.type.id;
    return type == StartTag || type == OpenTag ? new ElementContext(tagNameAfter(input, 1) || '', context) : context;
  },
  hash(context) {
    return context ? context.hash : 0;
  },
  strict: false
});
const tagStart = /*@__PURE__*/new ExternalTokenizer((input, stack) => {
  if (input.next != lessThan) {
    // End of file, close any open tags
    if (input.next < 0 && stack.context) input.acceptToken(missingCloseTag);
    return;
  }
  input.advance();
  let close = input.next == slash$1;
  if (close) input.advance();
  let name = tagNameAfter(input, 0);
  if (name === undefined) return;
  if (!name) return input.acceptToken(close ? IncompleteCloseTag : StartTag);
  let parent = stack.context ? stack.context.name : null;
  if (close) {
    if (name == parent) return input.acceptToken(StartCloseTag);
    if (parent && implicitlyClosed[parent]) return input.acceptToken(missingCloseTag, -2);
    // if (stack.dialectEnabled(Dialect_noMatch)) return input.acceptToken(NoMatchStartCloseTag)
    for (let cx = stack.context; cx; cx = cx.parent) if (cx.name == name) return;
    input.acceptToken(MismatchedStartCloseTag);
  } else {
    if (name == 'script') return input.acceptToken(StartScriptTag);
    if (name == 'style') return input.acceptToken(StartStyleTag);
    if (name == 'textarea') return input.acceptToken(StartTextareaTag);
    if (name in selfClosers) return input.acceptToken(StartSelfClosingTag);
    if (parent && closeOnOpen[parent] && closeOnOpen[parent][name]) input.acceptToken(missingCloseTag, -1);else input.acceptToken(StartTag);
  }
}, {
  contextual: true
});
function contentTokenizer(tag, textToken, endToken) {
  let lastState = 2 + tag.length;
  return new ExternalTokenizer(input => {
    // state means:
    // - 0 nothing matched
    // - 1 '<' matched
    // - 2 '</' + possibly whitespace matched
    // - 3-(1+tag.length) part of the tag matched
    // - lastState whole tag + possibly whitespace matched
    for (let state = 0, matchedLen = 0, i = 0;; i++) {
      if (input.next < 0) {
        if (i) input.acceptToken(textToken);
        break;
      }
      if (state == 0 && input.next == lessThan || state == 1 && input.next == slash$1 || state >= 2 && state < lastState && input.next == tag.charCodeAt(state - 2)) {
        state++;
        matchedLen++;
      } else if ((state == 2 || state == lastState) && isSpace(input.next)) {
        matchedLen++;
      } else if (state == lastState && input.next == greaterThan$1) {
        if (i > matchedLen) input.acceptToken(textToken, -matchedLen);else input.acceptToken(endToken, -(matchedLen - 2));
        break;
      } else if ((input.next == 10 /* '\n' */ || input.next == 13 /* '\r' */) && i) {
        input.acceptToken(textToken, 1);
        break;
      } else {
        state = matchedLen = 0;
      }
      input.advance();
    }
  });
}
const scriptTokens = /*@__PURE__*/contentTokenizer('script', scriptText, StartCloseScriptTag);
const styleTokens = /*@__PURE__*/contentTokenizer('style', styleText, StartCloseStyleTag);
const textareaTokens = /*@__PURE__*/contentTokenizer('textarea', textareaText, StartCloseTextareaTag);
const space = [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288];
const parenOpen = 40;
const parenClose = 41;
const squareOpen = 91;
const squareClose = 93;
const curlyOpen = 123;
const curlyClose = 125;
const comma = 44;
const colon = 58;
const hash = 35;
const at = 64;
const slash = 47;
const greaterThan = 62;
const dash = 45;
const quoteDouble = 34;
const quoteSingle = 39;
const backslash = 92;
const newline = 10;
const asterisk = 42;
const tick = 96;
const prefixes = [colon, hash, at, slash];
function scanTo(type, end) {
  return new ExternalTokenizer(input => {
    for (let endPos = 0, len = 0;; len++) {
      if (input.next < 0) {
        if (len) input.acceptToken(type);
        break;
      }
      if (input.next == end.charCodeAt(endPos)) {
        endPos++;
        if (endPos == end.length) {
          if (len >= end.length) input.acceptToken(type, 1 - end.length);
          break;
        }
      } else {
        endPos = input.next == end.charCodeAt(0) ? 1 : 0;
      }
      input.advance();
    }
  });
}
const moustacheCommentContent = /*@__PURE__*/scanTo(moustacheCommentContent$1, '}}');
const longMoustacheCommentContent = /*@__PURE__*/scanTo(longMoustacheCommentContent$1, '--}}');
const commentContent = /*@__PURE__*/new ExternalTokenizer(input => {
  for (let dashes = 0, i = 0;; i++) {
    if (input.next < 0) {
      if (i) input.acceptToken(commentContent$1);
      break;
    }
    if (input.next == dash) {
      dashes++;
    } else if (input.next == greaterThan && dashes >= 2) {
      if (i > 3) input.acceptToken(commentContent$1, -2);
      break;
    } else {
      dashes = 0;
    }
    input.advance();
  }
});
// TODO: string handler does not handle interpolation
function createStringHandler(input) {
  let inString = false;
  let inStringType = null;
  let inStringIgnoreNext = false;
  return () => {
    if (inString) {
      if (inStringIgnoreNext) {
        inStringIgnoreNext = false;
        return true;
      }
      if (input.next === backslash) {
        inStringIgnoreNext = true;
        return true;
      }
      if (inStringType === 'double' && input.next === quoteDouble) {
        inString = false;
        inStringType = null;
        return true;
      }
      if (inStringType === 'single' && input.next === quoteSingle) {
        inString = false;
        inStringType = null;
        return true;
      }
      if (inStringType === 'template' && input.next === tick) {
        inString = false;
        inStringType = null;
        return true;
      }
      return true;
    }
    if (input.next === quoteDouble) {
      inString = true;
      inStringType = 'double';
      return true;
    }
    if (input.next === quoteSingle) {
      inString = true;
      inStringType = 'single';
      return true;
    }
    if (input.next === tick) {
      inString = true;
      inStringType = 'template';
      return true;
    }
    return false;
  };
}
function createCommentHandler(input) {
  let inLineComment = false;
  let inBlockComment = false;
  return () => {
    if (inLineComment) {
      if (input.next === newline) {
        inLineComment = false;
        return true;
      }
      return true;
    }
    if (inBlockComment) {
      if (input.next === asterisk && input.peek(1) === slash) {
        inBlockComment = false;
        return true;
      }
      return true;
    }
    if (input.next === slash && input.peek(1) === slash) {
      inLineComment = true;
      return true;
    }
    if (input.next === slash && input.peek(1) === asterisk) {
      inBlockComment = true;
      return true;
    }
    return false;
  };
}
// closes on a delimiter that probably isn't in the expression
const longExpression = /*@__PURE__*/new ExternalTokenizer(input => {
  if (prefixes.includes(input.next)) {
    return;
  }
  const commentHandler = createCommentHandler(input);
  const stringHandler = createStringHandler(input);
  let stack = [];
  const popIfMatch = match => {
    const idx = stack.lastIndexOf(match);
    if (idx !== -1) {
      while (stack.length > idx) {
        stack.pop();
      }
    }
  };
  for (let pos = 0;; pos++) {
    // end of input
    if (input.next < 0) {
      if (pos > 0) input.acceptToken(LongExpression);
      break;
    }
    if (commentHandler() || stringHandler()) {
      input.advance();
      continue;
    }
    if (stack.length === 0 && (input.next === curlyClose || input.next === parenClose || input.next === squareClose)) {
      input.acceptToken(LongExpression);
      break;
    }
    // prettier-ignore
    switch (input.next) {
      case parenOpen:
        stack.push("(");
        break;
      case parenClose:
        popIfMatch("(");
        break;
      case squareOpen:
        stack.push("[");
        break;
      case squareClose:
        popIfMatch("[");
        break;
      case curlyOpen:
        stack.push("{");
        break;
      case curlyClose:
        popIfMatch("{");
        break;
    }
    input.advance();
  }
});
// same as long expression but will close on either a space or comma
// that is reasonably not inside of the expression
const shortExpression = /*@__PURE__*/new ExternalTokenizer(input => {
  if (prefixes.includes(input.peek(0))) {
    return;
  }
  const commentHandler = createCommentHandler(input);
  const stringHandler = createStringHandler(input);
  let stack = [];
  const popIfMatch = match => {
    const idx = stack.lastIndexOf(match);
    if (idx !== -1) {
      while (stack.length > idx) {
        stack.pop();
      }
    }
  };
  for (let pos = 0;; pos++) {
    // end of input
    if (input.next < 0) {
      if (pos > 0) input.acceptToken(ShortExpression);
      break;
    }
    if (commentHandler() || stringHandler()) {
      input.advance();
      continue;
    }
    if (stack.length === 0 && (input.next === curlyClose || input.next === parenClose || input.next === squareClose || input.next === comma)) {
      input.acceptToken(ShortExpression);
      break;
    }
    // prettier-ignore
    switch (input.next) {
      case parenOpen:
        stack.push("(");
        break;
      case parenClose:
        popIfMatch("(");
        break;
      case squareOpen:
        stack.push("[");
        break;
      case squareClose:
        popIfMatch("[");
        break;
      case curlyOpen:
        stack.push("{");
        break;
      case curlyClose:
        popIfMatch("{");
        break;
    }
    if (pos !== 0 && stack.length === 0 && space.includes(input.next)) {
      input.acceptToken(ShortExpression);
      break;
    }
    input.advance();
  }
});
const svelteHighlighting = /*@__PURE__*/styleTags({
  Comment: tags.blockComment,
  MoustacheComment: tags.blockComment,
  LongMoustacheComment: tags.blockComment,
  /**
  //
  */
  // TODO: need to verify
  Splattributes: tags.derefOperator,
  ArgName: tags.attributeName,
  Argument: tags.propertyName,
  NamedBlock: tags.tagName,
  Pipe: tags.definitionOperator,
  as: tags.definitionOperator,
  let: /*@__PURE__*/tags.function(tags.definitionOperator),
  this: tags.self,
  yield: tags.operatorKeyword,
  outlet: tags.operatorKeyword,
  component: /*@__PURE__*/tags.function(tags.definitionKeyword),
  modifier: /*@__PURE__*/tags.function(tags.definitionKeyword),
  helper: /*@__PURE__*/tags.function(tags.definitionKeyword),
  hash: /*@__PURE__*/tags.function(tags.definitionKeyword),
  array: /*@__PURE__*/tags.function(tags.definitionKeyword),
  on: /*@__PURE__*/tags.function(tags.definitionKeyword),
  concat: /*@__PURE__*/tags.function(tags.operatorKeyword),
  // 'if then catch unless else each each-in': t.controlKeyword,
  /**
  //
  */
  // TODO: is nededed?
  'Text RawText': tags.content,
  'StartTag StartCloseTag SelfClosingEndTag EndTag': tags.angleBracket,
  TagName: tags.tagName,
  'MismatchedCloseTag/TagName': [tags.tagName, tags.invalid],
  AttributeName: tags.attributeName,
  UnquotedAttributeValue: tags.attributeValue,
  'DoubleQuote SingleQuote AttributeValueContent': tags.attributeValue,
  Is: tags.definitionOperator,
  'EntityReference CharacterReference': tags.character,
  ProcessingInst: tags.processingInstruction,
  DoctypeDecl: tags.documentMeta,
  '{ }': tags.bracket,
  '[ ]': tags.squareBracket,
  '( )': tags.paren,
  '| , :': tags.punctuation,
  '...': tags.derefOperator,
  ComponentName: tags.className,
  SvelteElementNamespace: tags.namespace,
  SvelteElementType: tags.tagName,
  StyleAttributeName: tags.propertyName,
  BlockType: tags.controlKeyword,
  BlockPrefix: tags.typeOperator,
  'UnknownBlock/BlockType': tags.invalid,
  UnknownBlockContent: tags.invalid,
  'if then catch': tags.controlKeyword,
  Variable: tags.variableName,
  Modifier: tags.modifier,
  DirectlyInterpolatedAttributeValue: tags.attributeValue,
  'DirectiveOn/DirectiveName': tags.controlKeyword,
  'DirectiveOn/DirectiveTarget': tags.typeName,
  'DirectiveUse/DirectiveName': tags.controlKeyword,
  'DirectiveUse/DirectiveTarget': /*@__PURE__*/tags.function(tags.variableName),
  'DirectiveBind/DirectiveName': tags.controlKeyword,
  'DirectiveBind/DirectiveTarget': tags.variableName,
  'DirectiveLet/DirectiveName': tags.definitionKeyword,
  'DirectiveLet/DirectiveTarget': /*@__PURE__*/tags.definition(tags.variableName),
  'DirectiveTransition/DirectiveName': tags.operatorKeyword,
  'DirectiveTransition/DirectiveTarget': /*@__PURE__*/tags.function(tags.variableName),
  'DirectiveIn/DirectiveName': tags.operatorKeyword,
  'DirectiveIn/DirectiveTarget': /*@__PURE__*/tags.function(tags.variableName),
  'DirectiveOut/DirectiveName': tags.operatorKeyword,
  'DirectiveOut/DirectiveTarget': /*@__PURE__*/tags.function(tags.variableName),
  'DirectiveAnimate/DirectiveName': tags.operatorKeyword,
  'DirectiveAnimate/DirectiveTarget': /*@__PURE__*/tags.function(tags.variableName),
  'DirectiveClass/DirectiveName': tags.attributeName,
  'DirectiveClass/DirectiveTarget': tags.variableName,
  'DirectiveStyle/DirectiveName': tags.attributeName,
  'DirectiveStyle/DirectiveTarget': tags.propertyName
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const spec_BlockPrefix = {
  __proto__: null,
  "#": 41,
  ":": 51,
  "/": 59
};
const spec_BlockType = {
  __proto__: null,
  if: 44,
  else: 52,
  unless: 64,
  let: 72,
  each: 80,
  "each-in": 98,
  "in-element": 106
};
const spec_identifier = {
  __proto__: null,
  if: 54,
  as: 82
};
const spec_AttributeName = {
  __proto__: null,
  on: 313,
  bind: 317,
  let: 319,
  class: 321,
  style: 323,
  use: 325,
  transition: 327,
  in: 329,
  out: 331,
  animate: 333
};
const parser = /*@__PURE__*/LRParser.deserialize({
  version: 14,
  states: "H[QVO,^OOO!dO,^O'#ClO#nO,^O'#CzO$xO,^O'#DOO&SO,^O'#DSO'^O,^O'#D]O(hO,^O'#DaO)rQ:QO'#DeO)wQ:QO'#DfO*SQ7[O'#DnO*XQ7[O'#ElO*^Q7[O'#EoO*cQMhO'#ErO*nQ7[O'#EvO*sOXO'#DmO+OOYO'#DmO+ZO[O'#DmO,sO,^O'#DmOOOW'#Dm'#DmO,zO8nO'#ExO-SO7|O'#EyO-[O7lO'#EzO*cQMhO'#E|O*cQMhO'#E}OOOW'#Fh'#FhOOOW'#FP'#FPQVO,^OOOOOW'#FQ'#FQO!dO,^O,59WOOOW,59W,59WO-uQ!NvO'#DfO#nO,^O,59fOOOW,59f,59fO-|Q!NvO'#DfOOOW'#FR'#FRO$xO,^O,59jOOOW,59j,59jO.TQ:QO'#DfO&SO,^O,59nOOOW,59n,59nO.cQ!NvO'#DfO'^O,^O,59wOOOW,59w,59wO.jQ!NvO'#DfO(hO,^O,59{OOOW,59{,59{O.qQ:QO'#DfO/PQMhO,5:PO/UQ!LQO,5:QO/ZQ!LQO,5:RO/`Q!LQO,59XO0rQ$ISO,5:YO0yQ$ISO,5;WO1QQ$ISO,5;ZOOQO'#F}'#F}O1XQ$ISO,5;^O1cQ$ISO,5;bOOOX'#FW'#FWO1jOXO'#EjO1uOXO,5:XOOOY'#FX'#FXO1}OYO'#EmO2YOYO,5:XOOO['#FY'#FYO2bO[O'#EpO2mO[O,5:XO2uO,^O,5:XO*cQMhO'#EuOOOW,5:X,5:XOOO!b'#FZ'#FZO2|O8nO,5;dOOOW,5;d,5;dOOOp'#F['#F[O3UO7|O,5;eOOOW,5;e,5;eOOO`'#F]'#F]O3^O7lO,5;fOOOW,5;f,5;fO3fQMhO,5;hO3kQMhO,5;iOOOW-E8}-E8}OOOW-E9O-E9OOOOW1G.r1G.rO3pQ(CWO,59`O3xQ!LQO,59`O3}Q!LQO,59dOOOW1G/Q1G/QO4SQ!LQO,59iOOOW-E9P-E9POOOW1G/U1G/UO4XQ!LQO,59mOOOW1G/Y1G/YO4^Q!LQO,59vOOOW1G/c1G/cO4cQ!LQO,59zOOOW1G/g1G/gO4hQ!LQO,5:OOOOW1G/k1G/kOOOW1G/l1G/lO4mQ07`O1G/mO4uQ:QO1G.sO4zQ:QO1G/RO5PQ:QO1G/VO5UQ<vO1G/ZO5ZQ<vO1G/dO5`Q:QO1G/hO5eQ(CWO'#DpOOOO'#Dt'#DtO5mO$ISO'#DsOOOO'#Dx'#DxO5rO$ISO'#DwOOOO'#Dz'#DzO5wO$ISO'#DyOOOO'#D|'#D|O5|O$ISO'#D{OOOO'#EO'#EOO6RO$ISO'#D}OOOO'#EQ'#EQO6WO$ISO'#EPOOOO'#ES'#ESO6]O$ISO'#EROOOO'#EU'#EUO6bO$ISO'#ETOOOO'#EW'#EWO6gO$ISO'#EVOOOO'#EY'#EYO6lO$ISO'#EXO6qQ$ISO'#DrO7{Q$ISO'#EdO9SQ$ISO'#EfO:^Q?MpO'#EgOOQO'#Fl'#FlOOQO'#FS'#FSO:cQ$ISO1G/tOOOX1G/t1G/tOOQO'#Fm'#FmO:jQ$ISO1G0rOOOY1G0r1G0rO:qQ$ISO1G0uOOO[1G0u1G0uO:xQ$ISO1G0xOOOW1G0x1G0xOOOW1G0|1G0|O;SQ$ISO1G0|OOOX-E9U-E9UO;ZQ7[O'#EkOOOW1G/s1G/sOOOY-E9V-E9VO;`Q7[O'#EnOOO[-E9W-E9WO;eQ7[O'#EqO;jQMhO,5;aOOO!b-E9X-E9XOOOW1G1O1G1OOOOp-E9Y-E9YOOOW1G1P1G1POOO`-E9Z-E9ZOOOW1G1Q1G1QOOOW1G1S1G1SOOOW1G1T1G1TP-dQ!NvO'#DfOOOW1G.z1G.zO;oQ:QO1G.zO;tQ(CWO1G.zO;|Q!LQO1G/OO<RQ!LQO1G/TO<WQ!LQO1G/XO<]Q!LQO1G/bO<bQ!LQO1G/fO<gQ!LQO1G/jOOOW7+%X7+%XO<lQ!LQO7+%XO<qQ!LQO7+$_O<vQ!LQO7+$mO<{Q!LQO7+$qO=QQ(CWO7+$uO=VQ(CWO7+%OO=[Q!LQO7+%SOOQO'#Dq'#DqOOQO,5:[,5:[O=aQ!LQO,5:[O=fO!0LbO,5:_O=kO!0LbO,5:cO=pO!0LbO,5:eO=uO!0LbO,5:gO=zO!0LbO,5:iO>PO!0LbO,5:kO>UO!0LbO,5:mO>ZO!0LbO,5:oO>`O!0LbO,5:qO>eO!0LbO,5:sO>jQ#@ItO'#FTO>oQ$ISO,5:^O?yQ&2DjO,5:^O@XQ&2DjO,5;OO@gQ$ISO,5;QOAqQ&2DjO,5;QOOQO,5;R,5;ROOQO-E9Q-E9QOOOX7+%`7+%`OOOY7+&^7+&^OOO[7+&a7+&aOOOW7+&d7+&dOOOW7+&h7+&hOBPQMhO,5;VOBUQMhO,5;YOBZQMhO,5;]OOOW1G0{1G0{OB`Q!LQO7+$fOOOW7+$f7+$fOBeQ:QO7+$fOOOW7+$j7+$jOOOW7+$o7+$oOOOW7+$s7+$sOOOW7+$|7+$|OOOW7+%Q7+%QOOOW7+%U7+%UOOOW<<Hs<<HsOOOW<<Gy<<GyOOOW<<HX<<HXOOOW<<H]<<H]OBjQ<vO<<HaOBoQ<vO<<HjOOOW<<Hn<<HnOOQO1G/v1G/vOOQO1G/y1G/yOOQO1G/}1G/}OOQO1G0P1G0POOQO1G0R1G0ROOQO1G0T1G0TOOQO1G0V1G0VOOQO1G0X1G0XOOQO1G0Z1G0ZOOQO1G0]1G0]OOQO1G0_1G0_OOQO,5;o,5;oOOQO-E9R-E9ROBtQ&2DjO1G/xOCSQ:QO'#DfOOQO'#E^'#E^OCjO+D:UO'#E^ODSO6:%[O'#E^OOQO1G/x1G/xOOQO1G0j1G0jODZQ&2DjO1G0lOOQO1G0l1G0lOOOW1G0q1G0qOOOW1G0t1G0tOOOW1G0w1G0wOOOW<<HQ<<HQODiQ!LQO<<HQODnQ!LQOAN={ODyQ!LQOAN>UOOQO7+%d7+%dOOOO'#Fz'#FzOOOO'#FU'#FUOEUO+D:UO'#E`OOQO,5:x,5:xOE]O7[O,5:xOOOO'#FV'#FVOEbO6:%[O'#EbOEiO7[O,5:xOOQO7+&W7+&WOOOWAN=lAN=lOOOWG23gG23gOEnQ:QOG23gOEsQL%)hOG23gOOOWG23pG23pOFOQ:QOG23pOFTQL%)hOG23pOOOO-E9S-E9SOOQO1G0d1G0dOOOO-E9T-E9TOF`Q7[OLD)ROOOWLD)RLD)ROFeQ:QOLD)ROFjQ!LQOLD)ROFrQ7[OLD)[OOOWLD)[LD)[OFwQ:QOLD)[OF|Q!LQOLD)[OGUQ!LQO!$'LmOGZQ7[O!$'LmOOOW!$'Lm!$'LmOG`Q:QO!$'LmOGeQ!LQO!$'LvOGjQ7[O!$'LvOOOW!$'Lv!$'LvOGoQ:QO!$'LvOOOW!)9BX!)9BXOGtQ!LQO!)9BXOGyQ7[O!)9BXOOOW!)9Bb!)9BbOHOQ!LQO!)9BbOHTQ7[O!)9BbOOOW!.K7s!.K7sOHYQ!LQO!.K7sOOOW!.K7|!.K7|OH_Q!LQO!.K7|OOOW!4/-_!4/-_OOOW!4/-h!4/-h",
  stateData: "Ht~O$ZOS~OS[OTXOUYOVZOW]OYgOZfO[hObWO!]hO!^hO!_hO!`hO#ohO#riO$^VO$rcO$tdO$veO~OS[OTXOUYOVZOW]OYgOZfO[hObnO!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~OS[OTXOUYOVZOW]OYgOZfO[hObqO!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~OS[OTXOUYOVZOW]OYgOZfO[hObuO!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~OS[OTXOUYOVZOW]OYgOZfO[hObxO!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~OS[OTXOUYOVZOW]OYgOZfO[hOb{O!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~OS[OTXOUYOVZOW]OYgOZfO[hOb!OO!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~O]!PO~O]!QOc!ROd!SO~O!c!TO~O!c!UO~O!c!VO~O!c!WO#g!WO#h!WO~O!c!YO~O$R!ZOP#^P$U#^P~O$S!^OQ#aP$U#aP~O$T!aOR#dP$U#dP~OS[OTXOUYOVZOW]OX!eOYgOZfO[hObWO!]hO!^hO!_hO!`hO#ohO$^VO$rcO$tdO$veO~O$U!fO~P+fO$X!gO$s!iO~O$W!jO$u!lO~O$V!mO$w!oO~O]!QOc!ROd!SOi!vOj!uO~Om!wO~P-dOm!yO~P-dO]!QOc!ROd!SOm!|O~Om#OO~P-dOm#QO~P-dO]!QOc!ROd!SOm#SO~O$_#TO~Og#UO~Oe#VO~Of#WOp#XOt#YOx#ZO!R#[O!V#]O~Ob#^O!i#uO#X#tO#[#vO$b#_O$d#aO$e#cO$f#eO$g#gO$h#iO$i#kO$j#mO$k#oO$l#qO~O#]#zO~P/tO#]#}O~P/tO#]$PO~P/tO#]$RO#k$SO~P/tO#]$SO~P/tO$R!ZOP#^X$U#^X~OP$VO$U$WO~O$S!^OQ#aX$U#aX~OQ$YO$U$WO~O$T!aOR#dX$U#dX~OR$[O$U$WO~O$U$WO~P+fO$X!gO$s$_O~O$W!jO$u$aO~O$V!mO$w$cO~O#]$dO~O#]$eO~Og$gOk$hO~Oj$iO~Of$jO~Op$kO~Ot$lO~Ox$mO~O!R$nO~O!V$oO~Og$pO![$qO~O]$rO~O]$sO~O]$tO~O^$uO~O^$vO~O]$wO~Og$yO$]$xO~O$c${O~O$c$|O~O$c$}O~O$c%OO~O$c%PO~O$c%QO~O$c%RO~O$c%SO~O$c%TO~O$c%UO~O!}%VO#P%XOb!fX!i!fX#X!fX#[!fX#]!fX$b!fX$d!fX$e!fX$f!fX$g!fX$h!fX$i!fX$j!fX$k!fX$l!fX#k!fX~O#P%YOb#WX!i#WX#X#WX#[#WX#]#WX$b#WX$d#WX$e#WX$f#WX$g#WX$h#WX$i#WX$j#WX$k#WX$l#WX#k#WX~O!}%VO#P%[Ob#YX!i#YX#X#YX#[#YX#]#YX$b#YX$d#YX$e#YX$f#YX$g#YX$h#YX$i#YX$j#YX$k#YX$l#YX#k#YX~O$p%]O~O#]%_O~P/tO#]%`O~P/tO#]%aO~P/tO#]%bO#k%cO~P/tO#]%cO~P/tO!c%dO~O!c%eO~O!c%fO~O#]%gO~O]%hO~Og%iOk%jO~Og%kO~Og%lO~Og%mO~Og%nO~Og%oO~Og%pO~Og%qO~Og%rO~Og%sO~Og%tO~Oy%uO~Oy%vO~Og%wO~Og%xO~O!j%yO~O!j%zO~O!j%{O~O!j%|O~O!j%}O~O!j&OO~O!j&PO~O!j&QO~O!j&RO~O!j&SO~O#O&TO~O!}%VO#P&VOb!fa!i!fa#X!fa#[!fa#]!fa$b!fa$d!fa$e!fa$f!fa$g!fa$h!fa$i!fa$j!fa$k!fa$l!fa#k!fa~Ob&WO#R&YO#T&ZO#V&[O~Ob&WO#R&YO#T&ZO#V&]O~O!}%VO#P&^Ob#Ya!i#Ya#X#Ya#[#Ya#]#Ya$b#Ya$d#Ya$e#Ya$f#Ya$g#Ya$h#Ya$i#Ya$j#Ya$k#Ya$l#Ya#k#Ya~Ob&WO#R&YO#T&ZO#V&_O~O#]&`O~O#]&aO~O#]&bO~Og&cO~O]&dO~O^&eO~O^&fO~Ob&WO#R&YO#T&ZO#V&gO~O]!QO~Ob&WO!^&hO!_&hO!`&hO$m&iO~O#R&kO~PCXOb&WO!^&hO!_&hO!`&hO$o&mO~O#T&kO~PCqOb&WO#R&YO#T&ZO#V&pO~Og&qO~Og&rOz&sO|&tO~Og&uOz&vO|&wO~O#R#SX~PCXO#R&yO~O#T#UX~PCqO#T&yO~O]&{O~Og&|Oz&}O}'OO~O]'PO~Og'QOz'RO}'SO~O{'TO~O]'UO~Og'VOz'WO~O{'XO~O]'YO~Og'ZOz'[O~Og']O~O{'^O~O]'_O~Og'`O~O{'aO~O]'bO~Og'cO~O{'dO~Og'eO~O{'fO~Og'gO~Og'hO~O![$Z#k$v#o#r$r$t!_!^!`#]#X!i#X~",
  goto: "3^$rPPPPPPPPPPPPPPPP$s%VPPPPPP%iPPP%sP$s%yP&]$s&cP&u$s&{PPPPPP'_$s'eP'w$s'}P(a$s(g$sPPPPP$s)WP)j)v)j)y*VPP)y*c)y*o)y*{)y+X)y+e)y+q)y+})y,Z)y,gPPP,sP-SP-VP)jP)j)jPP-Y-]-`-r-u-x.[._.bPP.t.zP$s$s$sP$s$sP/^/d/v0U0l0v0|1S1Y1`1f1l1rPPPPPPPPPP1xPPP2`2lPPPPPPPPPPPP2xPP3QqhOPQRSTUajlosvy|!dqPOPQRSTUajlosvy|!dakPQSTlovyQmPR!tlqQOPQRSTUajlosvy|!dQpQR!xoqROPQRSTUajlosvy|!dQtRR!{sqSOPQRSTUajlosvy|!dQwSR!}vqTOPQRSTUajlosvy|!dQzTR#PyqUOPQRSTUajlosvy|!dQ}UR#R|phOPQRSTUajlosvy|!dY&X%X%Y%[&V&^X&h&Y&Z&j&nq^OPQRSTUajlosvy|!de#w!T!U!V!X!Y#y#|$O$Q$TR$z#^e#{!T!U!V!X!Y#y#|$O$Q$Te#`!T!U!V!X!Y#y#|$O$Q$Te#b!T!U!V!X!Y#y#|$O$Q$Te#d!T!U!V!X!Y#y#|$O$Q$Te#f!T!U!V!X!Y#y#|$O$Q$Te#h!T!U!V!X!Y#y#|$O$Q$Te#j!T!U!V!X!Y#y#|$O$Q$Te#l!T!U!V!X!Y#y#|$O$Q$Te#n!T!U!V!X!Y#y#|$O$Q$Te#p!T!U!V!X!Y#y#|$O$Q$Te#r!T!U!V!X!Y#y#|$O$Q$TQ&[%XQ&]%YQ&_%[Q&g&VR&p&^R&l&YR&o&ZR!]^R$W!]q_OPQRSTUajlosvy|!dR!`_R$W!`q`OPQRSTUajlosvy|!dR!c`R$W!cqaOPQRSTUajlosvy|!dQ!faR$W!dqbOPQRSTUajlosvy|!dQjOR!rjQlPQoQQvSQyTX!slovyQsRQ|UQ!daV!zs|!dQ#y!TQ#|!UQ$O!VQ$Q!XQ$T!YZ%^#y#|$O$Q$TQ%W#sQ%Z#uT&U%W%ZQ&j&YR&x&jQ&n&ZR&z&nQ![^R$U![Q!__R$X!_Q!b`R$Z!bQ!hcR$^!hQ!kdR$`!kQ!neR$b!nSiOj`kPQSTlovy]rRUas|!de#x!T!U!V!X!Y#y#|$O$Q$Te#s!T!U!V!X!Y#y#|$O$Q$TS&i&Y&jT&m&Z&nQ!X[Q!pfQ!qgR$]!e",
  nodeNames: "⚠ StartCloseTag StartCloseTag StartCloseTag StartTag StartTag StartTag StartTag StartTag StartCloseTag StartCloseTag StartCloseTag IncompleteCloseTag LongExpression ShortExpression Document IfBlock IfBlockOpen {{ BlockPrefix BlockPrefix BlockType BlockType }} ElseBlock BlockPrefix BlockType if IfBlockClose BlockPrefix UnlessBlock UnlessBlockOpen BlockType UnlessBlockClose LetBlock LetBlockOpen BlockType LetBlockClose EachBlock EachBlockOpen BlockType as ( ) , Variable EachBlockClose EachInBlock EachInBlockOpen BlockType EachInBlockClose InElementBlock InElementBlockOpen BlockType InElementBlockClose RawHTMLBlock Interpolation UnknownBlock UnknownBlockContent Text EntityReference CharacterReference InvalidEntity Element OpenTag TagName DirectlyInterpolatedAttribute DirectlyInterpolatedAttributeValue Directive DirectiveOn DirectiveName AttributeName DirectiveTarget DirectiveBind DirectiveName DirectiveLet DirectiveName DirectiveClass DirectiveName DirectiveStyle DirectiveName DirectiveUse DirectiveName DirectiveTransition DirectiveName DirectiveIn DirectiveName DirectiveOut DirectiveName DirectiveAnimate DirectiveName | Modifier Is AttributeValue DoubleQuote AttributeValueContent SingleQuote AttributeValueContent UnquotedAttributeValue StyleAttribute StyleAttributeName Attribute Splattributes ... EndTag ScriptText CloseTag OpenTag StyleText CloseTag OpenTag TextareaText CloseTag OpenTag NamedBlock ComponentName CloseTag SelfClosingTag SelfClosingEndTag LongMoustacheComment MoustacheComment Comment ProcessingInst MismatchedCloseTag CloseTag DoctypeDecl",
  maxTerm: 177,
  context: elementContext,
  nodeProps: [["closedBy", -10, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, "EndTag", 4, "EndTag SelfClosingEndTag", 17, "IfBlockClose", 18, "}}", 31, "UnlessBlockClose", 35, "LetBlockClose", 39, "EachBlockClose", 42, "(", 48, "EachInBlockClose", 52, "InElementBlockClose", -4, 64, 108, 111, 114, "CloseTag", 95, "\"", 97, "'"], ["group", -12, 12, 56, 60, 61, 62, 63, 120, 121, 122, 123, 124, 125, "Entity", -6, 16, 30, 34, 38, 47, 51, "Block Entity", -6, 17, 31, 35, 39, 48, 52, "BlockOpen", 24, "BlockInline", -6, 28, 33, 37, 46, 50, 54, "BlockClose", -2, 55, 57, "BlockInline Entity", 59, "Entity TextContent", -3, 106, 109, 112, "TextContent Entity"], ["openedBy", 23, "{{", 28, "IfBlockOpen", 33, "UnlessBlockOpen", 37, "LetBlockOpen", 43, ")", 46, "EachBlockOpen", 50, "EachInBlockOpen", 54, "InElementBlockOpen", 95, "\"", 97, "'", 105, "StartTag StartCloseTag", -4, 107, 110, 113, 117, "OpenTag", 119, "StartTag"]],
  propSources: [svelteHighlighting],
  skippedNodes: [0],
  repeatNodeCount: 13,
  tokenData: "'?{(CVR!dOX%aXY/TYZ/TZ[%a[]1{]^/T^p%apq/Tqr2yrsEastF_tuHxuv2yvw!&Ywx#)lxy#*jyz#-Tz|2y|}#/n}!O#2X!O!P#M]!P!Q$$s!Q![2y![!]$'l!]!^2y!^!_$/R!_!`%-R!`!a%.R!a!c2y!c!}%/R!}#R2y#R#S%E_#S#T&-k#T#U&/k#U#o%E_#o#p'0}#p#q'4P#q#r'5w#r#s2y#s$f%a$f$g2y$g%WHx%W%o%E_%o%pHx%p&a%E_&a&bHx&b1p%E_1p4UHx4U4d%E_4d4eHx4e$IS%E_$IS$I`Hx$I`$Ib%E_$Ib$KhHx$Kh%#t%E_%#t&/xHx&/x&Et%E_&Et&FVHx&FV;'S%E_;'S;:j'=T;:j;=`'=Z<%l?&rHx?&r?Ah%E_?Ah?BY'=a?BY?Mn%E_?MnO'=a$4Z%ng!]P#V7[$mMh$o!LQ![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V8o'`g!]P#V7[![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V!c)OZ!]P![!bOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w!b)vS![!bO#q)q#r;'S)q;'S;=`*S<%lO)q!b*VP;=`<%l)qP*_U!]POv*Yw!^*Y!_#o*Y#p;'S*Y;'S;=`*q<%lO*YP*tP;=`<%l*Y!c*zP;=`<%l(w8n+Uc#V7[![!bOX*}XZ)qZ[*}[^)q^p*}pq)qqr*}rs)qsw*}wx)qx!^*}!^!a)q!a#S*}#S#T)q#T#q*}#q#r,a#r;'S*};'S;=`-[<%lO*}7[,fY#V7[OX,aZ[,a^p,aqr,asw,ax!^,a!a#S,a#T;'S,a;'S;=`-U<%lO,a7[-XP;=`<%l,a8n-_P;=`<%l*}7]-id!]P#V7[OX-bXZ*YZ[-b[^*Y^p-bpq*Yqr-brs*Ysv-bvw,awx*Yx!^-b!_!a*Y!a#S-b#S#T*Y#T#o-b#o#p,a#p;'S-b;'S;=`.w<%lO-b7].zP;=`<%l-b8o/QP;=`<%l'V(=k/bb!]P$mMh$o!LQ![!b$Z%BOOX(wXY0jYZ0jZ](w]^0j^p(wpq0jqv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w%BP0sb!]P![!b$Z%BOOX(wXY0jYZ0jZ](w]^0j^p(wpq0jqv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w#K}2WZ!]P$mMh$o!LQ![!bOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$E]3^p!j&j#O,U!]P#V7[$mMh$o!LQ![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VIq5qp!j&j#O,U!]P#V7[![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VIp8Sn!j&j#O,U#V7[![!b!i`OX*}XZ)qZ[*}[^)q^p*}pq)qqr7urs)qsw7uwx)qx!O7u!O!Q*}!Q![7u![!]*}!]!^7u!^!_:Q!_!a)q!a#S7u#S#T:Q#T#o7u#o#q*}#q#r<y#r#s7u#s$f*}$f;'S7u;'S;=`>s<%l?Ah7u?Ah?BY*}?BY?Mn7u?MnO*}3d:]f!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q2Q;zZ!j&j#O,U!i`qr;qsw;qx!O;q!Q![;q!]!_;q!a#o;q#q#s;q$f;'S;q;'S;=`<m<%l?Ah;q?BY?Mn;q2Q<pP;=`<%l;q3d<vP;=`<%l:QH^=Ug!j&j#O,U#V7[!i`OX,aZ[,a^p,aqr<ysw<yx!O<y!O!Q,a!Q![<y![!],a!]!^<y!^!_;q!a#S<y#S#T;q#T#o<y#o#q,a#q#s<y#s$f,a$f;'S<y;'S;=`>m<%l?Ah<y?Ah?BY,a?BY?Mn<y?MnO,aH^>pP;=`<%l<yIp>vP;=`<%l7u3e?Wi!j&j#O,U!]P![!b!i`Oq(wqr>yrs(wsv>yvw:Qwx(wx!O>y!O!Q(w!Q![>y![!](w!]!^>y!^!_:Q!_!a(w!a#o>y#o#p)q#p#q(w#q#r@u#r#s>y#s$f(w$f;'S>y;'S;=`Bo<%l?Ah>y?Ah?BY(w?BY?Mn>y?MnO(w2RAQg!j&j#O,U!]P!i`Oq*Yqr@urs*Ysv@uvw;qwx*Yx!O@u!O!Q*Y!Q![@u![!]*Y!]!^@u!^!_;q!_!a*Y!a#o@u#p#q*Y#q#s@u#s$f*Y$f;'S@u;'S;=`Bi<%l?Ah@u?Ah?BY*Y?BY?Mn@u?MnO*Y2RBlP;=`<%l@u3eBrP;=`<%l>yH_CSo!j&j#O,U!]P#V7[!i`OX-bXZ*YZ[-b[^*Y^p-bpq*YqrBurs*YsvBuvw<ywx*Yx!OBu!O!Q-b!Q![Bu![!]-b!]!^Bu!^!_;q!_!a*Y!a#SBu#S#T@u#T#oBu#o#p,a#p#q-b#q#sBu#s$f-b$f;'SBu;'S;=`ET<%l?AhBu?Ah?BY-b?BY?MnBu?MnO-bH_EWP;=`<%lBuIqE^P;=`<%l5b$4]ElZ#R!5v!]P$o!LQ![!bOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$EgFtpcY!j&j#O,U!]P#V7[$mMh$o!LQ![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V(@ZIcweW!j&j#O,U!]P#V7[}$IS$mMh$o!LQ$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx!O5b!O!PN|!P!Q'V!Q![K|![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}K|!}#R5b#R#SK|#S#T>y#T#oK|#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g;'SK|;'S;=`!#f<%l?AhK|?Ah?BY!#l?BY?MnK|?MnO!#l%DoLcweW!j&j#O,U!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx!O5b!O!PN|!P!Q'V!Q![K|![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}K|!}#R5b#R#SK|#S#T>y#T#oK|#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g;'SK|;'S;=`!#f<%l?AhK|?Ah?BY!#l?BY?MnK|?MnO!#l%2s! Xq!]P#V7[}$IS![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'VtuN|uv'Vvw*}wx(wx!O'V!O!PN|!P!Q'V!Q![N|![!^'V!^!_)q!_!a(w!a!c'V!c!}N|!}#R'V#R#SN|#S#T(w#T#oN|#o#p*}#p#q'V#q#r-b#r$g'V$g;'SN|;'S;=`!#`<%lON|%2s!#cP;=`<%lN|%Do!#iP;=`<%lK|%3m!#{qeW!]P#V7[}$IS$]p![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'Vtu!#luv'Vvw*}wx(wx!O'V!O!PN|!P!Q'V!Q![!#l![!^'V!^!_)q!_!a(w!a!c'V!c!}!#l!}#R'V#R#S!#l#S#T(w#T#o!#l#o#p*}#p#q'V#q#r-b#r$g'V$g;'S!#l;'S;=`!&S<%lO!#l%3m!&VP;=`<%l!#l$E]!&io!j&j#O,U#V7[![!b!`#Jk!i`OX!(jXZ!*SZ[!(j[^!*S^p!(jpq)qqr!0Ors!*Sst!?[tw!0Owx!*Sx!O!0O!O!Q!(j!Q![!0O![!]!(j!]!^7u!^!_!4k!_!a!*S!a#S!0O#S#T!4k#T#o!0O#o#q!(j#q#r!;S#r#s!0O#s$f!(j$f;'S!0O;'S;=`!?U<%l?Ah!0O?Ah?BY!(j?BY?Mn!0O?MnO!(j$4Z!(qe#V7[![!bOX!(jXZ!*SZ[!(j[^!*S^p!(jpq)qqr!(jrs!*Sst*}tw!(jwx!*Sx!]!(j!]!^!,Y!^!a!*S!a#S!(j#S#T!*S#T#q!(j#q#r!-n#r;'S!(j;'S;=`!/x<%lO!(j#K}!*XZ![!bOp!*Spq)qqs!*Sst)qt!]!*S!]!^!*z!^#q!*S#q#r!+_#r;'S!*S;'S;=`!,S<%lO!*S#K}!+RS![!b!^#JkO#q)q#r;'S)q;'S;=`*S<%lO)q#Jk!+bVOp!+_qs!+_t!]!+_!]!^!+w!^;'S!+_;'S;=`!+|<%lO!+_#Jk!+|O!^#Jk#Jk!,PP;=`<%l!+_#K}!,VP;=`<%l!*S$4Z!,cc#V7[![!b!^#JkOX*}XZ)qZ[*}[^)q^p*}pq)qqr*}rs)qsw*}wx)qx!^*}!^!a)q!a#S*}#S#T)q#T#q*}#q#r,a#r;'S*};'S;=`-[<%lO*}$2w!-sb#V7[OX!-nXZ!+_Z[!-n[^!+_^p!-nqr!-nrs!+_st,atw!-nwx!+_x!]!-n!]!^!.{!^!a!+_!a#S!-n#S#T!+_#T;'S!-n;'S;=`!/r<%lO!-n$2w!/SY#V7[!^#JkOX,aZ[,a^p,aqr,asw,ax!^,a!a#S,a#T;'S,a;'S;=`-U<%lO,a$2w!/uP;=`<%l!-n$4Z!/{P;=`<%l!(j$E]!0]o!j&j#O,U#V7[![!b!i`OX!(jXZ!*SZ[!(j[^!*S^p!(jpq)qqr!0Ors!*Sst7utw!0Owx!*Sx!O!0O!O!Q!(j!Q![!0O![!]!(j!]!^!2^!^!_!4k!_!a!*S!a#S!0O#S#T!4k#T#o!0O#o#q!(j#q#r!;S#r#s!0O#s$f!(j$f;'S!0O;'S;=`!?U<%l?Ah!0O?Ah?BY!(j?BY?Mn!0O?MnO!(j$E]!2mn!j&j#O,U#V7[![!b!^#Jk!i`OX*}XZ)qZ[*}[^)q^p*}pq)qqr7urs)qsw7uwx)qx!O7u!O!Q*}!Q![7u![!]*}!]!^7u!^!_:Q!_!a)q!a#S7u#S#T:Q#T#o7u#o#q*}#q#r<y#r#s7u#s$f*}$f;'S7u;'S;=`>s<%l?Ah7u?Ah?BY*}?BY?Mn7u?MnO*}$/P!4vi!j&j#O,U![!b!i`Op!*Spq)qqr!4krs!*Sst:Qtw!4kwx!*Sx!O!4k!O!Q!*S!Q![!4k![!]!*S!]!^!6e!^!_!4k!_!a!*S!a#o!4k#o#q!*S#q#r!8W#r#s!4k#s$f!*S$f;'S!4k;'S;=`!:|<%l?Ah!4k?Ah?BY!*S?BY?Mn!4k?MnO!*S$/P!6rf!j&j#O,U![!b!^#Jk!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q$-m!8ag!j&j#O,U!i`Op!+_qr!8Wrs!+_st;qtw!8Wwx!+_x!O!8W!O!Q!+_!Q![!8W![!]!+_!]!^!9x!^!_!8W!_!a!+_!a#o!8W#o#q!+_#q#s!8W#s$f!+_$f;'S!8W;'S;=`!:v<%l?Ah!8W?Ah?BY!+_?BY?Mn!8W?MnO!+_$-m!:TZ!j&j#O,U!^#Jk!i`qr;qsw;qx!O;q!Q![;q!]!_;q!a#o;q#q#s;q$f;'S;q;'S;=`<m<%l?Ah;q?BY?Mn;q$-m!:yP;=`<%l!8W$/P!;PP;=`<%l!4k$Cy!;_m!j&j#O,U#V7[!i`OX!-nXZ!+_Z[!-n[^!+_^p!-nqr!;Srs!+_st<ytw!;Swx!+_x!O!;S!O!Q!-n!Q![!;S![!]!-n!]!^!=Y!^!_!8W!_!a!+_!a#S!;S#S#T!8W#T#o!;S#o#q!-n#q#s!;S#s$f!-n$f;'S!;S;'S;=`!?O<%l?Ah!;S?Ah?BY!-n?BY?Mn!;S?MnO!-n$Cy!=gg!j&j#O,U#V7[!^#Jk!i`OX,aZ[,a^p,aqr<ysw<yx!O<y!O!Q,a!Q![<y![!],a!]!^<y!^!_;q!a#S<y#S#T;q#T#o<y#o#q,a#q#s<y#s$f,a$f;'S<y;'S;=`>m<%l?Ah<y?Ah?BY,a?BY?Mn<y?MnO,a$Cy!?RP;=`<%l!;S$E]!?XP;=`<%l!0O$E]!?in!j&j#O,U#V7[![!b!i`OX!AgXZ!B|Z[!Ag[^!B|^p!Agpq)qqr!Hlrs!B|sw!Hlwx!B|x!O!Hl!O!Q!Ag!Q![!Hl![!]!Ag!]!^7u!^!_!MU!_!a!B|!a#S!Hl#S#T!MU#T#o!Hl#o#q!Ag#q#r#%g#r#s!Hl#s$f!Ag$f;'S!Hl;'S;=`#)f<%l?Ah!Hl?Ah?BY!Ag?BY?Mn!Hl?MnO!Ag$4Z!And#V7[![!bOX!AgXZ!B|Z[!Ag[^!B|^p!Agpq)qqr!Agrs!B|sw!Agwx!B|x!]!Ag!]!^!Dy!^!a!B|!a#S!Ag#S#T!B|#T#q!Ag#q#r!F_#r;'S!Ag;'S;=`!Hf<%lO!Ag#K}!CRX![!bOp!B|pq)qq!]!B|!]!^!Cn!^#q!B|#q#r!DR#r;'S!B|;'S;=`!Ds<%lO!B|#K}!CuS![!b!_#JkO#q)q#r;'S)q;'S;=`*S<%lO)q#Jk!DUUOp!DRq!]!DR!]!^!Dh!^;'S!DR;'S;=`!Dm<%lO!DR#Jk!DmO!_#Jk#Jk!DpP;=`<%l!DR#K}!DvP;=`<%l!B|$4Z!ESc#V7[![!b!_#JkOX*}XZ)qZ[*}[^)q^p*}pq)qqr*}rs)qsw*}wx)qx!^*}!^!a)q!a#S*}#S#T)q#T#q*}#q#r,a#r;'S*};'S;=`-[<%lO*}$2w!Fda#V7[OX!F_XZ!DRZ[!F_[^!DR^p!F_qr!F_rs!DRsw!F_wx!DRx!]!F_!]!^!Gi!^!a!DR!a#S!F_#S#T!DR#T;'S!F_;'S;=`!H`<%lO!F_$2w!GpY#V7[!_#JkOX,aZ[,a^p,aqr,asw,ax!^,a!a#S,a#T;'S,a;'S;=`-U<%lO,a$2w!HcP;=`<%l!F_$4Z!HiP;=`<%l!Ag$E]!Hyn!j&j#O,U#V7[![!b!i`OX!AgXZ!B|Z[!Ag[^!B|^p!Agpq)qqr!Hlrs!B|sw!Hlwx!B|x!O!Hl!O!Q!Ag!Q![!Hl![!]!Ag!]!^!Jw!^!_!MU!_!a!B|!a#S!Hl#S#T!MU#T#o!Hl#o#q!Ag#q#r#%g#r#s!Hl#s$f!Ag$f;'S!Hl;'S;=`#)f<%l?Ah!Hl?Ah?BY!Ag?BY?Mn!Hl?MnO!Ag$E]!KWn!j&j#O,U#V7[![!b!_#Jk!i`OX*}XZ)qZ[*}[^)q^p*}pq)qqr7urs)qsw7uwx)qx!O7u!O!Q*}!Q![7u![!]*}!]!^7u!^!_:Q!_!a)q!a#S7u#S#T:Q#T#o7u#o#q*}#q#r<y#r#s7u#s$f*}$f;'S7u;'S;=`>s<%l?Ah7u?Ah?BY*}?BY?Mn7u?MnO*}$/P!Mah!j&j#O,U![!b!i`Op!B|pq)qqr!MUrs!B|sw!MUwx!B|x!O!MU!O!Q!B|!Q![!MU![!]!B|!]!^!N{!^!_!MU!_!a!B|!a#o!MU#o#q!B|#q#r#!n#r#s!MU#s$f!B|$f;'S!MU;'S;=`#%a<%l?Ah!MU?Ah?BY!B|?BY?Mn!MU?MnO!B|$/P# Yf!j&j#O,U![!b!_#Jk!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q$-m#!wf!j&j#O,U!i`Op!DRqr#!nrs!DRsw#!nwx!DRx!O#!n!O!Q!DR!Q![#!n![!]!DR!]!^#$]!^!_#!n!_!a!DR!a#o#!n#o#q!DR#q#s#!n#s$f!DR$f;'S#!n;'S;=`#%Z<%l?Ah#!n?Ah?BY!DR?BY?Mn#!n?MnO!DR$-m#$hZ!j&j#O,U!_#Jk!i`qr;qsw;qx!O;q!Q![;q!]!_;q!a#o;q#q#s;q$f;'S;q;'S;=`<m<%l?Ah;q?BY?Mn;q$-m#%^P;=`<%l#!n$/P#%dP;=`<%l!MU$Cy#%rl!j&j#O,U#V7[!i`OX!F_XZ!DRZ[!F_[^!DR^p!F_qr#%grs!DRsw#%gwx!DRx!O#%g!O!Q!F_!Q![#%g![!]!F_!]!^#'j!^!_#!n!_!a!DR!a#S#%g#S#T#!n#T#o#%g#o#q!F_#q#s#%g#s$f!F_$f;'S#%g;'S;=`#)`<%l?Ah#%g?Ah?BY!F_?BY?Mn#%g?MnO!F_$Cy#'wg!j&j#O,U#V7[!_#Jk!i`OX,aZ[,a^p,aqr<ysw<yx!O<y!O!Q,a!Q![<y![!],a!]!^<y!^!_;q!a#S<y#S#T;q#T#o<y#o#q,a#q#s<y#s$f,a$f;'S<y;'S;=`>m<%l?Ah<y?Ah?BY,a?BY?Mn<y?MnO,a$Cy#)cP;=`<%l#%g$E]#)iP;=`<%l!Hl$4]#)wZ#T#4`!]P$mMh![!bOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w(?i#+Ppz$I[!j&j#O,U!]P#V7[$mMh$o!LQ![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$E_#-jp{Q!j&j#O,U!]P#V7[$mMh$o!LQ![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$Ee#0Tp|W!j&j#O,U!]P#V7[$mMh$o!LQ![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx!O5b!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'V$E_#2lq!j&j#O,U!]P#V7[$mMh$o!LQ![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx}5b}!O#4s!O!Q'V!Q![5b![!]'V!]!^5b!^!_:Q!_!a(w!a#S5b#S#T>y#T#o5b#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f;'S5b;'S;=`EZ<%l?Ah5b?Ah?BY'V?BY?Mn5b?MnO'VIs#5Sq!j&j#O,U!]P#V7[![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr#7Zrs(wsv#7Zvw#9pwx(wx!O#7Z!O!Q'V!Q![#7Z![!]'V!]!^#7Z!^!_#;}!_!`(w!`!a#Gj!a#S#7Z#S#T#@|#T#o#7Z#o#p*}#p#q'V#q#r#Hf#r#s#7Z#s$f'V$f;'S#7Z;'S;=`#Gd<%l?Ah#7Z?Ah?BY'V?BY?Mn#7Z?MnO'VIq#7lp!j&j#O,U!]P#V7[![!b#X`!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr#7Zrs(wsv#7Zvw#9pwx(wx!O#7Z!O!Q'V!Q![#7Z![!]'V!]!^#7Z!^!_#;}!_!a(w!a#S#7Z#S#T#@|#T#o#7Z#o#p*}#p#q'V#q#r#D|#r#s#7Z#s$f'V$f;'S#7Z;'S;=`#Gd<%l?Ah#7Z?Ah?BY'V?BY?Mn#7Z?MnO'VIp#:Pn!j&j#O,U#V7[![!b#X`!i`OX*}XZ)qZ[*}[^)q^p*}pq)qqr#9prs)qsw#9pwx)qx!O#9p!O!Q*}!Q![#9p![!]*}!]!^#9p!^!_#;}!_!a)q!a#S#9p#S#T#;}#T#o#9p#o#q*}#q#r#>z#r#s#9p#s$f*}$f;'S#9p;'S;=`#@v<%l?Ah#9p?Ah?BY*}?BY?Mn#9p?MnO*}3d#<[f!j&j#O,U![!b#X`!i`Oq)qqr#;}rs)qsw#;}wx)qx!O#;}!O!Q)q!Q![#;}![!])q!]!_#;}!_!a)q!a#o#;}#o#q)q#q#r#=p#r#s#;}#s$f)q$f;'S#;};'S;=`#>t<%l?Ah#;}?Ah?BY)q?BY?Mn#;}?MnO)q2Q#={Z!j&j#O,U#X`!i`qr#=psw#=px!O#=p!Q![#=p!]!_#=p!a#o#=p#q#s#=p$f;'S#=p;'S;=`#>n<%l?Ah#=p?BY?Mn#=p2Q#>qP;=`<%l#=p3d#>wP;=`<%l#;}H^#?Xg!j&j#O,U#V7[#X`!i`OX,aZ[,a^p,aqr#>zsw#>zx!O#>z!O!Q,a!Q![#>z![!],a!]!^#>z!^!_#=p!a#S#>z#S#T#=p#T#o#>z#o#q,a#q#s#>z#s$f,a$f;'S#>z;'S;=`#@p<%l?Ah#>z?Ah?BY,a?BY?Mn#>z?MnO,aH^#@sP;=`<%l#>zIp#@yP;=`<%l#9p3e#A]i!j&j#O,U!]P![!b#X`!i`Oq(wqr#@|rs(wsv#@|vw#;}wx(wx!O#@|!O!Q(w!Q![#@|![!](w!]!^#@|!^!_#;}!_!a(w!a#o#@|#o#p)q#p#q(w#q#r#Bz#r#s#@|#s$f(w$f;'S#@|;'S;=`#Dv<%l?Ah#@|?Ah?BY(w?BY?Mn#@|?MnO(w2R#CXg!j&j#O,U!]P#X`!i`Oq*Yqr#Bzrs*Ysv#Bzvw#=pwx*Yx!O#Bz!O!Q*Y!Q![#Bz![!]*Y!]!^#Bz!^!_#=p!_!a*Y!a#o#Bz#p#q*Y#q#s#Bz#s$f*Y$f;'S#Bz;'S;=`#Dp<%l?Ah#Bz?Ah?BY*Y?BY?Mn#Bz?MnO*Y2R#DsP;=`<%l#Bz3e#DyP;=`<%l#@|H_#E]o!j&j#O,U!]P#V7[#X`!i`OX-bXZ*YZ[-b[^*Y^p-bpq*Yqr#D|rs*Ysv#D|vw#>zwx*Yx!O#D|!O!Q-b!Q![#D|![!]-b!]!^#D|!^!_#=p!_!a*Y!a#S#D|#S#T#Bz#T#o#D|#o#p,a#p#q-b#q#s#D|#s$f-b$f;'S#D|;'S;=`#G^<%l?Ah#D|?Ah?BY-b?BY?Mn#D|?MnO-bH_#GaP;=`<%l#D|Iq#GgP;=`<%l#7Z!e#GsZ!]P$wQ![!bOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(wHa#Hup!j&j#O,U!]P#V7[#X`!i`OX-bXZ*YZ[-b[^*Y^p-bpq*Yqr#D|rs*Ysv#D|vw#>zwx*Yx!O#D|!O!Q-b!Q![#D|![!]-b!]!^#D|!^!_#=p!_!a*Y!a#S#D|#S#T#Bz#T#o#D|#o#p,a#p#q-b#q#r#Jy#r#s#D|#s$f-b$f;'S#D|;'S;=`#G^<%l?Ah#D|?Ah?BY-b?BY?Mn#D|?MnO-bHa#K[o!j&j#O,U!]P#V7[$sQ#X`!i`OX-bXZ*YZ[-b[^*Y^p-bpq*Yqr#D|rs*Ysv#D|vw#>zwx*Yx!O#D|!O!Q-b!Q![#D|![!]-b!]!^#D|!^!_#=p!_!a*Y!a#S#D|#S#T#Bz#T#o#D|#o#p,a#p#q-b#q#s#D|#s$f-b$f;'S#D|;'S;=`#G^<%l?Ah#D|?Ah?BY-b?BY?Mn#D|?MnO-b$4k#Mji!]P#V7[$mMh$o!LQ![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!O'V!O!P$ X!P!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V9P$ bi!]P#V7[![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!O'V!O!P$#P!P!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V9P$#[g#[`!]P#V7[![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V$4y$%ShcY!]P#V7[$mMh$o!LQ![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!`(w!`!a$&n!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V!w$&yZ!]P![!b#k`#]dOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w$4y$'}!O$c`cY!]P#V7[$mMh$o!LQ![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#R'V#R#S$*}#S#T(w#T#o$*}#o#p*}#p#q'V#q#r-b#r%W'V%W%o$*}%o%p'V%p&a$*}&a&b'V&b1p$*}1p4U'V4U4d$*}4d4e'V4e$IS$*}$IS$I`'V$I`$Ib$*}$Ib$Kh'V$Kh%#t$*}%#t&/x'V&/x&Et$*}&Et&FV'V&FV;'S$*};'S;:j$.{;:j;=`.}<%l?&r'V?&r?Ah$*}?Ah?BY'V?BY?Mn$*}?MnO'V8s$+Y!Z#gS!]P#V7[![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx}'V}!O$*}!O!P$*}!P!Q'V!Q![$*}![!^'V!^!_)q!_!a(w!a!c'V!c!}$*}!}#R'V#R#S$*}#S#T(w#T#o$*}#o#p*}#p#q'V#q#r-b#r$}'V$}%O$*}%O%W'V%W%o$*}%o%p'V%p&a$*}&a&b'V&b1p$*}1p4U$*}4U4d$*}4d4e'V4e$IS$*}$IS$I`'V$I`$Ib$*}$Ib$Je'V$Je$Jg$*}$Jg$Kh'V$Kh%#t$*}%#t&/x'V&/x&Et$*}&Et&FV'V&FV;'S$*};'S;:j$.{;:j;=`.}<%l?&r'V?&r?Ah$*}?Ah?BY'V?BY?Mn$*}?MnO'V8s$/OP;=`<%l$*}$/P$/bg!j&j#O,U$mMh$o!LQ![!b!i`Oq)qqr$0yrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!b%#a!b#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$1Uk!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx}:Q}!O$2y!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!f:Q!f!g$6`!g#W:Q#W#X$Fi#X#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$3Ug!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx}:Q}!O$4m!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$4zf!j&j#O,U![!b$vP!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$6kh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!q:Q!q!r$8V!r#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$8bh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!e:Q!e!f$9|!f#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$:Xh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!v:Q!v!w$;s!w#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$<Oh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!{:Q!{!|$=j!|#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$=uh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!r:Q!r!s$?a!s#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$?lh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a!g:Q!g!h$AW!h#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$Acg!j&j#O,U![!b!i`Oq$Bzqr$AWrs$Bzsw$AWwx$Bzx!O$AW!O!Q$Bz!Q![$AW![!]$Bz!]!_$AW!_!`$Bz!`!a$Cf!a#o$AW#o#q$Bz#q#r$Dn#r#s$AW#s$f$Bz$f;'S$AW;'S;=`$Fc<%l?Ah$AW?Ah?BY$Bz?BY?Mn$AW?MnO$Bz!c$CPV![!bO!`$Bz!`!a$Cf!a#q$Bz#q#r$Cy#r;'S$Bz;'S;=`$Dh<%lO$Bz!c$CmS![!b#rPO#q)q#r;'S)q;'S;=`*S<%lO)qP$C|TO!`$Cy!`!a$D]!a;'S$Cy;'S;=`$Db<%lO$CyP$DbO#rPP$DeP;=`<%l$Cy!c$DkP;=`<%l$Bz2R$Dwf!j&j#O,U!i`Oq$Cyqr$Dnrs$Cysw$Dnwx$Cyx!O$Dn!O!Q$Cy!Q![$Dn![!]$Cy!]!_$Dn!_!`$Cy!`!a$D]!a#o$Dn#o#q$Cy#q#s$Dn#s$f$Cy$f;'S$Dn;'S;=`$F]<%l?Ah$Dn?Ah?BY$Cy?BY?Mn$Dn?MnO$Cy2R$F`P;=`<%l$Dn3e$FfP;=`<%l$AW3e$Fth!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#c:Q#c#d$H`#d#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$Hkh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#V:Q#V#W$JV#W#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$Jbh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#h:Q#h#i$K|#i#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$LXh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#m:Q#m#n$Ms#n#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e$NOh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#d:Q#d#e% j#e#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e% uh!j&j#O,U![!b!i`Oq)qqr:Qrs)qsw:Qwx)qx!O:Q!O!Q)q!Q![:Q![!])q!]!_:Q!_!a)q!a#X:Q#X#Y$AW#Y#o:Q#o#q)q#q#r;q#r#s:Q#s$f)q$f;'S:Q;'S;=`<s<%l?Ah:Q?Ah?BY)q?BY?Mn:Q?MnO)q3e%#lg!j&j#O,U![!b!i`Oq%%Tqr%#ars%%Tsw%#awx%%Tx!O%#a!O!Q%%T!Q![%#a![!]%%T!]!_%#a!_!a%%T!a!b%'u!b#o%#a#o#q%%T#q#r%)i#r#s%#a#s$f%%T$f;'S%#a;'S;=`%,{<%l?Ah%#a?Ah?BY%%T?BY?Mn%#a?MnO%%T!c%%YV![!bO!a%%T!a!b%%o!b#q%%T#q#r%&n#r;'S%%T;'S;=`%'o<%lO%%T!c%%tV![!bO!`%%T!`!a%&Z!a#q%%T#q#r%&n#r;'S%%T;'S;=`%'o<%lO%%T!c%&bS![!b#oPO#q)q#r;'S)q;'S;=`*S<%lO)qP%&qTO!a%&n!a!b%'Q!b;'S%&n;'S;=`%'i<%lO%&nP%'TTO!`%&n!`!a%'d!a;'S%&n;'S;=`%'i<%lO%&nP%'iO#oPP%'lP;=`<%l%&n!c%'rP;=`<%l%%T3e%(Qg!j&j#O,U![!b!i`Oq%%Tqr%#ars%%Tsw%#awx%%Tx!O%#a!O!Q%%T!Q![%#a![!]%%T!]!_%#a!_!`%%T!`!a%&Z!a#o%#a#o#q%%T#q#r%)i#r#s%#a#s$f%%T$f;'S%#a;'S;=`%,{<%l?Ah%#a?Ah?BY%%T?BY?Mn%#a?MnO%%T2R%)rf!j&j#O,U!i`Oq%&nqr%)irs%&nsw%)iwx%&nx!O%)i!O!Q%&n!Q![%)i![!]%&n!]!_%)i!_!a%&n!a!b%+W!b#o%)i#o#q%&n#q#s%)i#s$f%&n$f;'S%)i;'S;=`%,u<%l?Ah%)i?Ah?BY%&n?BY?Mn%)i?MnO%&n2R%+af!j&j#O,U!i`Oq%&nqr%)irs%&nsw%)iwx%&nx!O%)i!O!Q%&n!Q![%)i![!]%&n!]!_%)i!_!`%&n!`!a%'d!a#o%)i#o#q%&n#q#s%)i#s$f%&n$f;'S%)i;'S;=`%,u<%l?Ah%)i?Ah?BY%&n?BY?Mn%)i?MnO%&n2R%,xP;=`<%l%)i3e%-OP;=`<%l%#a#L_%-`Z#P`!]P$mMh$o!LQ![!bOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w#Lc%.`Z!]P$mMh$o!LQ![!b#]dOv(wvw)qw!^(w!^!_)q!_#o(w#o#p)q#p#q(w#q#r*Y#r;'S(w;'S;=`*w<%lO(w(@_%/n!aeW#hS!j&j#O,U!]P#V7[}$IS$mMh$o!LQ$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%3s!O!P%<[!P!Q'V!Q![%@k![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}%@k!}#R5b#R#S%@k#S#T>y#T#o%@k#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O%@k%O%WK|%W%o%@k%o%pK|%p&a%@k&a&bK|&b1p%@k1p4U%@k4U4d%@k4d4eK|4e$IS%@k$IS$I`K|$I`$Ib%@k$Ib$JeK|$Je$Jg%@k$Jg$KhK|$Kh%#t%@k%#t&/xK|&/x&Et%@k&Et&FVK|&FV;'S%@k;'S;:j%EX;:j;=`!#f<%l?&rK|?&r?Ah%@k?Ah?BY!#l?BY?Mn%@k?MnO!#lIu%4U!^#hS!j&j#O,U!]P#V7[![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx}5b}!O%3s!O!P%8Q!P!Q'V!Q![%3s![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}%3s!}#R5b#R#S%3s#S#T>y#T#o%3s#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$}5b$}%O%3s%O%W5b%W%o%3s%o%p5b%p&a%3s&a&b5b&b1p%3s1p4U%3s4U4d%3s4d4e5b4e$IS%3s$IS$I`5b$I`$Ib%3s$Ib$Je5b$Je$Jg%3s$Jg$Kh5b$Kh%#t%3s%#t&/x5b&/x&Et%3s&Et&FV5b&FV;'S%3s;'S;:j%<U;:j;=`EZ<%l?&r5b?&r?Ah%3s?Ah?BY'V?BY?Mn%3s?MnO'V8s%8]!Z#hS!]P#V7[![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx}'V}!O%8Q!O!P%8Q!P!Q'V!Q![%8Q![!^'V!^!_)q!_!a(w!a!c'V!c!}%8Q!}#R'V#R#S%8Q#S#T(w#T#o%8Q#o#p*}#p#q'V#q#r-b#r$}'V$}%O%8Q%O%W'V%W%o%8Q%o%p'V%p&a%8Q&a&b'V&b1p%8Q1p4U%8Q4U4d%8Q4d4e'V4e$IS%8Q$IS$I`'V$I`$Ib%8Q$Ib$Je'V$Je$Jg%8Q$Jg$Kh'V$Kh%#t%8Q%#t&/x'V&/x&Et%8Q&Et&FV'V&FV;'S%8Q;'S;:j%<O;:j;=`.}<%l?&r'V?&r?Ah%8Q?Ah?BY'V?BY?Mn%8Q?MnO'V8s%<RP;=`<%l%8QIu%<XP;=`<%l%3s%2w%<i!^#hS!]P#V7[}$IS![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'VtuN|uv'Vvw*}wx(wx}'V}!O%8Q!O!P%<[!P!Q'V!Q![%<[![!^'V!^!_)q!_!a(w!a!c'V!c!}%<[!}#R'V#R#S%<[#S#T(w#T#o%<[#o#p*}#p#q'V#q#r-b#r$g'V$g$}N|$}%O%<[%O%WN|%W%o%<[%o%pN|%p&a%<[&a&bN|&b1p%<[1p4U%<[4U4d%<[4d4eN|4e$IS%<[$IS$I`N|$I`$Ib%<[$Ib$JeN|$Je$Jg%<[$Jg$KhN|$Kh%#t%<[%#t&/xN|&/x&Et%<[&Et&FVN|&FV;'S%<[;'S;:j%@e;:j;=`!#`<%l?&rN|?&r?Ah%<[?Ah?BYN|?BY?Mn%<[?MnON|%2w%@hP;=`<%l%<[%Ds%AS!aeW#hS!j&j#O,U!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%3s!O!P%<[!P!Q'V!Q![%@k![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}%@k!}#R5b#R#S%@k#S#T>y#T#o%@k#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O%@k%O%WK|%W%o%@k%o%pK|%p&a%@k&a&bK|&b1p%@k1p4U%@k4U4d%@k4d4eK|4e$IS%@k$IS$I`K|$I`$Ib%@k$Ib$JeK|$Je$Jg%@k$Jg$KhK|$Kh%#t%@k%#t&/xK|&/x&Et%@k&Et&FVK|&FV;'S%@k;'S;:j%EX;:j;=`!#f<%l?&rK|?&r?Ah%@k?Ah?BY!#l?BY?Mn%@k?MnO!#l%Ds%E[P;=`<%l%@k(@a%Ez!aeW!j&j#O,U!cU!]P#V7[}$IS$mMh$o!LQ$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#lIw%Jb!^!j&j#O,U!cU!]P#V7[![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wsv5bvw7uwx(wx}5b}!O%JP!O!P%N^!P!Q'V!Q![%JP![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}%JP!}#R5b#R#S%JP#S#T>y#T#o%JP#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$}5b$}%O%JP%O%W5b%W%o%JP%o%p5b%p&a%JP&a&b5b&b1p%JP1p4U%JP4U4d%JP4d4e5b4e$IS%JP$IS$I`5b$I`$Ib%JP$Ib$Je5b$Je$Jg%JP$Jg$Kh5b$Kh%#t%JP%#t&/x5b&/x&Et%JP&Et&FV5b&FV;'S%JP;'S;:j&$b;:j;=`EZ<%l?&r5b?&r?Ah%JP?Ah?BY'V?BY?Mn%JP?MnO'V8u%Ni!Z!cU!]P#V7[![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx}'V}!O%N^!O!P%N^!P!Q'V!Q![%N^![!^'V!^!_)q!_!a(w!a!c'V!c!}%N^!}#R'V#R#S%N^#S#T(w#T#o%N^#o#p*}#p#q'V#q#r-b#r$}'V$}%O%N^%O%W'V%W%o%N^%o%p'V%p&a%N^&a&b'V&b1p%N^1p4U%N^4U4d%N^4d4e'V4e$IS%N^$IS$I`'V$I`$Ib%N^$Ib$Je'V$Je$Jg%N^$Jg$Kh'V$Kh%#t%N^%#t&/x'V&/x&Et%N^&Et&FV'V&FV;'S%N^;'S;:j&$[;:j;=`.}<%l?&r'V?&r?Ah%N^?Ah?BY'V?BY?Mn%N^?MnO'V8u&$_P;=`<%l%N^Iw&$eP;=`<%l%JP%2y&$u!^!cU!]P#V7[}$IS![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'VtuN|uv'Vvw*}wx(wx}'V}!O%N^!O!P&$h!P!Q'V!Q![&$h![!^'V!^!_)q!_!a(w!a!c'V!c!}&$h!}#R'V#R#S&$h#S#T(w#T#o&$h#o#p*}#p#q'V#q#r-b#r$g'V$g$}N|$}%O&$h%O%WN|%W%o&$h%o%pN|%p&a&$h&a&bN|&b1p&$h1p4U&$h4U4d&$h4d4eN|4e$IS&$h$IS$I`N|$I`$Ib&$h$Ib$JeN|$Je$Jg&$h$Jg$KhN|$Kh%#t&$h%#t&/xN|&/x&Et&$h&Et&FVN|&FV;'S&$h;'S;:j&(q;:j;=`!#`<%l?&rN|?&r?Ah&$h?Ah?BYN|?BY?Mn&$h?MnON|%2y&(tP;=`<%l&$h%Du&)`!aeW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Du&-hP;=`<%l&(w$/P&-|i!j&j#O,U!]P$mMh$o!LQ![!b!i`Oq(wqr>yrs(wsv>yvw:Qwx(wx!O>y!O!Q(w!Q![>y![!](w!]!^>y!^!_:Q!_!a(w!a#o>y#o#p)q#p#q(w#q#r@u#r#s>y#s$f(w$f;'S>y;'S;=`Bo<%l?Ah>y?Ah?BY(w?BY?Mn>y?MnO(w(CV&0W!ceW!j&j#O,U!cU!]P#V7[}$IS$mMh$o!LQ$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#h&(w#h#i&4c#i#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk&4z!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#h&(w#h#i&9V#i#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk&9n!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#f&(w#f#g&=y#g#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk&>b!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#]&(w#]#^&Bm#^#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk&CU!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#U&(w#U#V&Ga#V#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk&Gx!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#i&(w#i#j&LT#j#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk&Ll!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#h&(w#h#i'!w#i#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk'#`!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#X&(w#X#Y''k#Y#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk'(S!ceW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#g&(w#g#h',_#h#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l%Gk',x!a$p#teW!j&j#O,U!cU!]P#V7[}$IS$]p![!b!i`OX'VXZ(wZ['V[^(w^p'Vpq(wqr5brs(wst5btuK|uv5bvw7uwx(wx}5b}!O%JP!O!P&$h!P!Q'V!Q![&(w![!]'V!]!^5b!^!_:Q!_!a(w!a!c5b!c!}&(w!}#R5b#R#S&(w#S#T>y#T#o&(w#o#p*}#p#q'V#q#rBu#r#s5b#s$f'V$f$g5b$g$}K|$}%O&(w%O%WK|%W%o&(w%o%pK|%p&a&(w&a&bK|&b1p&(w1p4U&(w4U4d&(w4d4eK|4e$IS&(w$IS$I`K|$I`$Ib&(w$Ib$JeK|$Je$Jg&(w$Jg$KhK|$Kh%#t&(w%#t&/xK|&/x&Et&(w&Et&FVK|&FV;'S&(w;'S;:j&-e;:j;=`!#f<%l?&rK|?&r?Ah&(w?Ah?BY!#l?BY?Mn&(w?MnO!#l$4k'1SU![!bO#o)q#o#p'1f#p#q)q#r;'S)q;'S;=`*S<%lO)q$4k'1mWb$3X![!bOq)qqr'2Vr#o)q#o#p'3l#p#q)q#r;'S)q;'S;=`*S<%lO)q!c'2^U![!b$tPO})q}!O'2p!O#q)q#r;'S)q;'S;=`*S<%lO)q!c'2uU![!bO})q}!O'3X!O#q)q#r;'S)q;'S;=`*S<%lO)q!c'3`S![!b$rPO#q)q#r;'S)q;'S;=`*S<%lO)q!c'3sS$^P![!bO#q)q#r;'S)q;'S;=`*S<%lO)q$4k'4`g!}`!]P#V7[$mMh$o!LQ![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wsv'Vvw*}wx(wx!^'V!^!_)q!_!a(w!a#S'V#S#T(w#T#o'V#o#p*}#p#q'V#q#r-b#r;'S'V;'S;=`.}<%lO'V(@a'6Yp!j&j#O,U!]P#V7[$mMh$o!LQ!i`OX-bXZ*YZ[-b[^*Y^p-bpq*YqrBurs*YsvBuvw<ywx*Yx!OBu!O!Q-b!Q![Bu![!]-b!]!^Bu!^!_;q!_!a*Y!a#SBu#S#T@u#T#oBu#o#p,a#p#q-b#q#r'8^#r#sBu#s$f-b$f;'SBu;'S;=`ET<%l?AhBu?Ah?BY-b?BY?MnBu?MnO-b%Du'8opg$K`!j&j#O,U!]P#V7[$uQ!i`OX-bXZ*YZ[-b[^*Y^p-bpq*YqrBurs*YsvBuvw<ywx*Yx!OBu!O!Q-b!Q![Bu![!]-b!]!^Bu!^!_;q!_!a*Y!a#SBu#S#T@u#T#oBu#o#p,a#p#q-b#q#r':s#r#sBu#s$f-b$f;'SBu;'S;=`ET<%l?AhBu?Ah?BY-b?BY?MnBu?MnO-bHc';So$_S!j&j#O,U!]P#V7[!i`OX-bXZ*YZ[-b[^*Y^p-bpq*YqrBurs*YsvBuvw<ywx*Yx!OBu!O!Q-b!Q![Bu![!]-b!]!^Bu!^!_;q!_!a*Y!a#SBu#S#T@u#T#oBu#o#p,a#p#q-b#q#sBu#s$f-b$f;'SBu;'S;=`ET<%l?AhBu?Ah?BY-b?BY?MnBu?MnO-b(@a'=WP;=`<%l%E_(@Z'=^P;=`<%lHx(/X'=tqeW!]P#V7[}$IS$mMh$o!LQ$]p![!bOX'VXZ(wZ['V[^(w^p'Vpq(wqr'Vrs(wst'Vtu!#luv'Vvw*}wx(wx!O'V!O!PN|!P!Q'V!Q![!#l![!^'V!^!_)q!_!a(w!a!c'V!c!}!#l!}#R'V#R#S!#l#S#T(w#T#o!#l#o#p*}#p#q'V#q#r-b#r$g'V$g;'S!#l;'S;=`!&S<%lO!#l",
  tokenizers: [scriptTokens, styleTokens, textareaTokens, tagStart, commentContent, moustacheCommentContent, longMoustacheCommentContent, longExpression, shortExpression, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  topRules: {
    "Document": [0, 15]
  },
  specialized: [{
    term: 19,
    get: value => spec_BlockPrefix[value] || -1
  }, {
    term: 21,
    get: value => spec_BlockType[value] || -1
  }, {
    term: 151,
    get: value => spec_identifier[value] || -1
  }, {
    term: 71,
    get: value => spec_AttributeName[value] || -1
  }],
  tokenPrec: 1814
});
function getAttrs(element, input) {
  let attrs = Object.create(null);
  if (!element) return attrs;
  if (!element.firstChild) return attrs;
  for (let att of element.firstChild.getChildren('Attribute')) {
    let name = att.getChild('AttributeName'),
      value = att.getChild('AttributeValue') || att.getChild('UnquotedAttributeValue');
    if (name) attrs[input.read(name.from, name.to)] = !value ? '' : value.name == 'AttributeValue' ? input.read(value.from + 1, value.to - 1) : input.read(value.from, value.to);
  }
  return attrs;
}
function maybeNest(node, input, tags) {
  let attrs = {};
  for (let tag of tags) {
    if (!tag.attrs) return {
      parser: tag.parser
    };
    let evaluatedAttrs = attrs || getAttrs(node.node.parent, input);
    if (tag.attrs(evaluatedAttrs)) return {
      parser: tag.parser
    };
  }
  return null;
}
// const expressionParser = glimmerExpressionParser;
const expressionParser = /*@__PURE__*/parser$2.configure({
  top: 'SingleExpression'
});
function configureNesting(tags) {
  let script = [];
  let style = [];
  let textarea = [];
  for (let tag of tags) {
    let array = tag.tag == 'script' ? script : tag.tag == 'style' ? style : tag.tag == 'textarea' ? textarea : null;
    if (!array) throw new RangeError('Only script, style, and textarea tags can host nested parsers');
    array.push(tag);
  }
  return parseMixed((node, input) => {
    let id = node.type.id;
    if (id === LongExpression) return {
      parser: expressionParser
    };
    if (id === ShortExpression) return {
      parser: expressionParser
    };
    if (id === ScriptText) return maybeNest(node, input, script);
    if (id === StyleText) return maybeNest(node, input, style);
    if (id === TextareaText) return maybeNest(node, input, textarea);
    return null;
  });
}
const glimmerParser = parser;

const defaultNesting = [{
  tag: 'script',
  attrs: attrs => attrs['type'] === 'text/typescript' || attrs['lang'] === 'ts',
  parser: typescriptLanguage.parser
}, {
  tag: 'script',
  attrs(attrs) {
    return !attrs['type'] || /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i.test(attrs['type']);
  },
  parser: javascriptLanguage.parser
}, {
  tag: 'style',
  attrs(/* attrs */
  ) {
    return true;
    // Always use CSS. We can add varying support later
    // return (
    //   (!attrs['lang'] || attrs['lang'] === 'css' || attrs['lang'] === 'scss') &&
    //   (!attrs['type'] || /^(text\/)?(x-)?(stylesheet|css|scss)$/i.test(attrs['type']))
    // );
  },
  parser: cssLanguage.parser
}];
const glimmerPlain = /*@__PURE__*/LRLanguage.define({
  parser: /*@__PURE__*/glimmerParser.configure({
    props: [/*@__PURE__*/indentNodeProp.add({
      Element: context => {
        let after = /^(\s*)(<\/)?/.exec(context.textAfter);
        if (!after) return null;
        if (context.node.to <= context.pos + after[0].length) return context.continue();
        return context.lineIndent(context.node.from) + (after[2] ? 0 : context.unit);
      },
      Block: context => {
        const node = context.node;
        const text = context.textAfter.trim();
        if (text.startsWith('{/')) {
          const name = node.name;
          if (name === 'IfBlock' && text.startsWith('{/if') || name === 'UnlessBlock' && text.startsWith('{/unless') || name === 'InElementBlock' && text.startsWith('{/in-element') || name === 'EachBlock' && text.startsWith('{/each') || name === 'EachInBlock' && text.startsWith('{/each-in') || name === 'LetBlock' && text.startsWith('{/let')) {
            return context.lineIndent(context.node.from);
          }
          return null;
        }
        if (node.name === 'IfBlock' || node.name === 'EachBlock' || node.name === 'EachInBlock' || node.name === 'UnlessBlock') {
          if (text.startsWith('{{:else')) return context.lineIndent(node.from);
          if (text.startsWith('{{else')) return context.lineIndent(node.from);
        }
        // not sure if this needed to be duplicated
        let after = /^(\s*)(<\/)?/.exec(context.textAfter);
        if (!after) return null;
        if (context.node.to <= context.pos + after[0].length) return context.continue();
        return context.lineIndent(context.node.from) + (after[2] ? 0 : context.unit);
      },
      'BlockOpen BlockClose BlockInline': context => {
        return context.column(context.node.from) + context.unit;
      },
      'OpenTag CloseTag SelfClosingTag': context => {
        return context.column(context.node.from) + context.unit;
      },
      Document: context => {
        var _a, _b;
        if (context.pos + (((_b = (_a = /\s*/.exec(context.textAfter)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.length) || 0) < context.node.to) {
          return context.continue();
        }
        let endElt = null;
        let close;
        for (let cur = context.node;;) {
          let last = cur.lastChild;
          if (!last || last.name != 'Element' || last.to != cur.to) break;
          endElt = cur = last;
        }
        if (endElt && !((close = endElt.lastChild) && (close.name === 'CloseTag' || close.name === 'SelfClosingTag'))) {
          return context.lineIndent(endElt.from) + context.unit;
        }
        return null;
      }
    }), /*@__PURE__*/foldNodeProp.add({
      Block: node => {
        const open = `${node.name}Open`;
        const close = `${node.name}Close`;
        const first = node.firstChild;
        const last = node.lastChild;
        if (!first || first.name !== open) return null;
        return {
          from: first.to,
          to: (last === null || last === void 0 ? void 0 : last.name) === close ? last.from : node.to
        };
      },
      Element: node => {
        let first = node.firstChild;
        let last = node.lastChild;
        if (!last) return null;
        if (!first || first.name != 'OpenTag') return null;
        return {
          from: first.to,
          to: last.name === 'CloseTag' ? last.from : node.to
        };
      }
    })]
  }),
  languageData: {
    commentTokens: {
      block: {
        open: '<!--',
        close: '-->'
      },
      moustacheLong: {
        open: '{{!--',
        close: '--}}'
      }
    },
    indentOnInput: /^\s*((<\/\w+\W)|(\{\{:?(else|then|catch))|(\{\{\/(if|each|each-in|in-element|unless|let)))$/,
    wordChars: '-._'
  }
});
const glimmerLanguage = /*@__PURE__*/glimmerPlain.configure({
  wrap: /*@__PURE__*/configureNesting(defaultNesting)
});

// unfortunately the HTML language explicitly checks for the language type,
// so we have to duplicate the entire autoCloseTags extension
function elementName(doc, tree, max = doc.length) {
  if (!tree) return '';
  let tag = tree.firstChild;
  let name = tag && (tag.getChild('TagName') || tag.getChild('ComponentName') || tag.getChild('SvelteElementName'));
  return name ? doc.sliceString(name.from, Math.min(name.to, max)) : '';
}
const autoCloseTags = /*@__PURE__*/EditorView.inputHandler.of((view, from, to, text) => {
  if (view.composing || view.state.readOnly || from != to || text != '>' && text != '/' || !glimmerLanguage.isActiveAt(view.state, from, -1)) return false;
  let {
    state
  } = view;
  const noChanges = {
    range: undefined,
    changes: undefined,
    effects: undefined
  };
  let changes = state.changeByRange(range => {
    var _a, _b, _c;
    let {
      head
    } = range;
    let around = syntaxTree(state).resolveInner(head, -1);
    let name;
    if (around.name === 'TagName' || around.name === 'ComponentName' || around.name === 'StartTag') {
      if (!around.parent) return Object.assign(Object.assign({}, noChanges), {
        range
      });
      around = around.parent;
    }
    if (text === '>' && around.name === 'OpenTag') {
      if (((_b = (_a = around.parent) === null || _a === void 0 ? void 0 : _a.lastChild) === null || _b === void 0 ? void 0 : _b.name) != 'CloseTag' && (name = elementName(state.doc, around.parent, head))) {
        let hasRightBracket = view.state.doc.sliceString(head, head + 1) === '>';
        let insert = `${hasRightBracket ? '' : '>'}</${name}>`;
        return {
          range: EditorSelection.cursor(head + 1),
          changes: {
            from: head + (hasRightBracket ? 1 : 0),
            insert
          }
        };
      }
    } else if (text === '/' && around.name === 'OpenTag') {
      let empty = around.parent,
        base = empty === null || empty === void 0 ? void 0 : empty.parent;
      if (!empty) return Object.assign(Object.assign({}, noChanges), {
        range
      });
      if (!base) return Object.assign(Object.assign({}, noChanges), {
        range
      });
      if (empty.from == head - 1 && ((_c = base.lastChild) === null || _c === void 0 ? void 0 : _c.name) != 'CloseTag' && (name = elementName(state.doc, base, head))) {
        let hasRightBracket = view.state.doc.sliceString(head, head + 1) === '>';
        let insert = `/${name}${hasRightBracket ? '' : '>'}`;
        let pos = head + insert.length + (hasRightBracket ? 1 : 0);
        return {
          range: EditorSelection.cursor(pos),
          changes: {
            from: head,
            insert
          }
        };
      }
    }
    return {
      range
    };
  });
  if (changes.changes.empty) return false;
  view.dispatch(changes, {
    userEvent: 'input.type',
    scrollIntoView: true
  });
  return true;
});

/**
A collection of JavaScript-related
[snippets](https://codemirror.net/6/docs/ref/#autocomplete.snippet).
*/
const snippets = [/*@__PURE__*/snippetCompletion('#each ${list} as |${item}|}}\n\t${}\n{{/each', {
  label: '#each',
  detail: 'loop',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#each-in ${object} as |${key} ${value}|}}\n\t${}\n{{/each-in', {
  label: '#each-in',
  detail: 'loop',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#let ${subExpression} as |${result}|}}\n\t${}\n{{/let', {
  label: '#let',
  detail: 'block',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#if ${condition}}}\n\t${}\n{{/if', {
  label: '#if',
  detail: 'block',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#in-element ${element}}}\n\t${}\n{{/in-element', {
  label: '#in-element',
  detail: 'block',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#unless ${condition}}}\n\t${}\n{{/unless', {
  label: '#unless',
  detail: 'block',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#if ${condition}}}\n\t${}\n{{else}}\n\t${}\n{{/if', {
  label: '#if',
  detail: '/ else block',
  type: 'keyword'
}), /*@__PURE__*/snippetCompletion('#unless ${condition}}}\n\t${}\n{{else}}\n\t${}\n{{/unless', {
  label: '#unless',
  detail: '/ else block',
  type: 'keyword'
})];
function glimmer() {
  return new LanguageSupport(glimmerLanguage, [javascript().support, css().support, new LanguageSupport(LRLanguage.define({
    name: 'glimmer-expression',
    parser: parser$1.configure({})
  }), []), glimmerLanguage.data.of({
    autocomplete: snippets
  }),
  // We may want to swap this with Glimmer-specific tag completion
  glimmerLanguage.data.of({
    autocomplete: htmlTagCompletion
  }), autoCloseTags]);
}
function htmlTagCompletion(context) {
  let {
      state,
      pos
    } = context,
    m = /<[:\-.\w\u00b7-\uffff]*$/.exec(state.sliceDoc(pos - 25, pos));
  if (!m) return null;
  let tree = syntaxTree(state).resolveInner(pos, -1);
  while (tree && !tree.type.isTop) {
    if (tree.name == 'CodeBlock' || tree.name == 'FencedCode' || tree.name == 'ProcessingInstructionBlock' || tree.name == 'CommentBlock' || tree.name == 'Link' || tree.name == 'Image') {
      return null;
    }
    tree = tree.parent;
  }
  return {
    from: pos - m[0].length,
    to: pos,
    options: htmlTagCompletions(),
    validFor: /^<[:\-.\w\u00b7-\uffff]*$/
  };
}
let _tagCompletions = null;
const htmlNoMatch = /*@__PURE__*/html({
  matchClosingTags: false
});
function htmlTagCompletions() {
  if (_tagCompletions) return _tagCompletions;
  let result = htmlCompletionSource(new CompletionContext(EditorState.create({
    extensions: htmlNoMatch
  }), 0, true));
  return _tagCompletions = result ? result.options : [];
}

export { defaultNesting, glimmer, glimmerLanguage, glimmerPlain, snippets };
