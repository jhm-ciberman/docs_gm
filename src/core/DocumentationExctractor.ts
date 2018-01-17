import ProjectConfig from "../config/ProjectConfig";
import DocScript from "../doc/models/DocScript";
import IGMScript from "../gm_project/interfaces/IGMScript";
import JSDocParser from "../parser/JSDocParser";
import ScriptValidator from "../doc/validation/ScriptValidator";
import ValidableScript from "../doc/validation/ValidableScript";

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
	 *
	 * @param config The ProjectConfig that have all the validation rules to use
	 */
	constructor(config: ProjectConfig) {
		this._scriptValidator = new ScriptValidator(config.scripts);
		this._jsDocParser = new JSDocParser(config.warnUnrecognizedTags);
	}

	/**
	 * Parses and validates a GMScript and returns
	 * and array of valid DocScripts. If no valid DocScripts
	 * can be created, an empty array is returned.
	 * @param script An array with DocScript objects
	 */
	public extractDocScripts(script: IGMScript): DocScript[] {
		const arr = [];
		for (const [name, gmlText] of script.subScripts()) {
			const docScript = this._jsDocParser.parse(name, gmlText);
			const validable = new ValidableScript(docScript, gmlText);
			if (this._scriptValidator.validate(validable)) {
				arr.push(docScript);
			}
		}
		return arr;
	}
}
