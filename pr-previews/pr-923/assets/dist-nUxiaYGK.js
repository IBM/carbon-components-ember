import { It as parseMixed, N as styleTags, P as tags, o as LanguageSupport, r as LRLanguage } from "./dist-CI_ns6W5.js";
import { n as ExternalTokenizer, r as LRParser } from "./dist-Y6qztM3-.js";
import { c as typescriptLanguage, r as javascriptLanguage } from "./dist-64d5f6xD.js";
import { n as glimmer, r as glimmerLanguage } from "./dist-hV_7N_fa.js";
//#region ../node_modules/.pnpm/codemirror-lang-glimmer-js@2.0.4_@codemirror+view@6.43.9_@lezer+common@1.5.2/node_modules/codemirror-lang-glimmer-js/dist/index.js
var templateTagContent$1 = 8;
function matchForComment(commentEndPattern, commentToken, input) {
	for (let found = 0, i = 0;; i++) {
		if (input.next < 0) {
			if (i) input.acceptToken(commentToken);
			break;
		}
		if (!(commentEndPattern[found] === input.next)) {
			found = 0;
			input.advance();
			break;
		}
		if (found === commentEndPattern.length - 1) {
			if (i > commentEndPattern.length - 1) {
				input.acceptToken(commentToken, 1 - commentEndPattern.length);
				break;
			} else console.warn("Reached end of comment but there is still content left");
			break;
		}
		found++;
		input.advance();
	}
}
var closingTemplateTag = "</template>".split("").map((char) => char.charCodeAt(0));
var templateTagContent = new ExternalTokenizer((input) => {
	return matchForComment(closingTemplateTag, templateTagContent$1, input);
});
var templateTagHighlighting = styleTags({
	TagName: tags.tagName,
	GlimmerTemplateTag: tags.tagName,
	TemplateTag: tags.tagName,
	Template: tags.tagName
});
var parser = LRParser.deserialize({
	version: 14,
	states: "!^QQOQOOOVORO'#C^OOOO'#Ca'#CaQQOQOOOOOP'#Cb'#CbO_ORO,58xOOOO,58x,58xOOOO-E6_-E6_OOOP-E6`-E6`OOOO1G.d1G.d",
	stateData: "g~ORPO~OSUOWSO~OSXOWSO~O",
	goto: "hVPPWPP[bTQORQRORVRQTPRWT",
	nodeNames: "⚠ Document GlimmerTemplateTag TemplateTag TemplateTag",
	maxTerm: 8,
	nodeProps: [[
		"closedBy",
		3,
		"templateTagEnd"
	], [
		"openedBy",
		4,
		"templateTagStart"
	]],
	propSources: [templateTagHighlighting],
	skippedNodes: [0],
	repeatNodeCount: 2,
	tokenData: "#s~RP!^!_U~XQ!P!Q_#h#i!l~bP#h#ie~hP#X#Yk~nP#a#bq~tP#d#ew~zP#`#a}~!QP#T#U!T~!WP#h#i!Z~!^P#X#Y!a~!dP!`!a!g~!lOS~~!oP#X#Y!r~!uP#a#b!x~!{P#d#e#O~#RP#`#a#U~#XP#T#U#[~#_P#h#i#b~#eP#X#Y#h~#kP!`!a#n~#sOR~",
	tokenizers: [templateTagContent, 0],
	topRules: { "Document": [0, 1] },
	tokenPrec: 0
});
function gjs() {
	return new LanguageSupport(gjsLanguage, [glimmer().support]);
}
function gts() {
	return new LanguageSupport(gtsLanguage, [glimmer().support]);
}
var gtsLanguage = LRLanguage.define({ parser: parser.configure({ wrap: parseMixed((node) => {
	if (node.type.name === "Document") return null;
	if (node.type.name === "GlimmerTemplateTag") return { parser: glimmerLanguage.parser };
	return { parser: typescriptLanguage.parser };
}) }) });
var gjsLanguage = LRLanguage.define({ parser: parser.configure({ wrap: parseMixed((node) => {
	if (node.type.name === "Document") return null;
	if (node.type.name === "GlimmerTemplateTag") return { parser: glimmerLanguage.parser };
	return { parser: javascriptLanguage.parser };
}) }) });
//#endregion
export { gjs, gts };
