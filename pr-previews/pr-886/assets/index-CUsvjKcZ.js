import { E as EditorSelection, Z as IndentContext, p as Direction, _ as getIndentation, $ as countColumn, a0 as indentString, i as Text, s as syntaxTree, a1 as matchBrackets, a2 as findClusterBreak, B as NodeProp, b as EditorView, e as StateField, T as Transaction, F as Facet, l as combineConfig, g as StateEffect, a3 as ChangeSet, a4 as ChangeDesc, A as Annotation, a5 as getIndentUnit, m as indentUnit, a6 as getPanel, a7 as activateHover, a8 as showPanel, D as Decoration, a9 as RangeSetBuilder, aa as crelt, ab as hoverTooltip, W as WidgetType } from './index-BZr71EI0.js';

/**
Comment or uncomment the current selection. Will use line comments
if available, otherwise falling back to block comments.
*/
const toggleComment = target => {
  let {
      state
    } = target,
    line = state.doc.lineAt(state.selection.main.from),
    config = getConfig(target.state, line.from);
  return config.line ? toggleLineComment(target) : config.block ? toggleBlockCommentByLine(target) : false;
};
function command(f, option) {
  return ({
    state,
    dispatch
  }) => {
    if (state.readOnly) return false;
    let tr = f(option, state);
    if (!tr) return false;
    dispatch(state.update(tr));
    return true;
  };
}
/**
Comment or uncomment the current selection using line comments.
The line comment syntax is taken from the
[`commentTokens`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt).
*/
const toggleLineComment = /*@__PURE__*/command(changeLineComment, 0 /* CommentOption.Toggle */);
/**
Comment or uncomment the current selection using block comments.
The block comment syntax is taken from the
[`commentTokens`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) [language
data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt).
*/
const toggleBlockComment = /*@__PURE__*/command(changeBlockComment, 0 /* CommentOption.Toggle */);
/**
Comment or uncomment the lines around the current selection using
block comments.
*/
const toggleBlockCommentByLine = /*@__PURE__*/command((o, s) => changeBlockComment(o, s, selectedLineRanges(s)), 0 /* CommentOption.Toggle */);
function getConfig(state, pos) {
  let data = state.languageDataAt("commentTokens", pos, 1);
  return data.length ? data[0] : {};
}
const SearchMargin = 50;
/**
Determines if the given range is block-commented in the given
state.
*/
function findBlockComment(state, {
  open,
  close
}, from, to) {
  let textBefore = state.sliceDoc(from - SearchMargin, from);
  let textAfter = state.sliceDoc(to, to + SearchMargin);
  let spaceBefore = /\s*$/.exec(textBefore)[0].length,
    spaceAfter = /^\s*/.exec(textAfter)[0].length;
  let beforeOff = textBefore.length - spaceBefore;
  if (textBefore.slice(beforeOff - open.length, beforeOff) == open && textAfter.slice(spaceAfter, spaceAfter + close.length) == close) {
    return {
      open: {
        pos: from - spaceBefore,
        margin: spaceBefore && 1
      },
      close: {
        pos: to + spaceAfter,
        margin: spaceAfter && 1
      }
    };
  }
  let startText, endText;
  if (to - from <= 2 * SearchMargin) {
    startText = endText = state.sliceDoc(from, to);
  } else {
    startText = state.sliceDoc(from, from + SearchMargin);
    endText = state.sliceDoc(to - SearchMargin, to);
  }
  let startSpace = /^\s*/.exec(startText)[0].length,
    endSpace = /\s*$/.exec(endText)[0].length;
  let endOff = endText.length - endSpace - close.length;
  if (startText.slice(startSpace, startSpace + open.length) == open && endText.slice(endOff, endOff + close.length) == close) {
    return {
      open: {
        pos: from + startSpace + open.length,
        margin: /\s/.test(startText.charAt(startSpace + open.length)) ? 1 : 0
      },
      close: {
        pos: to - endSpace - close.length,
        margin: /\s/.test(endText.charAt(endOff - 1)) ? 1 : 0
      }
    };
  }
  return null;
}
function selectedLineRanges(state) {
  let ranges = [];
  for (let r of state.selection.ranges) {
    let fromLine = state.doc.lineAt(r.from);
    let toLine = r.to <= fromLine.to ? fromLine : state.doc.lineAt(r.to);
    if (toLine.from > fromLine.from && toLine.from == r.to) toLine = r.to == fromLine.to + 1 ? fromLine : state.doc.lineAt(r.to - 1);
    let last = ranges.length - 1;
    if (last >= 0 && ranges[last].to > fromLine.from) ranges[last].to = toLine.to;else ranges.push({
      from: fromLine.from + /^\s*/.exec(fromLine.text)[0].length,
      to: toLine.to
    });
  }
  return ranges;
}
// Performs toggle, comment and uncomment of block comments in
// languages that support them.
function changeBlockComment(option, state, ranges = state.selection.ranges) {
  let tokens = ranges.map(r => getConfig(state, r.from).block);
  if (!tokens.every(c => c)) return null;
  let comments = ranges.map((r, i) => findBlockComment(state, tokens[i], r.from, r.to));
  if (option != 2 /* CommentOption.Uncomment */ && !comments.every(c => c)) {
    return {
      changes: state.changes(ranges.map((range, i) => {
        if (comments[i]) return [];
        return [{
          from: range.from,
          insert: tokens[i].open + " "
        }, {
          from: range.to,
          insert: " " + tokens[i].close
        }];
      }))
    };
  } else if (option != 1 /* CommentOption.Comment */ && comments.some(c => c)) {
    let changes = [];
    for (let i = 0, comment; i < comments.length; i++) if (comment = comments[i]) {
      let token = tokens[i],
        {
          open,
          close
        } = comment;
      changes.push({
        from: open.pos - token.open.length,
        to: open.pos + open.margin
      }, {
        from: close.pos - close.margin,
        to: close.pos + token.close.length
      });
    }
    return {
      changes
    };
  }
  return null;
}
// Performs toggle, comment and uncomment of line comments.
function changeLineComment(option, state, ranges = state.selection.ranges) {
  let lines = [];
  let prevLine = -1;
  ranges: for (let {
    from,
    to
  } of ranges) {
    let startI = lines.length,
      minIndent = 1e9,
      token;
    for (let pos = from; pos <= to;) {
      let line = state.doc.lineAt(pos);
      if (token == undefined) {
        token = getConfig(state, line.from).line;
        if (!token) continue ranges;
      }
      if (line.from > prevLine && (from == to || to > line.from)) {
        prevLine = line.from;
        let indent = /^\s*/.exec(line.text)[0].length;
        let empty = indent == line.length;
        let comment = line.text.slice(indent, indent + token.length) == token ? indent : -1;
        if (indent < line.text.length && indent < minIndent) minIndent = indent;
        lines.push({
          line,
          comment,
          token,
          indent,
          empty,
          single: false
        });
      }
      pos = line.to + 1;
    }
    if (minIndent < 1e9) for (let i = startI; i < lines.length; i++) if (lines[i].indent < lines[i].line.text.length) lines[i].indent = minIndent;
    if (lines.length == startI + 1) lines[startI].single = true;
  }
  if (option != 2 /* CommentOption.Uncomment */ && lines.some(l => l.comment < 0 && (!l.empty || l.single))) {
    let changes = [];
    for (let {
      line,
      token,
      indent,
      empty,
      single
    } of lines) if (single || !empty) changes.push({
      from: line.from + indent,
      insert: token + " "
    });
    let changeSet = state.changes(changes);
    return {
      changes: changeSet,
      selection: state.selection.map(changeSet, 1)
    };
  } else if (option != 1 /* CommentOption.Comment */ && lines.some(l => l.comment >= 0)) {
    let changes = [];
    for (let {
      line,
      comment,
      token
    } of lines) if (comment >= 0) {
      let from = line.from + comment,
        to = from + token.length;
      if (line.text[to - line.from] == " ") to++;
      changes.push({
        from,
        to
      });
    }
    return {
      changes
    };
  }
  return null;
}
const fromHistory = /*@__PURE__*/Annotation.define();
/**
Transaction annotation that will prevent that transaction from
being combined with other transactions in the undo history. Given
`"before"`, it'll prevent merging with previous transactions. With
`"after"`, subsequent transactions won't be combined with this
one. With `"full"`, the transaction is isolated on both sides.
*/
const isolateHistory = /*@__PURE__*/Annotation.define();
/**
This facet provides a way to register functions that, given a
transaction, provide a set of effects that the history should
store when inverting the transaction. This can be used to
integrate some kinds of effects in the history, so that they can
be undone (and redone again).
*/
const invertedEffects = /*@__PURE__*/Facet.define();
const historyConfig = /*@__PURE__*/Facet.define({
  combine(configs) {
    return combineConfig(configs, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (_t, isAdjacent) => isAdjacent
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (a, b) => (tr, adj) => a(tr, adj) || b(tr, adj)
    });
  }
});
const historyField_ = /*@__PURE__*/StateField.define({
  create() {
    return HistoryState.empty;
  },
  update(state, tr) {
    let config = tr.state.facet(historyConfig);
    let fromHist = tr.annotation(fromHistory);
    if (fromHist) {
      let item = HistEvent.fromTransaction(tr, fromHist.selection),
        from = fromHist.side;
      let other = from == 0 /* BranchName.Done */ ? state.undone : state.done;
      if (item) other = updateBranch(other, other.length, config.minDepth, item);else other = addSelection(other, tr.startState.selection);
      return new HistoryState(from == 0 /* BranchName.Done */ ? fromHist.rest : other, from == 0 /* BranchName.Done */ ? other : fromHist.rest);
    }
    let isolate = tr.annotation(isolateHistory);
    if (isolate == "full" || isolate == "before") state = state.isolate();
    if (tr.annotation(Transaction.addToHistory) === false) return !tr.changes.empty ? state.addMapping(tr.changes.desc) : state;
    let event = HistEvent.fromTransaction(tr);
    let time = tr.annotation(Transaction.time),
      userEvent = tr.annotation(Transaction.userEvent);
    if (event) state = state.addChanges(event, time, userEvent, config, tr);else if (tr.selection) state = state.addSelection(tr.startState.selection, time, userEvent, config.newGroupDelay);
    if (isolate == "full" || isolate == "after") state = state.isolate();
    return state;
  },
  toJSON(value) {
    return {
      done: value.done.map(e => e.toJSON()),
      undone: value.undone.map(e => e.toJSON())
    };
  },
  fromJSON(json) {
    return new HistoryState(json.done.map(HistEvent.fromJSON), json.undone.map(HistEvent.fromJSON));
  }
});
/**
Create a history extension with the given configuration.
*/
function history(config = {}) {
  return [historyField_, historyConfig.of(config), EditorView.domEventHandlers({
    beforeinput(e, view) {
      let command = e.inputType == "historyUndo" ? undo : e.inputType == "historyRedo" ? redo : null;
      if (!command) return false;
      e.preventDefault();
      return command(view);
    }
  })];
}
function cmd(side, selection) {
  return function ({
    state,
    dispatch
  }) {
    if (!selection && state.readOnly) return false;
    let historyState = state.field(historyField_, false);
    if (!historyState) return false;
    let tr = historyState.pop(side, state, selection);
    if (!tr) return false;
    dispatch(tr);
    return true;
  };
}
/**
Undo a single group of history events. Returns false if no group
was available.
*/
const undo = /*@__PURE__*/cmd(0 /* BranchName.Done */, false);
/**
Redo a group of history events. Returns false if no group was
available.
*/
const redo = /*@__PURE__*/cmd(1 /* BranchName.Undone */, false);
/**
Undo a change or selection change.
*/
const undoSelection = /*@__PURE__*/cmd(0 /* BranchName.Done */, true);
/**
Redo a change or selection change.
*/
const redoSelection = /*@__PURE__*/cmd(1 /* BranchName.Undone */, true);
// History events store groups of changes or effects that need to be
// undone/redone together.
class HistEvent {
  constructor(
  // The changes in this event. Normal events hold at least one
  // change or effect. But it may be necessary to store selection
  // events before the first change, in which case a special type of
  // instance is created which doesn't hold any changes, with
  // changes == startSelection == undefined
  changes,
  // The effects associated with this event
  effects,
  // Accumulated mapping (from addToHistory==false) that should be
  // applied to events below this one.
  mapped,
  // The selection before this event
  startSelection,
  // Stores selection changes after this event, to be used for
  // selection undo/redo.
  selectionsAfter) {
    this.changes = changes;
    this.effects = effects;
    this.mapped = mapped;
    this.startSelection = startSelection;
    this.selectionsAfter = selectionsAfter;
  }
  setSelAfter(after) {
    return new HistEvent(this.changes, this.effects, this.mapped, this.startSelection, after);
  }
  toJSON() {
    var _a, _b, _c;
    return {
      changes: (_a = this.changes) === null || _a === void 0 ? void 0 : _a.toJSON(),
      mapped: (_b = this.mapped) === null || _b === void 0 ? void 0 : _b.toJSON(),
      startSelection: (_c = this.startSelection) === null || _c === void 0 ? void 0 : _c.toJSON(),
      selectionsAfter: this.selectionsAfter.map(s => s.toJSON())
    };
  }
  static fromJSON(json) {
    return new HistEvent(json.changes && ChangeSet.fromJSON(json.changes), [], json.mapped && ChangeDesc.fromJSON(json.mapped), json.startSelection && EditorSelection.fromJSON(json.startSelection), json.selectionsAfter.map(EditorSelection.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(tr, selection) {
    let effects = none;
    for (let invert of tr.startState.facet(invertedEffects)) {
      let result = invert(tr);
      if (result.length) effects = effects.concat(result);
    }
    if (!effects.length && tr.changes.empty) return null;
    return new HistEvent(tr.changes.invert(tr.startState.doc), effects, undefined, selection || tr.startState.selection, none);
  }
  static selection(selections) {
    return new HistEvent(undefined, none, undefined, undefined, selections);
  }
}
function updateBranch(branch, to, maxLen, newEvent) {
  let start = to + 1 > maxLen + 20 ? to - maxLen - 1 : 0;
  let newBranch = branch.slice(start, to);
  newBranch.push(newEvent);
  return newBranch;
}
function isAdjacent(a, b) {
  let ranges = [],
    isAdjacent = false;
  a.iterChangedRanges((f, t) => ranges.push(f, t));
  b.iterChangedRanges((_f, _t, f, t) => {
    for (let i = 0; i < ranges.length;) {
      let from = ranges[i++],
        to = ranges[i++];
      if (t >= from && f <= to) isAdjacent = true;
    }
  });
  return isAdjacent;
}
function eqSelectionShape(a, b) {
  return a.ranges.length == b.ranges.length && a.ranges.filter((r, i) => r.empty != b.ranges[i].empty).length === 0;
}
function conc(a, b) {
  return !a.length ? b : !b.length ? a : a.concat(b);
}
const none = [];
const MaxSelectionsPerEvent = 200;
function addSelection(branch, selection) {
  if (!branch.length) {
    return [HistEvent.selection([selection])];
  } else {
    let lastEvent = branch[branch.length - 1];
    let sels = lastEvent.selectionsAfter.slice(Math.max(0, lastEvent.selectionsAfter.length - MaxSelectionsPerEvent));
    if (sels.length && sels[sels.length - 1].eq(selection)) return branch;
    sels.push(selection);
    return updateBranch(branch, branch.length - 1, 1e9, lastEvent.setSelAfter(sels));
  }
}
// Assumes the top item has one or more selectionAfter values
function popSelection(branch) {
  let last = branch[branch.length - 1];
  let newBranch = branch.slice();
  newBranch[branch.length - 1] = last.setSelAfter(last.selectionsAfter.slice(0, last.selectionsAfter.length - 1));
  return newBranch;
}
// Add a mapping to the top event in the given branch. If this maps
// away all the changes and effects in that item, drop it and
// propagate the mapping to the next item.
function addMappingToBranch(branch, mapping) {
  if (!branch.length) return branch;
  let length = branch.length,
    selections = none;
  while (length) {
    let event = mapEvent(branch[length - 1], mapping, selections);
    if (event.changes && !event.changes.empty || event.effects.length) {
      // Event survived mapping
      let result = branch.slice(0, length);
      result[length - 1] = event;
      return result;
    } else {
      // Drop this event, since there's no changes or effects left
      mapping = event.mapped;
      length--;
      selections = event.selectionsAfter;
    }
  }
  return selections.length ? [HistEvent.selection(selections)] : none;
}
function mapEvent(event, mapping, extraSelections) {
  let selections = conc(event.selectionsAfter.length ? event.selectionsAfter.map(s => s.map(mapping)) : none, extraSelections);
  // Change-less events don't store mappings (they are always the last event in a branch)
  if (!event.changes) return HistEvent.selection(selections);
  let mappedChanges = event.changes.map(mapping),
    before = mapping.mapDesc(event.changes, true);
  let fullMapping = event.mapped ? event.mapped.composeDesc(before) : before;
  return new HistEvent(mappedChanges, StateEffect.mapEffects(event.effects, mapping), fullMapping, event.startSelection.map(before), selections);
}
const joinableUserEvent = /^(input\.type|delete)($|\.)/;
class HistoryState {
  constructor(done, undone, prevTime = 0, prevUserEvent = undefined) {
    this.done = done;
    this.undone = undone;
    this.prevTime = prevTime;
    this.prevUserEvent = prevUserEvent;
  }
  isolate() {
    return this.prevTime ? new HistoryState(this.done, this.undone) : this;
  }
  addChanges(event, time, userEvent, config, tr) {
    let done = this.done,
      lastEvent = done[done.length - 1];
    if (lastEvent && lastEvent.changes && !lastEvent.changes.empty && event.changes && (!userEvent || joinableUserEvent.test(userEvent)) && (!lastEvent.selectionsAfter.length && time - this.prevTime < config.newGroupDelay && config.joinToEvent(tr, isAdjacent(lastEvent.changes, event.changes)) ||
    // For compose (but not compose.start) events, always join with previous event
    userEvent == "input.type.compose")) {
      done = updateBranch(done, done.length - 1, config.minDepth, new HistEvent(event.changes.compose(lastEvent.changes), conc(StateEffect.mapEffects(event.effects, lastEvent.changes), lastEvent.effects), lastEvent.mapped, lastEvent.startSelection, none));
    } else {
      done = updateBranch(done, done.length, config.minDepth, event);
    }
    return new HistoryState(done, none, time, userEvent);
  }
  addSelection(selection, time, userEvent, newGroupDelay) {
    let last = this.done.length ? this.done[this.done.length - 1].selectionsAfter : none;
    if (last.length > 0 && time - this.prevTime < newGroupDelay && userEvent == this.prevUserEvent && userEvent && /^select($|\.)/.test(userEvent) && eqSelectionShape(last[last.length - 1], selection)) return this;
    return new HistoryState(addSelection(this.done, selection), this.undone, time, userEvent);
  }
  addMapping(mapping) {
    return new HistoryState(addMappingToBranch(this.done, mapping), addMappingToBranch(this.undone, mapping), this.prevTime, this.prevUserEvent);
  }
  pop(side, state, onlySelection) {
    let branch = side == 0 /* BranchName.Done */ ? this.done : this.undone;
    if (branch.length == 0) return null;
    let event = branch[branch.length - 1],
      selection = event.selectionsAfter[0] || (event.startSelection ? event.startSelection.map(event.changes.invertedDesc, 1) : state.selection);
    if (onlySelection && event.selectionsAfter.length) {
      return state.update({
        selection: event.selectionsAfter[event.selectionsAfter.length - 1],
        annotations: fromHistory.of({
          side,
          rest: popSelection(branch),
          selection
        }),
        userEvent: side == 0 /* BranchName.Done */ ? "select.undo" : "select.redo",
        scrollIntoView: true
      });
    } else if (!event.changes) {
      return null;
    } else {
      let rest = branch.length == 1 ? none : branch.slice(0, branch.length - 1);
      if (event.mapped) rest = addMappingToBranch(rest, event.mapped);
      return state.update({
        changes: event.changes,
        selection: event.startSelection,
        effects: event.effects,
        annotations: fromHistory.of({
          side,
          rest,
          selection
        }),
        filter: false,
        userEvent: side == 0 /* BranchName.Done */ ? "undo" : "redo",
        scrollIntoView: true
      });
    }
  }
}
HistoryState.empty = /*@__PURE__*/new HistoryState(none, none);
/**
Default key bindings for the undo history.

- Mod-z: [`undo`](https://codemirror.net/6/docs/ref/#commands.undo).
- Mod-y (Mod-Shift-z on macOS) + Ctrl-Shift-z on Linux: [`redo`](https://codemirror.net/6/docs/ref/#commands.redo).
- Mod-u: [`undoSelection`](https://codemirror.net/6/docs/ref/#commands.undoSelection).
- Alt-u (Mod-Shift-u on macOS): [`redoSelection`](https://codemirror.net/6/docs/ref/#commands.redoSelection).
*/
const historyKeymap = [{
  key: "Mod-z",
  run: undo,
  preventDefault: true
}, {
  key: "Mod-y",
  mac: "Mod-Shift-z",
  run: redo,
  preventDefault: true
}, {
  linux: "Ctrl-Shift-z",
  run: redo,
  preventDefault: true
}, {
  key: "Mod-u",
  run: undoSelection,
  preventDefault: true
}, {
  key: "Alt-u",
  mac: "Mod-Shift-u",
  run: redoSelection,
  preventDefault: true
}];
function updateSel(sel, by) {
  return EditorSelection.create(sel.ranges.map(by), sel.mainIndex);
}
function setSel(state, selection) {
  return state.update({
    selection,
    scrollIntoView: true,
    userEvent: "select"
  });
}
function moveSel({
  state,
  dispatch
}, how) {
  let selection = updateSel(state.selection, how);
  if (selection.eq(state.selection, true)) return false;
  dispatch(setSel(state, selection));
  return true;
}
function rangeEnd(range, forward) {
  return EditorSelection.cursor(forward ? range.to : range.from);
}
function cursorByChar(view, forward) {
  return moveSel(view, range => range.empty ? view.moveByChar(range, forward) : rangeEnd(range, forward));
}
function ltrAtCursor(view) {
  return view.textDirectionAt(view.state.selection.main.head) == Direction.LTR;
}
/**
Move the selection one character to the left (which is backward in
left-to-right text, forward in right-to-left text).
*/
const cursorCharLeft = view => cursorByChar(view, !ltrAtCursor(view));
/**
Move the selection one character to the right.
*/
const cursorCharRight = view => cursorByChar(view, ltrAtCursor(view));
function cursorByGroup(view, forward) {
  return moveSel(view, range => range.empty ? view.moveByGroup(range, forward) : rangeEnd(range, forward));
}
/**
Move the selection to the left across one group of word or
non-word (but also non-space) characters.
*/
const cursorGroupLeft = view => cursorByGroup(view, !ltrAtCursor(view));
/**
Move the selection one group to the right.
*/
const cursorGroupRight = view => cursorByGroup(view, ltrAtCursor(view));
function interestingNode(state, node, bracketProp) {
  if (node.type.prop(bracketProp)) return true;
  let len = node.to - node.from;
  return len && (len > 2 || /[^\s,.;:]/.test(state.sliceDoc(node.from, node.to))) || node.firstChild;
}
function moveBySyntax(state, start, forward) {
  let pos = syntaxTree(state).resolveInner(start.head);
  let bracketProp = forward ? NodeProp.closedBy : NodeProp.openedBy;
  // Scan forward through child nodes to see if there's an interesting
  // node ahead.
  for (let at = start.head;;) {
    let next = forward ? pos.childAfter(at) : pos.childBefore(at);
    if (!next) break;
    if (interestingNode(state, next, bracketProp)) pos = next;else at = forward ? next.to : next.from;
  }
  let bracket = pos.type.prop(bracketProp),
    match,
    newPos;
  if (bracket && (match = forward ? matchBrackets(state, pos.from, 1) : matchBrackets(state, pos.to, -1)) && match.matched) newPos = forward ? match.end.to : match.end.from;else newPos = forward ? pos.to : pos.from;
  return EditorSelection.cursor(newPos, forward ? -1 : 1);
}
/**
Move the cursor over the next syntactic element to the left.
*/
const cursorSyntaxLeft = view => moveSel(view, range => moveBySyntax(view.state, range, !ltrAtCursor(view)));
/**
Move the cursor over the next syntactic element to the right.
*/
const cursorSyntaxRight = view => moveSel(view, range => moveBySyntax(view.state, range, ltrAtCursor(view)));
function cursorByLine(view, forward) {
  return moveSel(view, range => {
    if (!range.empty) return rangeEnd(range, forward);
    let moved = view.moveVertically(range, forward);
    return moved.head != range.head ? moved : view.moveToLineBoundary(range, forward);
  });
}
/**
Move the selection one line up.
*/
const cursorLineUp = view => cursorByLine(view, false);
/**
Move the selection one line down.
*/
const cursorLineDown = view => cursorByLine(view, true);
function pageInfo(view) {
  let selfScroll = view.scrollDOM.clientHeight < view.scrollDOM.scrollHeight - 2;
  let marginTop = 0,
    marginBottom = 0,
    height;
  if (selfScroll) {
    for (let source of view.state.facet(EditorView.scrollMargins)) {
      let margins = source(view);
      if (margins === null || margins === void 0 ? void 0 : margins.top) marginTop = Math.max(margins === null || margins === void 0 ? void 0 : margins.top, marginTop);
      if (margins === null || margins === void 0 ? void 0 : margins.bottom) marginBottom = Math.max(margins === null || margins === void 0 ? void 0 : margins.bottom, marginBottom);
    }
    height = view.scrollDOM.clientHeight - marginTop - marginBottom;
  } else {
    height = (view.dom.ownerDocument.defaultView || window).innerHeight;
  }
  return {
    marginTop,
    marginBottom,
    selfScroll,
    height: Math.max(view.defaultLineHeight, height - 5)
  };
}
function cursorByPage(view, forward) {
  let page = pageInfo(view);
  let {
      state
    } = view,
    selection = updateSel(state.selection, range => {
      return range.empty ? view.moveVertically(range, forward, page.height) : rangeEnd(range, forward);
    });
  if (selection.eq(state.selection)) return false;
  let effect;
  if (page.selfScroll) {
    let startPos = view.coordsAtPos(state.selection.main.head);
    let scrollRect = view.scrollDOM.getBoundingClientRect();
    let scrollTop = scrollRect.top + page.marginTop,
      scrollBottom = scrollRect.bottom - page.marginBottom;
    if (startPos && startPos.top > scrollTop && startPos.bottom < scrollBottom) effect = EditorView.scrollIntoView(selection.main.head, {
      y: "start",
      yMargin: startPos.top - scrollTop
    });
  }
  view.dispatch(setSel(state, selection), {
    effects: effect
  });
  return true;
}
/**
Move the selection one page up.
*/
const cursorPageUp = view => cursorByPage(view, false);
/**
Move the selection one page down.
*/
const cursorPageDown = view => cursorByPage(view, true);
function moveByLineBoundary(view, start, forward) {
  let line = view.lineBlockAt(start.head),
    moved = view.moveToLineBoundary(start, forward);
  if (moved.head == start.head && moved.head != (forward ? line.to : line.from)) moved = view.moveToLineBoundary(start, forward, false);
  if (!forward && moved.head == line.from && line.length) {
    let space = /^\s*/.exec(view.state.sliceDoc(line.from, Math.min(line.from + 100, line.to)))[0].length;
    if (space && start.head != line.from + space) moved = EditorSelection.cursor(line.from + space);
  }
  return moved;
}
/**
Move the selection to the next line wrap point, or to the end of
the line if there isn't one left on this line.
*/
const cursorLineBoundaryForward = view => moveSel(view, range => moveByLineBoundary(view, range, true));
/**
Move the selection to previous line wrap point, or failing that to
the start of the line. If the line is indented, and the cursor
isn't already at the end of the indentation, this will move to the
end of the indentation instead of the start of the line.
*/
const cursorLineBoundaryBackward = view => moveSel(view, range => moveByLineBoundary(view, range, false));
/**
Move the selection one line wrap point to the left.
*/
const cursorLineBoundaryLeft = view => moveSel(view, range => moveByLineBoundary(view, range, !ltrAtCursor(view)));
/**
Move the selection one line wrap point to the right.
*/
const cursorLineBoundaryRight = view => moveSel(view, range => moveByLineBoundary(view, range, ltrAtCursor(view)));
/**
Move the selection to the start of the line.
*/
const cursorLineStart = view => moveSel(view, range => EditorSelection.cursor(view.lineBlockAt(range.head).from, 1));
/**
Move the selection to the end of the line.
*/
const cursorLineEnd = view => moveSel(view, range => EditorSelection.cursor(view.lineBlockAt(range.head).to, -1));
function toMatchingBracket(state, dispatch, extend) {
  let found = false,
    selection = updateSel(state.selection, range => {
      let matching = matchBrackets(state, range.head, -1) || matchBrackets(state, range.head, 1) || range.head > 0 && matchBrackets(state, range.head - 1, 1) || range.head < state.doc.length && matchBrackets(state, range.head + 1, -1);
      if (!matching || !matching.end) return range;
      found = true;
      let head = matching.start.from == range.head ? matching.end.to : matching.end.from;
      return EditorSelection.cursor(head);
    });
  if (!found) return false;
  dispatch(setSel(state, selection));
  return true;
}
/**
Move the selection to the bracket matching the one it is currently
on, if any.
*/
const cursorMatchingBracket = ({
  state,
  dispatch
}) => toMatchingBracket(state, dispatch);
function extendSel(target, forward, how) {
  let selection = updateSel(target.state.selection, range => {
    if (range.undirectional && range.head >= range.anchor != forward) range = EditorSelection.range(range.head, range.anchor);
    let head = how(range);
    return EditorSelection.range(range.anchor, head.head, head.goalColumn, head.bidiLevel || undefined, head.assoc);
  });
  if (selection.eq(target.state.selection)) return false;
  target.dispatch(setSel(target.state, selection));
  return true;
}
function selectByChar(view, forward) {
  return extendSel(view, forward, range => view.moveByChar(range, forward));
}
/**
Move the selection head one character to the left, while leaving
the anchor in place.
*/
const selectCharLeft = view => selectByChar(view, !ltrAtCursor(view));
/**
Move the selection head one character to the right.
*/
const selectCharRight = view => selectByChar(view, ltrAtCursor(view));
function selectByGroup(view, forward) {
  return extendSel(view, forward, range => view.moveByGroup(range, forward));
}
/**
Move the selection head one [group](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) to
the left.
*/
const selectGroupLeft = view => selectByGroup(view, !ltrAtCursor(view));
/**
Move the selection head one group to the right.
*/
const selectGroupRight = view => selectByGroup(view, ltrAtCursor(view));
/**
Move the selection head over the next syntactic element to the left.
*/
const selectSyntaxLeft = view => {
  let forward = !ltrAtCursor(view);
  return extendSel(view, forward, range => moveBySyntax(view.state, range, forward));
};
/**
Move the selection head over the next syntactic element to the right.
*/
const selectSyntaxRight = view => {
  let forward = ltrAtCursor(view);
  return extendSel(view, forward, range => moveBySyntax(view.state, range, forward));
};
function selectByLine(view, forward) {
  return extendSel(view, forward, range => view.moveVertically(range, forward));
}
/**
Move the selection head one line up.
*/
const selectLineUp = view => selectByLine(view, false);
/**
Move the selection head one line down.
*/
const selectLineDown = view => selectByLine(view, true);
function selectByPage(view, forward) {
  return extendSel(view, forward, range => view.moveVertically(range, forward, pageInfo(view).height));
}
/**
Move the selection head one page up.
*/
const selectPageUp = view => selectByPage(view, false);
/**
Move the selection head one page down.
*/
const selectPageDown = view => selectByPage(view, true);
/**
Move the selection head to the next line boundary.
*/
const selectLineBoundaryForward = view => extendSel(view, true, range => moveByLineBoundary(view, range, true));
/**
Move the selection head to the previous line boundary.
*/
const selectLineBoundaryBackward = view => extendSel(view, false, range => moveByLineBoundary(view, range, false));
/**
Move the selection head one line boundary to the left.
*/
const selectLineBoundaryLeft = view => {
  let forward = !ltrAtCursor(view);
  return extendSel(view, forward, range => moveByLineBoundary(view, range, forward));
};
/**
Move the selection head one line boundary to the right.
*/
const selectLineBoundaryRight = view => {
  let forward = ltrAtCursor(view);
  return extendSel(view, forward, range => moveByLineBoundary(view, range, forward));
};
/**
Move the selection head to the start of the line.
*/
const selectLineStart = view => extendSel(view, false, range => EditorSelection.cursor(view.lineBlockAt(range.head).from));
/**
Move the selection head to the end of the line.
*/
const selectLineEnd = view => extendSel(view, true, range => EditorSelection.cursor(view.lineBlockAt(range.head).to));
/**
Move the selection to the start of the document.
*/
const cursorDocStart = ({
  state,
  dispatch
}) => {
  dispatch(setSel(state, {
    anchor: 0
  }));
  return true;
};
/**
Move the selection to the end of the document.
*/
const cursorDocEnd = ({
  state,
  dispatch
}) => {
  dispatch(setSel(state, {
    anchor: state.doc.length
  }));
  return true;
};
/**
Move the selection head to the start of the document.
*/
const selectDocStart = ({
  state,
  dispatch
}) => {
  dispatch(setSel(state, {
    anchor: state.selection.main.anchor,
    head: 0
  }));
  return true;
};
/**
Move the selection head to the end of the document.
*/
const selectDocEnd = ({
  state,
  dispatch
}) => {
  dispatch(setSel(state, {
    anchor: state.selection.main.anchor,
    head: state.doc.length
  }));
  return true;
};
/**
Select the entire document.
*/
const selectAll = ({
  state,
  dispatch
}) => {
  dispatch(state.update({
    selection: {
      anchor: 0,
      head: state.doc.length
    },
    userEvent: "select"
  }));
  return true;
};
/**
Expand the selection to cover entire lines.
*/
const selectLine = ({
  state,
  dispatch
}) => {
  let ranges = selectedLineBlocks(state).map(({
    from,
    to
  }) => EditorSelection.undirectionalRange(from, Math.min(to + 1, state.doc.length)));
  dispatch(state.update({
    selection: EditorSelection.create(ranges),
    userEvent: "select"
  }));
  return true;
};
/**
Select the next syntactic construct that is larger than the
selection. Note that this will only work insofar as the language
[provider](https://codemirror.net/6/docs/ref/#language.language) you use builds up a full
syntax tree.
*/
const selectParentSyntax = ({
  state,
  dispatch
}) => {
  let selection = updateSel(state.selection, range => {
    let tree = syntaxTree(state),
      stack = tree.resolveStack(range.from, 1);
    if (range.empty) {
      let stackBefore = tree.resolveStack(range.from, -1);
      if (stackBefore.node.from >= stack.node.from && stackBefore.node.to <= stack.node.to) stack = stackBefore;
    }
    for (let cur = stack; cur; cur = cur.next) {
      let {
        node
      } = cur;
      if ((node.from < range.from && node.to >= range.to || node.to > range.to && node.from <= range.from) && cur.next) return EditorSelection.undirectionalRange(node.from, node.to);
    }
    return range;
  });
  if (selection.eq(state.selection)) return false;
  dispatch(setSel(state, selection));
  return true;
};
function addCursorVertically(view, forward) {
  let {
      state
    } = view,
    sel = state.selection,
    ranges = state.selection.ranges.slice();
  for (let range of state.selection.ranges) {
    let line = state.doc.lineAt(range.head);
    if (forward ? line.to < view.state.doc.length : line.from > 0) for (let cur = range;;) {
      let next = view.moveVertically(cur, forward);
      if (next.head < line.from || next.head > line.to) {
        if (!ranges.some(r => r.head == next.head)) ranges.push(next);
        break;
      } else if (next.head == cur.head) {
        break;
      } else {
        cur = next;
      }
    }
  }
  if (ranges.length == sel.ranges.length) return false;
  view.dispatch(setSel(state, EditorSelection.create(ranges, ranges.length - 1)));
  return true;
}
/**
Expand the selection by adding a cursor above the heads of
currently selected ranges.
*/
const addCursorAbove = view => addCursorVertically(view, false);
/**
Expand the selection by adding a cursor below the heads of
currently selected ranges.
*/
const addCursorBelow = view => addCursorVertically(view, true);
/**
Simplify the current selection. When multiple ranges are selected,
reduce it to its main range. Otherwise, if the selection is
non-empty, convert it to a cursor selection.
*/
const simplifySelection = ({
  state,
  dispatch
}) => {
  let cur = state.selection,
    selection = null;
  if (cur.ranges.length > 1) selection = EditorSelection.create([cur.main]);else if (!cur.main.empty) selection = EditorSelection.create([EditorSelection.cursor(cur.main.head)]);
  if (!selection) return false;
  dispatch(setSel(state, selection));
  return true;
};
function deleteBy(target, by) {
  if (target.state.readOnly) return false;
  let event = "delete.selection",
    {
      state
    } = target;
  let changes = state.changeByRange(range => {
    let {
      from,
      to
    } = range;
    if (from == to) {
      let towards = by(range);
      if (towards < from) {
        event = "delete.backward";
        towards = skipAtomic(target, towards, false);
      } else if (towards > from) {
        event = "delete.forward";
        towards = skipAtomic(target, towards, true);
      }
      from = Math.min(from, towards);
      to = Math.max(to, towards);
    } else {
      from = skipAtomic(target, from, false);
      to = skipAtomic(target, to, true);
    }
    return from == to ? {
      range
    } : {
      changes: {
        from,
        to
      },
      range: EditorSelection.cursor(from, from < range.head ? -1 : 1)
    };
  });
  if (changes.changes.empty) return false;
  target.dispatch(state.update(changes, {
    scrollIntoView: true,
    userEvent: event,
    effects: event == "delete.selection" ? EditorView.announce.of(state.phrase("Selection deleted")) : undefined
  }));
  return true;
}
function skipAtomic(target, pos, forward) {
  if (target instanceof EditorView) for (let ranges of target.state.facet(EditorView.atomicRanges).map(f => f(target))) ranges.between(pos, pos, (from, to) => {
    if (from < pos && to > pos) pos = forward ? to : from;
  });
  return pos;
}
const deleteByChar = (target, forward, byIndentUnit) => deleteBy(target, range => {
  let pos = range.from,
    {
      state
    } = target,
    line = state.doc.lineAt(pos),
    before,
    targetPos;
  if (byIndentUnit && !forward && pos > line.from && pos < line.from + 200 && !/[^ \t]/.test(before = line.text.slice(0, pos - line.from))) {
    if (before[before.length - 1] == "\t") return pos - 1;
    let col = countColumn(before, state.tabSize),
      drop = col % getIndentUnit(state) || getIndentUnit(state);
    for (let i = 0; i < drop && before[before.length - 1 - i] == " "; i++) pos--;
    targetPos = pos;
  } else {
    targetPos = findClusterBreak(line.text, pos - line.from, forward, forward) + line.from;
    if (targetPos == pos && line.number != (forward ? state.doc.lines : 1)) targetPos += forward ? 1 : -1;else if (!forward && /[\ufe00-\ufe0f]/.test(line.text.slice(targetPos - line.from, pos - line.from))) targetPos = findClusterBreak(line.text, targetPos - line.from, false, false) + line.from;
  }
  return targetPos;
});
/**
Delete the selection, or, for cursor selections, the character or
indentation unit before the cursor.
*/
const deleteCharBackward = view => deleteByChar(view, false, true);
/**
Delete the selection or the character after the cursor.
*/
const deleteCharForward = view => deleteByChar(view, true, false);
const deleteByGroup = (target, forward) => deleteBy(target, range => {
  let pos = range.head,
    {
      state
    } = target,
    line = state.doc.lineAt(pos);
  let categorize = state.charCategorizer(pos);
  for (let cat = null;;) {
    if (pos == (forward ? line.to : line.from)) {
      if (pos == range.head && line.number != (forward ? state.doc.lines : 1)) pos += forward ? 1 : -1;
      break;
    }
    let next = findClusterBreak(line.text, pos - line.from, forward) + line.from;
    let nextChar = line.text.slice(Math.min(pos, next) - line.from, Math.max(pos, next) - line.from);
    let nextCat = categorize(nextChar);
    if (cat != null && nextCat != cat) break;
    if (nextChar != " " || pos != range.head) cat = nextCat;
    pos = next;
  }
  return pos;
});
/**
Delete the selection or backward until the end of the next
[group](https://codemirror.net/6/docs/ref/#view.EditorView.moveByGroup), only skipping groups of
whitespace when they consist of a single space.
*/
const deleteGroupBackward = target => deleteByGroup(target, false);
/**
Delete the selection or forward until the end of the next group.
*/
const deleteGroupForward = target => deleteByGroup(target, true);
/**
Delete the selection, or, if it is a cursor selection, delete to
the end of the line. If the cursor is directly at the end of the
line, delete the line break after it.
*/
const deleteToLineEnd = view => deleteBy(view, range => {
  let lineEnd = view.lineBlockAt(range.head).to;
  return range.head < lineEnd ? lineEnd : Math.min(view.state.doc.length, range.head + 1);
});
/**
Delete the selection, or, if it is a cursor selection, delete to
the start of the line or the next line wrap before the cursor.
*/
const deleteLineBoundaryBackward = view => deleteBy(view, range => {
  let lineStart = view.moveToLineBoundary(range, false).head;
  return range.head > lineStart ? lineStart : Math.max(0, range.head - 1);
});
/**
Delete the selection, or, if it is a cursor selection, delete to
the end of the line or the next line wrap after the cursor.
*/
const deleteLineBoundaryForward = view => deleteBy(view, range => {
  let lineStart = view.moveToLineBoundary(range, true).head;
  return range.head < lineStart ? lineStart : Math.min(view.state.doc.length, range.head + 1);
});
/**
Replace each selection range with a line break, leaving the cursor
on the line before the break.
*/
const splitLine = ({
  state,
  dispatch
}) => {
  if (state.readOnly) return false;
  let changes = state.changeByRange(range => {
    return {
      changes: {
        from: range.from,
        to: range.to,
        insert: Text.of(["", ""])
      },
      range: EditorSelection.cursor(range.from)
    };
  });
  dispatch(state.update(changes, {
    scrollIntoView: true,
    userEvent: "input"
  }));
  return true;
};
/**
Flip the characters before and after the cursor(s).
*/
const transposeChars = ({
  state,
  dispatch
}) => {
  if (state.readOnly) return false;
  let changes = state.changeByRange(range => {
    if (!range.empty || range.from == 0 || range.from == state.doc.length) return {
      range
    };
    let pos = range.from,
      line = state.doc.lineAt(pos);
    let from = pos == line.from ? pos - 1 : findClusterBreak(line.text, pos - line.from, false) + line.from;
    let to = pos == line.to ? pos + 1 : findClusterBreak(line.text, pos - line.from, true) + line.from;
    return {
      changes: {
        from,
        to,
        insert: state.doc.slice(pos, to).append(state.doc.slice(from, pos))
      },
      range: EditorSelection.cursor(to)
    };
  });
  if (changes.changes.empty) return false;
  dispatch(state.update(changes, {
    scrollIntoView: true,
    userEvent: "move.character"
  }));
  return true;
};
function selectedLineBlocks(state) {
  let blocks = [],
    upto = -1;
  for (let range of state.selection.ranges) {
    let startLine = state.doc.lineAt(range.from),
      endLine = state.doc.lineAt(range.to);
    if (!range.empty && range.to == endLine.from) endLine = state.doc.lineAt(range.to - 1);
    if (upto >= startLine.number) {
      let prev = blocks[blocks.length - 1];
      prev.to = endLine.to;
      prev.ranges.push(range);
    } else {
      blocks.push({
        from: startLine.from,
        to: endLine.to,
        ranges: [range]
      });
    }
    upto = endLine.number + 1;
  }
  return blocks;
}
function moveLine(state, dispatch, forward) {
  if (state.readOnly) return false;
  let changes = [],
    ranges = [];
  for (let block of selectedLineBlocks(state)) {
    if (forward ? block.to == state.doc.length : block.from == 0) continue;
    let nextLine = state.doc.lineAt(forward ? block.to + 1 : block.from - 1);
    let size = nextLine.length + 1;
    if (forward) {
      changes.push({
        from: block.to,
        to: nextLine.to
      }, {
        from: block.from,
        insert: nextLine.text + state.lineBreak
      });
      for (let r of block.ranges) ranges.push(EditorSelection.range(Math.min(state.doc.length, r.anchor + size), Math.min(state.doc.length, r.head + size)));
    } else {
      changes.push({
        from: nextLine.from,
        to: block.from
      }, {
        from: block.to,
        insert: state.lineBreak + nextLine.text
      });
      for (let r of block.ranges) ranges.push(EditorSelection.range(r.anchor - size, r.head - size));
    }
  }
  if (!changes.length) return false;
  dispatch(state.update({
    changes,
    scrollIntoView: true,
    selection: EditorSelection.create(ranges, state.selection.mainIndex),
    userEvent: "move.line"
  }));
  return true;
}
/**
Move the selected lines up one line.
*/
const moveLineUp = ({
  state,
  dispatch
}) => moveLine(state, dispatch, false);
/**
Move the selected lines down one line.
*/
const moveLineDown = ({
  state,
  dispatch
}) => moveLine(state, dispatch, true);
function copyLine(state, dispatch, forward) {
  if (state.readOnly) return false;
  let changes = [];
  for (let block of selectedLineBlocks(state)) {
    if (forward) changes.push({
      from: block.from,
      insert: state.doc.slice(block.from, block.to) + state.lineBreak
    });else changes.push({
      from: block.to,
      insert: state.lineBreak + state.doc.slice(block.from, block.to)
    });
  }
  let changeSet = state.changes(changes);
  dispatch(state.update({
    changes: changeSet,
    selection: state.selection.map(changeSet, forward ? 1 : -1),
    scrollIntoView: true,
    userEvent: "input.copyline"
  }));
  return true;
}
/**
Create a copy of the selected lines. Keep the selection in the top copy.
*/
const copyLineUp = ({
  state,
  dispatch
}) => copyLine(state, dispatch, false);
/**
Create a copy of the selected lines. Keep the selection in the bottom copy.
*/
const copyLineDown = ({
  state,
  dispatch
}) => copyLine(state, dispatch, true);
/**
Delete selected lines.
*/
const deleteLine = view => {
  if (view.state.readOnly) return false;
  let {
      state
    } = view,
    changes = state.changes(selectedLineBlocks(state).map(({
      from,
      to
    }) => {
      if (from > 0) from--;else if (to < state.doc.length) to++;
      return {
        from,
        to
      };
    }));
  let selection = updateSel(state.selection, range => {
    let dist = undefined;
    if (view.lineWrapping) {
      let block = view.lineBlockAt(range.head),
        pos = view.coordsAtPos(range.head, range.assoc || 1);
      if (pos) dist = block.bottom + view.documentTop - pos.bottom + view.defaultLineHeight / 2;
    }
    return view.moveVertically(range, true, dist);
  }).map(changes);
  view.dispatch({
    changes,
    selection,
    scrollIntoView: true,
    userEvent: "delete.line"
  });
  return true;
};
function isBetweenBrackets(state, pos) {
  if (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1))) return {
    from: pos,
    to: pos
  };
  let context = syntaxTree(state).resolveInner(pos);
  let before = context.childBefore(pos),
    after = context.childAfter(pos),
    closedBy;
  if (before && after && before.to <= pos && after.from >= pos && (closedBy = before.type.prop(NodeProp.closedBy)) && closedBy.indexOf(after.name) > -1 && state.doc.lineAt(before.to).from == state.doc.lineAt(after.from).from && !/\S/.test(state.sliceDoc(before.to, after.from))) return {
    from: before.to,
    to: after.from
  };
  return null;
}
/**
Replace the selection with a newline and indent the newly created
line(s). If the current line consists only of whitespace, this
will also delete that whitespace. When the cursor is between
matching brackets, an additional newline will be inserted after
the cursor.
*/
const insertNewlineAndIndent = /*@__PURE__*/newlineAndIndent(false);
/**
Create a blank, indented line below the current line.
*/
const insertBlankLine = /*@__PURE__*/newlineAndIndent(true);
function newlineAndIndent(atEof) {
  return ({
    state,
    dispatch
  }) => {
    if (state.readOnly) return false;
    let changes = state.changeByRange(range => {
      let {
          from,
          to
        } = range,
        line = state.doc.lineAt(from);
      let explode = !atEof && from == to && isBetweenBrackets(state, from);
      if (atEof) from = to = (to <= line.to ? line : state.doc.lineAt(to)).to;
      let cx = new IndentContext(state, {
        simulateBreak: from,
        simulateDoubleBreak: !!explode
      });
      let indent = getIndentation(cx, from);
      if (indent == null) indent = countColumn(/^\s*/.exec(state.doc.lineAt(from).text)[0], state.tabSize);
      while (to < line.to && /\s/.test(line.text[to - line.from])) to++;
      if (explode) ({
        from,
        to
      } = explode);else if (from > line.from && from < line.from + 100 && !/\S/.test(line.text.slice(0, from))) from = line.from;
      let insert = ["", indentString(state, indent)];
      if (explode) insert.push(indentString(state, cx.lineIndent(line.from, -1)));
      return {
        changes: {
          from,
          to,
          insert: Text.of(insert)
        },
        range: EditorSelection.cursor(from + 1 + insert[1].length)
      };
    });
    dispatch(state.update(changes, {
      scrollIntoView: true,
      userEvent: "input"
    }));
    return true;
  };
}
function changeBySelectedLine(state, f) {
  let atLine = -1;
  return state.changeByRange(range => {
    let changes = [];
    for (let pos = range.from; pos <= range.to;) {
      let line = state.doc.lineAt(pos);
      if (line.number > atLine && (range.empty || range.to > line.from)) {
        f(line, changes, range);
        atLine = line.number;
      }
      pos = line.to + 1;
    }
    let changeSet = state.changes(changes);
    return {
      changes,
      range: EditorSelection.range(changeSet.mapPos(range.anchor, 1), changeSet.mapPos(range.head, 1))
    };
  });
}
/**
Auto-indent the selected lines. This uses the [indentation service
facet](https://codemirror.net/6/docs/ref/#language.indentService) as source for auto-indent
information.
*/
const indentSelection = ({
  state,
  dispatch
}) => {
  if (state.readOnly) return false;
  let updated = Object.create(null);
  let context = new IndentContext(state, {
    overrideIndentation: start => {
      let found = updated[start];
      return found == null ? -1 : found;
    }
  });
  let changes = changeBySelectedLine(state, (line, changes, range) => {
    let indent = getIndentation(context, line.from);
    if (indent == null) return;
    if (!/\S/.test(line.text)) indent = 0;
    let cur = /^\s*/.exec(line.text)[0];
    let norm = indentString(state, indent);
    if (cur != norm || range.from < line.from + cur.length) {
      updated[line.from] = indent;
      changes.push({
        from: line.from,
        to: line.from + cur.length,
        insert: norm
      });
    }
  });
  if (!changes.changes.empty) dispatch(state.update(changes, {
    userEvent: "indent"
  }));
  return true;
};
/**
Add a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation to all selected
lines.
*/
const indentMore = ({
  state,
  dispatch
}) => {
  if (state.readOnly) return false;
  dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
    changes.push({
      from: line.from,
      insert: state.facet(indentUnit)
    });
  }), {
    userEvent: "input.indent"
  }));
  return true;
};
/**
Remove a [unit](https://codemirror.net/6/docs/ref/#language.indentUnit) of indentation from all
selected lines.
*/
const indentLess = ({
  state,
  dispatch
}) => {
  if (state.readOnly) return false;
  dispatch(state.update(changeBySelectedLine(state, (line, changes) => {
    let space = /^\s*/.exec(line.text)[0];
    if (!space) return;
    let col = countColumn(space, state.tabSize),
      keep = 0;
    let insert = indentString(state, Math.max(0, col - getIndentUnit(state)));
    while (keep < space.length && keep < insert.length && space.charCodeAt(keep) == insert.charCodeAt(keep)) keep++;
    changes.push({
      from: line.from + keep,
      to: line.from + space.length,
      insert: insert.slice(keep)
    });
  }), {
    userEvent: "delete.dedent"
  }));
  return true;
};
/**
Enables or disables
[tab-focus mode](https://codemirror.net/6/docs/ref/#view.EditorView.setTabFocusMode). While on, this
prevents the editor's key bindings from capturing Tab or
Shift-Tab, making it possible for the user to move focus out of
the editor with the keyboard.
*/
const toggleTabFocusMode = view => {
  view.setTabFocusMode();
  return true;
};
/**
Array of key bindings containing the Emacs-style bindings that are
available on macOS by default.

 - Ctrl-b: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
 - Ctrl-f: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
 - Ctrl-p: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
 - Ctrl-n: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
 - Ctrl-a: [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
 - Ctrl-e: [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
 - Ctrl-d: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
 - Ctrl-h: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
 - Ctrl-k: [`deleteToLineEnd`](https://codemirror.net/6/docs/ref/#commands.deleteToLineEnd)
 - Ctrl-Alt-h: [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
 - Ctrl-o: [`splitLine`](https://codemirror.net/6/docs/ref/#commands.splitLine)
 - Ctrl-t: [`transposeChars`](https://codemirror.net/6/docs/ref/#commands.transposeChars)
 - Ctrl-v: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown)
 - Alt-v: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp)
*/
const emacsStyleKeymap = [{
  key: "Ctrl-b",
  run: cursorCharLeft,
  shift: selectCharLeft,
  preventDefault: true
}, {
  key: "Ctrl-f",
  run: cursorCharRight,
  shift: selectCharRight
}, {
  key: "Ctrl-p",
  run: cursorLineUp,
  shift: selectLineUp
}, {
  key: "Ctrl-n",
  run: cursorLineDown,
  shift: selectLineDown
}, {
  key: "Ctrl-a",
  run: cursorLineStart,
  shift: selectLineStart
}, {
  key: "Ctrl-e",
  run: cursorLineEnd,
  shift: selectLineEnd
}, {
  key: "Ctrl-d",
  run: deleteCharForward
}, {
  key: "Ctrl-h",
  run: deleteCharBackward
}, {
  key: "Ctrl-k",
  run: deleteToLineEnd
}, {
  key: "Ctrl-Alt-h",
  run: deleteGroupBackward
}, {
  key: "Ctrl-o",
  run: splitLine
}, {
  key: "Ctrl-t",
  run: transposeChars
}, {
  key: "Ctrl-v",
  run: cursorPageDown
}];
/**
An array of key bindings closely sticking to platform-standard or
widely used bindings. (This includes the bindings from
[`emacsStyleKeymap`](https://codemirror.net/6/docs/ref/#commands.emacsStyleKeymap), with their `key`
property changed to `mac`.)

 - ArrowLeft: [`cursorCharLeft`](https://codemirror.net/6/docs/ref/#commands.cursorCharLeft) ([`selectCharLeft`](https://codemirror.net/6/docs/ref/#commands.selectCharLeft) with Shift)
 - ArrowRight: [`cursorCharRight`](https://codemirror.net/6/docs/ref/#commands.cursorCharRight) ([`selectCharRight`](https://codemirror.net/6/docs/ref/#commands.selectCharRight) with Shift)
 - Ctrl-ArrowLeft (Alt-ArrowLeft on macOS): [`cursorGroupLeft`](https://codemirror.net/6/docs/ref/#commands.cursorGroupLeft) ([`selectGroupLeft`](https://codemirror.net/6/docs/ref/#commands.selectGroupLeft) with Shift)
 - Ctrl-ArrowRight (Alt-ArrowRight on macOS): [`cursorGroupRight`](https://codemirror.net/6/docs/ref/#commands.cursorGroupRight) ([`selectGroupRight`](https://codemirror.net/6/docs/ref/#commands.selectGroupRight) with Shift)
 - Cmd-ArrowLeft (on macOS): [`cursorLineStart`](https://codemirror.net/6/docs/ref/#commands.cursorLineStart) ([`selectLineStart`](https://codemirror.net/6/docs/ref/#commands.selectLineStart) with Shift)
 - Cmd-ArrowRight (on macOS): [`cursorLineEnd`](https://codemirror.net/6/docs/ref/#commands.cursorLineEnd) ([`selectLineEnd`](https://codemirror.net/6/docs/ref/#commands.selectLineEnd) with Shift)
 - ArrowUp: [`cursorLineUp`](https://codemirror.net/6/docs/ref/#commands.cursorLineUp) ([`selectLineUp`](https://codemirror.net/6/docs/ref/#commands.selectLineUp) with Shift)
 - ArrowDown: [`cursorLineDown`](https://codemirror.net/6/docs/ref/#commands.cursorLineDown) ([`selectLineDown`](https://codemirror.net/6/docs/ref/#commands.selectLineDown) with Shift)
 - Cmd-ArrowUp (on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
 - Cmd-ArrowDown (on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
 - Ctrl-ArrowUp (on macOS): [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
 - Ctrl-ArrowDown (on macOS): [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
 - PageUp: [`cursorPageUp`](https://codemirror.net/6/docs/ref/#commands.cursorPageUp) ([`selectPageUp`](https://codemirror.net/6/docs/ref/#commands.selectPageUp) with Shift)
 - PageDown: [`cursorPageDown`](https://codemirror.net/6/docs/ref/#commands.cursorPageDown) ([`selectPageDown`](https://codemirror.net/6/docs/ref/#commands.selectPageDown) with Shift)
 - Home: [`cursorLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryBackward) ([`selectLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryBackward) with Shift)
 - End: [`cursorLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.cursorLineBoundaryForward) ([`selectLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.selectLineBoundaryForward) with Shift)
 - Ctrl-Home (Cmd-Home on macOS): [`cursorDocStart`](https://codemirror.net/6/docs/ref/#commands.cursorDocStart) ([`selectDocStart`](https://codemirror.net/6/docs/ref/#commands.selectDocStart) with Shift)
 - Ctrl-End (Cmd-Home on macOS): [`cursorDocEnd`](https://codemirror.net/6/docs/ref/#commands.cursorDocEnd) ([`selectDocEnd`](https://codemirror.net/6/docs/ref/#commands.selectDocEnd) with Shift)
 - Enter and Shift-Enter: [`insertNewlineAndIndent`](https://codemirror.net/6/docs/ref/#commands.insertNewlineAndIndent)
 - Ctrl-a (Cmd-a on macOS): [`selectAll`](https://codemirror.net/6/docs/ref/#commands.selectAll)
 - Backspace: [`deleteCharBackward`](https://codemirror.net/6/docs/ref/#commands.deleteCharBackward)
 - Delete: [`deleteCharForward`](https://codemirror.net/6/docs/ref/#commands.deleteCharForward)
 - Ctrl-Backspace (Alt-Backspace on macOS): [`deleteGroupBackward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupBackward)
 - Ctrl-Delete (Alt-Delete on macOS): [`deleteGroupForward`](https://codemirror.net/6/docs/ref/#commands.deleteGroupForward)
 - Cmd-Backspace (macOS): [`deleteLineBoundaryBackward`](https://codemirror.net/6/docs/ref/#commands.deleteLineBoundaryBackward).
 - Cmd-Delete (macOS): [`deleteLineBoundaryForward`](https://codemirror.net/6/docs/ref/#commands.deleteLineBoundaryForward).
*/
const standardKeymap = /*@__PURE__*/[{
  key: "ArrowLeft",
  run: cursorCharLeft,
  shift: selectCharLeft,
  preventDefault: true
}, {
  key: "Mod-ArrowLeft",
  mac: "Alt-ArrowLeft",
  run: cursorGroupLeft,
  shift: selectGroupLeft,
  preventDefault: true
}, {
  mac: "Cmd-ArrowLeft",
  run: cursorLineBoundaryLeft,
  shift: selectLineBoundaryLeft,
  preventDefault: true
}, {
  key: "ArrowRight",
  run: cursorCharRight,
  shift: selectCharRight,
  preventDefault: true
}, {
  key: "Mod-ArrowRight",
  mac: "Alt-ArrowRight",
  run: cursorGroupRight,
  shift: selectGroupRight,
  preventDefault: true
}, {
  mac: "Cmd-ArrowRight",
  run: cursorLineBoundaryRight,
  shift: selectLineBoundaryRight,
  preventDefault: true
}, {
  key: "ArrowUp",
  run: cursorLineUp,
  shift: selectLineUp,
  preventDefault: true
}, {
  mac: "Cmd-ArrowUp",
  run: cursorDocStart,
  shift: selectDocStart
}, {
  mac: "Ctrl-ArrowUp",
  run: cursorPageUp,
  shift: selectPageUp
}, {
  key: "ArrowDown",
  run: cursorLineDown,
  shift: selectLineDown,
  preventDefault: true
}, {
  mac: "Cmd-ArrowDown",
  run: cursorDocEnd,
  shift: selectDocEnd
}, {
  mac: "Ctrl-ArrowDown",
  run: cursorPageDown,
  shift: selectPageDown
}, {
  key: "PageUp",
  run: cursorPageUp,
  shift: selectPageUp
}, {
  key: "PageDown",
  run: cursorPageDown,
  shift: selectPageDown
}, {
  key: "Home",
  run: cursorLineBoundaryBackward,
  shift: selectLineBoundaryBackward,
  preventDefault: true
}, {
  key: "Mod-Home",
  run: cursorDocStart,
  shift: selectDocStart
}, {
  key: "End",
  run: cursorLineBoundaryForward,
  shift: selectLineBoundaryForward,
  preventDefault: true
}, {
  key: "Mod-End",
  run: cursorDocEnd,
  shift: selectDocEnd
}, {
  key: "Enter",
  run: insertNewlineAndIndent,
  shift: insertNewlineAndIndent
}, {
  key: "Mod-a",
  run: selectAll
}, {
  key: "Backspace",
  run: deleteCharBackward,
  shift: deleteCharBackward,
  preventDefault: true
}, {
  key: "Delete",
  run: deleteCharForward,
  preventDefault: true
}, {
  key: "Mod-Backspace",
  mac: "Alt-Backspace",
  run: deleteGroupBackward,
  preventDefault: true
}, {
  key: "Mod-Delete",
  mac: "Alt-Delete",
  run: deleteGroupForward,
  preventDefault: true
}, {
  mac: "Mod-Backspace",
  run: deleteLineBoundaryBackward,
  preventDefault: true
}, {
  mac: "Mod-Delete",
  run: deleteLineBoundaryForward,
  preventDefault: true
}].concat(/*@__PURE__*/emacsStyleKeymap.map(b => ({
  mac: b.key,
  run: b.run,
  shift: b.shift
})));
/**
The default keymap. Includes all bindings from
[`standardKeymap`](https://codemirror.net/6/docs/ref/#commands.standardKeymap) plus the following:

- Alt-ArrowLeft (Ctrl-ArrowLeft on macOS): [`cursorSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxLeft) ([`selectSyntaxLeft`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxLeft) with Shift)
- Alt-ArrowRight (Ctrl-ArrowRight on macOS): [`cursorSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.cursorSyntaxRight) ([`selectSyntaxRight`](https://codemirror.net/6/docs/ref/#commands.selectSyntaxRight) with Shift)
- Alt-ArrowUp: [`moveLineUp`](https://codemirror.net/6/docs/ref/#commands.moveLineUp)
- Alt-ArrowDown: [`moveLineDown`](https://codemirror.net/6/docs/ref/#commands.moveLineDown)
- Shift-Alt-ArrowUp: [`copyLineUp`](https://codemirror.net/6/docs/ref/#commands.copyLineUp)
- Shift-Alt-ArrowDown: [`copyLineDown`](https://codemirror.net/6/docs/ref/#commands.copyLineDown)
- Ctrl-Alt-ArrowUp (Cmd-Alt-ArrowUp on macOS): [`addCursorAbove`](https://codemirror.net/6/docs/ref/#commands.addCursorAbove).
- Ctrl-Alt-ArrowDown (Cmd-Alt-ArrowDown on macOS): [`addCursorBelow`](https://codemirror.net/6/docs/ref/#commands.addCursorBelow).
- Escape: [`simplifySelection`](https://codemirror.net/6/docs/ref/#commands.simplifySelection)
- Ctrl-Enter (Cmd-Enter on macOS): [`insertBlankLine`](https://codemirror.net/6/docs/ref/#commands.insertBlankLine)
- Alt-l (Ctrl-l on macOS): [`selectLine`](https://codemirror.net/6/docs/ref/#commands.selectLine)
- Ctrl-i (Cmd-i on macOS): [`selectParentSyntax`](https://codemirror.net/6/docs/ref/#commands.selectParentSyntax)
- Ctrl-[ (Cmd-[ on macOS): [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess)
- Ctrl-] (Cmd-] on macOS): [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore)
- Ctrl-Alt-\\ (Cmd-Alt-\\ on macOS): [`indentSelection`](https://codemirror.net/6/docs/ref/#commands.indentSelection)
- Shift-Ctrl-k (Shift-Cmd-k on macOS): [`deleteLine`](https://codemirror.net/6/docs/ref/#commands.deleteLine)
- Shift-Ctrl-\\ (Shift-Cmd-\\ on macOS): [`cursorMatchingBracket`](https://codemirror.net/6/docs/ref/#commands.cursorMatchingBracket)
- Ctrl-/ (Cmd-/ on macOS): [`toggleComment`](https://codemirror.net/6/docs/ref/#commands.toggleComment).
- Shift-Alt-a (Shift-Ctrl-a on macOS): [`toggleBlockComment`](https://codemirror.net/6/docs/ref/#commands.toggleBlockComment).
- Ctrl-m (Alt-Shift-m on macOS): [`toggleTabFocusMode`](https://codemirror.net/6/docs/ref/#commands.toggleTabFocusMode).
*/
const defaultKeymap = /*@__PURE__*/[{
  key: "Alt-ArrowLeft",
  mac: "Ctrl-ArrowLeft",
  run: cursorSyntaxLeft,
  shift: selectSyntaxLeft
}, {
  key: "Alt-ArrowRight",
  mac: "Ctrl-ArrowRight",
  run: cursorSyntaxRight,
  shift: selectSyntaxRight
}, {
  key: "Alt-ArrowUp",
  run: moveLineUp
}, {
  key: "Shift-Alt-ArrowUp",
  run: copyLineUp
}, {
  key: "Alt-ArrowDown",
  run: moveLineDown
}, {
  key: "Shift-Alt-ArrowDown",
  run: copyLineDown
}, {
  key: "Mod-Alt-ArrowUp",
  run: addCursorAbove
}, {
  key: "Mod-Alt-ArrowDown",
  run: addCursorBelow
}, {
  key: "Escape",
  run: simplifySelection
}, {
  key: "Mod-Enter",
  run: insertBlankLine
}, {
  key: "Alt-l",
  mac: "Ctrl-l",
  run: selectLine
}, {
  key: "Mod-i",
  run: selectParentSyntax,
  preventDefault: true
}, {
  key: "Mod-[",
  run: indentLess
}, {
  key: "Mod-]",
  run: indentMore
}, {
  key: "Mod-Alt-\\",
  run: indentSelection
}, {
  key: "Shift-Mod-k",
  run: deleteLine
}, {
  key: "Shift-Mod-\\",
  run: cursorMatchingBracket
}, {
  key: "Mod-/",
  run: toggleComment
}, {
  key: "Alt-A",
  mac: "Ctrl-A",
  run: toggleBlockComment
}, {
  key: "Ctrl-m",
  mac: "Shift-Alt-m",
  run: toggleTabFocusMode
}].concat(standardKeymap);
/**
A binding that binds Tab to [`indentMore`](https://codemirror.net/6/docs/ref/#commands.indentMore) and
Shift-Tab to [`indentLess`](https://codemirror.net/6/docs/ref/#commands.indentLess).
Please see the [Tab example](../../examples/tab/) before using
this.
*/
const indentWithTab = {
  key: "Tab",
  run: indentMore,
  shift: indentLess
};

class SelectedDiagnostic {
  constructor(from, to, diagnostic) {
    this.from = from;
    this.to = to;
    this.diagnostic = diagnostic;
  }
}
class LintState {
  constructor(diagnostics, panel, selected) {
    this.diagnostics = diagnostics;
    this.panel = panel;
    this.selected = selected;
  }
  static init(diagnostics, panel, state) {
    // Filter the list of diagnostics for which to create markers
    let diagnosticFilter = state.facet(lintConfig).markerFilter;
    if (diagnosticFilter) diagnostics = diagnosticFilter(diagnostics, state);
    let sorted = diagnostics.slice().sort((a, b) => a.from - b.from || a.to - b.to);
    let deco = new RangeSetBuilder(),
      active = [],
      pos = 0;
    let scan = state.doc.iter(),
      scanPos = 0,
      docLen = state.doc.length;
    for (let i = 0;;) {
      let next = i == sorted.length ? null : sorted[i];
      if (!next && !active.length) break;
      let from, to;
      if (active.length) {
        from = pos;
        to = active.reduce((p, d) => Math.min(p, d.to), next && next.from > from ? next.from : 1e8);
      } else {
        from = next.from;
        if (from > docLen) break;
        to = next.to;
        active.push(next);
        i++;
      }
      while (i < sorted.length) {
        let next = sorted[i];
        if (next.from == from && (next.to > next.from || next.to == from)) {
          active.push(next);
          i++;
          to = Math.min(next.to, to);
        } else {
          to = Math.min(next.from, to);
          break;
        }
      }
      to = Math.min(to, docLen);
      let widget = false;
      if (active.some(d => d.from == from && (d.to == to || to == docLen))) {
        widget = from == to;
        if (!widget && to - from < 10) {
          let behind = from - (scanPos + scan.value.length);
          if (behind > 0) {
            scan.next(behind);
            scanPos = from;
          }
          for (let check = from;;) {
            if (check >= to) {
              widget = true;
              break;
            }
            if (!scan.lineBreak && scanPos + scan.value.length > check) break;
            check = scanPos + scan.value.length;
            scanPos += scan.value.length;
            scan.next();
          }
        }
      }
      let sev = maxSeverity(active);
      if (widget) {
        deco.add(from, from, Decoration.widget({
          widget: new DiagnosticWidget(sev),
          diagnostics: active.slice()
        }));
      } else {
        let markClass = active.reduce((c, d) => d.markClass ? c + " " + d.markClass : c, "");
        deco.add(from, to, Decoration.mark({
          class: "cm-lintRange cm-lintRange-" + sev + markClass,
          diagnostics: active.slice(),
          inclusiveEnd: active.some(a => a.to > to)
        }));
      }
      pos = to;
      if (pos == docLen) break;
      for (let i = 0; i < active.length; i++) if (active[i].to <= pos) active.splice(i--, 1);
    }
    let set = deco.finish();
    return new LintState(set, panel, findDiagnostic(set));
  }
}
function findDiagnostic(diagnostics, diagnostic = null, after = 0) {
  let found = null;
  diagnostics.between(after, 1e9, (from, to, {
    spec
  }) => {
    if (diagnostic && spec.diagnostics.indexOf(diagnostic) < 0) return;
    if (!found) found = new SelectedDiagnostic(from, to, diagnostic || spec.diagnostics[0]);else if (spec.diagnostics.indexOf(found.diagnostic) < 0) return false;else found = new SelectedDiagnostic(found.from, to, found.diagnostic);
  });
  return found;
}
function hideTooltip(tr, tooltip) {
  let from = tooltip.pos,
    to = tooltip.end || from;
  let result = tr.state.facet(lintConfig).hideOn(tr, from, to);
  if (result != null) return result;
  let line = tr.startState.doc.lineAt(tooltip.pos);
  return !!(tr.effects.some(e => e.is(setDiagnosticsEffect)) || tr.changes.touchesRange(line.from, Math.max(line.to, to)));
}
function maybeEnableLint(state, effects) {
  return state.field(lintState, false) ? effects : effects.concat(StateEffect.appendConfig.of(lintExtensions));
}
/**
The state effect that updates the set of active diagnostics. Can
be useful when writing an extension that needs to track these.
*/
const setDiagnosticsEffect = /*@__PURE__*/StateEffect.define();
const togglePanel = /*@__PURE__*/StateEffect.define();
const movePanelSelection = /*@__PURE__*/StateEffect.define();
const lintState = /*@__PURE__*/StateField.define({
  create() {
    return new LintState(Decoration.none, null, null);
  },
  update(value, tr) {
    if (tr.docChanged && value.diagnostics.size) {
      let mapped = value.diagnostics.map(tr.changes),
        selected = null,
        panel = value.panel;
      if (value.selected) {
        let selPos = tr.changes.mapPos(value.selected.from, 1);
        selected = findDiagnostic(mapped, value.selected.diagnostic, selPos) || findDiagnostic(mapped, null, selPos);
      }
      if (!mapped.size && panel && tr.state.facet(lintConfig).autoPanel) panel = null;
      value = new LintState(mapped, panel, selected);
    }
    for (let effect of tr.effects) {
      if (effect.is(setDiagnosticsEffect)) {
        let panel = !tr.state.facet(lintConfig).autoPanel ? value.panel : effect.value.length ? LintPanel.open : null;
        value = LintState.init(effect.value, panel, tr.state);
      } else if (effect.is(togglePanel)) {
        value = new LintState(value.diagnostics, effect.value ? LintPanel.open : null, value.selected);
      } else if (effect.is(movePanelSelection)) {
        value = new LintState(value.diagnostics, value.panel, effect.value);
      }
    }
    return value;
  },
  provide: f => [showPanel.from(f, val => val.panel), EditorView.decorations.from(f, s => s.diagnostics)]
});
const activeMark = /*@__PURE__*/Decoration.mark({
  class: "cm-lintRange cm-lintRange-active"
});
function lintTooltip(view, pos, side) {
  let {
    diagnostics
  } = view.state.field(lintState);
  let found,
    start = -1,
    end = -1;
  diagnostics.between(pos - (side < 0 ? 1 : 0), pos + (side > 0 ? 1 : 0), (from, to, {
    spec
  }) => {
    if (pos >= from && pos <= to && (from == to || (pos > from || side > 0) && (pos < to || side < 0))) {
      found = spec.diagnostics;
      start = from;
      end = to;
      return false;
    }
  });
  let diagnosticFilter = view.state.facet(lintConfig).tooltipFilter;
  if (found && diagnosticFilter) found = diagnosticFilter(found, view.state);
  if (!found) return null;
  return {
    pos: start,
    end: end,
    above: true,
    create() {
      return {
        dom: diagnosticsTooltip(view, found)
      };
    }
  };
}
function diagnosticsTooltip(view, diagnostics) {
  return crelt("ul", {
    class: "cm-tooltip-lint"
  }, diagnostics.map(d => renderDiagnostic(view, d, false)));
}
/**
Command to open and focus the lint panel.
*/
const openLintPanel = view => {
  let field = view.state.field(lintState, false);
  if (!field || !field.panel) view.dispatch({
    effects: maybeEnableLint(view.state, [togglePanel.of(true)])
  });
  let panel = getPanel(view, LintPanel.open);
  if (panel) panel.dom.querySelector(".cm-panel-lint ul").focus();
  return true;
};
/**
Command to close the lint panel, when open.
*/
const closeLintPanel = view => {
  let field = view.state.field(lintState, false);
  if (!field || !field.panel) return false;
  view.dispatch({
    effects: togglePanel.of(false)
  });
  return true;
};
/**
Move the selection to the next diagnostic.
*/
const nextDiagnostic = view => {
  let field = view.state.field(lintState, false);
  if (!field) return false;
  let sel = view.state.selection.main,
    next = findDiagnostic(field.diagnostics, null, sel.to + 1);
  if (!next) {
    next = findDiagnostic(field.diagnostics, null, 0);
    if (!next || next.from == sel.from && next.to == sel.to) return false;
  }
  view.dispatch({
    selection: {
      anchor: next.from,
      head: next.to
    },
    scrollIntoView: true
  });
  activateHover(view, next.from, 1, {
    tooltip: lintHover,
    until: tr => tr.docChanged || tr.newSelection.main.head < next.from || tr.newSelection.main.head > next.to
  });
  return true;
};
/**
A set of default key bindings for the lint functionality.

- Ctrl-Shift-m (Cmd-Shift-m on macOS): [`openLintPanel`](https://codemirror.net/6/docs/ref/#lint.openLintPanel)
- F8: [`nextDiagnostic`](https://codemirror.net/6/docs/ref/#lint.nextDiagnostic)
*/
const lintKeymap = [{
  key: "Mod-Shift-m",
  run: openLintPanel,
  preventDefault: true
}, {
  key: "F8",
  run: nextDiagnostic
}];
const lintConfig = /*@__PURE__*/Facet.define({
  combine(input) {
    return {
      sources: input.map(i => i.source).filter(x => x != null),
      ...combineConfig(input.map(i => i.config), {
        delay: 750,
        markerFilter: null,
        tooltipFilter: null,
        needsRefresh: null,
        hideOn: () => null
      }, {
        delay: Math.max,
        markerFilter: combineFilter,
        tooltipFilter: combineFilter,
        needsRefresh: (a, b) => !a ? b : !b ? a : u => a(u) || b(u),
        hideOn: (a, b) => !a ? b : !b ? a : (t, x, y) => a(t, x, y) || b(t, x, y),
        autoPanel: (a, b) => a || b
      })
    };
  }
});
function combineFilter(a, b) {
  return !a ? b : !b ? a : (d, s) => b(a(d, s), s);
}
function assignKeys(actions) {
  let assigned = [];
  if (actions) actions: for (let {
    name
  } of actions) {
    for (let i = 0; i < name.length; i++) {
      let ch = name[i];
      if (/[a-zA-Z]/.test(ch) && !assigned.some(c => c.toLowerCase() == ch.toLowerCase())) {
        assigned.push(ch);
        continue actions;
      }
    }
    assigned.push("");
  }
  return assigned;
}
function renderDiagnostic(view, diagnostic, inPanel) {
  var _a;
  let keys = inPanel ? assignKeys(diagnostic.actions) : [];
  return crelt("li", {
    class: "cm-diagnostic cm-diagnostic-" + diagnostic.severity
  }, crelt("span", {
    class: "cm-diagnosticText"
  }, diagnostic.renderMessage ? diagnostic.renderMessage(view) : diagnostic.message), (_a = diagnostic.actions) === null || _a === void 0 ? void 0 : _a.map((action, i) => {
    let fired = false,
      click = e => {
        e.preventDefault();
        if (fired) return;
        fired = true;
        let found = findDiagnostic(view.state.field(lintState).diagnostics, diagnostic);
        if (found) action.apply(view, found.from, found.to);
      };
    let {
        name
      } = action,
      keyIndex = keys[i] ? name.indexOf(keys[i]) : -1;
    let nameElt = keyIndex < 0 ? name : [name.slice(0, keyIndex), crelt("u", name.slice(keyIndex, keyIndex + 1)), name.slice(keyIndex + 1)];
    let markClass = action.markClass ? " " + action.markClass : "";
    return crelt("button", {
      type: "button",
      class: "cm-diagnosticAction" + markClass,
      onclick: click,
      onmousedown: click,
      "aria-label": ` Action: ${name}${keyIndex < 0 ? "" : ` (access key "${keys[i]})"`}.`
    }, nameElt);
  }), diagnostic.source && crelt("div", {
    class: "cm-diagnosticSource"
  }, diagnostic.source));
}
class DiagnosticWidget extends WidgetType {
  constructor(sev) {
    super();
    this.sev = sev;
  }
  eq(other) {
    return other.sev == this.sev;
  }
  toDOM() {
    return crelt("span", {
      class: "cm-lintPoint cm-lintPoint-" + this.sev
    });
  }
}
class PanelItem {
  constructor(view, diagnostic) {
    this.diagnostic = diagnostic;
    this.id = "item_" + Math.floor(Math.random() * 0xffffffff).toString(16);
    this.dom = renderDiagnostic(view, diagnostic, true);
    this.dom.id = this.id;
    this.dom.setAttribute("role", "option");
  }
}
class LintPanel {
  constructor(view) {
    this.view = view;
    this.items = [];
    let onkeydown = event => {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (event.keyCode == 27) {
        // Escape
        closeLintPanel(this.view);
        this.view.focus();
      } else if (event.keyCode == 38 || event.keyCode == 33) {
        // ArrowUp, PageUp
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      } else if (event.keyCode == 40 || event.keyCode == 34) {
        // ArrowDown, PageDown
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      } else if (event.keyCode == 36) {
        // Home
        this.moveSelection(0);
      } else if (event.keyCode == 35) {
        // End
        this.moveSelection(this.items.length - 1);
      } else if (event.keyCode == 13) {
        // Enter
        this.view.focus();
      } else if (event.keyCode >= 65 && event.keyCode <= 90 && this.selectedIndex >= 0) {
        // A-Z
        let {
            diagnostic
          } = this.items[this.selectedIndex],
          keys = assignKeys(diagnostic.actions);
        for (let i = 0; i < keys.length; i++) if (keys[i].toUpperCase().charCodeAt(0) == event.keyCode) {
          let found = findDiagnostic(this.view.state.field(lintState).diagnostics, diagnostic);
          if (found) diagnostic.actions[i].apply(view, found.from, found.to);
        }
      } else {
        return;
      }
      event.preventDefault();
    };
    let onclick = event => {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].dom.contains(event.target)) this.moveSelection(i);
      }
    };
    this.list = crelt("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown,
      onclick
    });
    this.dom = crelt("div", {
      class: "cm-panel-lint"
    }, this.list, crelt("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => closeLintPanel(this.view)
    }, "×"));
    this.update();
  }
  get selectedIndex() {
    let selected = this.view.state.field(lintState).selected;
    if (!selected) return -1;
    for (let i = 0; i < this.items.length; i++) if (this.items[i].diagnostic == selected.diagnostic) return i;
    return -1;
  }
  update() {
    let {
      diagnostics,
      selected
    } = this.view.state.field(lintState);
    let i = 0,
      needsSync = false,
      newSelectedItem = null;
    let seen = new Set();
    diagnostics.between(0, this.view.state.doc.length, (_start, _end, {
      spec
    }) => {
      for (let diagnostic of spec.diagnostics) {
        if (seen.has(diagnostic)) continue;
        seen.add(diagnostic);
        let found = -1,
          item;
        for (let j = i; j < this.items.length; j++) if (this.items[j].diagnostic == diagnostic) {
          found = j;
          break;
        }
        if (found < 0) {
          item = new PanelItem(this.view, diagnostic);
          this.items.splice(i, 0, item);
          needsSync = true;
        } else {
          item = this.items[found];
          if (found > i) {
            this.items.splice(i, found - i);
            needsSync = true;
          }
        }
        if (selected && item.diagnostic == selected.diagnostic) {
          if (!item.dom.hasAttribute("aria-selected")) {
            item.dom.setAttribute("aria-selected", "true");
            newSelectedItem = item;
          }
        } else if (item.dom.hasAttribute("aria-selected")) {
          item.dom.removeAttribute("aria-selected");
        }
        i++;
      }
    });
    while (i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0)) {
      needsSync = true;
      this.items.pop();
    }
    if (this.items.length == 0) {
      this.items.push(new PanelItem(this.view, {
        from: -1,
        to: -1,
        severity: "info",
        message: this.view.state.phrase("No diagnostics")
      }));
      needsSync = true;
    }
    if (newSelectedItem) {
      this.list.setAttribute("aria-activedescendant", newSelectedItem.id);
      this.view.requestMeasure({
        key: this,
        read: () => ({
          sel: newSelectedItem.dom.getBoundingClientRect(),
          panel: this.list.getBoundingClientRect()
        }),
        write: ({
          sel,
          panel
        }) => {
          let scaleY = panel.height / this.list.offsetHeight;
          if (sel.top < panel.top) this.list.scrollTop -= (panel.top - sel.top) / scaleY;else if (sel.bottom > panel.bottom) this.list.scrollTop += (sel.bottom - panel.bottom) / scaleY;
        }
      });
    } else if (this.selectedIndex < 0) {
      this.list.removeAttribute("aria-activedescendant");
    }
    if (needsSync) this.sync();
  }
  sync() {
    let domPos = this.list.firstChild;
    function rm() {
      let prev = domPos;
      domPos = prev.nextSibling;
      prev.remove();
    }
    for (let item of this.items) {
      if (item.dom.parentNode == this.list) {
        while (domPos != item.dom) rm();
        domPos = item.dom.nextSibling;
      } else {
        this.list.insertBefore(item.dom, domPos);
      }
    }
    while (domPos) rm();
  }
  moveSelection(selectedIndex) {
    if (this.selectedIndex < 0) return;
    let field = this.view.state.field(lintState);
    let selection = findDiagnostic(field.diagnostics, this.items[selectedIndex].diagnostic);
    if (!selection) return;
    this.view.dispatch({
      selection: {
        anchor: selection.from,
        head: selection.to
      },
      scrollIntoView: true,
      effects: movePanelSelection.of(selection)
    });
  }
  static open(view) {
    return new LintPanel(view);
  }
}
function svg(content, attrs = `viewBox="0 0 40 40"`) {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(content)}</svg>')`;
}
function underline(color) {
  return svg(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${color}" fill="none" stroke-width=".7"/>`, `width="6" height="3"`);
}
const baseTheme = /*@__PURE__*/EditorView.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": {
    borderLeft: "5px solid #d11"
  },
  ".cm-diagnostic-warning": {
    borderLeft: "5px solid orange"
  },
  ".cm-diagnostic-info": {
    borderLeft: "5px solid #999"
  },
  ".cm-diagnostic-hint": {
    borderLeft: "5px solid #66d"
  },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: .7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": {
    backgroundImage: /*@__PURE__*/underline("#f11")
  },
  ".cm-lintRange-warning": {
    backgroundImage: /*@__PURE__*/underline("orange")
  },
  ".cm-lintRange-info": {
    backgroundImage: /*@__PURE__*/underline("#999")
  },
  ".cm-lintRange-hint": {
    backgroundImage: /*@__PURE__*/underline("#66d")
  },
  ".cm-lintRange-active": {
    backgroundColor: "#ffdd9980"
  },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": {
      borderBottomColor: "orange"
    }
  },
  ".cm-lintPoint-info": {
    "&:after": {
      borderBottomColor: "#999"
    }
  },
  ".cm-lintPoint-hint": {
    "&:after": {
      borderBottomColor: "#66d"
    }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": {
          textDecoration: "underline"
        }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": {
        textDecoration: "none"
      },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  },
  "&dark .cm-lintRange-active": {
    backgroundColor: "#86714a80"
  },
  "&dark .cm-panel.cm-panel-lint ul": {
    "& [aria-selected]": {
      backgroundColor: "#2e343e"
    }
  }
});
function severityWeight(sev) {
  return sev == "error" ? 4 : sev == "warning" ? 3 : sev == "info" ? 2 : 1;
}
function maxSeverity(diagnostics) {
  let sev = "hint",
    weight = 1;
  for (let d of diagnostics) {
    let w = severityWeight(d.severity);
    if (w > weight) {
      weight = w;
      sev = d.severity;
    }
  }
  return sev;
}
const lintHover = /*@__PURE__*/hoverTooltip(lintTooltip, {
  hideOn: hideTooltip
});
const lintExtensions = [lintState, /*@__PURE__*/EditorView.decorations.compute([lintState], state => {
  let {
    selected,
    panel
  } = state.field(lintState);
  return !selected || !panel || selected.from == selected.to ? Decoration.none : Decoration.set([activeMark.range(selected.from, selected.to)]);
}), lintHover, baseTheme];

export { historyKeymap as a, defaultKeymap as d, history as h, indentWithTab as i, lintKeymap as l };
