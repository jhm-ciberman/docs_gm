import * as minimatch from "minimatch";
import * as path from "path";

import IGMFolder from "../interfaces/IGMFolder";
import IGMProject from "../interfaces/IGMProject";
import IGMResource from "../interfaces/IGMResource";

/**
 * Represents a GameMaker Project.
 */
export default class GMProject implements IGMProject {

	/**
	 * The path of the project
	 */
	public readonly path: string;

	/**
	 * Project's name
	 */
	public readonly name: string;

	/**
	 * An array with the project's top level folders. (Example: "objects", "scripts", "sprites", "rooms")
	 */
	private _topLevelFolders: IGMFolder[] = [];

	/**
	 * An array with all the resources in the resource tree
	 */
	private _resources: IGMResource[] = [];

	/**
	 * @private
	 * Creates a new GMS1 Project
	 * @param data The data of the GMS1 Project
	 * @param GMProjectPath The path of the GMS1 Project
	 */
	public constructor(gmProjectPath: string) {
		this.path = gmProjectPath;
		this.name = path.basename(path.resolve(this.path));
	}

	/**
	 * Search all the resources that match certain pattern
	 * @param pattern The glob pattern to use to find files
	 * @param type The optional resource type
	 * @returns An array with the GMS2Resources found
	 */
	public find(pattern: string): IGMResource[] {
		const results: IGMResource[] = [];
		for (const resource of this._resources) {
			if (minimatch(resource.fullpath, pattern, { matchBase: true })) {
				results.push(resource);
			}
		}
		return results;
	}

	/**
	 * Adds a top level folder to the project
	 * @param folder The folder
	 */
	public addTopLevelFolder(folder: IGMFolder) {
		this._topLevelFolders.push(folder);
	}

	/**
	 * Returns an iterator for the top level folders
	 */
	get topLevelFolders() {
		return this._topLevelFolders[Symbol.iterator]();
	}

}
