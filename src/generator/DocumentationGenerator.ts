import { inject, injectable } from "inversify";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IDesignFilesCopier from "../renderer/interfaces/IDesignFilesCopier";
import INunjucksRenderer from "../renderer/interfaces/INunjucksRenderer";
import ITemplateLoader from "../template/interfaces/ITemplateLoader";
import { TYPES } from "../types";
import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";
import IDocumentationGenerator from "./interfaces/IDocumentationGenerator";

/**
 * Generates the documentation.
 */
@injectable()
export default class DocumentationGenerator implements IDocumentationGenerator {

	@inject(TYPES.IDocProjectGenerator)
	private _generator: IDocProjectGenerator;

	@inject(TYPES.INunjucksRenderer)
	private _renderer: INunjucksRenderer;

	@inject(TYPES.IDesignFilesCopier)
	private _filesCopier: IDesignFilesCopier;

	@inject(TYPES.ITemplateLoader)
	private _templateLoader: ITemplateLoader;

	/**
	 * Generates the a docProject, loads a template design, and renders the docProject using that design.
	 * @return Promise with the path of the output folder
	 */
	public async generate(project: IGMProject, config: IProjectConfig): Promise<string> {
		const docProject = await this._generator.generate(project, config);
		const templateFolder = await this._templateLoader.getFolder(config.output);
		const template = await this._templateLoader.loadFrom(templateFolder);
		const design = template.findDesign(config.output.design);

		const outFolder = config.output.outputFolder;
		await this._renderer.render(design, docProject, outFolder);
		await this._filesCopier.copy(outFolder, design);
		return outFolder;
	}

}
