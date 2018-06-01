import { inject, injectable } from "inversify";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocProject from "../doc_models/DocProject";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IDesignFilesCopier from "../renderer/interfaces/IDesignFilesCopier";
import INunjucksRenderer from "../renderer/interfaces/INunjucksRenderer";
import Design from "../template/Design";
import ITemplateLoader from "../template/interfaces/ITemplateLoader";
import { TYPES } from "../types";
import IDocFolderGenerator from "./interfaces/IDocFolderGenerator";
import IDocumentationGenerator from "./interfaces/IDocumentationGenerator";
import IProjectRootFinder from "./interfaces/IProjectRootFinder";

/**
 * Generates the documentation.
 */
@injectable()
export default class DocumentationGenerator implements IDocumentationGenerator {

	@inject(TYPES.INunjucksRenderer)
	private _renderer: INunjucksRenderer;

	@inject(TYPES.IDesignFilesCopier)
	private _filesCopier: IDesignFilesCopier;

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
		const design = await this._loadDesign(config);
		return await this._render(docProject, design, config.output.outputFolder);
	}

	private async _createDocProject(project: IGMProject, config: IProjectConfig): Promise<DocProject> {
		const rootFolder = this._projectRootFinder.find(project, config.root);
		const docProject = new DocProject(project.name);
		docProject.root = await this._docFolderGenerator.generate(rootFolder, config, project);
		return docProject;
	}

	private async _loadDesign(config: IProjectConfig): Promise<Design> {
		const templateFolder = await this._templateLoader.getFolder(config.output);
		const template = await this._templateLoader.loadFrom(templateFolder);
		return template.findDesign(config.output.design);
	}

	private async _render(docProject: DocProject, design: Design, outFolder: string): Promise<string> {
		await this._renderer.render(design, docProject, outFolder);
		await this._filesCopier.copy(outFolder, design);
		return outFolder;
	}

}
