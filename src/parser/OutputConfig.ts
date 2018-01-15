/**
 * The configuration for a Project. This is the configuration
 * related to the process of generating the documentation for a project.
 */
export default class OutputConfig {

	/**
	 * The design name. If empty, it will use the first design in the designs list.
	 */
	public design: string = "";

	/**
	 * The template name to use
	 */
	public template: string = "basic";

	/**
	 * The glob pattern to use to include files in the project documentation
	 */
	public pattern: string = "**/*";

	/**
	 * The output folder of the documentation
	 */
	public out: string = "./docs/";

	/**
	 * The folder where the templates are located. If empty, the default templates folder will be used
	 */
	public templatesFolder: string = "";

	/**
	 * Mark scripts names starting with underscore as private scripts
	 */
	public markUnderscoreScriptsAsPrivate: boolean = true;

	/**
	 * Ignore private scripts when generating documentation
	 */
	public ignorePrivateScripts: boolean = true;

	/**
	 * Ignore undocumented scripts
	 */
	public ignoreUndocumentedScripts: boolean = true;

	/**
	 * Warn about scripts with no documentation
	 */
	public warnUndocumentedScripts: boolean = true;

	/**
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * Warn about mismatching script name and "function" JSDoc tags.
	 */
	public warnMismatchingFunctionName: boolean = true;

	/**
	 * Warn about scripts with no description
	 */
	public warnNoDescriptionScripts: boolean = true;

	/**
	 * Ignore scripts with no description
	 */
	public ignoreNoDescriptionScripts: boolean = true;

	/**
	 * Warn about scripts with a mismatching number of arguments.
	 * For example, if the scripts has documentation for 4 arguments but the GML code uses 6 arguments.
	 */
	public warnMismatchingArgumentsScripts: boolean = true;

	/**
	 * Ignore scripts with a mismatching number of arguments.
	 * For example, if the scripts has documentation for 4 arguments but the GML code uses 6 arguments.
	 */
	public ignoreMismatchingArgumentsScripts: boolean = false;

	/**
	 * Warn about scripts with undocumented arguments.
	 * For example, if a script has documentation for 0 arguments, but the GML code uses arguments.
	 */
	public warnUndocumentedArgumentsScripts: boolean = true;

	/**
	 * Ignore scripts with undocumented arguments.
	 * For example, if a script has documentation for 0 arguments, but the GML code uses arguments.
	 */
	public ignoreUndocumentedArgumentsScripts: boolean = false;

}
