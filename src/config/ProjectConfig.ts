import OutputConfig from "./OutputConfig";
import ScriptValidationRules from "./ScriptValidationRules";

/**
 * This class represents the docs_gm configuration for a single Game Maker Project.
 */
export default class ProjectConfig {
	/**
	 * The output configuration
	 */
	public output: OutputConfig = new OutputConfig();

	/**
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * Rules for validating scripts
	 */
	public scripts: ScriptValidationRules = new ScriptValidationRules();
}
