import { inject, injectable } from "inversify";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocScript from "../doc_models/DocScript";
import GMScript from "../gm_project/common/GMScript";
import JSDocParser from "../parser/JSDocParser";
import { TYPES } from "../types";
import IScriptValidator from "../validation/IScriptValidator";
import ValidableScript from "../validation/ValidableScript";
import IDocumentationExtractor from "./IDocumentationExtractor";

/**
 * This class receives as input a GMScript and generates an array of DocScript[]
 */
@injectable()
export default class DocumentationExtractor implements IDocumentationExtractor {

	/**
	 * The ScriptValidator instance
	 */
	@inject(TYPES.IScriptValidator)
	private readonly _scriptValidator: IScriptValidator;

	/**
	 * The JSDocParser instance
	 */
	@inject(TYPES.IJSDocParser)
	private readonly _jsDocParser: JSDocParser;

	/**
	 * The project config
	 */
	@inject(TYPES.IPProjectConfig)
	private readonly _projectConfig: IProjectConfig;

	/**
	 * Parses and validates a GMScript and returns
	 * and array of valid DocScripts. If no valid DocScripts
	 * can be created, an empty array is returned.
	 * The returned array is sorted alphabetically.
	 * @param script An array with DocScript objects
	 */
	public extractDocScripts(script: GMScript): DocScript[] {
		const arr = [];
		this._jsDocParser.warnUnrecognizedTags = this._projectConfig.warnUnrecognizedTags;
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
		this._scriptValidator.markAsPrivateIfNecessary(validable);

		for (const rule of rules) {
			if (!rule.validate(validable)) {
				return false;
			}
		}
		return true;
	}
}
