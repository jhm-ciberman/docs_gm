import { injectable } from "inversify";
import IValidationRuleConfig from "../config/interfaces/IValidationRuleConfig";
import IReporter from "../reporter/interfaces/IReporter";
import ReporterManager from "../reporter/ReporterManager";
/**
 * Validates a generic element T against a rule defined by a validatorFunction.
 */
@injectable()
export default class ValidationRule<T> {

	/**
	 * Reporter used by the RuleValidator class to warn about validations.
	 * This static variable is used for dependency injection.
	 */
	public reporter: IReporter = ReporterManager.reporter;

	/**
	 * The configuration of the current validation rule
	 */
	private readonly _rule: IValidationRuleConfig;

	/**
	 * The function that will be called to generate
	 * the output warning message. Takes the generic element T as a parameter.
	 */
	private readonly _messageGenerator: ((element: T) => string) | undefined;

	/**
	 * The function to be called to validate the rule.
	 * Must return true if the rule is detected or false otherwise.
	 */
	private readonly _validatorFunction: (element: T) => boolean;

	/**
	 * Creates a new RuleValidator.
	 * @param ruleConfig The configuration of the current validation rule
	 * @param validatorFunction The function to be called to validate the rule.
	 * Must return true if the rule is valid or false otherwise.
	 * @param messageGeneratorFunction The function that will be called to generate
	 * the output warning message. Takes the generic element T as a parameter.
	 */
	constructor(
		ruleConfig: IValidationRuleConfig,
		validatorFunction: (element: T) => boolean,
		messageGenerator?: (element: T) => string,
	) {
		this._rule = ruleConfig;
		this._validatorFunction = validatorFunction;
		this._messageGenerator = messageGenerator;
	}

	/**
	 * Invokes the _validatorFunction with the element T. If the function returns false,
	 * and the rule configuration specify that should warn about invalid rules,
	 * then the the messageGenerator function is called and the output message is send
	 * to the reporter (normally, the reporter is the console, or the screen).
	 * Then, if is invalid and the rule configuration tells that the resource not passing the rule
	 * should be ignored, the method return false. Else, return true.
	 * If the rule is valid, the method returns true.
	 * Basically, if this method returns true, the rule is valid.
	 * @param element The element to check the rule against
	 */
	public validate(element: T): boolean {
		if (!this._validatorFunction(element)) {
			// Rule is invalid
			if (this._rule.warn && this._messageGenerator) {
				// Should warn about invalid rule
				this.reporter.warn(this._messageGenerator(element));
			}
			return !(this._rule.ignore);
		}
		return true;
	}
}
