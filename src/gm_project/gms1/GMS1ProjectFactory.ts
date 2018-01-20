import * as fse from "fs-extra";
import * as path from "path";
import * as xml2js from "xml2js";

import GMFolder from "../common/GMFolder";
import GMProject from "../common/GMProject";
import IGMProject from "../interfaces/IGMProject";
import IGMProjectFactory from "../interfaces/IGMProjectFactory";
import GMS1Script from "./GMS1Script";
import { IGMS1DescriptorFolder, IGMS1DescriptorRoot } from "./IGMS1Descriptor";

/**
 * Loads a GMS1 project file and creates a GMS1Project
 */
export default class GMS1ProjectFactory implements IGMProjectFactory {

	/**
	 * The project file
	 */
	private readonly _file: string;

	/**
	 * The project to create
	 */
	private readonly _project: GMProject;

	/**
	 * Creates a new GMS1Project Factory
	 * @param file The project file
	 */
	constructor(file: string) {
		this._file = file;
		this._project = new GMProject(path.dirname(this._file));
	}

	/**
	 * Loads the specified GMS1 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the GMS1Project
	 */
	public async load(): Promise<IGMProject> {
		const str = await fse.readFile(this._file, "utf8");
		// "assets" is the root XML node of the document, but we call Root at the content of that node
		const data: { assets: IGMS1DescriptorRoot } = await this._xmlParse(str);

		const assets = data.assets;
		// Creates the root folder
		if (assets.scripts) {
			const scriptsFolder = this._createFolder(assets.scripts[0]);
			this._project.addTopLevelFolder(scriptsFolder);
		}

		return this._project;
	}

	/**
	 * Creates a folder and recursively builds all the
	 * folder subtree. (only implemented for Scripts and Scripts folders)
	 * @param root The root folder of the subtree
	 * @param folderData The folder data
	 */
	private _createFolder(folderData: IGMS1DescriptorFolder): GMFolder {
		const root = new GMFolder(folderData.$.name);
		for (const folder of folderData.scripts || []) {
			const resource = this._createFolder(folder); // Recursivity, baby! 8)
			root.addChild(resource);
		}

		for (const script of folderData.script || []) {
			const name = path.basename(script).split(".")[0];
			const resource = new GMS1Script(name);
			root.addChild(resource);
		}
		return root;
	}

	/**
	 * Parses an XML string and returns the parsed data
	 * @param string The XML string to parse
	 * @return A promise with the data parsed
	 */
	private _xmlParse(str: string): Promise<any> {
		return new Promise((accept) => {
			xml2js.parseString(str, (err, result) => {
				/* istambul ignore if */
				if (err) { throw err; }
				accept(result);
			});
		});
	}
}
