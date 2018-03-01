import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

import IOutputConfig from "./interfaces/IOutputConfig";
import IProjectConfig from "./interfaces/IProjectConfig";
import IScriptValidationRule from "./interfaces/IScriptValidationRules";
import ScriptValidationRules from "./ScriptValidationRules";

/**
 * This interface represents the docs_gm configuration for a single Game Maker Project.
 */
@injectable()
export default class ProjectConfig implements IProjectConfig {

	/**
	 * The output configuration
	 */
	@inject(TYPES.IOutputConfig)
	public output: IOutputConfig;

	/**
	 * Warn about unrecognized JSDoc tags
	 */
	public warnUnrecognizedTags: boolean = true;

	/**
	 * Rules for validating scripts
	 */
	public scripts: IScriptValidationRule = new ScriptValidationRules();
}
