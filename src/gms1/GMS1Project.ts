import * as fse from "fs-extra";
import * as minimatch from "minimatch";
import * as path from "path";
import * as xml2js from "xml2js";
import { IFolder } from "./GMS1Descriptor";
import GMS1Script from "./GMS1Script";

import { IGMProject } from "../IGMInterfaces";
import * as GMS1Descriptor from "./GMS1Descriptor";
import GMS1Folder from "./GMS1Folder";
import GMS1Resource from "./GMS1Resource";

/**
 * Represents a GMS1 Project. The object should be created
 * ussing the factory static method loadProject.
 */
export default class GMS1Project implements IGMProject {

	/**
	 * Loads the specified GMS1 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the GMS1Project
	 */
	public static async loadProject(file: string): Promise<GMS1Project> {
		const str = await fse.readFile(file, "utf8");
		// "assets" is the root XML node of the document, but we call Root at the content of that node
		const data: { assets: GMS1Descriptor.IRoot } = await GMS1Project._xmlParse(str);
		return new GMS1Project(data.assets, path.dirname(file));
	}

	/**
	 * Parses an XML string and returns the parsed data
	 * @param string The XML string to parse
	 * @return A promise with the data parsed
	 */
	private static _xmlParse(str: string): Promise<any> {
		return new Promise((accept) => {
			xml2js.parseString(str, (err, result) => {
				/* istambul ignore if */
				if (err) { throw err; }
				accept(result);
			});
		});
	}

	/**
	 * The path of the project
	 */
	private _path: string;

	/**
	 * Project's name
	 */
	private _name: string;

	/**
	 * The path of the GMS1 Project
	 */
	get path() {
		return this._path;
	}

	/**
	 * Project's name
	 */
	get name() {
		return this._name;
	}

	/**
	 * Project *.yyz descriptor data
	 */
	private _descriptor: GMS1Descriptor.IRoot;

	/**
	 * A map with the top level folders. Key is the top level folder name, and the value is the folder.
	 */
	private _topLevelFolders: Map<string, GMS1Folder> = new Map();

	/**
	 * An array with all the resources in the resource tree
	 */
	private _resources: GMS1Resource[] = [];

	/**
	 * @private
	 * Creates a new GMS1 Project
	 * @param data The data of the GMS1 Project
	 * @param GMProjectPath The path of the GMS1 Project
	 */
	private constructor(data: GMS1Descriptor.IRoot, gmProjectPath: string) {
		this._descriptor = data;
		this._path = gmProjectPath;
		this._name = path.basename(path.resolve(this._path));

		// Creates the root folder
		if (this._descriptor.scripts) {
			const scriptsFolder = this._createFolder(this._descriptor.scripts[0], null);
			this._topLevelFolders.set("scripts", scriptsFolder); // Unused
		}
	}

	/**
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
	public find(pattern: string): GMS1Resource[] {
		const results: GMS1Resource[] = [];
		for (const resource of this._resources.values()) {
			if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
				results.push(resource);
			}
		}
		return results;
	}

	/**
	 * Creates a folder and recursively builds all the
	 * folder subtree. (only implemented for Scripts and Scripts folders)
	 * @param root The root folder of the subtree
	 * @param folderData The folder data
	 */
	private _createFolder(folderData: IFolder, parent: GMS1Folder | null): GMS1Folder {
		const root = new GMS1Folder(folderData.$.name, parent);
		for (const folder of folderData.scripts || []) {
			const resource = this._createFolder(folder, root); // Recursivity, baby! 8)
			this._resources.push(resource);
			root.children.push(resource);
		}

		for (const script of folderData.script || []) {
			const name = path.basename(script).split(".")[0];
			const resource = new GMS1Script(name, root);
			this._resources.push(resource);
			root.children.push(resource);
		}
		return root;
	}

}
