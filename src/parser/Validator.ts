import DocScript from "../docs_models/DocScript";
import ReporterManager from "../reporter/ReporterManager";
import IGMLParser from "./IGMLParser";
import OutputConfig from "./OutputConfig";

/**
 * This class validates all the DocScript data against the OutputConfig rules.
 */
export default class Validator {

	/**
	 * The rules to valudate against
	 */
	private _config: OutputConfig;

	/**
	 * The DocScript to validate
	 */
	private _docScript: DocScript;

	public constructor(docScript: DocScript, config: OutputConfig ) {
		this._config = config;
		this._docScript = docScript;
	}

	/**
	 * Validate the docScript using the passed validation configuration.
	 * @param docScript The docScript to validate
	 * @param config The configuration to validate against
	 * @return true if the docScript is valid
	 */
	public validateDocScript(): boolean {
		if (this._docScript.private && this._config.ignorePrivateScripts) {
			return false;
		}

		if (this._checkIgnore(
			this._docScript.undocumented,
			this._config.warnUndocumentedScripts,
			this._config.ignoreUndocumentedScripts,
			`Script "${ this._docScript.name }" is undocumented.`,
		)) {
			return false;
		}

		if (this._checkIgnore(
			!this._docScript.description,
			this._config.warnNoDescriptionScripts,
			this._config.ignoreNoDescriptionScripts,
			`Script "${ this._docScript.name }" has no description.`,
		)) {
			return false;
		}

		if (this._docScript.function
			&& this._docScript.function !== this._docScript.name
			&& this._config.warnMismatchingFunctionName) {
			ReporterManager.reporter.warn(
				`Script "${ this._docScript.name }" has a mismatching @function name "${ this._docScript.function }"`,
			);
		}

		return true;
	}

	/**
	 * Check if the GML Features of the given GML text (for example, number of arguments,
	 * presence of returns statment, etc) matches the documentation inside the docScript
	 * using the current OutputConfig rules.
	 * @param parser A GMLParser object used to parse the GMLFeatures
	 * @return true if the features matches the documentation, or false otherwise.
	 */
	public checkGMLFeaturesMatchDocs(parser: IGMLParser): boolean {
		const fixedArgsN = parser.countFixedArguments();
		const optArgsN = parser.countOptionalArguments();
		const argsN = Math.max(fixedArgsN, optArgsN);
		const docsN = this._docScript.params.length;

		if (this._checkIgnore(
			docsN === 0,
			this._config.warnUndocumentedArgumentsScripts,
			this._config.ignoreUndocumentedArgumentsScripts,
			`Script "${ this._docScript.name }" uses arguments but does not have any @param JSDoc comment.`,
		)) {
			return false;
		}

		if (this._checkIgnore(
			argsN !== docsN,
			this._config.warnMismatchingArgumentsScripts,
			this._config.ignoreMismatchingArgumentsScripts,
			`Script "${ this._docScript.name }" uses ${ argsN } but has documentation for ${ docsN } arguments.`,
		)) {
			return false;
		}
		return true;
	}

	/**
	 * Helper function to assert about validations
	 * @param expresion The expresion to check
	 * @param shouldWarn Indicates if should output the warnMessage to the reporter if the expresionToCheck is met
	 * @param shouldHalt Indicates if should return true if the expresion is true
	 * @param warnMessage The Message to warn if shouldWarn and expresion are true
	 */
	private _checkIgnore(expresion: boolean, shouldWarn: boolean, shouldIgnore: boolean, warnMessage: string) {
		if (expresion) {
			if (shouldWarn) {
				ReporterManager.reporter.warn(warnMessage);
			}
			return shouldIgnore;
		}
		return false;
	}
}
