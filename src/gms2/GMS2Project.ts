import * as fse from "fs-extra";
import * as minimatch from "minimatch";
import * as path from "path";

import { staticImplements } from "../_decorators/decorators";
import { IGMProject, IGMProjectStatic } from "../GMInterfaces";
import * as GMS2Descriptor from "./GMS2Descriptor";
import GMS2Folder from "./GMS2Folder";
import GMS2Model from "./GMS2Model";
import GMS2Resource from "./GMS2Resource";
import GMS2Script from "./GMS2Script";

/**
 * Represents a GameMaker Studio 2 Project
 */
@staticImplements<IGMProjectStatic>()
export default class GMS2Project extends GMS2Model implements IGMProject {

	/**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
	public static async loadProject(file: string): Promise<GMS2Project> {
		const str = await fse.readFile(file, "utf8");
		return new GMS2Project(JSON.parse(str), path.dirname(file));
	}

	/**
	 * The path of the GMS2 Project
	 */
	public path: string;

	/**
	 * Project's name
	 */
	public name: string;

	/**
	 * A map with the resources sorted by type.
	 * The key is the resource type, and the value is an array with the resources of that type.
	 */
	private _resourcesByType: Map<string, GMS2Resource[]> = new Map();

	/**
	 * The project data descriptor
	 */
	private _data: GMS2Descriptor.IProject;

	/**
	 * A map with the resources sorted by id.
	 * The key is the resource model id, and the value is the resource itself.
	 */
	private _resourcesById: Map<string, GMS2Resource> = new Map();

	/**
	 * A map with the top level folders. The key is the name of that top level folder, and the value is the folder itself
	 */
	private _topLevelFolders: Map<string, GMS2Folder> = new Map();

	/**
	 * Creates a new GMS2 Project
	 * @param data The JSON data of the project to load
	 * @param GMProjectPath The path of the GMS2 Project
	 */
	private constructor(data: GMS2Descriptor.IProject, gmProjectPath: string) {
		super(data);
		this.path = gmProjectPath;
		this._data = data;
		this.name = path.basename(path.resolve(this.path));
	}

	/**
	 * Load all the files of the current project
	 * @return A promise with the current object for easy chaining
	 */
	public async load(): Promise<this> {
		await this._loadResources();
		for (const folder of this._topLevelFolders.values()) {
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
		const results: GMS2Resource[] = [];
		const it = (type === "")
			? this._resourcesById.values()
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

	/**
	 * Prints the folder structure of the project in the console for debug
	 * @param spaces Number of spaces to use
	 */
	public print(spaces: number = 0) {
		for (const folder of this._topLevelFolders.values()) {
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
	private async _loadResources(): Promise<void> {
		if (!this._data) {
			throw new Error("GMProject data is empty");
		}
		for (const resource of this._data.resources) {
			const file = path.resolve(this.path, resource.Value.resourcePath);
			const str = await fse.readFile(file, "utf8");
			const data: GMS2Descriptor.IResource = JSON.parse(str);
			const res = this._createFromData(data);
			res.id = resource.Key;
			const type = resource.Value.resourceType.split("GM").join("").toLowerCase();
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
	private _createFromData(modelData: GMS2Descriptor.IResource): GMS2Resource {
		switch (modelData.modelName) {
			case "GMFolder":
				return new GMS2Folder(modelData as GMS2Descriptor.IFolder, this);
			case "GMScript":
				return new GMS2Script(modelData as GMS2Descriptor.IScript, this);
			default:
				return new GMS2Resource(modelData, this);
		}
	}

}
