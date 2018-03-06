import * as path from "path";

import { inject, injectable } from "inversify";
import { TYPES } from "../types";

import IOutputConfig from "../config/interfaces/IOutputConfig";
import Design from "./entities/Design";
import IDesignLoader from "./interfaces/IDesignLoader";
import IModuleFinder from "./interfaces/IModuleFinder";
import ITemplateLoader from "./interfaces/ITemplateLoader";

/**
 * This class loads a template and then a design from inside that template
 */
@injectable()
export default class DesignLoader implements IDesignLoader {
	/**
	 * The module finder
	 */
	@inject(TYPES.IModuleFinder)
	private _moduleFinder: IModuleFinder;

	/**
	 * The template loader
	 */
	@inject(TYPES.ITemplateLoader)
	private _templateLoader: ITemplateLoader;

	/**
	 * Loads the template
	 */
	public async load(output: IOutputConfig): Promise<Design> {
		const folder = await this._getFolder(output);
		const template = await this._templateLoader.loadFrom(folder);
		const designName = output.design;
		if (designName && !template.hasDesign(designName)) {
			throw new Error(`Design "${designName}" not found`);
		}
		return template.getDesign(designName) || template.defaultDesign;
	}

	/**
	 * Returns the folder of the template to load
	 * @param output The output config
	 */
	private async _getFolder(output: IOutputConfig): Promise<string> {
		if (output.templatesFolder !== "") {
			return path.resolve(output.templatesFolder, output.template);
		} else {
			return await this._moduleFinder.find("docs_gm-" + output.template);
		}
	}
}
