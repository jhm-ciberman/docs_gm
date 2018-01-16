import IValidationRuleConfig from "./IValidationRuleConfig";

/**
 * This class contains all the validation rules used to validate scripts
 */
export default class ScriptValidationRules {

	/**
	 * Mark scripts names starting with underscore as private scripts
	 */
	public markUnderscoreScriptsAsPrivate: boolean = true;

	/**
	 * Ignore private scripts when generating documentation
	 */
	public ignorePrivate: boolean = true;

	/**
	 * Undocumented scripts
	 */
	public undocumented: IValidationRuleConfig = {
		ignore: true,
		warn: true,
	};

	/**
	 * Mismatching script name and "function" JSDoc tags.
	 */
	public mismatchingFunctionName: IValidationRuleConfig = {
		ignore: true,
		warn: true,
	};

	/**
	 * Scripts with no description
	 */
	public undescripted: IValidationRuleConfig = {
		ignore: true,
		warn: true,
	};

	/**
	 * Scripts with undocumented arguments.
	 * For example, if a script has documentation for 0 arguments, but the GML code uses arguments.
	 */
	public undocumentedArguments: IValidationRuleConfig = {
		ignore: true,
		warn: true,
	};

	/**
	 * Ignore scripts with a mismatching number of arguments.
	 * For example, if the scripts has documentation for 4 arguments but the GML code uses 6 arguments.
	 */
	public mismatchingArguments: IValidationRuleConfig = {
		ignore: true,
		warn: true,
	};
}
