import { a as closeBrackets, b as autocompletion, d as closeBracketsKeymap, e as completionKeymap } from './index-DoDyyjRT.js';
import { h as history, d as defaultKeymap, a as historyKeymap, l as lintKeymap, i as indentWithTab } from './index-CUsvjKcZ.js';
import { b as markdownKeymap } from './index-AIiFV6Iq.js';
import { g as StateEffect, a6 as getPanel, E as EditorSelection, ai as showDialog, b as EditorView, V as ViewPlugin, D as Decoration, e as StateField, a8 as showPanel, P as Prec, c as codePointAt, f as fromCodePoint, d as codePointSize, F as Facet, l as combineConfig, C as CharCategory, ac as EditorState, a9 as RangeSetBuilder, aa as crelt, aj as runScopeHandlers, a2 as findClusterBreak, ak as lineNumbers, al as highlightActiveLineGutter, am as highlightSpecialChars, an as foldGutter, ao as drawSelection, ap as dropCursor, aq as indentOnInput, ar as syntaxHighlighting, as as defaultHighlightStyle, at as bracketMatching, au as rectangularSelection, av as crosshairCursor, aw as highlightActiveLine, n as keymap, ax as foldKeymap, ay as Compartment } from './index-BZr71EI0.js';
import { foldByIndent } from './index-BMtY9wO6.js';
import './index-CkCz5A90.js';
import './index-DjmRBv4T.js';
import './index-Da_U3wY2.js';
import './index-D2CeE0KS.js';
import './index-dqVyFyRL.js';

const basicNormalize = typeof String.prototype.normalize == "function" ? x => x.normalize("NFKD") : x => x;
/**
A search cursor provides an iterator over text matches in a
document.
*/
class SearchCursor {
  /**
  Create a text cursor. The query is the search string, `from` to
  `to` provides the region to search.
  
  When `normalize` is given, it will be called, on both the query
  string and the content it is matched against, before comparing.
  You can, for example, create a case-insensitive search by
  passing `s => s.toLowerCase()`.
  
  Text is always normalized with
  [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
  (when supported).
  */
  constructor(text, query, from = 0, to = text.length, normalize, test) {
    this.test = test;
    /**
    The current match (only holds a meaningful value after
    [`next`](https://codemirror.net/6/docs/ref/#search.SearchCursor.next) has been called and when
    `done` is false).
    
    The `precise` flag will be set to false if the match starts or
    ends _inside_ a character that, when normalized, expands to
    multiple characters. It indicates that the `from`-`to` range
    covers content that isn't part of the actual match.
    */
    this.value = {
      from: 0,
      to: 0,
      precise: false
    };
    /**
    Whether the end of the iterated region has been reached.
    */
    this.done = false;
    this.matches = [];
    this.buffer = "";
    this.bufferPos = 0;
    this.iter = text.iterRange(from, to);
    this.bufferStart = from;
    this.normalize = normalize ? x => normalize(basicNormalize(x)) : basicNormalize;
    this.query = this.normalize(query);
  }
  peek() {
    if (this.bufferPos == this.buffer.length) {
      this.bufferStart += this.buffer.length;
      this.iter.next();
      if (this.iter.done) return -1;
      this.bufferPos = 0;
      this.buffer = this.iter.value;
    }
    return codePointAt(this.buffer, this.bufferPos);
  }
  /**
  Look for the next match. Updates the iterator's
  [`value`](https://codemirror.net/6/docs/ref/#search.SearchCursor.value) and
  [`done`](https://codemirror.net/6/docs/ref/#search.SearchCursor.done) properties. Should be called
  at least once before using the cursor.
  */
  next() {
    while (this.matches.length) this.matches.pop();
    return this.nextOverlapping();
  }
  /**
  The `next` method will ignore matches that partially overlap a
  previous match. This method behaves like `next`, but includes
  such matches.
  */
  nextOverlapping() {
    for (;;) {
      let next = this.peek();
      if (next < 0) {
        this.done = true;
        return this;
      }
      let str = fromCodePoint(next),
        start = this.bufferStart + this.bufferPos;
      this.bufferPos += codePointSize(next);
      let norm = this.normalize(str);
      if (norm.length) for (let i = 0, pos = start, posPrecise = true;; i++) {
        let code = norm.charCodeAt(i);
        let match = this.match(code, pos, posPrecise, this.bufferPos + this.bufferStart, i == norm.length - 1);
        if (match) {
          this.value = match;
          return this;
        }
        if (i == norm.length - 1) break;
        if (posPrecise && i < str.length && str.charCodeAt(i) == code) pos++;else posPrecise = false;
      }
    }
  }
  match(code, pos, posPrecise, end, endPrecise) {
    let match = null;
    for (let i = 0; i < this.matches.length;) {
      let partial = this.matches[i],
        keep = false;
      if (this.query.charCodeAt(partial.index) == code) {
        if (partial.index == this.query.length - 1) {
          match = {
            from: partial.from,
            to: end,
            precise: endPrecise && partial.precise
          };
        } else {
          partial.index++;
          keep = true;
        }
      }
      if (keep) i++;else this.matches.splice(i, 1);
    }
    if (this.query.charCodeAt(0) == code) {
      if (this.query.length == 1) match = {
        from: pos,
        to: end,
        precise: posPrecise && endPrecise
      };else this.matches.push({
        from: pos,
        index: 1,
        precise: posPrecise
      });
    }
    if (match && this.test && !this.test(match.from, match.to, this.buffer, this.bufferStart)) match = null;
    return match;
  }
}
if (typeof Symbol != "undefined") SearchCursor.prototype[Symbol.iterator] = function () {
  return this;
};
const empty = {
  from: -1,
  to: -1,
  match: /*@__PURE__*//.*/.exec(""),
  precise: true
};
const baseFlags = "gm" + (/x/.unicode == null ? "" : "u");
/**
This class is similar to [`SearchCursor`](https://codemirror.net/6/docs/ref/#search.SearchCursor)
but searches for a regular expression pattern instead of a plain
string.
*/
class RegExpCursor {
  /**
  Create a cursor that will search the given range in the given
  document. `query` should be the raw pattern (as you'd pass it to
  `new RegExp`).
  */
  constructor(text, query, options, from = 0, to = text.length) {
    this.text = text;
    this.to = to;
    this.curLine = "";
    /**
    Set to `true` when the cursor has reached the end of the search
    range.
    */
    this.done = false;
    /**
    Will contain an object with the extent of the match and the
    match object when [`next`](https://codemirror.net/6/docs/ref/#search.RegExpCursor.next)
    sucessfully finds a match. The `precise` flag is always true for
    this type of cursor, and only there to make sure this cursor is
    a subtype of `SearchCursor`.
    */
    this.value = empty;
    if (/\\[sWDnr]|\n|\r|\[\^/.test(query)) return new MultilineRegExpCursor(text, query, options, from, to);
    this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
    this.test = options === null || options === void 0 ? void 0 : options.test;
    this.iter = text.iter();
    let startLine = text.lineAt(from);
    this.curLineStart = startLine.from;
    this.matchPos = toCharEnd(text, from);
    this.getLine(this.curLineStart);
  }
  getLine(skip) {
    this.iter.next(skip);
    if (this.iter.lineBreak) {
      this.curLine = "";
    } else {
      this.curLine = this.iter.value;
      if (this.curLineStart + this.curLine.length > this.to) this.curLine = this.curLine.slice(0, this.to - this.curLineStart);
      this.iter.next();
    }
  }
  nextLine() {
    this.curLineStart = this.curLineStart + this.curLine.length + 1;
    if (this.curLineStart > this.to) this.curLine = "";else this.getLine(0);
  }
  /**
  Move to the next match, if there is one.
  */
  next() {
    for (let off = this.matchPos - this.curLineStart;;) {
      this.re.lastIndex = off;
      let match = this.matchPos <= this.to && this.re.exec(this.curLine);
      if (match) {
        let from = this.curLineStart + match.index,
          to = from + match[0].length;
        this.matchPos = toCharEnd(this.text, to + (from == to ? 1 : 0));
        if (from == this.curLineStart + this.curLine.length) this.nextLine();
        if ((from < to || from > this.value.to) && (!this.test || this.test(from, to, match))) {
          this.value = {
            from,
            to,
            precise: true,
            match
          };
          return this;
        }
        off = this.matchPos - this.curLineStart;
      } else if (this.curLineStart + this.curLine.length < this.to) {
        this.nextLine();
        off = 0;
      } else {
        this.done = true;
        return this;
      }
    }
  }
}
const flattened = /*@__PURE__*/new WeakMap();
// Reusable (partially) flattened document strings
class FlattenedDoc {
  constructor(from, text) {
    this.from = from;
    this.text = text;
  }
  get to() {
    return this.from + this.text.length;
  }
  static get(doc, from, to) {
    let cached = flattened.get(doc);
    if (!cached || cached.from >= to || cached.to <= from) {
      let flat = new FlattenedDoc(from, doc.sliceString(from, to));
      flattened.set(doc, flat);
      return flat;
    }
    if (cached.from == from && cached.to == to) return cached;
    let {
      text,
      from: cachedFrom
    } = cached;
    if (cachedFrom > from) {
      text = doc.sliceString(from, cachedFrom) + text;
      cachedFrom = from;
    }
    if (cached.to < to) text += doc.sliceString(cached.to, to);
    flattened.set(doc, new FlattenedDoc(cachedFrom, text));
    return new FlattenedDoc(from, text.slice(from - cachedFrom, to - cachedFrom));
  }
}
class MultilineRegExpCursor {
  constructor(text, query, options, from, to) {
    this.text = text;
    this.to = to;
    this.done = false;
    this.value = empty;
    this.matchPos = toCharEnd(text, from);
    this.re = new RegExp(query, baseFlags + ((options === null || options === void 0 ? void 0 : options.ignoreCase) ? "i" : ""));
    this.test = options === null || options === void 0 ? void 0 : options.test;
    this.flat = FlattenedDoc.get(text, from, this.chunkEnd(from + 5000 /* Chunk.Base */));
  }
  chunkEnd(pos) {
    return pos >= this.to ? this.to : this.text.lineAt(pos).to;
  }
  next() {
    for (;;) {
      let off = this.re.lastIndex = this.matchPos - this.flat.from;
      let match = this.re.exec(this.flat.text);
      // Skip empty matches directly after the last match
      if (match && !match[0] && match.index == off) {
        this.re.lastIndex = off + 1;
        match = this.re.exec(this.flat.text);
      }
      if (match) {
        let from = this.flat.from + match.index,
          to = from + match[0].length;
        // If a match goes almost to the end of a noncomplete chunk, try
        // again, since it'll likely be able to match more
        if ((this.flat.to >= this.to || match.index + match[0].length <= this.flat.text.length - 10) && (!this.test || this.test(from, to, match))) {
          this.value = {
            from,
            to,
            precise: true,
            match
          };
          this.matchPos = toCharEnd(this.text, to + (from == to ? 1 : 0));
          return this;
        }
      }
      if (this.flat.to == this.to) {
        this.done = true;
        return this;
      }
      // Grow the flattened doc
      this.flat = FlattenedDoc.get(this.text, this.flat.from, this.chunkEnd(this.flat.from + this.flat.text.length * 2));
    }
  }
}
if (typeof Symbol != "undefined") {
  RegExpCursor.prototype[Symbol.iterator] = MultilineRegExpCursor.prototype[Symbol.iterator] = function () {
    return this;
  };
}
function validRegExp(source) {
  try {
    return true;
  } catch (_a) {
    return false;
  }
}
function toCharEnd(text, pos) {
  if (pos >= text.length) return pos;
  let line = text.lineAt(pos),
    next;
  while (pos < line.to && (next = line.text.charCodeAt(pos - line.from)) >= 0xDC00 && next < 0xE000) pos++;
  return pos;
}

/**
Command that shows a dialog asking the user for a line number, and
when a valid position is provided, moves the cursor to that line.

Supports line numbers, relative line offsets prefixed with `+` or
`-`, document percentages suffixed with `%`, and an optional
column position by adding `:` and a second number after the line
number.
*/
const gotoLine = view => {
  let {
    state
  } = view;
  let line = String(state.doc.lineAt(view.state.selection.main.head).number);
  let {
    close,
    result
  } = showDialog(view, {
    label: state.phrase("Go to line"),
    input: {
      type: "text",
      name: "line",
      value: line
    },
    focus: true,
    submitLabel: state.phrase("go")
  });
  result.then(form => {
    let match = form && /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(form.elements["line"].value);
    if (!match) {
      view.dispatch({
        effects: close
      });
      return;
    }
    let startLine = state.doc.lineAt(state.selection.main.head);
    let [, sign, ln, cl, percent] = match;
    let col = cl ? +cl.slice(1) : 0;
    let line = ln ? +ln : startLine.number;
    if (ln && percent) {
      let pc = line / 100;
      if (sign) pc = pc * (sign == "-" ? -1 : 1) + startLine.number / state.doc.lines;
      line = Math.round(state.doc.lines * pc);
    } else if (ln && sign) {
      line = line * (sign == "-" ? -1 : 1) + startLine.number;
    }
    let docLine = state.doc.line(Math.max(1, Math.min(state.doc.lines, line)));
    let selection = EditorSelection.cursor(docLine.from + Math.max(0, Math.min(col, docLine.length)));
    view.dispatch({
      effects: [close, EditorView.scrollIntoView(selection.from, {
        y: 'center'
      })],
      selection
    });
  });
  return true;
};
const defaultHighlightOptions = {
  highlightWordAroundCursor: false,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: false
};
const highlightConfig = /*@__PURE__*/Facet.define({
  combine(options) {
    return combineConfig(options, defaultHighlightOptions, {
      highlightWordAroundCursor: (a, b) => a || b,
      minSelectionLength: Math.min,
      maxMatches: Math.min
    });
  }
});
/**
This extension highlights text that matches the selection. It uses
the `"cm-selectionMatch"` class for the highlighting. When
`highlightWordAroundCursor` is enabled, the word at the cursor
itself will be highlighted with `"cm-selectionMatch-main"`.
*/
function highlightSelectionMatches(options) {
  let ext = [defaultTheme, matchHighlighter];
  return ext;
}
const matchDeco = /*@__PURE__*/Decoration.mark({
  class: "cm-selectionMatch"
});
const mainMatchDeco = /*@__PURE__*/Decoration.mark({
  class: "cm-selectionMatch cm-selectionMatch-main"
});
// Whether the characters directly outside the given positions are non-word characters
function insideWordBoundaries(check, state, from, to) {
  return (from == 0 || check(state.sliceDoc(from - 1, from)) != CharCategory.Word) && (to == state.doc.length || check(state.sliceDoc(to, to + 1)) != CharCategory.Word);
}
// Whether the characters directly at the given positions are word characters
function insideWord(check, state, from, to) {
  return check(state.sliceDoc(from, from + 1)) == CharCategory.Word && check(state.sliceDoc(to - 1, to)) == CharCategory.Word;
}
const matchHighlighter = /*@__PURE__*/ViewPlugin.fromClass(class {
  constructor(view) {
    this.decorations = this.getDeco(view);
  }
  update(update) {
    if (update.selectionSet || update.docChanged || update.viewportChanged) this.decorations = this.getDeco(update.view);
  }
  getDeco(view) {
    let conf = view.state.facet(highlightConfig);
    let {
        state
      } = view,
      sel = state.selection;
    if (sel.ranges.length > 1) return Decoration.none;
    let range = sel.main,
      query,
      check = null;
    if (range.empty) {
      if (!conf.highlightWordAroundCursor) return Decoration.none;
      let word = state.wordAt(range.head);
      if (!word) return Decoration.none;
      check = state.charCategorizer(range.head);
      query = state.sliceDoc(word.from, word.to);
    } else {
      let len = range.to - range.from;
      if (len < conf.minSelectionLength || len > 200) return Decoration.none;
      if (conf.wholeWords) {
        query = state.sliceDoc(range.from, range.to); // TODO: allow and include leading/trailing space?
        check = state.charCategorizer(range.head);
        if (!(insideWordBoundaries(check, state, range.from, range.to) && insideWord(check, state, range.from, range.to))) return Decoration.none;
      } else {
        query = state.sliceDoc(range.from, range.to);
        if (!query) return Decoration.none;
      }
    }
    let deco = [];
    for (let part of view.visibleRanges) {
      let cursor = new SearchCursor(state.doc, query, part.from, part.to);
      while (!cursor.next().done) {
        let {
          from,
          to
        } = cursor.value;
        if (!check || insideWordBoundaries(check, state, from, to)) {
          if (range.empty && from <= range.from && to >= range.to) deco.push(mainMatchDeco.range(from, to));else if (from >= range.to || to <= range.from) deco.push(matchDeco.range(from, to));
          if (deco.length > conf.maxMatches) return Decoration.none;
        }
      }
    }
    return Decoration.set(deco);
  }
}, {
  decorations: v => v.decorations
});
const defaultTheme = /*@__PURE__*/EditorView.baseTheme({
  ".cm-selectionMatch": {
    backgroundColor: "#99ff7780"
  },
  ".cm-searchMatch .cm-selectionMatch": {
    backgroundColor: "transparent"
  }
});
// Select the words around the cursors.
const selectWord = ({
  state,
  dispatch
}) => {
  let {
    selection
  } = state;
  let newSel = EditorSelection.create(selection.ranges.map(range => state.wordAt(range.head) || EditorSelection.cursor(range.head)), selection.mainIndex);
  if (newSel.eq(selection)) return false;
  dispatch(state.update({
    selection: newSel
  }));
  return true;
};
// Find next occurrence of query relative to last cursor. Wrap around
// the document if there are no more matches.
function findNextOccurrence(state, query) {
  let {
    main,
    ranges
  } = state.selection;
  let word = state.wordAt(main.head),
    fullWord = word && word.from == main.from && word.to == main.to;
  for (let cycled = false, cursor = new SearchCursor(state.doc, query, ranges[ranges.length - 1].to);;) {
    cursor.next();
    if (cursor.done) {
      if (cycled) return null;
      cursor = new SearchCursor(state.doc, query, 0, Math.max(0, ranges[ranges.length - 1].from - 1));
      cycled = true;
    } else {
      if (cycled && ranges.some(r => r.from == cursor.value.from)) continue;
      if (fullWord) {
        let word = state.wordAt(cursor.value.from);
        if (!word || word.from != cursor.value.from || word.to != cursor.value.to) continue;
      }
      return cursor.value;
    }
  }
}
/**
Select next occurrence of the current selection. Expand selection
to the surrounding word when the selection is empty.
*/
const selectNextOccurrence = ({
  state,
  dispatch
}) => {
  let {
    ranges
  } = state.selection;
  if (ranges.some(sel => sel.from === sel.to)) return selectWord({
    state,
    dispatch
  });
  let searchedText = state.sliceDoc(ranges[0].from, ranges[0].to);
  if (state.selection.ranges.some(r => state.sliceDoc(r.from, r.to) != searchedText)) return false;
  let range = findNextOccurrence(state, searchedText);
  if (!range) return false;
  dispatch(state.update({
    selection: state.selection.addRange(EditorSelection.range(range.from, range.to), false),
    effects: EditorView.scrollIntoView(range.to)
  }));
  return true;
};
const searchConfigFacet = /*@__PURE__*/Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      top: false,
      caseSensitive: false,
      literal: false,
      regexp: false,
      wholeWord: false,
      createPanel: view => new SearchPanel(view),
      scrollToMatch: range => EditorView.scrollIntoView(range)
    });
  }
});
/**
A search query. Part of the editor's search state.
*/
class SearchQuery {
  /**
  Create a query object.
  */
  constructor(config) {
    this.search = config.search;
    this.caseSensitive = !!config.caseSensitive;
    this.literal = !!config.literal;
    this.regexp = !!config.regexp;
    this.replace = config.replace || "";
    this.valid = !!this.search && (!this.regexp || validRegExp());
    this.unquoted = this.unquote(this.search);
    this.wholeWord = !!config.wholeWord;
    this.test = config.test;
  }
  /**
  @internal
  */
  unquote(text) {
    return this.literal ? text : text.replace(/\\([nrt\\])/g, (_, ch) => ch == "n" ? "\n" : ch == "r" ? "\r" : ch == "t" ? "\t" : "\\");
  }
  /**
  Compare this query to another query.
  */
  eq(other) {
    return this.search == other.search && this.replace == other.replace && this.caseSensitive == other.caseSensitive && this.regexp == other.regexp && this.wholeWord == other.wholeWord && this.test == other.test;
  }
  /**
  @internal
  */
  create() {
    return this.regexp ? new RegExpQuery(this) : new StringQuery(this);
  }
  /**
  Get a search cursor for this query, searching through the given
  range in the given state.
  */
  getCursor(state, from = 0, to) {
    let st = state.doc ? state : EditorState.create({
      doc: state
    });
    if (to == null) to = st.doc.length;
    return this.regexp ? regexpCursor(this, st, from, to) : stringCursor(this, st, from, to);
  }
}
class QueryType {
  constructor(spec) {
    this.spec = spec;
  }
}
function wrapStringTest(test, state, inner) {
  return (from, to, buffer, bufferPos) => {
    if (inner && !inner(from, to, buffer, bufferPos)) return false;
    let match = from >= bufferPos && to <= bufferPos + buffer.length ? buffer.slice(from - bufferPos, to - bufferPos) : state.doc.sliceString(from, to);
    return test(match, state, from, to);
  };
}
function stringCursor(spec, state, from, to) {
  let test;
  if (spec.wholeWord) test = stringWordTest(state.doc, state.charCategorizer(state.selection.main.head));
  if (spec.test) test = wrapStringTest(spec.test, state, test);
  return new SearchCursor(state.doc, spec.unquoted, from, to, spec.caseSensitive ? undefined : x => x.toLowerCase(), test);
}
function stringWordTest(doc, categorizer) {
  return (from, to, buf, bufPos) => {
    if (bufPos > from || bufPos + buf.length < to) {
      bufPos = Math.max(0, from - 2);
      buf = doc.sliceString(bufPos, Math.min(doc.length, to + 2));
    }
    return (categorizer(charBefore(buf, from - bufPos)) != CharCategory.Word || categorizer(charAfter(buf, from - bufPos)) != CharCategory.Word) && (categorizer(charAfter(buf, to - bufPos)) != CharCategory.Word || categorizer(charBefore(buf, to - bufPos)) != CharCategory.Word);
  };
}
class StringQuery extends QueryType {
  constructor(spec) {
    super(spec);
  }
  nextMatch(state, curFrom, curTo) {
    let cursor = stringCursor(this.spec, state, curTo, state.doc.length).nextOverlapping();
    if (cursor.done) {
      let end = Math.min(state.doc.length, curFrom + this.spec.unquoted.length);
      cursor = stringCursor(this.spec, state, 0, end).nextOverlapping();
    }
    return cursor.done || cursor.value.from == curFrom && cursor.value.to == curTo ? null : cursor.value;
  }
  // Searching in reverse is, rather than implementing an inverted search
  // cursor, done by scanning chunk after chunk forward.
  prevMatchInRange(state, from, to) {
    for (let pos = to;;) {
      let start = Math.max(from, pos - 10000 /* FindPrev.ChunkSize */ - this.spec.unquoted.length);
      let cursor = stringCursor(this.spec, state, start, pos),
        range = null;
      while (!cursor.nextOverlapping().done) range = cursor.value;
      if (range) return range;
      if (start == from) return null;
      pos -= 10000 /* FindPrev.ChunkSize */;
    }
  }
  prevMatch(state, curFrom, curTo) {
    let found = this.prevMatchInRange(state, 0, curFrom);
    if (!found) found = this.prevMatchInRange(state, Math.max(0, curTo - this.spec.unquoted.length), state.doc.length);
    return found && (found.from != curFrom || found.to != curTo) ? found : null;
  }
  getReplacement(_result) {
    return this.spec.unquote(this.spec.replace);
  }
  matchAll(state, limit) {
    let cursor = stringCursor(this.spec, state, 0, state.doc.length),
      ranges = [];
    while (!cursor.next().done) {
      if (ranges.length >= limit) return null;
      ranges.push(cursor.value);
    }
    return ranges;
  }
  highlight(state, from, to, add) {
    let cursor = stringCursor(this.spec, state, Math.max(0, from - this.spec.unquoted.length), Math.min(to + this.spec.unquoted.length, state.doc.length));
    while (!cursor.next().done) add(cursor.value.from, cursor.value.to);
  }
}
function wrapRegexpTest(test, state, inner) {
  return (from, to, match) => {
    return (!inner || inner(from, to, match)) && test(match[0], state, from, to);
  };
}
function regexpCursor(spec, state, from, to) {
  let test;
  if (spec.wholeWord) test = regexpWordTest(state.charCategorizer(state.selection.main.head));
  if (spec.test) test = wrapRegexpTest(spec.test, state, test);
  return new RegExpCursor(state.doc, spec.search, {
    ignoreCase: !spec.caseSensitive,
    test
  }, from, to);
}
function charBefore(str, index) {
  return str.slice(findClusterBreak(str, index, false), index);
}
function charAfter(str, index) {
  return str.slice(index, findClusterBreak(str, index));
}
function regexpWordTest(categorizer) {
  return (_from, _to, match) => !match[0].length || (categorizer(charBefore(match.input, match.index)) != CharCategory.Word || categorizer(charAfter(match.input, match.index)) != CharCategory.Word) && (categorizer(charAfter(match.input, match.index + match[0].length)) != CharCategory.Word || categorizer(charBefore(match.input, match.index + match[0].length)) != CharCategory.Word);
}
class RegExpQuery extends QueryType {
  nextMatch(state, curFrom, curTo) {
    let cursor = regexpCursor(this.spec, state, curTo, state.doc.length).next();
    if (cursor.done) cursor = regexpCursor(this.spec, state, 0, curFrom).next();
    return cursor.done ? null : cursor.value;
  }
  prevMatchInRange(state, from, to) {
    for (let size = 1;; size++) {
      let start = Math.max(from, to - size * 10000 /* FindPrev.ChunkSize */);
      let cursor = regexpCursor(this.spec, state, start, to),
        range = null;
      while (!cursor.next().done) range = cursor.value;
      if (range && (start == from || range.from > start + 10)) return range;
      if (start == from) return null;
    }
  }
  prevMatch(state, curFrom, curTo) {
    return this.prevMatchInRange(state, 0, curFrom) || this.prevMatchInRange(state, curTo, state.doc.length);
  }
  getReplacement(result) {
    return this.spec.unquote(this.spec.replace).replace(/\$([$&]|\d+)/g, (m, i) => {
      if (i == "&") return result.match[0];
      if (i == "$") return "$";
      for (let l = i.length; l > 0; l--) {
        let n = +i.slice(0, l);
        if (n > 0 && n < result.match.length) return result.match[n] + i.slice(l);
      }
      return m;
    });
  }
  matchAll(state, limit) {
    let cursor = regexpCursor(this.spec, state, 0, state.doc.length),
      ranges = [];
    while (!cursor.next().done) {
      if (ranges.length >= limit) return null;
      ranges.push(cursor.value);
    }
    return ranges;
  }
  highlight(state, from, to, add) {
    let cursor = regexpCursor(this.spec, state, Math.max(0, from - 250 /* RegExp.HighlightMargin */), Math.min(to + 250 /* RegExp.HighlightMargin */, state.doc.length));
    while (!cursor.next().done) add(cursor.value.from, cursor.value.to);
  }
}
/**
A state effect that updates the current search query. Note that
this only has an effect if the search state has been initialized
(by including [`search`](https://codemirror.net/6/docs/ref/#search.search) in your configuration or
by running [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel) at least
once).
*/
const setSearchQuery = /*@__PURE__*/StateEffect.define();
const togglePanel = /*@__PURE__*/StateEffect.define();
const searchState = /*@__PURE__*/StateField.define({
  create(state) {
    return new SearchState(defaultQuery(state).create(), null);
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(setSearchQuery)) value = new SearchState(effect.value.create(), value.panel);else if (effect.is(togglePanel)) value = new SearchState(value.query, effect.value ? createSearchPanel : null);
    }
    return value;
  },
  provide: f => showPanel.from(f, val => val.panel)
});
class SearchState {
  constructor(query, panel) {
    this.query = query;
    this.panel = panel;
  }
}
const matchMark = /*@__PURE__*/Decoration.mark({
    class: "cm-searchMatch"
  }),
  selectedMatchMark = /*@__PURE__*/Decoration.mark({
    class: "cm-searchMatch cm-searchMatch-selected"
  });
const searchHighlighter = /*@__PURE__*/ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.decorations = this.highlight(view.state.field(searchState));
  }
  update(update) {
    let state = update.state.field(searchState);
    if (state != update.startState.field(searchState) || update.docChanged || update.selectionSet || update.viewportChanged) this.decorations = this.highlight(state);
  }
  highlight({
    query,
    panel
  }) {
    if (!panel || !query.spec.valid) return Decoration.none;
    let {
      view
    } = this;
    let builder = new RangeSetBuilder();
    for (let i = 0, ranges = view.visibleRanges, l = ranges.length; i < l; i++) {
      let {
        from,
        to
      } = ranges[i];
      while (i < l - 1 && to > ranges[i + 1].from - 2 * 250 /* RegExp.HighlightMargin */) to = ranges[++i].to;
      query.highlight(view.state, from, to, (from, to) => {
        let selected = view.state.selection.ranges.some(r => r.from == from && r.to == to);
        builder.add(from, to, selected ? selectedMatchMark : matchMark);
      });
    }
    return builder.finish();
  }
}, {
  decorations: v => v.decorations
});
function searchCommand(f) {
  return view => {
    let state = view.state.field(searchState, false);
    return state && state.query.spec.valid ? f(view, state) : openSearchPanel(view);
  };
}
/**
Open the search panel if it isn't already open, and move the
selection to the first match after the current main selection.
Will wrap around to the start of the document when it reaches the
end.
*/
const findNext = /*@__PURE__*/searchCommand((view, {
  query
}) => {
  let {
    to
  } = view.state.selection.main;
  let next = query.nextMatch(view.state, to, to);
  if (!next) return false;
  let selection = EditorSelection.single(next.from, next.to);
  let config = view.state.facet(searchConfigFacet);
  view.dispatch({
    selection,
    effects: [announceMatch(view, next), config.scrollToMatch(selection.main, view)],
    userEvent: "select.search"
  });
  selectSearchInput(view);
  return true;
});
/**
Move the selection to the previous instance of the search query,
before the current main selection. Will wrap past the start
of the document to start searching at the end again.
*/
const findPrevious = /*@__PURE__*/searchCommand((view, {
  query
}) => {
  let {
      state
    } = view,
    {
      from
    } = state.selection.main;
  let prev = query.prevMatch(state, from, from);
  if (!prev) return false;
  let selection = EditorSelection.single(prev.from, prev.to);
  let config = view.state.facet(searchConfigFacet);
  view.dispatch({
    selection,
    effects: [announceMatch(view, prev), config.scrollToMatch(selection.main, view)],
    userEvent: "select.search"
  });
  selectSearchInput(view);
  return true;
});
/**
Select all instances of the search query.
*/
const selectMatches = /*@__PURE__*/searchCommand((view, {
  query
}) => {
  let ranges = query.matchAll(view.state, 1000);
  if (!ranges || !ranges.length) return false;
  view.dispatch({
    selection: EditorSelection.create(ranges.map(r => EditorSelection.range(r.from, r.to))),
    userEvent: "select.search.matches"
  });
  return true;
});
/**
Select all instances of the currently selected text.
*/
const selectSelectionMatches = ({
  state,
  dispatch
}) => {
  let sel = state.selection;
  if (sel.ranges.length > 1 || sel.main.empty) return false;
  let {
    from,
    to
  } = sel.main;
  let ranges = [],
    main = 0;
  for (let cur = new SearchCursor(state.doc, state.sliceDoc(from, to)); !cur.next().done;) {
    if (ranges.length > 1000) return false;
    if (cur.value.from == from) main = ranges.length;
    ranges.push(EditorSelection.range(cur.value.from, cur.value.to));
  }
  dispatch(state.update({
    selection: EditorSelection.create(ranges, main),
    userEvent: "select.search.matches"
  }));
  return true;
};
/**
Replace the current match of the search query.
*/
const replaceNext = /*@__PURE__*/searchCommand((view, {
  query
}) => {
  let {
      state
    } = view,
    {
      from,
      to
    } = state.selection.main;
  if (state.readOnly) return false;
  let match = query.nextMatch(state, from, from);
  if (!match) return false;
  let next = match;
  let changes = [],
    selection,
    replacement;
  let effects = [];
  if (!next.precise) {
    next = query.nextMatch(state, next.from, next.to);
  } else if (next.from == from && next.to == to) {
    replacement = state.toText(query.getReplacement(next));
    changes.push({
      from: next.from,
      to: next.to,
      insert: replacement
    });
    next = query.nextMatch(state, next.from, next.to);
    effects.push(EditorView.announce.of(state.phrase("replaced match on line $", state.doc.lineAt(from).number) + "."));
  }
  let changeSet = view.state.changes(changes);
  if (next) {
    selection = EditorSelection.single(next.from, next.to).map(changeSet);
    effects.push(announceMatch(view, next));
    effects.push(state.facet(searchConfigFacet).scrollToMatch(selection.main, view));
  }
  view.dispatch({
    changes: changeSet,
    selection,
    effects,
    userEvent: "input.replace"
  });
  return true;
});
/**
Replace all instances of the search query with the given
replacement.
*/
const replaceAll = /*@__PURE__*/searchCommand((view, {
  query
}) => {
  if (view.state.readOnly) return false;
  let changes = [];
  for (let match of query.matchAll(view.state, 1e9)) {
    let {
      from,
      to,
      precise
    } = match;
    if (precise) changes.push({
      from,
      to,
      insert: query.getReplacement(match)
    });
  }
  if (!changes.length) return false;
  let announceText = view.state.phrase("replaced $ matches", changes.length) + ".";
  view.dispatch({
    changes,
    effects: EditorView.announce.of(announceText),
    userEvent: "input.replace.all"
  });
  return true;
});
function createSearchPanel(view) {
  return view.state.facet(searchConfigFacet).createPanel(view);
}
function defaultQuery(state, fallback) {
  var _a, _b, _c, _d, _e;
  let sel = state.selection.main;
  let selText = sel.empty || sel.to > sel.from + 100 ? "" : state.sliceDoc(sel.from, sel.to);
  if (fallback && !selText) return fallback;
  let config = state.facet(searchConfigFacet);
  return new SearchQuery({
    search: ((_a = fallback === null || fallback === void 0 ? void 0 : fallback.literal) !== null && _a !== void 0 ? _a : config.literal) ? selText : selText.replace(/\n/g, "\\n"),
    caseSensitive: (_b = fallback === null || fallback === void 0 ? void 0 : fallback.caseSensitive) !== null && _b !== void 0 ? _b : config.caseSensitive,
    literal: (_c = fallback === null || fallback === void 0 ? void 0 : fallback.literal) !== null && _c !== void 0 ? _c : config.literal,
    regexp: (_d = fallback === null || fallback === void 0 ? void 0 : fallback.regexp) !== null && _d !== void 0 ? _d : config.regexp,
    wholeWord: (_e = fallback === null || fallback === void 0 ? void 0 : fallback.wholeWord) !== null && _e !== void 0 ? _e : config.wholeWord
  });
}
function getSearchInput(view) {
  let panel = getPanel(view, createSearchPanel);
  return panel && panel.dom.querySelector("[main-field]");
}
function selectSearchInput(view) {
  let input = getSearchInput(view);
  if (input && input == view.root.activeElement) input.select();
}
/**
Make sure the search panel is open and focused.
*/
const openSearchPanel = view => {
  let state = view.state.field(searchState, false);
  if (state && state.panel) {
    let searchInput = getSearchInput(view);
    if (searchInput && searchInput != view.root.activeElement) {
      let query = defaultQuery(view.state, state.query.spec);
      if (query.valid) view.dispatch({
        effects: setSearchQuery.of(query)
      });
      searchInput.focus();
      searchInput.select();
    }
  } else {
    view.dispatch({
      effects: [togglePanel.of(true), state ? setSearchQuery.of(defaultQuery(view.state, state.query.spec)) : StateEffect.appendConfig.of(searchExtensions)]
    });
  }
  return true;
};
/**
Close the search panel.
*/
const closeSearchPanel = view => {
  let state = view.state.field(searchState, false);
  if (!state || !state.panel) return false;
  let panel = getPanel(view, createSearchPanel);
  if (panel && panel.dom.contains(view.root.activeElement)) view.focus();
  view.dispatch({
    effects: togglePanel.of(false)
  });
  return true;
};
/**
Default search-related key bindings.

 - Mod-f: [`openSearchPanel`](https://codemirror.net/6/docs/ref/#search.openSearchPanel)
 - F3, Mod-g: [`findNext`](https://codemirror.net/6/docs/ref/#search.findNext)
 - Shift-F3, Shift-Mod-g: [`findPrevious`](https://codemirror.net/6/docs/ref/#search.findPrevious)
 - Mod-Alt-g: [`gotoLine`](https://codemirror.net/6/docs/ref/#search.gotoLine)
 - Mod-d: [`selectNextOccurrence`](https://codemirror.net/6/docs/ref/#search.selectNextOccurrence)
*/
const searchKeymap = [{
  key: "Mod-f",
  run: openSearchPanel,
  scope: "editor search-panel"
}, {
  key: "F3",
  run: findNext,
  shift: findPrevious,
  scope: "editor search-panel",
  preventDefault: true
}, {
  key: "Mod-g",
  run: findNext,
  shift: findPrevious,
  scope: "editor search-panel",
  preventDefault: true
}, {
  key: "Escape",
  run: closeSearchPanel,
  scope: "editor search-panel"
}, {
  key: "Mod-Shift-l",
  run: selectSelectionMatches
}, {
  key: "Mod-Alt-g",
  run: gotoLine
}, {
  key: "Mod-d",
  run: selectNextOccurrence,
  preventDefault: true
}];
class SearchPanel {
  constructor(view) {
    this.view = view;
    let query = this.query = view.state.field(searchState).query.spec;
    this.commit = this.commit.bind(this);
    this.searchField = crelt("input", {
      value: query.search,
      placeholder: phrase(view, "Find"),
      "aria-label": phrase(view, "Find"),
      class: "cm-textfield",
      name: "search",
      form: "",
      "main-field": "true",
      onchange: this.commit,
      onkeyup: this.commit
    });
    this.replaceField = crelt("input", {
      value: query.replace,
      placeholder: phrase(view, "Replace"),
      "aria-label": phrase(view, "Replace"),
      class: "cm-textfield",
      name: "replace",
      form: "",
      onchange: this.commit,
      onkeyup: this.commit
    });
    this.caseField = crelt("input", {
      type: "checkbox",
      name: "case",
      form: "",
      checked: query.caseSensitive,
      onchange: this.commit
    });
    this.reField = crelt("input", {
      type: "checkbox",
      name: "re",
      form: "",
      checked: query.regexp,
      onchange: this.commit
    });
    this.wordField = crelt("input", {
      type: "checkbox",
      name: "word",
      form: "",
      checked: query.wholeWord,
      onchange: this.commit
    });
    function button(name, onclick, content) {
      return crelt("button", {
        class: "cm-button",
        name,
        onclick,
        type: "button"
      }, content);
    }
    this.dom = crelt("div", {
      onkeydown: e => this.keydown(e),
      class: "cm-search"
    }, [this.searchField, button("next", () => findNext(view), [phrase(view, "next")]), button("prev", () => findPrevious(view), [phrase(view, "previous")]), button("select", () => selectMatches(view), [phrase(view, "all")]), crelt("label", null, [this.caseField, phrase(view, "match case")]), crelt("label", null, [this.reField, phrase(view, "regexp")]), crelt("label", null, [this.wordField, phrase(view, "by word")]), ...(view.state.readOnly ? [] : [crelt("br"), this.replaceField, button("replace", () => replaceNext(view), [phrase(view, "replace")]), button("replaceAll", () => replaceAll(view), [phrase(view, "replace all")])]), crelt("button", {
      name: "close",
      onclick: () => closeSearchPanel(view),
      "aria-label": phrase(view, "close"),
      type: "button"
    }, ["×"])]);
  }
  commit() {
    let query = new SearchQuery({
      search: this.searchField.value,
      caseSensitive: this.caseField.checked,
      regexp: this.reField.checked,
      wholeWord: this.wordField.checked,
      replace: this.replaceField.value
    });
    if (!query.eq(this.query)) {
      this.query = query;
      this.view.dispatch({
        effects: setSearchQuery.of(query)
      });
    }
  }
  keydown(e) {
    if (runScopeHandlers(this.view, e, "search-panel")) {
      e.preventDefault();
    } else if (e.keyCode == 13 && e.target == this.searchField) {
      e.preventDefault();
      (e.shiftKey ? findPrevious : findNext)(this.view);
    } else if (e.keyCode == 13 && e.target == this.replaceField) {
      e.preventDefault();
      replaceNext(this.view);
    }
  }
  update(update) {
    for (let tr of update.transactions) for (let effect of tr.effects) {
      if (effect.is(setSearchQuery) && !effect.value.eq(this.query)) this.setQuery(effect.value);
    }
  }
  setQuery(query) {
    this.query = query;
    this.searchField.value = query.search;
    this.replaceField.value = query.replace;
    this.caseField.checked = query.caseSensitive;
    this.reField.checked = query.regexp;
    this.wordField.checked = query.wholeWord;
  }
  mount() {
    this.searchField.select();
  }
  get pos() {
    return 80;
  }
  get top() {
    return this.view.state.facet(searchConfigFacet).top;
  }
}
function phrase(view, phrase) {
  return view.state.phrase(phrase);
}
const AnnounceMargin = 30;
const Break = /[\s\.,:;?!]/;
function announceMatch(view, {
  from,
  to
}) {
  let line = view.state.doc.lineAt(from),
    lineEnd = view.state.doc.lineAt(to).to;
  let start = Math.max(line.from, from - AnnounceMargin),
    end = Math.min(lineEnd, to + AnnounceMargin);
  let text = view.state.sliceDoc(start, end);
  if (start != line.from) {
    for (let i = 0; i < AnnounceMargin; i++) if (!Break.test(text[i + 1]) && Break.test(text[i])) {
      text = text.slice(i);
      break;
    }
  }
  if (end != lineEnd) {
    for (let i = text.length - 1; i > text.length - AnnounceMargin; i--) if (!Break.test(text[i - 1]) && Break.test(text[i])) {
      text = text.slice(0, i);
      break;
    }
  }
  return EditorView.announce.of(`${view.state.phrase("current match")}. ${text} ${view.state.phrase("on line")} ${line.number}.`);
}
const baseTheme = /*@__PURE__*/EditorView.baseTheme({
  ".cm-panel.cm-search": {
    padding: "2px 6px 4px",
    position: "relative",
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "4px",
      backgroundColor: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    },
    "& input, & button, & label": {
      margin: ".2em .6em .2em 0"
    },
    "& input[type=checkbox]": {
      marginRight: ".2em"
    },
    "& label": {
      fontSize: "80%",
      whiteSpace: "pre"
    }
  },
  "&light .cm-searchMatch": {
    backgroundColor: "#ffff0054"
  },
  "&dark .cm-searchMatch": {
    backgroundColor: "#00ffff8a"
  },
  "&light .cm-searchMatch-selected": {
    backgroundColor: "#ff6a0054"
  },
  "&dark .cm-searchMatch-selected": {
    backgroundColor: "#ff00ff8a"
  }
});
const searchExtensions = [searchState, /*@__PURE__*/Prec.low(searchHighlighter), baseTheme];

// (The superfluous function calls around the list of extensions work
// around current limitations in tree-shaking software.)
/**
This is an extension value that just pulls together a number of
extensions that you might want in a basic editor. It is meant as a
convenient helper to quickly set up CodeMirror without installing
and importing a lot of separate packages.

Specifically, it includes...

 - [the default command bindings](https://codemirror.net/6/docs/ref/#commands.defaultKeymap)
 - [line numbers](https://codemirror.net/6/docs/ref/#view.lineNumbers)
 - [special character highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars)
 - [the undo history](https://codemirror.net/6/docs/ref/#commands.history)
 - [a fold gutter](https://codemirror.net/6/docs/ref/#language.foldGutter)
 - [custom selection drawing](https://codemirror.net/6/docs/ref/#view.drawSelection)
 - [drop cursor](https://codemirror.net/6/docs/ref/#view.dropCursor)
 - [multiple selections](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
 - [reindentation on input](https://codemirror.net/6/docs/ref/#language.indentOnInput)
 - [the default highlight style](https://codemirror.net/6/docs/ref/#language.defaultHighlightStyle) (as fallback)
 - [bracket matching](https://codemirror.net/6/docs/ref/#language.bracketMatching)
 - [bracket closing](https://codemirror.net/6/docs/ref/#autocomplete.closeBrackets)
 - [autocompletion](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion)
 - [rectangular selection](https://codemirror.net/6/docs/ref/#view.rectangularSelection) and [crosshair cursor](https://codemirror.net/6/docs/ref/#view.crosshairCursor)
 - [active line highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLine)
 - [active line gutter highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLineGutter)
 - [selection match highlighting](https://codemirror.net/6/docs/ref/#search.highlightSelectionMatches)
 - [search](https://codemirror.net/6/docs/ref/#search.searchKeymap)
 - [linting](https://codemirror.net/6/docs/ref/#lint.lintKeymap)

(You'll probably want to add some language package to your setup
too.)

This extension does not allow customization. The idea is that,
once you decide you want to configure your editor more precisely,
you take this package's source (which is just a bunch of imports
and an array literal), copy it into your own code, and adjust it
as desired.
*/
const basicSetup = /*@__PURE__*/(() => [lineNumbers(), highlightActiveLineGutter(), highlightSpecialChars(), history(), foldGutter(), drawSelection(), dropCursor(), EditorState.allowMultipleSelections.of(true), indentOnInput(), syntaxHighlighting(defaultHighlightStyle, {
  fallback: true
}), bracketMatching(), closeBrackets(), autocompletion(), rectangularSelection(), crosshairCursor(), highlightActiveLine(), highlightSelectionMatches(), keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...completionKeymap, ...lintKeymap])])();

/**
 * Builds and creates a codemirror instance for the given element
 *
 * @typedef {any} Extension
 *
 * @typedef {object} CodemirrorOptions
 * @property {HTMLElement} element
 * @property {string} text
 * @property {string} format
 * @property {Extension[]} [ extensions ]
 * @property {(text: string) => void} handleUpdate
 * @property {(format: string) => Promise<Extension>} getLang
 * @property {(format: string) => Promise<Extension>} getSupport
 *
 * @param {CodemirrorOptions} options
 */
async function buildCodemirror({
  element,
  text,
  format,
  extensions,
  handleUpdate,
  getLang,
  getSupport
}) {
  const languageConf = new Compartment();
  const supportConf = new Compartment();
  const tabSize = new Compartment();
  const updateListener = EditorView.updateListener.of(({
    state,
    docChanged
  }) => {
    if (docChanged) {
      handleUpdate(state.doc.toString());
    }
  });

  /**
   * @param {string} format
   */
  async function languageForFormat(format) {
    switch (format) {
      case 'glimdown':
      case 'gdm':
      case 'gmd':
        return getLang('gmd');
      case 'jsx':
      case 'jsx|react':
        return getLang('jsx|react');
      default:
        return getLang(format);
    }
  }

  /**
   * @param {string} format
   */
  async function supportForFormat(format) {
    const support = await getSupport(format);
    if (!support) {
      return [];
    }
    return Array.isArray(support) ? support : [support];
  }
  const [language, support] = await Promise.all([languageForFormat(format), supportForFormat(format)]);
  const editorExtensions = [
  // features
  basicSetup, foldByIndent(),
  // Language
  languageConf.of(language), supportConf.of(support), updateListener, EditorView.lineWrapping, keymap.of([indentWithTab, ...completionKeymap, ...markdownKeymap]),
  // TODO: lsp,

  ...(extensions ?? [])].filter(Boolean);
  const view = new EditorView({
    parent: element,
    state: EditorState.create({
      extensions: editorExtensions
    })
  });

  /**
   * Called from the host app to update the editor.
   *
   * @param {string} text
   * @param {string} format
   */
  const setText = async (text, format) => {
    const [language, support] = await Promise.all([languageForFormat(format), supportForFormat(format)]);
    console.debug(`Codemirror changing to ${format}: ${language ? 'ok' : 'not ok'}`);
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: text
      },
      effects: [languageConf.reconfigure(language), supportConf.reconfigure(support)]
    });
  };

  /**
   * Changes just the format of the editor.
   *
   * @param {string} format
   */
  const setFormat = async format => {
    const [language, support] = await Promise.all([languageForFormat(format), supportForFormat(format)]);
    console.debug(`Codemirror changing to ${format}: ${language ? 'ok' : 'not ok'}`);
    view.dispatch({
      effects: [languageConf.reconfigure(language), supportConf.reconfigure(support)]
    });
  };
  view.dispatch(view.state.changeByRange(range => ({
    changes: [{
      from: range.from,
      insert: text
    }],
    range: EditorSelection.range(range.from, range.to)
  })));
  view.dispatch({
    effects: [tabSize.reconfigure(EditorState.tabSize.of(2))
    // languageConf.reconfigure(languageForFormat(format)),
    ]
  });
  return {
    view,
    setText,
    setFormat
  };
}

export { buildCodemirror };
