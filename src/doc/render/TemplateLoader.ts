import * as fse from "fs-extra";
import { getInstalledPath } from "get-installed-path";
import * as path from "path";
import Template from "./Template";

/**
 * This class is used to load a Template from disk.
 * It can be installed as an npm module or in a local folder.
 */
export default class TemplateLoader {
	/**
	 * Used for dependency injection
	 */
	public getInstalledPath: (name: string, opts?: GetInstalledPath.Options) => Promise<string> = getInstalledPath;

	/**
	 * Factory method to load the template from a folder
	 * @param folder The folder name
	 * @returns A promise
	 */
	public async loadFrom(folder: string): Promise<Template> {
		let data: any;
		const jsonPath = path.resolve(folder, "template.json");
		try {
			data = await fse.readJSON(jsonPath);
		} catch (e) {
			throw new Error(`Error loading Template from "${jsonPath}"`);
		}
		return Template.create(data, folder);
	}

	/**
	 * Gets the path of a template npm module from a global instalation or local instalation.
	 * @param templateName The name of the template to find
	 */
	public async getTemplateModulePath(templateName: string): Promise<string> {
		const moduleName = "docs_gm-" + templateName;
		try {
			return await this.getInstalledPath(moduleName);
		} catch (e) {
			try {
				return await this.getInstalledPath(moduleName, { local: true /*, cwd: __dirname + "./../"*/ });
			} catch (e) {
				throw new Error(`Cannot find the module ${moduleName}`);
			}
		}
	}
}
