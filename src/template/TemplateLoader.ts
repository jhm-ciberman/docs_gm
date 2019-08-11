import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as path from "path";
import * as pkgDir from "pkg-dir";
import { IOutputConfig } from "../config/IProjectConfig";
import { TYPES } from "../types";
import IModuleFinder from "./IModuleFinder";
import ITemplateLoader from "./ITemplateLoader";
import ModuleFinderConfig from "./ModuleFinderConfig";
import Template from "./Template";
import { IRoot } from "./TemplateJSON";
/**
 * This class is used to load a Template from disk.
 * It can be installed as an npm module or in a local folder.
 */
@injectable()
export default class TemplateLoader implements ITemplateLoader {

	@inject(TYPES.IModuleFinder)
	private _moduleFinder: IModuleFinder;

	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public async loadFrom(folder: string): Promise<Template> {
		let data: IRoot;
		const jsonPath = path.resolve(folder, "template.json");
		try {
			data = await fse.readJSON(jsonPath);
		} catch (e) {
			throw new Error(`Error loading Template from "${jsonPath}"`);
		}
		return new Template(folder, data);
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
