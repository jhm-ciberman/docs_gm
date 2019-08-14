import { inject, injectable } from "inversify";

import * as fse from "fs-extra";
import * as path from "path";
import SchemaValidator from "../SchemaValidator";
import { TYPES } from "../types";
import IConfigManager from "./IConfigManager";
import { IProjectConfig } from "./IProjectConfig";
import { ProjectConfig } from "./ProjectConfig";

import schema = require("../../schema/docs_gm.json");

/**
 * This class exports and loads the configuration
 */
@injectable()
export default class ConfigManager implements IConfigManager {

	@inject(TYPES.ISchemaValidator)
	private _schemaValidator: SchemaValidator;

	/**
	 * Copy the docs_gm.json file to the specified outputPath.
	 * @param outputPath The output filepath
	 * @returns A promise with the path of the output file
	 */
	public async exportConfig(outputPath: string): Promise<string> {
		outputPath = path.resolve(outputPath, "docs_gm.json");
		const config = new ProjectConfig();
		config.name = "Your project name";
		await fse.writeJSON(outputPath, config, {
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

		const str = await this._loadString(jsonPath);
		if (str === undefined) {
			return;
		}
		const data: IProjectConfig = JSON.parse(str);

		this._schemaValidator.validate(data, schema);

		const config: IProjectConfig = new ProjectConfig();
		return Object.assign(config, data);

	}

	private async _loadString(p: string) {
		try {
			return await fse.readFile(p, "utf8");
		} catch (e) {
			return undefined;
		}
	}
}
