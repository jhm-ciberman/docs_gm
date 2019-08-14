import { inject, injectable } from "inversify";
import { IOutputConfig, IProjectConfig } from "../config/IProjectConfig";
import DocProject from "../doc_models/DocProject";
import IGMProject from "../gm_project/IGMProject";
import IRenderer from "../renderer/IRenderer";
import RenderingQueueBuilder from "../renderer/RenderingQueueBuilder";
import ITemplateLoader from "../template/ITemplateLoader";
import Template from "../template/Template";
import { TYPES } from "../types";
import IDocFolderGenerator from "./IDocFolderGenerator";
import IDocumentationGenerator from "./IDocumentationGenerator";
import IProjectRootFinder from "./IProjectRootFinder";

/**
 * Generates the documentation.
 */
@injectable()
export default class DocumentationGenerator implements IDocumentationGenerator {

	@inject(TYPES.INunjucksRenderer)
	private _renderer: IRenderer;

	@inject(TYPES.ITemplateLoader)
	private _templateLoader: ITemplateLoader;

	@inject(TYPES.IProjectRootFinder)
	private _projectRootFinder: IProjectRootFinder;

	@inject(TYPES.IDocFolderGenerator)
	private _docFolderGenerator: IDocFolderGenerator;

	/**
	 * Generates the documentation for the given project with the given configuration
	 * @return Promise with the path of the output folder
	 */
	public async generate(project: IGMProject, config: IProjectConfig): Promise<string> {
		const docProject = await this._createDocProject(project, config);
		const design = await this._loadTemplate(config);
		return await this._render(docProject, design, config.output);
	}

	private async _createDocProject(project: IGMProject, config: IProjectConfig): Promise<DocProject> {
		const rootFolder = this._projectRootFinder.find(project, config.root);
		const docProject = new DocProject(config.name || project.name);
		docProject.root = await this._docFolderGenerator.generate(rootFolder, config, project, docProject);
		return docProject;
	}

	private async _loadTemplate(config: IProjectConfig): Promise<Template> {
		const templateFolder = await this._templateLoader.getFolder(config.output);
		return this._templateLoader.loadFrom(templateFolder);
	}

	private async _render(docProject: DocProject, template: Template, outputConfig: IOutputConfig): Promise<string> {
		const builder = new RenderingQueueBuilder(docProject, outputConfig);
		const queue = builder.build();

		await this._renderer.render(template, queue, outputConfig.outputFolder);
		await template.copyFiles(outputConfig.outputFolder);
		return outputConfig.outputFolder;
	}

}
