import * as fse from "fs-extra";
import * as path from "path";

import GMFolder from "../common/GMFolder";
import GMProject from "../common/GMProject";
import GMResource from "../common/GMResource";
import IGMFolder from "../interfaces/IGMFolder";
import IGMProject from "../interfaces/IGMProject";
import IGMProjectFactory from "../interfaces/IGMProjectFactory";
import IGMResource from "../interfaces/IGMResource";
import GMS2ResourceType from "./GMS2ResourceType";
import GMS2Script from "./GMS2Script";
import { IFolder, IProject, IResource, IResourceInfo, IScript } from "./IGMS2Descriptor";

/**
 * Creates a new GameMakerStudio 2 Project Factory that loads a project
 * file and creates a new GMProject
 */
export default class GMS2ProjectFactory implements IGMProjectFactory {

	/**
	 * A map with each key is the GMS2 parent folder and each value is an
	 * array with the keys of the childrens of that folder.
	 */
	private _folderChildsKeys: Map<IGMFolder, string[]> = new Map();

	/**
	 * A map with the resources by key.
	 */
	private _resourcesByKey: Map<string, GMResource> = new Map();

	/**
	 * The project file
	 */
	private readonly _file: string;

	/**
	 * The GMS2Project to create
	 */
	private readonly _project: IGMProject;

	/**
	 * Creates GMS2ProjectFactory
	 * @param file The project file
	 */
	constructor(file: string) {
		this._file = file;
		this._project = new GMProject(path.dirname(this._file));
	}

	/**
	 * Loads the specified GMS2 project
	 * @param file The file path of the project to load
	 * @returns A Promise with the created GMS2Project
	 */
	public async load(): Promise<IGMProject> {
		const str = await fse.readFile(this._file, "utf8");
		const data: IProject = JSON.parse(str);

		for (const item of data.resources) {
			await this._addResource(item.Key, item.Value);
		}
		for (const folder of this._project.children) {
			this._buildSubTree(folder);
		}
		return this._project;
	}

	/**
	 * Build subtre for the specified folder
	 * @param folder The folder to find the childrens
	 */
	private _buildSubTree(folder: IGMFolder) {
		const children = this._folderChildsKeys.get(folder) as string[];
		for (const childKey of children) {
			const child = this._resourcesByKey.get(childKey);
			if (child) {
				folder.addChild(child);
				if (this._isFolder(child)) {
					this._buildSubTree(child);
				}
			}
		}
	}

	/**
	 * Determines if the resource is a folder (ducktyping)
	 * @param res The resource
	 */
	private _isFolder(res: IGMResource): res is IGMFolder {
		return ("addChild" in res);
	}

	/**
	 * Adds and loads a resource
	 * @param key Resource Key
	 * @param resource ResourceInfo
	 */
	private async _addResource(key: string, resource: IResourceInfo) {
		const data = await this._loadResourceData(resource.resourcePath);
		const res = this._createFromData(data);
		this._resourcesByKey.set(key, res);
	}

	/**
	 * Creates a GMS2Resource from a YOYO model data
	 * @param modelData The YOYO model data to create the GMS2Resource from
	 */
	private _createFromData(modelData: IResource): GMResource {
		switch (modelData.modelName) {
			case GMS2ResourceType.GMFolder:
				return this._createFolder(modelData as IFolder);
			case GMS2ResourceType.GMScript:
				return this._createScript(modelData as IScript);
			default:
				return new GMResource(modelData.name);
		}
	}

	/**
	 * Load a resource JSON data from a file
	 * @param filename The relative path to load the data from
	 */
	private async _loadResourceData(filename: string): Promise<IResource> {
		const file = path.resolve(this._project.path, filename);
		const str = await fse.readFile(file, "utf8");
		return JSON.parse(str);
	}

	/**
	 * Creates a new GMS2Folder
	 * @param data The folder data
	 */
	private _createFolder(data: IFolder): GMFolder {
		const topLevelName = data.localisedFolderName.split("ResourceTree_").join("");
		const folder = new GMFolder(data.folderName);
		this._folderChildsKeys.set(folder, data.children);
		if (topLevelName !== "") {
			this._project.addChild(folder);
		}
		return folder;
	}

	/**
	 * Creates a new GMS2Script
	 * @param data The Script data
	 */
	private _createScript(data: IScript): GMS2Script {
		const script = new GMS2Script(data.name);
		script.isCompatibility = data.IsCompatibility;
		return script;
	}
}
