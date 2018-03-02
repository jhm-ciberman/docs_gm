import { inject } from "inversify";
import { TYPES } from "../../types";

import * as path from "path";

import IOutputConfig from "../config/interfaces/IOutputConfig";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";

import ProjectConfig from "../config/ProjectConfig";
import TemplateLoader from "../template/TemplateLoader";
import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";

/**
 * Generates the documentation.
 */
export default class DocumentationGenerator {

	/**
	 * The project config
	 */
	@inject(TYPES.IDocProjectGenerator)
	private _generator: IDocProjectGenerator;

	/**
	 * Generates the documentation files for the project.
	 * @return Promise with the path of the output folder
	 */
	public async generate(project: IGMProject, config?: IProjectConfig): Promise<string> {
		config = config || new ProjectConfig();
		const docProject = await this._generator.generate(project, config);
		const template = await this._loadTemplate(config.output);
		const designName = config.output.design;
		if (designName && !template.hasDesign(designName)) {
			throw new Error(`Design "${designName}" not found`);
		}
		const outputFolder = config.output.outputFolder;
		const design = template.getDesign(config.output.design);
		await design.renderPages(outputFolder, docProject);
		await design.copyFiles(outputFolder);

		return outputFolder;
	}

	/**
	 * Loads the template
	 */
	private async _loadTemplate(output: IOutputConfig) {
		const templateLoader = new TemplateLoader();
		let folder;
		if (output.templatesFolder !== "") {
			folder = path.resolve(output.templatesFolder, output.template);
		} else {
			folder = await templateLoader.getTemplateModulePath(output.template);
		}
		return await templateLoader.loadFrom(folder);
	}
}
