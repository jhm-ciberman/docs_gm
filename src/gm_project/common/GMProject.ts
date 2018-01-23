import * as minimatch from "minimatch";
import * as path from "path";

import IGMFolder from "../interfaces/IGMFolder";
import IGMProject from "../interfaces/IGMProject";
import IGMResource from "../interfaces/IGMResource";
import GMFolder from "./GMFolder";

/**
 * Represents a GameMaker Project.
 */
export default class GMProject extends GMFolder implements IGMProject {

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
	protected _children: IGMFolder[] = [];

	/**
	 * Creates a new GMS1 Project
	 * @param gmProjectFolder The folder of the GM project
	 */
	public constructor(gmProjectFolder: string) {
		super("");
		this.path = gmProjectFolder;
		this.name = path.basename(path.resolve(gmProjectFolder));
	}

	/**
	 * Returns an array of the resources that match certain glob pattern
	 * @param pattern The glob pattern to use to find files
	 */
	public find(pattern: string): IGMResource[] {
		// TODO: optimize this ineficient recursive way
		return this.getSubtreeLeafs().filter ((res) => {
			return minimatch(res.fullpath, pattern, { matchBase: true });
		});
	}

	/**
	 * Gets the top level folders of the project
	 */
	public get children(): IterableIterator<IGMFolder> {
		return this._children[Symbol.iterator]();
	}

	/**
	 * Adds a top level folder to the project
	 * @param child The folder to add
	 */
	public addChild(child: IGMFolder) {
		this._children.push(child);
	}
}
