import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as path from "path";
import * as pkgDir from "pkg-dir";
import IOutputConfig from "../config/IOutputConfig";
import { TYPES } from "../types";
import IModuleFinder from "./IModuleFinder";
import { ITemplate } from "./ITemplate";
import ITemplateFactory from "./ITemplateFactory";
import ITemplateLoader from "./ITemplateLoader";
import ModuleFinderConfig from "./ModuleFinderConfig";
import { IRoot } from "./TemplateJSON";
/**
 * This class is used to load a Template from disk.
 * It can be installed as an npm module or in a local folder.
 */
@injectable()
export default class TemplateLoader implements ITemplateLoader {

	@inject(TYPES.ITemplateFactory)
	private _templateFactory: ITemplateFactory;

	@inject(TYPES.IModuleFinder)
	private _moduleFinder: IModuleFinder;

	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public async loadFrom(folder: string): Promise<ITemplate> {
		let data: IRoot;
		const jsonPath = path.resolve(folder, "template.json");
		try {
			data = await fse.readJSON(jsonPath);
		} catch (e) {
			throw new Error(`Error loading Template from "${jsonPath}"`);
		}
		return this._templateFactory.create(folder, data);
	}

	/**
	 * Returns the folder of the template to load
	 * @param output The output config
	 */
	public async getFolder(output: IOutputConfig): Promise<string> {
		if (output.templatesFolder !== "") {
			return path.resolve(output.templatesFolder, output.template);
		} else {
			return await this._moduleFinder.find("docs_gm-" + output.template, await this._createConfig());
		}
	}

	protected async _createConfig() {
		const config = new ModuleFinderConfig();
		config.packageRoot = await pkgDir() as string;
		config.templatesPath = config.packageRoot + "/templates/";
		return config;
	}

}
