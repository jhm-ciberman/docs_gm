import * as path from "path";

import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import * as os from "os";
import ProjectConfig from "../config/entities/ProjectConfig";
import IConfigManager from "../config/interfaces/IConfigManager";
import IConfigOverrider from "../config/interfaces/IConfigOverrider";
import IDocumentationGenerator from "../generator/interfaces/IDocumentationGenerator";
import IGMProjectLoader from "../gm_project/interfaces/IGMProjectLoader";
import { IOpen } from "../npmmodules";
import IReporter from "../reporter/interfaces/IReporter";
import ICliGenerateFacade from "./interfaces/ICliGenerateFacade.d";

/**
 * A facade class to manage all the basic process of the ComandLine
 */
@injectable()
export default class CliGenerateFacade implements ICliGenerateFacade {

	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	@inject(TYPES.IGMProjectLoader)
	private _loader: IGMProjectLoader;

	@inject(TYPES.IConfigManager)
	private _configManager: IConfigManager;

	@inject(TYPES.IDocumentationGenerator)
	private _documentationGenerator: IDocumentationGenerator;

	@inject(TYPES.IConfigOverrider)
	private _configOverrider: IConfigOverrider;

	@inject(TYPES.IOpen)
	private _open: IOpen;

	/**
	 * Generates the documentation for a given project
	 * @param projectPath The path to the project
	 * @param overrideConfig An object with the new configuration
	 * @param opts The option object to override
	 */
	public async generate(projectPath: string = ".", overrideConfig: { [key: string]: string } = {}): Promise<void> {

		this._reporter.info("Loading Project...");

		const project = await this._loader.load(projectPath);

		this._reporter.info("Loading project configuration...");

		let config = await this._configManager.loadConfig(projectPath);

		if (!config) {
			this._reporter.info("Configuration not found. Using default configuration.");
			config = new ProjectConfig();
		}
		config = this._configOverrider.override(config, overrideConfig);

		this._reporter.info("Generating documentation... ");
		const outFolder = await this._documentationGenerator.generate(project, config);

		this._reporter.info("Ready!");

		const url = path.resolve(outFolder, "index.html");

		if (overrideConfig.noOpen) {
			this._reporter.info(`Documentation generated at: ${url}`);
		} else {
			this._reporter.info(`Opening: ${url}`);
			this._open(url);
		}

	}

	public async init(): Promise<string> {
		return this._configManager.exportConfig(os.homedir());
	}

}
