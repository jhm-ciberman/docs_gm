import * as path from "path";
import * as globby from "globby";
import * as fse from "fs-extra";
import * as os from "os";
import * as JSON5 from "json5";

import GMS1Project from "./gms1/GMS1Project";
import GMS2Project from "./gms2/GMS2Project";
import Reporter from "./Reporter";
import OutputConfig from "./doc_generator/OutputConfig";
import DocProject from "./docs_models/DocProject";
import Template from "./doc_generator/Template";
import ScriptParser from "./doc_generator/ScriptParser";

import { GMProject, GMScript } from "./GMInterfaces";

/**
 * Main Class of the docs_gm plugin
 */
export default class DocsGM {

	/**
	 * The reporter instance used to log all the information lines shown on the console.
	 * You can change it for your own reporte
	 */
	public static console: Reporter = new Reporter();

	/**
	 * Loads a specified GMS1 or GMS2 Project
	 * @param GMProjectPath The project path to load
	 * @return A promise with the loaded project
	 */
	static async loadProject(GMProjectPath: string = "."): Promise<GMProject> {

		var files = await globby(GMProjectPath + "/*.{yyp,gmx}");

		if (files.length === 0) {
			throw "Unrecognized GM project. No *.yyp or *.gmx file found";
		}

		var extArr = path.extname(files[0]).split(".");

		var ext = extArr[extArr.length - 1];

		switch (ext) {
			case "yyp":
				return GMS2Project.loadProject(files[0]);
			case "gmx":
				return GMS1Project.loadProject(files[0]);
			default:
				throw `Unrecognized project extension: "${ext}"`;
		}

	}

	/**
	 * Copy the docs_gm.json file to the specified outputPath.
	 * If no path is provided, the user directory is used. 
	 * @param outputPath The output filepath
	 * @returns A promise with the path of the output file
	 */
	static async exportConfig(outputPath?: string): Promise<string> {
		outputPath = outputPath || os.homedir();
		outputPath = path.resolve(outputPath, "docs_gm.json");
		var inputPath = path.resolve(__dirname, "../res/docs_gm.json");
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
	static async loadConfig(jsonOrProjectPath: string = "."): Promise<OutputConfig | undefined> {
		if (path.extname(jsonOrProjectPath) === "json") {
			var jsonPath = path.resolve(jsonOrProjectPath, "datafiles/docs_gm.json");
		} else {
			var jsonPath = path.resolve(jsonOrProjectPath);
		}
		try {
			var str = await fse.readFile(jsonPath, "utf8");
		} catch (e) {
			return undefined;
		}
		var data = JSON5.parse(str);
		var config = new OutputConfig();
		return Object.assign(config, data);
	}

	/**
 * Generates the documentation files for the project.
 * @return Promise with the path of the output folder
 */
	public static async generate(project: GMProject, config?: OutputConfig): Promise<string> {
		if (!config) {
			config = new OutputConfig();
		}

		var scripts = project.find(config.pattern, "script") as GMScript[];
		scripts.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});

		if (scripts.length == 0) {
			throw "No resources found";
		}

		var parser = new ScriptParser(config);
		var docProject = new DocProject();
		docProject.name = project.name;
		for (var script of scripts) {
			await script.load();
			var scrArr = parser.parseScript(script);
			docProject.scripts = docProject.scripts.concat(scrArr);
		}

		if (config.templatesFolder != "") {
			var folder = path.resolve(config.templatesFolder, config.template);
		} else {
			var folder = path.resolve(__dirname, "../templates/", config.template);
		}

		var template = await Template.loadFrom(folder);
		await template.generateDocs(docProject, config);

		return config.out;
	}

};