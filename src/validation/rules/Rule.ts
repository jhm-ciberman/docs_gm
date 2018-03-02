import { injectable } from "inversify";
import IValidationRuleConfig from "../../config/interfaces/IValidationRuleConfig";
import IReporter from "../../reporter/interfaces/IReporter";
import ReporterManager from "../../reporter/ReporterManager";
import IRule from "../interfaces/IRule";

/**
 * Validates a generic element T against a rule defined by a validatorFunction.
 */
@injectable()
export default abstract class Rule<T> implements IRule<T> {

	/**
	 * Reporter used by the RuleValidator class to warn about validations.
	 * This static variable is used for dependency injection.
	 */
	public reporter: IReporter = ReporterManager.reporter;

	/**
	 * Invokes the _validatorFunction with the element T. If the function returns false,
	 * and the rule configuration specify that should warn about invalid rules,
	 * then the the _messageGenerator function is called and the output message is send
	 * to the reporter (normally, the reporter is the console, or the screen).
	 * Then, if is invalid and the rule configuration tells that the resource not passing the rule
	 * should be ignored, the method return false. Else, return true.
	 * If the rule is valid, the method returns true.
	 * Basically, if this method returns true, the rule is valid.
	 * @param element The element to check the rule against
	 * @param ruleConfig The rule configuration
	 */
	public validate(element: T, ruleConfig: IValidationRuleConfig): boolean {
		if (!this._validatorFunction(element)) {
			// Rule is invalid
			if (ruleConfig.warn) {
				// Should warn about invalid rule
				this.reporter.warn(this._messageGenerator(element));
			}
			return !(ruleConfig.ignore);
		}
		return true;
	}

	/**
	 * Method to validate the rule
	 * @param element The element to validate
	 */
	protected abstract _validatorFunction(element: T): boolean;

	/**
	 * Method to generate a warning message in case the rule is invalid
	 * @param element The element to validate
	 */
	protected abstract _messageGenerator(element: T): string;
}
