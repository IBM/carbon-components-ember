//#region ../node_modules/.pnpm/repl-sdk@1.6.1_@codemirror+lang-css@6.3.1_@lezer+javascript@1.5.4_@lezer+lr@1.4.10_supports-color@8.1.1/node_modules/repl-sdk/src/compilers/ember/owner.js
/**
* @param {unknown} [owner]
*/
function makeOwner(owner) {
	return {
		name: "inner owner",
		/**
		* @param {string} name
		*/
		lookup(name) {
			if (typeof owner !== "object") return;
			if (!owner) return;
			if (!("lookup" in owner)) return;
			if (typeof owner.lookup !== "function") return;
			return owner.lookup(name);
		},
		/**
		* @param {string} name
		*/
		resolveRegistration(name) {
			if (typeof owner !== "object") return;
			if (!owner) return;
			if (!("resolveRegistration" in owner)) return;
			if (typeof owner.resolveRegistration !== "function") return;
			return owner.resolveRegistration(name);
		},
		/**
		* @param {string} name
		*/
		hasRegistration(name) {
			if (typeof owner !== "object") return;
			if (!owner) return;
			if (!("hasRegistration" in owner)) return;
			if (typeof owner.hasRegistration !== "function") return;
			return owner.hasRegistration(name);
		},
		/**
		* @param {string} name
		*/
		factoryFor(name) {
			if (typeof owner !== "object") return;
			if (!owner) return;
			if (!("factoryFor" in owner)) return;
			if (typeof owner.factoryFor !== "function") return;
			return owner.factoryFor(name);
		}
	};
}
//#endregion
export { makeOwner as t };
