import * as fse from "fs-extra";
import { getInstalledPath } from "get-installed-path";
import * as globby from "globby";
import * as JSON5 from "json5";
import * as os from "os";
import * as path from "path";

import Template from "./doc_generator/Template";
import DocProject from "./docs_models/DocProject";
import GMS1Project from "./gms1/GMS1Project";
import GMS2Project from "./gms2/GMS2Project";
import OutputConfig from "./parser/OutputConfig";
import ScriptParser from "./parser/ScriptParser";

import { IGMProject, IGMScript } from "./IGMInterfaces";

/**
 * Main Class of the docs_gm plugin
 */
export default class DocsGM {

	/**
	 * Used for dependency injection
	 */
	public static depend = {
		getInstalledPath,
	};

	/**
	 * Loads a specified GMS1 or GMS2 Project
	 * @param GMProjectPath The project path to load
	 * @return A promise with the loaded project
	 */
	public static async loadProject(gmProjectPath: string = "."): Promise<IGMProject> {

		const files = await globby(gmProjectPath + "/*.{yyp,gmx}");

		if (files.length === 0) {
			throw new Error("Unrecognized GM project. No *.yyp or *.gmx file found");
		}

		const extArr = path.extname(files[0]).split(".");

		const ext = extArr[extArr.length - 1];

		switch (ext) {
			case "yyp":
				return GMS2Project.loadProject(files[0]);
			case "gmx":
				return GMS1Project.loadProject(files[0]);
			default:
				throw new Error(`Unrecognized project extension: "${ext}"`);
		}

	}

	/**
	 * Copy the docs_gm.json file to the specified outputPath.
	 * If no path is provided, the user directory is used.
	 * @param outputPath The output filepath
	 * @returns A promise with the path of the output file
	 */
	public static async exportConfig(outputPath?: string): Promise<string> {
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
	public static async loadConfig(jsonOrProjectPath: string = "."): Promise<OutputConfig | undefined> {
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
		const config = new OutputConfig();
		return Object.assign(config, data);
	}

	/**
	 * Generates the documentation files for the project.
	 * @return Promise with the path of the output folder
	 */
	public static async generate(project: IGMProject, config?: OutputConfig): Promise<string> {
		config = config || new OutputConfig();

		const docProject = await this._generateDocProject(project, config);

		const moduleName = "docs_gm-" + config.template;
		const folder = await this._getModulePath(moduleName, config.templatesFolder);
		const template = await Template.loadFrom(folder);
		if (config.design && !template.hasDesign(config.design)) {
			throw new Error(`Design "${ config.design }" not found`);
		}

		const design = template.getDesign(config.design);

		await design.renderPages(config.out, docProject);
		await design.copyFiles(config.out);

		return config.out;
	}

	/**
	 * Gets the path of a module from a global instalation, local instalation or custom folder (in that order of priority)
	 * @param moduleName The name of the module to load
	 * @param folder The folder to look for the module if the module is not located in global or local node_modules
	 */
	private static async _getModulePath(moduleName: string, folder: string): Promise<string> {
		try {
			return await this.depend.getInstalledPath(moduleName);
		} catch (e) {
			try {
				return await this.depend.getInstalledPath(moduleName, { local: true, cwd: __dirname + "./../" });
			} catch (e) {
				return path.resolve(folder, moduleName);
			}
		}
	}

	/**
	 * Generates a DocProject filled with all the documentable resources of the given project (following the OutputConfig)
	 * @param project The GM Project
	 * @param config The OutputConfig
	 */
	private static async _generateDocProject(project: IGMProject, config: OutputConfig): Promise<DocProject> {
		const scripts = project.find(config.pattern)
			.filter((res) => ((res as IGMScript).subScripts !== undefined))
			.sort((a, b) => a.name.localeCompare(b.name)) as IGMScript[];

		if (scripts.length === 0) {
			throw new Error("No resources found");
		}

		const parser = new ScriptParser(config);
		const docProject = new DocProject();
		docProject.name = project.name;
		for (const script of scripts) {
			const pathStr = path.resolve(project.path, script.filepath);
			const str = await fse.readFile(pathStr, "utf8");
			script.loadFromString(str);
			const scrArr = parser.parseScript(script);
			docProject.scripts = docProject.scripts.concat(scrArr);
		}

		return docProject;
	}
}
