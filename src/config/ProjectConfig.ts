import {
	IOutputConfig,
	IParsingConfig,
	IProjectConfig,
	IScriptValidationRules,
	IValidationRuleConfig,
} from "./IProjectConfig";

/**
 * This interface represents the docs_gm configuration for a single Game Maker Project.
 */
export class ProjectConfig implements IProjectConfig {

	/**
	 * The project's name to display
	 */
	public name?: string = undefined;

	/**
	 * The output configuration
	 */
	public output: IOutputConfig = new OutputConfig();

	/**
	 * The glob pattern to use to include files in the project documentation
	 */
	public pattern: string = "**/*";

	/**
	 * The documentation root folder
	 */
	public root: string = "scripts";

	/**
	 * The parser configuration
	 */
	public parser: IParsingConfig = new ParsingConfig();

	/**
	 * Rules for validating scripts
	 */
	public scripts: IScriptValidationRules = new ScriptValidationRules();
}

/**
 * This class has all the configuration for the DocsGM Output
 */
// tslint:disable-next-line:max-classes-per-file
export class OutputConfig implements IOutputConfig {
	/**
	 * The template name to use
	 */
	public template: string = "basic";

	/**
	 * Specifies if individual pages for each gamemaker script sould be generated
	 */
	public scriptPages: boolean = true;

	/**
	 * Specifies if individual pages for each gamemaker folder sould be generated
	 */
	public folderPages: boolean = true;

	/**
	 * The output folder of the documentation
	 */
	public outputFolder: string = "./docs/";

	/**
	 * The folder where the templates are located. If empty, the default templates folder will be used
	 */
	public templatesFolder: string = "";
}

// tslint:disable-next-line:max-classes-per-file
export class ParsingConfig implements IParsingConfig {
	/**
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * If true, the arguments with the same name will be merged.
	 * If false, it will be added as different arguments.
	 */
	public mergeDuplicateParams: boolean = false;
}

/**
 * This class contains all the validation rules used to validate scripts
 */
// tslint:disable-next-line:max-classes-per-file
export class ScriptValidationRules implements IScriptValidationRules {

	/**
	 * Mark scripts names starting with underscore as private scripts
	 */
	public markUnderscoreScriptsAsPrivate: boolean = true;

	/**
	 * Ignore private scripts when generating documentation
	 */
	public ignorePrivate: boolean = true;

	/**
	 * This rule will fail if the script has undocumented scripts
	 */
	public undocumented: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule will fail if the script has a mismatching script
	 * name and "function" JSDoc tags.
	 */
	public mismatchingFunctionName: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule will fail if the script has no description
	 */
	public noDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule will fail if the script has undocumented arguments.
	 * For example, if a script has documentation for 0 arguments, but the GML code uses arguments.
	 */
	public undocumentedArguments: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule will fail if the script has a mismatching number of arguments.
	 * For example, if the scripts has documentation for 4 arguments but the GML code uses 6 arguments.
	 */
	public mismatchingArguments: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule will fail if the script has some argument without description.
	 */
	public noParamDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule will fail if the script has some argument without argument data type.
	 */
	public noParamType: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule should detect and fail if the "description" JSDoc tag has a function
	 * signature instead of the actual function description.
	 * This is because, when you import a GMS1 project into GMS2, the "description"
	 * tag is filled with the function generated signature.
	 */
	public functionSignatureInDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule fails if the script has a return statement
	 * but has not documentation for the returned value
	 */
	public noReturnDescription: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule fails if the script has no data type for the returned value
	 */
	public noReturnType: IValidationRuleConfig = new ValidationRuleConfig(true, true);

	/**
	 * This rule fails if the script has one or more duplicated params names
	 */
	public duplicatedParams: IValidationRuleConfig = new ValidationRuleConfig(true, true);
}

/**
 * Represents the configuration of a single Validation Rule
 */
// tslint:disable-next-line:max-classes-per-file
export class ValidationRuleConfig implements IValidationRuleConfig {
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
