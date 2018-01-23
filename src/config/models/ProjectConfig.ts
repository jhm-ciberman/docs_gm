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
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean;

	/**
	 * Rules for validating scripts
	 */
	public scripts: IScriptValidationRule = new ScriptValidationRules();
}
