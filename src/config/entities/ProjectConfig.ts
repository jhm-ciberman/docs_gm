import IOutputConfig from "../interfaces/IOutputConfig";
import IProjectConfig from "../interfaces/IProjectConfig";
import IScriptValidationRule from "../interfaces/IScriptValidationRules";
import OutputConfig from "./OutputConfig";
import ScriptValidationRules from "./ScriptValidationRules";

/**
 * This interface represents the docs_gm configuration for a single Game Maker Project.
 */
export default class ProjectConfig implements IProjectConfig {

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
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * Rules for validating scripts
	 */
	public scripts: IScriptValidationRule = new ScriptValidationRules();
}
