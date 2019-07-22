
import { inject, injectable } from "inversify";
import pkgDir from "pkg-dir";
import { IGetInstalledPath } from "../npmmodules";
import { TYPES } from "../types";
import IModuleFinder from "./interfaces/IModuleFinder";

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
	public async find(moduleName: string): Promise<string> {
		return this._findGlobalModule(moduleName)
			.catch(() => this._findLocal(moduleName))
			.catch(() => Promise.reject(new Error(`Cannot find the module "${moduleName}"`)));
	}

	protected async _findLocal(moduleName: string) {
		const packageRoot = await pkgDir() as string;
		return this._findBundledModule(moduleName, packageRoot )
			.catch(() => this._findLocalModule(moduleName, packageRoot));
	}

	protected async _findGlobalModule(moduleName: string): Promise<string> {
		return await this._getInstalledPath(moduleName);
	}

	protected async _findLocalModule(moduleName: string, packageRoot: string): Promise<string> {
		return await this._getInstalledPath(moduleName, { local: true, cwd: packageRoot });
	}

	protected async _findBundledModule(moduleName: string, packageRoot: string): Promise<string> {
		return await this._getInstalledPath(moduleName, { cwd: packageRoot + "/templates/" });
	}
}
