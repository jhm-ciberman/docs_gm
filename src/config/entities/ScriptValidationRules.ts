import IScriptValidationRules from "../interfaces/IScriptValidationRules";
import IValidationRuleConfig from "../interfaces/IValidationRuleConfig";
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
	public noDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);

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

	/**
	 * Ignore scripts with some argument without description.
	 */
	public noParamDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * Ignore scripts with some argument without argument data type.
	 */
	public noParamType: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule should detect if the "description" JSDoc tag has a function
	 * signature instead of the actual function description.
	 * This is because, when you import a GMS1 project into GMS2, the "description"
	 * tag is filled with the function generated signature.
	 */
	public functionSignatureInDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);
}
