import open = require("open");
import * as path from "path";

import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

import ProjectConfig from "../config/entities/ProjectConfig";
import IConfigManager from "../config/interfaces/IConfigManager";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import IDocumentationGenerator from "../generator/interfaces/IDocumentationGenerator";
import IGMProjectLoader from "../gm_project/interfaces/IGMProjectLoader";
import IReporter from "../reporter/interfaces/IReporter";
import ICliGenerateFacade from "./interfaces/ICliGenerateFacade.d";

/**
 * A facade class to manage all the basic process of the ComandLine
 */
@injectable()
export default class CliGenerateFacade implements ICliGenerateFacade {

	/**
	 * Open method (used for dependency injection)
	 */
	public open: (url: string) => void = open;

	/**
	 * The overridden design
	 */
	public design: string | undefined;

	/**
	 * The overridden template
	 */
	public template: string | undefined;

	/**
	 * The overridden outputFolder
	 */
	public outputFolder: string | undefined;

	/**
	 * The overridden pattern
	 */
	public pattern: string | undefined;

	/**
	 * The reporter used (used for dependency injection)
	 */
	@inject(TYPES.IReporter)
	private _reporter: IReporter;

	/**
	 * The GMProjectLoader
	 */
	@inject(TYPES.IGMProjectLoader)
	private _loader: IGMProjectLoader;

	/**
	 * The config manager
	 */
	@inject(TYPES.IConfigManager)
	private _configManager: IConfigManager;

	/**
	 * The documentation generator
	 */
	@inject(TYPES.IDocumentationGenerator)
	private _documentationGenerator: IDocumentationGenerator;

	/**
	 * Generates the documentation for a given project
	 * @param projectPath The path to the project
	 * @param opts The option object to override
	 */
	public async generate(projectPath: string = "."): Promise<void> {

		this._reporter.info("Loading Project...");

		const project = await this._loader.load(projectPath);

		this._reporter.info("Loading project configuration...");

		let config = await this._configManager.loadConfig(projectPath);

		if (!config) {
			this._reporter.info("Configuration not found. Using default configuration.");
			config = new ProjectConfig();
		}
		config = this._overrideConfig(config);

		this._reporter.info("Generating documentation... ");
		const outFolder = await this._documentationGenerator.generate(project, config);

		this._reporter.info("Ready!");

		const url = path.resolve(outFolder, "index.html");
		this._reporter.info(`Opening ${url}`);
		this.open(url);
	}

	/**
	 * Overrides the configuration with the local values
	 * @param config The config
	 */
	private _overrideConfig(config: IProjectConfig): IProjectConfig {
		if (this.design) {
			config.output.design = this.design;
		}
		if (this.template) {
			config.output.template = this.template;
		}
		if (this.outputFolder) {
			config.output.outputFolder = this.outputFolder;
		}
		if (this.pattern) {
			config.output.pattern = this.pattern;
		}
		return config;
	}
}
