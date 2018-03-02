import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import DocScript from "../doc_models/DocScript";
import GMScript from "../gm_project/GMScript";
import JSDocParser from "../parser/JSDocParser";
import IScriptValidator from "../validation/interfaces/IScriptValidator";
import ValidableScript from "../validation/ValidableScript";
import IDocumentationExtractor from "./interfaces/IDocumentationExtractor";

/**
 * This class receives as input a GMScript and generates an array of DocScript[]
 */
@injectable()
export default class DocumentationExtractor implements IDocumentationExtractor {
	/**
	 * The ScriptValidator
	 */
	@inject(TYPES.IScriptValidator)
	private readonly _scriptValidator: IScriptValidator;

	/**
	 * The JSDocParser instance
	 */
	@inject(TYPES.IJSDocParser)
	private readonly _jsDocParser: JSDocParser;

	/**
	 * Parses and validates a GMScript and returns
	 * and array of valid DocScripts. If no valid DocScripts
	 * can be created, an empty array is returned.
	 * The returned array is sorted alphabetically.
	 * @param script An array with DocScript objects
	 */
	public extractDocScripts(script: GMScript, rules: IScriptValidationRules, warnUnrecognizedTags: boolean): DocScript[] {
		const arr = [];

		this._jsDocParser.warnUnrecognizedTags = warnUnrecognizedTags;
		for (const [name, gmlText] of script.subScripts()) {
			const docScript = this._jsDocParser.parse(name, gmlText);
			const validable = new ValidableScript(docScript, gmlText);
			if (this._scriptValidator.validate(validable, rules)) {
				arr.push(docScript);
			}
		}
		return arr.sort((a, b) => a.name.localeCompare(b.name));
	}

}
