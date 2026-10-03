import { t as getOwner } from "./owner-Bxxa-eff.js";
import { M as computed, P as defineProperty } from "./core-D-L0f59Y.js";
import { C as ENV } from "./observers-BmobpXAF-CkVUhhE-.js";
import "./version-dVdMCUiN.js";
import { o as isElementDescriptor } from "./decorator-9ikVwsjY-DzA4qI2N.js";
import { n as dasherize } from "./string-BUAsQ27l.js";
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/@ember/-internals/deprecations/index.js
function isEnabled(options) {
	return Object.hasOwnProperty.call(options.since, "enabled") || ENV._ALL_DEPRECATIONS_ENABLED;
}
var numEmberVersion = parseFloat(ENV._OVERRIDE_DEPRECATION_VERSION ?? "7.3.0");
function emberVersionGte(until, emberVersion = numEmberVersion) {
	let significantUntil = until.replace(/(\.0+)/g, "");
	return emberVersion >= parseFloat(significantUntil);
}
function isRemoved(options) {
	return emberVersionGte(options.until);
}
function deprecation(options) {
	return {
		options,
		test: !isEnabled(options),
		isEnabled: isEnabled(options) || isRemoved(options),
		isRemoved: isRemoved(options)
	};
}
var DEPRECATIONS = {
	DEPRECATE_IMPORT_EMBER(importName) {
		return deprecation({
			id: `deprecate-import-${dasherize(importName).toLowerCase()}-from-ember`,
			for: "ember-source",
			since: {
				available: "5.10.0",
				enabled: "6.5.0"
			},
			until: "7.0.0",
			url: `https://deprecations.emberjs.com/id/import-${dasherize(importName).toLowerCase()}-from-ember`
		});
	},
	DEPRECATE_IMPORT_INJECT: deprecation({
		for: "ember-source",
		id: "importing-inject-from-ember-service",
		since: {
			available: "6.2.0",
			enabled: "6.3.0"
		},
		until: "7.0.0",
		url: "https://deprecations.emberjs.com/id/importing-inject-from-ember-service"
	}),
	DEPRECATE_COMPARABLE_MIXIN: deprecation({
		for: "ember-source",
		id: "deprecate-comparable-mixin",
		since: {
			available: "7.2.0",
			enabled: "7.2.0"
		},
		until: "7.5.0",
		url: "https://deprecations.emberjs.com/id/deprecate-comparable-mixin"
	}),
	DEPRECATE_TARGET_ACTION_SUPPORT: deprecation({
		for: "ember-source",
		id: "deprecate-target-action-support",
		since: { available: "7.3.0" },
		until: "8.0.0",
		url: "https://deprecations.emberjs.com/id/deprecate-target-action-support"
	})
};
function deprecateUntil(message, deprecation) {
	const { options } = deprecation;
	if (deprecation.isRemoved) throw new Error(`The API deprecated by ${options.id} was removed in ember-source ${options.until}. The message was: ${message}. Please see ${options.url} for more details.`);
}
//#endregion
//#region ../node_modules/.pnpm/ember-source@7.3.0_@glimmer+component@2.1.1_supports-color@8.1.1__supports-color@8.1.1/node_modules/ember-source/dist/prod/packages/shared-chunks/injected_property-DqQ0XV7k.js
var DEBUG_INJECTION_FUNCTIONS;
/**
@module ember
@private
*/
/**
Read-only property that returns the result of a container lookup.

@class InjectedProperty
@namespace Ember
@constructor
@param {String} type The container type the property will lookup
@param {String} nameOrDesc (optional) The name the property will lookup, defaults
to the property's name
@private
*/
function inject(type, ...args) {
	let elementDescriptor;
	let name;
	if (isElementDescriptor(args)) elementDescriptor = args;
	else if (typeof args[0] === "string") name = args[0];
	let getInjection = function(propertyName) {
		return (getOwner(this) || this.container).lookup(`${type}:${name || propertyName}`);
	};
	let decorator = computed({
		get: getInjection,
		set(keyName, value) {
			defineProperty(this, keyName, null, value);
		}
	});
	if (elementDescriptor) return decorator(elementDescriptor[0], elementDescriptor[1], elementDescriptor[2]);
	else return decorator;
}
//#endregion
export { deprecateUntil as i, inject as n, DEPRECATIONS as r, DEBUG_INJECTION_FUNCTIONS as t };
