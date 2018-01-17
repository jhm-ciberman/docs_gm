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
	public static depend = {
		getInstalledPath,
	};

	/**
	 * Loads a template
	 * @param name Template name
	 * @param templatesFolder If pased, it will try to load the template from this folder
	 * @param outputConfig
	 */
	public static async loadTemplate(name: string, templatesFolder: string = ""): Promise<Template> {
		const moduleName = "docs_gm-" + name;
		let folder;
		if (templatesFolder !== "") {
			folder = await this._getModulePath(moduleName);
		} else {
			folder = path.resolve(templatesFolder, moduleName);
		}
		const template = await Template.loadFrom(folder);
		return template;
	}

	/**
	 * Gets the path of a module from a global instalation or local instalation.
	 * @param moduleName The name of the module to load
	 * @param folder The folder to look for the module if the module is not located in global or local node_modules
	 */
	private static async _getModulePath(moduleName: string): Promise<string> {
		try {
			return await this.depend.getInstalledPath(moduleName);
		} catch (e) {
			try {
				return await this.depend.getInstalledPath(moduleName, { local: true, cwd: __dirname + "./../" });
			} catch (e) {
				throw new Error(`Cannot find the module ${moduleName}`);
			}
		}
	}
}
