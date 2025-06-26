import { g as getDefaultExportFromCjs } from './_commonjsHelpers-BFTU3MAI.js';

function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
      if (k !== 'default' && !(k in n)) {
        const d = Object.getOwnPropertyDescriptor(e, k);
        if (d) {
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    } }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

var dist = {};

var formats = {};

var hasRequiredFormats;

function requireFormats () {
	if (hasRequiredFormats) return formats;
	hasRequiredFormats = 1;

	Object.defineProperty(formats, "__esModule", {
	  value: true
	});
	formats.FORMAT_PLAIN = formats.FORMAT_HTML = formats.FORMATS = void 0;
	var FORMAT_HTML = "html";
	formats.FORMAT_HTML = FORMAT_HTML;
	var FORMAT_PLAIN = "plain";
	formats.FORMAT_PLAIN = FORMAT_PLAIN;
	var FORMATS = [FORMAT_HTML, FORMAT_PLAIN];
	formats.FORMATS = FORMATS;
	return formats;
}

var units = {};

var hasRequiredUnits;

function requireUnits () {
	if (hasRequiredUnits) return units;
	hasRequiredUnits = 1;

	Object.defineProperty(units, "__esModule", {
	  value: true
	});
	units.UNIT_WORDS = units.UNIT_WORD = units.UNIT_SENTENCES = units.UNIT_SENTENCE = units.UNIT_PARAGRAPHS = units.UNIT_PARAGRAPH = units.UNITS = void 0;
	var UNIT_WORDS = "words";
	units.UNIT_WORDS = UNIT_WORDS;
	var UNIT_WORD = "word";
	units.UNIT_WORD = UNIT_WORD;
	var UNIT_SENTENCES = "sentences";
	units.UNIT_SENTENCES = UNIT_SENTENCES;
	var UNIT_SENTENCE = "sentence";
	units.UNIT_SENTENCE = UNIT_SENTENCE;
	var UNIT_PARAGRAPHS = "paragraphs";
	units.UNIT_PARAGRAPHS = UNIT_PARAGRAPHS;
	var UNIT_PARAGRAPH = "paragraph";
	units.UNIT_PARAGRAPH = UNIT_PARAGRAPH;
	var UNITS = [UNIT_WORDS, UNIT_WORD, UNIT_SENTENCES, UNIT_SENTENCE, UNIT_PARAGRAPHS, UNIT_PARAGRAPH];
	units.UNITS = UNITS;
	return units;
}

var words = {};

var hasRequiredWords;

function requireWords () {
	if (hasRequiredWords) return words;
	hasRequiredWords = 1;

	Object.defineProperty(words, "__esModule", {
	  value: true
	});
	words.WORDS = void 0;
	var WORDS = ["ad", "adipisicing", "aliqua", "aliquip", "amet", "anim", "aute", "cillum", "commodo", "consectetur", "consequat", "culpa", "cupidatat", "deserunt", "do", "dolor", "dolore", "duis", "ea", "eiusmod", "elit", "enim", "esse", "est", "et", "eu", "ex", "excepteur", "exercitation", "fugiat", "id", "in", "incididunt", "ipsum", "irure", "labore", "laboris", "laborum", "Lorem", "magna", "minim", "mollit", "nisi", "non", "nostrud", "nulla", "occaecat", "officia", "pariatur", "proident", "qui", "quis", "reprehenderit", "sint", "sit", "sunt", "tempor", "ullamco", "ut", "velit", "veniam", "voluptate"];
	words.WORDS = WORDS;
	return words;
}

var LoremIpsum = {};

var lineEndings = {};

var hasRequiredLineEndings;

function requireLineEndings () {
	if (hasRequiredLineEndings) return lineEndings;
	hasRequiredLineEndings = 1;

	Object.defineProperty(lineEndings, "__esModule", {
	  value: true
	});
	lineEndings.LINE_ENDINGS = void 0;
	var LINE_ENDINGS = {
	  POSIX: "\n",
	  WIN32: "\r\n"
	};
	lineEndings.LINE_ENDINGS = LINE_ENDINGS;
	return lineEndings;
}

var generator = {};

var util = {};

var capitalize = {};

var hasRequiredCapitalize;

function requireCapitalize () {
	if (hasRequiredCapitalize) return capitalize;
	hasRequiredCapitalize = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;

		/**
		 * @param str  A string that may or may not be capitalized.
		 * @returns    A capitalized string.
		 */
		var capitalize = function capitalize(str) {
		  var trimmed = str.trim();
		  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
		};
		var _default = capitalize;
		exports["default"] = _default; 
	} (capitalize));
	return capitalize;
}

var isNode = {exports: {}};

var hasRequiredIsNode;

function requireIsNode () {
	if (hasRequiredIsNode) return isNode.exports;
	hasRequiredIsNode = 1;
	(function (module, exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;

		/**
		 * @returns  True if the runtime is NodeJS.
		 */
		var isNode = function isNode() {
		  return !!module.exports;
		};
		var _default = isNode;
		exports["default"] = _default; 
	} (isNode, isNode.exports));
	return isNode.exports;
}

var isReactNative = {};

var hasRequiredIsReactNative;

function requireIsReactNative () {
	if (hasRequiredIsReactNative) return isReactNative;
	hasRequiredIsReactNative = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;

		/**
		 * Check if runtime is ReactNative.
		 * Solution based on https://github.com/knicklabs/lorem-ipsum.js/pull/52/files
		 *
		 * @returns  True if runtime is ReactNative.
		 */
		var isReactNative = function isReactNative() {
		  var isReactNativeResult = false;
		  try {
		    isReactNativeResult = navigator.product === "ReactNative";
		  } catch (e) {
		    isReactNativeResult = false;
		  }
		  return isReactNativeResult;
		};
		var _default = isReactNative;
		exports["default"] = _default; 
	} (isReactNative));
	return isReactNative;
}

var isWindows = {};

var platforms = {};

var hasRequiredPlatforms;

function requirePlatforms () {
	if (hasRequiredPlatforms) return platforms;
	hasRequiredPlatforms = 1;

	Object.defineProperty(platforms, "__esModule", {
	  value: true
	});
	platforms.SUPPORTED_PLATFORMS = void 0;
	var SUPPORTED_PLATFORMS = {
	  DARWIN: "darwin",
	  LINUX: "linux",
	  WIN32: "win32"
	};
	platforms.SUPPORTED_PLATFORMS = SUPPORTED_PLATFORMS;
	return platforms;
}

var hasRequiredIsWindows;

function requireIsWindows () {
	if (hasRequiredIsWindows) return isWindows;
	hasRequiredIsWindows = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;
		var _platforms = /*@__PURE__*/ requirePlatforms();

		/**
		 * @returns True if process is windows.
		 */
		var isWindows = function isWindows() {
		  var isWindowsResult = false;
		  try {
		    isWindowsResult = process.platform === _platforms.SUPPORTED_PLATFORMS.WIN32;
		  } catch (e) {
		    isWindowsResult = false;
		  }
		  return isWindowsResult;
		};
		var _default = isWindows;
		exports["default"] = _default; 
	} (isWindows));
	return isWindows;
}

var makeArrayOfLength = {};

var hasRequiredMakeArrayOfLength;

function requireMakeArrayOfLength () {
	if (hasRequiredMakeArrayOfLength) return makeArrayOfLength;
	hasRequiredMakeArrayOfLength = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;

		/**
		 * @param length Length "x".
		 * @returns      An array of indexes of length "x".
		 */
		var makeArrayOfLength = function makeArrayOfLength() {
		  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		  return Array.apply(null, Array(length)).map(function (item, index) {
		    return index;
		  });
		};
		var _default = makeArrayOfLength;
		exports["default"] = _default; 
	} (makeArrayOfLength));
	return makeArrayOfLength;
}

var makeArrayOfStrings = {};

var hasRequiredMakeArrayOfStrings;

function requireMakeArrayOfStrings () {
	if (hasRequiredMakeArrayOfStrings) return makeArrayOfStrings;
	hasRequiredMakeArrayOfStrings = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;
		var _makeArrayOfLength = _interopRequireDefault(/*@__PURE__*/ requireMakeArrayOfLength());
		function _interopRequireDefault(obj) {
		  return obj && obj.__esModule ? obj : {
		    "default": obj
		  };
		}

		/**
		 * @param length  Length "x".
		 * @returns       An array of strings of length "x".
		 */
		var makeArrayOfStrings = function makeArrayOfStrings(length, makeString) {
		  var arr = (0, _makeArrayOfLength["default"])(length);
		  return arr.map(function () {
		    return makeString();
		  });
		};
		var _default = makeArrayOfStrings;
		exports["default"] = _default; 
	} (makeArrayOfStrings));
	return makeArrayOfStrings;
}

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports, "capitalize", {
		  enumerable: true,
		  get: function get() {
		    return _capitalize["default"];
		  }
		});
		Object.defineProperty(exports, "isNode", {
		  enumerable: true,
		  get: function get() {
		    return _isNode["default"];
		  }
		});
		Object.defineProperty(exports, "isReactNative", {
		  enumerable: true,
		  get: function get() {
		    return _isReactNative["default"];
		  }
		});
		Object.defineProperty(exports, "isWindows", {
		  enumerable: true,
		  get: function get() {
		    return _isWindows["default"];
		  }
		});
		Object.defineProperty(exports, "makeArrayOfLength", {
		  enumerable: true,
		  get: function get() {
		    return _makeArrayOfLength["default"];
		  }
		});
		Object.defineProperty(exports, "makeArrayOfStrings", {
		  enumerable: true,
		  get: function get() {
		    return _makeArrayOfStrings["default"];
		  }
		});
		var _capitalize = _interopRequireDefault(/*@__PURE__*/ requireCapitalize());
		var _isNode = _interopRequireDefault(/*@__PURE__*/ requireIsNode());
		var _isReactNative = _interopRequireDefault(/*@__PURE__*/ requireIsReactNative());
		var _isWindows = _interopRequireDefault(/*@__PURE__*/ requireIsWindows());
		var _makeArrayOfLength = _interopRequireDefault(/*@__PURE__*/ requireMakeArrayOfLength());
		var _makeArrayOfStrings = _interopRequireDefault(/*@__PURE__*/ requireMakeArrayOfStrings());
		function _interopRequireDefault(obj) {
		  return obj && obj.__esModule ? obj : {
		    "default": obj
		  };
		} 
	} (util));
	return util;
}

var hasRequiredGenerator;

function requireGenerator () {
	if (hasRequiredGenerator) return generator;
	hasRequiredGenerator = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;
		var _words = /*@__PURE__*/ requireWords();
		var _util = /*@__PURE__*/ requireUtil();
		function _classCallCheck(instance, Constructor) {
		  if (!(instance instanceof Constructor)) {
		    throw new TypeError("Cannot call a class as a function");
		  }
		}
		function _defineProperties(target, props) {
		  for (var i = 0; i < props.length; i++) {
		    var descriptor = props[i];
		    descriptor.enumerable = descriptor.enumerable || false;
		    descriptor.configurable = true;
		    if ("value" in descriptor) descriptor.writable = true;
		    Object.defineProperty(target, descriptor.key, descriptor);
		  }
		}
		function _createClass(Constructor, protoProps, staticProps) {
		  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
		  Object.defineProperty(Constructor, "prototype", {
		    writable: false
		  });
		  return Constructor;
		}
		function _defineProperty(obj, key, value) {
		  if (key in obj) {
		    Object.defineProperty(obj, key, {
		      value: value,
		      enumerable: true,
		      configurable: true,
		      writable: true
		    });
		  } else {
		    obj[key] = value;
		  }
		  return obj;
		}
		var Generator = /*#__PURE__*/function () {
		  function Generator() {
		    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		      _ref$sentencesPerPara = _ref.sentencesPerParagraph,
		      sentencesPerParagraph = _ref$sentencesPerPara === void 0 ? {
		        max: 7,
		        min: 3
		      } : _ref$sentencesPerPara,
		      _ref$wordsPerSentence = _ref.wordsPerSentence,
		      wordsPerSentence = _ref$wordsPerSentence === void 0 ? {
		        max: 15,
		        min: 5
		      } : _ref$wordsPerSentence,
		      random = _ref.random,
		      _ref$words = _ref.words,
		      words = _ref$words === void 0 ? _words.WORDS : _ref$words;
		    _classCallCheck(this, Generator);
		    _defineProperty(this, "sentencesPerParagraph", void 0);
		    _defineProperty(this, "wordsPerSentence", void 0);
		    _defineProperty(this, "random", void 0);
		    _defineProperty(this, "words", void 0);
		    if (sentencesPerParagraph.min > sentencesPerParagraph.max) {
		      throw new Error("Minimum number of sentences per paragraph (".concat(sentencesPerParagraph.min, ") cannot exceed maximum (").concat(sentencesPerParagraph.max, ")."));
		    }
		    if (wordsPerSentence.min > wordsPerSentence.max) {
		      throw new Error("Minimum number of words per sentence (".concat(wordsPerSentence.min, ") cannot exceed maximum (").concat(wordsPerSentence.max, ")."));
		    }
		    this.sentencesPerParagraph = sentencesPerParagraph;
		    this.words = words;
		    this.wordsPerSentence = wordsPerSentence;
		    this.random = random || Math.random;
		  }
		  _createClass(Generator, [{
		    key: "generateRandomInteger",
		    value: function generateRandomInteger(min, max) {
		      return Math.floor(this.random() * (max - min + 1) + min);
		    }
		  }, {
		    key: "generateRandomWords",
		    value: function generateRandomWords(num) {
		      var _this = this;
		      var _this$wordsPerSentenc = this.wordsPerSentence,
		        min = _this$wordsPerSentenc.min,
		        max = _this$wordsPerSentenc.max;
		      var length = num || this.generateRandomInteger(min, max);
		      return (0, _util.makeArrayOfLength)(length).reduce(function (accumulator, index) {
		        return "".concat(_this.pluckRandomWord(), " ").concat(accumulator);
		      }, "").trim();
		    }
		  }, {
		    key: "generateRandomSentence",
		    value: function generateRandomSentence(num) {
		      return "".concat((0, _util.capitalize)(this.generateRandomWords(num)), ".");
		    }
		  }, {
		    key: "generateRandomParagraph",
		    value: function generateRandomParagraph(num) {
		      var _this2 = this;
		      var _this$sentencesPerPar = this.sentencesPerParagraph,
		        min = _this$sentencesPerPar.min,
		        max = _this$sentencesPerPar.max;
		      var length = num || this.generateRandomInteger(min, max);
		      return (0, _util.makeArrayOfLength)(length).reduce(function (accumulator, index) {
		        return "".concat(_this2.generateRandomSentence(), " ").concat(accumulator);
		      }, "").trim();
		    }
		  }, {
		    key: "pluckRandomWord",
		    value: function pluckRandomWord() {
		      var min = 0;
		      var max = this.words.length - 1;
		      var index = this.generateRandomInteger(min, max);
		      return this.words[index];
		    }
		  }]);
		  return Generator;
		}();
		var _default = Generator;
		exports["default"] = _default; 
	} (generator));
	return generator;
}

var hasRequiredLoremIpsum;

function requireLoremIpsum () {
	if (hasRequiredLoremIpsum) return LoremIpsum;
	hasRequiredLoremIpsum = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		exports["default"] = void 0;
		var _formats = /*@__PURE__*/ requireFormats();
		var _lineEndings = /*@__PURE__*/ requireLineEndings();
		var _generator = _interopRequireDefault(/*@__PURE__*/ requireGenerator());
		var _util = /*@__PURE__*/ requireUtil();
		function _interopRequireDefault(obj) {
		  return obj && obj.__esModule ? obj : {
		    "default": obj
		  };
		}
		function _classCallCheck(instance, Constructor) {
		  if (!(instance instanceof Constructor)) {
		    throw new TypeError("Cannot call a class as a function");
		  }
		}
		function _defineProperties(target, props) {
		  for (var i = 0; i < props.length; i++) {
		    var descriptor = props[i];
		    descriptor.enumerable = descriptor.enumerable || false;
		    descriptor.configurable = true;
		    if ("value" in descriptor) descriptor.writable = true;
		    Object.defineProperty(target, descriptor.key, descriptor);
		  }
		}
		function _createClass(Constructor, protoProps, staticProps) {
		  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
		  Object.defineProperty(Constructor, "prototype", {
		    writable: false
		  });
		  return Constructor;
		}
		function _defineProperty(obj, key, value) {
		  if (key in obj) {
		    Object.defineProperty(obj, key, {
		      value: value,
		      enumerable: true,
		      configurable: true,
		      writable: true
		    });
		  } else {
		    obj[key] = value;
		  }
		  return obj;
		}
		var LoremIpsum = /*#__PURE__*/function () {
		  function LoremIpsum() {
		    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _formats.FORMAT_PLAIN;
		    var suffix = arguments.length > 2 ? arguments[2] : undefined;
		    _classCallCheck(this, LoremIpsum);
		    this.format = format;
		    this.suffix = suffix;
		    _defineProperty(this, "generator", void 0);
		    if (_formats.FORMATS.indexOf(format.toLowerCase()) === -1) {
		      throw new Error("".concat(format, " is an invalid format. Please use ").concat(_formats.FORMATS.join(" or "), "."));
		    }
		    this.generator = new _generator["default"](options);
		  }
		  _createClass(LoremIpsum, [{
		    key: "getLineEnding",
		    value: function getLineEnding() {
		      if (this.suffix) {
		        return this.suffix;
		      }
		      if (!(0, _util.isReactNative)() && (0, _util.isNode)() && (0, _util.isWindows)()) {
		        return _lineEndings.LINE_ENDINGS.WIN32;
		      }
		      return _lineEndings.LINE_ENDINGS.POSIX;
		    }
		  }, {
		    key: "formatString",
		    value: function formatString(str) {
		      if (this.format === _formats.FORMAT_HTML) {
		        return "<p>".concat(str, "</p>");
		      }
		      return str;
		    }
		  }, {
		    key: "formatStrings",
		    value: function formatStrings(strings) {
		      var _this = this;
		      return strings.map(function (str) {
		        return _this.formatString(str);
		      });
		    }
		  }, {
		    key: "generateWords",
		    value: function generateWords(num) {
		      return this.formatString(this.generator.generateRandomWords(num));
		    }
		  }, {
		    key: "generateSentences",
		    value: function generateSentences(num) {
		      return this.formatString(this.generator.generateRandomParagraph(num));
		    }
		  }, {
		    key: "generateParagraphs",
		    value: function generateParagraphs(num) {
		      var makeString = this.generator.generateRandomParagraph.bind(this.generator);
		      return this.formatStrings((0, _util.makeArrayOfStrings)(num, makeString)).join(this.getLineEnding());
		    }
		  }]);
		  return LoremIpsum;
		}();
		var _default = LoremIpsum;
		exports["default"] = _default; 
	} (LoremIpsum));
	return LoremIpsum;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist;
	hasRequiredDist = 1;
	(function (exports) {

		Object.defineProperty(exports, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports, "LoremIpsum", {
		  enumerable: true,
		  get: function get() {
		    return _LoremIpsum["default"];
		  }
		});
		exports.loremIpsum = void 0;
		var _formats = /*@__PURE__*/ requireFormats();
		var _units = /*@__PURE__*/ requireUnits();
		var _words = /*@__PURE__*/ requireWords();
		var _LoremIpsum = _interopRequireDefault(/*@__PURE__*/ requireLoremIpsum());
		function _interopRequireDefault(obj) {
		  return obj && obj.__esModule ? obj : {
		    "default": obj
		  };
		}
		var loremIpsum = function loremIpsum() {
		  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
		    _ref$count = _ref.count,
		    count = _ref$count === void 0 ? 1 : _ref$count,
		    _ref$format = _ref.format,
		    format = _ref$format === void 0 ? _formats.FORMAT_PLAIN : _ref$format,
		    _ref$paragraphLowerBo = _ref.paragraphLowerBound,
		    paragraphLowerBound = _ref$paragraphLowerBo === void 0 ? 3 : _ref$paragraphLowerBo,
		    _ref$paragraphUpperBo = _ref.paragraphUpperBound,
		    paragraphUpperBound = _ref$paragraphUpperBo === void 0 ? 7 : _ref$paragraphUpperBo,
		    random = _ref.random,
		    _ref$sentenceLowerBou = _ref.sentenceLowerBound,
		    sentenceLowerBound = _ref$sentenceLowerBou === void 0 ? 5 : _ref$sentenceLowerBou,
		    _ref$sentenceUpperBou = _ref.sentenceUpperBound,
		    sentenceUpperBound = _ref$sentenceUpperBou === void 0 ? 15 : _ref$sentenceUpperBou,
		    _ref$units = _ref.units,
		    units = _ref$units === void 0 ? _units.UNIT_SENTENCES : _ref$units,
		    _ref$words = _ref.words,
		    words = _ref$words === void 0 ? _words.WORDS : _ref$words,
		    _ref$suffix = _ref.suffix,
		    suffix = _ref$suffix === void 0 ? "" : _ref$suffix;
		  var options = {
		    random: random,
		    sentencesPerParagraph: {
		      max: paragraphUpperBound,
		      min: paragraphLowerBound
		    },
		    words: words,
		    wordsPerSentence: {
		      max: sentenceUpperBound,
		      min: sentenceLowerBound
		    }
		  };
		  var lorem = new _LoremIpsum["default"](options, format, suffix);
		  switch (units) {
		    case _units.UNIT_PARAGRAPHS:
		    case _units.UNIT_PARAGRAPH:
		      return lorem.generateParagraphs(count);
		    case _units.UNIT_SENTENCES:
		    case _units.UNIT_SENTENCE:
		      return lorem.generateSentences(count);
		    case _units.UNIT_WORDS:
		    case _units.UNIT_WORD:
		      return lorem.generateWords(count);
		    default:
		      return "";
		  }
		};
		exports.loremIpsum = loremIpsum; 
	} (dist));
	return dist;
}

var distExports = /*@__PURE__*/ requireDist();
const index = /*@__PURE__*/getDefaultExportFromCjs(distExports);

const index$1 = /*#__PURE__*/_mergeNamespaces({
  __proto__: null,
  default: index
}, [distExports]);

export { index$1 as i };
