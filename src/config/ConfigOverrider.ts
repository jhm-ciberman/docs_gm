import { injectable } from "inversify";
import ICliParamsConfig from "./ICliParamsConfig";
import { IProjectConfig } from "./IProjectConfig";

@injectable()
export default class ConfigOverrider {
	/**
	 * Overrides the configuration with the local values
	 * @param config The config
	 */
	public override(config: IProjectConfig, overrideConfig: ICliParamsConfig): IProjectConfig {
		if (overrideConfig.template !== undefined) {
			config.output.template = overrideConfig.template;
		}
		if (overrideConfig.outputFolder !== undefined) {
			config.output.outputFolder = overrideConfig.outputFolder;
		}
		if (overrideConfig.pattern !== undefined) {
			config.pattern = overrideConfig.pattern;
		}
		if (overrideConfig.root !== undefined) {
			config.root = overrideConfig.root;
		}
		if (overrideConfig.folderPages !== undefined) {
			config.output.folderPages = overrideConfig.folderPages;
		}
		if (overrideConfig.scriptPages !== undefined) {
			config.output.scriptPages = overrideConfig.scriptPages;
		}
		return config;
	}
}
