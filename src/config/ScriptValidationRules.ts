import IScriptValidationRules from "./interfaces/IScriptValidationRules";
import IValidationRuleConfig from "./interfaces/IValidationRuleConfig";
import ValidationRuleConfig from "./ValidationRuleConfig";

/**
 * This class contains all the validation rules used to validate scripts
 */
export default class ScriptValidationRules implements IScriptValidationRules {

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
	public undocumented: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * Mismatching script name and "function" JSDoc tags.
	 */
	public mismatchingFunctionName: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * Scripts with no description
	 */
	public undescripted: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * Scripts with undocumented arguments.
	 * For example, if a script has documentation for 0 arguments, but the GML code uses arguments.
	 */
	public undocumentedArguments: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * Ignore scripts with a mismatching number of arguments.
	 * For example, if the scripts has documentation for 4 arguments but the GML code uses 6 arguments.
	 */
	public mismatchingArguments: IValidationRuleConfig = new ValidationRuleConfig(true, true);

}
