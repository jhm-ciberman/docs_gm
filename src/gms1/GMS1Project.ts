import * as fse from "fs-extra";
import * as minimatch from "minimatch";
import * as path from "path";
import * as xml2js from "xml2js";

import { IGMProject, ResourceType } from "../IGMInterfaces";
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
	 * Parses an XML string and returns the data parsed
	 * @param string The XML string to parse
	 * @return A promise with the data parsed
	 */
	private static _xmlParse(str: string): Promise<any> {
		return new Promise((accept) => {
			xml2js.parseString(str, (err, result) => {
				if (err) { throw err; }
				accept(result);
			});
		});
	}

	/**
	 * The path of the project
	 */
	public path: string;

	/**
	 * Project's name
	 */
	public name: string;

	/**
	 * Project *.yyz descriptor data
	 */
	private _descriptor: GMS1Descriptor.IRoot;

	/**
	 * A map with the top level folders. Key is the top level folder name, and the value is the folder.
	 */
	private _topLevelFolders: Map<string, GMS1Folder> = new Map();

	/** An array with all the resources in the resource tree */
	private _resources: GMS1Resource[] = [];

	/**
	 * A map with all the resources filtered by type
	 * Key is the resource type, and the value is an array with all the resource of that type.
	 */
	private _resourcesByType: Map<ResourceType, GMS1Resource[]> = new Map();

	/**
	 * @private
	 * Creates a new GMS1 Project
	 * @param data The data of the GMS1 Project
	 * @param GMProjectPath The path of the GMS1 Project
	 */
	private constructor(data: GMS1Descriptor.IRoot, gmProjectPath: string) {
		this._descriptor = data;
		this.path = gmProjectPath;
		this.name = path.basename(path.resolve(this.path));
	}

	/**
	 * Loads the project
	 * @return A promise with the current instance for easy chaining
	 */
	public async load(): Promise<this> {
		const scriptsFolder = new GMS1Folder(this._descriptor.scripts[0], this, null);
		await scriptsFolder.load();
		this._topLevelFolders.set("scripts", scriptsFolder);
		return this;
	}

	/**
	 * Adds a GMS2Resource to the project
	 * @param resource The GMS2Resource to add
	 * @param type The resource type
	 */
	public addResource(resource: GMS1Resource, type: ResourceType): void {
		if (this._resourcesByType.has(type)) {
			(this._resourcesByType.get(type) as GMS1Resource[]).push(resource);
		} else {
			this._resourcesByType.set(type, [resource]);
		}
		this._resources.push(resource);
	}

	/**
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
	public find(pattern: string, type?: ResourceType): GMS1Resource[] {
		const results: GMS1Resource[] = [];
		const it = (type === undefined)
			? this._resources.values()
			: this._resourcesByType.get(type);
		if (it) {
			for (const resource of it) {
				if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
					results.push(resource);
				}
			}
		}
		return results;
	}

}
