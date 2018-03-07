import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import DocScript from "../doc_models/DocScript";
import GMSubscript from "../gm_project/GMSubscript";
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
	public extractDocScripts(
		subscriptsIterator: IterableIterator<GMSubscript>,
		rules: IScriptValidationRules,
		warnUnrecognizedTags: boolean,
	): DocScript[] {
		const arr = [];

		this._jsDocParser.warnUnrecognizedTags = warnUnrecognizedTags;
		for (const subScript of subscriptsIterator) {
			const docScript = this._jsDocParser.parse(subScript.name, subScript.text);
			const validable = new ValidableScript(docScript, subScript.text);
			if (this._scriptValidator.validate(validable, rules)) {
				arr.push(docScript);
			}
		}
		return arr.sort((a, b) => a.name.localeCompare(b.name));
	}

}
