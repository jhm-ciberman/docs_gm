import IProjectConfig from "./interfaces/IProjectConfig";

/**
 * Static class to generate the default project config object
 */
export default class DefaultProjectConfig {

	/**
	 * Creates a new default project config object
	 */
	public static create(): IProjectConfig {
		return Object.create(this._defaultProjectConfig);
	}

	/**
	 * The default config
	 */
	private static _defaultProjectConfig: IProjectConfig = Object.freeze({
		output: {
			design: "",
			template: "basic",
			pattern: "**/*",
			outputFolder: "./docs/",
			templatesFolder: "",
		},
		warnUnrecognizedTags: true,
		scripts: {
			markUnderscoreScriptsAsPrivate: true,
			ignorePrivate: true,
			undocumented: {
				ignore: true,
				warn: true,
			},
			mismatchingFunctionName: {
				ignore: true,
				warn: true,
			},
			undescripted: {
				ignore: true,
				warn: true,
			},
			undocumentedArguments: {
				ignore: true,
				warn: true,
			},
			mismatchingArguments: {
				ignore: true,
				warn: true,
			},
		},
	});

}
