import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as path from "path";
import { IOutputConfig } from "../config/IProjectConfig";
import { IPkgDir } from "../npmmodules";
import SchemaValidator from "../SchemaValidator";
import { TYPES } from "../types";
import IModuleFinder from "./IModuleFinder";
import ITemplateLoader from "./ITemplateLoader";
import ModuleFinderConfig from "./ModuleFinderConfig";
import Template from "./Template";
import { IRoot } from "./TemplateJSON";

import schema = require("../schema/template.json");

/**
 * This class is used to load a Template from disk.
 * It can be installed as an npm module or in a local folder.
 */
@injectable()
export default class TemplateLoader implements ITemplateLoader {

	@inject(TYPES.IModuleFinder)
	private _moduleFinder: IModuleFinder;

	@inject(TYPES.IPkgDir)
	private _pkgDir: IPkgDir;

	@inject(TYPES.ISchemaValidator)
	private _schemaValidator: SchemaValidator;

	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public async loadFrom(folder: string): Promise<Template> {
		const jsonPath = path.resolve(folder, "template.json");

		const data: IRoot = JSON.parse(await this._loadString(jsonPath));

		this._schemaValidator.validate(data, schema);

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
		const packageRoot = await this._pkgDir(__dirname);
		if (!packageRoot) {
			throw new Error("Cannot determine package root");
		}

		const config = new ModuleFinderConfig();
		config.packageRoot = packageRoot;
		config.templatesPath = config.packageRoot + "/templates/";
		return config;
	}

	protected async _loadString(p: string) {
		try {
			return await fse.readFile(p, "utf8");
		} catch (e) {
			throw new Error(`Error loading Template from "${p}"`);
		}
	}
}
