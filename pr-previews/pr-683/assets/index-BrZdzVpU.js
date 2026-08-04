const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CeR2_Qm6.js","assets/index-Do7mdVNL.js","assets/index-B39lEP9I.js","assets/index-3uDdP_wz.js","assets/index-DIczsbTV.js","assets/index-CWhl485C.js","assets/index-Cy8m0Q4J.js","assets/index-C8DWMDAz.js","assets/index-CV5-LmCO.js","assets/index-DLOKGRHk.js","assets/index-DWjeIdix.js","assets/index-BG4LLLFz.js","assets/index-DOoONlWg.js","assets/index-CR1cAcNW.js","assets/index-CQ4dcWt_.js","assets/index-DKfHNSFi.js","assets/index-BzgUmP-u.js","assets/index-C6bfbulG.js","assets/index-C4TKTa8r.js","assets/dockerfile-BuGto-eh.js","assets/simple-mode-DTO65gHN.js","assets/factor-P_9RAvyH.js","assets/nsis-DIgWeoaq.js","assets/pug-DdQ9vxDY.js","assets/javascript-Bt78-ZxY.js","assets/index-CRhJjevb.js","assets/index-DSbqSrs6.js","assets/index-C8TpSw2F.js","assets/index-CaTM1fqV.js","assets/index-Bz3hTr2T.js","assets/index-Nf2BxdoS.js"])))=>i.map(i=>d[i]);
import { R as __vitePreload } from './main-CQBN_VgS.js';
import { m as markdown, p as parser, G as GFM, S as Subscript, a as Superscript, E as Emoji, T as Table } from './index-BG4LLLFz.js';
import { c as LanguageDescription, L as LanguageSupport, S as StreamLanguage, x as Language, y as defineLanguageFacet, d as foldNodeProp, i as indentNodeProp, A as languageDataProp } from './index-Do7mdVNL.js';
import './index-B39lEP9I.js';
import './index-DIczsbTV.js';

function legacy(parser) {
  return new LanguageSupport(StreamLanguage.define(parser));
}
function sql(dialectName) {
  return __vitePreload(() => import('./index-CeR2_Qm6.js'),true              ?__vite__mapDeps([0,1,2]):void 0).then(m => m.sql({
    dialect: m[dialectName]
  }));
}
/**
An array of language descriptions for known language packages.
*/
const languages = [
// New-style language modes
/*@__PURE__*/
LanguageDescription.of({
  name: "C",
  extensions: ["c", "h", "ino"],
  load() {
    return __vitePreload(() => import('./index-3uDdP_wz.js'),true              ?__vite__mapDeps([3,1]):void 0).then(m => m.cpp());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "C++",
  alias: ["cpp"],
  extensions: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"],
  load() {
    return __vitePreload(() => import('./index-3uDdP_wz.js'),true              ?__vite__mapDeps([3,1]):void 0).then(m => m.cpp());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "CQL",
  alias: ["cassandra"],
  extensions: ["cql"],
  load() {
    return sql("Cassandra");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "CSS",
  extensions: ["css"],
  load() {
    return __vitePreload(() => import('./index-DIczsbTV.js').then(n => n.i),true              ?__vite__mapDeps([4,1,2]):void 0).then(m => m.css());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Go",
  extensions: ["go"],
  load() {
    return __vitePreload(() => import('./index-CWhl485C.js'),true              ?__vite__mapDeps([5,1,2]):void 0).then(m => m.go());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "HTML",
  alias: ["xhtml"],
  extensions: ["html", "htm", "handlebars", "hbs"],
  load() {
    return __vitePreload(() => import('./index-DIczsbTV.js').then(n => n.e),true              ?__vite__mapDeps([4,1,2]):void 0).then(m => m.html());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Java",
  extensions: ["java"],
  load() {
    return __vitePreload(() => import('./index-Cy8m0Q4J.js'),true              ?__vite__mapDeps([6,1]):void 0).then(m => m.java());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "JavaScript",
  alias: ["ecmascript", "js", "node"],
  extensions: ["js", "mjs", "cjs"],
  load() {
    return __vitePreload(() => import('./index-B39lEP9I.js').then(n => n.k),true              ?__vite__mapDeps([2,1]):void 0).then(m => m.javascript());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Jinja",
  extensions: ["j2", "jinja", "jinja2"],
  load() {
    return __vitePreload(() => import('./index-C8DWMDAz.js'),true              ?__vite__mapDeps([7,1,4,2]):void 0).then(m => m.jinja());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "JSON",
  alias: ["json5"],
  extensions: ["json", "map"],
  load() {
    return __vitePreload(() => import('./index-CV5-LmCO.js'),true              ?__vite__mapDeps([8,1]):void 0).then(m => m.json());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "JSX",
  extensions: ["jsx"],
  load() {
    return __vitePreload(() => import('./index-B39lEP9I.js').then(n => n.k),true              ?__vite__mapDeps([2,1]):void 0).then(m => m.javascript({
      jsx: true
    }));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "LESS",
  extensions: ["less"],
  load() {
    return __vitePreload(() => import('./index-DLOKGRHk.js'),true              ?__vite__mapDeps([9,1,4,2]):void 0).then(m => m.less());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Liquid",
  extensions: ["liquid"],
  load() {
    return __vitePreload(() => import('./index-DWjeIdix.js'),true              ?__vite__mapDeps([10,1,4,2]):void 0).then(m => m.liquid());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "MariaDB SQL",
  load() {
    return sql("MariaSQL");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Markdown",
  extensions: ["md", "markdown", "mkd"],
  load() {
    return __vitePreload(() => import('./index-BG4LLLFz.js').then(n => n.i),true              ?__vite__mapDeps([11,1,2,4]):void 0).then(m => m.markdown());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "MS SQL",
  load() {
    return sql("MSSQL");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "MySQL",
  load() {
    return sql("MySQL");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "PHP",
  extensions: ["php", "php3", "php4", "php5", "php7", "phtml"],
  load() {
    return __vitePreload(() => import('./index-DOoONlWg.js'),true              ?__vite__mapDeps([12,1,4,2]):void 0).then(m => m.php());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "PLSQL",
  extensions: ["pls"],
  load() {
    return sql("PLSQL");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "PostgreSQL",
  load() {
    return sql("PostgreSQL");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Python",
  extensions: ["BUILD", "bzl", "py", "pyw"],
  filename: /^(BUCK|BUILD)$/,
  load() {
    return __vitePreload(() => import('./index-CR1cAcNW.js'),true              ?__vite__mapDeps([13,1,2]):void 0).then(m => m.python());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Rust",
  extensions: ["rs"],
  load() {
    return __vitePreload(() => import('./index-CQ4dcWt_.js'),true              ?__vite__mapDeps([14,1]):void 0).then(m => m.rust());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Sass",
  extensions: ["sass"],
  load() {
    return __vitePreload(() => import('./index-DKfHNSFi.js'),true              ?__vite__mapDeps([15,1,4,2]):void 0).then(m => m.sass({
      indented: true
    }));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SCSS",
  extensions: ["scss"],
  load() {
    return __vitePreload(() => import('./index-DKfHNSFi.js'),true              ?__vite__mapDeps([15,1,4,2]):void 0).then(m => m.sass());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SQL",
  extensions: ["sql"],
  load() {
    return sql("StandardSQL");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SQLite",
  load() {
    return sql("SQLite");
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "TSX",
  extensions: ["tsx"],
  load() {
    return __vitePreload(() => import('./index-B39lEP9I.js').then(n => n.k),true              ?__vite__mapDeps([2,1]):void 0).then(m => m.javascript({
      jsx: true,
      typescript: true
    }));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "TypeScript",
  alias: ["ts"],
  extensions: ["ts", "mts", "cts"],
  load() {
    return __vitePreload(() => import('./index-B39lEP9I.js').then(n => n.k),true              ?__vite__mapDeps([2,1]):void 0).then(m => m.javascript({
      typescript: true
    }));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "WebAssembly",
  extensions: ["wat", "wast"],
  load() {
    return __vitePreload(() => import('./index-BzgUmP-u.js'),true              ?__vite__mapDeps([16,1]):void 0).then(m => m.wast());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "XML",
  alias: ["rss", "wsdl", "xsd"],
  extensions: ["xml", "xsl", "xsd", "svg"],
  load() {
    return __vitePreload(() => import('./index-C6bfbulG.js'),true              ?__vite__mapDeps([17,1]):void 0).then(m => m.xml());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "YAML",
  alias: ["yml"],
  extensions: ["yaml", "yml"],
  load() {
    return __vitePreload(() => import('./index-C4TKTa8r.js'),true              ?__vite__mapDeps([18,1]):void 0).then(m => m.yaml());
  }
}),
// Legacy modes ported from CodeMirror 5
/*@__PURE__*/
LanguageDescription.of({
  name: "APL",
  extensions: ["dyalog", "apl"],
  load() {
    return __vitePreload(() => import('./apl-Dpw_8l-H.js'),true              ?[]:void 0).then(m => legacy(m.apl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "PGP",
  alias: ["asciiarmor"],
  extensions: ["asc", "pgp", "sig"],
  load() {
    return __vitePreload(() => import('./asciiarmor-AWpMcEIG.js'),true              ?[]:void 0).then(m => legacy(m.asciiArmor));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "ASN.1",
  extensions: ["asn", "asn1"],
  load() {
    return __vitePreload(() => import('./asn1-Dh5lIvfd.js'),true              ?[]:void 0).then(m => legacy(m.asn1({})));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Asterisk",
  filename: /^extensions\.conf$/i,
  load() {
    return __vitePreload(() => import('./asterisk-DUzIpDi5.js'),true              ?[]:void 0).then(m => legacy(m.asterisk));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Brainfuck",
  extensions: ["b", "bf"],
  load() {
    return __vitePreload(() => import('./brainfuck-DwVPOsVc.js'),true              ?[]:void 0).then(m => legacy(m.brainfuck));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Cobol",
  extensions: ["cob", "cpy"],
  load() {
    return __vitePreload(() => import('./cobol-CQBDWtDs.js'),true              ?[]:void 0).then(m => legacy(m.cobol));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "C#",
  alias: ["csharp", "cs"],
  extensions: ["cs"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.csharp));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Clojure",
  extensions: ["clj", "cljc", "cljx"],
  load() {
    return __vitePreload(() => import('./clojure-Dlfi52fX.js'),true              ?[]:void 0).then(m => legacy(m.clojure));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "ClojureScript",
  extensions: ["cljs"],
  load() {
    return __vitePreload(() => import('./clojure-Dlfi52fX.js'),true              ?[]:void 0).then(m => legacy(m.clojure));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Closure Stylesheets (GSS)",
  extensions: ["gss"],
  load() {
    return __vitePreload(() => import('./css-BGXbJACZ.js'),true              ?[]:void 0).then(m => legacy(m.gss));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "CMake",
  extensions: ["cmake", "cmake.in"],
  filename: /^CMakeLists\.txt$/,
  load() {
    return __vitePreload(() => import('./cmake-BGLlijli.js'),true              ?[]:void 0).then(m => legacy(m.cmake));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "CoffeeScript",
  alias: ["coffee", "coffee-script"],
  extensions: ["coffee"],
  load() {
    return __vitePreload(() => import('./coffeescript-C-z0_ycY.js'),true              ?[]:void 0).then(m => legacy(m.coffeeScript));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Common Lisp",
  alias: ["lisp"],
  extensions: ["cl", "lisp", "el"],
  load() {
    return __vitePreload(() => import('./commonlisp-Bl1Wxs9W.js'),true              ?[]:void 0).then(m => legacy(m.commonLisp));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Cypher",
  extensions: ["cyp", "cypher"],
  load() {
    return __vitePreload(() => import('./cypher-CKJnyB5j.js'),true              ?[]:void 0).then(m => legacy(m.cypher));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Cython",
  extensions: ["pyx", "pxd", "pxi"],
  load() {
    return __vitePreload(() => import('./python-CVDGJTva.js'),true              ?[]:void 0).then(m => legacy(m.cython));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Crystal",
  extensions: ["cr"],
  load() {
    return __vitePreload(() => import('./crystal-DfBa8FSf.js'),true              ?[]:void 0).then(m => legacy(m.crystal));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "D",
  extensions: ["d"],
  load() {
    return __vitePreload(() => import('./d-DVrtvB94.js'),true              ?[]:void 0).then(m => legacy(m.d));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Dart",
  extensions: ["dart"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.dart));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "diff",
  extensions: ["diff", "patch"],
  load() {
    return __vitePreload(() => import('./diff-CGQDdw6l.js'),true              ?[]:void 0).then(m => legacy(m.diff));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Dockerfile",
  filename: /^Dockerfile$/,
  load() {
    return __vitePreload(() => import('./dockerfile-BuGto-eh.js'),true              ?__vite__mapDeps([19,20]):void 0).then(m => legacy(m.dockerFile));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "DTD",
  extensions: ["dtd"],
  load() {
    return __vitePreload(() => import('./dtd-Cz89zOe6.js'),true              ?[]:void 0).then(m => legacy(m.dtd));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Dylan",
  extensions: ["dylan", "dyl", "intr"],
  load() {
    return __vitePreload(() => import('./dylan-CR2UwieX.js'),true              ?[]:void 0).then(m => legacy(m.dylan));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "EBNF",
  load() {
    return __vitePreload(() => import('./ebnf-CuDrRWt0.js'),true              ?[]:void 0).then(m => legacy(m.ebnf));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "ECL",
  extensions: ["ecl"],
  load() {
    return __vitePreload(() => import('./ecl-BCcpPBhH.js'),true              ?[]:void 0).then(m => legacy(m.ecl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "edn",
  extensions: ["edn"],
  load() {
    return __vitePreload(() => import('./clojure-Dlfi52fX.js'),true              ?[]:void 0).then(m => legacy(m.clojure));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Eiffel",
  extensions: ["e"],
  load() {
    return __vitePreload(() => import('./eiffel-F5P9oBGj.js'),true              ?[]:void 0).then(m => legacy(m.eiffel));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Elm",
  extensions: ["elm"],
  load() {
    return __vitePreload(() => import('./elm-BaYZGokk.js'),true              ?[]:void 0).then(m => legacy(m.elm));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Erlang",
  extensions: ["erl"],
  load() {
    return __vitePreload(() => import('./erlang-ZsZGaI8A.js'),true              ?[]:void 0).then(m => legacy(m.erlang));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Esper",
  load() {
    return __vitePreload(() => import('./sql-7hGWY9Mv.js'),true              ?[]:void 0).then(m => legacy(m.esper));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Factor",
  extensions: ["factor"],
  load() {
    return __vitePreload(() => import('./factor-P_9RAvyH.js'),true              ?__vite__mapDeps([21,20]):void 0).then(m => legacy(m.factor));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "FCL",
  load() {
    return __vitePreload(() => import('./fcl-Bk2TFLQC.js'),true              ?[]:void 0).then(m => legacy(m.fcl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Forth",
  extensions: ["forth", "fth", "4th"],
  load() {
    return __vitePreload(() => import('./forth-Dk9i3mdF.js'),true              ?[]:void 0).then(m => legacy(m.forth));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Fortran",
  extensions: ["f", "for", "f77", "f90", "f95"],
  load() {
    return __vitePreload(() => import('./fortran-5mEdcKiO.js'),true              ?[]:void 0).then(m => legacy(m.fortran));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "F#",
  alias: ["fsharp"],
  extensions: ["fs"],
  load() {
    return __vitePreload(() => import('./mllike-BuB9wF-6.js'),true              ?[]:void 0).then(m => legacy(m.fSharp));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Gas",
  extensions: ["s"],
  load() {
    return __vitePreload(() => import('./gas-BQypwZY0.js'),true              ?[]:void 0).then(m => legacy(m.gas));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Gherkin",
  extensions: ["feature"],
  load() {
    return __vitePreload(() => import('./gherkin-CD_Xq0yf.js'),true              ?[]:void 0).then(m => legacy(m.gherkin));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Groovy",
  extensions: ["groovy", "gradle"],
  filename: /^Jenkinsfile$/,
  load() {
    return __vitePreload(() => import('./groovy-C6F4QzgL.js'),true              ?[]:void 0).then(m => legacy(m.groovy));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Haskell",
  extensions: ["hs"],
  load() {
    return __vitePreload(() => import('./haskell-DVdhQFSo.js'),true              ?[]:void 0).then(m => legacy(m.haskell));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Haxe",
  extensions: ["hx"],
  load() {
    return __vitePreload(() => import('./haxe-DUE81aTs.js'),true              ?[]:void 0).then(m => legacy(m.haxe));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "HXML",
  extensions: ["hxml"],
  load() {
    return __vitePreload(() => import('./haxe-DUE81aTs.js'),true              ?[]:void 0).then(m => legacy(m.hxml));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "HTTP",
  load() {
    return __vitePreload(() => import('./http-Cw-KUKXo.js'),true              ?[]:void 0).then(m => legacy(m.http));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "IDL",
  extensions: ["pro"],
  load() {
    return __vitePreload(() => import('./idl-ClpzS6De.js'),true              ?[]:void 0).then(m => legacy(m.idl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "JSON-LD",
  alias: ["jsonld"],
  extensions: ["jsonld"],
  load() {
    return __vitePreload(() => import('./javascript-Bt78-ZxY.js'),true              ?[]:void 0).then(m => legacy(m.jsonld));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Julia",
  extensions: ["jl"],
  load() {
    return __vitePreload(() => import('./julia-DJ5CBwRm.js'),true              ?[]:void 0).then(m => legacy(m.julia));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Kotlin",
  extensions: ["kt", "kts"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.kotlin));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "LiveScript",
  alias: ["ls"],
  extensions: ["ls"],
  load() {
    return __vitePreload(() => import('./livescript-C5KU9IXw.js'),true              ?[]:void 0).then(m => legacy(m.liveScript));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Lua",
  extensions: ["lua"],
  load() {
    return __vitePreload(() => import('./lua-G_rCUvZe.js'),true              ?[]:void 0).then(m => legacy(m.lua));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "mIRC",
  extensions: ["mrc"],
  load() {
    return __vitePreload(() => import('./mirc-DrtgbvXY.js'),true              ?[]:void 0).then(m => legacy(m.mirc));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Mathematica",
  extensions: ["m", "nb", "wl", "wls"],
  load() {
    return __vitePreload(() => import('./mathematica-D5eiSJXl.js'),true              ?[]:void 0).then(m => legacy(m.mathematica));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Modelica",
  extensions: ["mo"],
  load() {
    return __vitePreload(() => import('./modelica-C5PEipnE.js'),true              ?[]:void 0).then(m => legacy(m.modelica));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "MUMPS",
  extensions: ["mps"],
  load() {
    return __vitePreload(() => import('./mumps-BwKwQm3B.js'),true              ?[]:void 0).then(m => legacy(m.mumps));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Mbox",
  extensions: ["mbox"],
  load() {
    return __vitePreload(() => import('./mbox-DY7VK4ic.js'),true              ?[]:void 0).then(m => legacy(m.mbox));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Nginx",
  filename: /nginx.*\.conf$/i,
  load() {
    return __vitePreload(() => import('./nginx-BSvWgTfh.js'),true              ?[]:void 0).then(m => legacy(m.nginx));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "NSIS",
  extensions: ["nsh", "nsi"],
  load() {
    return __vitePreload(() => import('./nsis-DIgWeoaq.js'),true              ?__vite__mapDeps([22,20]):void 0).then(m => legacy(m.nsis));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "NTriples",
  extensions: ["nt", "nq"],
  load() {
    return __vitePreload(() => import('./ntriples-swro19kB.js'),true              ?[]:void 0).then(m => legacy(m.ntriples));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Objective-C",
  alias: ["objective-c", "objc"],
  extensions: ["m"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.objectiveC));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Objective-C++",
  alias: ["objective-c++", "objc++"],
  extensions: ["mm"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.objectiveCpp));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "OCaml",
  extensions: ["ml", "mli", "mll", "mly"],
  load() {
    return __vitePreload(() => import('./mllike-BuB9wF-6.js'),true              ?[]:void 0).then(m => legacy(m.oCaml));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Octave",
  extensions: ["m"],
  load() {
    return __vitePreload(() => import('./octave-B8W4pYDm.js'),true              ?[]:void 0).then(m => legacy(m.octave));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Oz",
  extensions: ["oz"],
  load() {
    return __vitePreload(() => import('./oz-B-AJXXRj.js'),true              ?[]:void 0).then(m => legacy(m.oz));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Pascal",
  extensions: ["p", "pas"],
  load() {
    return __vitePreload(() => import('./pascal-boH_4TNh.js'),true              ?[]:void 0).then(m => legacy(m.pascal));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Perl",
  extensions: ["pl", "pm"],
  load() {
    return __vitePreload(() => import('./perl-HI_EQPIP.js'),true              ?[]:void 0).then(m => legacy(m.perl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Pig",
  extensions: ["pig"],
  load() {
    return __vitePreload(() => import('./pig-oBB16UUj.js'),true              ?[]:void 0).then(m => legacy(m.pig));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "PowerShell",
  extensions: ["ps1", "psd1", "psm1"],
  load() {
    return __vitePreload(() => import('./powershell-D3qUf96n.js'),true              ?[]:void 0).then(m => legacy(m.powerShell));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Properties files",
  alias: ["ini", "properties"],
  extensions: ["properties", "ini", "in"],
  load() {
    return __vitePreload(() => import('./properties-CAzQSQbh.js'),true              ?[]:void 0).then(m => legacy(m.properties));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "ProtoBuf",
  extensions: ["proto"],
  load() {
    return __vitePreload(() => import('./protobuf-DFGgk6cH.js'),true              ?[]:void 0).then(m => legacy(m.protobuf));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Pug",
  alias: ["jade"],
  extensions: ["pug", "jade"],
  load() {
    return __vitePreload(() => import('./pug-DdQ9vxDY.js'),true              ?__vite__mapDeps([23,24]):void 0).then(m => legacy(m.pug));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Puppet",
  extensions: ["pp"],
  load() {
    return __vitePreload(() => import('./puppet-DuoEYUKL.js'),true              ?[]:void 0).then(m => legacy(m.puppet));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Q",
  extensions: ["q"],
  load() {
    return __vitePreload(() => import('./q-B3wwuDom.js'),true              ?[]:void 0).then(m => legacy(m.q));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "R",
  alias: ["rscript"],
  extensions: ["r", "R"],
  load() {
    return __vitePreload(() => import('./r-njx9sNlc.js'),true              ?[]:void 0).then(m => legacy(m.r));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "RPM Changes",
  load() {
    return __vitePreload(() => import('./rpm-BJYl0B-R.js'),true              ?[]:void 0).then(m => legacy(m.rpmChanges));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "RPM Spec",
  extensions: ["spec"],
  load() {
    return __vitePreload(() => import('./rpm-BJYl0B-R.js'),true              ?[]:void 0).then(m => legacy(m.rpmSpec));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Ruby",
  alias: ["jruby", "macruby", "rake", "rb", "rbx"],
  extensions: ["rb"],
  filename: /^(Gemfile|Rakefile)$/,
  load() {
    return __vitePreload(() => import('./ruby-C5pYAVq_.js'),true              ?[]:void 0).then(m => legacy(m.ruby));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SAS",
  extensions: ["sas"],
  load() {
    return __vitePreload(() => import('./sas-PZPfSTs1.js'),true              ?[]:void 0).then(m => legacy(m.sas));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Scala",
  extensions: ["scala"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.scala));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Scheme",
  extensions: ["scm", "ss"],
  load() {
    return __vitePreload(() => import('./scheme-B_4Obzqp.js'),true              ?[]:void 0).then(m => legacy(m.scheme));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Shell",
  alias: ["bash", "sh", "zsh"],
  extensions: ["sh", "ksh", "bash"],
  filename: /^PKGBUILD$/,
  load() {
    return __vitePreload(() => import('./shell-TO-o3E9j.js'),true              ?[]:void 0).then(m => legacy(m.shell));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Sieve",
  extensions: ["siv", "sieve"],
  load() {
    return __vitePreload(() => import('./sieve-DlhxnCEQ.js'),true              ?[]:void 0).then(m => legacy(m.sieve));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Smalltalk",
  extensions: ["st"],
  load() {
    return __vitePreload(() => import('./smalltalk-C1foTo1y.js'),true              ?[]:void 0).then(m => legacy(m.smalltalk));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Solr",
  load() {
    return __vitePreload(() => import('./solr-CNZbUBOx.js'),true              ?[]:void 0).then(m => legacy(m.solr));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SML",
  extensions: ["sml", "sig", "fun", "smackspec"],
  load() {
    return __vitePreload(() => import('./mllike-BuB9wF-6.js'),true              ?[]:void 0).then(m => legacy(m.sml));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SPARQL",
  alias: ["sparul"],
  extensions: ["rq", "sparql"],
  load() {
    return __vitePreload(() => import('./sparql-Bv25olVw.js'),true              ?[]:void 0).then(m => legacy(m.sparql));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Spreadsheet",
  alias: ["excel", "formula"],
  load() {
    return __vitePreload(() => import('./spreadsheet-C7d13CjW.js'),true              ?[]:void 0).then(m => legacy(m.spreadsheet));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Squirrel",
  extensions: ["nut"],
  load() {
    return __vitePreload(() => import('./clike-B0ZsVZxZ.js'),true              ?[]:void 0).then(m => legacy(m.squirrel));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Stylus",
  extensions: ["styl"],
  load() {
    return __vitePreload(() => import('./stylus-BYrzJgv8.js'),true              ?[]:void 0).then(m => legacy(m.stylus));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Swift",
  extensions: ["swift"],
  load() {
    return __vitePreload(() => import('./swift-DTvgOqef.js'),true              ?[]:void 0).then(m => legacy(m.swift));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "sTeX",
  load() {
    return __vitePreload(() => import('./stex-D6XK1A_c.js'),true              ?[]:void 0).then(m => legacy(m.stex));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "LaTeX",
  alias: ["tex"],
  extensions: ["text", "ltx", "tex"],
  load() {
    return __vitePreload(() => import('./stex-D6XK1A_c.js'),true              ?[]:void 0).then(m => legacy(m.stex));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "SystemVerilog",
  extensions: ["v", "sv", "svh"],
  load() {
    return __vitePreload(() => import('./verilog-Cf2tbesB.js'),true              ?[]:void 0).then(m => legacy(m.verilog));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Tcl",
  extensions: ["tcl"],
  load() {
    return __vitePreload(() => import('./tcl-C61hxNdO.js'),true              ?[]:void 0).then(m => legacy(m.tcl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Textile",
  extensions: ["textile"],
  load() {
    return __vitePreload(() => import('./textile-RLC8HiOa.js'),true              ?[]:void 0).then(m => legacy(m.textile));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "TiddlyWiki",
  load() {
    return __vitePreload(() => import('./tiddlywiki-BCgm7Hm1.js'),true              ?[]:void 0).then(m => legacy(m.tiddlyWiki));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Tiki wiki",
  load() {
    return __vitePreload(() => import('./tiki-BrUzCcZv.js'),true              ?[]:void 0).then(m => legacy(m.tiki));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "TOML",
  extensions: ["toml"],
  load() {
    return __vitePreload(() => import('./toml-DYz0aZ8w.js'),true              ?[]:void 0).then(m => legacy(m.toml));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Troff",
  extensions: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  load() {
    return __vitePreload(() => import('./troff-PwWt4wCK.js'),true              ?[]:void 0).then(m => legacy(m.troff));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "TTCN",
  extensions: ["ttcn", "ttcn3", "ttcnpp"],
  load() {
    return __vitePreload(() => import('./ttcn-tkQfSJq5.js'),true              ?[]:void 0).then(m => legacy(m.ttcn));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "TTCN_CFG",
  extensions: ["cfg"],
  load() {
    return __vitePreload(() => import('./ttcn-cfg-s5VEM0rs.js'),true              ?[]:void 0).then(m => legacy(m.ttcnCfg));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Turtle",
  extensions: ["ttl"],
  load() {
    return __vitePreload(() => import('./turtle-DE0wfT4Q.js'),true              ?[]:void 0).then(m => legacy(m.turtle));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Web IDL",
  extensions: ["webidl"],
  load() {
    return __vitePreload(() => import('./webidl-DGDIQ-uh.js'),true              ?[]:void 0).then(m => legacy(m.webIDL));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "VB.NET",
  extensions: ["vb"],
  load() {
    return __vitePreload(() => import('./vb-CkHQEqrt.js'),true              ?[]:void 0).then(m => legacy(m.vb));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "VBScript",
  extensions: ["vbs"],
  load() {
    return __vitePreload(() => import('./vbscript-CsCA523b.js'),true              ?[]:void 0).then(m => legacy(m.vbScript));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Velocity",
  extensions: ["vtl"],
  load() {
    return __vitePreload(() => import('./velocity-8ZAj3sfS.js'),true              ?[]:void 0).then(m => legacy(m.velocity));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Verilog",
  extensions: ["v"],
  load() {
    return __vitePreload(() => import('./verilog-Cf2tbesB.js'),true              ?[]:void 0).then(m => legacy(m.verilog));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "VHDL",
  extensions: ["vhd", "vhdl"],
  load() {
    return __vitePreload(() => import('./vhdl-PsOQdacW.js'),true              ?[]:void 0).then(m => legacy(m.vhdl));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "XQuery",
  extensions: ["xy", "xquery", "xq", "xqm", "xqy"],
  load() {
    return __vitePreload(() => import('./xquery-CQlw-Flx.js'),true              ?[]:void 0).then(m => legacy(m.xQuery));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Yacas",
  extensions: ["ys"],
  load() {
    return __vitePreload(() => import('./yacas-CwPtxM7e.js'),true              ?[]:void 0).then(m => legacy(m.yacas));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Z80",
  extensions: ["z80"],
  load() {
    return __vitePreload(() => import('./z80-DdQYlwrJ.js'),true              ?[]:void 0).then(m => legacy(m.z80));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "MscGen",
  extensions: ["mscgen", "mscin", "msc"],
  load() {
    return __vitePreload(() => import('./mscgen-I7L3_bW3.js'),true              ?[]:void 0).then(m => legacy(m.mscgen));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Xù",
  extensions: ["xu"],
  load() {
    return __vitePreload(() => import('./mscgen-I7L3_bW3.js'),true              ?[]:void 0).then(m => legacy(m.xu));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "MsGenny",
  extensions: ["msgenny"],
  load() {
    return __vitePreload(() => import('./mscgen-I7L3_bW3.js'),true              ?[]:void 0).then(m => legacy(m.msgenny));
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Vue",
  extensions: ["vue"],
  load() {
    return __vitePreload(() => import('./index-CRhJjevb.js'),true              ?__vite__mapDeps([25,1,4,2]):void 0).then(m => m.vue());
  }
}), /*@__PURE__*/LanguageDescription.of({
  name: "Angular Template",
  load() {
    return __vitePreload(() => import('./index-DSbqSrs6.js'),true              ?__vite__mapDeps([26,1,4,2]):void 0).then(m => m.angular());
  }
})];

// javascriptLanguage.data.of({
//   autocomplete: completeFromList([
//     ...completionsOfObject(window),
//     ...completionsOfObject(document),
//   ]),
// }),
const data = defineLanguageFacet({
  block: [
  // { open: '<!--', close: '-->' },
  {
    open: '{{!',
    close: '}}'
  }, {
    open: '{{!--',
    close: '--}}'
  }]
});
const commonmark = parser.configure({
  props: [foldNodeProp.add(type => {
    if (!type.is('Block') || type.is('Document')) return undefined;
    return (tree, state) => ({
      from: state.doc.lineAt(tree.from).to,
      to: tree.to
    });
  }), indentNodeProp.add({
    Document: () => null
  }), languageDataProp.add({
    Document: data
  })]
});
function markdownLang(parser) {
  return new Language(data, parser);
}
// class HbsParser implements LeafBlockParser {
//   nextLine(_cx: BlockContext, _line: Line, _leaf: LeafBlock): boolean {
//     throw new Error('Method not implemented.');
//   }
//   finish(_cx: BlockContext, _leaf: LeafBlock): boolean {
//     throw new Error('Method not implemented.');
//   }
// }
// const Glimdown: MarkdownConfig = {
//   defineNodes: [{ name: 'S-Expression' }, { name: 'Block-S-Expression', block: true }],
//   parseBlock: [
//     {
//       name: 'S-Expression',
//       leaf(_, leaf): HbsParser | null {
//         return leaf.content.startsWith('{{') ? new HbsParser() : null;
//       },
//       endLeaf(_cx, _line, leaf) {
//         if (leaf.parsers.some((p) => p instanceof HbsParser)) {
//           return false;
//         }
//         return true;
//       },
//     },
//     {
//       name: 'Block-S-Expression',
//     },
//   ],
// };
const extendedMarkdown = commonmark.configure([GFM, Subscript, Superscript, Emoji, Table
// Glimdown,
]);
const codeLanguages = [...languages, LanguageDescription.of({
  name: 'glimmer',
  alias: ['hbs', 'glimmer', 'ember', 'handlebars'],
  extensions: ['hbs'],
  async load() {
    // @ts-ignore
    const {
      glimmer
    } = await __vitePreload(async () => { const {
      glimmer
    } = await import('./index-C8TpSw2F.js');return {
      glimmer
    }},true              ?__vite__mapDeps([27,1,4,2]):void 0);
    return glimmer();
  }
}), LanguageDescription.of({
  name: 'glimmer-js',
  alias: ['gjs', 'glimmer-js', 'javascript.glimmer'],
  extensions: ['gjs'],
  async load() {
    // @ts-ignore
    const {
      gjs
    } = await __vitePreload(async () => { const {
      gjs
    } = await import('./index-CaTM1fqV.js');return {
      gjs
    }},true              ?__vite__mapDeps([28,2,1,27,4]):void 0);
    return gjs();
  }
}), LanguageDescription.of({
  name: 'glimmer-ts',
  alias: ['gts', 'glimmer-ts', 'typescript.glimmer'],
  extensions: ['gts'],
  async load() {
    // @ts-ignore
    const {
      gts
    } = await __vitePreload(async () => { const {
      gts
    } = await import('./index-CaTM1fqV.js');return {
      gts
    }},true              ?__vite__mapDeps([28,2,1,27,4]):void 0);
    return gts();
  }
}), LanguageDescription.of({
  name: 'vue',
  extensions: ['vue'],
  async load() {
    // @ts-ignore
    const {
      vue
    } = await __vitePreload(async () => { const {
      vue
    } = await import('./index-CRhJjevb.js');return {
      vue
    }},true              ?__vite__mapDeps([25,1,4,2]):void 0);
    return vue();
  }
}), LanguageDescription.of({
  name: 'svelte',
  extensions: ['svelte'],
  async load() {
    // @ts-ignore
    const {
      svelte
    } = await __vitePreload(async () => { const {
      svelte
    } = await import('./index-Bz3hTr2T.js');return {
      svelte
    }},true              ?__vite__mapDeps([29,1,4,2]):void 0);
    return svelte();
  }
}), LanguageDescription.of({
  name: 'javascript',
  extensions: ['javascript'],
  async load() {
    // @ts-ignore
    const {
      javascript
    } = await __vitePreload(async () => { const {
      javascript
    } = await import('./index-B39lEP9I.js').then(n => n.k);return {
      javascript
    }},true              ?__vite__mapDeps([2,1]):void 0);
    return javascript();
  }
}), LanguageDescription.of({
  name: 'javascript-jsx',
  extensions: ['jsx', 'react'],
  async load() {
    // @ts-ignore
    const {
      javascript
    } = await __vitePreload(async () => { const {
      javascript
    } = await import('./index-B39lEP9I.js').then(n => n.k);return {
      javascript
    }},true              ?__vite__mapDeps([2,1]):void 0);
    return javascript({
      jsx: true
    });
  }
}), LanguageDescription.of({
  name: 'mermaid',
  extensions: ['mermaid'],
  async load() {
    // @ts-ignore
    const {
      mermaid
    } = await __vitePreload(async () => { const {
      mermaid
    } = await import('./index-Nf2BxdoS.js');return {
      mermaid
    }},true              ?__vite__mapDeps([30,1]):void 0);
    return mermaid();
  }
}), LanguageDescription.of({
  name: 'yaml',
  extensions: ['yaml', 'yml'],
  async load() {
    // @ts-ignore
    const {
      yaml
    } = await __vitePreload(async () => { const {
      yaml
    } = await import('./index-C4TKTa8r.js');return {
      yaml
    }},true              ?__vite__mapDeps([18,1]):void 0);
    return yaml();
  }
})];
function glimdown() {
  return markdown({
    base: markdownLang(extendedMarkdown),
    codeLanguages
  });
}

export { codeLanguages, glimdown };
