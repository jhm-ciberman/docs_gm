import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IDesignFilesCopier from "../renderer/interfaces/IDesignFilesCopier";
import INunjucksRenderer from "../renderer/interfaces/INunjucksRenderer";
import IDesignLoader from "../template/interfaces/IDesignLoader";
import IDocProjectGenerator from "./interfaces/IDocProjectGenerator";
import IDocumentationGenerator from "./interfaces/IDocumentationGenerator";

/**
 * Generates the documentation.
 */
@injectable()
export default class DocumentationGenerator implements IDocumentationGenerator {

	@inject(TYPES.IDocProjectGenerator)
	private _generator: IDocProjectGenerator;

	@inject(TYPES.IDesignLoader)
	private _designLoader: IDesignLoader;

	@inject(TYPES.INunjucksRenderer)
	private _renderer: INunjucksRenderer;

	@inject(TYPES.IDesignFilesCopier)
	private _filesCopier: IDesignFilesCopier;

	/**
	 * Generates the a docProject, loads a template design, and renders the docProject using that design.
	 * @return Promise with the path of the output folder
	 */
	public async generate(project: IGMProject, config: IProjectConfig): Promise<string> {
		const docProject = await this._generator.generate(project, config);
		const design = await this._designLoader.load(config.output);
		const folder = config.output.outputFolder;
		await this._renderer.render(design, docProject, folder);
		await this._filesCopier.copy(folder, design);
		return folder;
	}

}
