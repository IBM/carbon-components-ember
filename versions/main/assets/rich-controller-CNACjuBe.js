import { _ as _defineProperty, gq as textToDoc, gr as getRawText } from './main-BPDXwbuc.js';
import { N as Node, m as mergeAttributes, b as Plugin, d as dropPoint, F as Fragment, e as Slice, T as TextSelection, k as keydownHandler, f as NodeSelection, D as DecorationSet, g as Decoration, h as Selection, P as PluginKey, M as Mapping, E as Extension, j as isNodeEmpty, l as getChangedRanges, n as callOrReturn, o as getExtensionField, p as isNodeSelection, q as setHostOriginMeta, t as selectActiveSuggestion, v as dismissActiveSuggestion, w as Editor, x as hasActiveSuggestion } from './origin-meta-CwHoBU5Q.js';
import './index-D2CeE0KS.js';

//#region src/document.ts
/**
* The default document node which represents the top level node of the editor.
* @see https://tiptap.dev/api/nodes/document
*/
const Document = Node.create({
  name: "doc",
  topNode: true,
  content: "block+",
  renderMarkdown: (node, h) => {
    if (!node.content) return "";
    return h.renderChildren(node.content, "\n\n");
  }
});
//#endregion
//#region src/index.ts
var src_default$4 = Document;

//#region src/hard-break.ts
/**
* This extension allows you to insert hard breaks.
* @see https://www.tiptap.dev/api/nodes/hard-break
*/
const HardBreak = Node.create({
  name: "hardBreak",
  markdownTokenName: "br",
  addOptions() {
    return {
      keepMarks: true,
      HTMLAttributes: {}
    };
  },
  inline: true,
  group: "inline",
  selectable: false,
  linebreakReplacement: true,
  parseHTML() {
    return [{
      tag: "br"
    }];
  },
  renderHTML({
    HTMLAttributes
  }) {
    return ["br", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  renderText() {
    return "\n";
  },
  renderMarkdown: () => `  \n`,
  parseMarkdown: () => {
    return {
      type: "hardBreak"
    };
  },
  addCommands() {
    return {
      setHardBreak: () => ({
        commands,
        chain,
        state,
        editor
      }) => {
        return commands.first([() => commands.exitCode(), () => commands.command(() => {
          const {
            selection,
            storedMarks
          } = state;
          if (selection.$from.parent.type.spec.isolating) return false;
          const {
            keepMarks
          } = this.options;
          const {
            splittableMarks
          } = editor.extensionManager;
          const marks = storedMarks || selection.$to.parentOffset && selection.$from.marks();
          return chain().insertContent({
            type: this.name
          }).command(({
            tr,
            dispatch
          }) => {
            if (dispatch && marks && keepMarks) {
              const filteredMarks = marks.filter(mark => splittableMarks.includes(mark.type.name));
              tr.ensureMarks(filteredMarks);
            }
            return true;
          }).scrollIntoView().run();
        })]);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
});
//#endregion
//#region src/index.ts
var src_default$3 = HardBreak;

//#region src/paragraph.ts
/**
* Markdown marker for empty paragraphs to preserve blank lines.
* Using &nbsp; (non-breaking space HTML entity) ensures the paragraph
* is not collapsed by markdown parsers while remaining human-readable.
*/
const EMPTY_PARAGRAPH_MARKDOWN = "&nbsp;";
/**
* Unicode character for non-breaking space (U+00A0).
* Some markdown parsers may convert &nbsp; entities to this literal character.
*/
const NBSP_CHAR = "\xA0";
/**
* This extension allows you to create paragraphs.
* @see https://www.tiptap.dev/api/nodes/paragraph
*/
const Paragraph = Node.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{
      tag: "p"
    }];
  },
  renderHTML({
    HTMLAttributes
  }) {
    return ["p", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  parseMarkdown: (token, helpers) => {
    const tokens = token.tokens || [];
    if (tokens.length === 1 && tokens[0].type === "image") return helpers.parseChildren([tokens[0]]);
    const content = helpers.parseInline(tokens);
    if (tokens.length === 1 && tokens[0].type === "text" && (tokens[0].raw === EMPTY_PARAGRAPH_MARKDOWN || tokens[0].text === EMPTY_PARAGRAPH_MARKDOWN || tokens[0].raw === NBSP_CHAR || tokens[0].text === NBSP_CHAR) && content.length === 1 && content[0].type === "text" && (content[0].text === EMPTY_PARAGRAPH_MARKDOWN || content[0].text === NBSP_CHAR)) return helpers.createNode("paragraph", void 0, []);
    return helpers.createNode("paragraph", void 0, content);
  },
  renderMarkdown: (node, h, ctx) => {
    if (!node) return "";
    const content = Array.isArray(node.content) ? node.content : [];
    if (content.length === 0) {
      var _ctx$previousNode, _ctx$previousNode2;
      const previousContent = Array.isArray(ctx === null || ctx === void 0 || (_ctx$previousNode = ctx.previousNode) === null || _ctx$previousNode === void 0 ? void 0 : _ctx$previousNode.content) ? ctx.previousNode.content : [];
      return (ctx === null || ctx === void 0 || (_ctx$previousNode2 = ctx.previousNode) === null || _ctx$previousNode2 === void 0 ? void 0 : _ctx$previousNode2.type) === "paragraph" && previousContent.length === 0 ? EMPTY_PARAGRAPH_MARKDOWN : "";
    }
    return h.renderChildren(content);
  },
  addCommands() {
    return {
      setParagraph: () => ({
        commands
      }) => {
        return commands.setNode(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
//#endregion
//#region src/index.ts
var src_default$2 = Paragraph;

/**
Create a plugin that, when added to a ProseMirror instance,
causes a decoration to show up at the drop position when something
is dragged over the editor.

Nodes may add a `disableDropCursor` property to their spec to
control the showing of a drop cursor inside them. This may be a
boolean or a function, which will be called with a view and a
position, and should return a boolean.
*/
function dropCursor(options = {}) {
  return new Plugin({
    view(editorView) {
      return new DropCursorView(editorView, options);
    }
  });
}
class DropCursorView {
  constructor(editorView, options) {
    var _a;
    this.editorView = editorView;
    this.cursorPos = null;
    this.element = null;
    this.timeout = -1;
    this.lastDragEvent = null;
    this.width = (_a = options.width) !== null && _a !== void 0 ? _a : 1;
    this.color = options.color === false ? undefined : options.color || "black";
    this.class = options.class;
    this.handlers = ["dragover", "dragend", "drop", "dragleave"].map(name => {
      let handler = e => {
        this[name](e);
      };
      editorView.dom.addEventListener(name, handler);
      return {
        name,
        handler
      };
    });
  }
  destroy() {
    this.handlers.forEach(({
      name,
      handler
    }) => this.editorView.dom.removeEventListener(name, handler));
  }
  update(editorView, prevState) {
    if (this.cursorPos != null && prevState.doc != editorView.state.doc) {
      // if we currently have an on-going drag event
      // we need to update the cursor position again and update the overlay
      if (this.lastDragEvent) {
        let target = this.computeTarget(this.lastDragEvent);
        if (target == this.cursorPos) this.updateOverlay();else this.setCursor(target);
      } else {
        this.updateOverlay();
      }
    }
  }
  setCursor(pos) {
    if (pos == this.cursorPos) return;
    this.cursorPos = pos;
    if (pos == null) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    } else {
      this.updateOverlay();
    }
  }
  updateOverlay() {
    let $pos = this.editorView.state.doc.resolve(this.cursorPos);
    let isBlock = !$pos.parent.inlineContent,
      rect;
    let editorDOM = this.editorView.dom,
      editorRect = editorDOM.getBoundingClientRect();
    let scaleX = editorRect.width / editorDOM.offsetWidth,
      scaleY = editorRect.height / editorDOM.offsetHeight;
    if (isBlock) {
      let before = $pos.nodeBefore,
        after = $pos.nodeAfter;
      if (before || after) {
        let node = this.editorView.nodeDOM(this.cursorPos - (before ? before.nodeSize : 0));
        if (node) {
          let nodeRect = node.getBoundingClientRect();
          let top = before ? nodeRect.bottom : nodeRect.top;
          if (before && after) top = (top + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2;
          let halfWidth = this.width / 2 * scaleY;
          rect = {
            left: nodeRect.left,
            right: nodeRect.right,
            top: top - halfWidth,
            bottom: top + halfWidth
          };
        }
      }
    }
    if (!rect) {
      let coords = this.editorView.coordsAtPos(this.cursorPos);
      let halfWidth = this.width / 2 * scaleX;
      rect = {
        left: coords.left - halfWidth,
        right: coords.left + halfWidth,
        top: coords.top,
        bottom: coords.bottom
      };
    }
    let parent = this.editorView.dom.offsetParent;
    if (!this.element) {
      this.element = parent.appendChild(document.createElement("div"));
      if (this.class) this.element.className = this.class;
      this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;";
      if (this.color) {
        this.element.style.backgroundColor = this.color;
      }
    }
    this.element.classList.toggle("prosemirror-dropcursor-block", isBlock);
    this.element.classList.toggle("prosemirror-dropcursor-inline", !isBlock);
    let parentLeft, parentTop;
    if (!parent || parent == document.body && getComputedStyle(parent).position == "static") {
      parentLeft = -pageXOffset;
      parentTop = -pageYOffset;
    } else {
      let rect = parent.getBoundingClientRect();
      let parentScaleX = rect.width / parent.offsetWidth,
        parentScaleY = rect.height / parent.offsetHeight;
      parentLeft = rect.left - parent.scrollLeft * parentScaleX;
      parentTop = rect.top - parent.scrollTop * parentScaleY;
    }
    this.element.style.left = (rect.left - parentLeft) / scaleX + "px";
    this.element.style.top = (rect.top - parentTop) / scaleY + "px";
    this.element.style.width = (rect.right - rect.left) / scaleX + "px";
    this.element.style.height = (rect.bottom - rect.top) / scaleY + "px";
  }
  scheduleRemoval(timeout) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setCursor(null), timeout);
  }
  computeTarget(event) {
    let pos = this.editorView.posAtCoords({
      left: event.clientX,
      top: event.clientY
    });
    let node = pos && pos.inside >= 0 && this.editorView.state.doc.nodeAt(pos.inside);
    let disableDropCursor = node && node.type.spec.disableDropCursor;
    let disabled = typeof disableDropCursor == "function" ? disableDropCursor(this.editorView, pos, event) : disableDropCursor;
    if (!pos || disabled) return null;
    let target = pos.pos;
    if (this.editorView.dragging && this.editorView.dragging.slice) {
      let point = dropPoint(this.editorView.state.doc, target, this.editorView.dragging.slice);
      if (point != null) target = point;
    }
    return target;
  }
  dragover(event) {
    if (!this.editorView.editable) return;
    this.lastDragEvent = event;
    let target = this.computeTarget(event);
    if (target != null) {
      this.setCursor(target);
      this.scheduleRemoval(5000);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(event) {
    if (!this.editorView.dom.contains(event.relatedTarget)) this.setCursor(null);
  }
}

/**
Gap cursor selections are represented using this class. Its
`$anchor` and `$head` properties both point at the cursor position.
*/
class GapCursor extends Selection {
  /**
  Create a gap cursor.
  */
  constructor($pos) {
    super($pos, $pos);
  }
  map(doc, mapping) {
    let $pos = doc.resolve(mapping.map(this.head));
    return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos);
  }
  content() {
    return Slice.empty;
  }
  eq(other) {
    return other instanceof GapCursor && other.head == this.head;
  }
  toJSON() {
    return {
      type: "gapcursor",
      pos: this.head
    };
  }
  /**
  @internal
  */
  static fromJSON(doc, json) {
    if (typeof json.pos != "number") throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new GapCursor(doc.resolve(json.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new GapBookmark(this.anchor);
  }
  /**
  @internal
  */
  static valid($pos) {
    let parent = $pos.parent;
    if (parent.inlineContent || !closedBefore($pos) || !closedAfter($pos)) return false;
    let override = parent.type.spec.allowGapCursor;
    if (override != null) return override;
    let deflt = parent.contentMatchAt($pos.index()).defaultType;
    return deflt && deflt.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom($pos, dir, mustMove = false) {
    search: for (;;) {
      if (!mustMove && GapCursor.valid($pos)) return $pos;
      let pos = $pos.pos,
        next = null;
      // Scan up from this position
      for (let d = $pos.depth;; d--) {
        let parent = $pos.node(d);
        if (dir > 0 ? $pos.indexAfter(d) < parent.childCount : $pos.index(d) > 0) {
          next = parent.child(dir > 0 ? $pos.indexAfter(d) : $pos.index(d) - 1);
          break;
        } else if (d == 0) {
          return null;
        }
        pos += dir;
        let $cur = $pos.doc.resolve(pos);
        if (GapCursor.valid($cur)) return $cur;
      }
      // And then down into the next node
      for (;;) {
        let inside = dir > 0 ? next.firstChild : next.lastChild;
        if (!inside) {
          if (next.isAtom && !next.isText && !NodeSelection.isSelectable(next)) {
            $pos = $pos.doc.resolve(pos + next.nodeSize * dir);
            mustMove = false;
            continue search;
          }
          break;
        }
        next = inside;
        pos += dir;
        let $cur = $pos.doc.resolve(pos);
        if (GapCursor.valid($cur)) return $cur;
      }
      return null;
    }
  }
}
GapCursor.prototype.visible = false;
GapCursor.findFrom = GapCursor.findGapCursorFrom;
Selection.jsonID("gapcursor", GapCursor);
class GapBookmark {
  constructor(pos) {
    this.pos = pos;
  }
  map(mapping) {
    return new GapBookmark(mapping.map(this.pos));
  }
  resolve(doc) {
    let $pos = doc.resolve(this.pos);
    return GapCursor.valid($pos) ? new GapCursor($pos) : Selection.near($pos);
  }
}
function needsGap(type) {
  return type.isAtom || type.spec.isolating || type.spec.createGapCursor;
}
function closedBefore($pos) {
  for (let d = $pos.depth; d >= 0; d--) {
    let index = $pos.index(d),
      parent = $pos.node(d);
    // At the start of this parent, look at next one
    if (index == 0) {
      if (parent.type.spec.isolating) return true;
      continue;
    }
    // See if the node before (or its first ancestor) is closed
    for (let before = parent.child(index - 1);; before = before.lastChild) {
      if (before.childCount == 0 && !before.inlineContent || needsGap(before.type)) return true;
      if (before.inlineContent) return false;
    }
  }
  // Hit start of document
  return true;
}
function closedAfter($pos) {
  for (let d = $pos.depth; d >= 0; d--) {
    let index = $pos.indexAfter(d),
      parent = $pos.node(d);
    if (index == parent.childCount) {
      if (parent.type.spec.isolating) return true;
      continue;
    }
    for (let after = parent.child(index);; after = after.firstChild) {
      if (after.childCount == 0 && !after.inlineContent || needsGap(after.type)) return true;
      if (after.inlineContent) return false;
    }
  }
  return true;
}

/**
Create a gap cursor plugin. When enabled, this will capture clicks
near and arrow-key-motion past places that don't have a normally
selectable position nearby, and create a gap cursor selection for
them. The cursor is drawn as an element with class
`ProseMirror-gapcursor`. You can either include
`style/gapcursor.css` from the package's directory or add your own
styles to make it visible.
*/
function gapCursor() {
  return new Plugin({
    props: {
      decorations: drawGapCursor,
      createSelectionBetween(_view, $anchor, $head) {
        return $anchor.pos == $head.pos && GapCursor.valid($head) ? new GapCursor($head) : null;
      },
      handleClick,
      handleKeyDown,
      handleDOMEvents: {
        beforeinput: beforeinput
      }
    }
  });
}
const handleKeyDown = keydownHandler({
  "ArrowLeft": arrow("horiz", -1),
  "ArrowRight": arrow("horiz", 1),
  "ArrowUp": arrow("vert", -1),
  "ArrowDown": arrow("vert", 1)
});
function arrow(axis, dir) {
  const dirStr = axis == "vert" ? dir > 0 ? "down" : "up" : dir > 0 ? "right" : "left";
  return function (state, dispatch, view) {
    let sel = state.selection;
    let $start = dir > 0 ? sel.$to : sel.$from,
      mustMove = sel.empty;
    if (sel instanceof TextSelection) {
      if (!view.endOfTextblock(dirStr) || $start.depth == 0) return false;
      mustMove = false;
      $start = state.doc.resolve(dir > 0 ? $start.after() : $start.before());
    }
    let $found = GapCursor.findGapCursorFrom($start, dir, mustMove);
    if (!$found) return false;
    if (dispatch) dispatch(state.tr.setSelection(new GapCursor($found)));
    return true;
  };
}
function handleClick(view, pos, event) {
  if (!view || !view.editable) return false;
  let $pos = view.state.doc.resolve(pos);
  if (!GapCursor.valid($pos)) return false;
  let clickPos = view.posAtCoords({
    left: event.clientX,
    top: event.clientY
  });
  if (clickPos && clickPos.inside > -1 && NodeSelection.isSelectable(view.state.doc.nodeAt(clickPos.inside))) return false;
  view.dispatch(view.state.tr.setSelection(new GapCursor($pos)));
  return true;
}
// This is a hack that, when a composition starts while a gap cursor
// is active, quickly creates an inline context for the composition to
// happen in, to avoid it being aborted by the DOM selection being
// moved into a valid position.
function beforeinput(view, event) {
  if (event.inputType != "insertCompositionText" || !(view.state.selection instanceof GapCursor)) return false;
  let {
    $from
  } = view.state.selection;
  let insert = $from.parent.contentMatchAt($from.index()).findWrapping(view.state.schema.nodes.text);
  if (!insert) return false;
  let frag = Fragment.empty;
  for (let i = insert.length - 1; i >= 0; i--) frag = Fragment.from(insert[i].createAndFill(null, frag));
  let tr = view.state.tr.replace($from.pos, $from.pos, new Slice(frag, 0, 0));
  tr.setSelection(TextSelection.near(tr.doc.resolve($from.pos + 1)));
  view.dispatch(tr);
  return false;
}
function drawGapCursor(state) {
  if (!(state.selection instanceof GapCursor)) return null;
  let node = document.createElement("div");
  node.className = "ProseMirror-gapcursor";
  return DecorationSet.create(state.doc, [Decoration.widget(state.selection.head, node, {
    key: "gapcursor"
  })]);
}

var GOOD_LEAF_SIZE = 200;

// :: class<T> A rope sequence is a persistent sequence data structure
// that supports appending, prepending, and slicing without doing a
// full copy. It is represented as a mostly-balanced tree.
var RopeSequence = function RopeSequence() {};
RopeSequence.prototype.append = function append(other) {
  if (!other.length) {
    return this;
  }
  other = RopeSequence.from(other);
  return !this.length && other || other.length < GOOD_LEAF_SIZE && this.leafAppend(other) || this.length < GOOD_LEAF_SIZE && other.leafPrepend(this) || this.appendInner(other);
};

// :: (union<[T], RopeSequence<T>>) → RopeSequence<T>
// Prepend an array or other rope to this one, returning a new rope.
RopeSequence.prototype.prepend = function prepend(other) {
  if (!other.length) {
    return this;
  }
  return RopeSequence.from(other).append(this);
};
RopeSequence.prototype.appendInner = function appendInner(other) {
  return new Append(this, other);
};

// :: (?number, ?number) → RopeSequence<T>
// Create a rope repesenting a sub-sequence of this rope.
RopeSequence.prototype.slice = function slice(from, to) {
  if (from === void 0) from = 0;
  if (to === void 0) to = this.length;
  if (from >= to) {
    return RopeSequence.empty;
  }
  return this.sliceInner(Math.max(0, from), Math.min(this.length, to));
};

// :: (number) → T
// Retrieve the element at the given position from this rope.
RopeSequence.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) {
    return undefined;
  }
  return this.getInner(i);
};

// :: ((element: T, index: number) → ?bool, ?number, ?number)
// Call the given function for each element between the given
// indices. This tends to be more efficient than looping over the
// indices and calling `get`, because it doesn't have to descend the
// tree for every element.
RopeSequence.prototype.forEach = function forEach(f, from, to) {
  if (from === void 0) from = 0;
  if (to === void 0) to = this.length;
  if (from <= to) {
    this.forEachInner(f, from, to, 0);
  } else {
    this.forEachInvertedInner(f, from, to, 0);
  }
};

// :: ((element: T, index: number) → U, ?number, ?number) → [U]
// Map the given functions over the elements of the rope, producing
// a flat array.
RopeSequence.prototype.map = function map(f, from, to) {
  if (from === void 0) from = 0;
  if (to === void 0) to = this.length;
  var result = [];
  this.forEach(function (elt, i) {
    return result.push(f(elt, i));
  }, from, to);
  return result;
};

// :: (?union<[T], RopeSequence<T>>) → RopeSequence<T>
// Create a rope representing the given array, or return the rope
// itself if a rope was given.
RopeSequence.from = function from(values) {
  if (values instanceof RopeSequence) {
    return values;
  }
  return values && values.length ? new Leaf(values) : RopeSequence.empty;
};
var Leaf = /*@__PURE__*/function (RopeSequence) {
  function Leaf(values) {
    RopeSequence.call(this);
    this.values = values;
  }
  if (RopeSequence) Leaf.__proto__ = RopeSequence;
  Leaf.prototype = Object.create(RopeSequence && RopeSequence.prototype);
  Leaf.prototype.constructor = Leaf;
  var prototypeAccessors = {
    length: {
      configurable: true
    },
    depth: {
      configurable: true
    }
  };
  Leaf.prototype.flatten = function flatten() {
    return this.values;
  };
  Leaf.prototype.sliceInner = function sliceInner(from, to) {
    if (from == 0 && to == this.length) {
      return this;
    }
    return new Leaf(this.values.slice(from, to));
  };
  Leaf.prototype.getInner = function getInner(i) {
    return this.values[i];
  };
  Leaf.prototype.forEachInner = function forEachInner(f, from, to, start) {
    for (var i = from; i < to; i++) {
      if (f(this.values[i], start + i) === false) {
        return false;
      }
    }
  };
  Leaf.prototype.forEachInvertedInner = function forEachInvertedInner(f, from, to, start) {
    for (var i = from - 1; i >= to; i--) {
      if (f(this.values[i], start + i) === false) {
        return false;
      }
    }
  };
  Leaf.prototype.leafAppend = function leafAppend(other) {
    if (this.length + other.length <= GOOD_LEAF_SIZE) {
      return new Leaf(this.values.concat(other.flatten()));
    }
  };
  Leaf.prototype.leafPrepend = function leafPrepend(other) {
    if (this.length + other.length <= GOOD_LEAF_SIZE) {
      return new Leaf(other.flatten().concat(this.values));
    }
  };
  prototypeAccessors.length.get = function () {
    return this.values.length;
  };
  prototypeAccessors.depth.get = function () {
    return 0;
  };
  Object.defineProperties(Leaf.prototype, prototypeAccessors);
  return Leaf;
}(RopeSequence);

// :: RopeSequence
// The empty rope sequence.
RopeSequence.empty = new Leaf([]);
var Append = /*@__PURE__*/function (RopeSequence) {
  function Append(left, right) {
    RopeSequence.call(this);
    this.left = left;
    this.right = right;
    this.length = left.length + right.length;
    this.depth = Math.max(left.depth, right.depth) + 1;
  }
  if (RopeSequence) Append.__proto__ = RopeSequence;
  Append.prototype = Object.create(RopeSequence && RopeSequence.prototype);
  Append.prototype.constructor = Append;
  Append.prototype.flatten = function flatten() {
    return this.left.flatten().concat(this.right.flatten());
  };
  Append.prototype.getInner = function getInner(i) {
    return i < this.left.length ? this.left.get(i) : this.right.get(i - this.left.length);
  };
  Append.prototype.forEachInner = function forEachInner(f, from, to, start) {
    var leftLen = this.left.length;
    if (from < leftLen && this.left.forEachInner(f, from, Math.min(to, leftLen), start) === false) {
      return false;
    }
    if (to > leftLen && this.right.forEachInner(f, Math.max(from - leftLen, 0), Math.min(this.length, to) - leftLen, start + leftLen) === false) {
      return false;
    }
  };
  Append.prototype.forEachInvertedInner = function forEachInvertedInner(f, from, to, start) {
    var leftLen = this.left.length;
    if (from > leftLen && this.right.forEachInvertedInner(f, from - leftLen, Math.max(to, leftLen) - leftLen, start + leftLen) === false) {
      return false;
    }
    if (to < leftLen && this.left.forEachInvertedInner(f, Math.min(from, leftLen), to, start) === false) {
      return false;
    }
  };
  Append.prototype.sliceInner = function sliceInner(from, to) {
    if (from == 0 && to == this.length) {
      return this;
    }
    var leftLen = this.left.length;
    if (to <= leftLen) {
      return this.left.slice(from, to);
    }
    if (from >= leftLen) {
      return this.right.slice(from - leftLen, to - leftLen);
    }
    return this.left.slice(from, leftLen).append(this.right.slice(0, to - leftLen));
  };
  Append.prototype.leafAppend = function leafAppend(other) {
    var inner = this.right.leafAppend(other);
    if (inner) {
      return new Append(this.left, inner);
    }
  };
  Append.prototype.leafPrepend = function leafPrepend(other) {
    var inner = this.left.leafPrepend(other);
    if (inner) {
      return new Append(inner, this.right);
    }
  };
  Append.prototype.appendInner = function appendInner(other) {
    if (this.left.depth >= Math.max(this.right.depth, other.depth) + 1) {
      return new Append(this.left, new Append(this.right, other));
    }
    return new Append(this, other);
  };
  return Append;
}(RopeSequence);

// ProseMirror's history isn't simply a way to roll back to a previous
// state, because ProseMirror supports applying changes without adding
// them to the history (for example during collaboration).
//
// To this end, each 'Branch' (one for the undo history and one for
// the redo history) keeps an array of 'Items', which can optionally
// hold a step (an actual undoable change), and always hold a position
// map (which is needed to move changes below them to apply to the
// current document).
//
// An item that has both a step and a selection bookmark is the start
// of an 'event' — a group of changes that will be undone or redone at
// once. (It stores only the bookmark, since that way we don't have to
// provide a document until the selection is actually applied, which
// is useful when compressing.)
// Used to schedule history compression
const max_empty_items = 500;
class Branch {
  constructor(items, eventCount) {
    this.items = items;
    this.eventCount = eventCount;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(state, preserveItems) {
    if (this.eventCount == 0) return null;
    let end = this.items.length;
    for (;; end--) {
      let next = this.items.get(end - 1);
      if (next.selection) {
        --end;
        break;
      }
    }
    let remap, mapFrom;
    if (preserveItems) {
      remap = this.remapping(end, this.items.length);
      mapFrom = remap.maps.length;
    }
    let transform = state.tr;
    let selection, remaining;
    let addAfter = [],
      addBefore = [];
    this.items.forEach((item, i) => {
      if (!item.step) {
        if (!remap) {
          remap = this.remapping(end, i + 1);
          mapFrom = remap.maps.length;
        }
        mapFrom--;
        addBefore.push(item);
        return;
      }
      if (remap) {
        addBefore.push(new Item(item.map));
        let step = item.step.map(remap.slice(mapFrom)),
          map;
        if (step && transform.maybeStep(step).doc) {
          map = transform.mapping.maps[transform.mapping.maps.length - 1];
          addAfter.push(new Item(map, undefined, undefined, addAfter.length + addBefore.length));
        }
        mapFrom--;
        if (map) remap.appendMap(map, mapFrom);
      } else {
        transform.maybeStep(item.step);
      }
      if (item.selection) {
        selection = remap ? item.selection.map(remap.slice(mapFrom)) : item.selection;
        remaining = new Branch(this.items.slice(0, end).append(addBefore.reverse().concat(addAfter)), this.eventCount - 1);
        return false;
      }
    }, this.items.length, 0);
    return {
      remaining: remaining,
      transform,
      selection: selection
    };
  }
  // Create a new branch with the given transform added.
  addTransform(transform, selection, histOptions, preserveItems) {
    let newItems = [],
      eventCount = this.eventCount;
    let oldItems = this.items,
      lastItem = !preserveItems && oldItems.length ? oldItems.get(oldItems.length - 1) : null;
    for (let i = 0; i < transform.steps.length; i++) {
      let step = transform.steps[i].invert(transform.docs[i]);
      let item = new Item(transform.mapping.maps[i], step, selection),
        merged;
      if (merged = lastItem && lastItem.merge(item)) {
        item = merged;
        if (i) newItems.pop();else oldItems = oldItems.slice(0, oldItems.length - 1);
      }
      newItems.push(item);
      if (selection) {
        eventCount++;
        selection = undefined;
      }
      if (!preserveItems) lastItem = item;
    }
    let overflow = eventCount - histOptions.depth;
    if (overflow > DEPTH_OVERFLOW) {
      oldItems = cutOffEvents(oldItems, overflow);
      eventCount -= overflow;
    }
    return new Branch(oldItems.append(newItems), eventCount);
  }
  remapping(from, to) {
    let maps = new Mapping();
    this.items.forEach((item, i) => {
      let mirrorPos = item.mirrorOffset != null && i - item.mirrorOffset >= from ? maps.maps.length - item.mirrorOffset : undefined;
      maps.appendMap(item.map, mirrorPos);
    }, from, to);
    return maps;
  }
  addMaps(array) {
    if (this.eventCount == 0) return this;
    return new Branch(this.items.append(array.map(map => new Item(map))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(rebasedTransform, rebasedCount) {
    if (!this.eventCount) return this;
    let rebasedItems = [],
      start = Math.max(0, this.items.length - rebasedCount);
    let mapping = rebasedTransform.mapping;
    let newUntil = rebasedTransform.steps.length;
    let eventCount = this.eventCount;
    this.items.forEach(item => {
      if (item.selection) eventCount--;
    }, start);
    let iRebased = rebasedCount;
    this.items.forEach(item => {
      let pos = mapping.getMirror(--iRebased);
      if (pos == null) return;
      newUntil = Math.min(newUntil, pos);
      let map = mapping.maps[pos];
      if (item.step) {
        let step = rebasedTransform.steps[pos].invert(rebasedTransform.docs[pos]);
        let selection = item.selection && item.selection.map(mapping.slice(iRebased + 1, pos));
        if (selection) eventCount++;
        rebasedItems.push(new Item(map, step, selection));
      } else {
        rebasedItems.push(new Item(map));
      }
    }, start);
    let newMaps = [];
    for (let i = rebasedCount; i < newUntil; i++) newMaps.push(new Item(mapping.maps[i]));
    let items = this.items.slice(0, start).append(newMaps).append(rebasedItems);
    let branch = new Branch(items, eventCount);
    if (branch.emptyItemCount() > max_empty_items) branch = branch.compress(this.items.length - rebasedItems.length);
    return branch;
  }
  emptyItemCount() {
    let count = 0;
    this.items.forEach(item => {
      if (!item.step) count++;
    });
    return count;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(upto = this.items.length) {
    let remap = this.remapping(0, upto),
      mapFrom = remap.maps.length;
    let items = [],
      events = 0;
    this.items.forEach((item, i) => {
      if (i >= upto) {
        items.push(item);
        if (item.selection) events++;
      } else if (item.step) {
        let step = item.step.map(remap.slice(mapFrom)),
          map = step && step.getMap();
        mapFrom--;
        if (map) remap.appendMap(map, mapFrom);
        if (step) {
          let selection = item.selection && item.selection.map(remap.slice(mapFrom));
          if (selection) events++;
          let newItem = new Item(map.invert(), step, selection),
            merged,
            last = items.length - 1;
          if (merged = items.length && items[last].merge(newItem)) items[last] = merged;else items.push(newItem);
        }
      } else if (item.map) {
        mapFrom--;
      }
    }, this.items.length, 0);
    return new Branch(RopeSequence.from(items.reverse()), events);
  }
}
Branch.empty = new Branch(RopeSequence.empty, 0);
function cutOffEvents(items, n) {
  let cutPoint;
  items.forEach((item, i) => {
    if (item.selection && n-- == 0) {
      cutPoint = i;
      return false;
    }
  });
  return items.slice(cutPoint);
}
class Item {
  constructor(
  // The (forward) step map for this item.
  map,
  // The inverted step
  step,
  // If this is non-null, this item is the start of a group, and
  // this selection is the starting selection for the group (the one
  // that was active before the first step was applied)
  selection,
  // If this item is the inverse of a previous mapping on the stack,
  // this points at the inverse's offset
  mirrorOffset) {
    this.map = map;
    this.step = step;
    this.selection = selection;
    this.mirrorOffset = mirrorOffset;
  }
  merge(other) {
    if (this.step && other.step && !other.selection) {
      let step = other.step.merge(this.step);
      if (step) return new Item(step.getMap().invert(), step, this.selection);
    }
  }
}
// The value of the state field that tracks undo/redo history for that
// state. Will be stored in the plugin state when the history plugin
// is active.
class HistoryState {
  constructor(done, undone, prevRanges, prevTime, prevComposition) {
    this.done = done;
    this.undone = undone;
    this.prevRanges = prevRanges;
    this.prevTime = prevTime;
    this.prevComposition = prevComposition;
  }
}
const DEPTH_OVERFLOW = 20;
// Record a transformation in undo history.
function applyTransaction(history, state, tr, options) {
  let historyTr = tr.getMeta(historyKey),
    rebased;
  if (historyTr) return historyTr.historyState;
  if (tr.getMeta(closeHistoryKey)) history = new HistoryState(history.done, history.undone, null, 0, -1);
  let appended = tr.getMeta("appendedTransaction");
  if (tr.steps.length == 0) {
    return history;
  } else if (appended && appended.getMeta(historyKey)) {
    if (appended.getMeta(historyKey).redo) return new HistoryState(history.done.addTransform(tr, undefined, options, mustPreserveItems(state)), history.undone, rangesFor(tr.mapping.maps), history.prevTime, history.prevComposition);else return new HistoryState(history.done, history.undone.addTransform(tr, undefined, options, mustPreserveItems(state)), null, history.prevTime, history.prevComposition);
  } else if (tr.getMeta("addToHistory") !== false && !(appended && appended.getMeta("addToHistory") === false)) {
    // Group transforms that occur in quick succession into one event.
    let composition = tr.getMeta("composition");
    let newGroup = history.prevTime == 0 || !appended && history.prevComposition != composition && (history.prevTime < (tr.time || 0) - options.newGroupDelay || !isAdjacentTo(tr, history.prevRanges));
    let prevRanges = appended ? mapRanges(history.prevRanges, tr.mapping) : rangesFor(tr.mapping.maps);
    return new HistoryState(history.done.addTransform(tr, newGroup ? state.selection.getBookmark() : undefined, options, mustPreserveItems(state)), Branch.empty, prevRanges, tr.time, composition == null ? history.prevComposition : composition);
  } else if (rebased = tr.getMeta("rebased")) {
    // Used by the collab module to tell the history that some of its
    // content has been rebased.
    return new HistoryState(history.done.rebased(tr, rebased), history.undone.rebased(tr, rebased), mapRanges(history.prevRanges, tr.mapping), history.prevTime, history.prevComposition);
  } else {
    return new HistoryState(history.done.addMaps(tr.mapping.maps), history.undone.addMaps(tr.mapping.maps), mapRanges(history.prevRanges, tr.mapping), history.prevTime, history.prevComposition);
  }
}
function isAdjacentTo(transform, prevRanges) {
  if (!prevRanges) return false;
  if (!transform.docChanged) return true;
  let adjacent = false;
  transform.mapping.maps[0].forEach((start, end) => {
    for (let i = 0; i < prevRanges.length; i += 2) if (start <= prevRanges[i + 1] && end >= prevRanges[i]) adjacent = true;
  });
  return adjacent;
}
function rangesFor(maps) {
  let result = [];
  for (let i = maps.length - 1; i >= 0 && result.length == 0; i--) maps[i].forEach((_from, _to, from, to) => result.push(from, to));
  return result;
}
function mapRanges(ranges, mapping) {
  if (!ranges) return null;
  let result = [];
  for (let i = 0; i < ranges.length; i += 2) {
    let from = mapping.map(ranges[i], 1),
      to = mapping.map(ranges[i + 1], -1);
    if (from <= to) result.push(from, to);
  }
  return result;
}
// Apply the latest event from one branch to the document and shift the event
// onto the other branch.
function histTransaction(history, state, redo) {
  let preserveItems = mustPreserveItems(state);
  let histOptions = historyKey.get(state).spec.config;
  let pop = (redo ? history.undone : history.done).popEvent(state, preserveItems);
  if (!pop) return null;
  let selection = pop.selection.resolve(pop.transform.doc);
  let added = (redo ? history.done : history.undone).addTransform(pop.transform, state.selection.getBookmark(), histOptions, preserveItems);
  let newHist = new HistoryState(redo ? added : pop.remaining, redo ? pop.remaining : added, null, 0, -1);
  return pop.transform.setSelection(selection).setMeta(historyKey, {
    redo,
    historyState: newHist
  });
}
let cachedPreserveItems = false,
  cachedPreserveItemsPlugins = null;
// Check whether any plugin in the given state has a
// `historyPreserveItems` property in its spec, in which case we must
// preserve steps exactly as they came in, so that they can be
// rebased.
function mustPreserveItems(state) {
  let plugins = state.plugins;
  if (cachedPreserveItemsPlugins != plugins) {
    cachedPreserveItems = false;
    cachedPreserveItemsPlugins = plugins;
    for (let i = 0; i < plugins.length; i++) if (plugins[i].spec.historyPreserveItems) {
      cachedPreserveItems = true;
      break;
    }
  }
  return cachedPreserveItems;
}
const historyKey = new PluginKey("history");
const closeHistoryKey = new PluginKey("closeHistory");
/**
Returns a plugin that enables the undo history for an editor. The
plugin will track undo and redo stacks, which can be used with the
[`undo`](https://prosemirror.net/docs/ref/#history.undo) and [`redo`](https://prosemirror.net/docs/ref/#history.redo) commands.

You can set an `"addToHistory"` [metadata
property](https://prosemirror.net/docs/ref/#state.Transaction.setMeta) of `false` on a transaction
to prevent it from being rolled back by undo.
*/
function history(config = {}) {
  config = {
    depth: config.depth || 100,
    newGroupDelay: config.newGroupDelay || 500
  };
  return new Plugin({
    key: historyKey,
    state: {
      init() {
        return new HistoryState(Branch.empty, Branch.empty, null, 0, -1);
      },
      apply(tr, hist, state) {
        return applyTransaction(hist, state, tr, config);
      }
    },
    config,
    props: {
      handleDOMEvents: {
        beforeinput(view, e) {
          let inputType = e.inputType;
          let command = inputType == "historyUndo" ? undo : inputType == "historyRedo" ? redo : null;
          if (!command || !view.editable) return false;
          e.preventDefault();
          return command(view.state, view.dispatch);
        }
      }
    }
  });
}
function buildCommand(redo, scroll) {
  return (state, dispatch) => {
    let hist = historyKey.getState(state);
    if (!hist || (redo ? hist.undone : hist.done).eventCount == 0) return false;
    if (dispatch) {
      let tr = histTransaction(hist, state, redo);
      if (tr) dispatch(scroll ? tr.scrollIntoView() : tr);
    }
    return true;
  };
}
/**
A command function that undoes the last change, if any.
*/
const undo = buildCommand(false, true);
/**
A command function that redoes the last undone change, if any.
*/
const redo = buildCommand(true, true);

//#region src/character-count/character-count.ts
/**
* This extension allows you to count the characters and words of your document.
* @see https://tiptap.dev/api/extensions/character-count
*/
Extension.create({
  name: "characterCount",
  addOptions() {
    return {
      limit: null,
      autoTrim: true,
      mode: "textSize",
      textCounter: text => text.length,
      wordCounter: text => text.split(" ").filter(word => word !== "").length
    };
  },
  addStorage() {
    return {
      characters: () => 0,
      words: () => 0
    };
  },
  onBeforeCreate() {
    this.storage.characters = options => {
      const node = (options === null || options === void 0 ? void 0 : options.node) || this.editor.state.doc;
      if (((options === null || options === void 0 ? void 0 : options.mode) || this.options.mode) === "textSize") {
        const text = node.textBetween(0, node.content.size, void 0, " ");
        return this.options.textCounter(text);
      }
      return node.nodeSize;
    };
    this.storage.words = options => {
      const node = (options === null || options === void 0 ? void 0 : options.node) || this.editor.state.doc;
      const text = node.textBetween(0, node.content.size, " ", " ");
      return this.options.wordCounter(text);
    };
  },
  addProseMirrorPlugins() {
    let initialEvaluationDone = false;
    return [new Plugin({
      key: new PluginKey("characterCount"),
      appendTransaction: (transactions, oldState, newState) => {
        if (initialEvaluationDone) return;
        const limit = this.options.limit;
        const autoTrim = this.options.autoTrim;
        if (limit === null || limit === void 0 || limit === 0 || autoTrim === false) {
          initialEvaluationDone = true;
          return;
        }
        const initialContentSize = this.storage.characters({
          node: newState.doc
        });
        if (initialContentSize > limit) {
          const over = initialContentSize - limit;
          const from = 0;
          const to = over;
          console.warn(`[CharacterCount] Initial content exceeded limit of ${limit} characters. Content was automatically trimmed.`);
          const tr = newState.tr.deleteRange(from, to);
          initialEvaluationDone = true;
          return tr;
        }
        initialEvaluationDone = true;
      },
      filterTransaction: (transaction, state) => {
        const limit = this.options.limit;
        if (!transaction.docChanged || limit === 0 || limit === null || limit === void 0) return true;
        const oldSize = this.storage.characters({
          node: state.doc
        });
        const newSize = this.storage.characters({
          node: transaction.doc
        });
        if (newSize <= limit) return true;
        if (oldSize > limit && newSize > limit && newSize <= oldSize) return true;
        if (oldSize > limit && newSize > limit && newSize > oldSize) return false;
        if (!transaction.getMeta("paste")) return false;
        const pos = transaction.selection.$head.pos;
        const from = pos - (newSize - limit);
        const to = pos;
        transaction.deleteRange(from, to);
        if (this.storage.characters({
          node: transaction.doc
        }) > limit) return false;
        return true;
      }
    })];
  }
});
//#endregion
//#region src/drop-cursor/drop-cursor.ts
/**
* This extension allows you to add a drop cursor to your editor.
* A drop cursor is a line that appears when you drag and drop content
* in-between nodes.
* @see https://tiptap.dev/api/extensions/dropcursor
*/
Extension.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [dropCursor(this.options)];
  }
});
//#endregion
//#region src/focus/focus.ts
/**
* This extension allows you to add a class to the focused node.
* @see https://www.tiptap.dev/api/extensions/focus
*/
Extension.create({
  name: "focus",
  addOptions() {
    return {
      className: "has-focus",
      mode: "all"
    };
  },
  addProseMirrorPlugins() {
    return [new Plugin({
      key: new PluginKey("focus"),
      props: {
        decorations: ({
          doc,
          selection
        }) => {
          const {
            isEditable,
            isFocused
          } = this.editor;
          const {
            anchor
          } = selection;
          const decorations = [];
          if (!isEditable || !isFocused) return DecorationSet.create(doc, []);
          let maxLevels = 0;
          if (this.options.mode === "deepest") doc.descendants((node, pos) => {
            if (node.isText) return;
            if (!(anchor >= pos && anchor <= pos + node.nodeSize - 1)) return false;
            maxLevels += 1;
          });
          let currentLevel = 0;
          doc.descendants((node, pos) => {
            if (node.isText) return false;
            if (!(anchor >= pos && anchor <= pos + node.nodeSize - 1)) return false;
            currentLevel += 1;
            if (this.options.mode === "deepest" && maxLevels - currentLevel > 0 || this.options.mode === "shallowest" && currentLevel > 1) return this.options.mode === "deepest";
            decorations.push(Decoration.node(pos, pos + node.nodeSize, {
              class: this.options.className
            }));
          });
          return DecorationSet.create(doc, decorations);
        }
      }
    })];
  }
});
//#endregion
//#region src/gap-cursor/gap-cursor.ts
/**
* This extension allows you to add a gap cursor to your editor.
* A gap cursor is a cursor that appears when you click on a place
* where no content is present, for example inbetween nodes.
* @see https://tiptap.dev/api/extensions/gapcursor
*/
Extension.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [gapCursor()];
  },
  extendNodeSchema(extension) {
    var _callOrReturn;
    const context = {
      name: extension.name,
      options: extension.options,
      storage: extension.storage
    };
    return {
      allowGapCursor: (_callOrReturn = callOrReturn(getExtensionField(extension, "allowGapCursor", context))) !== null && _callOrReturn !== void 0 ? _callOrReturn : null
    };
  }
});
//#endregion
//#region src/placeholder/constants.ts
/** The default data attribute label */
const DEFAULT_DATA_ATTRIBUTE = "placeholder";
/** The plugin key used to store and read the placeholder decoration set */
const PLUGIN_KEY = new PluginKey("tiptap__placeholder");
//#endregion
//#region src/placeholder/utils/createPlaceholderDecoration.ts
/**
* Creates a ProseMirror node decoration that applies a placeholder
* CSS class and data attribute to an empty node.
* @param options.editor - The editor instance
* @param options.pos - The position of the node in the document
* @param options.node - The ProseMirror node
* @param options.isEmptyDoc - Whether the entire document is empty
* @param options.hasAnchor - Whether the selection anchor is within the node
* @param options.dataAttribute - The data attribute name (e.g. `data-placeholder`)
* @param options.classes - CSS classes for empty nodes and the empty editor
* @param options.placeholder - The placeholder text or a function that returns it
* @returns A ProseMirror node decoration with placeholder classes and data attribute
*/
function createPlaceholderDecoration(options) {
  const {
    editor,
    placeholder,
    dataAttribute,
    pos,
    node,
    isEmptyDoc,
    hasAnchor,
    classes: {
      emptyNode,
      emptyEditor
    }
  } = options;
  const classes = [emptyNode];
  if (isEmptyDoc) classes.push(emptyEditor);
  return Decoration.node(pos, pos + node.nodeSize, {
    class: classes.join(" "),
    [dataAttribute]: typeof placeholder === "function" ? placeholder({
      editor,
      node,
      pos,
      hasAnchor
    }) : placeholder
  });
}
//#endregion
//#region src/placeholder/utils/buildPlaceholderDecorations.ts
function resolveEmptyNodeClass(emptyNodeClass, props) {
  return typeof emptyNodeClass === "function" ? emptyNodeClass(props) : emptyNodeClass;
}
/**
* Scans a document range for empty textblocks that should receive placeholder
* decorations. Used by the slow path and incremental state updates.
*/
function scanRangeForDecorations({
  editor,
  options,
  dataAttribute,
  doc,
  selection,
  from,
  to
}) {
  const {
    anchor
  } = selection;
  const decorations = [];
  const isEmptyDoc = editor.isEmpty;
  doc.nodesBetween(from, to, (node, pos) => {
    const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize;
    const isEmpty = !node.isLeaf && isNodeEmpty(node);
    if (!node.type.isTextblock) return options.includeChildren;
    if ((hasAnchor || !options.showOnlyCurrent) && isEmpty) decorations.push(createPlaceholderDecoration({
      editor,
      isEmptyDoc,
      dataAttribute,
      hasAnchor,
      placeholder: options.placeholder,
      classes: {
        emptyEditor: options.emptyEditorClass,
        emptyNode: resolveEmptyNodeClass(options.emptyNodeClass, {
          editor,
          node,
          pos,
          hasAnchor
        })
      },
      node,
      pos
    }));
    return options.includeChildren;
  });
  return decorations;
}
/**
* Builds the placeholder decorations for the current document state.
* @param options.editor - The editor instance.
* @param options.options - The resolved placeholder options.
* @param options.dataAttribute - The prepared `data-*` attribute name.
* @param options.doc - The current document node.
* @param options.selection - The current selection.
* @returns A decoration set, or `null` when no placeholders should be shown.
*/
function buildPlaceholderDecorations({
  editor,
  options,
  dataAttribute,
  doc,
  selection
}) {
  if (!(editor.isEditable || !options.showOnlyWhenEditable)) return null;
  const {
    anchor
  } = selection;
  const decorations = [];
  const isEmptyDoc = editor.isEmpty;
  if (options.showOnlyCurrent && !options.includeChildren) {
    const resolved = doc.resolve(anchor);
    const node = resolved.depth > 0 ? resolved.node(1) : resolved.nodeAfter;
    const nodeStart = resolved.depth > 0 ? resolved.before(1) : anchor;
    if (node && node.type.isTextblock && isNodeEmpty(node)) {
      const hasAnchor = anchor >= nodeStart && anchor <= nodeStart + node.nodeSize;
      decorations.push(createPlaceholderDecoration({
        editor,
        isEmptyDoc,
        dataAttribute,
        hasAnchor,
        placeholder: options.placeholder,
        classes: {
          emptyEditor: options.emptyEditorClass,
          emptyNode: resolveEmptyNodeClass(options.emptyNodeClass, {
            editor,
            node,
            pos: nodeStart,
            hasAnchor
          })
        },
        node,
        pos: nodeStart
      }));
    }
  } else decorations.push(...scanRangeForDecorations({
    editor,
    options,
    dataAttribute,
    doc,
    selection,
    from: 0,
    to: doc.content.size
  }));
  return DecorationSet.create(doc, decorations);
}
//#endregion
//#region src/placeholder/utils/resolveTopLevelRange.ts
/**
* Resolves a document position to the `[from, to)` range of its containing
* top-level block node in absolute document positions.
*/
function resolveTopLevelRange(doc, pos) {
  const resolved = doc.resolve(pos);
  if (resolved.depth === 0) {
    var _resolved$nodeAfter;
    const node = (_resolved$nodeAfter = resolved.nodeAfter) !== null && _resolved$nodeAfter !== void 0 ? _resolved$nodeAfter : resolved.nodeBefore;
    if (!node) return {
      from: pos,
      to: pos
    };
    const nodePos = resolved.nodeAfter ? pos : pos - node.nodeSize;
    return {
      from: nodePos,
      to: nodePos + node.nodeSize
    };
  }
  const topLevelPos = resolved.before(1);
  return {
    from: topLevelPos,
    to: topLevelPos + resolved.node(1).nodeSize
  };
}
/**
* Converts an absolute document range to content-relative positions used by
* `Node#nodesBetween` and `Node#forEach` offsets.
*/
function toContentRelativeRange(doc, range) {
  return {
    from: Math.max(0, range.from - 1),
    to: Math.min(doc.content.size, range.to - 1)
  };
}
/**
* Returns the top-level block ranges that intersect a document change range.
* Input `from`/`to` are absolute positions (e.g. from `getChangedRanges`).
* Returned ranges are content-relative, matching `Node#forEach` offsets.
*/
function getTopLevelBlocksInRange(doc, from, to) {
  const ranges = [];
  doc.forEach((node, offset) => {
    const nodeStart = offset;
    const nodeEnd = nodeStart + node.nodeSize;
    const absNodeStart = nodeStart + 1;
    const absNodeEnd = nodeEnd + 1;
    if (absNodeStart < to && absNodeEnd > from) ranges.push({
      from: nodeStart,
      to: nodeEnd
    });
  });
  return ranges;
}
/**
* Sorts ranges by start position and merges overlapping or adjacent ranges.
*/
function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  const sorted = [...ranges].sort((a, b) => a.from - b.from);
  const merged = [{
    ...sorted[0]
  }];
  for (let i = 1; i < sorted.length; i += 1) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (current.from <= last.to) last.to = Math.max(last.to, current.to);else merged.push({
      ...current
    });
  }
  return merged;
}
//#endregion
//#region src/placeholder/utils/placeholderStateField.ts
/**
* Expands a single changed range to the top-level blocks it touches.
* Also resolves blocks at range boundaries so split/merge edits update
* adjacent empty nodes (e.g. a new paragraph after Enter).
*/
function collectBlocksForChange(doc, change) {
  const ranges = getTopLevelBlocksInRange(doc, change.from, change.to);
  ranges.push(toContentRelativeRange(doc, resolveTopLevelRange(doc, change.from)));
  if (change.to > change.from) ranges.push(toContentRelativeRange(doc, resolveTopLevelRange(doc, Math.min(change.to, doc.content.size + 1) - 1)));else if (change.from < doc.content.size + 1) ranges.push(toContentRelativeRange(doc, resolveTopLevelRange(doc, Math.min(change.from + 1, doc.content.size))));
  return ranges;
}
/**
* Collects content-relative top-level block ranges that need placeholder
* decorations recomputed after a transaction.
*/
function collectRescanRanges(tr, oldState, newState) {
  const ranges = [];
  if (tr.docChanged) {
    const changes = getChangedRanges(tr);
    for (const change of changes) ranges.push(...collectBlocksForChange(newState.doc, change.newRange));
  }
  if (tr.selectionSet) {
    ranges.push(toContentRelativeRange(newState.doc, resolveTopLevelRange(newState.doc, tr.mapping.map(oldState.selection.anchor))));
    ranges.push(toContentRelativeRange(newState.doc, resolveTopLevelRange(newState.doc, newState.selection.anchor)));
  }
  return mergeRanges(ranges);
}
/** Clamps a content-relative range to `[0, doc.content.size]`. */
function clampRange(from, to, doc) {
  const clampedFrom = Math.max(0, Math.min(from, doc.content.size));
  return {
    from: clampedFrom,
    to: Math.max(clampedFrom, Math.min(to, doc.content.size))
  };
}
/**
* Removes and rebuilds placeholder decorations within the given ranges.
* Only drops decorations fully contained in a range so mapped decorations
* on neighbouring blocks (e.g. at a block boundary) are kept intact.
*/
function updateDecorationsInRanges({
  decorations,
  ranges,
  editor,
  options,
  dataAttribute,
  doc,
  selection
}) {
  let next = decorations;
  for (const range of ranges) {
    const {
      from,
      to
    } = clampRange(range.from, range.to, doc);
    const existing = next.find(from, to).filter(decoration => decoration.from >= from && decoration.to <= to);
    if (existing.length) next = next.remove(existing);
    const newDecos = scanRangeForDecorations({
      editor,
      options,
      dataAttribute,
      doc,
      selection,
      from,
      to
    });
    if (newDecos.length) next = next.add(doc, newDecos);
  }
  return next;
}
/**
* Creates the incremental `StateField<DecorationSet>` used by the slow path
* (`showOnlyCurrent: false` or `includeChildren: true`).
*
* Decorations are mapped through each transaction and only recomputed for
* top-level blocks touched by document or selection changes.
* @param options.editor - The editor instance.
* @param options.options - The resolved placeholder options.
* @param options.dataAttribute - The prepared `data-*` attribute name.
* @returns A ProseMirror state field storing the placeholder decoration set.
*/
function createPlaceholderStateField({
  editor,
  options,
  dataAttribute
}) {
  return {
    init(_config, state) {
      const decorations = buildPlaceholderDecorations({
        editor,
        options,
        dataAttribute,
        doc: state.doc,
        selection: state.selection
      });
      return decorations !== null && decorations !== void 0 ? decorations : DecorationSet.empty;
    },
    apply(tr, prev, oldState, newState) {
      if (!tr.docChanged && !tr.selectionSet) return prev;
      return updateDecorationsInRanges({
        decorations: prev.map(tr.mapping, tr.doc),
        ranges: collectRescanRanges(tr, oldState, newState),
        editor,
        options,
        dataAttribute,
        doc: newState.doc,
        selection: newState.selection
      });
    }
  };
}
//#endregion
//#region src/placeholder/utils/preparePlaceholderAttribute.ts
/**
* Prepares the placeholder attribute by ensuring it is properly formatted.
* @param attr - The placeholder attribute string.
* @returns The prepared placeholder attribute string.
*/
function preparePlaceholderAttribute(attr) {
  return attr.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
//#endregion
//#region src/placeholder/plugins/PlaceholderPlugin.ts
/**
* Creates the ProseMirror plugin that renders placeholder decorations.
* @param options.editor - The editor instance.
* @param options.options - The resolved placeholder options.
* @returns The configured placeholder plugin.
*/
function createPlaceholderPlugin({
  editor,
  options
}) {
  const dataAttribute = options.dataAttribute ? `data-${preparePlaceholderAttribute(options.dataAttribute)}` : `data-${DEFAULT_DATA_ATTRIBUTE}`;
  const useResolvedPath = options.showOnlyCurrent && !options.includeChildren;
  return new Plugin({
    key: PLUGIN_KEY,
    ...(useResolvedPath ? {} : {
      state: createPlaceholderStateField({
        editor,
        options,
        dataAttribute
      })
    }),
    props: {
      decorations: useResolvedPath ? ({
        doc,
        selection
      }) => buildPlaceholderDecorations({
        editor,
        options,
        dataAttribute,
        doc,
        selection
      }) : state => {
        var _PLUGIN_KEY$getState;
        if (options.showOnlyWhenEditable && !editor.isEditable) return DecorationSet.empty;
        return (_PLUGIN_KEY$getState = PLUGIN_KEY.getState(state)) !== null && _PLUGIN_KEY$getState !== void 0 ? _PLUGIN_KEY$getState : DecorationSet.empty;
      }
    }
  });
}
//#endregion
//#region src/placeholder/placeholder.ts
/**
* This extension allows you to add a placeholder to your editor.
* A placeholder is a text that appears when the editor or a node is empty.
* @see https://www.tiptap.dev/api/extensions/placeholder
*/
const Placeholder = Extension.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      dataAttribute: DEFAULT_DATA_ATTRIBUTE,
      placeholder: "Write something …",
      showOnlyWhenEditable: true,
      showOnlyCurrent: true,
      includeChildren: false
    };
  },
  addProseMirrorPlugins() {
    return [createPlaceholderPlugin({
      editor: this.editor,
      options: this.options
    })];
  }
});
//#endregion
//#region src/selection/selection.ts
/**
* Whether the native browser selection should be cleared on blur and restored on focus.
* Only applies to non-empty text selections in an editable editor.
*/
function shouldSyncDomSelection(state, editor) {
  return !state.selection.empty && !isNodeSelection(state.selection) && editor.isEditable;
}
/**
* Whether the selection decoration should be rendered to keep the selection
* visible while the editor is blurred (and not dragging).
*/
function shouldPreserveSelection(state, editor) {
  return shouldSyncDomSelection(state, editor) && !editor.isFocused && !editor.view.dragging;
}
function clearDomSelection() {
  var _window$getSelection;
  (_window$getSelection = window.getSelection()) === null || _window$getSelection === void 0 || _window$getSelection.removeAllRanges();
}
/**
* Sync the native selection from the editor state.
* @see https://prosemirror.net/docs/ref/#view.EditorView.focus
*/
function restoreDomSelection(view) {
  view.focus();
}
/**
* This extension allows you to add a class to the selected text when the editor is blurred.
* It clears the native browser selection on blur (so `::selection` styles do not overlap the
* decoration) and restores it when the editor is focused again.
* @see https://www.tiptap.dev/api/extensions/selection
*/
Extension.create({
  name: "selection",
  addOptions() {
    return {
      className: "selection"
    };
  },
  addProseMirrorPlugins() {
    const {
      editor,
      options
    } = this;
    return [new Plugin({
      key: new PluginKey("selection"),
      props: {
        decorations(state) {
          if (!shouldPreserveSelection(state, editor)) return null;
          return DecorationSet.create(state.doc, [Decoration.inline(state.selection.from, state.selection.to, {
            class: options.className
          })]);
        },
        handleDOMEvents: {
          blur(view) {
            if (!shouldSyncDomSelection(view.state, editor)) return false;
            clearDomSelection();
            return false;
          },
          focus(view) {
            if (!shouldSyncDomSelection(view.state, editor)) return false;
            requestAnimationFrame(() => {
              if (!editor.isDestroyed && view.hasFocus()) restoreDomSelection(view);
            });
            return false;
          }
        }
      }
    })];
  }
});
function nodeEqualsType({
  types,
  node
}) {
  return node && Array.isArray(types) && types.includes(node.type) || (node === null || node === void 0 ? void 0 : node.type) === types;
}
/**
* This extension allows you to add an extra node at the end of the document.
* @see https://www.tiptap.dev/api/extensions/trailing-node
*/
Extension.create({
  name: "trailingNode",
  addOptions() {
    return {
      node: void 0,
      notAfter: []
    };
  },
  addProseMirrorPlugins() {
    var _this$editor$schema$t;
    const plugin = new PluginKey(this.name);
    const defaultNode = this.options.node || ((_this$editor$schema$t = this.editor.schema.topNodeType.contentMatch.defaultType) === null || _this$editor$schema$t === void 0 ? void 0 : _this$editor$schema$t.name) || "paragraph";
    const disabledNodes = Object.entries(this.editor.schema.nodes).map(([, value]) => value).filter(node => (this.options.notAfter || []).concat(defaultNode).includes(node.name));
    return [new Plugin({
      key: plugin,
      appendTransaction: (transactions, __, state) => {
        const {
          doc,
          tr,
          schema
        } = state;
        const shouldInsertNodeAtEnd = plugin.getState(state);
        const endPosition = doc.content.size;
        const type = schema.nodes[defaultNode];
        if (transactions.some(transaction => transaction.getMeta("skipTrailingNode"))) return;
        if (!shouldInsertNodeAtEnd) return;
        return tr.insert(endPosition, type.create());
      },
      state: {
        init: (_, state) => {
          const lastNode = state.tr.doc.lastChild;
          return !nodeEqualsType({
            node: lastNode,
            types: disabledNodes
          });
        },
        apply: (tr, value) => {
          if (!tr.docChanged) return value;
          if (tr.getMeta("__uniqueIDTransaction")) return value;
          const lastNode = tr.doc.lastChild;
          return !nodeEqualsType({
            node: lastNode,
            types: disabledNodes
          });
        }
      }
    })];
  }
});
//#endregion
//#region src/undo-redo/undo-redo.ts
/**
* This extension allows you to undo and redo recent changes.
* @see https://www.tiptap.dev/api/extensions/undo-redo
*
* **Important**: If the `@tiptap/extension-collaboration` package is used, make sure to remove
* the `undo-redo` extension, as it is not compatible with the `collaboration` extension.
*
* `@tiptap/extension-collaboration` uses its own history implementation.
*/
const UndoRedo = Extension.create({
  name: "undoRedo",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({
        state,
        dispatch
      }) => {
        return undo(state, dispatch);
      },
      redo: () => ({
        state,
        dispatch
      }) => {
        return redo(state, dispatch);
      }
    };
  },
  addProseMirrorPlugins() {
    return [history(this.options)];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
});

//#region src/index.ts
var src_default$1 = Placeholder;

//#region src/text.ts
/**
* This extension allows you to create text nodes.
* @see https://www.tiptap.dev/api/nodes/text
*/
const Text = Node.create({
  name: "text",
  group: "inline",
  parseMarkdown: token => {
    return {
      type: "text",
      text: token.text || ""
    };
  },
  renderMarkdown: node => node.text || ""
});
//#endregion
//#region src/index.ts
var src_default = Text;

/**
 * The **only** module in the prompt-line stack that imports `@tiptap/*` —
 * reached exclusively through `PromptLine`'s dynamic `import()`, so a
 * bundler splits Tiptap into its own lazy chunk and chats that never enable
 * `@rich` never ship it. Ported from `@carbon/ai-chat-components`'
 * `prompt-line-rich-runtime.ts`, trimmed to this port's scope: no
 * typing-indicator event (nothing here consumes one — a caller can debounce
 * `@onChange` itself). `@extensions` is compared by reference, not
 * upstream's deep equivalence check — a fresh array every render rebuilds
 * the editor (resetting undo history), so memoize it.
 *
 * Mention/command/autocomplete/starter extensions (`carbon-mention.ts` /
 * `carbon-autocomplete.ts` / `carbon-starter-trigger.ts` under
 * `./tiptap/`) build on top of the base bundle here via the normal
 * `@extensions` contract — a host imports and passes them in, this
 * controller doesn't know about them specially, except for two integration
 * points: `setContent`/`clearContent`/`insertContent` tag their
 * transactions host-origin (`./tiptap/origin-meta.ts`) so the mention/
 * command removal plugin can tell a host-driven change from a user edit,
 * and `createChatEnter`/`createChatKeymap` swallow (not just decline)
 * plain/Mod-Enter while a trigger is active
 * (`./tiptap/active-suggestion.ts`'s `hasActiveSuggestion`), so a
 * half-typed `@query` never gets sent as a message. Declining (`return
 * false`) is unsafe: with no popup consuming the keystroke, an untrapped
 * key falls through to the browser's default paragraph split (Enter) or
 * `HardBreakNode`'s own unconditional binding (Mod-Enter), corrupting the
 * query text and exiting the trigger — confirmed on CI, not locally
 * reproducible (see the two functions below for the full explanation).
 * Real,
 * deliberate gap: neither key falls through to "select the highlighted
 * item" — this port doesn't ship a suggestion popup at all (see
 * `carbon-mention.ts`'s class doc), so there's no "highlighted item" to
 * select; a host wires its own popup's click/Enter handling to
 * `PromptLineApi.selectSuggestion()`.
 */

const HISTORY_DEFAULTS = {
  depth: 100,
  newGroupDelay: 500
};
function createChatKeymap(onSendIntent) {
  return Extension.create({
    name: 'carbonChatKeymap',
    addKeyboardShortcuts() {
      return {
        // Swallow (return true), don't just decline, while a trigger is
        // active — see `createChatEnter`'s `Enter` comment for why
        // declining is unsafe. Confirmed on CI (though not reproducible
        // against a local `pnpm test` run — this class of ProseMirror
        // plugin-ordering issue is timing/environment-sensitive) that an
        // untrapped Mod-Enter falls through to `HardBreakNode`'s own
        // unconditional `Mod-Enter -> setHardBreak()` binding, inserting a
        // hard break into the query text and exiting the trigger.
        'Mod-Enter': ({
          editor
        }) => {
          if (hasActiveSuggestion(editor)) {
            return true;
          }
          onSendIntent();
          return true;
        },
        Escape: ({
          editor
        }) => {
          if (hasActiveSuggestion(editor)) {
            return false;
          }
          editor.view.dom.blur();
          return true;
        }
      };
    }
  });
}

/** Plain Enter sends (non-empty); empty Enter falls through to a newline. */
function createChatEnter(onSendIntent) {
  return Extension.create({
    name: 'carbonChatEnter',
    addKeyboardShortcuts() {
      return {
        Enter: ({
          editor
        }) => {
          // Swallow (return true), don't just decline, while a trigger is
          // active. Declining leaves the keydown untrapped — since nothing
          // else in this bundle binds plain Enter, ProseMirror falls back
          // to the browser's default contenteditable paragraph-split
          // behavior, which inserts a real newline right after the trigger
          // character and desyncs the query text from the cursor, exiting
          // the trigger (confirmed via a regression test: without this,
          // `getValue()` came back `"@\n"` and the trigger no longer
          // accepted a selection). A *subsequent* keydown — e.g. Mod-Enter
          // immediately after — would then see `hasActiveSuggestion() ===
          // false` and genuinely send, which is what actually reproduced
          // in CI as "plain Enter and Mod-Enter do not send while a
          // mention trigger is active" failing.
          if (hasActiveSuggestion(editor)) {
            return true;
          }
          if (editor.isEmpty) {
            return false;
          }
          onSendIntent();
          return true;
        }
      };
    }
  });
}

/** Builds a paragraph node per interior line, for a multi-line paste/drop. */
function linesToNodes(schema, lines) {
  return lines.map(line => line.length === 0 ? schema.nodes['paragraph'].create() : schema.nodes['paragraph'].create(null, schema.text(line)));
}

/**
 * Clamps `pos` into the range `setTextSelection` itself would clamp a
 * selection into (`TextSelection.atStart(doc).from` .. `TextSelection.atEnd
 * (doc).to`) - never the document's outer boundary (`0`/`doc.content.size`)
 * for a non-empty doc. `insertPlainText`'s multi-line branch relies on an
 * "open" slice merging into a paragraph that already surrounds `from`/`to`;
 * at the true outer boundary there is no such paragraph (resolving that
 * position has depth `0`), so the open ends fail to merge and a multi-line
 * insert silently produces extra, unmerged paragraphs instead.
 */
function clampToTextRange(doc, pos) {
  return Math.min(Math.max(pos, TextSelection.atStart(doc).from), TextSelection.atEnd(doc).to);
}

/**
 * Inserts plain text at `from`/`to`, splitting on newlines. A single-line
 * paste/drop (the overwhelmingly common case - a URL, a word mid-sentence)
 * is inserted as inline text so it merges into whatever paragraph is already
 * there, instead of being wrapped in its own `paragraph` node (which would
 * split the surrounding line in two). Genuine multi-line text is inserted as
 * an "open" slice (`openStart`/`openEnd: 1`) so only the *interior* lines
 * become new paragraphs - the first and last lines merge into the paragraph
 * content already surrounding `from`/`to`, matching how a real multi-line
 * paste behaves in any other rich text editor.
 */
function insertPlainText(view, text, from, to, hostOrigin = false) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  let tr = lines.length === 1 ? view.state.tr.insertText(lines[0], from, to) : view.state.tr.replace(from, to, new Slice(Fragment.from(linesToNodes(view.state.schema, lines)), 1, 1));
  tr = tr.scrollIntoView();
  if (hostOrigin) {
    // `insertContent()` (the imperative API) replacing a selection that
    // happens to contain a mention/command chip is a host action, not a
    // user delete — tag it the same as `setContent`/`clearContent` so the
    // removal plugin (`carbon-mention.ts`) doesn't fire `onRemove` for it.
    // Never set from the paste/drop handler below, which is a real user edit.
    tr = setHostOriginMeta(tr);
  }
  view.dispatch(tr);
}

/** Intercepts paste/drop and inserts plain text, splitting on newlines. */
const PlainTextPaste = Extension.create({
  name: 'carbonPlainTextPaste',
  addProseMirrorPlugins() {
    return [new Plugin({
      props: {
        handlePaste(view, event) {
          const text = event.clipboardData?.getData('text/plain');
          if (text == null) {
            return false;
          }
          const {
            from,
            to
          } = view.state.selection;
          insertPlainText(view, text, from, to);
          return true;
        },
        handleDrop(view, event, _slice, moved) {
          if (moved) {
            return false;
          }
          const text = event.dataTransfer?.getData('text/plain');
          if (!text) {
            return true;
          }
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          });
          if (!pos) {
            return true;
          }
          insertPlainText(view, text, pos.pos, pos.pos);
          event.preventDefault();
          return true;
        }
      }
    })];
  }
});
const PM_CONTENT_CLASS = 'cds-aichat-prompt-line__pm-content';
class RichController {
  constructor() {
    _defineProperty(this, "editor", null);
    _defineProperty(this, "host", null);
    _defineProperty(this, "extensions", []);
    _defineProperty(this, "placeholder", '');
    _defineProperty(this, "ariaLabel", void 0);
    _defineProperty(this, "testId", void 0);
    _defineProperty(this, "disabled", false);
    _defineProperty(this, "onChange", () => {});
    _defineProperty(this, "onSendIntent", () => {});
    /** Guards `setContent` (a controlled `@content` sync) from re-emitting `onChange`. */
    _defineProperty(this, "suppressChange", false);
    /** Set while an IME composition is in flight (see `setComposing`). */
    _defineProperty(this, "composing", false);
    /** Set when a `setExtensions` rebuild was withheld during a composition. */
    _defineProperty(this, "pendingRecreate", false);
  }
  mount(host, init) {
    this.host = host;
    this.extensions = init.extensions;
    this.onChange = init.onChange;
    this.onSendIntent = init.onSendIntent;
    this.placeholder = init.placeholder;
    this.ariaLabel = init.ariaLabel;
    this.testId = init.testId;
    this.disabled = init.disabled;
    this.editor = this.createEditor(host, textToDoc(init.value));
    this.applyEditorChrome();
    // `emitUpdate: false` - Tiptap's `setEditable` fires an `update` event
    // (and so `onChange`) by default, even though editability alone never
    // changes the text content. Left at its default here would spuriously
    // re-report the current value on every mount/rebuild - including the
    // very first one, for a controlled `@content` seed nothing typed.
    this.editor.setEditable(!this.disabled, false);
  }
  destroy() {
    this.editor?.destroy();
    this.editor = null;
    this.host = null;
  }
  getValue() {
    return this.editor ? getRawText(this.editor.getJSON()) : '';
  }
  setContent(value) {
    const editor = this.editor;
    if (!editor || this.getValue() === value) {
      return;
    }
    this.suppressChange = true;
    // Chaining a custom `command` before `setContent` tags the *same*
    // transaction both commands share (Tiptap chains apply sequentially
    // against one shared `tr`, dispatched once at the end) as host-origin,
    // so the mention/command removal plugin skips any chip this drops.
    editor.chain().command(({
      tr
    }) => {
      setHostOriginMeta(tr);
      return true;
    }).setContent(textToDoc(value)).run();
    this.suppressChange = false;
  }

  /**
   * Inserts `text` as literal characters, never as parsed HTML - Tiptap's own
   * `insertContent`/`insertContentAt` commands parse a string argument via
   * `DOMParser`, so any substring that happens to look like a recognized tag
   * (this schema has `<p>`/`<br>`) would otherwise get spliced in as a real
   * node instead of visible text. Routed through the same `insertPlainText`
   * helper the paste/drop handler uses, so this stays consistent with
   * `setContent()` (which seeds via `textToDoc`, not a raw string) and with
   * `TextareaController.insertContent()`, which is always literal. `opts.at`
   * is clamped via `clampToTextRange` (mirroring `setTextSelection`) so a
   * caller passing `0`/`doc.content.size` for a multi-line insert still
   * merges into the surrounding paragraph instead of leaving it detached.
   */
  insertContent(text, opts = {}) {
    const editor = this.editor;
    if (!editor) {
      return;
    }
    const {
      view
    } = editor;
    const at = typeof opts.at === 'number' ? clampToTextRange(view.state.doc, opts.at) : undefined;
    const from = at ?? view.state.selection.from;
    const to = at ?? view.state.selection.to;
    insertPlainText(view, text, from, to, /* hostOrigin */true);
  }
  clearContent() {
    const editor = this.editor;
    if (!editor) {
      return;
    }
    editor.chain().command(({
      tr
    }) => {
      setHostOriginMeta(tr);
      return true;
    }).clearContent(true).run();
  }
  getEditor() {
    return this.editor;
  }
  focus() {
    this.editor?.commands.focus();
  }
  blur() {
    this.editor?.commands.blur();
  }
  hasFocus() {
    return this.editor?.isFocused ?? false;
  }
  getSelection() {
    const selection = this.editor?.state.selection;
    return selection ? {
      from: selection.from,
      to: selection.to
    } : {
      from: 0,
      to: 0
    };
  }
  setTextSelection(pos) {
    this.editor?.commands.setTextSelection(pos);
  }
  selectAll() {
    this.editor?.commands.selectAll();
  }
  setEditable(editable) {
    this.disabled = !editable;
    // See the `emitUpdate: false` comment in `createEditor`'s caller above -
    // toggling editability isn't a content change.
    this.editor?.setEditable(editable, false);
  }
  setPlaceholder(placeholder) {
    this.placeholder = placeholder;
    // `Placeholder.configure`'s resolver (below) reads `this.placeholder`
    // live, so an empty transaction just repaints the decoration with the
    // new text instead of waiting for the next edit.
    const editor = this.editor;
    if (editor) {
      editor.view.dispatch(editor.state.tr);
    }
  }
  setAriaLabel(ariaLabel) {
    this.ariaLabel = ariaLabel;
    this.applyEditorChrome();
  }
  setTestId(testId) {
    this.testId = testId;
    this.applyEditorChrome();
  }
  setExtensions(extensions) {
    if (extensions === this.extensions) {
      return;
    }
    this.extensions = extensions;
    // `recreateEditor` destroys and rebuilds the live editor - doing that
    // mid-composition would strand the IME's candidate text the same way an
    // unguarded textarea->rich swap would. Withhold it until `setComposing
    // (false)` releases it.
    if (this.composing) {
      this.pendingRecreate = true;
      return;
    }
    this.recreateEditor();
  }

  /**
   * Reports whether an IME composition is in flight. `PromptLine` owns the
   * one composition observer for both surfaces and pushes the state down
   * here so a `setExtensions` rebuild during composition is deferred instead
   * of stranding the IME's candidate text, then flushed once composition
   * ends.
   */
  setComposing(composing) {
    this.composing = composing;
    if (!composing && this.pendingRecreate) {
      this.pendingRecreate = false;
      this.recreateEditor();
    }
  }
  undo() {
    return Boolean(this.editor?.commands.undo());
  }
  redo() {
    return Boolean(this.editor?.commands.redo());
  }
  selectSuggestion(item) {
    return this.editor ? selectActiveSuggestion(this.editor, item) : false;
  }
  dismissSuggestion() {
    return this.editor ? dismissActiveSuggestion(this.editor) : false;
  }
  createEditor(element, content) {
    const baseExtensions = [src_default$4, src_default$2, src_default, src_default$3, UndoRedo.configure({
      ...HISTORY_DEFAULTS
    }), src_default$1.configure({
      placeholder: () => this.placeholder
    }), PlainTextPaste, createChatKeymap(() => this.onSendIntent()), createChatEnter(() => this.onSendIntent())];
    return new Editor({
      element,
      extensions: [...baseExtensions, ...this.extensions],
      content,
      autofocus: false,
      injectCSS: false,
      onUpdate: ({
        editor
      }) => {
        if (this.suppressChange) {
          return;
        }
        this.onChange(getRawText(editor.getJSON()));
      }
    });
  }
  recreateEditor() {
    const host = this.host;
    const editor = this.editor;
    if (!host || !editor) {
      return;
    }
    const value = getRawText(editor.getJSON());
    const selection = this.getSelection();
    const wasFocused = editor.isFocused;
    editor.destroy();
    this.editor = this.createEditor(host, textToDoc(value));
    this.applyEditorChrome();
    // `emitUpdate: false` - Tiptap's `setEditable` fires an `update` event
    // (and so `onChange`) by default, even though editability alone never
    // changes the text content. Left at its default here would spuriously
    // re-report the current value on every mount/rebuild - including the
    // very first one, for a controlled `@content` seed nothing typed.
    this.editor.setEditable(!this.disabled, false);
    const {
      size
    } = this.editor.state.doc.content;
    this.editor.commands.setTextSelection({
      from: Math.min(selection.from, size),
      to: Math.min(selection.to, size)
    });
    if (wasFocused) {
      this.editor.commands.focus();
    }
  }

  /** Applies the CSS hook and ARIA attributes to the live contenteditable. */
  applyEditorChrome() {
    const dom = this.editor?.view.dom;
    if (!dom) {
      return;
    }
    dom.classList.add(PM_CONTENT_CLASS);
    dom.setAttribute('role', 'textbox');
    dom.setAttribute('aria-multiline', 'true');
    if (this.ariaLabel) {
      dom.setAttribute('aria-label', this.ariaLabel);
    } else {
      dom.removeAttribute('aria-label');
    }
    if (this.testId) {
      dom.setAttribute('data-testid', this.testId);
    } else {
      dom.removeAttribute('data-testid');
    }
  }
}
function createRichController() {
  return new RichController();
}

export { createRichController };
