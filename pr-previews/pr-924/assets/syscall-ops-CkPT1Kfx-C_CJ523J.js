function isLowLevelRegister(register) {
	return register <= 3;
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/syscall-ops-CkPT1Kfx.js
var SIGN_BIT = -536870913;
var MAX_INT = 536870911;
var MIN_INT = -536870912;
function isHandle(value) {
	return value >= 0;
}
function constants(...values) {
	return [
		false,
		true,
		null,
		void 0,
		...values
	];
}
function isSmallInt(value) {
	return value % 1 === 0 && value <= MAX_INT && value >= MIN_INT;
}
function encodeNegative(num) {
	return num & SIGN_BIT;
}
function decodeNegative(num) {
	return num | 536870912;
}
function encodePositive(num) {
	return ~num;
}
function decodePositive(num) {
	return ~num;
}
function encodeHandle(num) {
	return num;
}
function decodeHandle(num) {
	return num;
}
function encodeImmediate(num) {
	num |= 0;
	return num < 0 ? encodeNegative(num) : encodePositive(num);
}
function decodeImmediate(num) {
	num |= 0;
	return num > SIGN_BIT ? decodePositive(num) : decodeNegative(num);
}
[1, -1].forEach((x) => decodeImmediate(encodeImmediate(x)));
//#endregion
export { encodeImmediate as a, isLowLevelRegister as c, encodeHandle as i, decodeHandle as n, isHandle as o, decodeImmediate as r, isSmallInt as s, constants as t };
