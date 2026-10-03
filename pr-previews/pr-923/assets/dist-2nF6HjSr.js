import { t as __commonJSMin } from "./rolldown-runtime-DC62tzP2.js";
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/constants/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FORMAT_PLAIN = exports.FORMAT_HTML = exports.FORMATS = void 0;
	var FORMAT_HTML = "html";
	exports.FORMAT_HTML = FORMAT_HTML;
	var FORMAT_PLAIN = "plain";
	exports.FORMAT_PLAIN = FORMAT_PLAIN;
	exports.FORMATS = [FORMAT_HTML, FORMAT_PLAIN];
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/constants/units.js
var require_units = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UNIT_WORDS = exports.UNIT_WORD = exports.UNIT_SENTENCES = exports.UNIT_SENTENCE = exports.UNIT_PARAGRAPHS = exports.UNIT_PARAGRAPH = exports.UNITS = void 0;
	var UNIT_WORDS = "words";
	exports.UNIT_WORDS = UNIT_WORDS;
	var UNIT_WORD = "word";
	exports.UNIT_WORD = UNIT_WORD;
	var UNIT_SENTENCES = "sentences";
	exports.UNIT_SENTENCES = UNIT_SENTENCES;
	var UNIT_SENTENCE = "sentence";
	exports.UNIT_SENTENCE = UNIT_SENTENCE;
	var UNIT_PARAGRAPHS = "paragraphs";
	exports.UNIT_PARAGRAPHS = UNIT_PARAGRAPHS;
	var UNIT_PARAGRAPH = "paragraph";
	exports.UNIT_PARAGRAPH = UNIT_PARAGRAPH;
	exports.UNITS = [
		UNIT_WORDS,
		UNIT_WORD,
		UNIT_SENTENCES,
		UNIT_SENTENCE,
		UNIT_PARAGRAPHS,
		UNIT_PARAGRAPH
	];
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/constants/words.js
var require_words = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WORDS = void 0;
	exports.WORDS = [
		"ad",
		"adipisicing",
		"aliqua",
		"aliquip",
		"amet",
		"anim",
		"aute",
		"cillum",
		"commodo",
		"consectetur",
		"consequat",
		"culpa",
		"cupidatat",
		"deserunt",
		"do",
		"dolor",
		"dolore",
		"duis",
		"ea",
		"eiusmod",
		"elit",
		"enim",
		"esse",
		"est",
		"et",
		"eu",
		"ex",
		"excepteur",
		"exercitation",
		"fugiat",
		"id",
		"in",
		"incididunt",
		"ipsum",
		"irure",
		"labore",
		"laboris",
		"laborum",
		"Lorem",
		"magna",
		"minim",
		"mollit",
		"nisi",
		"non",
		"nostrud",
		"nulla",
		"occaecat",
		"officia",
		"pariatur",
		"proident",
		"qui",
		"quis",
		"reprehenderit",
		"sint",
		"sit",
		"sunt",
		"tempor",
		"ullamco",
		"ut",
		"velit",
		"veniam",
		"voluptate"
	];
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/constants/lineEndings.js
var require_lineEndings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LINE_ENDINGS = void 0;
	exports.LINE_ENDINGS = {
		POSIX: "\n",
		WIN32: "\r\n"
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/capitalize.js
var require_capitalize = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	exports["default"] = function capitalize(str) {
		var trimmed = str.trim();
		return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/isNode.js
var require_isNode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	exports["default"] = function isNode() {
		return typeof module !== "undefined" && !!module.exports;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/isReactNative.js
var require_isReactNative = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	exports["default"] = function isReactNative() {
		var isReactNativeResult = false;
		try {
			isReactNativeResult = navigator.product === "ReactNative";
		} catch (e) {
			isReactNativeResult = false;
		}
		return isReactNativeResult;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/constants/platforms.js
var require_platforms = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SUPPORTED_PLATFORMS = void 0;
	exports.SUPPORTED_PLATFORMS = {
		DARWIN: "darwin",
		LINUX: "linux",
		WIN32: "win32"
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/isWindows.js
var require_isWindows = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	var _platforms = require_platforms();
	exports["default"] = function isWindows() {
		var isWindowsResult = false;
		try {
			isWindowsResult = process.platform === _platforms.SUPPORTED_PLATFORMS.WIN32;
		} catch (e) {
			isWindowsResult = false;
		}
		return isWindowsResult;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/makeArrayOfLength.js
var require_makeArrayOfLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	exports["default"] = function makeArrayOfLength() {
		var length = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
		return Array.apply(null, Array(length)).map(function(item, index) {
			return index;
		});
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/makeArrayOfStrings.js
var require_makeArrayOfStrings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	var _makeArrayOfLength = _interopRequireDefault(require_makeArrayOfLength());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	exports["default"] = function makeArrayOfStrings(length, makeString) {
		return (0, _makeArrayOfLength["default"])(length).map(function() {
			return makeString();
		});
	};
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/util/index.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
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
	var _capitalize = _interopRequireDefault(require_capitalize());
	var _isNode = _interopRequireDefault(require_isNode());
	var _isReactNative = _interopRequireDefault(require_isReactNative());
	var _isWindows = _interopRequireDefault(require_isWindows());
	var _makeArrayOfLength = _interopRequireDefault(require_makeArrayOfLength());
	var _makeArrayOfStrings = _interopRequireDefault(require_makeArrayOfStrings());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/lib/generator.js
var require_generator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	var _words = require_words();
	var _util = require_util();
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
		if (staticProps) _defineProperties(Constructor, staticProps);
		Object.defineProperty(Constructor, "prototype", { writable: false });
		return Constructor;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	exports["default"] = /* @__PURE__ */ function() {
		function Generator() {
			var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref$sentencesPerPara = _ref.sentencesPerParagraph, sentencesPerParagraph = _ref$sentencesPerPara === void 0 ? {
				max: 7,
				min: 3
			} : _ref$sentencesPerPara, _ref$wordsPerSentence = _ref.wordsPerSentence, wordsPerSentence = _ref$wordsPerSentence === void 0 ? {
				max: 15,
				min: 5
			} : _ref$wordsPerSentence, random = _ref.random;
			_ref.seed;
			var _ref$words = _ref.words, words = _ref$words === void 0 ? _words.WORDS : _ref$words;
			_classCallCheck(this, Generator);
			_defineProperty(this, "sentencesPerParagraph", void 0);
			_defineProperty(this, "wordsPerSentence", void 0);
			_defineProperty(this, "random", void 0);
			_defineProperty(this, "words", void 0);
			if (sentencesPerParagraph.min > sentencesPerParagraph.max) throw new Error("Minimum number of sentences per paragraph (".concat(sentencesPerParagraph.min, ") cannot exceed maximum (").concat(sentencesPerParagraph.max, ")."));
			if (wordsPerSentence.min > wordsPerSentence.max) throw new Error("Minimum number of words per sentence (".concat(wordsPerSentence.min, ") cannot exceed maximum (").concat(wordsPerSentence.max, ")."));
			this.sentencesPerParagraph = sentencesPerParagraph;
			this.words = words;
			this.wordsPerSentence = wordsPerSentence;
			this.random = random || Math.random;
		}
		_createClass(Generator, [
			{
				key: "generateRandomInteger",
				value: function generateRandomInteger(min, max) {
					return Math.floor(this.random() * (max - min + 1) + min);
				}
			},
			{
				key: "generateRandomWords",
				value: function generateRandomWords(num) {
					var _this = this;
					var _this$wordsPerSentenc = this.wordsPerSentence, min = _this$wordsPerSentenc.min, max = _this$wordsPerSentenc.max;
					var length = num || this.generateRandomInteger(min, max);
					return (0, _util.makeArrayOfLength)(length).reduce(function(accumulator, index) {
						return "".concat(_this.pluckRandomWord(), " ").concat(accumulator);
					}, "").trim();
				}
			},
			{
				key: "generateRandomSentence",
				value: function generateRandomSentence(num) {
					return "".concat((0, _util.capitalize)(this.generateRandomWords(num)), ".");
				}
			},
			{
				key: "generateRandomParagraph",
				value: function generateRandomParagraph(num) {
					var _this2 = this;
					var _this$sentencesPerPar = this.sentencesPerParagraph, min = _this$sentencesPerPar.min, max = _this$sentencesPerPar.max;
					var length = num || this.generateRandomInteger(min, max);
					return (0, _util.makeArrayOfLength)(length).reduce(function(accumulator, index) {
						return "".concat(_this2.generateRandomSentence(), " ").concat(accumulator);
					}, "").trim();
				}
			},
			{
				key: "pluckRandomWord",
				value: function pluckRandomWord() {
					var min = 0;
					var max = this.words.length - 1;
					var index = this.generateRandomInteger(min, max);
					return this.words[index];
				}
			}
		]);
		return Generator;
	}();
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/lib/LoremIpsum.js
var require_LoremIpsum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports["default"] = void 0;
	var _formats = require_formats();
	var _lineEndings = require_lineEndings();
	var _generator = _interopRequireDefault(require_generator());
	var _util = require_util();
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
		if (staticProps) _defineProperties(Constructor, staticProps);
		Object.defineProperty(Constructor, "prototype", { writable: false });
		return Constructor;
	}
	function _defineProperty(obj, key, value) {
		if (key in obj) Object.defineProperty(obj, key, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
		else obj[key] = value;
		return obj;
	}
	exports["default"] = /* @__PURE__ */ function() {
		function LoremIpsum() {
			var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			var format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : _formats.FORMAT_PLAIN;
			var suffix = arguments.length > 2 ? arguments[2] : void 0;
			_classCallCheck(this, LoremIpsum);
			this.format = format;
			this.suffix = suffix;
			_defineProperty(this, "generator", void 0);
			if (_formats.FORMATS.indexOf(format.toLowerCase()) === -1) throw new Error("".concat(format, " is an invalid format. Please use ").concat(_formats.FORMATS.join(" or "), "."));
			this.generator = new _generator["default"](options);
		}
		_createClass(LoremIpsum, [
			{
				key: "getLineEnding",
				value: function getLineEnding() {
					if (this.suffix) return this.suffix;
					if (!(0, _util.isReactNative)() && (0, _util.isNode)() && (0, _util.isWindows)()) return _lineEndings.LINE_ENDINGS.WIN32;
					return _lineEndings.LINE_ENDINGS.POSIX;
				}
			},
			{
				key: "formatString",
				value: function formatString(str) {
					if (this.format === _formats.FORMAT_HTML) return "<p>".concat(str, "</p>");
					return str;
				}
			},
			{
				key: "formatStrings",
				value: function formatStrings(strings) {
					var _this = this;
					return strings.map(function(str) {
						return _this.formatString(str);
					});
				}
			},
			{
				key: "generateWords",
				value: function generateWords(num) {
					return this.formatString(this.generator.generateRandomWords(num));
				}
			},
			{
				key: "generateSentences",
				value: function generateSentences(num) {
					return this.formatString(this.generator.generateRandomParagraph(num));
				}
			},
			{
				key: "generateParagraphs",
				value: function generateParagraphs(num) {
					var makeString = this.generator.generateRandomParagraph.bind(this.generator);
					return this.formatStrings((0, _util.makeArrayOfStrings)(num, makeString)).join(this.getLineEnding());
				}
			}
		]);
		return LoremIpsum;
	}();
}));
//#endregion
//#region ../node_modules/.pnpm/lorem-ipsum@2.0.10/node_modules/lorem-ipsum/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "LoremIpsum", {
		enumerable: true,
		get: function get() {
			return _LoremIpsum["default"];
		}
	});
	exports.loremIpsum = void 0;
	var _formats = require_formats();
	var _units = require_units();
	var _words = require_words();
	var _LoremIpsum = _interopRequireDefault(require_LoremIpsum());
	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : { "default": obj };
	}
	exports.loremIpsum = function loremIpsum() {
		var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ref$count = _ref.count, count = _ref$count === void 0 ? 1 : _ref$count, _ref$format = _ref.format, format = _ref$format === void 0 ? _formats.FORMAT_PLAIN : _ref$format, _ref$paragraphLowerBo = _ref.paragraphLowerBound, paragraphLowerBound = _ref$paragraphLowerBo === void 0 ? 3 : _ref$paragraphLowerBo, _ref$paragraphUpperBo = _ref.paragraphUpperBound, paragraphUpperBound = _ref$paragraphUpperBo === void 0 ? 7 : _ref$paragraphUpperBo, random = _ref.random, _ref$sentenceLowerBou = _ref.sentenceLowerBound, sentenceLowerBound = _ref$sentenceLowerBou === void 0 ? 5 : _ref$sentenceLowerBou, _ref$sentenceUpperBou = _ref.sentenceUpperBound, sentenceUpperBound = _ref$sentenceUpperBou === void 0 ? 15 : _ref$sentenceUpperBou, _ref$units = _ref.units, units = _ref$units === void 0 ? _units.UNIT_SENTENCES : _ref$units, _ref$words = _ref.words, words = _ref$words === void 0 ? _words.WORDS : _ref$words, _ref$suffix = _ref.suffix, suffix = _ref$suffix === void 0 ? "" : _ref$suffix;
		var options = {
			random,
			sentencesPerParagraph: {
				max: paragraphUpperBound,
				min: paragraphLowerBound
			},
			words,
			wordsPerSentence: {
				max: sentenceUpperBound,
				min: sentenceLowerBound
			}
		};
		var lorem = new _LoremIpsum["default"](options, format, suffix);
		switch (units) {
			case _units.UNIT_PARAGRAPHS:
			case _units.UNIT_PARAGRAPH: return lorem.generateParagraphs(count);
			case _units.UNIT_SENTENCES:
			case _units.UNIT_SENTENCE: return lorem.generateSentences(count);
			case _units.UNIT_WORDS:
			case _units.UNIT_WORD: return lorem.generateWords(count);
			default: return "";
		}
	};
}));
//#endregion
export default require_dist();
