const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/dist-DQGnE3SR.js","assets/dist-CI_ns6W5.js","assets/w3c-keyname-DnKnFkWh.js","assets/dist-4SiNbISa.js","assets/dist-Y6qztM3-.js","assets/dist-BmczlXxh.js","assets/dist-Cmw-W8LA.js","assets/dist-BH_PiiMj.js","assets/dist-Dv2-DPQ3.js","assets/dist-k3CtR-bq.js","assets/dist-DxdNDvBQ.js","assets/dist-64d5f6xD.js","assets/dist-KYHdpJms.js","assets/dist-C7tNeUlX.js","assets/dist-C1CaM9hg.js","assets/dist-CsFetf1t.js","assets/dist-Bzc97O5O.js","assets/dist-T7A1t02K.js","assets/dist-Cib8anHd.js","assets/dist-BrSDMwWK.js","assets/dist-UwaUJdN8.js","assets/dist-1eOS6pKo.js","assets/dist-DqYSEDHq.js","assets/dist-ISRBAEbV.js","assets/dist-Cu2m_ZUF.js","assets/dist-Dt4qUlrs.js","assets/dist-CTgoxbQK.js","assets/dockerfile-DWvE2pgG.js","assets/simple-mode-CRgApiVB.js","assets/factor-BoG6t0N_.js","assets/javascript-xgJ0sNzO.js","assets/javascript-CxjGFNVr.js","assets/nsis-BD7h4RsE.js","assets/pug-n2330flF.js","assets/dist-D7CMNeiO.js","assets/dist-CXDcTrp3.js"])))=>i.map(i=>d[i]);
import { t as __vitePreload } from "./preload-helper-59eyuSrX.js";
import { a as LanguageDescription, c as StreamLanguage, o as LanguageSupport } from "./dist-CI_ns6W5.js";
//#region ../node_modules/.pnpm/@codemirror+language-data@6.5.2/node_modules/@codemirror/language-data/dist/index.js
function legacy(parser) {
	return new LanguageSupport(StreamLanguage.define(parser));
}
function sql(dialectName) {
	return __vitePreload(() => import("./dist-DQGnE3SR.js").then((m) => m.sql({ dialect: m[dialectName] })), __vite__mapDeps([0,1,2,3,4]));
}
/**
An array of language descriptions for known language packages.
*/
var languages = [
	/*@__PURE__*/ LanguageDescription.of({
		name: "C",
		extensions: [
			"c",
			"h",
			"ino"
		],
		load() {
			return __vitePreload(() => import("./dist-BmczlXxh.js").then((m) => m.cpp()), __vite__mapDeps([5,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "C++",
		alias: ["cpp"],
		extensions: [
			"cpp",
			"c++",
			"cc",
			"cxx",
			"hpp",
			"h++",
			"hh",
			"hxx"
		],
		load() {
			return __vitePreload(() => import("./dist-BmczlXxh.js").then((m) => m.cpp()), __vite__mapDeps([5,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "CQL",
		alias: ["cassandra"],
		extensions: ["cql"],
		load() {
			return sql("Cassandra");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "CSS",
		extensions: ["css"],
		load() {
			return __vitePreload(() => import("./dist-Cmw-W8LA.js").then((m) => m.css()), __vite__mapDeps([6,7,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Go",
		extensions: ["go"],
		load() {
			return __vitePreload(() => import("./dist-Dv2-DPQ3.js").then((m) => m.go()), __vite__mapDeps([8,1,2,3,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "HTML",
		alias: ["xhtml"],
		extensions: [
			"html",
			"htm",
			"handlebars",
			"hbs"
		],
		load() {
			return __vitePreload(() => import("./dist-k3CtR-bq.js").then((m) => m.html()), __vite__mapDeps([9,10,1,2,4,7,11,3]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Java",
		extensions: ["java"],
		load() {
			return __vitePreload(() => import("./dist-KYHdpJms.js").then((m) => m.java()), __vite__mapDeps([12,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "JavaScript",
		alias: [
			"ecmascript",
			"js",
			"node"
		],
		extensions: [
			"js",
			"mjs",
			"cjs"
		],
		load() {
			return __vitePreload(() => import("./dist-C7tNeUlX.js").then((m) => m.javascript()), __vite__mapDeps([13,11,1,2,3,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Jinja",
		extensions: [
			"j2",
			"jinja",
			"jinja2"
		],
		load() {
			return __vitePreload(() => import("./dist-C1CaM9hg.js").then((m) => m.jinja()), __vite__mapDeps([14,1,2,4,10,7,11,3]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "JSON",
		alias: ["json5"],
		extensions: ["json", "map"],
		load() {
			return __vitePreload(() => import("./dist-CsFetf1t.js").then((m) => m.json()), __vite__mapDeps([15,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "JSX",
		extensions: ["jsx"],
		load() {
			return __vitePreload(() => import("./dist-C7tNeUlX.js").then((m) => m.javascript({ jsx: true })), __vite__mapDeps([13,11,1,2,3,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "LESS",
		extensions: ["less"],
		load() {
			return __vitePreload(() => import("./dist-Bzc97O5O.js").then((m) => m.less()), __vite__mapDeps([16,1,2,4,7]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Liquid",
		extensions: ["liquid"],
		load() {
			return __vitePreload(() => import("./dist-T7A1t02K.js").then((m) => m.liquid()), __vite__mapDeps([17,1,2,4,10,7,11,3]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "MariaDB SQL",
		load() {
			return sql("MariaSQL");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Markdown",
		extensions: [
			"md",
			"markdown",
			"mkd"
		],
		load() {
			return __vitePreload(() => import("./dist-Cib8anHd.js").then((m) => m.markdown()), __vite__mapDeps([18,19,1,2,3,10,4,7,11]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "MS SQL",
		load() {
			return sql("MSSQL");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "MySQL",
		load() {
			return sql("MySQL");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "PHP",
		extensions: [
			"php",
			"php3",
			"php4",
			"php5",
			"php7",
			"phtml"
		],
		load() {
			return __vitePreload(() => import("./dist-UwaUJdN8.js").then((m) => m.php()), __vite__mapDeps([20,1,2,4,10,7,11,3]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "PLSQL",
		extensions: ["pls"],
		load() {
			return sql("PLSQL");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "PostgreSQL",
		load() {
			return sql("PostgreSQL");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Python",
		extensions: [
			"BUILD",
			"bzl",
			"py",
			"pyw"
		],
		filename: /^(BUCK|BUILD)$/,
		load() {
			return __vitePreload(() => import("./dist-1eOS6pKo.js").then((m) => m.python()), __vite__mapDeps([21,1,2,3,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Rust",
		extensions: ["rs"],
		load() {
			return __vitePreload(() => import("./dist-DqYSEDHq.js").then((m) => m.rust()), __vite__mapDeps([22,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Sass",
		extensions: ["sass"],
		load() {
			return __vitePreload(() => import("./dist-ISRBAEbV.js").then((m) => m.sass({ indented: true })), __vite__mapDeps([23,1,2,4,7]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SCSS",
		extensions: ["scss"],
		load() {
			return __vitePreload(() => import("./dist-ISRBAEbV.js").then((m) => m.sass()), __vite__mapDeps([23,1,2,4,7]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SQL",
		extensions: ["sql"],
		load() {
			return sql("StandardSQL");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SQLite",
		load() {
			return sql("SQLite");
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "TSX",
		extensions: ["tsx"],
		load() {
			return __vitePreload(() => import("./dist-C7tNeUlX.js").then((m) => m.javascript({
				jsx: true,
				typescript: true
			})), __vite__mapDeps([13,11,1,2,3,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "TypeScript",
		alias: ["ts"],
		extensions: [
			"ts",
			"mts",
			"cts"
		],
		load() {
			return __vitePreload(() => import("./dist-C7tNeUlX.js").then((m) => m.javascript({ typescript: true })), __vite__mapDeps([13,11,1,2,3,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "WebAssembly",
		extensions: ["wat", "wast"],
		load() {
			return __vitePreload(() => import("./dist-Cu2m_ZUF.js").then((m) => m.wast()), __vite__mapDeps([24,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "XML",
		alias: [
			"rss",
			"wsdl",
			"xsd"
		],
		extensions: [
			"xml",
			"xsl",
			"xsd",
			"svg"
		],
		load() {
			return __vitePreload(() => import("./dist-Dt4qUlrs.js").then((m) => m.xml()), __vite__mapDeps([25,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "YAML",
		alias: ["yml"],
		extensions: ["yaml", "yml"],
		load() {
			return __vitePreload(() => import("./dist-CTgoxbQK.js").then((m) => m.yaml()), __vite__mapDeps([26,1,2,4]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "APL",
		extensions: ["dyalog", "apl"],
		load() {
			return __vitePreload(() => import("./apl-Bo-2WCtg.js").then((m) => legacy(m.apl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "PGP",
		alias: ["asciiarmor"],
		extensions: [
			"asc",
			"pgp",
			"sig"
		],
		load() {
			return __vitePreload(() => import("./asciiarmor-BBvFfjP2.js").then((m) => legacy(m.asciiArmor)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "ASN.1",
		extensions: ["asn", "asn1"],
		load() {
			return __vitePreload(() => import("./asn1-Di9KCNUu.js").then((m) => legacy(m.asn1({}))), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Asterisk",
		filename: /^extensions\.conf$/i,
		load() {
			return __vitePreload(() => import("./asterisk-CcYHPcJz.js").then((m) => legacy(m.asterisk)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Brainfuck",
		extensions: ["b", "bf"],
		load() {
			return __vitePreload(() => import("./brainfuck-CBE-uM-u.js").then((m) => legacy(m.brainfuck)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Cobol",
		extensions: ["cob", "cpy"],
		load() {
			return __vitePreload(() => import("./cobol-BTrF47rU.js").then((m) => legacy(m.cobol)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "C#",
		alias: ["csharp", "cs"],
		extensions: ["cs"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.csharp)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Clojure",
		extensions: [
			"clj",
			"cljc",
			"cljx"
		],
		load() {
			return __vitePreload(() => import("./clojure-C-a8OVge.js").then((m) => legacy(m.clojure)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "ClojureScript",
		extensions: ["cljs"],
		load() {
			return __vitePreload(() => import("./clojure-C-a8OVge.js").then((m) => legacy(m.clojure)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Closure Stylesheets (GSS)",
		extensions: ["gss"],
		load() {
			return __vitePreload(() => import("./css-CW4x6R0Z.js").then((m) => legacy(m.gss)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "CMake",
		extensions: ["cmake", "cmake.in"],
		filename: /^CMakeLists\.txt$/,
		load() {
			return __vitePreload(() => import("./cmake-CqDyns2E.js").then((m) => legacy(m.cmake)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "CoffeeScript",
		alias: ["coffee", "coffee-script"],
		extensions: ["coffee"],
		load() {
			return __vitePreload(() => import("./coffeescript-BU1KlkzI.js").then((m) => legacy(m.coffeeScript)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Common Lisp",
		alias: ["lisp"],
		extensions: [
			"cl",
			"lisp",
			"el"
		],
		load() {
			return __vitePreload(() => import("./commonlisp-CebjaG5p.js").then((m) => legacy(m.commonLisp)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Cypher",
		extensions: ["cyp", "cypher"],
		load() {
			return __vitePreload(() => import("./cypher-Dvuen2a1.js").then((m) => legacy(m.cypher)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Cython",
		extensions: [
			"pyx",
			"pxd",
			"pxi"
		],
		load() {
			return __vitePreload(() => import("./python-O_7_yKv0.js").then((m) => legacy(m.cython)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Crystal",
		extensions: ["cr"],
		load() {
			return __vitePreload(() => import("./crystal-ejXtYzrH.js").then((m) => legacy(m.crystal)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "D",
		extensions: ["d"],
		load() {
			return __vitePreload(() => import("./d-CuO8clN5.js").then((m) => legacy(m.d)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Dart",
		extensions: ["dart"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.dart)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "diff",
		extensions: ["diff", "patch"],
		load() {
			return __vitePreload(() => import("./diff-Cn0orwdt.js").then((m) => legacy(m.diff)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Dockerfile",
		filename: /^Dockerfile$/,
		load() {
			return __vitePreload(() => import("./dockerfile-DWvE2pgG.js").then((m) => legacy(m.dockerFile)), __vite__mapDeps([27,28]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "DTD",
		extensions: ["dtd"],
		load() {
			return __vitePreload(() => import("./dtd-4JBldOox.js").then((m) => legacy(m.dtd)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Dylan",
		extensions: [
			"dylan",
			"dyl",
			"intr"
		],
		load() {
			return __vitePreload(() => import("./dylan-BNj1vkMg.js").then((m) => legacy(m.dylan)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "EBNF",
		load() {
			return __vitePreload(() => import("./ebnf-DNHolm2T.js").then((m) => legacy(m.ebnf)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "ECL",
		extensions: ["ecl"],
		load() {
			return __vitePreload(() => import("./ecl-DwfzztRU.js").then((m) => legacy(m.ecl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "edn",
		extensions: ["edn"],
		load() {
			return __vitePreload(() => import("./clojure-C-a8OVge.js").then((m) => legacy(m.clojure)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Eiffel",
		extensions: ["e"],
		load() {
			return __vitePreload(() => import("./eiffel-B6DcheoW.js").then((m) => legacy(m.eiffel)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Elm",
		extensions: ["elm"],
		load() {
			return __vitePreload(() => import("./elm-DZpvdLc7.js").then((m) => legacy(m.elm)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Erlang",
		extensions: ["erl"],
		load() {
			return __vitePreload(() => import("./erlang-Dv3iTcsg.js").then((m) => legacy(m.erlang)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Esper",
		load() {
			return __vitePreload(() => import("./sql-CklRD8WC.js").then((m) => legacy(m.esper)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Factor",
		extensions: ["factor"],
		load() {
			return __vitePreload(() => import("./factor-BoG6t0N_.js").then((m) => legacy(m.factor)), __vite__mapDeps([29,28]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "FCL",
		load() {
			return __vitePreload(() => import("./fcl-D9Bn0s3k.js").then((m) => legacy(m.fcl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Forth",
		extensions: [
			"forth",
			"fth",
			"4th"
		],
		load() {
			return __vitePreload(() => import("./forth-XuZhJkQD.js").then((m) => legacy(m.forth)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Fortran",
		extensions: [
			"f",
			"for",
			"f77",
			"f90",
			"f95"
		],
		load() {
			return __vitePreload(() => import("./fortran-DkwhXArY.js").then((m) => legacy(m.fortran)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "F#",
		alias: ["fsharp"],
		extensions: ["fs"],
		load() {
			return __vitePreload(() => import("./mllike-DSZxENuy.js").then((m) => legacy(m.fSharp)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Gas",
		extensions: ["s"],
		load() {
			return __vitePreload(() => import("./gas-8tci_ovo.js").then((m) => legacy(m.gas)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Gherkin",
		extensions: ["feature"],
		load() {
			return __vitePreload(() => import("./gherkin-0_BjFOU4.js").then((m) => legacy(m.gherkin)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Groovy",
		extensions: ["groovy", "gradle"],
		filename: /^Jenkinsfile$/,
		load() {
			return __vitePreload(() => import("./groovy-BOx_6HLL.js").then((m) => legacy(m.groovy)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Haskell",
		extensions: ["hs"],
		load() {
			return __vitePreload(() => import("./haskell-DB0O3oqo.js").then((m) => legacy(m.haskell)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Haxe",
		extensions: ["hx"],
		load() {
			return __vitePreload(() => import("./haxe-DinAdxqK.js").then((m) => legacy(m.haxe)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "HXML",
		extensions: ["hxml"],
		load() {
			return __vitePreload(() => import("./haxe-DinAdxqK.js").then((m) => legacy(m.hxml)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "HTTP",
		load() {
			return __vitePreload(() => import("./http-BWlcwbsh.js").then((m) => legacy(m.http)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "IDL",
		extensions: ["pro"],
		load() {
			return __vitePreload(() => import("./idl-ByIXLJKL.js").then((m) => legacy(m.idl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "JSON-LD",
		alias: ["jsonld"],
		extensions: ["jsonld"],
		load() {
			return __vitePreload(() => import("./javascript-xgJ0sNzO.js").then((m) => legacy(m.jsonld)), __vite__mapDeps([30,31]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Julia",
		extensions: ["jl"],
		load() {
			return __vitePreload(() => import("./julia-BZTgNvAG.js").then((m) => legacy(m.julia)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Kotlin",
		extensions: ["kt", "kts"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.kotlin)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "LiveScript",
		alias: ["ls"],
		extensions: ["ls"],
		load() {
			return __vitePreload(() => import("./livescript-B4y9L1J-.js").then((m) => legacy(m.liveScript)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Lua",
		extensions: ["lua"],
		load() {
			return __vitePreload(() => import("./lua-mBkf2Wet.js").then((m) => legacy(m.lua)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "mIRC",
		extensions: ["mrc"],
		load() {
			return __vitePreload(() => import("./mirc-CSEJE0Go.js").then((m) => legacy(m.mirc)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Mathematica",
		extensions: [
			"m",
			"nb",
			"wl",
			"wls"
		],
		load() {
			return __vitePreload(() => import("./mathematica-DWl2gaAo.js").then((m) => legacy(m.mathematica)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Modelica",
		extensions: ["mo"],
		load() {
			return __vitePreload(() => import("./modelica-DTSiXkQW.js").then((m) => legacy(m.modelica)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "MUMPS",
		extensions: ["mps"],
		load() {
			return __vitePreload(() => import("./mumps-DR-YdUqv.js").then((m) => legacy(m.mumps)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Mbox",
		extensions: ["mbox"],
		load() {
			return __vitePreload(() => import("./mbox-CAHDiTUw.js").then((m) => legacy(m.mbox)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Nginx",
		filename: /nginx.*\.conf$/i,
		load() {
			return __vitePreload(() => import("./nginx-MYPj2-jQ.js").then((m) => legacy(m.nginx)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "NSIS",
		extensions: ["nsh", "nsi"],
		load() {
			return __vitePreload(() => import("./nsis-BD7h4RsE.js").then((m) => legacy(m.nsis)), __vite__mapDeps([32,28]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "NTriples",
		extensions: ["nt", "nq"],
		load() {
			return __vitePreload(() => import("./ntriples-B0SYiWJi.js").then((m) => legacy(m.ntriples)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Objective-C",
		alias: ["objective-c", "objc"],
		extensions: ["m"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.objectiveC)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Objective-C++",
		alias: ["objective-c++", "objc++"],
		extensions: ["mm"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.objectiveCpp)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "OCaml",
		extensions: [
			"ml",
			"mli",
			"mll",
			"mly"
		],
		load() {
			return __vitePreload(() => import("./mllike-DSZxENuy.js").then((m) => legacy(m.oCaml)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Octave",
		extensions: ["m"],
		load() {
			return __vitePreload(() => import("./octave-D2X06Cxi.js").then((m) => legacy(m.octave)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Oz",
		extensions: ["oz"],
		load() {
			return __vitePreload(() => import("./oz-Co666SGQ.js").then((m) => legacy(m.oz)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Pascal",
		extensions: ["p", "pas"],
		load() {
			return __vitePreload(() => import("./pascal-CbrnUffM.js").then((m) => legacy(m.pascal)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Perl",
		extensions: ["pl", "pm"],
		load() {
			return __vitePreload(() => import("./perl-D03z3BWe.js").then((m) => legacy(m.perl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Pig",
		extensions: ["pig"],
		load() {
			return __vitePreload(() => import("./pig-D281vW4N.js").then((m) => legacy(m.pig)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "PowerShell",
		extensions: [
			"ps1",
			"psd1",
			"psm1"
		],
		load() {
			return __vitePreload(() => import("./powershell-DOiC69rZ.js").then((m) => legacy(m.powerShell)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Properties files",
		alias: ["ini", "properties"],
		extensions: [
			"properties",
			"ini",
			"in"
		],
		load() {
			return __vitePreload(() => import("./properties-BVpK-AVS.js").then((m) => legacy(m.properties)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "ProtoBuf",
		extensions: ["proto"],
		load() {
			return __vitePreload(() => import("./protobuf-peXgRv2y.js").then((m) => legacy(m.protobuf)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Pug",
		alias: ["jade"],
		extensions: ["pug", "jade"],
		load() {
			return __vitePreload(() => import("./pug-n2330flF.js").then((m) => legacy(m.pug)), __vite__mapDeps([33,31]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Puppet",
		extensions: ["pp"],
		load() {
			return __vitePreload(() => import("./puppet-zVW1LWRB.js").then((m) => legacy(m.puppet)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Q",
		extensions: ["q"],
		load() {
			return __vitePreload(() => import("./q-BhXxznI-.js").then((m) => legacy(m.q)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "R",
		alias: ["rscript"],
		extensions: ["r", "R"],
		load() {
			return __vitePreload(() => import("./r-Deu7PQeY.js").then((m) => legacy(m.r)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "RPM Changes",
		load() {
			return __vitePreload(() => import("./rpm-DHg7Budo.js").then((m) => legacy(m.rpmChanges)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "RPM Spec",
		extensions: ["spec"],
		load() {
			return __vitePreload(() => import("./rpm-DHg7Budo.js").then((m) => legacy(m.rpmSpec)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Ruby",
		alias: [
			"jruby",
			"macruby",
			"rake",
			"rb",
			"rbx"
		],
		extensions: ["rb"],
		filename: /^(Gemfile|Rakefile)$/,
		load() {
			return __vitePreload(() => import("./ruby-DTVQcB2n.js").then((m) => legacy(m.ruby)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SAS",
		extensions: ["sas"],
		load() {
			return __vitePreload(() => import("./sas-BA8LnR2m.js").then((m) => legacy(m.sas)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Scala",
		extensions: ["scala"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.scala)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Scheme",
		extensions: ["scm", "ss"],
		load() {
			return __vitePreload(() => import("./scheme-1pvyTTLI.js").then((m) => legacy(m.scheme)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Shell",
		alias: [
			"bash",
			"sh",
			"zsh"
		],
		extensions: [
			"sh",
			"ksh",
			"bash"
		],
		filename: /^PKGBUILD$/,
		load() {
			return __vitePreload(() => import("./shell-DB4BxcWx.js").then((m) => legacy(m.shell)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Sieve",
		extensions: ["siv", "sieve"],
		load() {
			return __vitePreload(() => import("./sieve-PN3q_bqI.js").then((m) => legacy(m.sieve)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Smalltalk",
		extensions: ["st"],
		load() {
			return __vitePreload(() => import("./smalltalk-C3v6Q5UJ.js").then((m) => legacy(m.smalltalk)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Solr",
		load() {
			return __vitePreload(() => import("./solr-BVJoG7gV.js").then((m) => legacy(m.solr)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SML",
		extensions: [
			"sml",
			"sig",
			"fun",
			"smackspec"
		],
		load() {
			return __vitePreload(() => import("./mllike-DSZxENuy.js").then((m) => legacy(m.sml)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SPARQL",
		alias: ["sparul"],
		extensions: ["rq", "sparql"],
		load() {
			return __vitePreload(() => import("./sparql-DN1Hhv0h.js").then((m) => legacy(m.sparql)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Spreadsheet",
		alias: ["excel", "formula"],
		load() {
			return __vitePreload(() => import("./spreadsheet-BR_kB9YY.js").then((m) => legacy(m.spreadsheet)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Squirrel",
		extensions: ["nut"],
		load() {
			return __vitePreload(() => import("./clike-CejxlEnS.js").then((m) => legacy(m.squirrel)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Stylus",
		extensions: ["styl"],
		load() {
			return __vitePreload(() => import("./stylus-DbUMUY-g.js").then((m) => legacy(m.stylus)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Swift",
		extensions: ["swift"],
		load() {
			return __vitePreload(() => import("./swift-1_cKRw7O.js").then((m) => legacy(m.swift)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "sTeX",
		load() {
			return __vitePreload(() => import("./stex-Bd40PRCO.js").then((m) => legacy(m.stex)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "LaTeX",
		alias: ["tex"],
		extensions: [
			"text",
			"ltx",
			"tex"
		],
		load() {
			return __vitePreload(() => import("./stex-Bd40PRCO.js").then((m) => legacy(m.stex)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "SystemVerilog",
		extensions: [
			"v",
			"sv",
			"svh"
		],
		load() {
			return __vitePreload(() => import("./verilog-CZvmbE0B.js").then((m) => legacy(m.verilog)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Tcl",
		extensions: ["tcl"],
		load() {
			return __vitePreload(() => import("./tcl-CdQwz_lg.js").then((m) => legacy(m.tcl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Textile",
		extensions: ["textile"],
		load() {
			return __vitePreload(() => import("./textile-BfG2sdDW.js").then((m) => legacy(m.textile)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "TiddlyWiki",
		load() {
			return __vitePreload(() => import("./tiddlywiki-BlogWitl.js").then((m) => legacy(m.tiddlyWiki)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Tiki wiki",
		load() {
			return __vitePreload(() => import("./tiki-yTsnq4dN.js").then((m) => legacy(m.tiki)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "TOML",
		extensions: ["toml"],
		load() {
			return __vitePreload(() => import("./toml-CQWSPdas.js").then((m) => legacy(m.toml)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Troff",
		extensions: [
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9"
		],
		load() {
			return __vitePreload(() => import("./troff-VlA6sRLm.js").then((m) => legacy(m.troff)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "TTCN",
		extensions: [
			"ttcn",
			"ttcn3",
			"ttcnpp"
		],
		load() {
			return __vitePreload(() => import("./ttcn-D3TZPer2.js").then((m) => legacy(m.ttcn)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "TTCN_CFG",
		extensions: ["cfg"],
		load() {
			return __vitePreload(() => import("./ttcn-cfg-bOG8yyF3.js").then((m) => legacy(m.ttcnCfg)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Turtle",
		extensions: ["ttl"],
		load() {
			return __vitePreload(() => import("./turtle-BoEsb1vr.js").then((m) => legacy(m.turtle)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Web IDL",
		extensions: ["webidl"],
		load() {
			return __vitePreload(() => import("./webidl-ChBDyOPt.js").then((m) => legacy(m.webIDL)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "VB.NET",
		extensions: ["vb"],
		load() {
			return __vitePreload(() => import("./vb-2zqtlkJA.js").then((m) => legacy(m.vb)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "VBScript",
		extensions: ["vbs"],
		load() {
			return __vitePreload(() => import("./vbscript-CbxT7cXn.js").then((m) => legacy(m.vbScript)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Velocity",
		extensions: ["vtl"],
		load() {
			return __vitePreload(() => import("./velocity-KTNXClOs.js").then((m) => legacy(m.velocity)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Verilog",
		extensions: ["v"],
		load() {
			return __vitePreload(() => import("./verilog-CZvmbE0B.js").then((m) => legacy(m.verilog)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "VHDL",
		extensions: ["vhd", "vhdl"],
		load() {
			return __vitePreload(() => import("./vhdl-BxtsauVk.js").then((m) => legacy(m.vhdl)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "XQuery",
		extensions: [
			"xy",
			"xquery",
			"xq",
			"xqm",
			"xqy"
		],
		load() {
			return __vitePreload(() => import("./xquery-Cj1HKBIZ.js").then((m) => legacy(m.xQuery)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Yacas",
		extensions: ["ys"],
		load() {
			return __vitePreload(() => import("./yacas-B8vWnSuN.js").then((m) => legacy(m.yacas)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Z80",
		extensions: ["z80"],
		load() {
			return __vitePreload(() => import("./z80-I5AwJBy0.js").then((m) => legacy(m.z80)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "MscGen",
		extensions: [
			"mscgen",
			"mscin",
			"msc"
		],
		load() {
			return __vitePreload(() => import("./mscgen-DbhrPxRg.js").then((m) => legacy(m.mscgen)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Xù",
		extensions: ["xu"],
		load() {
			return __vitePreload(() => import("./mscgen-DbhrPxRg.js").then((m) => legacy(m.xu)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "MsGenny",
		extensions: ["msgenny"],
		load() {
			return __vitePreload(() => import("./mscgen-DbhrPxRg.js").then((m) => legacy(m.msgenny)), []);
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Vue",
		extensions: ["vue"],
		load() {
			return __vitePreload(() => import("./dist-D7CMNeiO.js").then((m) => m.vue()), __vite__mapDeps([34,1,2,4,10,7,11,3]));
		}
	}),
	/*@__PURE__*/ LanguageDescription.of({
		name: "Angular Template",
		load() {
			return __vitePreload(() => import("./dist-CXDcTrp3.js").then((m) => m.angular()), __vite__mapDeps([35,1,2,4,10,7,11,3]));
		}
	})
];
//#endregion
export { languages as t };
