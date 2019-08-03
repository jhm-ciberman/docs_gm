import { inject, injectable } from "inversify";

import IScriptValidationRules from "../config/IScriptValidationRules";
import { TYPES } from "../types";
import IRulesProvider from "./interfaces/IRulesProvider";
import IRuleValidator from "./interfaces/IRuleValidator";
import IScriptValidator from "./interfaces/IScriptValidator";
import IValidableScript from "./interfaces/IValidableScript";

/**
 * This class creates multiple validator rules that can validate
 * a validable script.
 */
@injectable()
export default class ScriptValidator implements IScriptValidator {

	@inject(TYPES.IRuleValidator)
	private _ruleValidator: IRuleValidator;

	@inject(TYPES.IRulesProvider)
	private _rulesProvider: IRulesProvider;

	/**
	 * Validates a script against a set of rules
	 * @param validator The validator to use
	 * @param validable The validable script
	 */
	public validate(validable: IValidableScript, rulesConfig: IScriptValidationRules): boolean {

		if (rulesConfig.markUnderscoreScriptsAsPrivate && validable.doc.name.startsWith("_")) {
			validable.doc.private = true;
		}

		const rules = this._rulesProvider.getRules();
		const config = this._rulesProvider.getConfig(rulesConfig);
		return rules.every((rule, i) => {
			return this._ruleValidator.validate(rule, validable, config[i]);
		});
	}

}
