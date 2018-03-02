import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import IValidationRuleConfig from "../config/interfaces/IValidationRuleConfig";
import IReporter from "../reporter/interfaces/IReporter";
import IRule from "./interfaces/IRule";
import IValidableScript from "./interfaces/IValidableScript";

/**
 * This class validates a single IRule against a ValidableScript with a rule configuration.
 */
@injectable()
export default class RuleValidator {

	/**
	 * Reporter used by the class to warn about validations.
	 */
	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	/**
	 * Validates a single rule against a ValidableScript
	 * @param element The element to check the rule against
	 * @param ruleConfig The rule configuration
	 */
	public validate(rule: IRule, script: IValidableScript, config: IValidationRuleConfig): boolean {
		if (!rule.isValid(script)) {
			// Rule is invalid
			if (config.warn) {
				// Should warn about invalid rule
				this._reporter.warn(rule.getWarnMessage(script));
			}
			return !(config.ignore);
		}
		return true;
	}
}
