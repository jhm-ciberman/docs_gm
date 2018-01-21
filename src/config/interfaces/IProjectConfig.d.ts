import IOutputConfig from "./IOutputConfig";
import IScriptValidationRules from "./IScriptValidationRules";

/**
 * This interface represents the docs_gm configuration for a single Game Maker Project.
 */
export default interface IProjectConfig {
	/**
	 * The output configuration
	 */
	output: IOutputConfig;

	/**
	 * Warn about unrecognized JSDoc tags
	 */
	warnUnrecognizedTags: boolean;

	/**
	 * Rules for validating scripts
	 */
	scripts: IScriptValidationRules;
}
