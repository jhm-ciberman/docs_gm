import IValidationRuleConfig from "./IValidationRuleConfig";

/**
 * This class contains all the validation rules used to validate scripts
 */
export default interface IScriptValidationRule {

	/**
	 * Mark scripts names starting with underscore as private scripts
	 */
	markUnderscoreScriptsAsPrivate: boolean;

	/**
	 * Ignore private scripts when generating documentation
	 */
	ignorePrivate: boolean;

	/**
	 * Undocumented scripts
	 */
	undocumented: IValidationRuleConfig;

	/**
	 * Mismatching script name and "function" JSDoc tags.
	 */
	mismatchingFunctionName: IValidationRuleConfig;

	/**
	 * Scripts with no description
	 */
	undescripted: IValidationRuleConfig;

	/**
	 * Scripts with undocumented arguments.
	 * For example, if a script has documentation for 0 arguments, but the GML code uses arguments.
	 */
	undocumentedArguments: IValidationRuleConfig;

	/**
	 * Ignore scripts with a mismatching number of arguments.
	 * For example, if the scripts has documentation for 4 arguments but the GML code uses 6 arguments.
	 */
	mismatchingArguments: IValidationRuleConfig;
}
