import IValidationRuleConfig from "./IValidationRuleConfig";

/**
 * Represents the configuration of a single Validation Rule
 */
export default class ValidationRuleConfig implements IValidationRuleConfig {
	/**
	 * Should ignore the script if the script fails the validation rule?
	 */
	public ignore: boolean;

	/**
	 * Should output a warning message if the script fails the validation rule?
	 */
	public warn: boolean;

	/**
	 * Creates a new ValidationRuleConfig
	 * @param ignore Should ignore
	 * @param warn Should warn
	 */
	constructor(ignore: boolean, warn: boolean) {
		this.ignore = ignore;
		this.warn = warn;
	}
}
