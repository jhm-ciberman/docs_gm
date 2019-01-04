import { injectable } from "inversify";
import ICliParamsConfig from "./interfaces/ICliParamsConfig";
import IProjectConfig from "./interfaces/IProjectConfig";

@injectable()
export default class ConfigOverrider {
	/**
	 * Overrides the configuration with the local values
	 * @param config The config
	 */
	public override(config: IProjectConfig, overrideConfig: ICliParamsConfig): IProjectConfig {
		if (overrideConfig.design) {
			config.output.design = overrideConfig.design;
		}
		if (overrideConfig.template) {
			config.output.template = overrideConfig.template;
		}
		if (overrideConfig.outputFolder) {
			config.output.outputFolder = overrideConfig.outputFolder;
		}
		if (overrideConfig.pattern) {
			config.pattern = overrideConfig.pattern;
		}
		if (overrideConfig.root) {
			config.root = overrideConfig.root;
		}
		return config;
	}
}
