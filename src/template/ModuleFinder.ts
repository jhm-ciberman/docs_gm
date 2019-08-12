
import * as fse from "fs-extra";
import { inject, injectable } from "inversify";
import * as path from "path";
import { IGetInstalledPath } from "../npmmodules";
import { TYPES } from "../types";
import IModuleFinder from "./IModuleFinder";
import ModuleFinderConfig from "./ModuleFinderConfig";

/**
 * Finds a module installed locally or globally and returns his path
 */
@injectable()
export default class ModuleFinder implements IModuleFinder {

	/**
	 * The "getInstalledPath" npm module
	 */
	@inject(TYPES.IGetInstalledPath)
	private _getInstalledPath: IGetInstalledPath;

	/**
	 * Gets the path of a template npm module from a global installation or local installation.
	 * @param templateName The name of the template to find
	 */
	public async find(moduleName: string, moduleFinderConfig: ModuleFinderConfig): Promise<string> {
		return this._findLocal(moduleName, moduleFinderConfig)
			.catch(() => this._findGlobalModule(moduleName))
			.catch(() => Promise.reject(new Error(`Cannot find the module "${moduleName}"`)));
	}

	protected async _findLocal(moduleName: string, moduleFinderConfig: ModuleFinderConfig) {
		return this._findBundledModule(moduleName, moduleFinderConfig.templatesPath)
			.catch(() => this._findLocalModule(moduleName, moduleFinderConfig.packageRoot));
	}

	protected async _findGlobalModule(moduleName: string): Promise<string> {
		return await this._getInstalledPath(moduleName);
	}

	protected async _findLocalModule(moduleName: string, packageRoot: string): Promise<string> {
		return await this._getInstalledPath(moduleName, { local: true, cwd: packageRoot });
	}

	protected async _findBundledModule(moduleName: string, templatesPath: string): Promise<string> {
		const templatePath = path.resolve(templatesPath, moduleName);
		return new Promise((resolve, reject) => {
			fse.access(path.resolve(templatePath, "package.json"), (err) => {
				if (err) {
					console.log(err);
					reject();
				} else {
					resolve(templatePath);
				}
			});
		});
	}
}
