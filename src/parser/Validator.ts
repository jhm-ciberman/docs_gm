import DocScript from "../docs_models/DocScript";
import ReporterManager from "../reporter/ReporterManager";
import GMLParser from "./GMLParser";
import OutputConfig from "./OutputConfig";

export default class Validator {

	private _config: OutputConfig;

	private _docScript: DocScript;

	private _name: string;

	public constructor(docScript: DocScript, name: string, config: OutputConfig ) {
		this._config = config;
		this._docScript = docScript;
		this._name = name;
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
			`Script "${ this._name }" is undocumented.`,
		)) {
			return false;
		}

		if (this._checkIgnore(
			!this._docScript.description,
			this._config.warnNoDescriptionScripts,
			this._config.ignoreNoDescriptionScripts,
			`Script "${ this._name }" has no description.`,
		)) {
			return false;
		}

		if (this._docScript.function !== name && this._config.warnMismatchingFunctionName) {
			ReporterManager.reporter.warn(`Script "${name}" has a mismatching @function name "${ this._docScript.function }"`);
		}

		return true;
	}

	/**
	 * Check if the GML Features of the given GML text (for example, number of arguments,
	 * presence of returns statment, etc) matches the documentation inside the docScript
	 * using the current OutputConfig rules.
	 * @param gmlText The GMLText of the docScript
	 * @return true if the features matches the documentation, or false otherwise.
	 */
	public checkGMLFeaturesMatchDocs(gmlText: string): boolean {
		const features = GMLParser.extractGMLFeatures(gmlText);
		const docsN = this._docScript.params.length;
		const argsN = features.argumentCount;

		if (this._checkIgnore(
			docsN === 0,
			this._config.warnUndocumentedArgumentsScripts,
			this._config.ignoreUndocumentedArgumentsScripts,
			`Script "${ this._name }" uses arguments but does not have any @param JSDoc comment.`,
		)) {
			return false;
		}

		if (this._checkIgnore(
			argsN !== docsN,
			this._config.warnMismatchingArgumentsScripts,
			this._config.ignoreMismatchingArgumentsScripts,
			`Script "${ this._name }" uses ${ argsN } but has documentation for ${ docsN } arguments.`,
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
