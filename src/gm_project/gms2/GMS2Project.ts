import * as fse from "fs-extra";
import * as minimatch from "minimatch";
import * as path from "path";

import {GMS2Folder} from "./GMS2Folder";
import GMS2Resource from "./GMS2Resource";
import { GMS2ResourceType } from "./GMS2ResourceType";
import GMS2Script from "./GMS2Script";

import IGMProject from "../interfaces/IGMProject";
import IGetResourceByKey from "./IGetResourceByKey";
import { IFolder, IProject, IResource, IResourceInfo, IScript } from "./IGMS2Descriptor";

/**
 * Represents a GameMaker Studio 2 Project
 */
export default class GMS2Project implements IGMProject, IGetResourceByKey {

	/**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
	public static async loadProject(file: string): Promise<GMS2Project> {
		const str = await fse.readFile(file, "utf8");
		const p = new GMS2Project(JSON.parse(str), path.dirname(file));
		return p._load();
	}

	/**
	 * The project path
	 */
	private _path: string;

	/**
	 * The project name
	 */
	private _name: string;

	/**
	 * A map with the resources by key.
	 */
	private _resourcesByKey: Map<string, GMS2Resource> = new Map();

	/**
	 * A map with the resource info needed to load the resource from disk.
	 */
	private _resourcesInfo: Map<string, IResourceInfo> = new Map();

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
		this._path = gmProjectPath;
		this._name = path.basename(path.resolve(this.path));

		for (const item of data.resources) {
			this._resourcesInfo.set(item.Key, item.Value);
		}
	}

	/**
	 * The path of the GMS2 Project
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
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
	public find(pattern: string): GMS2Resource[] {
		const results: GMS2Resource[] = [];
		for (const resource of this._resourcesByKey.values()) {
			if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
				results.push(resource);
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
	 * @param key The key to search for
	 */
	public getResourceByKey(key: string): GMS2Resource | undefined {
		return this._resourcesByKey.get(key);
	}

	/**
	 * Load a resource JSON data from a file
	 * @param filename The relative path to load the data from
	 */
	private async _loadResourceData(filename: string): Promise<IResource> {
		const file = path.resolve(this.path, filename);
		const str = await fse.readFile(file, "utf8");
		return JSON.parse(str);
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

	/**
	 * Load all the files of the current project
	 * @return A promise with the current object for easy chaining
	 */
	private async _load(): Promise<this> {
		for (const [key, resource] of this._resourcesInfo.entries()) {
			const data = await this._loadResourceData(resource.resourcePath);
			const res = this._createFromData(data);
			this._resourcesByKey.set(key, res);
			if (res instanceof GMS2Folder && res.topLevelName !== "") {
				this._topLevelFolders.set(res.topLevelName, res);
			}
		}
		for (const folder of this._topLevelFolders.values()) {
			folder.buildSubtree(this);
		}
		return this;
	}

}
