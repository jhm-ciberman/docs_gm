import * as path from "path";
import ConfigManager from "../config/ConfigManager";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import ProjectConfig from "../config/models/ProjectConfig";
import DocsGM from "../core/DocsGM";
import ProjectLoader from "../gm_project/ProjectLoader";
import ReporterManager from "../reporter/ReporterManager";

/**
 * A facade class to manage all the basic process of the ComandLine
 */
export default class CliGenerateFacade {

	/**
	 * The overriten design
	 */
	public design: string | undefined;

	/**
	 * The overriten template
	 */
	public template: string | undefined;

	/**
	 * The overriten outputFolder
	 */
	public outputFolder: string | undefined;

	/**
	 * The overriten pattern
	 */
	public pattern: string | undefined;

	/**
	 * Generates the documentation for a given project
	 * @param projectPath The path to the project
	 * @param opts The option object to override
	 */
	public async generate(projectPath: string = ".") {

		ReporterManager.reporter.info("Loading Project...");

		const loader = new ProjectLoader(projectPath);
		const project = await loader.load();

		ReporterManager.reporter.info("Loading project configuration...");

		const configManager = new ConfigManager();
		let config = await configManager.loadConfig(projectPath);

		if (!config) {
			ReporterManager.reporter.info("Configuration not found. Ussing default configuration.");
			config = new ProjectConfig();
		}
		config = this._overrideConfig(config);

		ReporterManager.reporter.info("Generating documentation... ");
		const docsGM = new DocsGM();
		const outFolder = await docsGM.generate(project, config);

		ReporterManager.reporter.info("Ready!");

		const url = path.resolve(outFolder, "index.html");
		ReporterManager.reporter.info(`Opening ${url}`);
		open(url);
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
