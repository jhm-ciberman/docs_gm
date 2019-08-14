import { injectable } from "inversify";
import ICliParamsConfig from "./ICliParamsConfig";
import { IProjectConfig, IOutputConfig } from "./IProjectConfig";

@injectable()
export default class ConfigOverrider {
	/**
	 * Overrides the configuration with the local values
	 * @param config The config
	 */
	public override(config: IProjectConfig, overrideConfig: ICliParamsConfig): IProjectConfig {

		this._overrideOutputConfig(config.output, overrideConfig);

		if (overrideConfig.pattern !== undefined) {
			config.pattern = overrideConfig.pattern;
		}
		if (overrideConfig.root !== undefined) {
			config.root = overrideConfig.root;
		}

		return config;
	}

	private _overrideOutputConfig(output: IOutputConfig, overrideConfig: ICliParamsConfig): void {
		if (overrideConfig.template !== undefined) {
			output.template = overrideConfig.template;
		}
		if (overrideConfig.outputFolder !== undefined) {
			output.outputFolder = overrideConfig.outputFolder;
		}
		if (overrideConfig.folderPages !== undefined) {
			output.folderPages = overrideConfig.folderPages;
		}
		if (overrideConfig.scriptPages !== undefined) {
			output.scriptPages = overrideConfig.scriptPages;
		}
	}
}
