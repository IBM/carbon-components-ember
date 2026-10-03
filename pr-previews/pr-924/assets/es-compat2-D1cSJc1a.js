//#region ../node_modules/.pnpm/@embroider+macros@1.21.1_@babel+core@7.29.7_supports-color@8.1.1__@glint+template@1.9.0_supports-color@8.1.1/node_modules/@embroider/macros/src/addon/es-compat2.js
function esCompat(m) {
	return m?.__esModule ? m : {
		default: m,
		...m
	};
}
//#endregion
export { esCompat as t };
