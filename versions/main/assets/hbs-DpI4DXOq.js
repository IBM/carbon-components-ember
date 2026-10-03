import { ak as nameFor, s as setComponentTemplate, t as templateOnly, o as on, am as hash, an as get, j as fn, ao as concat, ap as array, i as templateFactory } from './main-DOn3LE1Q.js';

function h$1() {
  return Object.create(null);
}
const x$1 = Object.assign;
const E$1 = console;
function A$1(t, n = "unexpected unreachable branch") {
  throw E$1.log("unreachable", t), E$1.log(`${n} :: ${JSON.stringify(t)} (${t})`), new Error("code reached unreachable");
}

const t = {
    Append: 1,
    TrustingAppend: 2,
    Comment: 3,
    Modifier: 4,
    Block: 6,
    Component: 8,
    OpenElement: 10,
    OpenElementWithSplat: 11,
    FlushElement: 12,
    CloseElement: 13,
    StaticAttr: 14,
    DynamicAttr: 15,
    ComponentAttr: 16,
    AttrSplat: 17,
    Yield: 18,
    TrustingDynamicAttr: 22,
    TrustingComponentAttr: 23,
    StaticComponentAttr: 24,
    Debugger: 26,
    Undefined: 27,
    Call: 28,
    Concat: 29,
    GetSymbol: 30,
    GetLexicalSymbol: 32,
    GetStrictKeyword: 31,
    GetFreeAsComponentOrHelperHead: 35,
    GetFreeAsHelperHead: 37,
    GetFreeAsModifierHead: 38,
    GetFreeAsComponentHead: 39,
    InElement: 40,
    If: 41,
    Each: 42,
    Let: 44,
    WithDynamicVars: 45,
    InvokeComponent: 46,
    HasBlock: 48,
    HasBlockParams: 49,
    Curry: 50,
    Not: 51,
    IfInline: 52,
    GetDynamicVar: 53,
    Log: 54
  },
  n = {
    class: 0,
    id: 1,
    value: 2,
    name: 3,
    type: 4,
    style: 5,
    href: 6
  },
  r = {
    div: 0,
    span: 1,
    p: 2,
    a: 3
  };

var errorProps = ['description', 'fileName', 'lineNumber', 'endLineNumber', 'message', 'name', 'number', 'stack'];
function Exception(message, node) {
  var loc = node && node.loc,
    line,
    endLineNumber,
    column,
    endColumn;
  if (loc) {
    line = loc.start.line;
    endLineNumber = loc.end.line;
    column = loc.start.column;
    endColumn = loc.end.column;
    message += ' - ' + line + ':' + column;
  }
  var tmp = Error.prototype.constructor.call(this, message);
  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
  /* istanbul ignore else */
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, Exception);
  }
  try {
    if (loc) {
      this.lineNumber = line;
      this.endLineNumber = endLineNumber;
      // Work around issue under safari where we can't directly set the column value
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(this, 'column', {
          value: column,
          enumerable: true
        });
        Object.defineProperty(this, 'endColumn', {
          value: endColumn,
          enumerable: true
        });
      } else {
        this.column = column;
        this.endColumn = endColumn;
      }
    }
  } catch (nop) {
    /* Ignore if the browser is very particular */
  }
}
Exception.prototype = new Error();

function Visitor() {
  this.parents = [];
}
Visitor.prototype = {
  constructor: Visitor,
  mutating: false,
  // Visits a given value. If mutating, will replace the value if necessary.
  acceptKey: function (node, name) {
    var value = this.accept(node[name]);
    if (this.mutating) {
      // Hacky sanity check: This may have a few false positives for type for the helper
      // methods but will generally do the right thing without a lot of overhead.
      if (value && !Visitor.prototype[value.type]) {
        throw new Exception('Unexpected node type "' + value.type + '" found when accepting ' + name + ' on ' + node.type);
      }
      node[name] = value;
    }
  },
  // Performs an accept operation with added sanity check to ensure
  // required keys are not removed.
  acceptRequired: function (node, name) {
    this.acceptKey(node, name);
    if (!node[name]) {
      throw new Exception(node.type + ' requires ' + name);
    }
  },
  // Traverses a given array. If mutating, empty respnses will be removed
  // for child elements.
  acceptArray: function (array) {
    for (var i = 0, l = array.length; i < l; i++) {
      this.acceptKey(array, i);
      if (!array[i]) {
        array.splice(i, 1);
        i--;
        l--;
      }
    }
  },
  accept: function (object) {
    if (!object) {
      return;
    }
    /* istanbul ignore next: Sanity code */
    if (!this[object.type]) {
      throw new Exception('Unknown type: ' + object.type, object);
    }
    if (this.current) {
      this.parents.unshift(this.current);
    }
    this.current = object;
    var ret = this[object.type](object);
    this.current = this.parents.shift();
    if (!this.mutating || ret) {
      return ret;
    } else if (ret !== false) {
      return object;
    }
  },
  Program: function (program) {
    this.acceptArray(program.body);
  },
  MustacheStatement: visitSubExpression,
  Decorator: visitSubExpression,
  BlockStatement: visitBlock,
  DecoratorBlock: visitBlock,
  PartialStatement: visitPartial,
  PartialBlockStatement: function (partial) {
    visitPartial.call(this, partial);
    this.acceptKey(partial, 'program');
  },
  ContentStatement: function /* content */ () {},
  CommentStatement: function /* comment */ () {},
  SubExpression: visitSubExpression,
  PathExpression: function /* path */ () {},
  StringLiteral: function /* string */ () {},
  NumberLiteral: function /* number */ () {},
  BooleanLiteral: function /* bool */ () {},
  UndefinedLiteral: function /* literal */ () {},
  NullLiteral: function /* literal */ () {},
  Hash: function (hash) {
    this.acceptArray(hash.pairs);
  },
  HashPair: function (pair) {
    this.acceptRequired(pair, 'value');
  }
};
function visitSubExpression(mustache) {
  this.acceptRequired(mustache, 'path');
  this.acceptArray(mustache.params);
  this.acceptKey(mustache, 'hash');
}
function visitBlock(block) {
  visitSubExpression.call(this, block);
  this.acceptKey(block, 'program');
  this.acceptKey(block, 'inverse');
}
function visitPartial(partial) {
  this.acceptRequired(partial, 'name');
  this.acceptArray(partial.params);
  this.acceptKey(partial, 'hash');
}

function WhitespaceControl(options) {
  if (options === void 0) {
    options = {};
  }
  this.options = options;
}
WhitespaceControl.prototype = new Visitor();
WhitespaceControl.prototype.Program = function (program) {
  var doStandalone = !this.options.ignoreStandalone;
  var isRoot = !this.isRootSeen;
  this.isRootSeen = true;
  var body = program.body;
  for (var i = 0, l = body.length; i < l; i++) {
    var current = body[i],
      strip = this.accept(current);
    if (!strip) {
      continue;
    }
    var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot),
      _isNextWhitespace = isNextWhitespace(body, i, isRoot),
      openStandalone = strip.openStandalone && _isPrevWhitespace,
      closeStandalone = strip.closeStandalone && _isNextWhitespace,
      inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
    if (strip.close) {
      omitRight(body, i, true);
    }
    if (strip.open) {
      omitLeft(body, i, true);
    }
    if (doStandalone && inlineStandalone) {
      omitRight(body, i);
      if (omitLeft(body, i)) {
        // If we are on a standalone node, save the indent info for partials
        if (current.type === 'PartialStatement') {
          // Pull out the whitespace from the final line
          current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
        }
      }
    }
    if (doStandalone && openStandalone) {
      omitRight((current.program || current.inverse).body);
      // Strip out the previous content node if it's whitespace only
      omitLeft(body, i);
    }
    if (doStandalone && closeStandalone) {
      // Always strip the next node
      omitRight(body, i);
      omitLeft((current.inverse || current.program).body);
    }
  }
  return program;
};
WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function (block) {
  this.accept(block.program);
  this.accept(block.inverse);
  // Find the inverse program that is involed with whitespace stripping.
  var program = block.program || block.inverse,
    inverse = block.program && block.inverse,
    firstInverse = inverse,
    lastInverse = inverse;
  if (inverse && inverse.chained) {
    firstInverse = inverse.body[0].program;
    // Walk the inverse chain to find the last inverse that is actually in the chain.
    while (lastInverse.chained) {
      lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
    }
  }
  var strip = {
    open: block.openStrip.open,
    close: block.closeStrip.close,
    // Determine the standalone candiacy. Basically flag our content as being possibly standalone
    // so our parent can determine if we actually are standalone
    openStandalone: isNextWhitespace(program.body),
    closeStandalone: isPrevWhitespace((firstInverse || program).body)
  };
  if (block.openStrip.close) {
    omitRight(program.body, null, true);
  }
  if (inverse) {
    var inverseStrip = block.inverseStrip;
    if (inverseStrip.open) {
      omitLeft(program.body, null, true);
    }
    if (inverseStrip.close) {
      omitRight(firstInverse.body, null, true);
    }
    if (block.closeStrip.open) {
      omitLeft(lastInverse.body, null, true);
    }
    // Find standalone else statments
    if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
      omitLeft(program.body);
      omitRight(firstInverse.body);
    }
  } else if (block.closeStrip.open) {
    omitLeft(program.body, null, true);
  }
  return strip;
};
WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function (mustache) {
  return mustache.strip;
};
WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function (node) {
  /* istanbul ignore next */
  var strip = node.strip || {};
  return {
    inlineStandalone: true,
    open: strip.open,
    close: strip.close
  };
};
function isPrevWhitespace(body, i, isRoot) {
  if (i === undefined) {
    i = body.length;
  }
  // Nodes that end with newlines are considered whitespace (but are special
  // cased for strip operations)
  var prev = body[i - 1],
    sibling = body[i - 2];
  if (!prev) {
    return isRoot;
  }
  if (prev.type === 'ContentStatement') {
    return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
  }
}
function isNextWhitespace(body, i, isRoot) {
  if (i === undefined) {
    i = -1;
  }
  var next = body[i + 1],
    sibling = body[i + 2];
  if (!next) {
    return isRoot;
  }
  if (next.type === 'ContentStatement') {
    return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
  }
}
// Marks the node to the right of the position as omitted.
// I.e. {{foo}}' ' will mark the ' ' node as omitted.
//
// If i is undefined, then the first child will be marked as such.
//
// If multiple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitRight(body, i, multiple) {
  var current = body[i == null ? 0 : i + 1];
  if (!current || current.type !== 'ContentStatement' || !multiple && current.rightStripped) {
    return;
  }
  var original = current.value;
  current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, '');
  current.rightStripped = current.value !== original;
}
// Marks the node to the left of the position as omitted.
// I.e. ' '{{foo}} will mark the ' ' node as omitted.
//
// If i is undefined then the last child will be marked as such.
//
// If multiple is truthy then all whitespace will be stripped out until non-whitespace
// content is met.
function omitLeft(body, i, multiple) {
  var current = body[i == null ? body.length - 1 : i - 1];
  if (!current || current.type !== 'ContentStatement' || !multiple && current.leftStripped) {
    return;
  }
  // We omit the last node if it's whitespace only and not preceded by a non-content node.
  var original = current.value;
  current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, '');
  current.leftStripped = current.value !== original;
  return current.leftStripped;
}

/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = function () {
  var o = function (k, v, o, l) {
      for (o = o || {}, l = k.length; l--; o[k[l]] = v);
      return o;
    },
    $V0 = [2, 44],
    $V1 = [1, 20],
    $V2 = [5, 14, 15, 19, 29, 34, 39, 44, 47, 48, 52, 56, 60],
    $V3 = [1, 35],
    $V4 = [1, 38],
    $V5 = [1, 30],
    $V6 = [1, 31],
    $V7 = [1, 32],
    $V8 = [1, 33],
    $V9 = [1, 34],
    $Va = [1, 37],
    $Vb = [14, 15, 19, 29, 34, 39, 44, 47, 48, 52, 56, 60],
    $Vc = [14, 15, 19, 29, 34, 44, 47, 48, 52, 56, 60],
    $Vd = [15, 18],
    $Ve = [14, 15, 19, 29, 34, 47, 48, 52, 56, 60],
    $Vf = [33, 64, 71, 79, 80, 81, 82, 83, 84],
    $Vg = [23, 33, 55, 64, 67, 71, 74, 79, 80, 81, 82, 83, 84],
    $Vh = [1, 51],
    $Vi = [23, 33, 55, 64, 67, 71, 74, 79, 80, 81, 82, 83, 84, 86],
    $Vj = [2, 43],
    $Vk = [55, 64, 71, 79, 80, 81, 82, 83, 84],
    $Vl = [1, 58],
    $Vm = [1, 59],
    $Vn = [1, 66],
    $Vo = [33, 64, 71, 74, 79, 80, 81, 82, 83, 84],
    $Vp = [23, 64, 71, 79, 80, 81, 82, 83, 84],
    $Vq = [1, 76],
    $Vr = [64, 67, 71, 79, 80, 81, 82, 83, 84],
    $Vs = [33, 74],
    $Vt = [23, 33, 55, 67, 71, 74],
    $Vu = [1, 106],
    $Vv = [1, 118],
    $Vw = [71, 76];
  var parser = {
    trace: function trace() {},
    yy: {},
    symbols_: {
      "error": 2,
      "root": 3,
      "program": 4,
      "EOF": 5,
      "program_repetition0": 6,
      "statement": 7,
      "mustache": 8,
      "block": 9,
      "rawBlock": 10,
      "partial": 11,
      "partialBlock": 12,
      "content": 13,
      "COMMENT": 14,
      "CONTENT": 15,
      "openRawBlock": 16,
      "rawBlock_repetition0": 17,
      "END_RAW_BLOCK": 18,
      "OPEN_RAW_BLOCK": 19,
      "helperName": 20,
      "openRawBlock_repetition0": 21,
      "openRawBlock_option0": 22,
      "CLOSE_RAW_BLOCK": 23,
      "openBlock": 24,
      "block_option0": 25,
      "closeBlock": 26,
      "openInverse": 27,
      "block_option1": 28,
      "OPEN_BLOCK": 29,
      "openBlock_repetition0": 30,
      "openBlock_option0": 31,
      "openBlock_option1": 32,
      "CLOSE": 33,
      "OPEN_INVERSE": 34,
      "openInverse_repetition0": 35,
      "openInverse_option0": 36,
      "openInverse_option1": 37,
      "openInverseChain": 38,
      "OPEN_INVERSE_CHAIN": 39,
      "openInverseChain_repetition0": 40,
      "openInverseChain_option0": 41,
      "openInverseChain_option1": 42,
      "inverseAndProgram": 43,
      "INVERSE": 44,
      "inverseChain": 45,
      "inverseChain_option0": 46,
      "OPEN_ENDBLOCK": 47,
      "OPEN": 48,
      "expr": 49,
      "mustache_repetition0": 50,
      "mustache_option0": 51,
      "OPEN_UNESCAPED": 52,
      "mustache_repetition1": 53,
      "mustache_option1": 54,
      "CLOSE_UNESCAPED": 55,
      "OPEN_PARTIAL": 56,
      "partial_repetition0": 57,
      "partial_option0": 58,
      "openPartialBlock": 59,
      "OPEN_PARTIAL_BLOCK": 60,
      "openPartialBlock_repetition0": 61,
      "openPartialBlock_option0": 62,
      "sexpr": 63,
      "OPEN_SEXPR": 64,
      "sexpr_repetition0": 65,
      "sexpr_option0": 66,
      "CLOSE_SEXPR": 67,
      "hash": 68,
      "hash_repetition_plus0": 69,
      "hashSegment": 70,
      "ID": 71,
      "EQUALS": 72,
      "blockParams": 73,
      "OPEN_BLOCK_PARAMS": 74,
      "blockParams_repetition_plus0": 75,
      "CLOSE_BLOCK_PARAMS": 76,
      "path": 77,
      "dataName": 78,
      "STRING": 79,
      "NUMBER": 80,
      "BOOLEAN": 81,
      "UNDEFINED": 82,
      "NULL": 83,
      "DATA": 84,
      "pathSegments": 85,
      "SEP": 86,
      "$accept": 0,
      "$end": 1
    },
    terminals_: {
      2: "error",
      5: "EOF",
      14: "COMMENT",
      15: "CONTENT",
      18: "END_RAW_BLOCK",
      19: "OPEN_RAW_BLOCK",
      23: "CLOSE_RAW_BLOCK",
      29: "OPEN_BLOCK",
      33: "CLOSE",
      34: "OPEN_INVERSE",
      39: "OPEN_INVERSE_CHAIN",
      44: "INVERSE",
      47: "OPEN_ENDBLOCK",
      48: "OPEN",
      52: "OPEN_UNESCAPED",
      55: "CLOSE_UNESCAPED",
      56: "OPEN_PARTIAL",
      60: "OPEN_PARTIAL_BLOCK",
      64: "OPEN_SEXPR",
      67: "CLOSE_SEXPR",
      71: "ID",
      72: "EQUALS",
      74: "OPEN_BLOCK_PARAMS",
      76: "CLOSE_BLOCK_PARAMS",
      79: "STRING",
      80: "NUMBER",
      81: "BOOLEAN",
      82: "UNDEFINED",
      83: "NULL",
      84: "DATA",
      86: "SEP"
    },
    productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [49, 1], [49, 1], [63, 5], [68, 1], [70, 3], [73, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [78, 2], [77, 1], [85, 3], [85, 1], [6, 0], [6, 2], [17, 0], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [50, 0], [50, 2], [51, 0], [51, 1], [53, 0], [53, 2], [54, 0], [54, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [65, 0], [65, 2], [66, 0], [66, 1], [69, 1], [69, 2], [75, 1], [75, 2]],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
      /* this == yyval */
      var $0 = $$.length - 1;
      switch (yystate) {
        case 1:
          return $$[$0 - 1];
        case 2:
          this.$ = yy.prepareProgram($$[$0]);
          break;
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 20:
        case 27:
        case 28:
        case 33:
        case 34:
          this.$ = $$[$0];
          break;
        case 9:
          this.$ = {
            type: 'CommentStatement',
            value: yy.stripComment($$[$0]),
            strip: yy.stripFlags($$[$0], $$[$0]),
            loc: yy.locInfo(this._$)
          };
          break;
        case 10:
          this.$ = {
            type: 'ContentStatement',
            original: $$[$0],
            value: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 11:
          this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
          break;
        case 12:
          this.$ = {
            path: $$[$0 - 3],
            params: $$[$0 - 2],
            hash: $$[$0 - 1]
          };
          break;
        case 13:
          this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
          break;
        case 14:
          this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
          break;
        case 15:
          this.$ = {
            open: $$[$0 - 5],
            path: $$[$0 - 4],
            params: $$[$0 - 3],
            hash: $$[$0 - 2],
            blockParams: $$[$0 - 1],
            strip: yy.stripFlags($$[$0 - 5], $$[$0])
          };
          break;
        case 16:
        case 17:
          this.$ = {
            path: $$[$0 - 4],
            params: $$[$0 - 3],
            hash: $$[$0 - 2],
            blockParams: $$[$0 - 1],
            strip: yy.stripFlags($$[$0 - 5], $$[$0])
          };
          break;
        case 18:
          this.$ = {
            strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]),
            program: $$[$0]
          };
          break;
        case 19:
          var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$),
            program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
          program.chained = true;
          this.$ = {
            strip: $$[$0 - 2].strip,
            program: program,
            chain: true
          };
          break;
        case 21:
          this.$ = {
            path: $$[$0 - 1],
            strip: yy.stripFlags($$[$0 - 2], $$[$0])
          };
          break;
        case 22:
        case 23:
          this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
          break;
        case 24:
          this.$ = {
            type: 'PartialStatement',
            name: $$[$0 - 3],
            params: $$[$0 - 2],
            hash: $$[$0 - 1],
            indent: '',
            strip: yy.stripFlags($$[$0 - 4], $$[$0]),
            loc: yy.locInfo(this._$)
          };
          break;
        case 25:
          this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
          break;
        case 26:
          this.$ = {
            path: $$[$0 - 3],
            params: $$[$0 - 2],
            hash: $$[$0 - 1],
            strip: yy.stripFlags($$[$0 - 4], $$[$0])
          };
          break;
        case 29:
          this.$ = {
            type: 'SubExpression',
            path: $$[$0 - 3],
            params: $$[$0 - 2],
            hash: $$[$0 - 1],
            loc: yy.locInfo(this._$)
          };
          break;
        case 30:
          this.$ = {
            type: 'Hash',
            pairs: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 31:
          this.$ = {
            type: 'HashPair',
            key: yy.id($$[$0 - 2]),
            value: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 32:
          this.$ = yy.id($$[$0 - 1]);
          break;
        case 35:
          this.$ = {
            type: 'StringLiteral',
            value: $$[$0],
            original: $$[$0],
            loc: yy.locInfo(this._$)
          };
          break;
        case 36:
          this.$ = {
            type: 'NumberLiteral',
            value: Number($$[$0]),
            original: Number($$[$0]),
            loc: yy.locInfo(this._$)
          };
          break;
        case 37:
          this.$ = {
            type: 'BooleanLiteral',
            value: $$[$0] === 'true',
            original: $$[$0] === 'true',
            loc: yy.locInfo(this._$)
          };
          break;
        case 38:
          this.$ = {
            type: 'UndefinedLiteral',
            original: undefined,
            value: undefined,
            loc: yy.locInfo(this._$)
          };
          break;
        case 39:
          this.$ = {
            type: 'NullLiteral',
            original: null,
            value: null,
            loc: yy.locInfo(this._$)
          };
          break;
        case 40:
          this.$ = yy.preparePath(true, $$[$0], this._$);
          break;
        case 41:
          this.$ = yy.preparePath(false, $$[$0], this._$);
          break;
        case 42:
          $$[$0 - 2].push({
            part: yy.id($$[$0]),
            original: $$[$0],
            separator: $$[$0 - 1]
          });
          this.$ = $$[$0 - 2];
          break;
        case 43:
          this.$ = [{
            part: yy.id($$[$0]),
            original: $$[$0]
          }];
          break;
        case 44:
        case 46:
        case 48:
        case 56:
        case 62:
        case 68:
        case 76:
        case 80:
        case 84:
        case 88:
        case 92:
          this.$ = [];
          break;
        case 45:
        case 47:
        case 49:
        case 57:
        case 63:
        case 69:
        case 77:
        case 81:
        case 85:
        case 89:
        case 93:
        case 97:
        case 99:
          $$[$0 - 1].push($$[$0]);
          break;
        case 96:
        case 98:
          this.$ = [$$[$0]];
          break;
      }
    },
    table: [o([5, 14, 15, 19, 29, 34, 48, 52, 56, 60], $V0, {
      3: 1,
      4: 2,
      6: 3
    }), {
      1: [3]
    }, {
      5: [1, 4]
    }, o([5, 39, 44, 47], [2, 2], {
      7: 5,
      8: 6,
      9: 7,
      10: 8,
      11: 9,
      12: 10,
      13: 11,
      24: 15,
      27: 16,
      16: 17,
      59: 19,
      14: [1, 12],
      15: $V1,
      19: [1, 23],
      29: [1, 21],
      34: [1, 22],
      48: [1, 13],
      52: [1, 14],
      56: [1, 18],
      60: [1, 24]
    }), {
      1: [2, 1]
    }, o($V2, [2, 45]), o($V2, [2, 3]), o($V2, [2, 4]), o($V2, [2, 5]), o($V2, [2, 6]), o($V2, [2, 7]), o($V2, [2, 8]), o($V2, [2, 9]), {
      20: 26,
      49: 25,
      63: 27,
      64: $V3,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      20: 26,
      49: 39,
      63: 27,
      64: $V3,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Vb, $V0, {
      6: 3,
      4: 40
    }), o($Vc, $V0, {
      6: 3,
      4: 41
    }), o($Vd, [2, 46], {
      17: 42
    }), {
      20: 26,
      49: 43,
      63: 27,
      64: $V3,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Ve, $V0, {
      6: 3,
      4: 44
    }), o([5, 14, 15, 18, 19, 29, 34, 39, 44, 47, 48, 52, 56, 60], [2, 10]), {
      20: 45,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      20: 46,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      20: 47,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      20: 26,
      49: 48,
      63: 27,
      64: $V3,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Vf, [2, 76], {
      50: 49
    }), o($Vg, [2, 27]), o($Vg, [2, 28]), o($Vg, [2, 33]), o($Vg, [2, 34]), o($Vg, [2, 35]), o($Vg, [2, 36]), o($Vg, [2, 37]), o($Vg, [2, 38]), o($Vg, [2, 39]), {
      20: 26,
      49: 50,
      63: 27,
      64: $V3,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Vg, [2, 41], {
      86: $Vh
    }), {
      71: $V4,
      85: 52
    }, o($Vi, $Vj), o($Vk, [2, 80], {
      53: 53
    }), {
      25: 54,
      38: 56,
      39: $Vl,
      43: 57,
      44: $Vm,
      45: 55,
      47: [2, 52]
    }, {
      28: 60,
      43: 61,
      44: $Vm,
      47: [2, 54]
    }, {
      13: 63,
      15: $V1,
      18: [1, 62]
    }, o($Vf, [2, 84], {
      57: 64
    }), {
      26: 65,
      47: $Vn
    }, o($Vo, [2, 56], {
      30: 67
    }), o($Vo, [2, 62], {
      35: 68
    }), o($Vp, [2, 48], {
      21: 69
    }), o($Vf, [2, 88], {
      61: 70
    }), {
      20: 26,
      33: [2, 78],
      49: 72,
      51: 71,
      63: 27,
      64: $V3,
      68: 73,
      69: 74,
      70: 75,
      71: $Vq,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Vr, [2, 92], {
      65: 77
    }), {
      71: [1, 78]
    }, o($Vg, [2, 40], {
      86: $Vh
    }), {
      20: 26,
      49: 80,
      54: 79,
      55: [2, 82],
      63: 27,
      64: $V3,
      68: 81,
      69: 74,
      70: 75,
      71: $Vq,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      26: 82,
      47: $Vn
    }, {
      47: [2, 53]
    }, o($Vb, $V0, {
      6: 3,
      4: 83
    }), {
      47: [2, 20]
    }, {
      20: 84,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Ve, $V0, {
      6: 3,
      4: 85
    }), {
      26: 86,
      47: $Vn
    }, {
      47: [2, 55]
    }, o($V2, [2, 11]), o($Vd, [2, 47]), {
      20: 26,
      33: [2, 86],
      49: 88,
      58: 87,
      63: 27,
      64: $V3,
      68: 89,
      69: 74,
      70: 75,
      71: $Vq,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($V2, [2, 25]), {
      20: 90,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Vs, [2, 58], {
      20: 26,
      63: 27,
      77: 28,
      78: 29,
      85: 36,
      69: 74,
      70: 75,
      31: 91,
      49: 92,
      68: 93,
      64: $V3,
      71: $Vq,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va
    }), o($Vs, [2, 64], {
      20: 26,
      63: 27,
      77: 28,
      78: 29,
      85: 36,
      69: 74,
      70: 75,
      36: 94,
      49: 95,
      68: 96,
      64: $V3,
      71: $Vq,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va
    }), {
      20: 26,
      22: 97,
      23: [2, 50],
      49: 98,
      63: 27,
      64: $V3,
      68: 99,
      69: 74,
      70: 75,
      71: $Vq,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      20: 26,
      33: [2, 90],
      49: 101,
      62: 100,
      63: 27,
      64: $V3,
      68: 102,
      69: 74,
      70: 75,
      71: $Vq,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      33: [1, 103]
    }, o($Vf, [2, 77]), {
      33: [2, 79]
    }, o([23, 33, 55, 67, 74], [2, 30], {
      70: 104,
      71: [1, 105]
    }), o($Vt, [2, 96]), o($Vi, $Vj, {
      72: $Vu
    }), {
      20: 26,
      49: 108,
      63: 27,
      64: $V3,
      66: 107,
      67: [2, 94],
      68: 109,
      69: 74,
      70: 75,
      71: $Vq,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, o($Vi, [2, 42]), {
      55: [1, 110]
    }, o($Vk, [2, 81]), {
      55: [2, 83]
    }, o($V2, [2, 13]), {
      38: 56,
      39: $Vl,
      43: 57,
      44: $Vm,
      45: 112,
      46: 111,
      47: [2, 74]
    }, o($Vo, [2, 68], {
      40: 113
    }), {
      47: [2, 18]
    }, o($V2, [2, 14]), {
      33: [1, 114]
    }, o($Vf, [2, 85]), {
      33: [2, 87]
    }, {
      33: [1, 115]
    }, {
      32: 116,
      33: [2, 60],
      73: 117,
      74: $Vv
    }, o($Vo, [2, 57]), o($Vs, [2, 59]), {
      33: [2, 66],
      37: 119,
      73: 120,
      74: $Vv
    }, o($Vo, [2, 63]), o($Vs, [2, 65]), {
      23: [1, 121]
    }, o($Vp, [2, 49]), {
      23: [2, 51]
    }, {
      33: [1, 122]
    }, o($Vf, [2, 89]), {
      33: [2, 91]
    }, o($V2, [2, 22]), o($Vt, [2, 97]), {
      72: $Vu
    }, {
      20: 26,
      49: 123,
      63: 27,
      64: $V3,
      71: $V4,
      77: 28,
      78: 29,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va,
      85: 36
    }, {
      67: [1, 124]
    }, o($Vr, [2, 93]), {
      67: [2, 95]
    }, o($V2, [2, 23]), {
      47: [2, 19]
    }, {
      47: [2, 75]
    }, o($Vs, [2, 70], {
      20: 26,
      63: 27,
      77: 28,
      78: 29,
      85: 36,
      69: 74,
      70: 75,
      41: 125,
      49: 126,
      68: 127,
      64: $V3,
      71: $Vq,
      79: $V5,
      80: $V6,
      81: $V7,
      82: $V8,
      83: $V9,
      84: $Va
    }), o($V2, [2, 24]), o($V2, [2, 21]), {
      33: [1, 128]
    }, {
      33: [2, 61]
    }, {
      71: [1, 130],
      75: 129
    }, {
      33: [1, 131]
    }, {
      33: [2, 67]
    }, o($Vd, [2, 12]), o($Ve, [2, 26]), o($Vt, [2, 31]), o($Vg, [2, 29]), {
      33: [2, 72],
      42: 132,
      73: 133,
      74: $Vv
    }, o($Vo, [2, 69]), o($Vs, [2, 71]), o($Vb, [2, 15]), {
      71: [1, 135],
      76: [1, 134]
    }, o($Vw, [2, 98]), o($Vc, [2, 16]), {
      33: [1, 136]
    }, {
      33: [2, 73]
    }, {
      33: [2, 32]
    }, o($Vw, [2, 99]), o($Vb, [2, 17])],
    defaultActions: {
      4: [2, 1],
      55: [2, 53],
      57: [2, 20],
      61: [2, 55],
      73: [2, 79],
      81: [2, 83],
      85: [2, 18],
      89: [2, 87],
      99: [2, 51],
      102: [2, 91],
      109: [2, 95],
      111: [2, 19],
      112: [2, 75],
      117: [2, 61],
      120: [2, 67],
      133: [2, 73],
      134: [2, 32]
    },
    parseError: function parseError(str, hash) {
      if (hash.recoverable) {
        this.trace(str);
      } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
      }
    },
    parse: function parse(input) {
      var self = this,
        stack = [0],
        vstack = [null],
        lstack = [],
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        TERROR = 2,
        EOF = 1;
      var args = lstack.slice.call(arguments, 1);
      var lexer = Object.create(this.lexer);
      var sharedState = {
        yy: {}
      };
      for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
          sharedState.yy[k] = this.yy[k];
        }
      }
      lexer.setInput(input, sharedState.yy);
      sharedState.yy.lexer = lexer;
      sharedState.yy.parser = this;
      if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
      }
      var yyloc = lexer.yylloc;
      lstack.push(yyloc);
      var ranges = lexer.options && lexer.options.ranges;
      if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
      } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
      }
      var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        if (typeof token !== 'number') {
          token = self.symbols_[token] || token;
        }
        return token;
      };
      var symbol,
        state,
        action,
        r,
        yyval = {},
        p,
        len,
        newState,
        expected;
      while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
          action = this.defaultActions[state];
        } else {
          if (symbol === null || typeof symbol == 'undefined') {
            symbol = lex();
          }
          action = table[state] && table[state][symbol];
        }
        if (typeof action === 'undefined' || !action.length || !action[0]) {
          var errStr = '';
          expected = [];
          for (p in table[state]) {
            if (this.terminals_[p] && p > TERROR) {
              expected.push('\'' + this.terminals_[p] + '\'');
            }
          }
          if (lexer.showPosition) {
            errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
          } else {
            errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
          }
          this.parseError(errStr, {
            text: lexer.match,
            token: this.terminals_[symbol] || symbol,
            line: lexer.yylineno,
            loc: yyloc,
            expected: expected
          });
        }
        if (action[0] instanceof Array && action.length > 1) {
          throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
          case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            {
              yyleng = lexer.yyleng;
              yytext = lexer.yytext;
              yylineno = lexer.yylineno;
              yyloc = lexer.yylloc;
            }
            break;
          case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
              first_line: lstack[lstack.length - (len || 1)].first_line,
              last_line: lstack[lstack.length - 1].last_line,
              first_column: lstack[lstack.length - (len || 1)].first_column,
              last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
              yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
            if (typeof r !== 'undefined') {
              return r;
            }
            if (len) {
              stack = stack.slice(0, -1 * len * 2);
              vstack = vstack.slice(0, -1 * len);
              lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
          case 3:
            return true;
        }
      }
      return true;
    }
  };
  /* generated by jison-lex 0.3.4 */
  var lexer = function () {
    var lexer = {
      EOF: 1,
      parseError: function parseError(str, hash) {
        if (this.yy.parser) {
          this.yy.parser.parseError(str, hash);
        } else {
          throw new Error(str);
        }
      },
      // resets the lexer, sets new input
      setInput: function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
          first_line: 1,
          first_column: 0,
          last_line: 1,
          last_column: 0
        };
        if (this.options.ranges) {
          this.yylloc.range = [0, 0];
        }
        this.offset = 0;
        return this;
      },
      // consumes and returns one char from the input
      input: function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno++;
          this.yylloc.last_line++;
        } else {
          this.yylloc.last_column++;
        }
        if (this.options.ranges) {
          this.yylloc.range[1]++;
        }
        this._input = this._input.slice(1);
        return ch;
      },
      // unshifts one char (or a string) into the input
      unput: function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);
        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);
        if (lines.length - 1) {
          this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;
        this.yylloc = {
          first_line: this.yylloc.first_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.first_column,
          last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
        };
        if (this.options.ranges) {
          this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
      },
      // When called from action, caches matched text and appends it on next action
      more: function () {
        this._more = true;
        return this;
      },
      // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
      reject: function () {
        if (this.options.backtrack_lexer) {
          this._backtrack = true;
        } else {
          return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
        return this;
      },
      // retain first n characters of the match
      less: function (n) {
        this.unput(this.match.slice(n));
      },
      // displays already matched input, i.e. for error messages
      pastInput: function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...' : '') + past.substr(-20).replace(/\n/g, "");
      },
      // displays upcoming input, i.e. for error messages
      upcomingInput: function () {
        var next = this.match;
        if (next.length < 20) {
          next += this._input.substr(0, 20 - next.length);
        }
        return (next.substr(0, 20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
      },
      // displays the character position where the lexing error occurred, i.e. for error messages
      showPosition: function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
      },
      // test the lexed token: return FALSE when not a match, otherwise return token
      test_match: function (match, indexed_rule) {
        var token, lines, backup;
        if (this.options.backtrack_lexer) {
          // save context
          backup = {
            yylineno: this.yylineno,
            yylloc: {
              first_line: this.yylloc.first_line,
              last_line: this.last_line,
              first_column: this.yylloc.first_column,
              last_column: this.yylloc.last_column
            },
            yytext: this.yytext,
            match: this.match,
            matches: this.matches,
            matched: this.matched,
            yyleng: this.yyleng,
            offset: this.offset,
            _more: this._more,
            _input: this._input,
            yy: this.yy,
            conditionStack: this.conditionStack.slice(0),
            done: this.done
          };
          if (this.options.ranges) {
            backup.yylloc.range = this.yylloc.range.slice(0);
          }
        }
        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
          this.yylineno += lines.length;
        }
        this.yylloc = {
          first_line: this.yylloc.last_line,
          last_line: this.yylineno + 1,
          first_column: this.yylloc.last_column,
          last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
          this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
          this.done = false;
        }
        if (token) {
          return token;
        } else if (this._backtrack) {
          // recover context
          for (var k in backup) {
            this[k] = backup[k];
          }
          return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
      },
      // return next match in input
      next: function () {
        if (this.done) {
          return this.EOF;
        }
        if (!this._input) {
          this.done = true;
        }
        var token, match, tempMatch, index;
        if (!this._more) {
          this.yytext = '';
          this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
          tempMatch = this._input.match(this.rules[rules[i]]);
          if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
            match = tempMatch;
            index = i;
            if (this.options.backtrack_lexer) {
              token = this.test_match(tempMatch, rules[i]);
              if (token !== false) {
                return token;
              } else if (this._backtrack) {
                match = false;
                continue; // rule action called reject() implying a rule MISmatch.
              } else {
                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                return false;
              }
            } else if (!this.options.flex) {
              break;
            }
          }
        }
        if (match) {
          token = this.test_match(match, rules[index]);
          if (token !== false) {
            return token;
          }
          // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
          return false;
        }
        if (this._input === "") {
          return this.EOF;
        } else {
          return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
            text: "",
            token: null,
            line: this.yylineno
          });
        }
      },
      // return next match that has a token
      lex: function lex() {
        var r = this.next();
        if (r) {
          return r;
        } else {
          return this.lex();
        }
      },
      // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
      begin: function begin(condition) {
        this.conditionStack.push(condition);
      },
      // pop the previously active lexer condition state off the condition stack
      popState: function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
          return this.conditionStack.pop();
        } else {
          return this.conditionStack[0];
        }
      },
      // produce the lexer rule set which is active for the currently active lexer condition state
      _currentRules: function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
          return this.conditions["INITIAL"].rules;
        }
      },
      // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
      topState: function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
          return this.conditionStack[n];
        } else {
          return "INITIAL";
        }
      },
      // alias for begin(condition)
      pushState: function pushState(condition) {
        this.begin(condition);
      },
      // return the number of states currently on the stack
      stateStackSize: function stateStackSize() {
        return this.conditionStack.length;
      },
      options: {},
      performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        function strip(start, end) {
          return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
        }
        switch ($avoiding_name_collisions) {
          case 0:
            if (yy_.yytext.slice(-2) === "\\\\") {
              strip(0, 1);
              this.begin("mu");
            } else if (yy_.yytext.slice(-1) === "\\") {
              strip(0, 1);
              this.begin("emu");
            } else {
              this.begin("mu");
            }
            if (yy_.yytext) return 15;
            break;
          case 1:
            return 15;
          case 2:
            this.popState();
            return 15;
          case 3:
            this.begin('raw');
            return 15;
          case 4:
            this.popState();
            // Should be using `this.topState()` below, but it currently
            // returns the second top instead of the first top. Opened an
            // issue about it at https://github.com/zaach/jison/issues/291
            if (this.conditionStack[this.conditionStack.length - 1] === 'raw') {
              return 15;
            } else {
              strip(5, 9);
              return 18;
            }
          case 5:
            return 15;
          case 6:
            this.popState();
            return 14;
          case 7:
            return 64;
          case 8:
            return 67;
          case 9:
            return 19;
          case 10:
            this.popState();
            this.begin('raw');
            return 23;
          case 11:
            return 56;
          case 12:
            return 60;
          case 13:
            return 29;
          case 14:
            return 47;
          case 15:
            this.popState();
            return 44;
          case 16:
            this.popState();
            return 44;
          case 17:
            return 34;
          case 18:
            return 39;
          case 19:
            return 52;
          case 20:
            return 48;
          case 21:
            this.unput(yy_.yytext);
            this.popState();
            this.begin('com');
            break;
          case 22:
            this.popState();
            return 14;
          case 23:
            return 48;
          case 24:
            return 72;
          case 25:
            return 71;
          case 26:
            return 71;
          case 27:
            return 86;
          case 28:
            // ignore whitespace
            break;
          case 29:
            this.popState();
            return 55;
          case 30:
            this.popState();
            return 33;
          case 31:
            yy_.yytext = strip(1, 2).replace(/\\"/g, '"');
            return 79;
          case 32:
            yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
            return 79;
          case 33:
            return 84;
          case 34:
            return 81;
          case 35:
            return 81;
          case 36:
            return 82;
          case 37:
            return 83;
          case 38:
            return 80;
          case 39:
            return 74;
          case 40:
            return 76;
          case 41:
            return 71;
          case 42:
            yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, '$1');
            return 71;
          case 43:
            return 'INVALID';
          case 44:
            return 5;
        }
      },
      rules: [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]+?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/],
      conditions: {
        "mu": {
          "rules": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
          "inclusive": false
        },
        "emu": {
          "rules": [2],
          "inclusive": false
        },
        "com": {
          "rules": [6],
          "inclusive": false
        },
        "raw": {
          "rules": [3, 4, 5],
          "inclusive": false
        },
        "INITIAL": {
          "rules": [0, 1, 44],
          "inclusive": true
        }
      }
    };
    return lexer;
  }();
  parser.lexer = lexer;
  function Parser() {
    this.yy = {};
  }
  Parser.prototype = parser;
  parser.Parser = Parser;
  return new Parser();
}();

function validateClose(open, close) {
  close = close.path ? close.path.original : close;
  if (open.path.original !== close) {
    var errorNode = {
      loc: open.path.loc
    };
    throw new Exception(open.path.original + " doesn't match " + close, errorNode);
  }
}
function SourceLocation(source, locInfo) {
  this.source = source;
  this.start = {
    line: locInfo.first_line,
    column: locInfo.first_column
  };
  this.end = {
    line: locInfo.last_line,
    column: locInfo.last_column
  };
}
function id(token) {
  if (/^\[.*\]$/.test(token)) {
    return token.substring(1, token.length - 1);
  } else {
    return token;
  }
}
function stripFlags(open, close) {
  return {
    open: open.charAt(2) === '~',
    close: close.charAt(close.length - 3) === '~'
  };
}
function stripComment(comment) {
  return comment.replace(/^\{\{~?!-?-?/, '').replace(/-?-?~?\}\}$/, '');
}
function preparePath(data, parts, loc) {
  loc = this.locInfo(loc);
  var original = data ? '@' : '',
    dig = [],
    depth = 0;
  for (var i = 0, l = parts.length; i < l; i++) {
    var part = parts[i].part,
      // If we have [] syntax then we do not treat path references as operators,
      // i.e. foo.[this] resolves to approximately context.foo['this']
      isLiteral = parts[i].original !== part;
    original += (parts[i].separator || '') + part;
    if (!isLiteral && (part === '..' || part === '.' || part === 'this')) {
      if (dig.length > 0) {
        throw new Exception('Invalid path: ' + original, {
          loc: loc
        });
      } else if (part === '..') {
        depth++;
      }
    } else {
      dig.push(part);
    }
  }
  return {
    type: 'PathExpression',
    data: data,
    depth: depth,
    parts: dig,
    original: original,
    loc: loc
  };
}
function prepareMustache(path, params, hash, open, strip, locInfo) {
  // Must use charAt to support IE pre-10
  var escapeFlag = open.charAt(3) || open.charAt(2),
    escaped = escapeFlag !== '{' && escapeFlag !== '&';
  var decorator = /\*/.test(open);
  return {
    type: decorator ? 'Decorator' : 'MustacheStatement',
    path: path,
    params: params,
    hash: hash,
    escaped: escaped,
    strip: strip,
    loc: this.locInfo(locInfo)
  };
}
function prepareRawBlock(openRawBlock, contents, close, locInfo) {
  validateClose(openRawBlock, close);
  locInfo = this.locInfo(locInfo);
  var program = {
    type: 'Program',
    body: contents,
    strip: {},
    loc: locInfo
  };
  return {
    type: 'BlockStatement',
    path: openRawBlock.path,
    params: openRawBlock.params,
    hash: openRawBlock.hash,
    program: program,
    openStrip: {},
    inverseStrip: {},
    closeStrip: {},
    loc: locInfo
  };
}
function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
  if (close && close.path) {
    validateClose(openBlock, close);
  }
  var decorator = /\*/.test(openBlock.open);
  program.blockParams = openBlock.blockParams;
  var inverse, inverseStrip;
  if (inverseAndProgram) {
    if (decorator) {
      throw new Exception('Unexpected inverse block on decorator', inverseAndProgram);
    }
    if (inverseAndProgram.chain) {
      inverseAndProgram.program.body[0].closeStrip = close.strip;
    }
    inverseStrip = inverseAndProgram.strip;
    inverse = inverseAndProgram.program;
  }
  if (inverted) {
    inverted = inverse;
    inverse = program;
    program = inverted;
  }
  return {
    type: decorator ? 'DecoratorBlock' : 'BlockStatement',
    path: openBlock.path,
    params: openBlock.params,
    hash: openBlock.hash,
    program: program,
    inverse: inverse,
    openStrip: openBlock.strip,
    inverseStrip: inverseStrip,
    closeStrip: close && close.strip,
    loc: this.locInfo(locInfo)
  };
}
function prepareProgram(statements, loc) {
  if (!loc && statements.length) {
    var firstLoc = statements[0].loc,
      lastLoc = statements[statements.length - 1].loc;
    /* istanbul ignore else */
    if (firstLoc && lastLoc) {
      loc = {
        source: firstLoc.source,
        start: {
          line: firstLoc.start.line,
          column: firstLoc.start.column
        },
        end: {
          line: lastLoc.end.line,
          column: lastLoc.end.column
        }
      };
    }
  }
  return {
    type: 'Program',
    body: statements,
    strip: {},
    loc: loc
  };
}
function preparePartialBlock(open, program, close, locInfo) {
  validateClose(open, close);
  return {
    type: 'PartialBlockStatement',
    name: open.path,
    params: open.params,
    hash: open.hash,
    program: program,
    openStrip: open.strip,
    closeStrip: close && close.strip,
    loc: this.locInfo(locInfo)
  };
}

const Helpers = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    SourceLocation,
    id,
    prepareBlock,
    prepareMustache,
    preparePartialBlock,
    preparePath,
    prepareProgram,
    prepareRawBlock,
    stripComment,
    stripFlags
}, Symbol.toStringTag, { value: 'Module' }));

var baseHelpers = {};
for (var helper in Helpers) {
  if (Object.prototype.hasOwnProperty.call(Helpers, helper)) {
    baseHelpers[helper] = Helpers[helper];
  }
}
function parseWithoutProcessing(input, options) {
  // Just return if an already-compiled AST was passed in.
  if (input.type === 'Program') {
    return input;
  }
  parser.yy = baseHelpers;
  // Altering the shared object here, but this is ok as parser is a sync operation
  parser.yy.locInfo = function (locInfo) {
    return new SourceLocation(options && options.srcName, locInfo);
  };
  var ast = parser.parse(input);
  return ast;
}
function parse(input, options) {
  var ast = parseWithoutProcessing(input, options);
  var strip = new WhitespaceControl(options);
  return strip.accept(ast);
}

/**
 * generated from https://raw.githubusercontent.com/w3c/html/26b5126f96f736f796b9e29718138919dd513744/entities.json
 * do not edit
 */
var namedCharRefs = {
  Aacute: "Á",
  aacute: "á",
  Abreve: "Ă",
  abreve: "ă",
  ac: "∾",
  acd: "∿",
  acE: "∾̳",
  Acirc: "Â",
  acirc: "â",
  acute: "´",
  Acy: "А",
  acy: "а",
  AElig: "Æ",
  aelig: "æ",
  af: "\u2061",
  Afr: "𝔄",
  afr: "𝔞",
  Agrave: "À",
  agrave: "à",
  alefsym: "ℵ",
  aleph: "ℵ",
  Alpha: "Α",
  alpha: "α",
  Amacr: "Ā",
  amacr: "ā",
  amalg: "⨿",
  amp: "&",
  AMP: "&",
  andand: "⩕",
  And: "⩓",
  and: "∧",
  andd: "⩜",
  andslope: "⩘",
  andv: "⩚",
  ang: "∠",
  ange: "⦤",
  angle: "∠",
  angmsdaa: "⦨",
  angmsdab: "⦩",
  angmsdac: "⦪",
  angmsdad: "⦫",
  angmsdae: "⦬",
  angmsdaf: "⦭",
  angmsdag: "⦮",
  angmsdah: "⦯",
  angmsd: "∡",
  angrt: "∟",
  angrtvb: "⊾",
  angrtvbd: "⦝",
  angsph: "∢",
  angst: "Å",
  angzarr: "⍼",
  Aogon: "Ą",
  aogon: "ą",
  Aopf: "𝔸",
  aopf: "𝕒",
  apacir: "⩯",
  ap: "≈",
  apE: "⩰",
  ape: "≊",
  apid: "≋",
  apos: "'",
  ApplyFunction: "\u2061",
  approx: "≈",
  approxeq: "≊",
  Aring: "Å",
  aring: "å",
  Ascr: "𝒜",
  ascr: "𝒶",
  Assign: "≔",
  ast: "*",
  asymp: "≈",
  asympeq: "≍",
  Atilde: "Ã",
  atilde: "ã",
  Auml: "Ä",
  auml: "ä",
  awconint: "∳",
  awint: "⨑",
  backcong: "≌",
  backepsilon: "϶",
  backprime: "‵",
  backsim: "∽",
  backsimeq: "⋍",
  Backslash: "∖",
  Barv: "⫧",
  barvee: "⊽",
  barwed: "⌅",
  Barwed: "⌆",
  barwedge: "⌅",
  bbrk: "⎵",
  bbrktbrk: "⎶",
  bcong: "≌",
  Bcy: "Б",
  bcy: "б",
  bdquo: "„",
  becaus: "∵",
  because: "∵",
  Because: "∵",
  bemptyv: "⦰",
  bepsi: "϶",
  bernou: "ℬ",
  Bernoullis: "ℬ",
  Beta: "Β",
  beta: "β",
  beth: "ℶ",
  between: "≬",
  Bfr: "𝔅",
  bfr: "𝔟",
  bigcap: "⋂",
  bigcirc: "◯",
  bigcup: "⋃",
  bigodot: "⨀",
  bigoplus: "⨁",
  bigotimes: "⨂",
  bigsqcup: "⨆",
  bigstar: "★",
  bigtriangledown: "▽",
  bigtriangleup: "△",
  biguplus: "⨄",
  bigvee: "⋁",
  bigwedge: "⋀",
  bkarow: "⤍",
  blacklozenge: "⧫",
  blacksquare: "▪",
  blacktriangle: "▴",
  blacktriangledown: "▾",
  blacktriangleleft: "◂",
  blacktriangleright: "▸",
  blank: "␣",
  blk12: "▒",
  blk14: "░",
  blk34: "▓",
  block: "█",
  bne: "=⃥",
  bnequiv: "≡⃥",
  bNot: "⫭",
  bnot: "⌐",
  Bopf: "𝔹",
  bopf: "𝕓",
  bot: "⊥",
  bottom: "⊥",
  bowtie: "⋈",
  boxbox: "⧉",
  boxdl: "┐",
  boxdL: "╕",
  boxDl: "╖",
  boxDL: "╗",
  boxdr: "┌",
  boxdR: "╒",
  boxDr: "╓",
  boxDR: "╔",
  boxh: "─",
  boxH: "═",
  boxhd: "┬",
  boxHd: "╤",
  boxhD: "╥",
  boxHD: "╦",
  boxhu: "┴",
  boxHu: "╧",
  boxhU: "╨",
  boxHU: "╩",
  boxminus: "⊟",
  boxplus: "⊞",
  boxtimes: "⊠",
  boxul: "┘",
  boxuL: "╛",
  boxUl: "╜",
  boxUL: "╝",
  boxur: "└",
  boxuR: "╘",
  boxUr: "╙",
  boxUR: "╚",
  boxv: "│",
  boxV: "║",
  boxvh: "┼",
  boxvH: "╪",
  boxVh: "╫",
  boxVH: "╬",
  boxvl: "┤",
  boxvL: "╡",
  boxVl: "╢",
  boxVL: "╣",
  boxvr: "├",
  boxvR: "╞",
  boxVr: "╟",
  boxVR: "╠",
  bprime: "‵",
  breve: "˘",
  Breve: "˘",
  brvbar: "¦",
  bscr: "𝒷",
  Bscr: "ℬ",
  bsemi: "⁏",
  bsim: "∽",
  bsime: "⋍",
  bsolb: "⧅",
  bsol: "\\",
  bsolhsub: "⟈",
  bull: "•",
  bullet: "•",
  bump: "≎",
  bumpE: "⪮",
  bumpe: "≏",
  Bumpeq: "≎",
  bumpeq: "≏",
  Cacute: "Ć",
  cacute: "ć",
  capand: "⩄",
  capbrcup: "⩉",
  capcap: "⩋",
  cap: "∩",
  Cap: "⋒",
  capcup: "⩇",
  capdot: "⩀",
  CapitalDifferentialD: "ⅅ",
  caps: "∩︀",
  caret: "⁁",
  caron: "ˇ",
  Cayleys: "ℭ",
  ccaps: "⩍",
  Ccaron: "Č",
  ccaron: "č",
  Ccedil: "Ç",
  ccedil: "ç",
  Ccirc: "Ĉ",
  ccirc: "ĉ",
  Cconint: "∰",
  ccups: "⩌",
  ccupssm: "⩐",
  Cdot: "Ċ",
  cdot: "ċ",
  cedil: "¸",
  Cedilla: "¸",
  cemptyv: "⦲",
  cent: "¢",
  centerdot: "·",
  CenterDot: "·",
  cfr: "𝔠",
  Cfr: "ℭ",
  CHcy: "Ч",
  chcy: "ч",
  check: "✓",
  checkmark: "✓",
  Chi: "Χ",
  chi: "χ",
  circ: "ˆ",
  circeq: "≗",
  circlearrowleft: "↺",
  circlearrowright: "↻",
  circledast: "⊛",
  circledcirc: "⊚",
  circleddash: "⊝",
  CircleDot: "⊙",
  circledR: "®",
  circledS: "Ⓢ",
  CircleMinus: "⊖",
  CirclePlus: "⊕",
  CircleTimes: "⊗",
  cir: "○",
  cirE: "⧃",
  cire: "≗",
  cirfnint: "⨐",
  cirmid: "⫯",
  cirscir: "⧂",
  ClockwiseContourIntegral: "∲",
  CloseCurlyDoubleQuote: "”",
  CloseCurlyQuote: "’",
  clubs: "♣",
  clubsuit: "♣",
  colon: ":",
  Colon: "∷",
  Colone: "⩴",
  colone: "≔",
  coloneq: "≔",
  comma: ",",
  commat: "@",
  comp: "∁",
  compfn: "∘",
  complement: "∁",
  complexes: "ℂ",
  cong: "≅",
  congdot: "⩭",
  Congruent: "≡",
  conint: "∮",
  Conint: "∯",
  ContourIntegral: "∮",
  copf: "𝕔",
  Copf: "ℂ",
  coprod: "∐",
  Coproduct: "∐",
  copy: "©",
  COPY: "©",
  copysr: "℗",
  CounterClockwiseContourIntegral: "∳",
  crarr: "↵",
  cross: "✗",
  Cross: "⨯",
  Cscr: "𝒞",
  cscr: "𝒸",
  csub: "⫏",
  csube: "⫑",
  csup: "⫐",
  csupe: "⫒",
  ctdot: "⋯",
  cudarrl: "⤸",
  cudarrr: "⤵",
  cuepr: "⋞",
  cuesc: "⋟",
  cularr: "↶",
  cularrp: "⤽",
  cupbrcap: "⩈",
  cupcap: "⩆",
  CupCap: "≍",
  cup: "∪",
  Cup: "⋓",
  cupcup: "⩊",
  cupdot: "⊍",
  cupor: "⩅",
  cups: "∪︀",
  curarr: "↷",
  curarrm: "⤼",
  curlyeqprec: "⋞",
  curlyeqsucc: "⋟",
  curlyvee: "⋎",
  curlywedge: "⋏",
  curren: "¤",
  curvearrowleft: "↶",
  curvearrowright: "↷",
  cuvee: "⋎",
  cuwed: "⋏",
  cwconint: "∲",
  cwint: "∱",
  cylcty: "⌭",
  dagger: "†",
  Dagger: "‡",
  daleth: "ℸ",
  darr: "↓",
  Darr: "↡",
  dArr: "⇓",
  dash: "‐",
  Dashv: "⫤",
  dashv: "⊣",
  dbkarow: "⤏",
  dblac: "˝",
  Dcaron: "Ď",
  dcaron: "ď",
  Dcy: "Д",
  dcy: "д",
  ddagger: "‡",
  ddarr: "⇊",
  DD: "ⅅ",
  dd: "ⅆ",
  DDotrahd: "⤑",
  ddotseq: "⩷",
  deg: "°",
  Del: "∇",
  Delta: "Δ",
  delta: "δ",
  demptyv: "⦱",
  dfisht: "⥿",
  Dfr: "𝔇",
  dfr: "𝔡",
  dHar: "⥥",
  dharl: "⇃",
  dharr: "⇂",
  DiacriticalAcute: "´",
  DiacriticalDot: "˙",
  DiacriticalDoubleAcute: "˝",
  DiacriticalGrave: "`",
  DiacriticalTilde: "˜",
  diam: "⋄",
  diamond: "⋄",
  Diamond: "⋄",
  diamondsuit: "♦",
  diams: "♦",
  die: "¨",
  DifferentialD: "ⅆ",
  digamma: "ϝ",
  disin: "⋲",
  div: "÷",
  divide: "÷",
  divideontimes: "⋇",
  divonx: "⋇",
  DJcy: "Ђ",
  djcy: "ђ",
  dlcorn: "⌞",
  dlcrop: "⌍",
  dollar: "$",
  Dopf: "𝔻",
  dopf: "𝕕",
  Dot: "¨",
  dot: "˙",
  DotDot: "⃜",
  doteq: "≐",
  doteqdot: "≑",
  DotEqual: "≐",
  dotminus: "∸",
  dotplus: "∔",
  dotsquare: "⊡",
  doublebarwedge: "⌆",
  DoubleContourIntegral: "∯",
  DoubleDot: "¨",
  DoubleDownArrow: "⇓",
  DoubleLeftArrow: "⇐",
  DoubleLeftRightArrow: "⇔",
  DoubleLeftTee: "⫤",
  DoubleLongLeftArrow: "⟸",
  DoubleLongLeftRightArrow: "⟺",
  DoubleLongRightArrow: "⟹",
  DoubleRightArrow: "⇒",
  DoubleRightTee: "⊨",
  DoubleUpArrow: "⇑",
  DoubleUpDownArrow: "⇕",
  DoubleVerticalBar: "∥",
  DownArrowBar: "⤓",
  downarrow: "↓",
  DownArrow: "↓",
  Downarrow: "⇓",
  DownArrowUpArrow: "⇵",
  DownBreve: "̑",
  downdownarrows: "⇊",
  downharpoonleft: "⇃",
  downharpoonright: "⇂",
  DownLeftRightVector: "⥐",
  DownLeftTeeVector: "⥞",
  DownLeftVectorBar: "⥖",
  DownLeftVector: "↽",
  DownRightTeeVector: "⥟",
  DownRightVectorBar: "⥗",
  DownRightVector: "⇁",
  DownTeeArrow: "↧",
  DownTee: "⊤",
  drbkarow: "⤐",
  drcorn: "⌟",
  drcrop: "⌌",
  Dscr: "𝒟",
  dscr: "𝒹",
  DScy: "Ѕ",
  dscy: "ѕ",
  dsol: "⧶",
  Dstrok: "Đ",
  dstrok: "đ",
  dtdot: "⋱",
  dtri: "▿",
  dtrif: "▾",
  duarr: "⇵",
  duhar: "⥯",
  dwangle: "⦦",
  DZcy: "Џ",
  dzcy: "џ",
  dzigrarr: "⟿",
  Eacute: "É",
  eacute: "é",
  easter: "⩮",
  Ecaron: "Ě",
  ecaron: "ě",
  Ecirc: "Ê",
  ecirc: "ê",
  ecir: "≖",
  ecolon: "≕",
  Ecy: "Э",
  ecy: "э",
  eDDot: "⩷",
  Edot: "Ė",
  edot: "ė",
  eDot: "≑",
  ee: "ⅇ",
  efDot: "≒",
  Efr: "𝔈",
  efr: "𝔢",
  eg: "⪚",
  Egrave: "È",
  egrave: "è",
  egs: "⪖",
  egsdot: "⪘",
  el: "⪙",
  Element: "∈",
  elinters: "⏧",
  ell: "ℓ",
  els: "⪕",
  elsdot: "⪗",
  Emacr: "Ē",
  emacr: "ē",
  empty: "∅",
  emptyset: "∅",
  EmptySmallSquare: "◻",
  emptyv: "∅",
  EmptyVerySmallSquare: "▫",
  emsp13: " ",
  emsp14: " ",
  emsp: " ",
  ENG: "Ŋ",
  eng: "ŋ",
  ensp: " ",
  Eogon: "Ę",
  eogon: "ę",
  Eopf: "𝔼",
  eopf: "𝕖",
  epar: "⋕",
  eparsl: "⧣",
  eplus: "⩱",
  epsi: "ε",
  Epsilon: "Ε",
  epsilon: "ε",
  epsiv: "ϵ",
  eqcirc: "≖",
  eqcolon: "≕",
  eqsim: "≂",
  eqslantgtr: "⪖",
  eqslantless: "⪕",
  Equal: "⩵",
  equals: "=",
  EqualTilde: "≂",
  equest: "≟",
  Equilibrium: "⇌",
  equiv: "≡",
  equivDD: "⩸",
  eqvparsl: "⧥",
  erarr: "⥱",
  erDot: "≓",
  escr: "ℯ",
  Escr: "ℰ",
  esdot: "≐",
  Esim: "⩳",
  esim: "≂",
  Eta: "Η",
  eta: "η",
  ETH: "Ð",
  eth: "ð",
  Euml: "Ë",
  euml: "ë",
  euro: "€",
  excl: "!",
  exist: "∃",
  Exists: "∃",
  expectation: "ℰ",
  exponentiale: "ⅇ",
  ExponentialE: "ⅇ",
  fallingdotseq: "≒",
  Fcy: "Ф",
  fcy: "ф",
  female: "♀",
  ffilig: "ﬃ",
  fflig: "ﬀ",
  ffllig: "ﬄ",
  Ffr: "𝔉",
  ffr: "𝔣",
  filig: "ﬁ",
  FilledSmallSquare: "◼",
  FilledVerySmallSquare: "▪",
  fjlig: "fj",
  flat: "♭",
  fllig: "ﬂ",
  fltns: "▱",
  fnof: "ƒ",
  Fopf: "𝔽",
  fopf: "𝕗",
  forall: "∀",
  ForAll: "∀",
  fork: "⋔",
  forkv: "⫙",
  Fouriertrf: "ℱ",
  fpartint: "⨍",
  frac12: "½",
  frac13: "⅓",
  frac14: "¼",
  frac15: "⅕",
  frac16: "⅙",
  frac18: "⅛",
  frac23: "⅔",
  frac25: "⅖",
  frac34: "¾",
  frac35: "⅗",
  frac38: "⅜",
  frac45: "⅘",
  frac56: "⅚",
  frac58: "⅝",
  frac78: "⅞",
  frasl: "⁄",
  frown: "⌢",
  fscr: "𝒻",
  Fscr: "ℱ",
  gacute: "ǵ",
  Gamma: "Γ",
  gamma: "γ",
  Gammad: "Ϝ",
  gammad: "ϝ",
  gap: "⪆",
  Gbreve: "Ğ",
  gbreve: "ğ",
  Gcedil: "Ģ",
  Gcirc: "Ĝ",
  gcirc: "ĝ",
  Gcy: "Г",
  gcy: "г",
  Gdot: "Ġ",
  gdot: "ġ",
  ge: "≥",
  gE: "≧",
  gEl: "⪌",
  gel: "⋛",
  geq: "≥",
  geqq: "≧",
  geqslant: "⩾",
  gescc: "⪩",
  ges: "⩾",
  gesdot: "⪀",
  gesdoto: "⪂",
  gesdotol: "⪄",
  gesl: "⋛︀",
  gesles: "⪔",
  Gfr: "𝔊",
  gfr: "𝔤",
  gg: "≫",
  Gg: "⋙",
  ggg: "⋙",
  gimel: "ℷ",
  GJcy: "Ѓ",
  gjcy: "ѓ",
  gla: "⪥",
  gl: "≷",
  glE: "⪒",
  glj: "⪤",
  gnap: "⪊",
  gnapprox: "⪊",
  gne: "⪈",
  gnE: "≩",
  gneq: "⪈",
  gneqq: "≩",
  gnsim: "⋧",
  Gopf: "𝔾",
  gopf: "𝕘",
  grave: "`",
  GreaterEqual: "≥",
  GreaterEqualLess: "⋛",
  GreaterFullEqual: "≧",
  GreaterGreater: "⪢",
  GreaterLess: "≷",
  GreaterSlantEqual: "⩾",
  GreaterTilde: "≳",
  Gscr: "𝒢",
  gscr: "ℊ",
  gsim: "≳",
  gsime: "⪎",
  gsiml: "⪐",
  gtcc: "⪧",
  gtcir: "⩺",
  gt: ">",
  GT: ">",
  Gt: "≫",
  gtdot: "⋗",
  gtlPar: "⦕",
  gtquest: "⩼",
  gtrapprox: "⪆",
  gtrarr: "⥸",
  gtrdot: "⋗",
  gtreqless: "⋛",
  gtreqqless: "⪌",
  gtrless: "≷",
  gtrsim: "≳",
  gvertneqq: "≩︀",
  gvnE: "≩︀",
  Hacek: "ˇ",
  hairsp: " ",
  half: "½",
  hamilt: "ℋ",
  HARDcy: "Ъ",
  hardcy: "ъ",
  harrcir: "⥈",
  harr: "↔",
  hArr: "⇔",
  harrw: "↭",
  Hat: "^",
  hbar: "ℏ",
  Hcirc: "Ĥ",
  hcirc: "ĥ",
  hearts: "♥",
  heartsuit: "♥",
  hellip: "…",
  hercon: "⊹",
  hfr: "𝔥",
  Hfr: "ℌ",
  HilbertSpace: "ℋ",
  hksearow: "⤥",
  hkswarow: "⤦",
  hoarr: "⇿",
  homtht: "∻",
  hookleftarrow: "↩",
  hookrightarrow: "↪",
  hopf: "𝕙",
  Hopf: "ℍ",
  horbar: "―",
  HorizontalLine: "─",
  hscr: "𝒽",
  Hscr: "ℋ",
  hslash: "ℏ",
  Hstrok: "Ħ",
  hstrok: "ħ",
  HumpDownHump: "≎",
  HumpEqual: "≏",
  hybull: "⁃",
  hyphen: "‐",
  Iacute: "Í",
  iacute: "í",
  ic: "\u2063",
  Icirc: "Î",
  icirc: "î",
  Icy: "И",
  icy: "и",
  Idot: "İ",
  IEcy: "Е",
  iecy: "е",
  iexcl: "¡",
  iff: "⇔",
  ifr: "𝔦",
  Ifr: "ℑ",
  Igrave: "Ì",
  igrave: "ì",
  ii: "ⅈ",
  iiiint: "⨌",
  iiint: "∭",
  iinfin: "⧜",
  iiota: "℩",
  IJlig: "Ĳ",
  ijlig: "ĳ",
  Imacr: "Ī",
  imacr: "ī",
  image: "ℑ",
  ImaginaryI: "ⅈ",
  imagline: "ℐ",
  imagpart: "ℑ",
  imath: "ı",
  Im: "ℑ",
  imof: "⊷",
  imped: "Ƶ",
  Implies: "⇒",
  incare: "℅",
  in: "∈",
  infin: "∞",
  infintie: "⧝",
  inodot: "ı",
  intcal: "⊺",
  int: "∫",
  Int: "∬",
  integers: "ℤ",
  Integral: "∫",
  intercal: "⊺",
  Intersection: "⋂",
  intlarhk: "⨗",
  intprod: "⨼",
  InvisibleComma: "\u2063",
  InvisibleTimes: "\u2062",
  IOcy: "Ё",
  iocy: "ё",
  Iogon: "Į",
  iogon: "į",
  Iopf: "𝕀",
  iopf: "𝕚",
  Iota: "Ι",
  iota: "ι",
  iprod: "⨼",
  iquest: "¿",
  iscr: "𝒾",
  Iscr: "ℐ",
  isin: "∈",
  isindot: "⋵",
  isinE: "⋹",
  isins: "⋴",
  isinsv: "⋳",
  isinv: "∈",
  it: "\u2062",
  Itilde: "Ĩ",
  itilde: "ĩ",
  Iukcy: "І",
  iukcy: "і",
  Iuml: "Ï",
  iuml: "ï",
  Jcirc: "Ĵ",
  jcirc: "ĵ",
  Jcy: "Й",
  jcy: "й",
  Jfr: "𝔍",
  jfr: "𝔧",
  jmath: "ȷ",
  Jopf: "𝕁",
  jopf: "𝕛",
  Jscr: "𝒥",
  jscr: "𝒿",
  Jsercy: "Ј",
  jsercy: "ј",
  Jukcy: "Є",
  jukcy: "є",
  Kappa: "Κ",
  kappa: "κ",
  kappav: "ϰ",
  Kcedil: "Ķ",
  kcedil: "ķ",
  Kcy: "К",
  kcy: "к",
  Kfr: "𝔎",
  kfr: "𝔨",
  kgreen: "ĸ",
  KHcy: "Х",
  khcy: "х",
  KJcy: "Ќ",
  kjcy: "ќ",
  Kopf: "𝕂",
  kopf: "𝕜",
  Kscr: "𝒦",
  kscr: "𝓀",
  lAarr: "⇚",
  Lacute: "Ĺ",
  lacute: "ĺ",
  laemptyv: "⦴",
  lagran: "ℒ",
  Lambda: "Λ",
  lambda: "λ",
  lang: "⟨",
  Lang: "⟪",
  langd: "⦑",
  langle: "⟨",
  lap: "⪅",
  Laplacetrf: "ℒ",
  laquo: "«",
  larrb: "⇤",
  larrbfs: "⤟",
  larr: "←",
  Larr: "↞",
  lArr: "⇐",
  larrfs: "⤝",
  larrhk: "↩",
  larrlp: "↫",
  larrpl: "⤹",
  larrsim: "⥳",
  larrtl: "↢",
  latail: "⤙",
  lAtail: "⤛",
  lat: "⪫",
  late: "⪭",
  lates: "⪭︀",
  lbarr: "⤌",
  lBarr: "⤎",
  lbbrk: "❲",
  lbrace: "{",
  lbrack: "[",
  lbrke: "⦋",
  lbrksld: "⦏",
  lbrkslu: "⦍",
  Lcaron: "Ľ",
  lcaron: "ľ",
  Lcedil: "Ļ",
  lcedil: "ļ",
  lceil: "⌈",
  lcub: "{",
  Lcy: "Л",
  lcy: "л",
  ldca: "⤶",
  ldquo: "“",
  ldquor: "„",
  ldrdhar: "⥧",
  ldrushar: "⥋",
  ldsh: "↲",
  le: "≤",
  lE: "≦",
  LeftAngleBracket: "⟨",
  LeftArrowBar: "⇤",
  leftarrow: "←",
  LeftArrow: "←",
  Leftarrow: "⇐",
  LeftArrowRightArrow: "⇆",
  leftarrowtail: "↢",
  LeftCeiling: "⌈",
  LeftDoubleBracket: "⟦",
  LeftDownTeeVector: "⥡",
  LeftDownVectorBar: "⥙",
  LeftDownVector: "⇃",
  LeftFloor: "⌊",
  leftharpoondown: "↽",
  leftharpoonup: "↼",
  leftleftarrows: "⇇",
  leftrightarrow: "↔",
  LeftRightArrow: "↔",
  Leftrightarrow: "⇔",
  leftrightarrows: "⇆",
  leftrightharpoons: "⇋",
  leftrightsquigarrow: "↭",
  LeftRightVector: "⥎",
  LeftTeeArrow: "↤",
  LeftTee: "⊣",
  LeftTeeVector: "⥚",
  leftthreetimes: "⋋",
  LeftTriangleBar: "⧏",
  LeftTriangle: "⊲",
  LeftTriangleEqual: "⊴",
  LeftUpDownVector: "⥑",
  LeftUpTeeVector: "⥠",
  LeftUpVectorBar: "⥘",
  LeftUpVector: "↿",
  LeftVectorBar: "⥒",
  LeftVector: "↼",
  lEg: "⪋",
  leg: "⋚",
  leq: "≤",
  leqq: "≦",
  leqslant: "⩽",
  lescc: "⪨",
  les: "⩽",
  lesdot: "⩿",
  lesdoto: "⪁",
  lesdotor: "⪃",
  lesg: "⋚︀",
  lesges: "⪓",
  lessapprox: "⪅",
  lessdot: "⋖",
  lesseqgtr: "⋚",
  lesseqqgtr: "⪋",
  LessEqualGreater: "⋚",
  LessFullEqual: "≦",
  LessGreater: "≶",
  lessgtr: "≶",
  LessLess: "⪡",
  lesssim: "≲",
  LessSlantEqual: "⩽",
  LessTilde: "≲",
  lfisht: "⥼",
  lfloor: "⌊",
  Lfr: "𝔏",
  lfr: "𝔩",
  lg: "≶",
  lgE: "⪑",
  lHar: "⥢",
  lhard: "↽",
  lharu: "↼",
  lharul: "⥪",
  lhblk: "▄",
  LJcy: "Љ",
  ljcy: "љ",
  llarr: "⇇",
  ll: "≪",
  Ll: "⋘",
  llcorner: "⌞",
  Lleftarrow: "⇚",
  llhard: "⥫",
  lltri: "◺",
  Lmidot: "Ŀ",
  lmidot: "ŀ",
  lmoustache: "⎰",
  lmoust: "⎰",
  lnap: "⪉",
  lnapprox: "⪉",
  lne: "⪇",
  lnE: "≨",
  lneq: "⪇",
  lneqq: "≨",
  lnsim: "⋦",
  loang: "⟬",
  loarr: "⇽",
  lobrk: "⟦",
  longleftarrow: "⟵",
  LongLeftArrow: "⟵",
  Longleftarrow: "⟸",
  longleftrightarrow: "⟷",
  LongLeftRightArrow: "⟷",
  Longleftrightarrow: "⟺",
  longmapsto: "⟼",
  longrightarrow: "⟶",
  LongRightArrow: "⟶",
  Longrightarrow: "⟹",
  looparrowleft: "↫",
  looparrowright: "↬",
  lopar: "⦅",
  Lopf: "𝕃",
  lopf: "𝕝",
  loplus: "⨭",
  lotimes: "⨴",
  lowast: "∗",
  lowbar: "_",
  LowerLeftArrow: "↙",
  LowerRightArrow: "↘",
  loz: "◊",
  lozenge: "◊",
  lozf: "⧫",
  lpar: "(",
  lparlt: "⦓",
  lrarr: "⇆",
  lrcorner: "⌟",
  lrhar: "⇋",
  lrhard: "⥭",
  lrm: "\u200e",
  lrtri: "⊿",
  lsaquo: "‹",
  lscr: "𝓁",
  Lscr: "ℒ",
  lsh: "↰",
  Lsh: "↰",
  lsim: "≲",
  lsime: "⪍",
  lsimg: "⪏",
  lsqb: "[",
  lsquo: "‘",
  lsquor: "‚",
  Lstrok: "Ł",
  lstrok: "ł",
  ltcc: "⪦",
  ltcir: "⩹",
  lt: "<",
  LT: "<",
  Lt: "≪",
  ltdot: "⋖",
  lthree: "⋋",
  ltimes: "⋉",
  ltlarr: "⥶",
  ltquest: "⩻",
  ltri: "◃",
  ltrie: "⊴",
  ltrif: "◂",
  ltrPar: "⦖",
  lurdshar: "⥊",
  luruhar: "⥦",
  lvertneqq: "≨︀",
  lvnE: "≨︀",
  macr: "¯",
  male: "♂",
  malt: "✠",
  maltese: "✠",
  Map: "⤅",
  map: "↦",
  mapsto: "↦",
  mapstodown: "↧",
  mapstoleft: "↤",
  mapstoup: "↥",
  marker: "▮",
  mcomma: "⨩",
  Mcy: "М",
  mcy: "м",
  mdash: "—",
  mDDot: "∺",
  measuredangle: "∡",
  MediumSpace: " ",
  Mellintrf: "ℳ",
  Mfr: "𝔐",
  mfr: "𝔪",
  mho: "℧",
  micro: "µ",
  midast: "*",
  midcir: "⫰",
  mid: "∣",
  middot: "·",
  minusb: "⊟",
  minus: "−",
  minusd: "∸",
  minusdu: "⨪",
  MinusPlus: "∓",
  mlcp: "⫛",
  mldr: "…",
  mnplus: "∓",
  models: "⊧",
  Mopf: "𝕄",
  mopf: "𝕞",
  mp: "∓",
  mscr: "𝓂",
  Mscr: "ℳ",
  mstpos: "∾",
  Mu: "Μ",
  mu: "μ",
  multimap: "⊸",
  mumap: "⊸",
  nabla: "∇",
  Nacute: "Ń",
  nacute: "ń",
  nang: "∠⃒",
  nap: "≉",
  napE: "⩰̸",
  napid: "≋̸",
  napos: "ŉ",
  napprox: "≉",
  natural: "♮",
  naturals: "ℕ",
  natur: "♮",
  nbsp: " ",
  nbump: "≎̸",
  nbumpe: "≏̸",
  ncap: "⩃",
  Ncaron: "Ň",
  ncaron: "ň",
  Ncedil: "Ņ",
  ncedil: "ņ",
  ncong: "≇",
  ncongdot: "⩭̸",
  ncup: "⩂",
  Ncy: "Н",
  ncy: "н",
  ndash: "–",
  nearhk: "⤤",
  nearr: "↗",
  neArr: "⇗",
  nearrow: "↗",
  ne: "≠",
  nedot: "≐̸",
  NegativeMediumSpace: "​",
  NegativeThickSpace: "​",
  NegativeThinSpace: "​",
  NegativeVeryThinSpace: "​",
  nequiv: "≢",
  nesear: "⤨",
  nesim: "≂̸",
  NestedGreaterGreater: "≫",
  NestedLessLess: "≪",
  NewLine: "\u000a",
  nexist: "∄",
  nexists: "∄",
  Nfr: "𝔑",
  nfr: "𝔫",
  ngE: "≧̸",
  nge: "≱",
  ngeq: "≱",
  ngeqq: "≧̸",
  ngeqslant: "⩾̸",
  nges: "⩾̸",
  nGg: "⋙̸",
  ngsim: "≵",
  nGt: "≫⃒",
  ngt: "≯",
  ngtr: "≯",
  nGtv: "≫̸",
  nharr: "↮",
  nhArr: "⇎",
  nhpar: "⫲",
  ni: "∋",
  nis: "⋼",
  nisd: "⋺",
  niv: "∋",
  NJcy: "Њ",
  njcy: "њ",
  nlarr: "↚",
  nlArr: "⇍",
  nldr: "‥",
  nlE: "≦̸",
  nle: "≰",
  nleftarrow: "↚",
  nLeftarrow: "⇍",
  nleftrightarrow: "↮",
  nLeftrightarrow: "⇎",
  nleq: "≰",
  nleqq: "≦̸",
  nleqslant: "⩽̸",
  nles: "⩽̸",
  nless: "≮",
  nLl: "⋘̸",
  nlsim: "≴",
  nLt: "≪⃒",
  nlt: "≮",
  nltri: "⋪",
  nltrie: "⋬",
  nLtv: "≪̸",
  nmid: "∤",
  NoBreak: "\u2060",
  NonBreakingSpace: " ",
  nopf: "𝕟",
  Nopf: "ℕ",
  Not: "⫬",
  not: "¬",
  NotCongruent: "≢",
  NotCupCap: "≭",
  NotDoubleVerticalBar: "∦",
  NotElement: "∉",
  NotEqual: "≠",
  NotEqualTilde: "≂̸",
  NotExists: "∄",
  NotGreater: "≯",
  NotGreaterEqual: "≱",
  NotGreaterFullEqual: "≧̸",
  NotGreaterGreater: "≫̸",
  NotGreaterLess: "≹",
  NotGreaterSlantEqual: "⩾̸",
  NotGreaterTilde: "≵",
  NotHumpDownHump: "≎̸",
  NotHumpEqual: "≏̸",
  notin: "∉",
  notindot: "⋵̸",
  notinE: "⋹̸",
  notinva: "∉",
  notinvb: "⋷",
  notinvc: "⋶",
  NotLeftTriangleBar: "⧏̸",
  NotLeftTriangle: "⋪",
  NotLeftTriangleEqual: "⋬",
  NotLess: "≮",
  NotLessEqual: "≰",
  NotLessGreater: "≸",
  NotLessLess: "≪̸",
  NotLessSlantEqual: "⩽̸",
  NotLessTilde: "≴",
  NotNestedGreaterGreater: "⪢̸",
  NotNestedLessLess: "⪡̸",
  notni: "∌",
  notniva: "∌",
  notnivb: "⋾",
  notnivc: "⋽",
  NotPrecedes: "⊀",
  NotPrecedesEqual: "⪯̸",
  NotPrecedesSlantEqual: "⋠",
  NotReverseElement: "∌",
  NotRightTriangleBar: "⧐̸",
  NotRightTriangle: "⋫",
  NotRightTriangleEqual: "⋭",
  NotSquareSubset: "⊏̸",
  NotSquareSubsetEqual: "⋢",
  NotSquareSuperset: "⊐̸",
  NotSquareSupersetEqual: "⋣",
  NotSubset: "⊂⃒",
  NotSubsetEqual: "⊈",
  NotSucceeds: "⊁",
  NotSucceedsEqual: "⪰̸",
  NotSucceedsSlantEqual: "⋡",
  NotSucceedsTilde: "≿̸",
  NotSuperset: "⊃⃒",
  NotSupersetEqual: "⊉",
  NotTilde: "≁",
  NotTildeEqual: "≄",
  NotTildeFullEqual: "≇",
  NotTildeTilde: "≉",
  NotVerticalBar: "∤",
  nparallel: "∦",
  npar: "∦",
  nparsl: "⫽⃥",
  npart: "∂̸",
  npolint: "⨔",
  npr: "⊀",
  nprcue: "⋠",
  nprec: "⊀",
  npreceq: "⪯̸",
  npre: "⪯̸",
  nrarrc: "⤳̸",
  nrarr: "↛",
  nrArr: "⇏",
  nrarrw: "↝̸",
  nrightarrow: "↛",
  nRightarrow: "⇏",
  nrtri: "⋫",
  nrtrie: "⋭",
  nsc: "⊁",
  nsccue: "⋡",
  nsce: "⪰̸",
  Nscr: "𝒩",
  nscr: "𝓃",
  nshortmid: "∤",
  nshortparallel: "∦",
  nsim: "≁",
  nsime: "≄",
  nsimeq: "≄",
  nsmid: "∤",
  nspar: "∦",
  nsqsube: "⋢",
  nsqsupe: "⋣",
  nsub: "⊄",
  nsubE: "⫅̸",
  nsube: "⊈",
  nsubset: "⊂⃒",
  nsubseteq: "⊈",
  nsubseteqq: "⫅̸",
  nsucc: "⊁",
  nsucceq: "⪰̸",
  nsup: "⊅",
  nsupE: "⫆̸",
  nsupe: "⊉",
  nsupset: "⊃⃒",
  nsupseteq: "⊉",
  nsupseteqq: "⫆̸",
  ntgl: "≹",
  Ntilde: "Ñ",
  ntilde: "ñ",
  ntlg: "≸",
  ntriangleleft: "⋪",
  ntrianglelefteq: "⋬",
  ntriangleright: "⋫",
  ntrianglerighteq: "⋭",
  Nu: "Ν",
  nu: "ν",
  num: "#",
  numero: "№",
  numsp: " ",
  nvap: "≍⃒",
  nvdash: "⊬",
  nvDash: "⊭",
  nVdash: "⊮",
  nVDash: "⊯",
  nvge: "≥⃒",
  nvgt: ">⃒",
  nvHarr: "⤄",
  nvinfin: "⧞",
  nvlArr: "⤂",
  nvle: "≤⃒",
  nvlt: "<⃒",
  nvltrie: "⊴⃒",
  nvrArr: "⤃",
  nvrtrie: "⊵⃒",
  nvsim: "∼⃒",
  nwarhk: "⤣",
  nwarr: "↖",
  nwArr: "⇖",
  nwarrow: "↖",
  nwnear: "⤧",
  Oacute: "Ó",
  oacute: "ó",
  oast: "⊛",
  Ocirc: "Ô",
  ocirc: "ô",
  ocir: "⊚",
  Ocy: "О",
  ocy: "о",
  odash: "⊝",
  Odblac: "Ő",
  odblac: "ő",
  odiv: "⨸",
  odot: "⊙",
  odsold: "⦼",
  OElig: "Œ",
  oelig: "œ",
  ofcir: "⦿",
  Ofr: "𝔒",
  ofr: "𝔬",
  ogon: "˛",
  Ograve: "Ò",
  ograve: "ò",
  ogt: "⧁",
  ohbar: "⦵",
  ohm: "Ω",
  oint: "∮",
  olarr: "↺",
  olcir: "⦾",
  olcross: "⦻",
  oline: "‾",
  olt: "⧀",
  Omacr: "Ō",
  omacr: "ō",
  Omega: "Ω",
  omega: "ω",
  Omicron: "Ο",
  omicron: "ο",
  omid: "⦶",
  ominus: "⊖",
  Oopf: "𝕆",
  oopf: "𝕠",
  opar: "⦷",
  OpenCurlyDoubleQuote: "“",
  OpenCurlyQuote: "‘",
  operp: "⦹",
  oplus: "⊕",
  orarr: "↻",
  Or: "⩔",
  or: "∨",
  ord: "⩝",
  order: "ℴ",
  orderof: "ℴ",
  ordf: "ª",
  ordm: "º",
  origof: "⊶",
  oror: "⩖",
  orslope: "⩗",
  orv: "⩛",
  oS: "Ⓢ",
  Oscr: "𝒪",
  oscr: "ℴ",
  Oslash: "Ø",
  oslash: "ø",
  osol: "⊘",
  Otilde: "Õ",
  otilde: "õ",
  otimesas: "⨶",
  Otimes: "⨷",
  otimes: "⊗",
  Ouml: "Ö",
  ouml: "ö",
  ovbar: "⌽",
  OverBar: "‾",
  OverBrace: "⏞",
  OverBracket: "⎴",
  OverParenthesis: "⏜",
  para: "¶",
  parallel: "∥",
  par: "∥",
  parsim: "⫳",
  parsl: "⫽",
  part: "∂",
  PartialD: "∂",
  Pcy: "П",
  pcy: "п",
  percnt: "%",
  period: ".",
  permil: "‰",
  perp: "⊥",
  pertenk: "‱",
  Pfr: "𝔓",
  pfr: "𝔭",
  Phi: "Φ",
  phi: "φ",
  phiv: "ϕ",
  phmmat: "ℳ",
  phone: "☎",
  Pi: "Π",
  pi: "π",
  pitchfork: "⋔",
  piv: "ϖ",
  planck: "ℏ",
  planckh: "ℎ",
  plankv: "ℏ",
  plusacir: "⨣",
  plusb: "⊞",
  pluscir: "⨢",
  plus: "+",
  plusdo: "∔",
  plusdu: "⨥",
  pluse: "⩲",
  PlusMinus: "±",
  plusmn: "±",
  plussim: "⨦",
  plustwo: "⨧",
  pm: "±",
  Poincareplane: "ℌ",
  pointint: "⨕",
  popf: "𝕡",
  Popf: "ℙ",
  pound: "£",
  prap: "⪷",
  Pr: "⪻",
  pr: "≺",
  prcue: "≼",
  precapprox: "⪷",
  prec: "≺",
  preccurlyeq: "≼",
  Precedes: "≺",
  PrecedesEqual: "⪯",
  PrecedesSlantEqual: "≼",
  PrecedesTilde: "≾",
  preceq: "⪯",
  precnapprox: "⪹",
  precneqq: "⪵",
  precnsim: "⋨",
  pre: "⪯",
  prE: "⪳",
  precsim: "≾",
  prime: "′",
  Prime: "″",
  primes: "ℙ",
  prnap: "⪹",
  prnE: "⪵",
  prnsim: "⋨",
  prod: "∏",
  Product: "∏",
  profalar: "⌮",
  profline: "⌒",
  profsurf: "⌓",
  prop: "∝",
  Proportional: "∝",
  Proportion: "∷",
  propto: "∝",
  prsim: "≾",
  prurel: "⊰",
  Pscr: "𝒫",
  pscr: "𝓅",
  Psi: "Ψ",
  psi: "ψ",
  puncsp: " ",
  Qfr: "𝔔",
  qfr: "𝔮",
  qint: "⨌",
  qopf: "𝕢",
  Qopf: "ℚ",
  qprime: "⁗",
  Qscr: "𝒬",
  qscr: "𝓆",
  quaternions: "ℍ",
  quatint: "⨖",
  quest: "?",
  questeq: "≟",
  quot: "\"",
  QUOT: "\"",
  rAarr: "⇛",
  race: "∽̱",
  Racute: "Ŕ",
  racute: "ŕ",
  radic: "√",
  raemptyv: "⦳",
  rang: "⟩",
  Rang: "⟫",
  rangd: "⦒",
  range: "⦥",
  rangle: "⟩",
  raquo: "»",
  rarrap: "⥵",
  rarrb: "⇥",
  rarrbfs: "⤠",
  rarrc: "⤳",
  rarr: "→",
  Rarr: "↠",
  rArr: "⇒",
  rarrfs: "⤞",
  rarrhk: "↪",
  rarrlp: "↬",
  rarrpl: "⥅",
  rarrsim: "⥴",
  Rarrtl: "⤖",
  rarrtl: "↣",
  rarrw: "↝",
  ratail: "⤚",
  rAtail: "⤜",
  ratio: "∶",
  rationals: "ℚ",
  rbarr: "⤍",
  rBarr: "⤏",
  RBarr: "⤐",
  rbbrk: "❳",
  rbrace: "}",
  rbrack: "]",
  rbrke: "⦌",
  rbrksld: "⦎",
  rbrkslu: "⦐",
  Rcaron: "Ř",
  rcaron: "ř",
  Rcedil: "Ŗ",
  rcedil: "ŗ",
  rceil: "⌉",
  rcub: "}",
  Rcy: "Р",
  rcy: "р",
  rdca: "⤷",
  rdldhar: "⥩",
  rdquo: "”",
  rdquor: "”",
  rdsh: "↳",
  real: "ℜ",
  realine: "ℛ",
  realpart: "ℜ",
  reals: "ℝ",
  Re: "ℜ",
  rect: "▭",
  reg: "®",
  REG: "®",
  ReverseElement: "∋",
  ReverseEquilibrium: "⇋",
  ReverseUpEquilibrium: "⥯",
  rfisht: "⥽",
  rfloor: "⌋",
  rfr: "𝔯",
  Rfr: "ℜ",
  rHar: "⥤",
  rhard: "⇁",
  rharu: "⇀",
  rharul: "⥬",
  Rho: "Ρ",
  rho: "ρ",
  rhov: "ϱ",
  RightAngleBracket: "⟩",
  RightArrowBar: "⇥",
  rightarrow: "→",
  RightArrow: "→",
  Rightarrow: "⇒",
  RightArrowLeftArrow: "⇄",
  rightarrowtail: "↣",
  RightCeiling: "⌉",
  RightDoubleBracket: "⟧",
  RightDownTeeVector: "⥝",
  RightDownVectorBar: "⥕",
  RightDownVector: "⇂",
  RightFloor: "⌋",
  rightharpoondown: "⇁",
  rightharpoonup: "⇀",
  rightleftarrows: "⇄",
  rightleftharpoons: "⇌",
  rightrightarrows: "⇉",
  rightsquigarrow: "↝",
  RightTeeArrow: "↦",
  RightTee: "⊢",
  RightTeeVector: "⥛",
  rightthreetimes: "⋌",
  RightTriangleBar: "⧐",
  RightTriangle: "⊳",
  RightTriangleEqual: "⊵",
  RightUpDownVector: "⥏",
  RightUpTeeVector: "⥜",
  RightUpVectorBar: "⥔",
  RightUpVector: "↾",
  RightVectorBar: "⥓",
  RightVector: "⇀",
  ring: "˚",
  risingdotseq: "≓",
  rlarr: "⇄",
  rlhar: "⇌",
  rlm: "\u200f",
  rmoustache: "⎱",
  rmoust: "⎱",
  rnmid: "⫮",
  roang: "⟭",
  roarr: "⇾",
  robrk: "⟧",
  ropar: "⦆",
  ropf: "𝕣",
  Ropf: "ℝ",
  roplus: "⨮",
  rotimes: "⨵",
  RoundImplies: "⥰",
  rpar: ")",
  rpargt: "⦔",
  rppolint: "⨒",
  rrarr: "⇉",
  Rrightarrow: "⇛",
  rsaquo: "›",
  rscr: "𝓇",
  Rscr: "ℛ",
  rsh: "↱",
  Rsh: "↱",
  rsqb: "]",
  rsquo: "’",
  rsquor: "’",
  rthree: "⋌",
  rtimes: "⋊",
  rtri: "▹",
  rtrie: "⊵",
  rtrif: "▸",
  rtriltri: "⧎",
  RuleDelayed: "⧴",
  ruluhar: "⥨",
  rx: "℞",
  Sacute: "Ś",
  sacute: "ś",
  sbquo: "‚",
  scap: "⪸",
  Scaron: "Š",
  scaron: "š",
  Sc: "⪼",
  sc: "≻",
  sccue: "≽",
  sce: "⪰",
  scE: "⪴",
  Scedil: "Ş",
  scedil: "ş",
  Scirc: "Ŝ",
  scirc: "ŝ",
  scnap: "⪺",
  scnE: "⪶",
  scnsim: "⋩",
  scpolint: "⨓",
  scsim: "≿",
  Scy: "С",
  scy: "с",
  sdotb: "⊡",
  sdot: "⋅",
  sdote: "⩦",
  searhk: "⤥",
  searr: "↘",
  seArr: "⇘",
  searrow: "↘",
  sect: "§",
  semi: ";",
  seswar: "⤩",
  setminus: "∖",
  setmn: "∖",
  sext: "✶",
  Sfr: "𝔖",
  sfr: "𝔰",
  sfrown: "⌢",
  sharp: "♯",
  SHCHcy: "Щ",
  shchcy: "щ",
  SHcy: "Ш",
  shcy: "ш",
  ShortDownArrow: "↓",
  ShortLeftArrow: "←",
  shortmid: "∣",
  shortparallel: "∥",
  ShortRightArrow: "→",
  ShortUpArrow: "↑",
  shy: "\u00ad",
  Sigma: "Σ",
  sigma: "σ",
  sigmaf: "ς",
  sigmav: "ς",
  sim: "∼",
  simdot: "⩪",
  sime: "≃",
  simeq: "≃",
  simg: "⪞",
  simgE: "⪠",
  siml: "⪝",
  simlE: "⪟",
  simne: "≆",
  simplus: "⨤",
  simrarr: "⥲",
  slarr: "←",
  SmallCircle: "∘",
  smallsetminus: "∖",
  smashp: "⨳",
  smeparsl: "⧤",
  smid: "∣",
  smile: "⌣",
  smt: "⪪",
  smte: "⪬",
  smtes: "⪬︀",
  SOFTcy: "Ь",
  softcy: "ь",
  solbar: "⌿",
  solb: "⧄",
  sol: "/",
  Sopf: "𝕊",
  sopf: "𝕤",
  spades: "♠",
  spadesuit: "♠",
  spar: "∥",
  sqcap: "⊓",
  sqcaps: "⊓︀",
  sqcup: "⊔",
  sqcups: "⊔︀",
  Sqrt: "√",
  sqsub: "⊏",
  sqsube: "⊑",
  sqsubset: "⊏",
  sqsubseteq: "⊑",
  sqsup: "⊐",
  sqsupe: "⊒",
  sqsupset: "⊐",
  sqsupseteq: "⊒",
  square: "□",
  Square: "□",
  SquareIntersection: "⊓",
  SquareSubset: "⊏",
  SquareSubsetEqual: "⊑",
  SquareSuperset: "⊐",
  SquareSupersetEqual: "⊒",
  SquareUnion: "⊔",
  squarf: "▪",
  squ: "□",
  squf: "▪",
  srarr: "→",
  Sscr: "𝒮",
  sscr: "𝓈",
  ssetmn: "∖",
  ssmile: "⌣",
  sstarf: "⋆",
  Star: "⋆",
  star: "☆",
  starf: "★",
  straightepsilon: "ϵ",
  straightphi: "ϕ",
  strns: "¯",
  sub: "⊂",
  Sub: "⋐",
  subdot: "⪽",
  subE: "⫅",
  sube: "⊆",
  subedot: "⫃",
  submult: "⫁",
  subnE: "⫋",
  subne: "⊊",
  subplus: "⪿",
  subrarr: "⥹",
  subset: "⊂",
  Subset: "⋐",
  subseteq: "⊆",
  subseteqq: "⫅",
  SubsetEqual: "⊆",
  subsetneq: "⊊",
  subsetneqq: "⫋",
  subsim: "⫇",
  subsub: "⫕",
  subsup: "⫓",
  succapprox: "⪸",
  succ: "≻",
  succcurlyeq: "≽",
  Succeeds: "≻",
  SucceedsEqual: "⪰",
  SucceedsSlantEqual: "≽",
  SucceedsTilde: "≿",
  succeq: "⪰",
  succnapprox: "⪺",
  succneqq: "⪶",
  succnsim: "⋩",
  succsim: "≿",
  SuchThat: "∋",
  sum: "∑",
  Sum: "∑",
  sung: "♪",
  sup1: "¹",
  sup2: "²",
  sup3: "³",
  sup: "⊃",
  Sup: "⋑",
  supdot: "⪾",
  supdsub: "⫘",
  supE: "⫆",
  supe: "⊇",
  supedot: "⫄",
  Superset: "⊃",
  SupersetEqual: "⊇",
  suphsol: "⟉",
  suphsub: "⫗",
  suplarr: "⥻",
  supmult: "⫂",
  supnE: "⫌",
  supne: "⊋",
  supplus: "⫀",
  supset: "⊃",
  Supset: "⋑",
  supseteq: "⊇",
  supseteqq: "⫆",
  supsetneq: "⊋",
  supsetneqq: "⫌",
  supsim: "⫈",
  supsub: "⫔",
  supsup: "⫖",
  swarhk: "⤦",
  swarr: "↙",
  swArr: "⇙",
  swarrow: "↙",
  swnwar: "⤪",
  szlig: "ß",
  Tab: "\u0009",
  target: "⌖",
  Tau: "Τ",
  tau: "τ",
  tbrk: "⎴",
  Tcaron: "Ť",
  tcaron: "ť",
  Tcedil: "Ţ",
  tcedil: "ţ",
  Tcy: "Т",
  tcy: "т",
  tdot: "⃛",
  telrec: "⌕",
  Tfr: "𝔗",
  tfr: "𝔱",
  there4: "∴",
  therefore: "∴",
  Therefore: "∴",
  Theta: "Θ",
  theta: "θ",
  thetasym: "ϑ",
  thetav: "ϑ",
  thickapprox: "≈",
  thicksim: "∼",
  ThickSpace: "  ",
  ThinSpace: " ",
  thinsp: " ",
  thkap: "≈",
  thksim: "∼",
  THORN: "Þ",
  thorn: "þ",
  tilde: "˜",
  Tilde: "∼",
  TildeEqual: "≃",
  TildeFullEqual: "≅",
  TildeTilde: "≈",
  timesbar: "⨱",
  timesb: "⊠",
  times: "×",
  timesd: "⨰",
  tint: "∭",
  toea: "⤨",
  topbot: "⌶",
  topcir: "⫱",
  top: "⊤",
  Topf: "𝕋",
  topf: "𝕥",
  topfork: "⫚",
  tosa: "⤩",
  tprime: "‴",
  trade: "™",
  TRADE: "™",
  triangle: "▵",
  triangledown: "▿",
  triangleleft: "◃",
  trianglelefteq: "⊴",
  triangleq: "≜",
  triangleright: "▹",
  trianglerighteq: "⊵",
  tridot: "◬",
  trie: "≜",
  triminus: "⨺",
  TripleDot: "⃛",
  triplus: "⨹",
  trisb: "⧍",
  tritime: "⨻",
  trpezium: "⏢",
  Tscr: "𝒯",
  tscr: "𝓉",
  TScy: "Ц",
  tscy: "ц",
  TSHcy: "Ћ",
  tshcy: "ћ",
  Tstrok: "Ŧ",
  tstrok: "ŧ",
  twixt: "≬",
  twoheadleftarrow: "↞",
  twoheadrightarrow: "↠",
  Uacute: "Ú",
  uacute: "ú",
  uarr: "↑",
  Uarr: "↟",
  uArr: "⇑",
  Uarrocir: "⥉",
  Ubrcy: "Ў",
  ubrcy: "ў",
  Ubreve: "Ŭ",
  ubreve: "ŭ",
  Ucirc: "Û",
  ucirc: "û",
  Ucy: "У",
  ucy: "у",
  udarr: "⇅",
  Udblac: "Ű",
  udblac: "ű",
  udhar: "⥮",
  ufisht: "⥾",
  Ufr: "𝔘",
  ufr: "𝔲",
  Ugrave: "Ù",
  ugrave: "ù",
  uHar: "⥣",
  uharl: "↿",
  uharr: "↾",
  uhblk: "▀",
  ulcorn: "⌜",
  ulcorner: "⌜",
  ulcrop: "⌏",
  ultri: "◸",
  Umacr: "Ū",
  umacr: "ū",
  uml: "¨",
  UnderBar: "_",
  UnderBrace: "⏟",
  UnderBracket: "⎵",
  UnderParenthesis: "⏝",
  Union: "⋃",
  UnionPlus: "⊎",
  Uogon: "Ų",
  uogon: "ų",
  Uopf: "𝕌",
  uopf: "𝕦",
  UpArrowBar: "⤒",
  uparrow: "↑",
  UpArrow: "↑",
  Uparrow: "⇑",
  UpArrowDownArrow: "⇅",
  updownarrow: "↕",
  UpDownArrow: "↕",
  Updownarrow: "⇕",
  UpEquilibrium: "⥮",
  upharpoonleft: "↿",
  upharpoonright: "↾",
  uplus: "⊎",
  UpperLeftArrow: "↖",
  UpperRightArrow: "↗",
  upsi: "υ",
  Upsi: "ϒ",
  upsih: "ϒ",
  Upsilon: "Υ",
  upsilon: "υ",
  UpTeeArrow: "↥",
  UpTee: "⊥",
  upuparrows: "⇈",
  urcorn: "⌝",
  urcorner: "⌝",
  urcrop: "⌎",
  Uring: "Ů",
  uring: "ů",
  urtri: "◹",
  Uscr: "𝒰",
  uscr: "𝓊",
  utdot: "⋰",
  Utilde: "Ũ",
  utilde: "ũ",
  utri: "▵",
  utrif: "▴",
  uuarr: "⇈",
  Uuml: "Ü",
  uuml: "ü",
  uwangle: "⦧",
  vangrt: "⦜",
  varepsilon: "ϵ",
  varkappa: "ϰ",
  varnothing: "∅",
  varphi: "ϕ",
  varpi: "ϖ",
  varpropto: "∝",
  varr: "↕",
  vArr: "⇕",
  varrho: "ϱ",
  varsigma: "ς",
  varsubsetneq: "⊊︀",
  varsubsetneqq: "⫋︀",
  varsupsetneq: "⊋︀",
  varsupsetneqq: "⫌︀",
  vartheta: "ϑ",
  vartriangleleft: "⊲",
  vartriangleright: "⊳",
  vBar: "⫨",
  Vbar: "⫫",
  vBarv: "⫩",
  Vcy: "В",
  vcy: "в",
  vdash: "⊢",
  vDash: "⊨",
  Vdash: "⊩",
  VDash: "⊫",
  Vdashl: "⫦",
  veebar: "⊻",
  vee: "∨",
  Vee: "⋁",
  veeeq: "≚",
  vellip: "⋮",
  verbar: "|",
  Verbar: "‖",
  vert: "|",
  Vert: "‖",
  VerticalBar: "∣",
  VerticalLine: "|",
  VerticalSeparator: "❘",
  VerticalTilde: "≀",
  VeryThinSpace: " ",
  Vfr: "𝔙",
  vfr: "𝔳",
  vltri: "⊲",
  vnsub: "⊂⃒",
  vnsup: "⊃⃒",
  Vopf: "𝕍",
  vopf: "𝕧",
  vprop: "∝",
  vrtri: "⊳",
  Vscr: "𝒱",
  vscr: "𝓋",
  vsubnE: "⫋︀",
  vsubne: "⊊︀",
  vsupnE: "⫌︀",
  vsupne: "⊋︀",
  Vvdash: "⊪",
  vzigzag: "⦚",
  Wcirc: "Ŵ",
  wcirc: "ŵ",
  wedbar: "⩟",
  wedge: "∧",
  Wedge: "⋀",
  wedgeq: "≙",
  weierp: "℘",
  Wfr: "𝔚",
  wfr: "𝔴",
  Wopf: "𝕎",
  wopf: "𝕨",
  wp: "℘",
  wr: "≀",
  wreath: "≀",
  Wscr: "𝒲",
  wscr: "𝓌",
  xcap: "⋂",
  xcirc: "◯",
  xcup: "⋃",
  xdtri: "▽",
  Xfr: "𝔛",
  xfr: "𝔵",
  xharr: "⟷",
  xhArr: "⟺",
  Xi: "Ξ",
  xi: "ξ",
  xlarr: "⟵",
  xlArr: "⟸",
  xmap: "⟼",
  xnis: "⋻",
  xodot: "⨀",
  Xopf: "𝕏",
  xopf: "𝕩",
  xoplus: "⨁",
  xotime: "⨂",
  xrarr: "⟶",
  xrArr: "⟹",
  Xscr: "𝒳",
  xscr: "𝓍",
  xsqcup: "⨆",
  xuplus: "⨄",
  xutri: "△",
  xvee: "⋁",
  xwedge: "⋀",
  Yacute: "Ý",
  yacute: "ý",
  YAcy: "Я",
  yacy: "я",
  Ycirc: "Ŷ",
  ycirc: "ŷ",
  Ycy: "Ы",
  ycy: "ы",
  yen: "¥",
  Yfr: "𝔜",
  yfr: "𝔶",
  YIcy: "Ї",
  yicy: "ї",
  Yopf: "𝕐",
  yopf: "𝕪",
  Yscr: "𝒴",
  yscr: "𝓎",
  YUcy: "Ю",
  yucy: "ю",
  yuml: "ÿ",
  Yuml: "Ÿ",
  Zacute: "Ź",
  zacute: "ź",
  Zcaron: "Ž",
  zcaron: "ž",
  Zcy: "З",
  zcy: "з",
  Zdot: "Ż",
  zdot: "ż",
  zeetrf: "ℨ",
  ZeroWidthSpace: "​",
  Zeta: "Ζ",
  zeta: "ζ",
  zfr: "𝔷",
  Zfr: "ℨ",
  ZHcy: "Ж",
  zhcy: "ж",
  zigrarr: "⇝",
  zopf: "𝕫",
  Zopf: "ℤ",
  Zscr: "𝒵",
  zscr: "𝓏",
  zwj: "\u200d",
  zwnj: "\u200c"
};
var HEXCHARCODE = /^#[xX]([A-Fa-f0-9]+)$/;
var CHARCODE = /^#([0-9]+)$/;
var NAMED = /^([A-Za-z0-9]+)$/;
var EntityParser = /** @class */function () {
  function EntityParser(named) {
    this.named = named;
  }
  EntityParser.prototype.parse = function (entity) {
    if (!entity) {
      return;
    }
    var matches = entity.match(HEXCHARCODE);
    if (matches) {
      return String.fromCharCode(parseInt(matches[1], 16));
    }
    matches = entity.match(CHARCODE);
    if (matches) {
      return String.fromCharCode(parseInt(matches[1], 10));
    }
    matches = entity.match(NAMED);
    if (matches) {
      return this.named[matches[1]];
    }
  };
  return EntityParser;
}();
var WSP = /[\t\n\f ]/;
var ALPHA = /[A-Za-z]/;
var CRLF = /\r\n?/g;
function isSpace(char) {
  return WSP.test(char);
}
function isAlpha(char) {
  return ALPHA.test(char);
}
function preprocessInput(input) {
  return input.replace(CRLF, '\n');
}
var EventedTokenizer = /** @class */function () {
  function EventedTokenizer(delegate, entityParser, mode) {
    if (mode === void 0) {
      mode = 'precompile';
    }
    this.delegate = delegate;
    this.entityParser = entityParser;
    this.mode = mode;
    this.state = "beforeData" /* beforeData */;
    this.line = -1;
    this.column = -1;
    this.input = '';
    this.index = -1;
    this.tagNameBuffer = '';
    this.states = {
      beforeData: function () {
        var char = this.peek();
        if (char === '<' && !this.isIgnoredEndTag()) {
          this.transitionTo("tagOpen" /* tagOpen */);
          this.markTagStart();
          this.consume();
        } else {
          if (this.mode === 'precompile' && char === '\n') {
            var tag = this.tagNameBuffer.toLowerCase();
            if (tag === 'pre' || tag === 'textarea') {
              this.consume();
            }
          }
          this.transitionTo("data" /* data */);
          this.delegate.beginData();
        }
      },
      data: function () {
        var char = this.peek();
        var tag = this.tagNameBuffer;
        if (char === '<' && !this.isIgnoredEndTag()) {
          this.delegate.finishData();
          this.transitionTo("tagOpen" /* tagOpen */);
          this.markTagStart();
          this.consume();
        } else if (char === '&' && tag !== 'script' && tag !== 'style') {
          this.consume();
          this.delegate.appendToData(this.consumeCharRef() || '&');
        } else {
          this.consume();
          this.delegate.appendToData(char);
        }
      },
      tagOpen: function () {
        var char = this.consume();
        if (char === '!') {
          this.transitionTo("markupDeclarationOpen" /* markupDeclarationOpen */);
        } else if (char === '/') {
          this.transitionTo("endTagOpen" /* endTagOpen */);
        } else if (char === '@' || char === ':' || isAlpha(char)) {
          this.transitionTo("tagName" /* tagName */);
          this.tagNameBuffer = '';
          this.delegate.beginStartTag();
          this.appendToTagName(char);
        }
      },
      markupDeclarationOpen: function () {
        var char = this.consume();
        if (char === '-' && this.peek() === '-') {
          this.consume();
          this.transitionTo("commentStart" /* commentStart */);
          this.delegate.beginComment();
        } else {
          var maybeDoctype = char.toUpperCase() + this.input.substring(this.index, this.index + 6).toUpperCase();
          if (maybeDoctype === 'DOCTYPE') {
            this.consume();
            this.consume();
            this.consume();
            this.consume();
            this.consume();
            this.consume();
            this.transitionTo("doctype" /* doctype */);
            if (this.delegate.beginDoctype) this.delegate.beginDoctype();
          }
        }
      },
      doctype: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("beforeDoctypeName" /* beforeDoctypeName */);
        }
      },
      beforeDoctypeName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else {
          this.transitionTo("doctypeName" /* doctypeName */);
          if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
        }
      },
      doctypeName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("afterDoctypeName" /* afterDoctypeName */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypeName) this.delegate.appendToDoctypeName(char.toLowerCase());
        }
      },
      afterDoctypeName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          var nextSixChars = char.toUpperCase() + this.input.substring(this.index, this.index + 5).toUpperCase();
          var isPublic = nextSixChars.toUpperCase() === 'PUBLIC';
          var isSystem = nextSixChars.toUpperCase() === 'SYSTEM';
          if (isPublic || isSystem) {
            this.consume();
            this.consume();
            this.consume();
            this.consume();
            this.consume();
            this.consume();
          }
          if (isPublic) {
            this.transitionTo("afterDoctypePublicKeyword" /* afterDoctypePublicKeyword */);
          } else if (isSystem) {
            this.transitionTo("afterDoctypeSystemKeyword" /* afterDoctypeSystemKeyword */);
          }
        }
      },
      afterDoctypePublicKeyword: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.transitionTo("beforeDoctypePublicIdentifier" /* beforeDoctypePublicIdentifier */);
          this.consume();
        } else if (char === '"') {
          this.transitionTo("doctypePublicIdentifierDoubleQuoted" /* doctypePublicIdentifierDoubleQuoted */);
          this.consume();
        } else if (char === "'") {
          this.transitionTo("doctypePublicIdentifierSingleQuoted" /* doctypePublicIdentifierSingleQuoted */);
          this.consume();
        } else if (char === '>') {
          this.consume();
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        }
      },
      doctypePublicIdentifierDoubleQuoted: function () {
        var char = this.consume();
        if (char === '"') {
          this.transitionTo("afterDoctypePublicIdentifier" /* afterDoctypePublicIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
        }
      },
      doctypePublicIdentifierSingleQuoted: function () {
        var char = this.consume();
        if (char === "'") {
          this.transitionTo("afterDoctypePublicIdentifier" /* afterDoctypePublicIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypePublicIdentifier) this.delegate.appendToDoctypePublicIdentifier(char);
        }
      },
      afterDoctypePublicIdentifier: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("betweenDoctypePublicAndSystemIdentifiers" /* betweenDoctypePublicAndSystemIdentifiers */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '"') {
          this.transitionTo("doctypeSystemIdentifierDoubleQuoted" /* doctypeSystemIdentifierDoubleQuoted */);
        } else if (char === "'") {
          this.transitionTo("doctypeSystemIdentifierSingleQuoted" /* doctypeSystemIdentifierSingleQuoted */);
        }
      },
      betweenDoctypePublicAndSystemIdentifiers: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '"') {
          this.transitionTo("doctypeSystemIdentifierDoubleQuoted" /* doctypeSystemIdentifierDoubleQuoted */);
        } else if (char === "'") {
          this.transitionTo("doctypeSystemIdentifierSingleQuoted" /* doctypeSystemIdentifierSingleQuoted */);
        }
      },
      doctypeSystemIdentifierDoubleQuoted: function () {
        var char = this.consume();
        if (char === '"') {
          this.transitionTo("afterDoctypeSystemIdentifier" /* afterDoctypeSystemIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
        }
      },
      doctypeSystemIdentifierSingleQuoted: function () {
        var char = this.consume();
        if (char === "'") {
          this.transitionTo("afterDoctypeSystemIdentifier" /* afterDoctypeSystemIdentifier */);
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          if (this.delegate.appendToDoctypeSystemIdentifier) this.delegate.appendToDoctypeSystemIdentifier(char);
        }
      },
      afterDoctypeSystemIdentifier: function () {
        var char = this.consume();
        if (isSpace(char)) {
          return;
        } else if (char === '>') {
          if (this.delegate.endDoctype) this.delegate.endDoctype();
          this.transitionTo("beforeData" /* beforeData */);
        }
      },
      commentStart: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentStartDash" /* commentStartDash */);
        } else if (char === '>') {
          this.delegate.finishComment();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.appendToCommentData(char);
          this.transitionTo("comment" /* comment */);
        }
      },
      commentStartDash: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentEnd" /* commentEnd */);
        } else if (char === '>') {
          this.delegate.finishComment();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.appendToCommentData('-');
          this.transitionTo("comment" /* comment */);
        }
      },
      comment: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentEndDash" /* commentEndDash */);
        } else {
          this.delegate.appendToCommentData(char);
        }
      },
      commentEndDash: function () {
        var char = this.consume();
        if (char === '-') {
          this.transitionTo("commentEnd" /* commentEnd */);
        } else {
          this.delegate.appendToCommentData('-' + char);
          this.transitionTo("comment" /* comment */);
        }
      },
      commentEnd: function () {
        var char = this.consume();
        if (char === '>') {
          this.delegate.finishComment();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.appendToCommentData('--' + char);
          this.transitionTo("comment" /* comment */);
        }
      },
      tagName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        } else if (char === '/') {
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '>') {
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.appendToTagName(char);
        }
      },
      endTagName: function () {
        var char = this.consume();
        if (isSpace(char)) {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
          this.tagNameBuffer = '';
        } else if (char === '/') {
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
          this.tagNameBuffer = '';
        } else if (char === '>') {
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
          this.tagNameBuffer = '';
        } else {
          this.appendToTagName(char);
        }
      },
      beforeAttributeName: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
          return;
        } else if (char === '/') {
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
          this.consume();
        } else if (char === '>') {
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '=') {
          this.delegate.reportSyntaxError('attribute name cannot start with equals sign');
          this.transitionTo("attributeName" /* attributeName */);
          this.delegate.beginAttribute();
          this.consume();
          this.delegate.appendToAttributeName(char);
        } else {
          this.transitionTo("attributeName" /* attributeName */);
          this.delegate.beginAttribute();
        }
      },
      attributeName: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.transitionTo("afterAttributeName" /* afterAttributeName */);
          this.consume();
        } else if (char === '/') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '=') {
          this.transitionTo("beforeAttributeValue" /* beforeAttributeValue */);
          this.consume();
        } else if (char === '>') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else if (char === '"' || char === "'" || char === '<') {
          this.delegate.reportSyntaxError(char + ' is not a valid character within attribute names');
          this.consume();
          this.delegate.appendToAttributeName(char);
        } else {
          this.consume();
          this.delegate.appendToAttributeName(char);
        }
      },
      afterAttributeName: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
          return;
        } else if (char === '/') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '=') {
          this.consume();
          this.transitionTo("beforeAttributeValue" /* beforeAttributeValue */);
        } else if (char === '>') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.transitionTo("attributeName" /* attributeName */);
          this.delegate.beginAttribute();
          this.consume();
          this.delegate.appendToAttributeName(char);
        }
      },
      beforeAttributeValue: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
        } else if (char === '"') {
          this.transitionTo("attributeValueDoubleQuoted" /* attributeValueDoubleQuoted */);
          this.delegate.beginAttributeValue(true);
          this.consume();
        } else if (char === "'") {
          this.transitionTo("attributeValueSingleQuoted" /* attributeValueSingleQuoted */);
          this.delegate.beginAttributeValue(true);
          this.consume();
        } else if (char === '>') {
          this.delegate.beginAttributeValue(false);
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.transitionTo("attributeValueUnquoted" /* attributeValueUnquoted */);
          this.delegate.beginAttributeValue(false);
          this.consume();
          this.delegate.appendToAttributeValue(char);
        }
      },
      attributeValueDoubleQuoted: function () {
        var char = this.consume();
        if (char === '"') {
          this.delegate.finishAttributeValue();
          this.transitionTo("afterAttributeValueQuoted" /* afterAttributeValueQuoted */);
        } else if (char === '&') {
          this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },
      attributeValueSingleQuoted: function () {
        var char = this.consume();
        if (char === "'") {
          this.delegate.finishAttributeValue();
          this.transitionTo("afterAttributeValueQuoted" /* afterAttributeValueQuoted */);
        } else if (char === '&') {
          this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
        } else {
          this.delegate.appendToAttributeValue(char);
        }
      },
      attributeValueUnquoted: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        } else if (char === '/') {
          this.delegate.finishAttributeValue();
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '&') {
          this.consume();
          this.delegate.appendToAttributeValue(this.consumeCharRef() || '&');
        } else if (char === '>') {
          this.delegate.finishAttributeValue();
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.consume();
          this.delegate.appendToAttributeValue(char);
        }
      },
      afterAttributeValueQuoted: function () {
        var char = this.peek();
        if (isSpace(char)) {
          this.consume();
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        } else if (char === '/') {
          this.consume();
          this.transitionTo("selfClosingStartTag" /* selfClosingStartTag */);
        } else if (char === '>') {
          this.consume();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        }
      },
      selfClosingStartTag: function () {
        var char = this.peek();
        if (char === '>') {
          this.consume();
          this.delegate.markTagAsSelfClosing();
          this.delegate.finishTag();
          this.transitionTo("beforeData" /* beforeData */);
        } else {
          this.transitionTo("beforeAttributeName" /* beforeAttributeName */);
        }
      },
      endTagOpen: function () {
        var char = this.consume();
        if (char === '@' || char === ':' || isAlpha(char)) {
          this.transitionTo("endTagName" /* endTagName */);
          this.tagNameBuffer = '';
          this.delegate.beginEndTag();
          this.appendToTagName(char);
        }
      }
    };
    this.reset();
  }
  EventedTokenizer.prototype.reset = function () {
    this.transitionTo("beforeData" /* beforeData */);
    this.input = '';
    this.tagNameBuffer = '';
    this.index = 0;
    this.line = 1;
    this.column = 0;
    this.delegate.reset();
  };
  EventedTokenizer.prototype.transitionTo = function (state) {
    this.state = state;
  };
  EventedTokenizer.prototype.tokenize = function (input) {
    this.reset();
    this.tokenizePart(input);
    this.tokenizeEOF();
  };
  EventedTokenizer.prototype.tokenizePart = function (input) {
    this.input += preprocessInput(input);
    while (this.index < this.input.length) {
      var handler = this.states[this.state];
      if (handler !== undefined) {
        handler.call(this);
      } else {
        throw new Error("unhandled state " + this.state);
      }
    }
  };
  EventedTokenizer.prototype.tokenizeEOF = function () {
    this.flushData();
  };
  EventedTokenizer.prototype.flushData = function () {
    if (this.state === 'data') {
      this.delegate.finishData();
      this.transitionTo("beforeData" /* beforeData */);
    }
  };
  EventedTokenizer.prototype.peek = function () {
    return this.input.charAt(this.index);
  };
  EventedTokenizer.prototype.consume = function () {
    var char = this.peek();
    this.index++;
    if (char === '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    return char;
  };
  EventedTokenizer.prototype.consumeCharRef = function () {
    var endIndex = this.input.indexOf(';', this.index);
    if (endIndex === -1) {
      return;
    }
    var entity = this.input.slice(this.index, endIndex);
    var chars = this.entityParser.parse(entity);
    if (chars) {
      var count = entity.length;
      // consume the entity chars
      while (count) {
        this.consume();
        count--;
      }
      // consume the `;`
      this.consume();
      return chars;
    }
  };
  EventedTokenizer.prototype.markTagStart = function () {
    this.delegate.tagOpen();
  };
  EventedTokenizer.prototype.appendToTagName = function (char) {
    this.tagNameBuffer += char;
    this.delegate.appendToTagName(char);
  };
  EventedTokenizer.prototype.isIgnoredEndTag = function () {
    var tag = this.tagNameBuffer;
    return tag === 'title' && this.input.substring(this.index, this.index + 8) !== '</title>' || tag === 'style' && this.input.substring(this.index, this.index + 8) !== '</style>' || tag === 'script' && this.input.substring(this.index, this.index + 9) !== '</script>';
  };
  return EventedTokenizer;
}();

const c = /["\x26\xa0]/u,
  h = new RegExp(c.source, "gu"),
  u = /[&<>\xa0]/u,
  p = new RegExp(u.source, "gu");
function d(t) {
  switch (t.charCodeAt(0)) {
    case 160:
      return "&nbsp;";
    case 34:
      return "&quot;";
    case 38:
      return "&amp;";
    default:
      return t;
  }
}
function m(t) {
  switch (t.charCodeAt(0)) {
    case 160:
      return "&nbsp;";
    case 38:
      return "&amp;";
    case 60:
      return "&lt;";
    case 62:
      return "&gt;";
    default:
      return t;
  }
}
function f(t) {
  return c.test(t) ? t.replace(h, d) : t;
}
function g(t, e) {
  return t.loc.isInvisible || e.loc.isInvisible ? 0 : t.loc.startPosition.line < e.loc.startPosition.line || t.loc.startPosition.line === e.loc.startPosition.line && t.loc.startPosition.column < e.loc.startPosition.column ? -1 : t.loc.startPosition.line === e.loc.startPosition.line && t.loc.startPosition.column === e.loc.startPosition.column ? 0 : 1;
}
const b = new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
const w = /^\S/u;
function y(t) {
  return b.has(t.toLowerCase()) && t[0]?.toLowerCase() === t[0];
}
class v {
  constructor(t) {
    this.buffer = "", this.options = t;
  }
  handledByOverride(t, e = false) {
    if (void 0 !== this.options.override) {
      let s = this.options.override(t, this.options);
      if ("string" == typeof s) return e && w.test(s) && (s = ` ${s}`), this.buffer += s, true;
    }
    return false;
  }
  Node(t) {
    switch (t.type) {
      case "MustacheStatement":
      case "BlockStatement":
      case "MustacheCommentStatement":
      case "CommentStatement":
      case "TextNode":
      case "ElementNode":
      case "AttrNode":
      case "Block":
      case "Template":
        return this.TopLevelStatement(t);
      case "StringLiteral":
      case "BooleanLiteral":
      case "NumberLiteral":
      case "UndefinedLiteral":
      case "NullLiteral":
      case "PathExpression":
      case "SubExpression":
        return this.Expression(t);
      case "ConcatStatement":
        return this.ConcatStatement(t);
      case "Hash":
        return this.Hash(t);
      case "HashPair":
        return this.HashPair(t);
      case "ElementModifierStatement":
        return this.ElementModifierStatement(t);
    }
  }
  Expression(t) {
    switch (t.type) {
      case "StringLiteral":
      case "BooleanLiteral":
      case "NumberLiteral":
      case "UndefinedLiteral":
      case "NullLiteral":
        return this.Literal(t);
      case "PathExpression":
        return this.PathExpression(t);
      case "SubExpression":
        return this.SubExpression(t);
    }
  }
  Literal(t) {
    switch (t.type) {
      case "StringLiteral":
        return this.StringLiteral(t);
      case "BooleanLiteral":
        return this.BooleanLiteral(t);
      case "NumberLiteral":
        return this.NumberLiteral(t);
      case "UndefinedLiteral":
        return this.UndefinedLiteral(t);
      case "NullLiteral":
        return this.NullLiteral(t);
    }
  }
  TopLevelStatement(t) {
    switch (t.type) {
      case "MustacheStatement":
        return this.MustacheStatement(t);
      case "BlockStatement":
        return this.BlockStatement(t);
      case "MustacheCommentStatement":
        return this.MustacheCommentStatement(t);
      case "CommentStatement":
        return this.CommentStatement(t);
      case "TextNode":
        return this.TextNode(t);
      case "ElementNode":
        return this.ElementNode(t);
      case "Block":
        return this.Block(t);
      case "Template":
        return this.Template(t);
      case "AttrNode":
        return this.AttrNode(t);
    }
  }
  Template(t) {
    this.TopLevelStatements(t.body);
  }
  Block(t) {
    t.chained && (t.body[0].chained = true), this.handledByOverride(t) || this.TopLevelStatements(t.body);
  }
  TopLevelStatements(t) {
    t.forEach(t => this.TopLevelStatement(t));
  }
  ElementNode(t) {
    this.handledByOverride(t) || (this.OpenElementNode(t), this.TopLevelStatements(t.children), this.CloseElementNode(t));
  }
  OpenElementNode(t) {
    this.buffer += `<${t.tag}`;
    const e = [...t.attributes, ...t.modifiers, ...t.comments].sort(g);
    for (const t of e) switch (this.buffer += " ", t.type) {
      case "AttrNode":
        this.AttrNode(t);
        break;
      case "ElementModifierStatement":
        this.ElementModifierStatement(t);
        break;
      case "MustacheCommentStatement":
        this.MustacheCommentStatement(t);
    }
    t.blockParams.length && this.BlockParams(t.blockParams), t.selfClosing && (this.buffer += " /"), this.buffer += ">";
  }
  CloseElementNode(t) {
    t.selfClosing || y(t.tag) || (this.buffer += `</${t.tag}>`);
  }
  AttrNode(t) {
    if (this.handledByOverride(t)) return;
    let {
      name: e,
      value: s
    } = t;
    this.buffer += e, !e.startsWith("@") && "TextNode" == s.type && 0 === s.chars.length || (this.buffer += "=", this.AttrNodeValue(s));
  }
  AttrNodeValue(t) {
    if ("TextNode" === t.type) {
      let e = '"';
      "raw" === this.options.entityEncoding && t.chars.includes('"') && !t.chars.includes("'") && (e = "'"), this.buffer += e, this.TextNode(t, e), this.buffer += e;
    } else this.Node(t);
  }
  TextNode(t, e) {
    this.handledByOverride(t) || ("raw" === this.options.entityEncoding ? e && t.chars.includes(e) ? this.buffer += f(t.chars) : this.buffer += t.chars : this.buffer += e ? f(t.chars) : function (t) {
      return u.test(t) ? t.replace(p, m) : t;
    }(t.chars));
  }
  MustacheStatement(t) {
    this.handledByOverride(t) || (this.buffer += t.trusting ? "{{{" : "{{", t.strip.open && (this.buffer += "~"), this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), t.strip.close && (this.buffer += "~"), this.buffer += t.trusting ? "}}}" : "}}");
  }
  BlockStatement(t) {
    this.handledByOverride(t) || (t.chained ? (this.buffer += t.inverseStrip.open ? "{{~" : "{{", this.buffer += "else ") : this.buffer += t.openStrip.open ? "{{~#" : "{{#", this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), t.program.blockParams.length && this.BlockParams(t.program.blockParams), t.chained ? this.buffer += t.inverseStrip.close ? "~}}" : "}}" : this.buffer += t.openStrip.close ? "~}}" : "}}", this.Block(t.program), t.inverse && (t.inverse.chained || (this.buffer += t.inverseStrip.open ? "{{~" : "{{", this.buffer += "else", this.buffer += t.inverseStrip.close ? "~}}" : "}}"), this.Block(t.inverse)), t.chained || (this.buffer += t.closeStrip.open ? "{{~/" : "{{/", this.Expression(t.path), this.buffer += t.closeStrip.close ? "~}}" : "}}"));
  }
  BlockParams(t) {
    this.buffer += ` as |${t.join(" ")}|`;
  }
  ConcatStatement(t) {
    this.handledByOverride(t) || (this.buffer += '"', t.parts.forEach(t => {
      "TextNode" === t.type ? this.TextNode(t, '"') : this.Node(t);
    }), this.buffer += '"');
  }
  MustacheCommentStatement(t) {
    this.handledByOverride(t) || (this.buffer += `{{!--${t.value}--}}`);
  }
  ElementModifierStatement(t) {
    this.handledByOverride(t) || (this.buffer += "{{", this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), this.buffer += "}}");
  }
  CommentStatement(t) {
    this.handledByOverride(t) || (this.buffer += `\x3c!--${t.value}--\x3e`);
  }
  PathExpression(t) {
    this.handledByOverride(t) || (this.buffer += t.original);
  }
  SubExpression(t) {
    this.handledByOverride(t) || (this.buffer += "(", this.Expression(t.path), this.Params(t.params), this.Hash(t.hash), this.buffer += ")");
  }
  Params(t) {
    t.length && t.forEach(t => {
      this.buffer += " ", this.Expression(t);
    });
  }
  Hash(t) {
    this.handledByOverride(t, true) || t.pairs.forEach(t => {
      this.buffer += " ", this.HashPair(t);
    });
  }
  HashPair(t) {
    this.handledByOverride(t) || (this.buffer += t.key, this.buffer += "=", this.Node(t.value));
  }
  StringLiteral(t) {
    this.handledByOverride(t) || (this.buffer += JSON.stringify(t.value));
  }
  BooleanLiteral(t) {
    this.handledByOverride(t) || (this.buffer += String(t.value));
  }
  NumberLiteral(t) {
    this.handledByOverride(t) || (this.buffer += String(t.value));
  }
  UndefinedLiteral(t) {
    this.handledByOverride(t) || (this.buffer += "undefined");
  }
  NullLiteral(t) {
    this.handledByOverride(t) || (this.buffer += "null");
  }
  print(t) {
    let {
      options: e
    } = this;
    if (e.override) {
      let s = e.override(t, e);
      if (void 0 !== s) return s;
    }
    return this.buffer = "", this.Node(t), this.buffer;
  }
}
function S(t, e = {
  entityEncoding: "transformed"
}) {
  return t ? new v(e).print(t) : "";
}
function x(t, e) {
  return t in P && (void 0 === e || P[t].includes(e));
}
const P = {
  action: ["Call", "Modifier"],
  component: ["Call", "Append", "Block"],
  debugger: ["Append"],
  "each-in": ["Block"],
  each: ["Block"],
  "has-block-params": ["Call", "Append"],
  "has-block": ["Call", "Append"],
  helper: ["Call", "Append"],
  if: ["Call", "Append", "Block"],
  "in-element": ["Block"],
  let: ["Block"],
  log: ["Call", "Append"],
  modifier: ["Call", "Modifier"],
  mount: ["Append"],
  mut: ["Call", "Append"],
  outlet: ["Append"],
  readonly: ["Call", "Append"],
  unbound: ["Call", "Append"],
  unless: ["Call", "Append", "Block"],
  yield: ["Append"]
};
function E(t) {
  return !!t && t.length > 0;
}
function N(t) {
  return 0 === t.length ? void 0 : t[t.length - 1];
}
function C(t) {
  return 0 === t.length ? void 0 : t[0];
}
const A = Object.freeze({
    line: 1,
    column: 0
  }),
  T = Object.freeze({
    source: "(synthetic)",
    start: A,
    end: A
  }),
  L = Object.freeze({
    source: "(nonexistent)",
    start: A,
    end: A
  }),
  B = Object.freeze({
    source: "(broken)",
    start: A,
    end: A
  }),
  O = "CharPosition",
  H = "HbsPosition",
  F$1 = "InternalsSynthetic",
  $ = "NonExistent",
  z$1 = "Broken",
  M = "MATCH_ANY",
  I = "IS_INVISIBLE";
let _$1 = class _ {
  constructor(t) {
    this._whens = t;
  }
  first(t) {
    for (const e of this._whens) {
      const s = e.match(t);
      if (E(s)) return s[0];
    }
    return null;
  }
};
let V$1 = class V {
  get(t, e) {
    let s = this._map.get(t);
    return s || (s = e(), this._map.set(t, s), s);
  }
  add(t, e) {
    this._map.set(t, e);
  }
  match(t) {
    const e = function (t) {
        switch (t) {
          case z$1:
          case F$1:
          case $:
            return I;
          default:
            return t;
        }
      }(t),
      s = [],
      r = this._map.get(e),
      n = this._map.get(M);
    return r && s.push(r), n && s.push(n), s;
  }
  constructor() {
    this._map = new Map();
  }
};
function U(t) {
  return t(new D()).validate();
}
class D {
  validate() {
    return (t, e) => this.matchFor(t.kind, e.kind)(t, e);
  }
  matchFor(t, e) {
    const s = this._whens.match(t);
    return new _$1(s).first(e);
  }
  when(t, e, s) {
    return this._whens.get(t, () => new V$1()).add(e, s), this;
  }
  constructor() {
    this._whens = new V$1();
  }
}
class j {
  static synthetic(t) {
    let e = J.synthetic(t);
    return new j({
      loc: e,
      chars: t
    });
  }
  static load(t, e) {
    return new j({
      loc: J.load(t, e[1]),
      chars: e[0]
    });
  }
  constructor(t) {
    this.loc = t.loc, this.chars = t.chars;
  }
  getString() {
    return this.chars;
  }
  serialize() {
    return [this.chars, this.loc.serialize()];
  }
}
class J {
  static get NON_EXISTENT() {
    return new W$1($, L).wrap();
  }
  static load(e, s) {
    return "number" == typeof s ? J.forCharPositions(e, s, s) : "string" == typeof s ? J.synthetic(s) : Array.isArray(s) ? J.forCharPositions(e, s[0], s[1]) : s === $ ? J.NON_EXISTENT : s === z$1 ? J.broken(B) : void A$1(s);
  }
  static forHbsLoc(t, e) {
    const s = new X(t, e.start),
      r = new X(t, e.end);
    return new R(t, {
      start: s,
      end: r
    }, e).wrap();
  }
  static forCharPositions(t, e, s) {
    const r = new Q(t, e),
      n = new Q(t, s);
    return new K(t, {
      start: r,
      end: n
    }).wrap();
  }
  static synthetic(t) {
    return new W$1(F$1, L, t).wrap();
  }
  static broken(t = B) {
    return new W$1(z$1, t).wrap();
  }
  constructor(t) {
    var e;
    this.data = t, this.isInvisible = (e = t.kind) !== O && e !== H;
  }
  getStart() {
    return this.data.getStart().wrap();
  }
  getEnd() {
    return this.data.getEnd().wrap();
  }
  get loc() {
    const t = this.data.toHbsSpan();
    return null === t ? B : t.toHbsLoc();
  }
  get module() {
    return this.data.getModule();
  }
  get startPosition() {
    return this.loc.start;
  }
  get endPosition() {
    return this.loc.end;
  }
  toJSON() {
    return this.loc;
  }
  withStart(t) {
    return G(t.data, this.data.getEnd());
  }
  withEnd(t) {
    return G(this.data.getStart(), t.data);
  }
  asString() {
    return this.data.asString();
  }
  toSlice(t) {
    const e = this.data.asString();
    return JSON.stringify(e), JSON.stringify(t), new j({
      loc: this,
      chars: t || e
    });
  }
  get start() {
    return this.loc.start;
  }
  set start(t) {
    this.data.locDidUpdate({
      start: t
    });
  }
  get end() {
    return this.loc.end;
  }
  set end(t) {
    this.data.locDidUpdate({
      end: t
    });
  }
  get source() {
    return this.module;
  }
  collapse(t) {
    switch (t) {
      case "start":
        return this.getStart().collapsed();
      case "end":
        return this.getEnd().collapsed();
    }
  }
  extend(t) {
    return G(this.data.getStart(), t.data.getEnd());
  }
  serialize() {
    return this.data.serialize();
  }
  slice({
    skipStart: t = 0,
    skipEnd: e = 0
  }) {
    return G(this.getStart().move(t).data, this.getEnd().move(-e).data);
  }
  sliceStartChars({
    skipStart: t = 0,
    chars: e
  }) {
    return G(this.getStart().move(t).data, this.getStart().move(t + e).data);
  }
  sliceEndChars({
    skipEnd: t = 0,
    chars: e
  }) {
    return G(this.getEnd().move(t - e).data, this.getStart().move(-t).data);
  }
}
class K {
  #t;
  constructor(t, e) {
    this.source = t, this.charPositions = e, this.kind = O, this.#t = null;
  }
  wrap() {
    return new J(this);
  }
  asString() {
    return this.source.slice(this.charPositions.start.charPos, this.charPositions.end.charPos);
  }
  getModule() {
    return this.source.module;
  }
  getStart() {
    return this.charPositions.start;
  }
  getEnd() {
    return this.charPositions.end;
  }
  locDidUpdate() {}
  toHbsSpan() {
    let t = this.#t;
    if (null === t) {
      const e = this.charPositions.start.toHbsPos(),
        s = this.charPositions.end.toHbsPos();
      t = this.#t = null === e || null === s ? Y : new R(this.source, {
        start: e,
        end: s
      });
    }
    return t === Y ? null : t;
  }
  serialize() {
    const {
      start: {
        charPos: t
      },
      end: {
        charPos: e
      }
    } = this.charPositions;
    return t === e ? t : [t, e];
  }
  toCharPosSpan() {
    return this;
  }
}
class R {
  #e;
  #s;
  constructor(t, e, s = null) {
    this.source = t, this.hbsPositions = e, this.kind = H, this.#e = null, this.#s = s;
  }
  serialize() {
    const t = this.toCharPosSpan();
    return null === t ? z$1 : t.wrap().serialize();
  }
  wrap() {
    return new J(this);
  }
  updateProvided(t, e) {
    this.#s && (this.#s[e] = t), this.#e = null, this.#s = {
      start: t,
      end: t
    };
  }
  locDidUpdate({
    start: t,
    end: e
  }) {
    void 0 !== t && (this.updateProvided(t, "start"), this.hbsPositions.start = new X(this.source, t, null)), void 0 !== e && (this.updateProvided(e, "end"), this.hbsPositions.end = new X(this.source, e, null));
  }
  asString() {
    const t = this.toCharPosSpan();
    return null === t ? "" : t.asString();
  }
  getModule() {
    return this.source.module;
  }
  getStart() {
    return this.hbsPositions.start;
  }
  getEnd() {
    return this.hbsPositions.end;
  }
  toHbsLoc() {
    return {
      start: this.hbsPositions.start.hbsPos,
      end: this.hbsPositions.end.hbsPos
    };
  }
  toHbsSpan() {
    return this;
  }
  toCharPosSpan() {
    let t = this.#e;
    if (null === t) {
      const e = this.hbsPositions.start.toCharPos(),
        s = this.hbsPositions.end.toCharPos();
      if (!e || !s) return t = this.#e = Y, null;
      t = this.#e = new K(this.source, {
        start: e,
        end: s
      });
    }
    return t === Y ? null : t;
  }
}
let W$1 = class W {
  constructor(t, e, s = null) {
    this.kind = t, this.loc = e, this.string = s;
  }
  serialize() {
    switch (this.kind) {
      case z$1:
      case $:
        return this.kind;
      case F$1:
        return this.string || "";
    }
  }
  wrap() {
    return new J(this);
  }
  asString() {
    return this.string || "";
  }
  locDidUpdate({
    start: t,
    end: e
  }) {
    void 0 !== t && (this.loc.start = t), void 0 !== e && (this.loc.end = e);
  }
  getModule() {
    return "an unknown module";
  }
  getStart() {
    return new Z(this.kind, this.loc.start);
  }
  getEnd() {
    return new Z(this.kind, this.loc.end);
  }
  toCharPosSpan() {
    return this;
  }
  toHbsSpan() {
    return null;
  }
  toHbsLoc() {
    return B;
  }
};
const G = U(t => t.when(H, H, (t, e) => new R(t.source, {
    start: t,
    end: e
  }).wrap()).when(O, O, (t, e) => new K(t.source, {
    start: t,
    end: e
  }).wrap()).when(O, H, (t, e) => {
    const s = e.toCharPos();
    return null === s ? new W$1(z$1, B).wrap() : G(t, s);
  }).when(H, O, (t, e) => {
    const s = t.toCharPos();
    return null === s ? new W$1(z$1, B).wrap() : G(s, e);
  }).when(I, M, t => new W$1(t.kind, B).wrap()).when(M, I, (t, e) => new W$1(e.kind, B).wrap())),
  Y = "BROKEN";
class q {
  static forHbsPos(t, e) {
    return new X(t, e, null).wrap();
  }
  static broken(t = A) {
    return new Z(z$1, t).wrap();
  }
  constructor(t) {
    this.data = t;
  }
  get offset() {
    const t = this.data.toCharPos();
    return null === t ? null : t.offset;
  }
  eql(t) {
    return tt$1(this.data, t.data);
  }
  until(t) {
    return G(this.data, t.data);
  }
  move(t) {
    const e = this.data.toCharPos();
    if (null === e) return q.broken();
    {
      const s = e.offset + t;
      return e.source.validate(s) ? new Q(e.source, s).wrap() : q.broken();
    }
  }
  collapsed() {
    return G(this.data, this.data);
  }
  toJSON() {
    return this.data.toJSON();
  }
}
class Q {
  constructor(t, e) {
    this.source = t, this.charPos = e, this.kind = O, this._locPos = null;
  }
  toCharPos() {
    return this;
  }
  toJSON() {
    const t = this.toHbsPos();
    return null === t ? A : t.toJSON();
  }
  wrap() {
    return new q(this);
  }
  get offset() {
    return this.charPos;
  }
  toHbsPos() {
    let t = this._locPos;
    if (null === t) {
      const e = this.source.hbsPosFor(this.charPos);
      this._locPos = t = null === e ? Y : new X(this.source, e, this.charPos);
    }
    return t === Y ? null : t;
  }
}
class X {
  constructor(t, e, s = null) {
    this.source = t, this.hbsPos = e, this.kind = H, this._charPos = null === s ? null : new Q(t, s);
  }
  toCharPos() {
    let t = this._charPos;
    if (null === t) {
      const e = this.source.charPosFor(this.hbsPos);
      this._charPos = t = null === e ? Y : new Q(this.source, e);
    }
    return t === Y ? null : t;
  }
  toJSON() {
    return this.hbsPos;
  }
  wrap() {
    return new q(this);
  }
  toHbsPos() {
    return this;
  }
}
class Z {
  constructor(t, e) {
    this.kind = t, this.pos = e;
  }
  toCharPos() {
    return null;
  }
  toJSON() {
    return this.pos;
  }
  wrap() {
    return new q(this);
  }
  get offset() {
    return null;
  }
}
const tt$1 = U(t => t.when(H, H, ({
  hbsPos: t
}, {
  hbsPos: e
}) => t.column === e.column && t.line === e.line).when(O, O, ({
  charPos: t
}, {
  charPos: e
}) => t === e).when(O, H, ({
  offset: t
}, e) => t === e.toCharPos()?.offset).when(H, O, (t, {
  offset: e
}) => t.toCharPos()?.offset === e).when(M, M, () => false));
let et$1 = class et {
  static from(t, e = {}) {
    return new et(t, e.meta?.moduleName);
  }
  constructor(t, e = "an unknown module") {
    this.source = t, this.module = e;
  }
  validate(t) {
    return t >= 0 && t <= this.source.length;
  }
  slice(t, e) {
    return this.source.slice(t, e);
  }
  offsetFor(t, e) {
    return q.forHbsPos(this, {
      line: t,
      column: e
    });
  }
  spanFor({
    start: t,
    end: e
  }) {
    return J.forHbsLoc(this, {
      start: {
        line: t.line,
        column: t.column
      },
      end: {
        line: e.line,
        column: e.column
      }
    });
  }
  hbsPosFor(t) {
    let e = 0,
      s = 0;
    if (t > this.source.length) return null;
    for (;;) {
      let r = this.source.indexOf("\n", s);
      if (t <= r || -1 === r) return {
        line: e + 1,
        column: t - s
      };
      e += 1, s = r + 1;
    }
  }
  charPosFor(t) {
    let {
        line: e,
        column: s
      } = t,
      r = this.source.length,
      n = 0,
      a = 0;
    for (; a < r;) {
      let t = this.source.indexOf("\n", a);
      if (-1 === t && (t = this.source.length), n === e - 1) return a + s > t ? t : a + s;
      if (-1 === t) return 0;
      n += 1, a = t + 1;
    }
    return r;
  }
};
let st$1 = class st {
  static range(t, e = J.NON_EXISTENT) {
    return new st(t.map(rt$1)).getRangeOffset(e);
  }
  constructor(t = []) {
    this._span = t;
  }
  add(t) {
    this._span.push(t);
  }
  getRangeOffset(t) {
    if (E(this._span)) {
      let t = C(this._span),
        e = N(this._span);
      return t.extend(e);
    }
    return t;
  }
};
function rt$1(t) {
  if (Array.isArray(t)) {
    let e = C(t),
      s = N(t);
    return rt$1(e).extend(rt$1(s));
  }
  return t instanceof J ? t : t.loc;
}
function nt$1(t) {
  return !Array.isArray(t) || 0 !== t.length;
}
function at$1(t, e) {
  return nt$1(t) ? rt$1(t) : e;
}
var it$1 = Object.freeze({
  __proto__: null,
  NON_EXISTENT_LOCATION: L,
  SYNTHETIC_LOCATION: T,
  Source: et$1,
  SourceOffset: q,
  SourceSlice: j,
  SourceSpan: J,
  SpanList: st$1,
  UNKNOWN_POSITION: A,
  hasSpan: nt$1,
  loc: rt$1,
  maybeLoc: at$1
});
function ot$1(t, e) {
  let {
      module: s,
      loc: r
    } = e,
    {
      line: n,
      column: a
    } = r.start,
    i = e.asString(),
    o = i ? `\n\n|\n|  ${i.split("\n").join("\n|  ")}\n|\n\n` : "",
    l = new Error(`${t}: ${o}(error occurred in '${s}' @ line ${n} : column ${a})`);
  return l.name = "SyntaxError", l.location = e, l.code = i, l;
}
const lt$1 = {
    Template: ["body"],
    Block: ["body"],
    MustacheStatement: ["path", "params", "hash"],
    BlockStatement: ["path", "params", "hash", "program", "inverse"],
    ElementModifierStatement: ["path", "params", "hash"],
    CommentStatement: [],
    MustacheCommentStatement: [],
    ElementNode: ["attributes", "modifiers", "children", "comments"],
    AttrNode: ["value"],
    TextNode: [],
    ConcatStatement: ["parts"],
    SubExpression: ["path", "params", "hash"],
    PathExpression: [],
    StringLiteral: [],
    BooleanLiteral: [],
    NumberLiteral: [],
    NullLiteral: [],
    UndefinedLiteral: [],
    Hash: ["pairs"],
    HashPair: ["value"]
  },
  ct$1 = function () {
    function t(t, e, s, r) {
      let n = Error.call(this, t);
      this.key = r, this.message = t, this.node = e, this.parent = s, n.stack && (this.stack = n.stack);
    }
    return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t;
  }();
function ht$1(t, e, s) {
  return new ct$1("Cannot remove a node unless it is part of an array", t, e, s);
}
function ut$1(t, e, s) {
  return new ct$1("Cannot replace a node with multiple nodes unless it is part of an array", t, e, s);
}
function pt$1(t, e) {
  return new ct$1("Replacing and removing in key handlers is not yet supported.", t, null, e);
}
let dt$1 = class dt {
  constructor(t, e = null, s = null) {
    this.node = t, this.parent = e, this.parentKey = s;
  }
  get parentNode() {
    return this.parent ? this.parent.node : null;
  }
  parents() {
    return {
      [Symbol.iterator]: () => new mt$1(this)
    };
  }
};
let mt$1 = class mt {
  constructor(t) {
    this.path = t;
  }
  next() {
    return this.path.parent ? (this.path = this.path.parent, {
      done: false,
      value: this.path
    }) : {
      done: true,
      value: null
    };
  }
};
function ft$1(t) {
  return "function" == typeof t ? t : t.enter;
}
function gt$1(t) {
  return "function" == typeof t ? void 0 : t.exit;
}
function bt$1(t, e) {
  let s,
    r,
    n,
    {
      node: a,
      parent: i,
      parentKey: o
    } = e,
    l = function (t, e) {
      if (t.Program && ("Template" === e && !t.Template || "Block" === e && !t.Block)) return t.Program;
      let s = t[e];
      return void 0 !== s ? s : t.All;
    }(t, a.type);
  if (void 0 !== l && (s = ft$1(l), r = gt$1(l)), void 0 !== s && (n = s(a, e)), null != n) {
    if (JSON.stringify(a) !== JSON.stringify(n)) return Array.isArray(n) ? (yt$1(t, n, i, o), n) : bt$1(t, new dt$1(n, i, o)) || n;
    n = void 0;
  }
  if (void 0 === n) {
    let s = lt$1[a.type];
    for (let r = 0; r < s.length; r++) wt$1(t, l, e, s[r]);
    void 0 !== r && (n = r(a, e));
  }
  return n;
}
function kt$1(t, e, s) {
  t[e] = s;
}
function wt$1(t, e, s, r) {
  let n,
    a,
    {
      node: i
    } = s,
    o = function (t, e) {
      return t[e];
    }(i, r);
  if (o) {
    if (void 0 !== e) {
      let t = function (t, e) {
        let s = "function" != typeof t ? t.keys : void 0;
        if (void 0 === s) return;
        let r = s[e];
        return void 0 !== r ? r : s.All;
      }(e, r);
      void 0 !== t && (n = ft$1(t), a = gt$1(t));
    }
    if (void 0 !== n && void 0 !== n(i, r)) throw pt$1(i, r);
    if (Array.isArray(o)) yt$1(t, o, s, r);else {
      let e = bt$1(t, new dt$1(o, s, r));
      void 0 !== e && function (t, e, s, r) {
        if (null === r) throw ht$1(s, t, e);
        if (Array.isArray(r)) {
          if (1 !== r.length) throw 0 === r.length ? ht$1(s, t, e) : ut$1(s, t, e);
          kt$1(t, e, r[0]);
        } else kt$1(t, e, r);
      }(i, r, o, e);
    }
    if (void 0 !== a && void 0 !== a(i, r)) throw pt$1(i, r);
  }
}
function yt$1(t, e, s, r) {
  for (let n = 0; n < e.length; n++) {
    let a = e[n],
      i = bt$1(t, new dt$1(a, s, r));
    void 0 !== i && (n += vt$1(e, n, i) - 1);
  }
}
function vt$1(t, e, s) {
  return null === s ? (t.splice(e, 1), 0) : Array.isArray(s) ? (t.splice(e, 1, ...s), s.length) : (t.splice(e, 1, s), 1);
}
function St$1(t, e) {
  bt$1(e, new dt$1(t));
}
let xt$1 = class xt {
  constructor(t) {
    this.order = t, this.stack = [];
  }
  visit(t, e) {
    t && (this.stack.push(t), "post" === this.order ? (this.children(t, e), e(t, this)) : (e(t, this), this.children(t, e)), this.stack.pop());
  }
  children(t, e) {
    switch (t.type) {
      case "Block":
      case "Template":
        return void Pt$1(this, t.body, e);
      case "ElementNode":
        return void Pt$1(this, t.children, e);
      case "BlockStatement":
        return this.visit(t.program, e), void this.visit(t.inverse || null, e);
      default:
        return;
    }
  }
};
function Pt$1(t, e, s) {
  for (const r of e) t.visit(r, s);
}
function Et$1(t, e) {
  (function (t) {
    switch (t.type) {
      case "Block":
      case "Template":
        return t.body;
      case "ElementNode":
        return t.children;
    }
  })(t).push(e);
}
function Nt$1(t) {
  return "StringLiteral" === t.type || "BooleanLiteral" === t.type || "NumberLiteral" === t.type || "NullLiteral" === t.type || "UndefinedLiteral" === t.type;
}
let Ct$1;
function At$1() {
  return Ct$1 || (Ct$1 = new et$1("", "(synthetic)")), Ct$1;
}
function Tt$1(t, e) {
  return Vt$1.var({
    name: t,
    loc: zt$1(e || null)
  });
}
function Lt$1(t, e) {
  let s = zt$1(e || null);
  if ("string" != typeof t) {
    if ("type" in t) return t;
    {
      t.head.indexOf(".");
      let {
        head: r,
        tail: n
      } = t;
      return Vt$1.path({
        head: Vt$1.head({
          original: r,
          loc: s.sliceStartChars({
            chars: r.length
          })
        }),
        tail: n,
        loc: zt$1(e || null)
      });
    }
  }
  let {
    head: r,
    tail: n
  } = function (t, e) {
    let [s, ...r] = t.split("."),
      n = Vt$1.head({
        original: s,
        loc: zt$1(e || null)
      });
    return Vt$1.path({
      head: n,
      tail: r,
      loc: zt$1(e || null)
    });
  }(t, s);
  return Vt$1.path({
    head: r,
    tail: n,
    loc: s
  });
}
function Bt$1(t, e, s) {
  return Vt$1.literal({
    type: t,
    value: e,
    loc: zt$1(s || null)
  });
}
function Ot$1(t = [], e) {
  return Vt$1.hash({
    pairs: t,
    loc: zt$1(e || null)
  });
}
function Ht$1(t) {
  return t.map(t => "string" == typeof t ? Vt$1.var({
    name: t,
    loc: J.synthetic(t)
  }) : t);
}
function Ft$1(t = [], e = [], s = false, r) {
  return Vt$1.blockItself({
    body: t,
    params: Ht$1(e),
    chained: s,
    loc: zt$1(r || null)
  });
}
function $t$1(t = [], e = [], s) {
  return Vt$1.template({
    body: t,
    blockParams: e,
    loc: zt$1(s || null)
  });
}
function zt$1(...t) {
  if (1 === t.length) {
    let e = t[0];
    return e && "object" == typeof e ? J.forHbsLoc(At$1(), e) : J.forHbsLoc(At$1(), T);
  }
  {
    let [e, s, r, n, a] = t,
      i = a ? new et$1("", a) : At$1();
    return J.forHbsLoc(i, {
      start: {
        line: e,
        column: s
      },
      end: {
        line: r || e,
        column: n || s
      }
    });
  }
}
var Mt$1 = {
  mustache: function (t, e = [], s = Ot$1([]), r = false, n, a) {
    return Vt$1.mustache({
      path: Lt$1(t),
      params: e,
      hash: s,
      trusting: r,
      strip: a,
      loc: zt$1(n || null)
    });
  },
  block: function (t, e, s, r, n = null, a, i, o, l) {
    let c,
      h = null;
    return c = "Template" === r.type ? Vt$1.blockItself({
      params: Ht$1(r.blockParams),
      body: r.body,
      loc: r.loc
    }) : r, "Template" === n?.type ? (h = Vt$1.blockItself({
      params: [],
      body: n.body,
      loc: n.loc
    })) : h = n, Vt$1.block({
      path: Lt$1(t),
      params: e || [],
      hash: s || Ot$1([]),
      defaultBlock: c,
      elseBlock: h,
      loc: zt$1(a || null),
      openStrip: i,
      inverseStrip: o,
      closeStrip: l
    });
  },
  comment: function (t, e) {
    return Vt$1.comment({
      value: t,
      loc: zt$1(e || null)
    });
  },
  mustacheComment: function (t, e) {
    return Vt$1.mustacheComment({
      value: t,
      loc: zt$1(e || null)
    });
  },
  element: function (t, e = {}) {
    let s,
      r,
      {
        attrs: n,
        blockParams: a,
        modifiers: i,
        comments: o,
        children: l,
        openTag: c,
        closeTag: h,
        loc: u
      } = e;
    "string" == typeof t ? t.endsWith("/") ? (s = Lt$1(t.slice(0, -1)), r = true) : s = Lt$1(t) : "type" in t ? (s = t) : "path" in t ? (s = t.path, r = t.selfClosing) : (s = Lt$1(t.name), r = t.selfClosing);
    let p = a?.map(t => "string" == typeof t ? Tt$1(t) : t),
      d = null;
    return h ? d = zt$1(h) : void 0 === h && (d = r || y(s.original) ? null : zt$1(null)), Vt$1.element({
      path: s,
      selfClosing: r || false,
      attributes: n || [],
      params: p || [],
      modifiers: i || [],
      comments: o || [],
      children: l || [],
      openTag: zt$1(c || null),
      closeTag: d,
      loc: zt$1(u || null)
    });
  },
  elementModifier: function (t, e, s, r) {
    return Vt$1.elementModifier({
      path: Lt$1(t),
      params: e || [],
      hash: s || Ot$1([]),
      loc: zt$1(r || null)
    });
  },
  attr: function (t, e, s) {
    return Vt$1.attr({
      name: t,
      value: e,
      loc: zt$1(s || null)
    });
  },
  text: function (t = "", e) {
    return Vt$1.text({
      chars: t,
      loc: zt$1(e || null)
    });
  },
  sexpr: function (t, e = [], s = Ot$1([]), r) {
    return Vt$1.sexpr({
      path: Lt$1(t),
      params: e,
      hash: s,
      loc: zt$1(r || null)
    });
  },
  concat: function (t, e) {
    if (!E(t)) throw new Error("b.concat requires at least one part");
    return Vt$1.concat({
      parts: t,
      loc: zt$1(e || null)
    });
  },
  hash: Ot$1,
  pair: function (t, e, s) {
    return Vt$1.pair({
      key: t,
      value: e,
      loc: zt$1(s || null)
    });
  },
  literal: Bt$1,
  program: function (t, e, s) {
    return e && e.length ? Ft$1(t, e, false, s) : $t$1(t, [], s);
  },
  blockItself: Ft$1,
  template: $t$1,
  loc: zt$1,
  pos: function (t, e) {
    return Vt$1.pos({
      line: t,
      column: e
    });
  },
  path: Lt$1,
  fullPath: function (t, e = [], s) {
    return Vt$1.path({
      head: t,
      tail: e,
      loc: zt$1(s || null)
    });
  },
  head: function (t, e) {
    return Vt$1.head({
      original: t,
      loc: zt$1(e || null)
    });
  },
  at: function (t, e) {
    return Vt$1.atName({
      name: t,
      loc: zt$1(e || null)
    });
  },
  var: Tt$1,
  this: function (t) {
    return Vt$1.this({
      loc: zt$1(t || null)
    });
  },
  string: It$1("StringLiteral"),
  boolean: It$1("BooleanLiteral"),
  number: It$1("NumberLiteral"),
  undefined: () => Bt$1("UndefinedLiteral", void 0),
  null: () => Bt$1("NullLiteral", null)
};
function It$1(t) {
  return function (e, s) {
    return Bt$1(t, e, s);
  };
}
const _t$1 = {
    close: false,
    open: false
  },
  Vt$1 = new class {
    pos({
      line: t,
      column: e
    }) {
      return {
        line: t,
        column: e
      };
    }
    blockItself({
      body: t,
      params: e,
      chained: s = false,
      loc: r
    }) {
      return {
        type: "Block",
        body: t,
        params: e,
        get blockParams() {
          return this.params.map(t => t.name);
        },
        set blockParams(t) {
          this.params = t.map(t => Vt$1.var({
            name: t,
            loc: J.synthetic(t)
          }));
        },
        chained: s,
        loc: r
      };
    }
    template({
      body: t,
      blockParams: e,
      loc: s
    }) {
      return {
        type: "Template",
        body: t,
        blockParams: e,
        loc: s
      };
    }
    mustache({
      path: t,
      params: e,
      hash: s,
      trusting: r,
      loc: n,
      strip: a = _t$1
    }) {
      return function ({
        path: t,
        params: e,
        hash: s,
        trusting: r,
        strip: n,
        loc: a
      }) {
        const i = {
          type: "MustacheStatement",
          path: t,
          params: e,
          hash: s,
          trusting: r,
          strip: n,
          loc: a
        };
        return Object.defineProperty(i, "escaped", {
          enumerable: false,
          get() {
            return !this.trusting;
          },
          set(t) {
            this.trusting = !t;
          }
        }), i;
      }({
        path: t,
        params: e,
        hash: s,
        trusting: r,
        strip: a,
        loc: n
      });
    }
    block({
      path: t,
      params: e,
      hash: s,
      defaultBlock: r,
      elseBlock: n = null,
      loc: a,
      openStrip: i = _t$1,
      inverseStrip: o = _t$1,
      closeStrip: l = _t$1
    }) {
      return {
        type: "BlockStatement",
        path: t,
        params: e,
        hash: s,
        program: r,
        inverse: n,
        loc: a,
        openStrip: i,
        inverseStrip: o,
        closeStrip: l
      };
    }
    comment({
      value: t,
      loc: e
    }) {
      return {
        type: "CommentStatement",
        value: t,
        loc: e
      };
    }
    mustacheComment({
      value: t,
      loc: e
    }) {
      return {
        type: "MustacheCommentStatement",
        value: t,
        loc: e
      };
    }
    concat({
      parts: t,
      loc: e
    }) {
      return {
        type: "ConcatStatement",
        parts: t,
        loc: e
      };
    }
    element({
      path: t,
      selfClosing: e,
      attributes: s,
      modifiers: r,
      params: n,
      comments: a,
      children: i,
      openTag: o,
      closeTag: l,
      loc: c
    }) {
      let h = e;
      return {
        type: "ElementNode",
        path: t,
        attributes: s,
        modifiers: r,
        params: n,
        comments: a,
        children: i,
        openTag: o,
        closeTag: l,
        loc: c,
        get tag() {
          return this.path.original;
        },
        set tag(t) {
          this.path.original = t;
        },
        get blockParams() {
          return this.params.map(t => t.name);
        },
        set blockParams(t) {
          this.params = t.map(t => Vt$1.var({
            name: t,
            loc: J.synthetic(t)
          }));
        },
        get selfClosing() {
          return h;
        },
        set selfClosing(t) {
          h = t, this.closeTag = t ? null : J.synthetic(`</${this.tag}>`);
        }
      };
    }
    elementModifier({
      path: t,
      params: e,
      hash: s,
      loc: r
    }) {
      return {
        type: "ElementModifierStatement",
        path: t,
        params: e,
        hash: s,
        loc: r
      };
    }
    attr({
      name: t,
      value: e,
      loc: s
    }) {
      return {
        type: "AttrNode",
        name: t,
        value: e,
        loc: s
      };
    }
    text({
      chars: t,
      loc: e
    }) {
      return {
        type: "TextNode",
        chars: t,
        loc: e
      };
    }
    sexpr({
      path: t,
      params: e,
      hash: s,
      loc: r
    }) {
      return {
        type: "SubExpression",
        path: t,
        params: e,
        hash: s,
        loc: r
      };
    }
    path({
      head: t,
      tail: e,
      loc: s
    }) {
      return function ({
        head: t,
        tail: e,
        loc: s
      }) {
        const r = {
          type: "PathExpression",
          head: t,
          tail: e,
          get original() {
            return [this.head.original, ...this.tail].join(".");
          },
          set original(t) {
            let [e, ...s] = t.split(".");
            this.head = Mt$1.head(e, this.head.loc), this.tail = s;
          },
          loc: s
        };
        return Object.defineProperty(r, "parts", {
          enumerable: false,
          get() {
            let t = this.original.split(".");
            return "this" === t[0] ? t.shift() : t[0].startsWith("@") && (t[0] = t[0].slice(1)), Object.freeze(t);
          },
          set(t) {
            let e = [...t];
            "this" === e[0] || e[0]?.startsWith("@") || ("ThisHead" === this.head.type ? e.unshift("this") : "AtHead" === this.head.type && (e[0] = `@${e[0]}`)), this.original = e.join(".");
          }
        }), Object.defineProperty(r, "this", {
          enumerable: false,
          get() {
            return "ThisHead" === this.head.type;
          }
        }), Object.defineProperty(r, "data", {
          enumerable: false,
          get() {
            return "AtHead" === this.head.type;
          }
        }), r;
      }({
        head: t,
        tail: e,
        loc: s
      });
    }
    head({
      original: t,
      loc: e
    }) {
      return "this" === t ? this.this({
        loc: e
      }) : "@" === t[0] ? this.atName({
        name: t,
        loc: e
      }) : this.var({
        name: t,
        loc: e
      });
    }
    this({
      loc: t
    }) {
      return {
        type: "ThisHead",
        get original() {
          return "this";
        },
        loc: t
      };
    }
    atName({
      name: t,
      loc: e
    }) {
      let s = "";
      const r = {
        type: "AtHead",
        get name() {
          return s;
        },
        set name(t) {
          t.indexOf("."), s = t;
        },
        get original() {
          return this.name;
        },
        set original(t) {
          this.name = t;
        },
        loc: e
      };
      return r.name = t, r;
    }
    var({
      name: t,
      loc: e
    }) {
      let s = "";
      const r = {
        type: "VarHead",
        get name() {
          return s;
        },
        set name(t) {
          t.indexOf("."), s = t;
        },
        get original() {
          return this.name;
        },
        set original(t) {
          this.name = t;
        },
        loc: e
      };
      return r.name = t, r;
    }
    hash({
      pairs: t,
      loc: e
    }) {
      return {
        type: "Hash",
        pairs: t,
        loc: e
      };
    }
    pair({
      key: t,
      value: e,
      loc: s
    }) {
      return {
        type: "HashPair",
        key: t,
        value: e,
        loc: s
      };
    }
    literal({
      type: t,
      value: e,
      loc: s
    }) {
      return function ({
        type: t,
        value: e,
        loc: s
      }) {
        const r = {
          type: t,
          value: e,
          loc: s
        };
        return Object.defineProperty(r, "original", {
          enumerable: false,
          get() {
            return this.value;
          },
          set(t) {
            this.value = t;
          }
        }), r;
      }({
        type: t,
        value: e,
        loc: s
      });
    }
  }();
let Ut$1 = class Ut {
  constructor(t, e = new EntityParser(namedCharRefs), s = "precompile") {
    this.elementStack = [], this.currentAttribute = null, this.currentNode = null, this.source = t, this.lines = t.source.split(/\r\n?|\n/u), this.tokenizer = new EventedTokenizer(this, e, s);
  }
  offset() {
    let {
      line: t,
      column: e
    } = this.tokenizer;
    return this.source.offsetFor(t, e);
  }
  pos({
    line: t,
    column: e
  }) {
    return this.source.offsetFor(t, e);
  }
  finish(t) {
    return x$1({}, t, {
      loc: t.start.until(this.offset())
    });
  }
  get currentAttr() {
    return this.currentAttribute;
  }
  get currentTag() {
    let t = this.currentNode;
    return t;
  }
  get currentStartTag() {
    let t = this.currentNode;
    return t;
  }
  get currentEndTag() {
    let t = this.currentNode;
    return t;
  }
  get currentComment() {
    let t = this.currentNode;
    return t;
  }
  get currentData() {
    let t = this.currentNode;
    return t;
  }
  acceptNode(t) {
    return this[t.type](t);
  }
  currentElement() {
    return N(this.elementStack);
  }
  sourceForNode(t, e) {
    let s,
      r,
      n,
      a = t.loc.start.line - 1,
      i = a - 1,
      o = t.loc.start.column,
      l = [];
    for (e ? (r = e.loc.end.line - 1, n = e.loc.end.column) : (r = t.loc.end.line - 1, n = t.loc.end.column); i < r;) i++, s = this.lines[i], i === a ? a === r ? l.push(s.slice(o, n)) : l.push(s.slice(o)) : i === r ? l.push(s.slice(0, n)) : l.push(s);
    return l.join("\n");
  }
};
const Dt$1 = "beforeAttributeName";
let jt$1 = class jt extends Ut$1 {
  parse(t, e) {
    let s = Vt$1.template({
        body: [],
        blockParams: e,
        loc: this.source.spanFor(t.loc)
      }),
      r = this.parseProgram(s, t);
    return this.pendingError?.eof(r.loc.getEnd()), r;
  }
  Program(t, e) {
    let s = Vt$1.blockItself({
      body: [],
      params: e,
      chained: t.chained,
      loc: this.source.spanFor(t.loc)
    });
    return this.parseProgram(s, t);
  }
  parseProgram(t, e) {
    if (0 === e.body.length) return t;
    let s;
    try {
      this.elementStack.push(t);
      for (let t of e.body) this.acceptNode(t);
    } finally {
      s = this.elementStack.pop();
    }
    if (t !== s) {
      if ("ElementNode" === s?.type) throw ot$1(`Unclosed element \`${s.tag}\``, s.loc);
    }
    return t;
  }
  BlockStatement(t) {
    if ("comment" === this.tokenizer.state) return void this.appendToCommentData(this.sourceForNode(t));
    if ("data" !== this.tokenizer.state && "beforeData" !== this.tokenizer.state) throw ot$1("A block may only be used inside an HTML element or another block.", this.source.spanFor(t.loc));
    const {
        path: e,
        params: s,
        hash: r
      } = Jt$1(this, t),
      n = this.source.spanFor(t.loc);
    let a,
      i = [];
    if (t.program.blockParams?.length) {
      let e = r.loc.collapse("end");
      e = t.program.loc ? e.withEnd(this.source.spanFor(t.program.loc).getStart()) : t.program.body[0] ? e.withEnd(this.source.spanFor(t.program.body[0].loc).getStart()) : e.withEnd(n.getEnd()), a = Rt$1(this.source, t, e);
      const s = e.asString();
      let o = s.indexOf("|") + 1;
      const l = s.indexOf("|", o);
      for (const r of t.program.blockParams) {
        let t, n;
        t = o >= l ? -1 : s.indexOf(r, o), -1 === t || t + r.length > l ? (o = l, n = this.source.spanFor(L)) : (o = t, n = e.sliceStartChars({
          skipStart: o,
          chars: r.length
        }), o += r.length), i.push(Vt$1.var({
          name: r,
          loc: n
        }));
      }
    } else a = Rt$1(this.source, t, n);
    const o = this.Program(a.program, i),
      l = a.inverse ? this.Program(a.inverse, []) : null,
      c = Vt$1.block({
        path: e,
        params: s,
        hash: r,
        defaultBlock: o,
        elseBlock: l,
        loc: this.source.spanFor(t.loc),
        openStrip: t.openStrip,
        inverseStrip: t.inverseStrip,
        closeStrip: t.closeStrip
      });
    Et$1(this.currentElement(), c);
  }
  MustacheStatement(t) {
    this.pendingError?.mustache(this.source.spanFor(t.loc));
    const {
      tokenizer: e
    } = this;
    if ("comment" === e.state) return void this.appendToCommentData(this.sourceForNode(t));
    let s;
    const {
      escaped: r,
      loc: n,
      strip: a
    } = t;
    if ("original" in t.path && "...attributes" === t.path.original) throw ot$1("Illegal use of ...attributes", this.source.spanFor(t.loc));
    if (Nt$1(t.path)) s = Vt$1.mustache({
      path: this.acceptNode(t.path),
      params: [],
      hash: Vt$1.hash({
        pairs: [],
        loc: this.source.spanFor(t.path.loc).collapse("end")
      }),
      trusting: !r,
      loc: this.source.spanFor(n),
      strip: a
    });else {
      const {
        path: e,
        params: i,
        hash: o
      } = Jt$1(this, t);
      s = Vt$1.mustache({
        path: e,
        params: i,
        hash: o,
        trusting: !r,
        loc: this.source.spanFor(n),
        strip: a
      });
    }
    switch (e.state) {
      case "tagOpen":
      case "tagName":
        throw ot$1("Cannot use mustaches in an elements tagname", s.loc);
      case "beforeAttributeName":
        Kt$1(this.currentStartTag, s);
        break;
      case "attributeName":
      case "afterAttributeName":
        this.beginAttributeValue(false), this.finishAttributeValue(), Kt$1(this.currentStartTag, s), e.transitionTo(Dt$1);
        break;
      case "afterAttributeValueQuoted":
        Kt$1(this.currentStartTag, s), e.transitionTo(Dt$1);
        break;
      case "beforeAttributeValue":
        this.beginAttributeValue(false), this.appendDynamicAttributeValuePart(s), e.transitionTo("attributeValueUnquoted");
        break;
      case "attributeValueDoubleQuoted":
      case "attributeValueSingleQuoted":
      case "attributeValueUnquoted":
        this.appendDynamicAttributeValuePart(s);
        break;
      default:
        Et$1(this.currentElement(), s);
    }
    return s;
  }
  appendDynamicAttributeValuePart(t) {
    this.finalizeTextPart();
    const e = this.currentAttr;
    e.isDynamic = true, e.parts.push(t);
  }
  finalizeTextPart() {
    const t = this.currentAttr.currentPart;
    null !== t && (this.currentAttr.parts.push(t), this.startTextPart());
  }
  startTextPart() {
    this.currentAttr.currentPart = null;
  }
  ContentStatement(t) {
    !function (t, e) {
      let s = e.loc.start.line,
        r = e.loc.start.column;
      const n = function (t, e) {
        if ("" === e) return {
          lines: t.split("\n").length - 1,
          columns: 0
        };
        const [s] = t.split(e),
          r = s.split(/\n/u),
          n = r.length - 1;
        return {
          lines: n,
          columns: r[n].length
        };
      }(e.original, e.value);
      s += n.lines, n.lines ? r = n.columns : r += n.columns, t.line = s, t.column = r;
    }(this.tokenizer, t), this.tokenizer.tokenizePart(t.value), this.tokenizer.flushData();
  }
  CommentStatement(t) {
    const {
      tokenizer: e
    } = this;
    if ("comment" === e.state) return this.appendToCommentData(this.sourceForNode(t)), null;
    const {
        value: s,
        loc: r
      } = t,
      n = Vt$1.mustacheComment({
        value: s,
        loc: this.source.spanFor(r)
      });
    switch (e.state) {
      case "beforeAttributeName":
      case "afterAttributeName":
        this.currentStartTag.comments.push(n);
        break;
      case "beforeData":
      case "data":
        Et$1(this.currentElement(), n);
        break;
      default:
        throw ot$1(`Using a Handlebars comment when in the \`${e.state}\` state is not supported`, this.source.spanFor(t.loc));
    }
    return n;
  }
  PartialStatement(t) {
    throw ot$1("Handlebars partials are not supported", this.source.spanFor(t.loc));
  }
  PartialBlockStatement(t) {
    throw ot$1("Handlebars partial blocks are not supported", this.source.spanFor(t.loc));
  }
  Decorator(t) {
    throw ot$1("Handlebars decorators are not supported", this.source.spanFor(t.loc));
  }
  DecoratorBlock(t) {
    throw ot$1("Handlebars decorator blocks are not supported", this.source.spanFor(t.loc));
  }
  SubExpression(t) {
    const {
      path: e,
      params: s,
      hash: r
    } = Jt$1(this, t);
    return Vt$1.sexpr({
      path: e,
      params: s,
      hash: r,
      loc: this.source.spanFor(t.loc)
    });
  }
  PathExpression(t) {
    const {
      original: e
    } = t;
    let s;
    if (-1 !== e.indexOf("/")) {
      if ("./" === e.slice(0, 2)) throw ot$1('Using "./" is not supported in Glimmer and unnecessary', this.source.spanFor(t.loc));
      if ("../" === e.slice(0, 3)) throw ot$1('Changing context using "../" is not supported in Glimmer', this.source.spanFor(t.loc));
      if (-1 !== e.indexOf(".")) throw ot$1("Mixing '.' and '/' in paths is not supported in Glimmer; use only '.' to separate property paths", this.source.spanFor(t.loc));
      s = [t.parts.join("/")];
    } else {
      if ("." === e) throw ot$1("'.' is not a supported path in Glimmer; check for a path with a trailing '.'", this.source.spanFor(t.loc));
      s = t.parts;
    }
    let r,
      n = false;
    if (/^this(?:\..+)?$/u.test(e) && (n = true), n) r = Vt$1.this({
      loc: this.source.spanFor({
        start: t.loc.start,
        end: {
          line: t.loc.start.line,
          column: t.loc.start.column + 4
        }
      })
    });else if (t.data) {
      const e = s.shift();
      if (void 0 === e) throw ot$1("Attempted to parse a path expression, but it was not valid. Paths beginning with @ must start with a-z.", this.source.spanFor(t.loc));
      r = Vt$1.atName({
        name: `@${e}`,
        loc: this.source.spanFor({
          start: t.loc.start,
          end: {
            line: t.loc.start.line,
            column: t.loc.start.column + e.length + 1
          }
        })
      });
    } else {
      const e = s.shift();
      if (void 0 === e) throw ot$1("Attempted to parse a path expression, but it was not valid. Paths must start with a-z or A-Z.", this.source.spanFor(t.loc));
      r = Vt$1.var({
        name: e,
        loc: this.source.spanFor({
          start: t.loc.start,
          end: {
            line: t.loc.start.line,
            column: t.loc.start.column + e.length
          }
        })
      });
    }
    return Vt$1.path({
      head: r,
      tail: s,
      loc: this.source.spanFor(t.loc)
    });
  }
  Hash(t) {
    const e = t.pairs.map(t => Vt$1.pair({
      key: t.key,
      value: this.acceptNode(t.value),
      loc: this.source.spanFor(t.loc)
    }));
    return Vt$1.hash({
      pairs: e,
      loc: this.source.spanFor(t.loc)
    });
  }
  StringLiteral(t) {
    return Vt$1.literal({
      type: "StringLiteral",
      value: t.value,
      loc: this.source.spanFor(t.loc)
    });
  }
  BooleanLiteral(t) {
    return Vt$1.literal({
      type: "BooleanLiteral",
      value: t.value,
      loc: this.source.spanFor(t.loc)
    });
  }
  NumberLiteral(t) {
    return Vt$1.literal({
      type: "NumberLiteral",
      value: t.value,
      loc: this.source.spanFor(t.loc)
    });
  }
  UndefinedLiteral(t) {
    return Vt$1.literal({
      type: "UndefinedLiteral",
      value: void 0,
      loc: this.source.spanFor(t.loc)
    });
  }
  NullLiteral(t) {
    return Vt$1.literal({
      type: "NullLiteral",
      value: null,
      loc: this.source.spanFor(t.loc)
    });
  }
  constructor(...t) {
    super(...t), this.pendingError = null;
  }
};
function Jt$1(t, e) {
  let s;
  switch (e.path.type) {
    case "PathExpression":
      s = t.PathExpression(e.path);
      break;
    case "SubExpression":
      s = t.SubExpression(e.path);
      break;
    case "StringLiteral":
    case "UndefinedLiteral":
    case "NullLiteral":
    case "NumberLiteral":
    case "BooleanLiteral":
      {
        let s;
        throw s = "BooleanLiteral" === e.path.type ? e.path.original.toString() : "StringLiteral" === e.path.type ? `"${e.path.original}"` : "NullLiteral" === e.path.type ? "null" : "NumberLiteral" === e.path.type ? e.path.value.toString() : "undefined", ot$1(`${e.path.type} "${"StringLiteral" === e.path.type ? e.path.original : s}" cannot be called as a sub-expression, replace (${s}) with ${s}`, t.source.spanFor(e.path.loc));
      }
  }
  const r = e.params.map(e => t.acceptNode(e)),
    n = E(r) ? N(r).loc : s.loc;
  return {
    path: s,
    params: r,
    hash: e.hash ? t.Hash(e.hash) : Vt$1.hash({
      pairs: [],
      loc: t.source.spanFor(n).collapse("end")
    })
  };
}
function Kt$1(t, e) {
  const {
    path: s,
    params: r,
    hash: n,
    loc: a
  } = e;
  if (Nt$1(s)) {
    const r = `{{${function (t) {
      return "UndefinedLiteral" === t.type ? "undefined" : JSON.stringify(t.value);
    }(s)}}}`;
    throw ot$1(`In <${t.name} ... ${r} ..., ${r} is not a valid modifier`, e.loc);
  }
  const i = Vt$1.elementModifier({
    path: s,
    params: r,
    hash: n,
    loc: a
  });
  t.modifiers.push(i);
}
function Rt$1(t, e, s) {
  if (!e.program.loc) {
    const r = e.program.body.at(0),
      n = e.program.body.at(-1);
    if (r && n) e.program.loc = {
      ...r.loc,
      end: n.loc.end
    };else {
      const r = t.spanFor(e.loc);
      e.program.loc = s.withEnd(r.getEnd());
    }
  }
  let r = t.spanFor(e.program.loc).getEnd();
  return e.inverse && !e.inverse.loc && (e.inverse.loc = r.collapsed()), e;
}
function Wt$1(t) {
  return /[\t\n\f ]/u.test(t);
}
let Gt$1 = class Gt extends jt$1 {
  reset() {
    this.currentNode = null;
  }
  beginComment() {
    this.currentNode = {
      type: "CommentStatement",
      value: "",
      start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
    };
  }
  appendToCommentData(t) {
    this.currentComment.value += t;
  }
  finishComment() {
    Et$1(this.currentElement(), Vt$1.comment(this.finish(this.currentComment)));
  }
  beginData() {
    this.currentNode = {
      type: "TextNode",
      chars: "",
      start: this.offset()
    };
  }
  appendToData(t) {
    this.currentData.chars += t;
  }
  finishData() {
    Et$1(this.currentElement(), Vt$1.text(this.finish(this.currentData)));
  }
  tagOpen() {
    this.tagOpenLine = this.tokenizer.line, this.tagOpenColumn = this.tokenizer.column;
  }
  beginStartTag() {
    this.currentNode = {
      type: "StartTag",
      name: "",
      nameStart: null,
      nameEnd: null,
      attributes: [],
      modifiers: [],
      comments: [],
      params: [],
      selfClosing: false,
      start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
    };
  }
  beginEndTag() {
    this.currentNode = {
      type: "EndTag",
      name: "",
      start: this.source.offsetFor(this.tagOpenLine, this.tagOpenColumn)
    };
  }
  finishTag() {
    let t = this.finish(this.currentTag);
    if ("StartTag" === t.type) {
      if (this.finishStartTag(), ":" === t.name) throw ot$1("Invalid named block named detected, you may have created a named block without a name, or you may have began your name with a number. Named blocks must have names that are at least one character long, and begin with a lower case letter", this.source.spanFor({
        start: this.currentTag.start.toJSON(),
        end: this.offset().toJSON()
      }));
      (b.has(t.name) || t.selfClosing) && this.finishEndTag(true);
    } else this.finishEndTag(false);
  }
  finishStartTag() {
    let {
        name: t,
        nameStart: e,
        nameEnd: s
      } = this.currentStartTag,
      r = e.until(s),
      [n, ...a] = t.split("."),
      i = Vt$1.path({
        head: Vt$1.head({
          original: n,
          loc: r.sliceStartChars({
            chars: n.length
          })
        }),
        tail: a,
        loc: r
      }),
      {
        attributes: o,
        modifiers: l,
        comments: c,
        params: h,
        selfClosing: u,
        loc: p
      } = this.finish(this.currentStartTag),
      d = Vt$1.element({
        path: i,
        selfClosing: u,
        attributes: o,
        modifiers: l,
        comments: c,
        params: h,
        children: [],
        openTag: p,
        closeTag: u ? null : J.broken(),
        loc: p
      });
    this.elementStack.push(d);
  }
  finishEndTag(t) {
    let {
        start: e
      } = this.currentTag,
      s = this.finish(this.currentTag),
      r = this.elementStack.pop();
    this.validateEndTag(s, r, t);
    let n = this.currentElement();
    t ? r.closeTag = null : r.selfClosing ? r.closeTag : r.closeTag = e.until(this.offset()), r.loc = r.loc.withEnd(this.offset()), Et$1(n, Vt$1.element(r));
  }
  markTagAsSelfClosing() {
    let t = this.currentTag;
    if ("StartTag" !== t.type) throw ot$1("Invalid end tag: closing tag must not be self-closing", this.source.spanFor({
      start: t.start.toJSON(),
      end: this.offset().toJSON()
    }));
    t.selfClosing = true;
  }
  appendToTagName(t) {
    let e = this.currentTag;
    if (e.name += t, "StartTag" === e.type) {
      let t = this.offset();
      null === e.nameStart && (e.nameStart = t.move(-1)), e.nameEnd = t;
    }
  }
  beginAttribute() {
    let t = this.offset();
    this.currentAttribute = {
      name: "",
      parts: [],
      currentPart: null,
      isQuoted: false,
      isDynamic: false,
      start: t,
      valueSpan: t.collapsed()
    };
  }
  appendToAttributeName(t) {
    this.currentAttr.name += t, "as" === this.currentAttr.name && this.parsePossibleBlockParams();
  }
  beginAttributeValue(t) {
    this.currentAttr.isQuoted = t, this.startTextPart(), this.currentAttr.valueSpan = this.offset().collapsed();
  }
  appendToAttributeValue(t) {
    let e = this.currentAttr.parts,
      s = e[e.length - 1],
      r = this.currentAttr.currentPart;
    if (r) r.chars += t, r.loc = r.loc.withEnd(this.offset());else {
      let e = this.offset();
      e = "\n" === t ? s ? s.loc.getEnd() : this.currentAttr.valueSpan.getStart() : e.move(-1), this.currentAttr.currentPart = Vt$1.text({
        chars: t,
        loc: e.collapsed()
      });
    }
  }
  finishAttributeValue() {
    this.finalizeTextPart();
    let t = this.currentTag,
      e = this.offset();
    if ("EndTag" === t.type) throw ot$1("Invalid end tag: closing tag must not have attributes", this.source.spanFor({
      start: t.start.toJSON(),
      end: e.toJSON()
    }));
    let {
      name: s,
      parts: r,
      start: n,
      isQuoted: a,
      isDynamic: i,
      valueSpan: o
    } = this.currentAttr;
    if (s.startsWith("|") && 0 === r.length && !a && !i) throw ot$1("Invalid block parameters syntax: block parameters must be preceded by the `as` keyword", n.until(n.move(s.length)));
    let l = this.assembleAttributeValue(r, a, i, n.until(e));
    l.loc = o.withEnd(e);
    let c = Vt$1.attr({
      name: s,
      value: l,
      loc: n.until(e)
    });
    this.currentStartTag.attributes.push(c);
  }
  parsePossibleBlockParams() {
    const t = /[!"#%&'()*+./;<=>@[\\\]^`{|}~]/u;
    const e = this.currentStartTag,
      s = this.currentAttr;
    let r = {
      state: "PossibleAs"
    };
    const n = {
      PossibleAs: t => {
        if (Wt$1(t)) r = {
          state: "BeforeStartPipe"
        }, this.tokenizer.transitionTo("afterAttributeName"), this.tokenizer.consume();else {
          if ("|" === t) throw ot$1('Invalid block parameters syntax: expecting at least one space character between "as" and "|"', s.start.until(this.offset().move(1)));
          r = {
            state: "Done"
          };
        }
      },
      BeforeStartPipe: t => {
        Wt$1(t) ? this.tokenizer.consume() : "|" === t ? (r = {
          state: "BeforeBlockParamName"
        }, this.tokenizer.transitionTo("beforeAttributeName"), this.tokenizer.consume()) : r = {
          state: "Done"
        };
      },
      BeforeBlockParamName: t => {
        if (Wt$1(t)) this.tokenizer.consume();else if ("" === t) r = {
          state: "Done"
        }, this.pendingError = {
          mustache(t) {
            throw ot$1("Invalid block parameters syntax: mustaches cannot be used inside parameters list", t);
          },
          eof(t) {
            throw ot$1('Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list', s.start.until(t));
          }
        };else if ("|" === t) {
          if (0 === e.params.length) throw ot$1("Invalid block parameters syntax: empty parameters list, expecting at least one identifier", s.start.until(this.offset().move(1)));
          r = {
            state: "AfterEndPipe"
          }, this.tokenizer.consume();
        } else {
          if (">" === t || "/" === t) throw ot$1('Invalid block parameters syntax: incomplete parameters list, expecting "|" but the tag was closed prematurely', s.start.until(this.offset().move(1)));
          r = {
            state: "BlockParamName",
            name: t,
            start: this.offset()
          }, this.tokenizer.consume();
        }
      },
      BlockParamName: n => {
        if ("" === n) r = {
          state: "Done"
        }, this.pendingError = {
          mustache(t) {
            throw ot$1("Invalid block parameters syntax: mustaches cannot be used inside parameters list", t);
          },
          eof(t) {
            throw ot$1('Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list', s.start.until(t));
          }
        };else if ("|" === n || Wt$1(n)) {
          let s = r.start.until(this.offset());
          if ("this" === r.name || t.test(r.name)) throw ot$1(`Invalid block parameters syntax: invalid identifier name \`${r.name}\``, s);
          e.params.push(Vt$1.var({
            name: r.name,
            loc: s
          })), r = "|" === n ? {
            state: "AfterEndPipe"
          } : {
            state: "BeforeBlockParamName"
          }, this.tokenizer.consume();
        } else {
          if (">" === n || "/" === n) throw ot$1('Invalid block parameters syntax: expecting "|" but the tag was closed prematurely', s.start.until(this.offset().move(1)));
          r.name += n, this.tokenizer.consume();
        }
      },
      AfterEndPipe: t => {
        Wt$1(t) ? this.tokenizer.consume() : "" === t ? (r = {
          state: "Done"
        }, this.pendingError = {
          mustache(t) {
            throw ot$1("Invalid block parameters syntax: modifiers cannot follow parameters list", t);
          },
          eof(t) {
            throw ot$1('Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list', s.start.until(t));
          }
        }) : ">" === t || "/" === t ? r = {
          state: "Done"
        } : (r = {
          state: "Error",
          message: 'Invalid block parameters syntax: expecting the tag to be closed with ">" or "/>" after parameters list',
          start: this.offset()
        }, this.tokenizer.consume());
      },
      Error: t => {
        if ("" === t || "/" === t || ">" === t || Wt$1(t)) throw ot$1(r.message, r.start.until(this.offset()));
        this.tokenizer.consume();
      },
      Done: () => {}
    };
    let a;
    do {
      a = this.tokenizer.peek(), n[r.state](a);
    } while ("Done" !== r.state && "" !== a);
  }
  reportSyntaxError(t) {
    throw ot$1(t, this.offset().collapsed());
  }
  assembleConcatenatedValue(t) {
    let e = C(t),
      s = N(t);
    return Vt$1.concat({
      parts: t,
      loc: this.source.spanFor(e.loc).extend(this.source.spanFor(s.loc))
    });
  }
  validateEndTag(t, e, s) {
    if (b.has(t.name) && !s) throw ot$1(`<${t.name}> elements do not need end tags. You should remove it`, t.loc);
    if ("ElementNode" !== e.type) throw ot$1(`Closing tag </${t.name}> without an open tag`, t.loc);
    if (e.tag !== t.name) throw ot$1(`Closing tag </${t.name}> did not match last open tag <${e.tag}> (on line ${e.loc.startPosition.line})`, t.loc);
  }
  assembleAttributeValue(t, e, s, r) {
    if (s) {
      if (e) return this.assembleConcatenatedValue(t);
      {
        const [e, s] = t;
        if (void 0 === s || "TextNode" === s.type && "/" === s.chars) return e;
        throw ot$1("An unquoted attribute value must be a string or a mustache, preceded by whitespace or a '=' character, and followed by whitespace, a '>' character, or '/>'", r);
      }
    }
    return E(t) ? t[0] : Vt$1.text({
      chars: "",
      loc: r
    });
  }
  constructor(...t) {
    super(...t), this.tagOpenLine = 0, this.tagOpenColumn = 0;
  }
};
const Yt$1 = {
  parse: Qt$1,
  builders: Mt$1,
  print: S,
  traverse: St$1,
  Walker: xt$1
};
let qt$1 = class qt extends EntityParser {
  constructor() {
    super({});
  }
  parse() {}
};
function Qt$1(t, s = {}) {
  let a,
    i,
    o,
    l = s.mode || "precompile";
  "string" == typeof t ? (a = new et$1(t, s.meta?.moduleName), i = "codemod" === l ? parseWithoutProcessing(t, s.parseOptions) : parse(t, s.parseOptions)) : t instanceof et$1 ? (a = t, i = "codemod" === l ? parseWithoutProcessing(t.source, s.parseOptions) : parse(t.source, s.parseOptions)) : (a = new et$1("", s.meta?.moduleName), i = t), "codemod" === l && (o = new qt$1());
  let c = J.forCharPositions(a, 0, a.source.length);
  i.loc = {
    source: "(program)",
    start: c.startPosition,
    end: c.endPosition
  };
  let h = new Gt$1(a, o, l).parse(i, s.locals ?? []);
  if (s.plugins?.ast) for (const t of s.plugins.ast) St$1(h, t(x$1({}, s, {
    syntax: Yt$1
  }, {
    plugins: void 0
  })).visitor);
  return h;
}
function Xt$1(t, e, s, r) {
  const n = function (t, e, s) {
    if ("PathExpression" === t.type) {
      if ("AtHead" === t.head.type || "ThisHead" === t.head.type) return;
      const s = t.head.name;
      if (-1 === e.indexOf(s)) return s;
    } else if ("ElementNode" === t.type) {
      const {
          tag: r
        } = t,
        n = r.charAt(0);
      if (":" === n || "@" === n) return;
      if (!s.includeHtmlElements && -1 === r.indexOf(".") && r.toLowerCase() === r) return;
      if ("this." === r.substr(0, 5)) return;
      if (r.includes(".")) {
        let [t] = r.split(".");
        if (e.includes(t)) return;
      }
      if (e.includes(r)) return;
      return r;
    }
  }(e, s, r);
  if (void 0 !== n && "@" !== n[0]) {
    const e = n.split(".")[0];
    e && !s.includes(e) && t.add(e);
  }
}
function Zt$1(t, e = {
  includeHtmlElements: false,
  includeKeywords: false
}) {
  const s = Qt$1(t),
    r = new Set(),
    n = [];
  St$1(s, {
    Block: {
      enter({
        blockParams: t
      }) {
        t.forEach(t => {
          n.push(t);
        });
      },
      exit({
        blockParams: t
      }) {
        t.forEach(() => {
          n.pop();
        });
      }
    },
    ElementNode: {
      enter(t) {
        t.blockParams.forEach(t => {
          n.push(t);
        }), Xt$1(r, t, n, e);
      },
      exit({
        blockParams: t
      }) {
        t.forEach(() => {
          n.pop();
        });
      }
    },
    PathExpression(t) {
      Xt$1(r, t, n, e);
    }
  });
  let a = [];
  return r.forEach(t => a.push(t)), e.includeKeywords || (a = a.filter(t => !x(t))), a;
}
function te(t) {
  if (void 0 !== t) {
    const s = t;
    return {
      fields: () => class {
        constructor(t) {
          this.type = s, x$1(this, t);
        }
      }
    };
  }
  return {
    fields: () => class {
      constructor(t) {
        x$1(this, t);
      }
    }
  };
}
class ee extends te().fields() {
  static empty(t) {
    return new ee({
      loc: t,
      positional: se.empty(t),
      named: re.empty(t)
    });
  }
  static named(t) {
    return new ee({
      loc: t.loc,
      positional: se.empty(t.loc.collapse("end")),
      named: t
    });
  }
  nth(t) {
    return this.positional.nth(t);
  }
  get(t) {
    return this.named.get(t);
  }
  isEmpty() {
    return this.positional.isEmpty() && this.named.isEmpty();
  }
}
class se extends te().fields() {
  static empty(t) {
    return new se({
      loc: t,
      exprs: []
    });
  }
  get size() {
    return this.exprs.length;
  }
  nth(t) {
    return this.exprs[t] || null;
  }
  isEmpty() {
    return 0 === this.exprs.length;
  }
}
class re extends te().fields() {
  static empty(t) {
    return new re({
      loc: t,
      entries: []
    });
  }
  get size() {
    return this.entries.length;
  }
  get(t) {
    let e = this.entries.filter(e => e.name.chars === t)[0];
    return e ? e.value : null;
  }
  isEmpty() {
    return 0 === this.entries.length;
  }
}
class ne {
  constructor(t) {
    this.loc = t.name.loc.extend(t.value.loc), this.name = t.name, this.value = t.value;
  }
}
class ae extends te("HtmlAttr").fields() {}
class ie extends te("SplatAttr").fields() {}
class oe extends te().fields() {
  toNamedArgument() {
    return new ne({
      name: this.name,
      value: this.value
    });
  }
}
class le extends te("ElementModifier").fields() {}
class ce extends te("GlimmerComment").fields() {}
class he extends te("HtmlText").fields() {}
class ue extends te("HtmlComment").fields() {}
class pe extends te("AppendContent").fields() {
  get callee() {
    return "Call" === this.value.type ? this.value.callee : this.value;
  }
  get args() {
    return "Call" === this.value.type ? this.value.args : ee.empty(this.value.loc.collapse("end"));
  }
}
class de extends te("InvokeBlock").fields() {}
class me extends te("InvokeComponent").fields() {
  get args() {
    let t = this.componentArgs.map(t => t.toNamedArgument());
    return ee.named(new re({
      loc: st$1.range(t, this.callee.loc.collapse("end")),
      entries: t
    }));
  }
}
class fe extends te("SimpleElement").fields() {
  get args() {
    let t = this.componentArgs.map(t => t.toNamedArgument());
    return ee.named(new re({
      loc: st$1.range(t, this.tag.loc.collapse("end")),
      entries: t
    }));
  }
}
class ge extends te("Literal").fields() {
  toSlice() {
    return new j({
      loc: this.loc,
      chars: this.value
    });
  }
}
class be extends te("Path").fields() {}
class ke extends te("Keyword").fields() {}
class we extends te("Call").fields() {}
class ye extends te("Interpolate").fields() {}
class ve extends te().fields() {}
class Se extends te().fields() {}
class xe extends te().fields() {
  get(t) {
    return this.blocks.filter(e => e.name.chars === t)[0] || null;
  }
}
class Pe extends te().fields() {
  get args() {
    let t = this.componentArgs.map(t => t.toNamedArgument());
    return ee.named(new re({
      loc: st$1.range(t, this.name.loc.collapse("end")),
      entries: t
    }));
  }
}
class Ee extends te("This").fields() {}
class Ne extends te("Arg").fields() {}
class Ce extends te("Local").fields() {}
class Ae extends te("Free").fields() {}
const Te = "Helper",
  Le = "Modifier",
  Be = "Component",
  Oe = {
    resolution: () => t.GetStrictKeyword,
    serialize: () => "Strict",
    isAngleBracket: false
  },
  He = {
    ...Oe,
    isAngleBracket: true
  };
let Fe$1 = class Fe {
  static namespaced(t, e = false) {
    return new Fe([t], e);
  }
  static append() {
    return new Fe([Be, Te]);
  }
  static trustingAppend() {
    return this.namespaced(Te);
  }
  constructor(t, e = false) {
    this.namespaces = t, this.isAngleBracket = e;
  }
  resolution() {
    if (1 !== this.namespaces.length) return t.GetFreeAsComponentOrHelperHead;
    switch (this.namespaces[0]) {
      case Te:
        return t.GetFreeAsHelperHead;
      case Le:
        return t.GetFreeAsModifierHead;
      case Be:
        return t.GetFreeAsComponentHead;
    }
  }
  serialize() {
    return 1 === this.namespaces.length ? this.namespaces[0] : "ComponentOrHelper";
  }
};
const $e$1 = Te,
  ze$1 = Le,
  Me$1 = Be;
var Ie = Object.freeze({
  __proto__: null,
  AppendContent: pe,
  ArgReference: Ne,
  Args: ee,
  Block: Se,
  COMPONENT_NAMESPACE: Me$1,
  CallExpression: we,
  ComponentArg: oe,
  ElementModifier: le,
  FreeVarReference: Ae,
  GlimmerComment: ce,
  HELPER_NAMESPACE: $e$1,
  HTML_RESOLUTION: He,
  HtmlAttr: ae,
  HtmlComment: ue,
  HtmlText: he,
  InterpolateExpression: ye,
  InvokeBlock: de,
  InvokeComponent: me,
  KeywordExpression: ke,
  LiteralExpression: ge,
  LocalVarReference: Ce,
  LooseModeResolution: Fe$1,
  MODIFIER_NAMESPACE: ze$1,
  NamedArgument: ne,
  NamedArguments: re,
  NamedBlock: Pe,
  NamedBlocks: xe,
  PathExpression: be,
  PositionalArguments: se,
  STRICT_RESOLUTION: Oe,
  SimpleElement: fe,
  SplatAttr: ie,
  Template: ve,
  ThisReference: Ee,
  isLiteral: function (t, e) {
    return "Literal" === t.type && (void 0 === e || ("null" === e ? null === t.value : typeof t.value === e));
  },
  isStrictResolution: function (t) {
    return t === Oe;
  },
  loadResolution: function (t) {
    return "Strict" === t ? Oe : "ComponentOrHelper" === t ? Fe$1.append() : Fe$1.namespaced(t);
  },
  node: te
});
let _e$1 = class _e {
  static top(t, e, s) {
    return new Ve$1(t, e, s);
  }
  child(t) {
    let e = t.map(t => this.allocate(t));
    return new Ue$1(this, t, e);
  }
};
let Ve$1 = class Ve extends _e$1 {
  constructor(t, e, r) {
    super(), this.templateLocals = t, this.keywords = e, this.options = r, this.symbols = [], this.upvars = [], this.size = 1, this.named = h$1(), this.blocks = h$1(), this.usedTemplateLocals = [];
  }
  root() {
    return this;
  }
  hasLexical(t) {
    return this.options.lexicalScope(t);
  }
  hasKeyword(t) {
    return this.keywords.includes(t);
  }
  getKeyword(t) {
    return this.allocateFree(t, Oe);
  }
  getUsedTemplateLocals() {
    return this.usedTemplateLocals;
  }
  has(t) {
    return this.templateLocals.includes(t);
  }
  get(t) {
    let e = this.usedTemplateLocals.indexOf(t);
    return -1 !== e || (e = this.usedTemplateLocals.length, this.usedTemplateLocals.push(t)), [e, true];
  }
  getLocalsMap() {
    return h$1();
  }
  getDebugInfo() {
    return [this.getLocalsMap(), this.named];
  }
  allocateFree(t$1, e) {
    e.resolution() === t.GetFreeAsComponentHead && e.isAngleBracket && (t$1 = this.options.customizeComponentName(t$1));
    let s = this.upvars.indexOf(t$1);
    return -1 !== s || (s = this.upvars.length, this.upvars.push(t$1)), s;
  }
  allocateNamed(t) {
    let e = this.named[t];
    return e || (e = this.named[t] = this.allocate(t)), e;
  }
  allocateBlock(t) {
    "inverse" === t && (t = "else");
    let e = this.blocks[t];
    return e || (e = this.blocks[t] = this.allocate(`&${t}`)), e;
  }
  allocate(t) {
    return this.symbols.push(t), this.size++;
  }
};
let Ue$1 = class Ue extends _e$1 {
  constructor(t, e, s) {
    super(), this.parent = t, this.symbols = e, this.slots = s;
  }
  root() {
    return this.parent.root();
  }
  get locals() {
    return this.symbols;
  }
  hasLexical(t) {
    return this.parent.hasLexical(t);
  }
  getKeyword(t) {
    return this.parent.getKeyword(t);
  }
  hasKeyword(t) {
    return this.parent.hasKeyword(t);
  }
  has(t) {
    return -1 !== this.symbols.indexOf(t) || this.parent.has(t);
  }
  get(t) {
    let e = this.#r(t);
    return e ? [e, false] : this.parent.get(t);
  }
  #r(t) {
    let e = this.symbols.indexOf(t);
    return -1 === e ? null : this.slots[e];
  }
  getLocalsMap() {
    let t = this.parent.getLocalsMap();
    return this.symbols.forEach(e => t[e] = this.get(e)[0]), t;
  }
  getDebugInfo() {
    const t = this.getLocalsMap(),
      e = this.root();
    return [{
      ...t,
      ...e.named
    }, Object.fromEntries(e.upvars.map((t, e) => [t, e]))];
  }
  allocateFree(t, e) {
    return this.parent.allocateFree(t, e);
  }
  allocateNamed(t) {
    return this.parent.allocateNamed(t);
  }
  allocateBlock(t) {
    return this.parent.allocateBlock(t);
  }
  allocate(t) {
    return this.parent.allocate(t);
  }
};
let De$1 = class De {
  template(t, e, s) {
    return new ve({
      table: t,
      body: e,
      loc: s
    });
  }
  block(t, e, s) {
    return new Se({
      scope: t,
      body: e,
      loc: s
    });
  }
  namedBlock(t, e, s) {
    return new Pe({
      name: t,
      block: e,
      attrs: [],
      componentArgs: [],
      modifiers: [],
      loc: s
    });
  }
  simpleNamedBlock(t, e, s) {
    return new je$1({
      selfClosing: false,
      attrs: [],
      componentArgs: [],
      modifiers: [],
      comments: []
    }).named(t, e, s);
  }
  slice(t, e) {
    return new j({
      loc: e,
      chars: t
    });
  }
  args(t, e, s) {
    return new ee({
      loc: s,
      positional: t,
      named: e
    });
  }
  positional(t, e) {
    return new se({
      loc: e,
      exprs: t
    });
  }
  namedArgument(t, e) {
    return new ne({
      name: t,
      value: e
    });
  }
  named(t, e) {
    return new re({
      loc: e,
      entries: t
    });
  }
  attr({
    name: t,
    value: e,
    trusting: s
  }, r) {
    return new ae({
      loc: r,
      name: t,
      value: e,
      trusting: s
    });
  }
  splatAttr(t, e) {
    return new ie({
      symbol: t,
      loc: e
    });
  }
  arg({
    name: t,
    value: e,
    trusting: s
  }, r) {
    return new oe({
      name: t,
      value: e,
      trusting: s,
      loc: r
    });
  }
  path(t, e, s) {
    return new be({
      loc: s,
      ref: t,
      tail: e
    });
  }
  keyword(t, e, s) {
    return new ke({
      loc: s,
      name: t,
      symbol: e
    });
  }
  self(t) {
    return new Ee({
      loc: t
    });
  }
  at(t, e, s) {
    return new Ne({
      loc: s,
      name: new j({
        loc: s,
        chars: t
      }),
      symbol: e
    });
  }
  freeVar({
    name: t,
    context: e,
    symbol: s,
    loc: r
  }) {
    return new Ae({
      name: t,
      resolution: e,
      symbol: s,
      loc: r
    });
  }
  localVar(t, e, s, r) {
    return new Ce({
      loc: r,
      name: t,
      isTemplateLocal: s,
      symbol: e
    });
  }
  sexp(t, e) {
    return new we({
      loc: e,
      callee: t.callee,
      args: t.args
    });
  }
  interpolate(t, e) {
    return new ye({
      loc: e,
      parts: t
    });
  }
  literal(t, e) {
    return new ge({
      loc: e,
      value: t
    });
  }
  append({
    table: t,
    trusting: e,
    value: s
  }, r) {
    return new pe({
      table: t,
      trusting: e,
      value: s,
      loc: r
    });
  }
  modifier({
    callee: t,
    args: e
  }, s) {
    return new le({
      loc: s,
      callee: t,
      args: e
    });
  }
  namedBlocks(t, e) {
    return new xe({
      loc: e,
      blocks: t
    });
  }
  blockStatement({
    program: t,
    inverse: e = null,
    ...s
  }, r) {
    let n = t.loc,
      a = [this.namedBlock(j.synthetic("default"), t, t.loc)];
    return e && (n = n.extend(e.loc), a.push(this.namedBlock(j.synthetic("else"), e, e.loc))), new de({
      loc: r,
      blocks: this.namedBlocks(a, n),
      callee: s.callee,
      args: s.args
    });
  }
  element(t) {
    return new je$1(t);
  }
};
let je$1 = class je {
  constructor(t) {
    this.base = t, this.builder = new De$1();
  }
  simple(t, s, r) {
    return new fe(x$1({
      tag: t,
      body: s,
      componentArgs: [],
      loc: r
    }, this.base));
  }
  named(t, s, r) {
    return new Pe(x$1({
      name: t,
      block: s,
      componentArgs: [],
      loc: r
    }, this.base));
  }
  selfClosingComponent(t, s) {
    return new me(x$1({
      loc: s,
      callee: t,
      blocks: new xe({
        blocks: [],
        loc: s.sliceEndChars({
          skipEnd: 1,
          chars: 1
        })
      })
    }, this.base));
  }
  componentWithDefaultBlock(t, s, r, n) {
    let a = this.builder.block(r, s, n),
      i = this.builder.namedBlock(j.synthetic("default"), a, n);
    return new me(x$1({
      loc: n,
      callee: t,
      blocks: this.builder.namedBlocks([i], i.loc)
    }, this.base));
  }
  componentWithNamedBlocks(t, s, r) {
    return new me(x$1({
      loc: r,
      callee: t,
      blocks: this.builder.namedBlocks(s, st$1.range(s))
    }, this.base));
  }
};
function Je$1(t) {
  return qe$1(t) ? Fe$1.namespaced($e$1) : null;
}
function Ke$1(t) {
  return qe$1(t) ? Fe$1.namespaced(ze$1) : null;
}
function Re$1(t) {
  return qe$1(t) ? Fe$1.namespaced(Me$1) : null;
}
function We$1(t) {
  return Qe$1(t) ? Fe$1.namespaced(Me$1, true) : null;
}
function Ge$1(t) {
  return qe$1(t) ? Fe$1.namespaced($e$1) : null;
}
function Ye$1(t) {
  let e = qe$1(t),
    s = t.trusting;
  return e ? s ? Fe$1.trustingAppend() : Fe$1.append() : null;
}
function qe$1(t) {
  return Qe$1(t.path);
}
function Qe$1(t) {
  return "PathExpression" === t.type && "VarHead" === t.head.type && 0 === t.tail.length;
}
function Xe$1(t, e = {
  lexicalScope: () => false
}) {
  let s = Qt$1(t, e),
    r = {
      strictMode: false,
      ...e,
      locals: s.blockParams,
      keywords: e.keywords ?? []
    },
    n = _e$1.top(r.locals, r.keywords, {
      customizeComponentName: e.customizeComponentName ?? (t => t),
      lexicalScope: e.lexicalScope
    }),
    a = new Ze$1(t, r, n),
    i = new es(a),
    o = new ns(a.loc(s.loc), s.body.map(t => i.normalize(t)), a).assertTemplate(n);
  return [o, n.getUsedTemplateLocals()];
}
let Ze$1 = class Ze {
  constructor(t, e, s) {
    this.source = t, this.options = e, this.table = s, this.builder = new De$1();
  }
  get strict() {
    return this.options.strictMode || false;
  }
  loc(t) {
    return this.source.spanFor(t);
  }
  resolutionFor(t, e) {
    if (this.strict) return {
      result: Oe
    };
    if (this.isFreeVar(t)) {
      let s = e(t);
      return null === s ? {
        result: "error",
        path: cs(t),
        head: hs(t)
      } : {
        result: s
      };
    }
    return {
      result: Oe
    };
  }
  isLexicalVar(t) {
    return this.table.hasLexical(t);
  }
  isKeyword(t) {
    return this.strict && !this.table.hasLexical(t) && this.table.hasKeyword(t);
  }
  isFreeVar(t) {
    return "PathExpression" === t.type ? "VarHead" === t.head.type && !this.table.has(t.head.name) : "PathExpression" === t.path.type && this.isFreeVar(t.path);
  }
  hasBinding(t) {
    return this.table.has(t) || this.table.hasLexical(t);
  }
  child(t) {
    return new Ze(this.source, this.options, this.table.child(t));
  }
  customizeComponentName(t) {
    return this.options.customizeComponentName ? this.options.customizeComponentName(t) : t;
  }
};
class ts {
  constructor(t) {
    this.block = t;
  }
  normalize(t, e) {
    switch (t.type) {
      case "NullLiteral":
      case "BooleanLiteral":
      case "NumberLiteral":
      case "StringLiteral":
      case "UndefinedLiteral":
        return this.block.builder.literal(t.value, this.block.loc(t.loc));
      case "PathExpression":
        return this.path(t, e);
      case "SubExpression":
        {
          os(t.path) && ls(t.path, t.loc);
          let e = this.block.resolutionFor(t, Je$1);
          if ("error" === e.result) throw ot$1(`You attempted to invoke a path (\`${e.path}\`) but ${e.head} was not in scope`, t.loc);
          return this.block.builder.sexp(this.callParts(t, e.result), this.block.loc(t.loc));
        }
    }
  }
  path(t, e) {
    let s = this.block.loc(t.loc);
    if ("VarHead" === t.head.type && 0 === t.tail.length && this.block.isKeyword(t.head.name)) return this.block.builder.keyword(t.head.name, this.block.table.getKeyword(t.head.name), s);
    let r = [],
      n = this.block.loc(t.head.loc);
    for (let e of t.tail) n = n.sliceStartChars({
      chars: e.length,
      skipStart: 1
    }), r.push(new j({
      loc: n,
      chars: e
    }));
    return this.block.builder.path(this.ref(t.head, e), r, s);
  }
  callParts(t, e) {
    let {
        path: s,
        params: r,
        hash: n,
        loc: a
      } = t,
      i = this.normalize(s, e),
      o = r.map(t => this.normalize(t, Oe)),
      l = st$1.range(o, i.loc.collapse("end")),
      c = this.block.loc(n.loc),
      h = st$1.range([l, c]),
      u = this.block.builder.positional(r.map(t => this.normalize(t, Oe)), l),
      p = this.block.builder.named(n.pairs.map(t => this.namedArgument(t)), this.block.loc(n.loc));
    switch (i.type) {
      case "Literal":
        throw ot$1(`Invalid invocation of a literal value (\`${i.value}\`)`, a);
      case "Interpolate":
        throw ot$1("Invalid invocation of a interpolated string", a);
    }
    return {
      callee: i,
      args: this.block.builder.args(u, p, h)
    };
  }
  namedArgument(t) {
    let e = this.block.loc(t.loc).sliceStartChars({
      chars: t.key.length
    });
    return this.block.builder.namedArgument(new j({
      chars: t.key,
      loc: e
    }), this.normalize(t.value, Oe));
  }
  ref(t, e) {
    let {
        block: s
      } = this,
      {
        builder: r,
        table: n
      } = s,
      a = s.loc(t.loc);
    switch (t.type) {
      case "ThisHead":
        if (s.hasBinding("this")) {
          let [t, e] = n.get("this");
          return s.builder.localVar("this", t, e, a);
        }
        return r.self(a);
      case "AtHead":
        {
          let e = n.allocateNamed(t.name);
          return r.at(t.name, e, a);
        }
      case "VarHead":
        if (s.hasBinding(t.name)) {
          let [e, r] = n.get(t.name);
          return s.builder.localVar(t.name, e, r, a);
        }
        {
          let r = s.strict ? Oe : e,
            n = s.table.allocateFree(t.name, r);
          return s.builder.freeVar({
            name: t.name,
            context: r,
            symbol: n,
            loc: a
          });
        }
    }
  }
}
class es {
  constructor(t) {
    this.block = t;
  }
  normalize(t) {
    switch (t.type) {
      case "BlockStatement":
        return this.BlockStatement(t);
      case "ElementNode":
        return new ss(this.block).ElementNode(t);
      case "MustacheStatement":
        return this.MustacheStatement(t);
      case "MustacheCommentStatement":
        return this.MustacheCommentStatement(t);
      case "CommentStatement":
        {
          let e = this.block.loc(t.loc);
          return new ue({
            loc: e,
            text: e.slice({
              skipStart: 4,
              skipEnd: 3
            }).toSlice(t.value)
          });
        }
      case "TextNode":
        return new he({
          loc: this.block.loc(t.loc),
          chars: t.chars
        });
    }
  }
  MustacheCommentStatement(t) {
    let e = this.block.loc(t.loc);
    if ("" === t.value) return new ce({
      loc: e,
      text: j.synthetic("")
    });
    let s = e.asString(),
      r = e;
    if (t.value.startsWith("-")) r = r.sliceStartChars({
      skipStart: s.startsWith("{{~") ? 6 : 5,
      chars: t.value.length
    });else if (t.value.endsWith("-")) {
      const e = s.endsWith("~}}") ? 5 : 4,
        n = s.length - t.value.length - e;
      r = r.slice({
        skipStart: n,
        skipEnd: e
      });
    } else r = r.sliceStartChars({
      skipStart: s.lastIndexOf(t.value),
      chars: t.value.length
    });
    return new ce({
      loc: e,
      text: r.toSlice(t.value)
    });
  }
  MustacheStatement(t) {
    let e,
      {
        path: s,
        params: r,
        hash: n,
        trusting: a
      } = t,
      i = this.block.loc(t.loc);
    if (os(s)) 0 === r.length && 0 === n.pairs.length ? e = this.expr.normalize(s) : ls(s, i);else {
      let a = this.block.resolutionFor(t, Ye$1);
      if ("error" === a.result) throw ot$1(`You attempted to render a path (\`{{${a.path}}}\`), but ${a.head} was not in scope`, i);
      let o = this.expr.callParts({
        path: s,
        params: r,
        hash: n,
        loc: i
      }, a.result);
      e = o.args.isEmpty() ? o.callee : this.block.builder.sexp(o, i);
    }
    return this.block.builder.append({
      table: this.block.table,
      trusting: a,
      value: e
    }, i);
  }
  BlockStatement(t) {
    let {
        program: s,
        inverse: r
      } = t,
      n = this.block.loc(t.loc);
    os(t.path) && ls(t.path, n);
    let a = this.block.resolutionFor(t, Re$1);
    if ("error" === a.result) throw ot$1(`You attempted to invoke a path (\`{{#${a.path}}}\`) but ${a.head} was not in scope`, n);
    let i = this.expr.callParts(t, a.result);
    return this.block.builder.blockStatement(x$1({
      symbols: this.block.table,
      program: this.Block(s),
      inverse: r ? this.Block(r) : null
    }, i), n);
  }
  Block({
    body: t,
    loc: e,
    blockParams: s
  }) {
    let r = this.block.child(s),
      n = new es(r);
    return new as(this.block.loc(e), t.map(t => n.normalize(t)), this.block).assertBlock(r.table);
  }
  get expr() {
    return new ts(this.block);
  }
}
class ss {
  constructor(t) {
    this.ctx = t;
  }
  ElementNode(t) {
    let {
        tag: e,
        selfClosing: s,
        comments: r
      } = t,
      n = this.ctx.loc(t.loc),
      [a, ...i] = e.split("."),
      o = this.classifyTag(a, i, t.loc),
      l = t.attributes.filter(t => "@" !== t.name[0]).map(t => this.attr(t)),
      c = t.attributes.filter(t => "@" === t.name[0]).map(t => this.arg(t)),
      h = t.modifiers.map(t => this.modifier(t)),
      u = this.ctx.child(t.blockParams),
      p = new es(u),
      d = t.children.map(t => p.normalize(t)),
      m = this.ctx.builder.element({
        selfClosing: s,
        attrs: l,
        componentArgs: c,
        modifiers: h,
        comments: r.map(t => new es(this.ctx).MustacheCommentStatement(t))
      }),
      f = new is(m, n, d, this.ctx),
      g = this.ctx.loc(t.loc).sliceStartChars({
        chars: e.length,
        skipStart: 1
      });
    if ("ElementHead" === o) return ":" === e[0] ? f.assertNamedBlock(g.slice({
      skipStart: 1
    }).toSlice(e.slice(1)), u.table) : f.assertElement(g.toSlice(e), t.blockParams.length > 0);
    if (t.selfClosing) return m.selfClosingComponent(o, n);
    {
      let s = f.assertComponent(e, u.table, t.blockParams.length > 0);
      return m.componentWithNamedBlocks(o, s, n);
    }
  }
  modifier(t) {
    os(t.path) && ls(t.path, t.loc);
    let e = this.ctx.resolutionFor(t, Ke$1);
    if ("error" === e.result) throw ot$1(`You attempted to invoke a path (\`{{${e.path}}}\`) as a modifier, but ${e.head} was not in scope`, t.loc);
    let s = this.expr.callParts(t, e.result);
    return this.ctx.builder.modifier(s, this.ctx.loc(t.loc));
  }
  mustacheAttr(t) {
    let {
      path: e,
      params: s,
      hash: r,
      loc: n
    } = t;
    if (os(e)) {
      if (0 === s.length && 0 === r.pairs.length) return this.expr.normalize(e);
      ls(e, n);
    }
    let a = this.ctx.resolutionFor(t, Ge$1);
    if ("error" === a.result) throw ot$1(`You attempted to render a path (\`{{${a.path}}}\`), but ${a.head} was not in scope`, t.loc);
    let i = this.ctx.builder.sexp(this.expr.callParts(t, a.result), this.ctx.loc(t.loc));
    return i.args.isEmpty() ? i.callee : i;
  }
  attrPart(t) {
    switch (t.type) {
      case "MustacheStatement":
        return {
          expr: this.mustacheAttr(t),
          trusting: t.trusting
        };
      case "TextNode":
        return {
          expr: this.ctx.builder.literal(t.chars, this.ctx.loc(t.loc)),
          trusting: true
        };
    }
  }
  attrValue(t) {
    if ("ConcatStatement" === t.type) {
      let e = t.parts.map(t => this.attrPart(t).expr);
      return {
        expr: this.ctx.builder.interpolate(e, this.ctx.loc(t.loc)),
        trusting: false
      };
    }
    return this.attrPart(t);
  }
  attr(t) {
    if ("...attributes" === t.name) return this.ctx.builder.splatAttr(this.ctx.table.allocateBlock("attrs"), this.ctx.loc(t.loc));
    let e = this.ctx.loc(t.loc),
      s = e.sliceStartChars({
        chars: t.name.length
      }).toSlice(t.name),
      r = this.attrValue(t.value);
    return this.ctx.builder.attr({
      name: s,
      value: r.expr,
      trusting: r.trusting
    }, e);
  }
  checkArgCall(t) {
    let {
      value: e
    } = t;
    if ("MustacheStatement" !== e.type) return;
    if (0 !== e.params.length || 0 !== e.hash.pairs.length) return;
    let {
      path: s
    } = e;
    if ("PathExpression" !== s.type) return;
    if (s.tail.length > 0) return;
    let r = this.ctx.resolutionFor(s, () => null);
    if ("error" === r.result && "has-block" !== r.path) throw ot$1(`You attempted to pass a path as argument (\`${t.name}={{${r.path}}}\`) but ${r.head} was not in scope. Try:\n* \`${t.name}={{this.${r.path}}}\` if this is meant to be a property lookup, or\n* \`${t.name}={{(${r.path})}}\` if this is meant to invoke the resolved helper, or\n* \`${t.name}={{helper "${r.path}"}}\` if this is meant to pass the resolved helper by value`, t.loc);
  }
  arg(t) {
    this.checkArgCall(t);
    let e = this.ctx.loc(t.loc),
      s = e.sliceStartChars({
        chars: t.name.length
      }).toSlice(t.name),
      r = this.attrValue(t.value);
    return this.ctx.builder.arg({
      name: s,
      value: r.expr,
      trusting: r.trusting
    }, e);
  }
  classifyTag(t, e, s) {
    let r = (n = t)[0] === n[0]?.toUpperCase() && n[0] !== n[0]?.toLowerCase();
    var n;
    let a = "@" === t[0] || "this" === t || this.ctx.hasBinding(t);
    if (this.ctx.strict && !a) {
      if (r) throw ot$1(`Attempted to invoke a component that was not in scope in a strict mode template, \`<${t}>\`. If you wanted to create an element with that name, convert it to lowercase - \`<${t.toLowerCase()}>\``, s);
      return "ElementHead";
    }
    let i = a || r,
      o = s.sliceStartChars({
        skipStart: 1,
        chars: t.length
      }),
      l = e.reduce((t, e) => t + 1 + e.length, 0),
      c = o.getEnd().move(l),
      h = o.withEnd(c);
    if (i) {
      let r = Vt$1.path({
          head: Vt$1.head({
            original: t,
            loc: o
          }),
          tail: e,
          loc: h
        }),
        n = this.ctx.isLexicalVar(t) ? {
          result: Oe
        } : this.ctx.resolutionFor(r, We$1);
      if ("error" === n.result) throw ot$1(`You attempted to invoke a path (\`<${n.path}>\`) but ${n.head} was not in scope`, s);
      return new ts(this.ctx).normalize(r, n.result);
    }
    if (this.ctx.table.allocateFree(t, Oe), e.length > 0) throw ot$1(`You used ${t}.${e.join(".")} as a tag name, but ${t} is not in scope`, s);
    return "ElementHead";
  }
  get expr() {
    return new ts(this.ctx);
  }
}
class rs {
  constructor(t, e, s) {
    this.loc = t, this.children = e, this.block = s, this.namedBlocks = e.filter(t => t instanceof Pe), this.hasSemanticContent = Boolean(e.filter(t => {
      if (t instanceof Pe) return false;
      switch (t.type) {
        case "GlimmerComment":
        case "HtmlComment":
          return false;
        case "HtmlText":
          return !/^\s*$/u.test(t.chars);
        default:
          return true;
      }
    }).length), this.nonBlockChildren = e.filter(t => !(t instanceof Pe));
  }
}
class ns extends rs {
  assertTemplate(t) {
    if (E(this.namedBlocks)) throw ot$1("Unexpected named block at the top-level of a template", this.loc);
    return this.block.builder.template(t, this.nonBlockChildren, this.block.loc(this.loc));
  }
}
class as extends rs {
  assertBlock(t) {
    if (E(this.namedBlocks)) throw ot$1("Unexpected named block nested in a normal block", this.loc);
    return this.block.builder.block(t, this.nonBlockChildren, this.loc);
  }
}
class is extends rs {
  constructor(t, e, s, r) {
    super(e, s, r), this.el = t;
  }
  assertNamedBlock(t, e) {
    if (this.el.base.selfClosing) throw ot$1(`<:${t.chars}/> is not a valid named block: named blocks cannot be self-closing`, this.loc);
    if (E(this.namedBlocks)) throw ot$1(`Unexpected named block inside <:${t.chars}> named block: named blocks cannot contain nested named blocks`, this.loc);
    if ((s = t.chars)[0] !== s[0]?.toLowerCase() || s[0] === s[0]?.toUpperCase()) throw ot$1(`<:${t.chars}> is not a valid named block, and named blocks must begin with a lowercase letter`, this.loc);
    var s;
    if (this.el.base.attrs.length > 0 || this.el.base.componentArgs.length > 0 || this.el.base.modifiers.length > 0) throw ot$1(`named block <:${t.chars}> cannot have attributes, arguments, or modifiers`, this.loc);
    let r = st$1.range(this.nonBlockChildren, this.loc);
    return this.block.builder.namedBlock(t, this.block.builder.block(e, this.nonBlockChildren, r), this.loc);
  }
  assertElement(t, e) {
    if (e) throw ot$1(`Unexpected block params in <${t.chars}>: simple elements cannot have block params`, this.loc);
    if (E(this.namedBlocks)) {
      let e = this.namedBlocks.map(t => t.name);
      if (1 === e.length) throw ot$1(`Unexpected named block <:foo> inside <${t.chars}> HTML element`, this.loc);
      {
        let s = e.map(t => `<:${t.chars}>`).join(", ");
        throw ot$1(`Unexpected named blocks inside <${t.chars}> HTML element (${s})`, this.loc);
      }
    }
    return this.el.simple(t, this.nonBlockChildren, this.loc);
  }
  assertComponent(t, e, s) {
    if (E(this.namedBlocks) && this.hasSemanticContent) throw ot$1(`Unexpected content inside <${t}> component invocation: when using named blocks, the tag cannot contain other content`, this.loc);
    if (E(this.namedBlocks)) {
      if (s) throw ot$1(`Unexpected block params list on <${t}> component invocation: when passing named blocks, the invocation tag cannot take block params`, this.loc);
      let e = new Set();
      for (let t of this.namedBlocks) {
        let s = t.name.chars;
        if (e.has(s)) throw ot$1(`Component had two named blocks with the same name, \`<:${s}>\`. Only one block with a given name may be passed`, this.loc);
        if ("inverse" === s && e.has("else") || "else" === s && e.has("inverse")) throw ot$1("Component has both <:else> and <:inverse> block. <:inverse> is an alias for <:else>", this.loc);
        e.add(s);
      }
      return this.namedBlocks;
    }
    return [this.block.builder.namedBlock(j.synthetic("default"), this.block.builder.block(e, this.nonBlockChildren, this.loc), this.loc)];
  }
}
function os(t) {
  switch (t.type) {
    case "StringLiteral":
    case "BooleanLiteral":
    case "NumberLiteral":
    case "UndefinedLiteral":
    case "NullLiteral":
      return true;
    default:
      return false;
  }
}
function ls(t, e) {
  throw ot$1(`Unexpected literal \`${"StringLiteral" === t.type ? JSON.stringify(t.value) : String(t.value)}\``, e);
}
function cs(t) {
  return "PathExpression" !== t.type && "PathExpression" === t.path.type ? cs(t.path) : new v({
    entityEncoding: "raw"
  }).print(t);
}
function hs(t) {
  return "PathExpression" === t.type ? t.head.original : "PathExpression" === t.path.type ? hs(t.path) : new v({
    entityEncoding: "raw"
  }).print(t);
}

const V = 0,
  F = 1,
  _ = 2;
function z(e) {
  return !!e && e.length > 0;
}
function W(e, t) {
  if (null === e) return null;
  let r = [];
  for (let n of e) r.push(t(n));
  return r;
}
class $e extends te("Template").fields() {}
class Ge extends te("InElement").fields() {}
class Me extends te("Not").fields() {}
class De extends te("If").fields() {}
class Ve extends te("IfInline").fields() {}
class Fe extends te("Each").fields() {}
class _e extends te("Let").fields() {}
class je extends te("WithDynamicVars").fields() {}
class ze extends te("GetDynamicVar").fields() {}
class We extends te("Log").fields() {}
class qe extends te("InvokeComponent").fields() {}
class Ke extends te("NamedBlocks").fields() {}
class Re extends te("NamedBlock").fields() {}
class Ue extends te("AppendTrustedHTML").fields() {}
class Ye extends te("AppendTextNode").fields() {}
class Je extends te("AppendComment").fields() {}
class Xe extends te("Component").fields() {}
class Ze extends te("StaticAttr").fields() {}
class Qe extends te("DynamicAttr").fields() {}
class et extends te("SimpleElement").fields() {}
class tt extends te("ElementParameters").fields() {}
class rt extends te("Yield").fields() {}
class nt extends te("Debugger").fields() {}
class st extends te("CallExpression").fields() {}
class at extends te("Modifier").fields() {}
class it extends te("InvokeBlock").fields() {}
class lt extends te("SplatAttr").fields() {}
class ot extends te("PathExpression").fields() {}
class ct extends te("Missing").fields() {}
class ut extends te("InterpolateExpression").fields() {}
class pt extends te("HasBlock").fields() {}
class mt extends te("HasBlockParams").fields() {}
class dt extends te("Curry").fields() {}
class ht extends te("Positional").fields() {}
class ft extends te("NamedArguments").fields() {}
class yt extends te("NamedArgument").fields() {}
class kt extends te("Args").fields() {}
class gt extends te("Tail").fields() {}
class vt {
  constructor(e) {
    this.list = e;
  }
  toArray() {
    return this.list;
  }
  map(e) {
    let t = W(this.list, e);
    return new vt(t);
  }
  filter(e) {
    let t = [];
    for (let r of this.list) e(r) && t.push(r);
    return At(t);
  }
  toPresentArray() {
    return this.list;
  }
  into({
    ifPresent: e
  }) {
    return e(this);
  }
}
class wt {
  map(e) {
    return new wt();
  }
  filter(e) {
    return new wt();
  }
  toArray() {
    return this.list;
  }
  toPresentArray() {
    return null;
  }
  into({
    ifEmpty: e
  }) {
    return e();
  }
  constructor() {
    this.list = [];
  }
}
function At(e) {
  return z(e) ? new vt(e) : new wt();
}
class bt {
  static all(...e) {
    let t = [];
    for (let r of e) {
      if (r.isErr) return r.cast();
      t.push(r.value);
    }
    return Bt(t);
  }
}
const xt = bt;
class Et extends bt {
  constructor(e) {
    super(), this.value = e, this.isOk = true, this.isErr = false;
  }
  expect(e) {
    return this.value;
  }
  ifOk(e) {
    return e(this.value), this;
  }
  andThen(e) {
    return e(this.value);
  }
  mapOk(e) {
    return Bt(e(this.value));
  }
  ifErr(e) {
    return this;
  }
  mapErr(e) {
    return this;
  }
}
class Ct extends bt {
  constructor(e) {
    super(), this.reason = e, this.isOk = false, this.isErr = true;
  }
  expect(e) {
    throw new Error(e || "expected an Ok, got Err");
  }
  andThen(e) {
    return this.cast();
  }
  mapOk(e) {
    return this.cast();
  }
  ifOk(e) {
    return this;
  }
  mapErr(e) {
    return St(e(this.reason));
  }
  ifErr(e) {
    return e(this.reason), this;
  }
  cast() {
    return this;
  }
}
function Bt(e) {
  return new Et(e);
}
function St(e) {
  return new Ct(e);
}
class Ot {
  constructor(e = []) {
    this.items = e;
  }
  add(e) {
    this.items.push(e);
  }
  toArray() {
    let e = this.items.filter(e => e instanceof Ct)[0];
    return void 0 !== e ? e.cast() : Bt(this.items.map(e => e.value));
  }
  toOptionalList() {
    return this.toArray().mapOk(e => At(e));
  }
}
function Tt(e) {
  return "Path" === e.type && "Free" === e.ref.type && e.ref.name in P ? new Ie.CallExpression({
    callee: e,
    args: Ie.Args.empty(e.loc),
    loc: e.loc
  }) : e;
}
const Nt = new class {
  visit(e, t) {
    switch (e.type) {
      case "Literal":
        return Bt(this.Literal(e));
      case "Keyword":
        return Bt(this.Keyword(e));
      case "Interpolate":
        return this.Interpolate(e, t);
      case "Path":
        return this.PathExpression(e);
      case "Call":
        {
          let r = Zt.translate(e, t);
          return null !== r ? r : this.CallExpression(e, t);
        }
    }
  }
  visitList(e, t) {
    return new Ot(e.map(e => Nt.visit(e, t))).toOptionalList();
  }
  PathExpression(e) {
    let t = this.VariableReference(e.ref),
      {
        tail: r
      } = e;
    if (z(r)) {
      let s = r[0].loc.extend((n = r, 0 === n.length ? void 0 : n[n.length - 1]).loc);
      return Bt(new ot({
        loc: e.loc,
        head: t,
        tail: new gt({
          loc: s,
          members: r
        })
      }));
    }
    return Bt(t);
    var n;
  }
  VariableReference(e) {
    return e;
  }
  Literal(e) {
    return e;
  }
  Keyword(e) {
    return e;
  }
  Interpolate(e, t) {
    let r = e.parts.map(Tt);
    return Nt.visitList(r, t).mapOk(t => new ut({
      loc: e.loc,
      parts: t
    }));
  }
  CallExpression(e, t) {
    if ("Call" === e.callee.type) throw new Error("unimplemented: subexpression at the head of a subexpression");
    return xt.all(Nt.visit(e.callee, t), Nt.Args(e.args, t)).mapOk(([t, r]) => new st({
      loc: e.loc,
      callee: t,
      args: r
    }));
  }
  Args({
    positional: e,
    named: t,
    loc: r
  }, n) {
    return xt.all(this.Positional(e, n), this.NamedArguments(t, n)).mapOk(([e, t]) => new kt({
      loc: r,
      positional: e,
      named: t
    }));
  }
  Positional(e, t) {
    return Nt.visitList(e.exprs, t).mapOk(t => new ht({
      loc: e.loc,
      list: t
    }));
  }
  NamedArguments(e, t) {
    let r = e.entries.map(e => {
      let r = Tt(e.value);
      return Nt.visit(r, t).mapOk(t => new yt({
        loc: e.loc,
        key: e.name,
        value: t
      }));
    });
    return new Ot(r).toOptionalList().mapOk(t => new ft({
      loc: e.loc,
      entries: t
    }));
  }
}();
class It {
  constructor(e, t, r) {
    this.keyword = e, this.delegate = r;
    let n = new Set();
    for (let e of Pt[t]) n.add(e);
    this.types = n;
  }
  match(e) {
    if (!this.types.has(e.type)) return false;
    let t = Ht(e);
    return null !== t && "Path" === t.type && "Free" === t.ref.type && t.ref.name === this.keyword;
  }
  translate(e, t) {
    if (this.match(e)) {
      let r = Ht(e);
      return null !== r && "Path" === r.type && r.tail.length > 0 ? St(ot$1(`The \`${this.keyword}\` keyword was used incorrectly. It was used as \`${r.loc.asString()}\`, but it cannot be used with additional path segments. \n\nError caused by`, e.loc)) : this.delegate.assert(e, t).andThen(r => this.delegate.translate({
        node: e,
        state: t
      }, r));
    }
    return null;
  }
}
const Pt = {
  Call: ["Call"],
  Block: ["InvokeBlock"],
  Append: ["AppendContent"],
  Modifier: ["ElementModifier"]
};
function Ht(e) {
  switch (e.type) {
    case "Path":
      return e;
    case "AppendContent":
      return Ht(e.value);
    case "Call":
    case "InvokeBlock":
    case "ElementModifier":
      return e.callee;
    default:
      return null;
  }
}
class Lt {
  constructor(e) {
    this._keywords = [], this._type = e;
  }
  kw(e, t) {
    return this._keywords.push(new It(e, this._type, t)), this;
  }
  translate(e, t) {
    for (let r of this._keywords) {
      let n = r.translate(e, t);
      if (null !== n) return n;
    }
    let r = Ht(e);
    if (r && "Path" === r.type && "Free" === r.ref.type && x(r.ref.name)) {
      let {
          name: t
        } = r.ref,
        n = this._type,
        s = P[t];
      if (!s.includes(n)) return St(ot$1(`The \`${t}\` keyword was used incorrectly. It was used as ${$t[n]}, but its valid usages are:\n\n${function (e, t) {
        return t.map(t => {
          switch (t) {
            case "Append":
              return `- As an append statement, as in: {{${e}}}`;
            case "Block":
              return `- As a block statement, as in: {{#${e}}}{{/${e}}}`;
            case "Call":
              return `- As an expression, as in: (${e})`;
            case "Modifier":
              return `- As a modifier, as in: <div {{${e}}}></div>`;
            default:
              return;
          }
        }).join("\n\n");
      }(t, s)}\n\nError caused by`, e.loc));
    }
    return null;
  }
}
const $t = {
  Append: "an append statement",
  Block: "a block statement",
  Call: "a call expression",
  Modifier: "a modifier"
};
function Gt(e) {
  return new Lt(e);
}
function Mt({
  assert: e,
  translate: t
}) {
  return {
    assert: e,
    translate: ({
      node: e,
      state: r
    }, n) => t({
      node: e,
      state: r
    }, n).mapOk(t => new Ye({
      text: t,
      loc: e.loc
    }))
  };
}
const Dt = {
  [V]: "component",
  [F]: "helper",
  [_]: "modifier"
};
function Vt(e) {
  return (t, r) => {
    let n = Dt[e],
      s = 0 === e,
      {
        args: a
      } = t,
      i = a.nth(0);
    if (null === i) return St(ot$1(`(${n}) requires a ${n} definition or identifier as its first positional parameter, did not receive any parameters.`, a.loc));
    if ("Literal" === i.type) {
      if (s && r.isStrict) return St(ot$1(`(${n}) cannot resolve string values in strict mode templates`, t.loc));
      if (!s) return St(ot$1(`(${n}) cannot resolve string values, you must pass a ${n} definition directly`, t.loc));
    }
    return a = new Ie.Args({
      positional: new Ie.PositionalArguments({
        exprs: a.positional.exprs.slice(1),
        loc: a.positional.loc
      }),
      named: a.named,
      loc: a.loc
    }), Bt({
      definition: i,
      args: a
    });
  };
}
function Ft(e) {
  return ({
    node: t,
    state: r
  }, {
    definition: n,
    args: s
  }) => {
    let a = Nt.visit(n, r),
      i = Nt.Args(s, r);
    return xt.all(a, i).mapOk(([r, n]) => new dt({
      loc: t.loc,
      curriedType: e,
      definition: r,
      args: n
    }));
  };
}
function _t(e) {
  return {
    assert: Vt(e),
    translate: Ft(e)
  };
}
const jt = {
  assert: function (e) {
    let t = "AppendContent" === e.type ? e.value : e,
      r = "Call" === t.type ? t.args.named : null,
      n = "Call" === t.type ? t.args.positional : null;
    if (r && !r.isEmpty()) return St(ot$1("(-get-dynamic-vars) does not take any named arguments", e.loc));
    let s = n?.nth(0);
    return s ? n && n.size > 1 ? St(ot$1("(-get-dynamic-vars) only receives one positional arg", e.loc)) : Bt(s) : St(ot$1("(-get-dynamic-vars) requires a var name to get", e.loc));
  },
  translate: function ({
    node: e,
    state: t
  }, r) {
    return Nt.visit(r, t).mapOk(t => new ze({
      name: t,
      loc: e.loc
    }));
  }
};
function zt(e) {
  return t => {
    let r = "AppendContent" === t.type ? t.value : t,
      n = "Call" === r.type ? r.args.named : null,
      s = "Call" === r.type ? r.args.positional : null;
    if (n && !n.isEmpty()) return St(ot$1(`(${e}) does not take any named arguments`, r.loc));
    if (!s || s.isEmpty()) return Bt(j.synthetic("default"));
    if (1 === s.exprs.length) {
      let t = s.exprs[0];
      return Ie.isLiteral(t, "string") ? Bt(t.toSlice()) : St(ot$1(`(${e}) can only receive a string literal as its first argument`, r.loc));
    }
    return St(ot$1(`(${e}) only takes a single positional argument`, r.loc));
  };
}
function Wt(e) {
  return ({
    node: t,
    state: {
      scope: r
    }
  }, n) => Bt("has-block" === e ? new pt({
    loc: t.loc,
    target: n,
    symbol: r.allocateBlock(n.chars)
  }) : new mt({
    loc: t.loc,
    target: n,
    symbol: r.allocateBlock(n.chars)
  }));
}
function qt(e) {
  return {
    assert: zt(e),
    translate: Wt(e)
  };
}
function Kt(e) {
  return t => {
    let r = "unless" === e,
      n = "AppendContent" === t.type ? t.value : t,
      s = "Call" === n.type ? n.args.named : null,
      a = "Call" === n.type ? n.args.positional : null;
    if (s && !s.isEmpty()) return St(ot$1(`(${e}) cannot receive named parameters, received ${s.entries.map(e => e.name.chars).join(", ")}`, t.loc));
    let i = a?.nth(0);
    if (!a || !i) return St(ot$1(`When used inline, (${e}) requires at least two parameters 1. the condition that determines the state of the (${e}), and 2. the value to return if the condition is ${r ? "false" : "true"}. Did not receive any parameters`, t.loc));
    let l = a.nth(1),
      o = a.nth(2);
    return null === l ? St(ot$1(`When used inline, (${e}) requires at least two parameters 1. the condition that determines the state of the (${e}), and 2. the value to return if the condition is ${r ? "false" : "true"}. Received only one parameter, the condition`, t.loc)) : a.size > 3 ? St(ot$1(`When used inline, (${e}) can receive a maximum of three positional parameters 1. the condition that determines the state of the (${e}), 2. the value to return if the condition is ${r ? "false" : "true"}, and 3. the value to return if the condition is ${r ? "true" : "false"}. Received ${a.size} parameters`, t.loc)) : Bt({
      condition: i,
      truthy: l,
      falsy: o
    });
  };
}
function Rt(e) {
  let t = "unless" === e;
  return ({
    node: e,
    state: r
  }, {
    condition: n,
    truthy: s,
    falsy: a
  }) => {
    let i = Nt.visit(n, r),
      l = Nt.visit(s, r),
      o = a ? Nt.visit(a, r) : Bt(null);
    return xt.all(i, l, o).mapOk(([r, n, s]) => (t && (r = new Me({
      value: r,
      loc: e.loc
    })), new Ve({
      loc: e.loc,
      condition: r,
      truthy: n,
      falsy: s
    })));
  };
}
function Ut(e) {
  return {
    assert: Kt(e),
    translate: Rt(e)
  };
}
const Yt = {
    assert: function (e) {
      let {
        args: {
          named: t,
          positional: r
        }
      } = e;
      return t.isEmpty() ? Bt(r) : St(ot$1("(log) does not take any named arguments", e.loc));
    },
    translate: function ({
      node: e,
      state: t
    }, r) {
      return Nt.Positional(r, t).mapOk(t => new We({
        positional: t,
        loc: e.loc
      }));
    }
  },
  Jt = Gt("Append").kw("has-block", Mt(qt("has-block"))).kw("has-block-params", Mt(qt("has-block-params"))).kw("-get-dynamic-var", Mt(jt)).kw("log", Mt(Yt)).kw("if", Mt(Ut("if"))).kw("unless", Mt(Ut("unless"))).kw("yield", {
    assert(e) {
      let {
        args: t
      } = e;
      if (t.named.isEmpty()) return Bt({
        target: it$1.SourceSpan.synthetic("default").toSlice(),
        positional: t.positional
      });
      {
        let e = t.named.get("to");
        return t.named.size > 1 || null === e ? St(ot$1("yield only takes a single named argument: 'to'", t.named.loc)) : Ie.isLiteral(e, "string") ? Bt({
          target: e.toSlice(),
          positional: t.positional
        }) : St(ot$1("you can only yield to a literal string value", e.loc));
      }
    },
    translate: ({
      node: e,
      state: t
    }, {
      target: r,
      positional: n
    }) => Nt.Positional(n, t).mapOk(n => new rt({
      loc: e.loc,
      target: r,
      to: t.scope.allocateBlock(r.chars),
      positional: n
    }))
  }).kw("debugger", {
    assert(e) {
      let {
          args: t
        } = e,
        {
          positional: r
        } = t;
      return t.isEmpty() ? Bt(void 0) : r.isEmpty() ? St(ot$1("debugger does not take any named arguments", e.loc)) : St(ot$1("debugger does not take any positional arguments", e.loc));
    },
    translate: ({
      node: e,
      state: {
        scope: t
      }
    }) => Bt(new nt({
      loc: e.loc,
      scope: t
    }))
  }).kw("component", {
    assert: Vt(0),
    translate({
      node: e,
      state: t
    }, {
      definition: r,
      args: n
    }) {
      let s = Nt.visit(r, t),
        a = Nt.Args(n, t);
      return xt.all(s, a).mapOk(([t, r]) => new qe({
        loc: e.loc,
        definition: t,
        args: r,
        blocks: null
      }));
    }
  }).kw("helper", {
    assert: Vt(1),
    translate({
      node: e,
      state: t
    }, {
      definition: r,
      args: n
    }) {
      let s = Nt.visit(r, t),
        a = Nt.Args(n, t);
      return xt.all(s, a).mapOk(([t, r]) => {
        let n = new st({
          callee: t,
          args: r,
          loc: e.loc
        });
        return new Ye({
          loc: e.loc,
          text: n
        });
      });
    }
  }),
  Xt = Gt("Block").kw("in-element", {
    assert(e) {
      let {
          args: t
        } = e,
        r = t.get("guid");
      if (r) return St(ot$1("Cannot pass `guid` to `{{#in-element}}`", r.loc));
      let n = t.get("insertBefore"),
        s = t.nth(0);
      return null === s ? St(ot$1("{{#in-element}} requires a target element as its first positional parameter", t.loc)) : Bt({
        insertBefore: n,
        destination: s
      });
    },
    translate({
      node: e,
      state: t
    }, {
      insertBefore: r,
      destination: n
    }) {
      let s = e.blocks.get("default"),
        a = hr.NamedBlock(s, t),
        i = Nt.visit(n, t);
      return xt.all(a, i).andThen(([n, s]) => r ? Nt.visit(r, t).mapOk(e => ({
        body: n,
        destination: s,
        insertBefore: e
      })) : Bt({
        body: n,
        destination: s,
        insertBefore: new ct({
          loc: e.callee.loc.collapse("end")
        })
      })).mapOk(({
        body: r,
        destination: n,
        insertBefore: s
      }) => new Ge({
        loc: e.loc,
        block: r,
        insertBefore: s,
        guid: t.generateUniqueCursor(),
        destination: n
      }));
    }
  }).kw("if", {
    assert(e) {
      let {
        args: t
      } = e;
      if (!t.named.isEmpty()) return St(ot$1(`{{#if}} cannot receive named parameters, received ${t.named.entries.map(e => e.name.chars).join(", ")}`, e.loc));
      if (t.positional.size > 1) return St(ot$1(`{{#if}} can only receive one positional parameter in block form, the conditional value. Received ${t.positional.size} parameters`, e.loc));
      let r = t.nth(0);
      return null === r ? St(ot$1("{{#if}} requires a condition as its first positional parameter, did not receive any parameters", e.loc)) : Bt({
        condition: r
      });
    },
    translate({
      node: e,
      state: t
    }, {
      condition: r
    }) {
      let n = e.blocks.get("default"),
        s = e.blocks.get("else"),
        a = Nt.visit(r, t),
        i = hr.NamedBlock(n, t),
        l = s ? hr.NamedBlock(s, t) : Bt(null);
      return xt.all(a, i, l).mapOk(([t, r, n]) => new De({
        loc: e.loc,
        condition: t,
        block: r,
        inverse: n
      }));
    }
  }).kw("unless", {
    assert(e) {
      let {
        args: t
      } = e;
      if (!t.named.isEmpty()) return St(ot$1(`{{#unless}} cannot receive named parameters, received ${t.named.entries.map(e => e.name.chars).join(", ")}`, e.loc));
      if (t.positional.size > 1) return St(ot$1(`{{#unless}} can only receive one positional parameter in block form, the conditional value. Received ${t.positional.size} parameters`, e.loc));
      let r = t.nth(0);
      return null === r ? St(ot$1("{{#unless}} requires a condition as its first positional parameter, did not receive any parameters", e.loc)) : Bt({
        condition: r
      });
    },
    translate({
      node: e,
      state: t
    }, {
      condition: r
    }) {
      let n = e.blocks.get("default"),
        s = e.blocks.get("else"),
        a = Nt.visit(r, t),
        i = hr.NamedBlock(n, t),
        l = s ? hr.NamedBlock(s, t) : Bt(null);
      return xt.all(a, i, l).mapOk(([t, r, n]) => new De({
        loc: e.loc,
        condition: new Me({
          value: t,
          loc: e.loc
        }),
        block: r,
        inverse: n
      }));
    }
  }).kw("each", {
    assert(e) {
      let {
        args: t
      } = e;
      if (!t.named.entries.every(e => "key" === e.name.chars)) return St(ot$1(`{{#each}} can only receive the 'key' named parameter, received ${t.named.entries.filter(e => "key" !== e.name.chars).map(e => e.name.chars).join(", ")}`, t.named.loc));
      if (t.positional.size > 1) return St(ot$1(`{{#each}} can only receive one positional parameter, the collection being iterated. Received ${t.positional.size} parameters`, t.positional.loc));
      let r = t.nth(0),
        n = t.get("key");
      return null === r ? St(ot$1("{{#each}} requires an iterable value to be passed as its first positional parameter, did not receive any parameters", t.loc)) : Bt({
        value: r,
        key: n
      });
    },
    translate({
      node: e,
      state: t
    }, {
      value: r,
      key: n
    }) {
      let s = e.blocks.get("default"),
        a = e.blocks.get("else"),
        i = Nt.visit(r, t),
        l = n ? Nt.visit(n, t) : Bt(null),
        o = hr.NamedBlock(s, t),
        c = a ? hr.NamedBlock(a, t) : Bt(null);
      return xt.all(i, l, o, c).mapOk(([t, r, n, s]) => new Fe({
        loc: e.loc,
        value: t,
        key: r,
        block: n,
        inverse: s
      }));
    }
  }).kw("let", {
    assert(e) {
      let {
        args: t
      } = e;
      return t.named.isEmpty() ? 0 === t.positional.size ? St(ot$1("{{#let}} requires at least one value as its first positional parameter, did not receive any parameters", t.positional.loc)) : e.blocks.get("else") ? St(ot$1("{{#let}} cannot receive an {{else}} block", t.positional.loc)) : Bt({
        positional: t.positional
      }) : St(ot$1(`{{#let}} cannot receive named parameters, received ${t.named.entries.map(e => e.name.chars).join(", ")}`, t.named.loc));
    },
    translate({
      node: e,
      state: t
    }, {
      positional: r
    }) {
      let n = e.blocks.get("default"),
        s = Nt.Positional(r, t),
        a = hr.NamedBlock(n, t);
      return xt.all(s, a).mapOk(([t, r]) => new _e({
        loc: e.loc,
        positional: t,
        block: r
      }));
    }
  }).kw("-with-dynamic-vars", {
    assert: e => Bt({
      named: e.args.named
    }),
    translate({
      node: e,
      state: t
    }, {
      named: r
    }) {
      let n = e.blocks.get("default"),
        s = Nt.NamedArguments(r, t),
        a = hr.NamedBlock(n, t);
      return xt.all(s, a).mapOk(([t, r]) => new je({
        loc: e.loc,
        named: t,
        block: r
      }));
    }
  }).kw("component", {
    assert: Vt(0),
    translate({
      node: e,
      state: t
    }, {
      definition: r,
      args: n
    }) {
      let s = Nt.visit(r, t),
        a = Nt.Args(n, t),
        i = hr.NamedBlocks(e.blocks, t);
      return xt.all(s, a, i).mapOk(([t, r, n]) => new qe({
        loc: e.loc,
        definition: t,
        args: r,
        blocks: n
      }));
    }
  }),
  Zt = Gt("Call").kw("has-block", qt("has-block")).kw("has-block-params", qt("has-block-params")).kw("-get-dynamic-var", jt).kw("log", Yt).kw("if", Ut("if")).kw("unless", Ut("unless")).kw("component", _t(0)).kw("helper", _t(1)).kw("modifier", _t(2)),
  Qt = Gt("Modifier"),
  er = "http://www.w3.org/1999/xlink",
  tr = "http://www.w3.org/XML/1998/namespace",
  rr = "http://www.w3.org/2000/xmlns/",
  nr = {
    "xlink:actuate": er,
    "xlink:arcrole": er,
    "xlink:href": er,
    "xlink:role": er,
    "xlink:show": er,
    "xlink:title": er,
    "xlink:type": er,
    "xml:base": tr,
    "xml:lang": tr,
    "xml:space": tr,
    xmlns: rr,
    "xmlns:xlink": rr
  },
  sr = {
    div: r.div,
    span: r.span,
    p: r.p,
    a: r.a
  };
const lr = {
    class: n.class,
    id: n.id,
    value: n.value,
    name: n.name,
    type: n.type,
    style: n.style,
    href: n.href
  };
function cr(e) {
  return lr[e] ?? e;
}
class pr {
  constructor(e, t, r) {
    this.element = e, this.state = r, this.delegate = t;
  }
  toStatement() {
    return this.prepare().andThen(e => this.delegate.toStatement(this, e));
  }
  attr(e) {
    let t = e.name,
      r = e.value,
      n = (s = t.chars, nr[s] || void 0);
    var s;
    return Ie.isLiteral(r, "string") ? Bt(new Ze({
      loc: e.loc,
      name: t,
      value: r.toSlice(),
      namespace: n,
      kind: {
        component: this.delegate.dynamicFeatures
      }
    })) : Nt.visit(Tt(r), this.state).mapOk(r => {
      let s = e.trusting;
      return new Qe({
        loc: e.loc,
        name: t,
        value: r,
        namespace: n,
        kind: {
          trusting: s,
          component: this.delegate.dynamicFeatures
        }
      });
    });
  }
  modifier(e) {
    let t = Qt.translate(e, this.state);
    if (null !== t) return t;
    let r = Nt.visit(e.callee, this.state),
      n = Nt.Args(e.args, this.state);
    return xt.all(r, n).mapOk(([t, r]) => new at({
      loc: e.loc,
      callee: t,
      args: r
    }));
  }
  attrs() {
    let e = new Ot(),
      t = new Ot(),
      r = null,
      n = 0 === this.element.attrs.filter(e => "SplatAttr" === e.type).length;
    for (let t of this.element.attrs) "SplatAttr" === t.type ? e.add(Bt(new lt({
      loc: t.loc,
      symbol: this.state.scope.allocateBlock("attrs")
    }))) : "type" === t.name.chars && n ? r = t : e.add(this.attr(t));
    for (let e of this.element.componentArgs) t.add(this.delegate.arg(e, this));
    return r && e.add(this.attr(r)), xt.all(t.toArray(), e.toArray()).mapOk(([e, t]) => ({
      attrs: t,
      args: new ft({
        loc: at$1(e, it$1.SourceSpan.NON_EXISTENT),
        entries: At(e)
      })
    }));
  }
  prepare() {
    let e = this.attrs(),
      t = new Ot(this.element.modifiers.map(e => this.modifier(e))).toArray();
    return xt.all(e, t).mapOk(([e, t]) => {
      let {
          attrs: r,
          args: n
        } = e,
        s = [...r, ...t];
      return {
        args: n,
        params: new tt({
          loc: at$1(s, it$1.SourceSpan.NON_EXISTENT),
          body: At(s)
        })
      };
    });
  }
}
class mr {
  constructor(e, t) {
    this.tag = e, this.element = t, this.dynamicFeatures = true;
  }
  arg(e, {
    state: t
  }) {
    let r = e.name;
    return Nt.visit(Tt(e.value), t).mapOk(t => new yt({
      loc: e.loc,
      key: r,
      value: t
    }));
  }
  toStatement(e, {
    args: t,
    params: r
  }) {
    let {
      element: n,
      state: s
    } = e;
    return this.blocks(s).mapOk(e => new Xe({
      loc: n.loc,
      tag: this.tag,
      params: r,
      args: t,
      blocks: e
    }));
  }
  blocks(e) {
    return hr.NamedBlocks(this.element.blocks, e);
  }
}
class dr {
  constructor(e, t, r) {
    this.tag = e, this.element = t, this.dynamicFeatures = r, this.isComponent = false;
  }
  arg(e) {
    return St(ot$1(`${e.name.chars} is not a valid attribute name. @arguments are only allowed on components, but the tag for this element (\`${this.tag.chars}\`) is a regular, non-component HTML element.`, e.loc));
  }
  toStatement(e, {
    params: t
  }) {
    let {
      state: r,
      element: n
    } = e;
    return hr.visitList(this.element.body, r).mapOk(e => new et({
      loc: n.loc,
      tag: this.tag,
      params: t,
      body: e.toArray(),
      dynamicFeatures: this.dynamicFeatures
    }));
  }
}
const hr = new class {
  visitList(e, t) {
    return new Ot(e.map(e => hr.visit(e, t))).toOptionalList().mapOk(e => e.filter(e => null !== e));
  }
  visit(e, t) {
    switch (e.type) {
      case "GlimmerComment":
        return Bt(null);
      case "AppendContent":
        return this.AppendContent(e, t);
      case "HtmlText":
        return Bt(this.TextNode(e));
      case "HtmlComment":
        return Bt(this.HtmlComment(e));
      case "InvokeBlock":
        return this.InvokeBlock(e, t);
      case "InvokeComponent":
        return this.Component(e, t);
      case "SimpleElement":
        return this.SimpleElement(e, t);
    }
  }
  InvokeBlock(e, t) {
    let r = Xt.translate(e, t);
    if (null !== r) return r;
    let n = Nt.visit(e.callee, t),
      s = Nt.Args(e.args, t);
    return xt.all(n, s).andThen(([r, n]) => this.NamedBlocks(e.blocks, t).mapOk(t => new it({
      loc: e.loc,
      head: r,
      args: n,
      blocks: t
    })));
  }
  NamedBlocks(e, t) {
    return new Ot(e.blocks.map(e => this.NamedBlock(e, t))).toArray().mapOk(t => new Ke({
      loc: e.loc,
      blocks: At(t)
    }));
  }
  NamedBlock(e, t) {
    return t.visitBlock(e.block).mapOk(t => new Re({
      loc: e.loc,
      name: e.name,
      body: t.toArray(),
      scope: e.block.scope
    }));
  }
  SimpleElement(e, t) {
    return new pr(e, new dr(e.tag, e, function ({
      attrs: e,
      modifiers: t
    }) {
      return t.length > 0 || !!e.filter(e => "SplatAttr" === e.type)[0];
    }(e)), t).toStatement();
  }
  Component(e, t) {
    return Nt.visit(e.callee, t).andThen(r => new pr(e, new mr(r, e), t).toStatement());
  }
  AppendContent(e, t) {
    let r = Jt.translate(e, t);
    return null !== r ? r : Nt.visit(e.value, t).mapOk(t => e.trusting ? new Ue({
      loc: e.loc,
      html: t
    }) : new Ye({
      loc: e.loc,
      text: t
    }));
  }
  TextNode(e) {
    return new Ye({
      loc: e.loc,
      text: new Ie.LiteralExpression({
        loc: e.loc,
        value: e.chars
      })
    });
  }
  HtmlComment(e) {
    return new Je({
      loc: e.loc,
      value: e.text
    });
  }
}();
class fr {
  constructor(e, t) {
    this.isStrict = t, this._cursorCount = 0, this._currentScope = e;
  }
  generateUniqueCursor() {
    return `%cursor:${this._cursorCount++}%`;
  }
  get scope() {
    return this._currentScope;
  }
  visitBlock(e) {
    let t = this._currentScope;
    this._currentScope = e.scope;
    try {
      return hr.visitList(e.body, this);
    } finally {
      this._currentScope = t;
    }
  }
}
const yr = "component",
  kr = "helper",
  gr = "modifier";
class vr {
  static validate(e) {
    return new this(e).validate();
  }
  constructor(e) {
    this.template = e;
  }
  validate() {
    return this.Statements(this.template.body).mapOk(() => this.template);
  }
  Statements(e) {
    let t = Bt(null);
    for (let r of e) t = t.andThen(() => this.Statement(r));
    return t;
  }
  NamedBlocks({
    blocks: e
  }) {
    let t = Bt(null);
    for (let r of e.toArray()) t = t.andThen(() => this.NamedBlock(r));
    return t;
  }
  NamedBlock(e) {
    return this.Statements(e.body);
  }
  Statement(e) {
    switch (e.type) {
      case "InElement":
        return this.InElement(e);
      case "Debugger":
      case "AppendComment":
        return Bt(null);
      case "Yield":
        return this.Yield(e);
      case "AppendTrustedHTML":
        return this.AppendTrustedHTML(e);
      case "AppendTextNode":
        return this.AppendTextNode(e);
      case "Component":
        return this.Component(e);
      case "SimpleElement":
        return this.SimpleElement(e);
      case "InvokeBlock":
        return this.InvokeBlock(e);
      case "If":
        return this.If(e);
      case "Each":
        return this.Each(e);
      case "Let":
        return this.Let(e);
      case "WithDynamicVars":
        return this.WithDynamicVars(e);
      case "InvokeComponent":
        return this.InvokeComponent(e);
    }
  }
  Expressions(e) {
    let t = Bt(null);
    for (let r of e) t = t.andThen(() => this.Expression(r));
    return t;
  }
  Expression(e, t = e, r) {
    switch (e.type) {
      case "Literal":
      case "Keyword":
      case "Missing":
      case "This":
      case "Arg":
      case "Local":
      case "HasBlock":
      case "HasBlockParams":
      case "GetDynamicVar":
        return Bt(null);
      case "PathExpression":
        return this.Expression(e.head, t, r);
      case "Free":
        return this.errorFor(e.name, t, r);
      case "InterpolateExpression":
        return this.InterpolateExpression(e, t, r);
      case "CallExpression":
        return this.CallExpression(e, t, r ?? kr);
      case "Not":
        return this.Expression(e.value, t, r);
      case "IfInline":
        return this.IfInline(e);
      case "Curry":
        return this.Curry(e);
      case "Log":
        return this.Log(e);
    }
  }
  Args(e) {
    return this.Positional(e.positional).andThen(() => this.NamedArguments(e.named));
  }
  Positional(e, t) {
    let r = Bt(null),
      n = e.list.toArray();
    return r = 1 === n.length ? this.Expression(n[0], t) : this.Expressions(n), r;
  }
  NamedArguments({
    entries: e
  }) {
    let t = Bt(null);
    for (let r of e.toArray()) t = t.andThen(() => this.NamedArgument(r));
    return t;
  }
  NamedArgument(e) {
    return "CallExpression" === e.value.type ? this.Expression(e.value, e, kr) : this.Expression(e.value, e);
  }
  ElementParameters({
    body: e
  }) {
    let t = Bt(null);
    for (let r of e.toArray()) t = t.andThen(() => this.ElementParameter(r));
    return t;
  }
  ElementParameter(e) {
    switch (e.type) {
      case "StaticAttr":
      case "SplatAttr":
        return Bt(null);
      case "DynamicAttr":
        return this.DynamicAttr(e);
      case "Modifier":
        return this.Modifier(e);
    }
  }
  DynamicAttr(e) {
    return "CallExpression" === e.value.type ? this.Expression(e.value, e, kr) : this.Expression(e.value, e);
  }
  Modifier(e) {
    return this.Expression(e.callee, e, gr).andThen(() => this.Args(e.args));
  }
  InElement(e) {
    return this.Expression(e.destination).andThen(() => this.Expression(e.insertBefore)).andThen(() => this.NamedBlock(e.block));
  }
  Yield(e) {
    return this.Positional(e.positional, e);
  }
  AppendTrustedHTML(e) {
    return this.Expression(e.html, e);
  }
  AppendTextNode(e) {
    return "CallExpression" === e.text.type ? this.Expression(e.text, e, "component or helper") : this.Expression(e.text, e);
  }
  Component(e) {
    return this.Expression(e.tag, e, yr).andThen(() => this.ElementParameters(e.params)).andThen(() => this.NamedArguments(e.args)).andThen(() => this.NamedBlocks(e.blocks));
  }
  SimpleElement(e) {
    return this.ElementParameters(e.params).andThen(() => this.Statements(e.body));
  }
  InvokeBlock(e) {
    return this.Expression(e.head, e.head, yr).andThen(() => this.Args(e.args)).andThen(() => this.NamedBlocks(e.blocks));
  }
  If(e) {
    return this.Expression(e.condition, e).andThen(() => this.NamedBlock(e.block)).andThen(() => e.inverse ? this.NamedBlock(e.inverse) : Bt(null));
  }
  Each(e) {
    return this.Expression(e.value, e).andThen(() => e.key ? this.Expression(e.key, e) : Bt(null)).andThen(() => this.NamedBlock(e.block)).andThen(() => e.inverse ? this.NamedBlock(e.inverse) : Bt(null));
  }
  Let(e) {
    return this.Positional(e.positional).andThen(() => this.NamedBlock(e.block));
  }
  WithDynamicVars(e) {
    return this.NamedArguments(e.named).andThen(() => this.NamedBlock(e.block));
  }
  InvokeComponent(e) {
    return this.Expression(e.definition, e, yr).andThen(() => this.Args(e.args)).andThen(() => e.blocks ? this.NamedBlocks(e.blocks) : Bt(null));
  }
  InterpolateExpression(e, t, r) {
    let n = e.parts.toArray();
    return 1 === n.length ? this.Expression(n[0], t, r) : this.Expressions(n);
  }
  CallExpression(e, t, r) {
    return this.Expression(e.callee, t, r).andThen(() => this.Args(e.args));
  }
  IfInline(e) {
    return this.Expression(e.condition).andThen(() => this.Expression(e.truthy)).andThen(() => e.falsy ? this.Expression(e.falsy) : Bt(null));
  }
  Curry(e) {
    let t;
    return t = 0 === e.curriedType ? yr : 1 === e.curriedType ? kr : gr, this.Expression(e.definition, e, t).andThen(() => this.Args(e.args));
  }
  Log(e) {
    return this.Positional(e.positional, e);
  }
  errorFor(e, t, r = "value") {
    return St(ot$1(`Attempted to resolve a ${r} in a strict mode template, but that value was not in scope: ${e}`, rt$1(t)));
  }
}
const Ar = new class {
  expr(e) {
    switch (e.type) {
      case "Missing":
        return;
      case "Literal":
        return this.Literal(e);
      case "Keyword":
        return this.Keyword(e);
      case "CallExpression":
        return this.CallExpression(e);
      case "PathExpression":
        return this.PathExpression(e);
      case "Arg":
        return [t.GetSymbol, e.symbol];
      case "Local":
        return this.Local(e);
      case "This":
        return [t.GetSymbol, 0];
      case "Free":
        return [e.resolution.resolution(), e.symbol];
      case "HasBlock":
        return this.HasBlock(e);
      case "HasBlockParams":
        return this.HasBlockParams(e);
      case "Curry":
        return this.Curry(e);
      case "Not":
        return this.Not(e);
      case "IfInline":
        return this.IfInline(e);
      case "InterpolateExpression":
        return this.InterpolateExpression(e);
      case "GetDynamicVar":
        return this.GetDynamicVar(e);
      case "Log":
        return this.Log(e);
    }
  }
  Literal({
    value: e
  }) {
    return void 0 === e ? [t.Undefined] : e;
  }
  Missing() {}
  HasBlock({
    symbol: e
  }) {
    return [t.HasBlock, [t.GetSymbol, e]];
  }
  HasBlockParams({
    symbol: e
  }) {
    return [t.HasBlockParams, [t.GetSymbol, e]];
  }
  Curry({
    definition: e,
    curriedType: t$1,
    args: r
  }) {
    return [t.Curry, Ar.expr(e), t$1, Ar.Positional(r.positional), Ar.NamedArguments(r.named)];
  }
  Local({
    isTemplateLocal: e,
    symbol: t$1
  }) {
    return [e ? t.GetLexicalSymbol : t.GetSymbol, t$1];
  }
  Keyword({
    symbol: e
  }) {
    return [t.GetStrictKeyword, e];
  }
  PathExpression({
    head: e,
    tail: t$1
  }) {
    let r = Ar.expr(e);
    return [...r, Ar.Tail(t$1)];
  }
  InterpolateExpression({
    parts: e
  }) {
    return [t.Concat, e.map(e => Ar.expr(e)).toArray()];
  }
  CallExpression({
    callee: e,
    args: t$1
  }) {
    return [t.Call, Ar.expr(e), ...Ar.Args(t$1)];
  }
  Tail({
    members: e
  }) {
    return W(e, e => e.chars);
  }
  Args({
    positional: e,
    named: t
  }) {
    return [this.Positional(e), this.NamedArguments(t)];
  }
  Positional({
    list: e
  }) {
    return e.map(e => Ar.expr(e)).toPresentArray();
  }
  NamedArgument({
    key: e,
    value: t
  }) {
    return [e.chars, Ar.expr(t)];
  }
  NamedArguments({
    entries: e
  }) {
    let t = e.toArray();
    if (z(t)) {
      let e = [],
        r = [];
      for (let n of t) {
        let [t, s] = Ar.NamedArgument(n);
        e.push(t), r.push(s);
      }
      return [e, r];
    }
    return null;
  }
  Not({
    value: e
  }) {
    return [t.Not, Ar.expr(e)];
  }
  IfInline({
    condition: e,
    truthy: t$1,
    falsy: r
  }) {
    let n = [t.IfInline, Ar.expr(e), Ar.expr(t$1)];
    return r && n.push(Ar.expr(r)), n;
  }
  GetDynamicVar({
    name: e
  }) {
    return [t.GetDynamicVar, Ar.expr(e)];
  }
  Log({
    positional: e
  }) {
    return [t.Log, this.Positional(e)];
  }
}();
class br {
  constructor(e) {
    this.statements = e;
  }
  toArray() {
    return this.statements;
  }
}
const xr = new class {
  list(e) {
    let t = [];
    for (let r of e) {
      let e = xr.content(r);
      e instanceof br ? t.push(...e.toArray()) : t.push(e);
    }
    return t;
  }
  content(e) {
    return this.visitContent(e);
  }
  visitContent(e) {
    switch (e.type) {
      case "Debugger":
        return [t.Debugger, ...e.scope.getDebugInfo(), {}];
      case "AppendComment":
        return this.AppendComment(e);
      case "AppendTextNode":
        return this.AppendTextNode(e);
      case "AppendTrustedHTML":
        return this.AppendTrustedHTML(e);
      case "Yield":
        return this.Yield(e);
      case "Component":
        return this.Component(e);
      case "SimpleElement":
        return this.SimpleElement(e);
      case "InElement":
        return this.InElement(e);
      case "InvokeBlock":
        return this.InvokeBlock(e);
      case "If":
        return this.If(e);
      case "Each":
        return this.Each(e);
      case "Let":
        return this.Let(e);
      case "WithDynamicVars":
        return this.WithDynamicVars(e);
      case "InvokeComponent":
        return this.InvokeComponent(e);
      default:
        return;
    }
  }
  Yield({
    to: e,
    positional: t$1
  }) {
    return [t.Yield, e, Ar.Positional(t$1)];
  }
  InElement({
    guid: e,
    insertBefore: t$1,
    destination: r,
    block: n
  }) {
    let a = xr.NamedBlock(n)[1],
      i = Ar.expr(r),
      l = Ar.expr(t$1);
    return void 0 === l ? [t.InElement, a, e, i] : [t.InElement, a, e, i, l];
  }
  InvokeBlock({
    head: e,
    args: t$1,
    blocks: r
  }) {
    return [t.Block, Ar.expr(e), ...Ar.Args(t$1), xr.NamedBlocks(r)];
  }
  AppendTrustedHTML({
    html: e
  }) {
    return [t.TrustingAppend, Ar.expr(e)];
  }
  AppendTextNode({
    text: e
  }) {
    return [t.Append, Ar.expr(e)];
  }
  AppendComment({
    value: e
  }) {
    return [t.Comment, e.chars];
  }
  SimpleElement({
    tag: e,
    params: t$1,
    body: r,
    dynamicFeatures: n
  }) {
    let a = n ? t.OpenElementWithSplat : t.OpenElement;
    return new br([[a, (i = e.chars, sr[i] ?? i)], ...xr.ElementParameters(t$1).toArray(), [t.FlushElement], ...xr.list(r), [t.CloseElement]]);
    var i;
  }
  Component({
    tag: e,
    params: t$1,
    args: r,
    blocks: n
  }) {
    let a = Ar.expr(e),
      i = xr.ElementParameters(t$1),
      l = Ar.NamedArguments(r),
      o = xr.NamedBlocks(n);
    return [t.Component, a, i.toPresentArray(), l, o];
  }
  ElementParameters({
    body: e
  }) {
    return e.map(e => xr.ElementParameter(e));
  }
  ElementParameter(e) {
    switch (e.type) {
      case "SplatAttr":
        return [t.AttrSplat, e.symbol];
      case "DynamicAttr":
        return [(t$1 = e.kind, t$1.component ? t$1.trusting ? t.TrustingComponentAttr : t.ComponentAttr : t$1.trusting ? t.TrustingDynamicAttr : t.DynamicAttr), ...Cr(e)];
      case "StaticAttr":
        return [Br(e.kind), ...Er(e)];
      case "Modifier":
        return [t.Modifier, Ar.expr(e.callee), ...Ar.Args(e.args)];
    }
    var t$1;
  }
  NamedBlocks({
    blocks: e
  }) {
    let t = [],
      r = [];
    for (let n of e.toArray()) {
      let [e, s] = xr.NamedBlock(n);
      t.push(e), r.push(s);
    }
    return t.length > 0 ? [t, r] : null;
  }
  NamedBlock({
    name: e,
    body: t,
    scope: r
  }) {
    let n = e.chars;
    return "inverse" === n && (n = "else"), [n, [xr.list(t), r.slots]];
  }
  If({
    condition: e,
    block: t$1,
    inverse: r
  }) {
    return [t.If, Ar.expr(e), xr.NamedBlock(t$1)[1], r ? xr.NamedBlock(r)[1] : null];
  }
  Each({
    value: e,
    key: t$1,
    block: r,
    inverse: n
  }) {
    return [t.Each, Ar.expr(e), t$1 ? Ar.expr(t$1) : null, xr.NamedBlock(r)[1], n ? xr.NamedBlock(n)[1] : null];
  }
  Let({
    positional: e,
    block: t$1
  }) {
    return [t.Let, Ar.Positional(e), xr.NamedBlock(t$1)[1]];
  }
  WithDynamicVars({
    named: e,
    block: t$1
  }) {
    return [t.WithDynamicVars, Ar.NamedArguments(e), xr.NamedBlock(t$1)[1]];
  }
  InvokeComponent({
    definition: e,
    args: t$1,
    blocks: r
  }) {
    return [t.InvokeComponent, Ar.expr(e), Ar.Positional(t$1.positional), Ar.NamedArguments(t$1.named), r ? xr.NamedBlocks(r) : null];
  }
}();
function Er({
  name: e,
  value: t,
  namespace: r
}) {
  let n = [cr(e.chars), t.chars];
  return r && n.push(r), n;
}
function Cr({
  name: e,
  value: t,
  namespace: r
}) {
  let n = [cr(e.chars), Ar.expr(t)];
  return r && n.push(r), n;
}
function Br(e) {
  return e.component ? t.StaticComponentAttr : t.StaticAttr;
}
const Sr = (() => {
    const e = "object" == typeof module && "function" == typeof module.require ? module.require : globalThis.require;
    if (e) try {
      const t = e("crypto"),
        r = e => {
          const r = t.createHash("sha1");
          return r.update(e, "utf8"), r.digest("base64").substring(0, 8);
        };
      return r("test"), r;
    } catch {}
    return function () {
      return null;
    };
  })(),
  Or = {
    id: Sr
  };
function Tr(e, t = Or) {
  const r = new it$1.Source(e ?? "", t.meta?.moduleName),
    [n, s] = Xe$1(r, {
      lexicalScope: () => false,
      ...t
    }),
    a = function (e, t, r) {
      let n = new fr(t.table, r),
        s = hr.visitList(t.body, n).mapOk(e => new $e({
          loc: t.loc,
          scope: t.table,
          body: e.toArray()
        }));
      return r && (s = s.andThen(e => vr.validate(e))), s;
    }(0, n, t.strictMode ?? false).mapOk(e => function (e) {
      let t = xr.list(e.body),
        r = e.scope;
      return [t, r.symbols, r.upvars];
    }(e));
  if (a.isOk) return [a.value, s];
  throw a.reason;
}

// import { precompileJSON } from '@glimmer/compiler';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// These things are pre-bundled in the old system.
// ember-template-compiler defines them in AMD/requirejs
/**
 * compile a template with an empty scope
 * to use components, helpers, etc, you will need to compile with JS
 *
 * (templates alone do not have a way to import / define complex structures)
 */
function compileHBS(template, options = {}) {
  const name = nameFor(template);
  let component;
  let error;
  try {
    component = setComponentTemplate(compileTemplate(template, {
      moduleName: options.moduleName || name,
      ...options
    }), templateOnly(undefined, "hbs:component"));
  } catch (e) {
    error = e;
  }
  return {
    name,
    component,
    error
  };
}
/**
 * The reason why we can't use precompile directly is because of this:
 * https://github.com/glimmerjs/glimmer-vm/blob/master/packages/%40glimmer/compiler/lib/compiler.ts#L132
 *
 * Support for dynamically compiling templates in strict mode doesn't seem to be fully their yet.
 * That JSON.stringify (and the lines after) prevent us from easily setting the scope function,
 * which means that *everything* is undefined.
 */
function compileTemplate(source, {
  moduleName,
  scope = {}
}) {
  const localScope = {
    array,
    concat,
    fn,
    get,
    hash,
    on,
    ...scope
  };
  const locals = Zt$1(source);
  const options = {
    strictMode: true,
    moduleName,
    locals,
    isProduction: false,
    meta: {
      moduleName
    }
  };

  // Copied from @glimmer/compiler/lib/compiler#precompile
  const [block, usedLocals] = Tr(source, options);
  const usedScope = usedLocals.map(key => {
    const value = localScope[key];
    if (!value) {
      throw new Error(`Attempt to use ${key} in compiled hbs, but it was not available in scope. ` + `Available scope includes: ${Object.keys(localScope)}`);
    }
    return value;
  });
  const blockJSON = JSON.stringify(block);
  const templateJSONObject = {
    id: moduleName,
    block: blockJSON,
    moduleName: moduleName ?? '(dynamically compiled component)',
    scope: () => usedScope,
    isStrictMode: true
  };
  const factory = templateFactory(templateJSONObject);
  return factory;
}

export { compileHBS };
