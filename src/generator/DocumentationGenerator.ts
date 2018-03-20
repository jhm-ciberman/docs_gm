import { inject, injectable } from "inversify";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import DocProject from "../doc_models/DocProject";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IDesignFilesCopier from "../renderer/interfaces/IDesignFilesCopier";
import INunjucksRenderer from "../renderer/interfaces/INunjucksRenderer";
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
	 * Generates the a docProject, loads a template design, and renders the docProject using that design.
	 * @return Promise with the path of the output folder
	 */
	public async generate(project: IGMProject, config: IProjectConfig): Promise<string> {

		const docProject = new DocProject(project.name);
		const rootFolder = this._projectRootFinder.find(project, config.root);
		docProject.root = await this._docFolderGenerator.generate(rootFolder, config, project);

		const templateFolder = await this._templateLoader.getFolder(config.output);
		const template = await this._templateLoader.loadFrom(templateFolder);
		const design = template.findDesign(config.output.design);

		const outFolder = config.output.outputFolder;
		await this._renderer.render(design, docProject, outFolder);
		await this._filesCopier.copy(outFolder, design);
		return outFolder;
	}

}
