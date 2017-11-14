import * as fse from "fs-extra";
import * as path from "path";
import * as minimatch from "minimatch";

import GMS2Folder from "./GMS2Folder";
import GMS2Resource from "./GMS2Resource";
import GMS2Model from "./GMS2Model";
import GMS2Script from "./GMS2Script";
import { GMProject, GMProjectStatic } from "../GMInterfaces";
import { staticImplements } from "../_decorators/decorators";

/**
 * Represents a GameMaker Studio 2 Project
 */
@staticImplements<GMProjectStatic>()
export default class GMS2Project extends GMS2Model implements GMProject {

	
	/**
	 * The path of the GMS2 Project
	 */
	public path: string;

	/**
	 * Project's name
	 */
	public name: string;

	/** key: type, value: GMS2Resource[] **/
	private _resourcesByType: Map<string, GMS2Resource[]> = new Map();

	private _data: GMS2ProjectData;

	/** key: ResourceID, value: GMS2Resource **/
	private _resourcesById: Map<string, GMS2Resource> = new Map();

	private _topLevelFolders: Map<string, GMS2Folder> = new Map();

	/**
	 * Creates a new GMS2 Project
	 * @param data The JSON data of the project to load
	 * @param GMProjectPath The path of the GMS2 Project
	 */
	private constructor(data: GMS2ProjectData, GMProjectPath: string) {
		super(data);
		this.path = GMProjectPath;
		this._data = data;
		this.name = path.basename(path.resolve(this.path)); 
	}


	/**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
	static async loadProject(file: string): Promise<GMS2Project> {
		var string = await fse.readFile(file, "utf8");
		return new GMS2Project(JSON.parse(string), path.dirname(file));
	}

	/**
	 * Load all the files of the current project
	 * @return A promise with the current object for easy chaining
	 */
	public async load(): Promise<this> {
		await this._loadResources();
		for (var folder of this._topLevelFolders.values()) {
			folder.load();
		}
		return this;
	}

	/**
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
	public find(pattern: string, type: string = ""): GMS2Resource[] {
		var results: GMS2Resource[] = []
		var it = (type === "")
			? this._resourcesById.values()
			: this._resourcesByType.get(type);
		if (it) {
			for (var resource of it) {
				if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
					results.push(resource)
				}
			}
		}
		return results;
	}

	/**
	 * Prints the folder structure of the project in the console for debug
	 * @param spaces Number of spaces to use
	 */
	public print(spaces: number = 0) {
		for (var folder of this._topLevelFolders.values()) {
			folder.print(spaces);
		}
	}

	/**
	 * Find the top level resource folder with the given name
	 * @param name The name of the top level resource folder
	 */
	public getResourceFolder(name: string): GMS2Folder | undefined {
		return this._topLevelFolders.get(name);
	}

	/**
	 * Find the GMS2 Resource with the given id
	 * @param id The id to search for
	 */
	public getResourceById(id: string): GMS2Resource | undefined {
		return this._resourcesById.get(id);
	}

	/**
	 * Adds a GMS2Resource to the project
	 * @param resource The GMS2Resource to add
	 * @param type The resource type
	 */
	public addResource(resource: GMS2Resource, type: string) {
		if (this._resourcesByType.has(type)) {
			(this._resourcesByType.get(type) as GMS2Resource[]).push(resource);
		} else {
			this._resourcesByType.set(type, [resource]);
		}
		this._resourcesById.set(resource.id, resource);
	}

	/**
	 * Loads all the resources listed in the internal YOYO Model Data of the project
	 * @return A promise
	 */
	private async _loadResources():Promise<void> {
		if (!this._data) {
			throw "GMProject data is empty";
		}
		for (var resource of this._data.resources) {
			var file = path.resolve(this.path, resource.Value.resourcePath);
			var string = await fse.readFile(file, "utf8");
			var data: GMS2ResourceData = JSON.parse(string);
			var res = this._createFromData(data);
			res.id = resource.Key;
			var type = resource.Value.resourceType.split("GM").join("").toLowerCase();
			this.addResource(res, type);
			if (res instanceof GMS2Folder) {
				if (res.topLevelName !== "") {
					this._topLevelFolders.set(res.topLevelName, res);
				}
			}
		}
	}

	/**
	 * Creates a GMS2Resource from a YOYO model data
	 * @param modelData The YOYO model data to create the GMS2Resource from
	 */
	private _createFromData(modelData: GMS2ResourceData): GMS2Resource {
		switch (modelData.modelName) {
			case "GMFolder":
				return new GMS2Folder(modelData as GMS2FolderData, this);
			case "GMScript":
				return new GMS2Script(modelData as GMS2ScriptData, this);
			default:
				return new GMS2Resource(modelData, this);
		}
	}

}
