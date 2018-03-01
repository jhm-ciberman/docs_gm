import open = require("open");
import * as path from "path";

import { inject, injectable, interfaces } from "inversify";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import { TYPES } from "../types";

import IConfigManager from "../config/interfaces/IConfigManager";
import DocumentationGenerator from "../generator/DocumentationGenerator";
import ProjectLoader from "../gm_project/ProjectLoader";
import container from "../inversify.config";
import IReporter from "../reporter/interfaces/IReporter";
import ReporterManager from "../reporter/ReporterManager";
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
	 * The reporter used (used for dependency injection)
	 */
	public reporter: IReporter = ReporterManager.reporter;

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
	 * The constructor for IProjectConfig
	 */
	@inject(TYPES.NewableOfIProjectConfig)
	private _ProjectConfig: interfaces.Newable<IProjectConfig>;

	/**
	 * Generates the documentation for a given project
	 * @param projectPath The path to the project
	 * @param opts The option object to override
	 */
	public async generate(projectPath: string = "."): Promise<void> {

		this.reporter.info("Loading Project...");

		const loader = new ProjectLoader(projectPath);
		const project = await loader.load();

		this.reporter.info("Loading project configuration...");

		const configManager = container.get<IConfigManager>(TYPES.IConfigManager);
		let config = await configManager.loadConfig(projectPath);

		if (!config) {
			this.reporter.info("Configuration not found. Using default configuration.");
			config = new this._ProjectConfig();
		}
		config = this._overrideConfig(config);

		this.reporter.info("Generating documentation... ");
		const docsGenerator = new DocumentationGenerator();
		const outFolder = await docsGenerator.generate(project, config);

		this.reporter.info("Ready!");

		const url = path.resolve(outFolder, "index.html");
		this.reporter.info(`Opening ${url}`);
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
