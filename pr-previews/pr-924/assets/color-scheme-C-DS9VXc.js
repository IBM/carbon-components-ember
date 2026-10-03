import { t as cell } from "./dist-52Fvna0m.js";
import { d as waitForPromise } from "./dist-D7Wa23G2.js";
//#region ../node_modules/.pnpm/ember-primitives@0.61.1_@babel+core@7.29.7_supports-color@8.1.1__@ember+test-helpers@5._c7db2dfa7a9938a2e2c58942950d0872/node_modules/ember-primitives/dist/color-scheme.js
var _colorScheme = cell();
var callbacks = /* @__PURE__ */ new Set();
async function runCallbacks(theme) {
	await Promise.resolve();
	for (const callback of callbacks.values()) callback(theme);
}
/**
* Object for managing the color scheme
*/
var colorScheme = {
	/**
	* Set's the current color scheme to the passed value
	*/
	update: (value) => {
		colorScheme.current = value;
		waitForPromise(runCallbacks(value));
	},
	on: { 
	/**
	* register a function to be called when the color scheme changes.
	*/
update: (callback) => {
		callbacks.add(callback);
	} },
	off: { 
	/**
	* unregister a function that would have been called when the color scheme changes.
	*/
update: (callback) => {
		callbacks.delete(callback);
	} },
	/**
	* the current valuel of the "color scheme"
	*/
	get current() {
		return _colorScheme.current;
	},
	set current(value) {
		_colorScheme.current = value;
		if (!value) {
			localPreference.delete();
			return;
		}
		localPreference.update(value);
		setColorScheme(value);
	},
	get isDark() {
		return _colorScheme.current === "dark";
	},
	get isLight() {
		return _colorScheme.current !== "dark";
	}
};
/**
* Synchronizes state of `colorScheme` with the users preferences as well as reconciles with previously set theme in local storage.
*
* This may only be called once per app.
*/
function sync() {
	/**
	* reset the callbacks
	*/
	callbacks = /* @__PURE__ */ new Set();
	/**
	* If local prefs are set, then we don't care what prefers-color-scheme is
	*/
	const userPreference = localPreference.read();
	if (userPreference) {
		setColorScheme(userPreference);
		_colorScheme.current = userPreference;
		return;
	}
	if (prefers.dark()) {
		setColorScheme("dark");
		_colorScheme.current = "dark";
	} else if (prefers.light()) {
		setColorScheme("light");
		_colorScheme.current = "light";
	}
}
var queries = {
	dark: window.matchMedia("(prefers-color-scheme: dark)"),
	light: window.matchMedia("(prefers-color-scheme: light)"),
	none: window.matchMedia("(prefers-color-scheme: no-preference)")
};
queries.dark.addEventListener("change", (e) => {
	if (localPreference.isSet()) return;
	const mode = e.matches ? "dark" : "light";
	colorScheme.update(mode);
});
/**
* Helper methods to determining what the user's preferred color scheme is
* based on the system preferences rather than the users explicit preference.
*/
var prefers = {
	dark: () => queries.dark.matches,
	light: () => queries.light.matches,
	none: () => queries.none.matches,
	custom: (name) => window.matchMedia(`(prefers-color-scheme: ${name})`).matches
};
var LOCAL_PREF_KEY = "ember-primitives/color-scheme#local-preference";
/**
* Helper methods for working with the color scheme preference in local storage
*/
var localPreference = {
	isSet: () => Boolean(localPreference.read()),
	read: () => localStorage.getItem(LOCAL_PREF_KEY),
	update: (value) => localStorage.setItem(LOCAL_PREF_KEY, value),
	delete: () => localStorage.removeItem(LOCAL_PREF_KEY)
};
/**
* For the given element, returns the `color-scheme` of that element.
*/
function getColorScheme(element) {
	return styleOf(element).getPropertyValue("color-scheme");
}
function setColorScheme(...args) {
	if (typeof args[0] === "string") {
		styleOf().setProperty("color-scheme", args[0]);
		return;
	}
	if (typeof args[1] === "string") {
		styleOf(args[0]).setProperty("color-scheme", args[1]);
		return;
	}
	throw new Error(`Invalid arity, expected up to 2 args, received ${args.length}`);
}
/**
* Removes the `color-scheme` from the given element
*/
function removeColorScheme(element) {
	styleOf(element).removeProperty("color-scheme");
}
function styleOf(element) {
	if (element) return element.style;
	return document.documentElement.style;
}
sync();
window.addEventListener("storage", (e) => {
	try {
		if (e.key !== LOCAL_PREF_KEY) return;
		if (e.newValue === null) {
			if (prefers.dark()) {
				colorScheme.update("dark");
				return;
			} else if (prefers.light()) {
				colorScheme.update("light");
				return;
			}
			colorScheme.update("light");
			return;
		}
		const newScheme = e.newValue;
		colorScheme.update(newScheme);
	} catch {}
});
//#endregion
export { removeColorScheme as a, prefers as i, getColorScheme as n, setColorScheme as o, localPreference as r, sync as s, colorScheme as t };
