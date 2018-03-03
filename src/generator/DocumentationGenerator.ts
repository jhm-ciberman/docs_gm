import { inject, injectable } from "inversify";
import { TYPES } from "../../types";

import * as path from "path";

import IOutputConfig from "../config/interfaces/IOutputConfig";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";

import ProjectConfig from "../config/entities/ProjectConfig";
import IDesignRenderer from "../template/interfaces/IDesignRenderer";
import IModuleFinder from "../template/interfaces/IModuleFinder";
import ITemplateLoader from "../template/interfaces/ITemplateLoader";
import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";
import IDocumentationGenerator from "./interfaces/IDocumentationGenerator";

/**
 * Generates the documentation.
 */
@injectable()
export default class DocumentationGenerator implements IDocumentationGenerator {

	/**
	 * The doc project generator
	 */
	@inject(TYPES.IDocProjectGenerator)
	private _generator: IDocProjectGenerator;

	/**
	 * The module finder
	 */
	@inject(TYPES.IModuleFinder)
	private _moduleFinder: IModuleFinder;

	/**
	 * The design renderer
	 */
	@inject(TYPES.IDesignRenderer)
	private _designRenderer: IDesignRenderer;

	/**
	 * The template loader
	 */
	@inject(TYPES.ITemplateLoader)
	private _templateLoader: ITemplateLoader;

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
		const design = template.getDesign(config.output.design) || template.defaultDesign;
		await this._designRenderer.render(design, docProject, outputFolder);
		return outputFolder;
	}

	/**
	 * Loads the template
	 */
	private async _loadTemplate(output: IOutputConfig) {
		let folder;
		if (output.templatesFolder !== "") {
			folder = path.resolve(output.templatesFolder, output.template);
		} else {
			folder = await this._moduleFinder.find("docs_gm-" + output.template);
		}
		return await this._templateLoader.loadFrom(folder);
	}
}
