import GMFolder from "../GMFolder";
import GMProject from "../GMProject";
import GMResource from "../GMResource";
import IGMFolder from "../interfaces/IGMFolder";
import IGMProject from "../interfaces/IGMProject";
import IGMResource from "../interfaces/IGMResource";
import GMS2Script from "./GMS2Script";

/**
 * Factory class to create GMS2Project instances
 */
export default class GMS2ProjectFactory {

	/**
	 * The created GMProject
	 */
	private _project: IGMProject;

	/**
	 * A map with each GMFolder, and an array with the children key ids of each folder
	 */
	private _folderChildrenKeys: Map<IGMFolder, string[]> = new Map();

	/**
	 * A map with the key ids and the associated resource
	 */
	private _resourcesByKey: Map<string, GMResource> = new Map();

	/**
	 * Creates an instance of GMS2ProjectFactory.
	 * @param {string} gmProjectFolder The project folder
	 * @memberof GMS2ProjectFactory
	 */
	public constructor(gmProjectFolder: string) {
		this._project = new GMProject(gmProjectFolder);
	}

	/**
	 * Builds the GMS2Project instance and returns it
	 */
	public build() {
		for (const folder of this._project.children) {
			this._buildSubtree(folder);
		}
		return this._project;
	}

	/**
	 * Adds a new GMS2Folder to the project
	 *
	 * @param {string} key The resource key id
	 * @param {string} folderName The folder name
	 * @param {string} localizedFolderName The localizedFolderName
	 * @param {string[]} children An array with the children keys id of the folder
	 * @memberof GMS2ProjectFactory
	 */
	public addFolder(key: string, folderName: string, localizedFolderName: string, children: string[]): void {
		const topLevelName = localizedFolderName.split("ResourceTree_").join("");
		const folder = new GMFolder(folderName);
		this._folderChildrenKeys.set(folder, children);
		if (topLevelName !== "") {
			this._project.addChild(folder);
		}
		this._resourcesByKey.set(key, folder);
	}

	/**
	 * Adds a new GMS2Script
	 *
	 * @param {string} key The resource key id
	 * @param {string} name The script name
	 * @param {boolean} isCompatibility Is a compatibility script?
	 * @memberof GMS2ProjectFactory
	 */
	public addScript(key: string, name: string, isCompatibility: boolean): void {
		const script = new GMS2Script(name, isCompatibility);
		this._resourcesByKey.set(key, script);
	}

	/**
	 * Adds a new Resource to the GMS2Project
	 * @param key The resource key id
	 * @param name The resource name
	 */
	public addResource(key: string, name: string) {
		const res = new GMResource(name);
		this._resourcesByKey.set(key, res);
	}

	/**
	 * Build subtree for the specified folder
	 * @param folder The folder to find the children
	 */
	private _buildSubtree(folder: IGMFolder) {
		const children = this._folderChildrenKeys.get(folder) as string[];
		for (const childKey of children) {
			const child = this._resourcesByKey.get(childKey);
			if (child) {
				folder.addChild(child);
				if (this._isFolder(child)) {
					this._buildSubtree(child);
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
}
