import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocScript from "../doc/models/DocScript";
import ScriptValidator from "../doc/validation/ScriptValidator";
import ValidableScript from "../doc/validation/ValidableScript";
import IGMScript from "../gm_project/interfaces/IGMScript";
import JSDocParser from "../parser/JSDocParser";

/**
 * This class receives as input a GMScript and generates an array of DocScript[]
 */
export default class DocumentationExtractor {

	/**
	 * The ScriptValidator instance
	 */
	private readonly _scriptValidator: ScriptValidator;

	/**
	 * The JSDocParser instance
	 */
	private readonly _jsDocParser: JSDocParser;

	/**
	 * Creates a new DocumentationExtractor
	 * @param config The ProjectConfig that have all the validation rules to use
	 */
	constructor(config: IProjectConfig) {
		this._scriptValidator = new ScriptValidator(config.scripts);
		this._jsDocParser = new JSDocParser();
		this._jsDocParser.warnUnrecognizedTags = config.warnUnrecognizedTags;
	}

	/**
	 * Parses and validates a GMScript and returns
	 * and array of valid DocScripts. If no valid DocScripts
	 * can be created, an empty array is returned.
	 * The returned array is sorted alphabetically.
	 * @param script An array with DocScript objects
	 */
	public extractDocScripts(script: IGMScript): DocScript[] {
		const arr = [];
		for (const [name, gmlText] of script.subScripts()) {
			const docScript = this._jsDocParser.parse(name, gmlText);
			const validable = new ValidableScript(docScript, gmlText);
			if (this._validate(validable)) {
				arr.push(docScript);
			}
		}
		return arr.sort((a, b) => a.name.localeCompare(b.name));
	}

	/**
	 * Validates a script against the validator
	 * @param validator The validator to use
	 * @param validable The validable script
	 */
	private _validate(validable: ValidableScript) {
		const rules = [
			this._scriptValidator.rulePrivate,
			this._scriptValidator.ruleUndocumented,
			this._scriptValidator.ruleUndescripted,
			this._scriptValidator.ruleMismatchingFunctionName,
			this._scriptValidator.ruleMismatchingArguments,
			this._scriptValidator.ruleUndocumentedArguments,
		];
		this._scriptValidator.markAsPrivateIfNecesary(validable);

		for (const rule of rules) {
			if (!rule.validate(validable)) {
				return false;
			}
		}
		return true;
	}
}
