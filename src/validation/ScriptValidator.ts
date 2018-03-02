import { inject, injectable } from "inversify";

import { TYPES } from "../../types";
import IScriptValidationRules from "../config/interfaces/IScriptValidationRules";
import IValidationRuleConfig from "../config/interfaces/IValidationRuleConfig";
import IRule from "./interfaces/IRule";
import IScriptValidator from "./interfaces/IScriptValidator";
import IValidableScript from "./interfaces/IValidableScript";

/**
 * This class creates multiple validator rules that can validate
 * a validable script.
 */
@injectable()
export default class ScriptValidator implements IScriptValidator {

	/**
	 * A list with the rules to apply to validate the ValidableScript, in order.
	 */
	private readonly _rules: Array<IRule<IValidableScript>>;

	/**
	 * Creates an instance of ScriptValidator.
	 * @param {IRule<IValidableScript>} rulePrivate
	 * @param {IRule<IValidableScript>} ruleUndocumented
	 * @param {IRule<IValidableScript>} ruleNoDescription
	 * @param {IRule<IValidableScript>} ruleMismatchingFunctionName
	 * @param {IRule<IValidableScript>} ruleMismatchingArguments
	 * @param {IRule<IValidableScript>} ruleUndocumentedArguments
	 * @memberof ScriptValidator
	 */
	constructor(
		@inject(TYPES.RulePrivate)
		rulePrivate: IRule<IValidableScript>,
		@inject(TYPES.RuleUndocumented)
		ruleUndocumented: IRule<IValidableScript>,
		@inject(TYPES.RuleNoDescription)
		ruleNoDescription: IRule<IValidableScript>,
		@inject(TYPES.RuleMismatchingFunctionName)
		ruleMismatchingFunctionName: IRule<IValidableScript>,
		@inject(TYPES.RuleMismatchingArguments)
		ruleMismatchingArguments: IRule<IValidableScript>,
		@inject(TYPES.RuleUndocumentedArguments)
		ruleUndocumentedArguments: IRule<IValidableScript>,
	) {
		this._rules = [
			rulePrivate,
			ruleUndocumented,
			ruleNoDescription,
			ruleMismatchingFunctionName,
			ruleMismatchingArguments,
			ruleUndocumentedArguments,
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

		return this._rules.every((rule, i) => rule.validate(validable, config[i]));
	}
}
