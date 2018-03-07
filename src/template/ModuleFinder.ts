
import { inject, injectable } from "inversify";
import pkgDir = require("pkg-dir");
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
		try {
			return await this._getInstalledPath(moduleName);
		} catch (e) {
			try {
				const cwd = await pkgDir() as string;
				return await this._getInstalledPath(moduleName, { local: true, cwd });
			} catch (e) {
				throw new Error(`Cannot find the module ${moduleName}`);
			}
		}
	}
}
