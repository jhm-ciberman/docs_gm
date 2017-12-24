import * as fse from "fs-extra";
import * as minimatch from "minimatch";
import * as path from "path";

import { ResourceType } from "../IGMInterfaces";
import GMS2Folder from "./GMS2Folder";
import GMS2Resource from "./GMS2Resource";
import GMS2Script from "./GMS2Script";
import { IFolder, IProject, IResource, IScript } from "./IGMS2Descriptor";
import { GMS2ResourceType } from "./IGMS2Descriptor";
import IGMS2Project from "./IGMS2Project";

/**
 * Represents a GameMaker Studio 2 Project
 */
export default class GMS2Project implements IGMS2Project {

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
	private _resourcesByType: Map<ResourceType, GMS2Resource[]> = new Map();

	/**
	 * The project data descriptor
	 */
	private _data: IProject;

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
	private constructor(data: IProject, gmProjectPath: string) {
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
		return this;
	}

	/**
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
	public find(pattern: string, type?: ResourceType): GMS2Resource[] {
		const results: GMS2Resource[] = [];
		const it = (type === undefined)
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
	public addResource(resource: GMS2Resource, type: ResourceType) {
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
			const data: IResource = JSON.parse(str);
			const res = this._createFromData(data);
			res.id = resource.Key;
			let type: ResourceType;
			switch (resource.Value.resourceType) {
				case GMS2ResourceType.GMFolder:
					type = ResourceType.Folder;
					break;
				case GMS2ResourceType.GMScript:
					type = ResourceType.Script;
					break;
				default:
					type = ResourceType.Unknown;
			}
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
	private _createFromData(modelData: IResource): GMS2Resource {
		switch (modelData.modelName) {
			case GMS2ResourceType.GMFolder:
				return new GMS2Folder(modelData as IFolder);
			case GMS2ResourceType.GMScript:
				return new GMS2Script(modelData as IScript);
			default:
				return new GMS2Resource(modelData);
		}
	}

}
