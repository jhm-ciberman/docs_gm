import * as fse from "fs-extra";
import * as JSON5 from "json5";
import * as os from "os";
import * as path from "path";
import IProjectConfig from "../config/interfaces/IProjectConfig";
import ProjectConfig from "../config/models/ProjectConfig";

export default class ConfigManager {
	/**
	 * Copy the docs_gm.json file to the specified outputPath.
	 * If no path is provided, the user directory is used.
	 * @param outputPath The output filepath
	 * @returns A promise with the path of the output file
	 */
	public async exportConfig(outputPath?: string): Promise<string> {
		outputPath = outputPath || os.homedir();
		outputPath = path.resolve(outputPath, "docs_gm.json");
		const inputPath = path.resolve(__dirname, "../res/docs_gm.json");
		await fse.copy(inputPath, outputPath);
		return outputPath;
	}

	/**
	 * Loads the OutputConfig configuration object from a docs_gm.json file.
	 * You can provide a path to a json file to be loaded or to a GameMaker
	 * project directory. It returns null if the file does not exists, and fails the promise
	 * if the file is badly formated.
	 * @param jsonOrProjectPath The path to the JSON file or to the GameMaer project
	 * @returns A promise with the created OutputConfig object or null if the file does not exists
	 */
	public async loadConfig(jsonOrProjectPath: string = "."): Promise<IProjectConfig | undefined> {
		let jsonPath: string;
		let str: string;
		if (path.extname(jsonOrProjectPath) === "json") {
			jsonPath = path.resolve(jsonOrProjectPath);
		} else {
			jsonPath = path.resolve(jsonOrProjectPath, "datafiles/docs_gm.json");
		}
		try {
			str = await fse.readFile(jsonPath, "utf8");
		} catch (e) {
			return undefined;
		}
		const data = JSON5.parse(str);
		const config = new ProjectConfig();
		return Object.assign(config, data);
	}
}
