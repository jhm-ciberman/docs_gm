import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import IProjectConfig from "../config/interfaces/IProjectConfig";
import IGMProject from "../gm_project/interfaces/IGMProject";
import IDesignLoader from "../template/interfaces/IDesignLoader";
import IDesignRenderer from "../template/interfaces/IDesignRenderer";
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
	 * The design renderer
	 */
	@inject(TYPES.IDesignRenderer)
	private _designRenderer: IDesignRenderer;

	/**
	 * The design loader
	 */
	@inject(TYPES.IDesignLoader)
	private _designLoader: IDesignLoader;

	/**
	 * Generates the a docProject, loads a template design, and renders the docProject using that design.
	 * @return Promise with the path of the output folder
	 */
	public async generate(project: IGMProject, config: IProjectConfig): Promise<string> {
		const docProject = await this._generator.generate(project, config);
		const design = await this._designLoader.load(config.output);
		return await this._designRenderer.render(design, docProject, config.output.outputFolder);
	}

}
