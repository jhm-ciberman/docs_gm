import { inject, injectable } from "inversify";

import { TYPES } from "../../types";
import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import IValidationRuleConfig from "../config/interfaces/IValidationRuleConfig";
import IRule from "./interfaces/IRule";
import IRuleValidator from "./interfaces/IRuleValidator";
import IScriptValidator from "./interfaces/IScriptValidator";
import IValidableScript from "./interfaces/IValidableScript";
import RuleMismatchingArguments from "./rules/RuleMismatchingArguments";
import RuleMismatchingFunctionName from "./rules/RuleMismatchingFunctionName";
import RuleNoDescription from "./rules/RuleNoDescription";
import RulePrivate from "./rules/RulePrivate";
import RuleUndocumented from "./rules/RuleUndocumented";
import RuleUndocumentedArguments from "./rules/RuleUndocumentedArguments";

/**
 * This class creates multiple validator rules that can validate
 * a validable script.
 */
@injectable()
export default class ScriptValidator implements IScriptValidator {

	/**
	 * A list with the rules to apply to validate the ValidableScript, in order.
	 */
	private readonly _rules: IRule[];

	/**
	 * The rule validator
	 */
	@inject(TYPES.IRuleValidator)
	private _ruleValidator: IRuleValidator;

	/**
	 * Creates an instance of ScriptValidator.
	 */
	constructor() {
		this._rules = [
			new RulePrivate(),
			new RuleUndocumented(),
			new RuleNoDescription(),
			new RuleMismatchingFunctionName(),
			new RuleMismatchingArguments(),
			new RuleUndocumentedArguments(),
		];
	}
	/**
	 * Validates a script against a set of rules
	 * @param validator The validator to use
	 * @param validable The validable script
	 */
	public validate(validable: IValidableScript, rules: IScriptValidationRules): boolean {

		if (rules.markUnderscoreScriptsAsPrivate && validable.doc.name.startsWith("_")) {
			validable.doc.private = true;
		}

		const config: IValidationRuleConfig[] = [
			{ warn: false, ignore: rules.ignorePrivate },
			rules.undocumented,
			rules.noDescription,
			rules.mismatchingFunctionName,
			rules.mismatchingArguments,
			rules.undocumentedArguments,
		];

		return this._rules.every((rule, i) => this._ruleValidator.validate(rule, validable, config[i]));
	}

}
