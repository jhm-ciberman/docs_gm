/**
 * Represents the configuration of a single Validation Rule
 */
export default interface IValidationRuleConfig {
	/**
	 * Should ignore the script if the script fails the validation rule?
	 */
	ignore: boolean;

	/**
	 * Should output a warning message if the script fails the validation rule?
	 */
	warn: boolean;
}
