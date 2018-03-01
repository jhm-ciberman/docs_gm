import * as fse from "fs-extra";
import { inject, injectable, interfaces } from "inversify";
import * as path from "path";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import { TYPES } from "../types";
import IConfigManager from "./IConfigManager";

/**
 * This class exports and loads the configuration
 */
@injectable()
export default class ConfigManager implements IConfigManager {

	/**
	 * The Project Config
	 */
	@inject(TYPES.NewableOfIProjectConfig)
	private _ProjectConfig: interfaces.Newable<IProjectConfig>;

	/**
	 * Copy the docs_gm.json file to the specified outputPath.
	 * @param outputPath The output filepath
	 * @returns A promise with the path of the output file
	 */
	public async exportConfig(outputPath: string): Promise<string> {
		outputPath = path.resolve(outputPath, "docs_gm.json");
		await fse.writeJSON(outputPath, new this._ProjectConfig(), {
			spaces: "\t",
		});
		return outputPath;
	}

	/**
	 * Loads the OutputConfig configuration object from a docs_gm.json file.
	 * You can provide a path to a json file to be loaded or to a GameMaker
	 * project directory. It returns null if the file does not exists, and fails the promise
	 * if the file is badly formated.
	 * @param jsonOrProjectPath The path to the JSON file or to the GameMaker project
	 * @returns A promise with the created OutputConfig object or null if the file does not exists
	 */
	public async loadConfig(jsonOrProjectPath: string): Promise<IProjectConfig | undefined> {
		let jsonPath: string;
		if (path.extname(jsonOrProjectPath) === ".json") {
			jsonPath = path.resolve(jsonOrProjectPath);
		} else {
			jsonPath = path.resolve(jsonOrProjectPath, "datafiles/docs_gm.json");
		}
		try {
			const data: IProjectConfig = await fse.readJSON(jsonPath);
			const config: IProjectConfig = new this._ProjectConfig();
			return Object.assign(config, data);
		} catch (e) {
			return undefined;
		}
	}
}
